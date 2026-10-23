-- ============================================================
-- 20261010000004_create_order
-- Server-side order creation.
--
-- BEFORE APPLYING
--   Confirm public.orders / public.order_items / public.listings /
--   public.cart_items exist with the columns referenced below (inspection
--   queries). The exact column names are taken from services/orders.ts and the
--   current app; verify against the live schema before running.
--
-- COMPATIBILITY / ORDERING
--   Apply this AFTER the mobile build that calls the RPC is deployed (or
--   deploy together). The new `orders_require_rpc` / `order_items_require_rpc`
--   triggers BLOCK direct inserts, so any old client still doing
--   `from("orders").insert(...)` will fail with 42501.
--
-- THREAT MODEL ADDRESSED
--   * Price tampering      — prices, titles, images and totals are read from
--                            public.listings inside the function; the client
--                            only sends listing ids.
--   * Unauthorized create  — auth.uid() is required; execute is granted to
--                            authenticated only.
--   * Duplicate requests   — optional idempotency key + partial unique index;
--                            a repeated call returns the original order.
--   * Concurrent checkout  — `for share` row locks freeze listing prices for
--                            the transaction. NOTE: two concurrent checkouts
--                            of the same listing can still both succeed
--                            (no inventory is reserved) — see NOTES below.
--   * Price changes        — snapshot is taken under lock, so the stored
--                            order_items.price cannot drift from the total.
--
-- SAFETY
--   No existing RLS policy is dropped. Direct-insert access is revoked with a
--   trigger, not by removing policies, so the permissive "orders insert own" /
--   "order_items insert own" policies (if present) become inert but remain
--   until you remove them manually (see MANUAL REVIEW).
-- ============================================================

-- ---------- idempotency support (additive) ----------
alter table public.orders add column if not exists idempotency_key text;

create unique index if not exists orders_user_idempotency_key_idx
  on public.orders (user_id, idempotency_key)
  where idempotency_key is not null;

-- ---------- guard: only the RPC may insert ----------
create or replace function public.enforce_order_server_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- The create_order RPC sets this transaction-local GUC before inserting.
  -- PostgREST clients cannot set an arbitrary GUC, so a direct
  -- from("orders").insert(...) / from("order_items").insert(...) is rejected.
  if coalesce(current_setting('app.creating_order', true), '') <> 'on' then
    raise exception 'Orders must be created via public.create_order()'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists orders_require_rpc on public.orders;
create trigger orders_require_rpc
  before insert on public.orders
  for each row execute function public.enforce_order_server_insert();

drop trigger if exists order_items_require_rpc on public.order_items;
create trigger order_items_require_rpc
  before insert on public.order_items
  for each row execute function public.enforce_order_server_insert();

-- ---------- the RPC ----------
create or replace function public.create_order(
  p_items jsonb,
  p_payment_method text,
  p_phone text default null,
  p_clear_cart boolean default false,
  p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_ids uuid[];
  v_order_id uuid;
  v_total numeric(12, 2);
  v_count integer;
  v_existing public.orders%rowtype;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty' using errcode = '22023';
  end if;

  -- fast path: already created for this key
  if p_idempotency_key is not null then
    select * into v_existing
    from public.orders
    where user_id = v_user_id and idempotency_key = p_idempotency_key
    limit 1;

    if found then
      return jsonb_build_object(
        'id', v_existing.id,
        'total', v_existing.total,
        'status', v_existing.status
      );
    end if;
  end if;

  -- extract + validate listing ids (deduplicated)
  begin
    select array_agg(distinct (value ->> 'listing_id')::uuid)
      into v_ids
    from jsonb_array_elements(p_items);
  exception when others then
    raise exception 'Invalid item payload' using errcode = '22023';
  end;

  if v_ids is null or array_length(v_ids, 1) is null or array_length(v_ids, 1) = 0 then
    raise exception 'Cart is empty' using errcode = '22023';
  end if;

  -- freeze rows so a concurrent price UPDATE blocks until we commit
  perform 1
  from public.listings
  where id = any (v_ids) and is_available = true
  for share;

  select count(*), coalesce(sum(price), 0)
    into v_count, v_total
  from public.listings
  where id = any (v_ids) and is_available = true;

  if v_count <> array_length(v_ids, 1) then
    raise exception 'One or more listings are unavailable' using errcode = '22023';
  end if;

  -- unlock the insert trigger for THIS transaction only
  perform set_config('app.creating_order', 'on', true);

  begin
    insert into public.orders
      (user_id, total, status, payment_method, phone_number, idempotency_key)
    values
      (v_user_id, v_total, 'pending', p_payment_method, p_phone, p_idempotency_key)
    returning id into v_order_id;

    insert into public.order_items (order_id, listing_id, price, title, image_url)
    select
      v_order_id,
      l.id,
      l.price,
      l.title,
      case
        when l.images is not null and array_length(l.images, 1) >= 1 then l.images[1]
        else null
      end
    from public.listings l
    where l.id = any (v_ids) and l.is_available = true;
  exception when unique_violation then
    -- concurrent request with the same key won the race; return its order
    select * into v_existing
    from public.orders
    where user_id = v_user_id and idempotency_key = p_idempotency_key
    limit 1;

    if found then
      return jsonb_build_object(
        'id', v_existing.id,
        'total', v_existing.total,
        'status', v_existing.status
      );
    end if;

    raise;
  end;

  if p_clear_cart then
    delete from public.cart_items where user_id = v_user_id;
  end if;

  return jsonb_build_object(
    'id', v_order_id,
    'total', v_total,
    'status', 'pending'
  );
end;
$$;

revoke all on function public.create_order(jsonb, text, text, boolean, text) from public, anon;
grant execute on function public.create_order(jsonb, text, text, boolean, text) to authenticated;

-- ------------------------------------------------------------
-- NOTES / FOLLOW-UPS (not applied here)
-- 1. Oversell: nothing flips listings.is_available, so two buyers can order
--    the same single item. If you want to reserve inventory, add after the
--    order_items insert:
--       update public.listings set is_available = false
--       where id = any (v_ids);
--    (and decide how cancellations restore availability).
-- 2. Direct-insert policies: once the RPC is proven in production you can drop
--    the now-inert policies. Deliberately NOT done automatically:
--       drop policy if exists "orders insert own" on public.orders;
--       drop policy if exists "order_items insert own" on public.order_items;
-- 3. This function assumes the RPC owner (table owner) bypasses RLS. Do NOT
--    `alter table ... force row level security`, which would apply RLS to the
--    definer and break inserts. Grant execute only to authenticated.
-- ------------------------------------------------------------

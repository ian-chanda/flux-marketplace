# Flux Marketplace - Backend Setup Guide

## Current State

Your app is a **front-end-only Expo React Native marketplace UI**. All data is hardcoded
mock data (products, messages, notifications, listings, reviews, addresses).

Your `contexts/auth-context.tsx` already has Supabase auth logic written, but it imports
from `@/lib/supabase` which **does not exist yet**. The auth context is also **not wired
into the root layout** — `app/_layout.tsx` only wraps with `ThemeProvider`, not `AuthProvider`.

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/log in
2. Click **"New Project"**
3. Choose a project name (e.g. `flux-marketplace`), set a strong database password, pick a region close to your users
4. Wait for the project to spin up (takes ~1 minute)

Once created, go to **Settings > API** in the Supabase dashboard. You'll need:
- **Project URL** (looks like `https://xxxxxxxx.supabase.co`)
- **Anon key** (public, safe for client-side)
- **Service Role key** (SECRET — never put in client code, only for admin/migrations)

---

## Step 2: Install Supabase Packages

```bash
npx expo install @supabase/supabase-js expo-crypto expo-secure-store
```

Why each:
- `@supabase/supabase-js` — the Supabase client
- `expo-crypto` — required by supabase-js on Expo (polyfill for `crypto` module)
- `expo-secure-store` — used to securely persist the auth token on device (Supabase recommends this over AsyncStorage for tokens)

---

## Step 3: Create `lib/supabase.ts`

Create the file `lib/supabase.ts` — this is what `auth-context.tsx` is importing:

```typescript
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Expo SecureStore for auth tokens (more secure than AsyncStorage)
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

You also need the URL polyfill:
```bash
npx expo install react-native-url-polyfill
```

---

## Step 4: Create `.env` File

Create `.env` in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**IMPORTANT:** Add `.env` to your `.gitignore` immediately. Supabase anon keys are public
but you still don't want them committed in plaintext. Never put the **service role key** here.

---

## Step 5: Wire `AuthProvider` Into Root Layout

Your `app/_layout.tsx` currently does NOT wrap with `AuthProvider`. Edit it:

```tsx
import { ThemeProvider } from '@/contexts/theme-context';
import { AuthProvider } from '@/contexts/auth-context';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* ... your existing screens ... */}
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
```

---

## Step 6: Enable Email Auth in Supabase Dashboard

1. Go to **Authentication > Providers** in the Supabase dashboard
2. Ensure **Email** provider is enabled
3. Under Email settings, you can toggle "Confirm email" on or off for dev
   - **Off** = users can sign up and log in immediately (faster for dev)
   - **On** = users get a confirmation email (production-ready)

---

## Step 7: Design Your Database Schema

For a marketplace like Flux, you'll need at minimum these tables:

```sql
-- Users (extends Supabase auth.users automatically via profiles)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_manager BOOLEAN DEFAULT FALSE,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Product Listings
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  condition TEXT,
  images TEXT[], -- array of image URLs
  location TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages / Conversations
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  listing_id UUID REFERENCES listings(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases / Transactions
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  listing_id UUID REFERENCES listings(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved / Wishlist
CREATE TABLE saved_listings (
  user_id UUID REFERENCES profiles(id) NOT NULL,
  listing_id UUID REFERENCES listings(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);
```

---

## Step 8: Run Migrations

You have two options:

### Option A: Supabase SQL Editor (Quick & Easy)
1. Go to **SQL Editor** in the Supabase dashboard
2. Paste the SQL from Step 7
3. Click **Run**

### Option B: Supabase CLI (Proper Migrations — Recommended)
```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Initialize in your project
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Create a migration
supabase migration new create_tables

# Paste your SQL into the generated file, then push:
supabase db push
```

---

## Step 9: Set Up Row Level Security (RLS)

**CRITICAL:** Without RLS, any authenticated user can read/write ALL rows in every table.
Enable RLS on every table and add policies:

```sql
-- Listings: anyone can read, only owner can update/delete
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings are viewable by everyone"
  ON listings FOR SELECT USING (true);

CREATE POLICY "Users can insert their own listings"
  ON listings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON listings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
  ON listings FOR DELETE USING (auth.uid() = user_id);

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Messages: only participants can see them
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
    )
  );

-- Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Purchases
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = buyer_id);

-- Saved listings
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own saved listings"
  ON saved_listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save listings"
  ON saved_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave listings"
  ON saved_listings FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Step 10: Storage (for Images)

For product images and avatars:

1. Go to **Storage** in the Supabase dashboard
2. Create a bucket called `avatars` (public)
3. Create a bucket called `listings` (public)

```sql
-- Allow anyone to view images
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Listing images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listings');

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can upload listing images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listings'
    AND auth.role() = 'authenticated'
  );
```

---

## Pitfalls & Gotchas

### 1. ExpoSecureStore has a 2KB value limit
`expo-secure-store` can only store values up to 2048 bytes. Supabase sessions are small
enough (~500 bytes), so this is fine for auth. If you try to store larger data in SecureStore
it will silently fail.

### 2. Do NOT use the Service Role key in client code
The service role key bypasses ALL RLS. If it leaks, anyone can do anything to your database.
Only use it in server-side code or migrations.

### 3. Email confirmation can trap you during dev
If you enable email confirmation and don't configure an SMTP provider, the confirmation
emails will fail silently and your users won't be able to log in. For dev, turn it off
or use Supabase's built-in SMTP (free tier sends from `supabase.com` domain).

### 4. The `AuthProvider` is not currently wrapped around your app
`app/_layout.tsx` only has `ThemeProvider`. Without `AuthProvider` wrapping the component
tree, any call to `useAuth()` will return the default context value (all nulls/no-ops).
This must be fixed before auth will work.

### 5. Login/signup screens are UI stubs
`app/auth/login.tsx` and `app/auth/signup.tsx` collect email/password into local state
but just do `router.push("/(tabs)")` without calling `signIn`/`signUp` from the auth
context. You need to wire these up to the auth context.

### 6. Supabase real-time for messaging
If you want live messaging (like WhatsApp), you need to subscribe to real-time changes
on the `messages` table. Supabase free tier allows 200 concurrent connections. Use:
```typescript
const channel = supabase
  .channel('messages')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
    // handle new message
  })
  .subscribe();
```

### 7. Image uploads need storage policies
Without the storage policies in Step 10, uploads will fail with a 403 Forbidden error
even if the user is authenticated.

### 8. Free tier limitations
- 500MB database storage
- 1GB file storage (for images)
- 50,000 monthly active users
- 500MB bandwidth
- 2 projects max
For development and early users this is fine. You'll need to upgrade when scaling.

### 9. `process.env.EXPO_PUBLIC_*` requires app restart
Environment variables in Expo are baked in at build time. If you change `.env`, you must
restart the Expo dev server (not just reload the app).

### 10. RLS disabled by default
When you create a new table via the SQL Editor, RLS is **disabled by default**. You must
explicitly run `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` or your data is fully exposed.

---

## Useful Documentation Links

- Supabase JS Client: https://supabase.com/docs/reference/javascript/introduction
- Supabase Auth (Email): https://supabase.com/docs/guides/auth/passwords
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage: https://supabase.com/docs/guides/storage
- Supabase Realtime: https://supabase.com/docs/guides/realtime
- Supabase CLI: https://supabase.com/docs/guides/cli
- Expo + Supabase tutorial: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
- Expo SecureStore: https://docs.expo.dev/versions/latest/sdk/securestore/
- Expo Environment Variables: https://docs.expo.dev/guides/environment-variables/

---

## Recommended Workflow

1. **Start small**: Get auth working end-to-end first (signup -> login -> see user in dashboard)
2. **One table at a time**: Start with `profiles` and `listings`, get CRUD working, then add messaging, then purchases
3. **Use Supabase Dashboard for testing**: The table editor and SQL editor are great for verifying your data
4. **Check RLS policies early**: If a query returns empty results when you expect data, check your RLS policies — that's usually the issue
5. **Log errors**: `signIn` and `signUp` in your auth context throw errors — make sure your login/signup screens catch and display them

---

## Quick Checklist

- [ ] Create Supabase project at supabase.com
- [ ] Install packages: `@supabase/supabase-js`, `expo-crypto`, `expo-secure-store`, `react-native-url-polyfill`
- [ ] Create `lib/supabase.ts` with createClient
- [ ] Create `.env` with your Supabase URL and anon key
- [ ] Add `.env` to `.gitignore`
- [ ] Wrap app with `AuthProvider` in `app/_layout.tsx`
- [ ] Create database tables (run SQL in Supabase dashboard)
- [ ] Enable RLS and add policies on every table
- [ ] Set up Storage buckets for images
- [ ] Wire login/signup screens to auth context
- [ ] Replace mock data with real Supabase queries
- [ ] Test auth flow end-to-end

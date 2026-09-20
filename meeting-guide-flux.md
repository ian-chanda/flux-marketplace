# Meeting Guide — The Talk with Her Dad

For: getting the Flux marketplace app off the ground.
Written: night before the meeting. Open opencode in this folder next time so this file loads.

---

## 0. First, breathe.

You have adrenaline from another project and you said it yourself — your thoughts aren't in
the right place. That's fine. Do this tonight and it'll be out of your head:

- Sleep. Seriously. An under-slept you rambles.
- Plan to arrive 10 min early, phone on silent, and don't check that other gig's messages during the meeting.
- Remind yourself once: **he agreed to meet a young person building something. That's already a yes at the door.** Your job is not to survive an interrogation — it's to have a good conversation.

What you want from this meeting is NOT one big yes. It's **one of several smaller wins**:
advice, a warm intro, money, or a "come back with a plan." Any of those is a success.
Take the pressure off.

---

## 1. What you're actually showing him (say it out loud)

Flux is a Zambian online marketplace mobile app — like a local OLX/classifieds built for
Zambia, with Kwacha pricing. Local buyers and sellers post, browse, save, chat, and buy.

Where it stands today (this is real, it's literally the codebase, and you can demo it):

- **Working app** built on React Native (Expo) with a real Supabase backend.
- **Working right now on a phone:**
  - Sign up / sign in (accounts are real)
  - Browse the home feed of live listings
  - Search / category browsing
  - Product pages with photos
  - Post a listing with photos (uploads to a real bucket)
  - Manage / hide your own listings
  - Save favorites / bookmarks
  - Cart + checkout that actually writes orders to the database
  - Edit profile, view purchases, seller profiles
- **Backend**: Supabase (Postgres), real user accounts, real listings, real orders,
  saved-items, image storage.

So this is not a drawing or an idea. It's a product that already functions end-to-end.

What's NOT done yet (be honest, it makes you credible):
- Search isn't wired to the database yet (UI there)
- Messaging between buyer and seller is mocked, not real yet
- Payments are cosmetic — "Pay Now" records an order but doesn't really charge anyone. Real
  mobile-money integration (MTN MoMo / Airtel / Zamtel) with **escrow** is the big remaining build
- It's not on the App Store / Play Store yet — that's a launch checklist item
- No marketing, no users, no revenue

The honest one-liner pitch: *"I've built a working marketplace app for Zambia. It functions
end to end. What I need help with is the last stretch: launching it in Zambia and getting the
first real users."*

---

## 2. What the money is actually for (have this table in your head)

Pick your number BEFORE the meeting. A big figure is fine as a stretch target only if you can
defend it — but lead with the smaller launch figure below. Here's a realistic breakdown. (These are
planning numbers — sanity-check them against actual Zambian prices before quoting.)

| Item | Rough cost (K) | Why |
|------|----------------|-----|
| App Store + Play Store accounts | ~2,000 | Apple $99/yr + Google $25 one-time |
| Publishing/dev (EAS builds, test devices, data) | ~3,000 | Getting iOS + Android builds out |
| Incorporation / paperwork (PACRA) | ~2,000 | A legal entity makes him comfortable investing |
| Simple landing page / domain | ~1,000 | Something to point people to pre-launch |
| Payments integration (mobile money) + escrow setup | ~10,000–20,000 | Gateway setup fees, compliance, holding-account arrangement — real money moving is the single biggest missing feature and the one that makes you trustworthy |
| First marketing push (market days, fliers, small social ads, mobile-money offers) | ~8,000–15,000 | Getting the first 500 real users and listings |
| Contingency / your own runway | rest | Life is not free while you grind |

Ongoing cost of payments (not a setup cost — know this when quoting): gateways charge roughly
2–3% per transaction on top of the mobile-money operator's own fee (MTN MoMo / Airtel Money /
Zamtel Kwacha each take their cut). Budget those per-sale fees into your pricing model so you
never lose money on a transaction.

**The point of the table is: you're not asking for one big number to "build an app."** You're
asking for a number that covers "publish + incorporate + payments(escrow) + first marketing push."
If he asks "what's it for," you rattle off 3–4 things, not a fantasy.

Recommended: **ask in the K25,000–K35,000 range for launch**, with a clear "this gets us live in
both stores with real escrow-protected payments and the first wave of users; a bigger round would
additionally buy (stock, a larger campaign, first marketing hire)." Two levels = you look like
you've thought about it. If all he offers is advice, take it.

### Escrow — the honest version (this will impress him)

Escrow is the killer trust feature for a marketplace: buyer pays, the money is **held**, the
seller ships/delivers, the buyer confirms, then the money is released to the seller. It's also the
reason people actually trust a small platform with their money — and it's the correct answer to
his implicit "why would anyone trust YOU with their money?" question.

What it actually costs and involves:

1. **In Zambia, holding other people's money is regulated.** A marketplace can't just sit on
   customer funds in its own account — that's effectively an unlicensed e-money operation under
   Bank of Zambia rules. So the professional route is to **partner with a licensed payment provider
   (PSP) that offers holds/escrow or disbursements**, rather than building your own.
2. **Zambian options to research before the meeting** (don't name specific numbers for these in
   the meeting — name the category — but know they exist): the operator APIs (MTN MoMo and Airtel
   Money developer gateways), and local aggregators that sit on top of all three operators
   (research names like SENTA, EazyPay — verify what's active in 2026). Some also support
   **disbursement/payout APIs**, which is what you need to release escrowed funds to a seller.
3. **Setup cost** = gateway on-boarding fees (their KYC/compliance), your integration work, and
   the holding/payout arrangement. That's the K10–20k line above. **Per-transaction cost** = the
   2–3% + operator fee above.
4. **Safe MVP fallback if a full escrow partner is too much at first:** "pay at delivery / check
   the goods in person" is the norm for Zambian classifieds — so for launch you can do cash/hand
   delivery alongside the escrowed online path and let escrow grow as trust grows. Say this
   honestly and you look strategic, not cheap.

### A blurb you can say in the meeting

*"The missing piece is real mobile-money payments, and I'm building it with escrow — the money is
held by a licensed payment partner and only released to the seller once the buyer confirms
delivery. That's what makes an online marketplace safe to actually pay in. It's integrating MTN
MoMo, Airtel Money and Zamtel Kwacha, and this is part of what the raise covers."*

---

## 3. How to frame the ask (three layers, use in order)

Layer 1 — **Start as advice, end as a request.**
Opening: *"I'm building a marketplace app for Zambia and it works. Since you run businesses, I'd
genuinely value 20 minutes of your opinion before I ask you for anything else."* People love being
consulted. It lowers his guard and you get their take for free. Asking for help first makes the
money question feel natural later.

Layer 2 — **Money is an offer they can make, not a demand you make.**
The cleanest phrasing for a first meeting:
- *"I've been funding this myself so far with freelance work. It's at the point where the next
  step is getting it live in the app stores and running the first marketing push in Zambia, and
  that's where I could use financial help."*
- If he asks how much, give the low number first (the K15–20k launch), then the optional bigger
  tier. Silence after the number is normal — WAIT. Don't fill the silence by lowering it.
- Offer flexible terms so he can pick the one he's comfortable with: a loan you'll repay, an
  equity share, a SAFE-style agreement, or his money back with interest. Some investors prefer a
  clean loan to a weird paperwork situation. Don't lock yourself into one structure on the spot —
  say you'll send a written proposal in a couple days.

Layer 3 — **Non-money asks are still wins.**
If he's not writing a cheque: ask for contacts. Company contacts, a Zambian who's launched a
startup, someone at a mobile-money provider, a bank manager. *"Since you know everyone in telecom/
sugar — is there one person you'd introduce me to?"* Intros are money waiting.

---

## 4. The meeting shape (aim for 30–45 min)

1. **0–5 min: gratitude + context, short.** "First, thank you for taking this meeting." You
   don't have to mention the daughter-dating thing at all unless he brings it up. Be warm, not
   mysterious. One sentence: it came through your family's circle.
2. **5–15 min: the app.** Have it OPEN on your phone. Hand it to him (or walk through on yours).
   Let him tap around a live listing. Show: home feed, product page, add a listing. "This is live,
   it's hitting our database right now."
3. **15–20 min: the honest gaps.** Search needs wiring, messaging isn't real, payments are the
   missing muscle. Don't oversell. One line: "The hard engineering is done; the remaining work is
   polish and shipping."
4. **20–30 min: the ask.** The three layers above. Number + purpose table + flexible terms.
5. **30–40 min: flip it to THEM.** Ask how he got his own things off the ground, what he wishes
   he'd known, and whether he sees a real market for this in Zambia. Let him talk — this is where
   he either warms up to investing or starts handing you intros.
6. **Close:** thank him, and commit to a follow-up — "I'll send you a short one-page proposal in
   two days. You'll get a folder summary, and I'd love your thoughts on the number and the plan."

Never leave a meeting like this without a next step. The next step can be tiny.

---

## 5. The "he'll steal my idea" fear — real talk

He won't. Reasons, in order of importance:

1. **A marketplace app is not a secret — every business person already knows classifieds exist.**
   There is nothing to steal, and "the idea" without execution, users, and local sales knowledge
   is worthless. This is the single best antidote to the fear: the idea was never the asset.
2. **He owns companies in telecom and sugar. Building and running a consumer mobile startup is
   not what he does.** His opportunity cost is huge; your niche is weird and cheap. He has no
   incentive to clone a two-person marketplace.
3. **You control the code.** You literally have the entire product in a private repository on
   your machine. You will not be sharing that repo, your keys, or your backend access with him in
   this meeting. Never show a stranger secrets/keys — even a friendly one. A demo is a demo.
4. **Worst realistic case:** he says no, and you've lost an hour. That's it. There is no
   realistic case where he recreates your app without you. The bigger risk is the OPPOSITE — that
   you hold everything so close that you never raise anything.

If it helps your anxiety, you can literally say: *"I keep the code on my own machine, and I'm
happy to share written plans with you — but the codebase itself stays private."* That's normal and
professional. It reads as maturity, not distrust.

---

## 6. The daughter situation (keep it clean)

You two are "figuring out where you stand." That is nobody's business in this room except yours —
and you must NOT use this meeting to gamble on her. If he asks about it, be respectful and
one-line it: *"We've been getting to know each other, and I really appreciate that she trusted me
enough to make this introduction."* Then go back to the app.

Rules:
- Do not make him feel like a dad who's being played. You're there to talk business. Look like it.
- Do not pretend the intro didn't happen and do not lean on it too hard — "her dad owes me" energy
  dies in the room.
- Regardless of where the relationship lands, the professional thread you've started with him is
  its own separate asset now. Be worthy of it on your own.

---

## 7. Script cheat sheet (steal these lines)

- *"I built a marketplace app for Zambia. It works end to end — let me show you."*
- *"What's missing is pushing it live and getting the first real users, and that's what I'm
  raising for."*
- *"I'd rather start honest: I've funded this with freelance work so far. I'm here because I
  think this has a real business in Zambia, and I could use help getting it off the ground."*
- *"I'm open on the structure — a loan, a share, or a deal we write up properly. Whatever makes
  you comfortable."*
- *"Is there one person in your network you'd introduce me to?"*
- If he asks who else is involved: *"It's just me building it right now, with Supabase for the
  backend."* (If you have a cofounder/mentor, say so — more people = more credible.)
- If he says "I'll think about it": *"Thank you — I'll send you a short written proposal with the
  numbers so it's easy to think about."*

Don't say: exact code details, your super-secret roadmap, a specific revenue forecast you can't
defend, how much you spent on the relationship, "this will be the Zambian Amazon" (keep claims to
things the demo can prove).

---

## 8. Tonight's homework (20 minutes, that's it)

1. Pick your number(s): launch ask and stretch ask. Write them down.
2. Rehearse the one-liner pitch out loud three times.
3. Have the app installed and updated on your phone. Test login + open one listing so the demo
   can't fail in front of him.
4. Prepare one honest ask of advice (a good first question: "What's the one thing you'd do if
   you were launching a consumer product in Zambia today?")
5. Pick clothes that look like "serious about business," not "drove here fast."
6. Set a reminder to send the one-page follow-up within 48 hours.

## 9. After the meeting: the 48-hour follow-up

Send a short, typed note (WhatsApp is fine) that says:
- thanks for the time,
- a 3-line summary of what Flux is and what you're raising (say the number plainly),
- the one ask you're making (decision on investment? an intro? a next meeting?),
- and a sentence making it easy: *"Happy to send a fuller written proposal if you'd like — no
  pressure either way."*

If he said nothing concrete, still send it. It keeps the door warm and costs you nothing.

---

## 10. Reality check

- A big number is fine to think big, but a first meeting is won by a **defendable small number**
  plus a clear plan. You can always raise more later once you have users — traction raises money,
  not the other way around.
- The app being genuinely built is rare and is your whole credibility. Almost nobody you pitch has
  a working product. You do. Walk in like it.
- Whether this girl stays in your life or not, this meeting is YOUR business move now. How you
  carry it reflects on you, and that's the only thing you control. Make yourself proud.
- And if it doesn't go anywhere? You lose nothing you had this morning. Tomorrow is one meeting.
  There will be more investors, more dads, more doors. Go get some sleep.
# Flux

Flux is a collaborative, mobile-first marketplace application designed for buying and selling goods
in Zambia. Built with React Native, Expo, and Supabase, it supports product listings, search, user
profiles, and an order management flow. Messaging, notifications, and payment integrations remain
in development.

**Contributors:** Ian Chanda and Elijah Muma

## Status at a glance

| Area | State |
| --- | --- |
| Authentication & sessions | Working |
| Listings, search & discovery | Working |
| Cart, checkout & order history | Working (no real payment gateway) |
| Saved items & recently viewed | Working |
| Profiles, avatars & addresses | Working |
| Messaging | UI only, no backend |
| Notifications | Placeholder only |
| Payments | Not integrated |
| Selling dashboard | Mostly static |

## Implemented functionality

- **Authentication** — email sign-up/sign-in/out with session persistence; authenticated routes
  are guarded from public ones.
- **Discovery** — home feed of live listings, category/status pills, and search with debounced
  live results plus a results screen supporting price range, condition, and sort.
- **Listings** — create and manage listings with multi-image upload, availability toggling, and
  delete; product detail pages with an image gallery, seller profile, bookmarking, and cart actions.
- **Commerce** — cart management and checkout that records orders and order items, with a purchase
  history screen. No money is actually moved yet.
- **Personal features** — saved items, recently viewed, and profile editing with avatar/header
  uploads and delivery addresses.

## Notable technical decisions

1. **Optimistic bookmark updates with rollback.** Saving or unsaving a listing updates the
   interface immediately and persists the change in the background. If the Supabase write fails,
   the UI state is rolled back, so a listing never appears bookmarked when it wasn't actually
   stored. This keeps interactions instant on slow connections without sacrificing consistency.
2. **A client-side image normalization pipeline.** iPhone photos arrive as HEIC, which React
   Native's `<Image>` cannot render reliably (especially on Android). Picked images are re-encoded
   to JPEG with `expo-image-manipulator` before upload, and uploads use cache-busting so refreshed
   avatars and listing photos aren't served stale.
3. **Clear separation between UI, data, and external calls.** Screens live in `app/` (typed,
   file-based expo-router), reusable behavior in `hooks/`, all Supabase access in `services/`, and
   pure helpers in `utils/`. This keeps network and database logic out of components and makes the
   app easier to reason about as it grows.

## Preview

> Placeholders — replace with real screenshots.

Home Feed
| <img width="585" height="1266" alt="IMG_0660" src="https://github.com/user-attachments/assets/f4e4a09d-8235-454c-8663-22d9bd8719d4" /> |

Listing Details
| <img width="585" height="1266" alt="IMG_0661" src="https://github.com/user-attachments/assets/75ce551e-d511-457a-b018-806bd714d62f" /> |

Create Listing 
| <img width="585" height="1266" alt="IMG_0662" src="https://github.com/user-attachments/assets/08a7fa63-4927-4cf3-a170-6db943ff9193" /> |

## Tech stack

- **Framework:** Expo SDK 57, React Native 0.86, React 19, TypeScript
- **Navigation:** expo-router (typed, file-based routing)
- **Backend:** Supabase (`@supabase/supabase-js`) — auth, Postgres, storage
- **Device APIs:** expo-image-picker, expo-image-manipulator, expo-location, expo-file-system
- **State & storage:** React hooks, AsyncStorage, contexts
- **UI:** react-native-reanimated, react-native-gesture-handler, react-native-svg, Expo Vector Icons
- **Tooling:** ESLint (`expo lint`)

## Getting started

```bash
npm install        # install dependencies
npm start          # start the Expo dev server

npm run ios        # run on iOS
npm run android     # run on Android
npm run lint       # lint
```

Create a `.env` file (see `.env.example`) with your own Supabase project values:

```bash
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### Supabase setup

The app expects a Supabase project that has already been configured with the required tables
(listings, users, cart, orders, saved items, and so on), Row Level Security policies, and storage
buckets. This schema configuration is **not included automatically** and must be set up per
project. Prepared, unapplied SQL and read-only inspection queries are kept in `supabase/`.

## Project structure

```
app/         expo-router screens
components/  UI components
hooks/       reusable React state & behavior
services/    Supabase / external API calls
contexts/    auth and theme providers
types/       shared TypeScript types
utils/       pure helper functions
supabase/    prepared (unapplied) migrations & inspection queries
```

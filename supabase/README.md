# Supabase setup (Blueprint Step 3)

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. Copy **Project URL** and **anon public** key into env files (see below).

## 2. Run the migration

In the Supabase dashboard → **SQL Editor**, paste and run:

`supabase/migrations/001_documents.sql`

This creates:

- `public.documents` table with RLS
- Private `documents` storage bucket (50 MB, PDF/Word)

## 3. Enable Google auth (Step 2/3)

1. **Authentication → Providers → Google** — enable and add OAuth client ID/secret.
2. **Authentication → URL configuration** — add redirect URLs:
   - Web: `http://localhost:3000/auth/callback`
   - Mobile: `documind://auth/callback` (and Expo dev URL if using Expo Go)

## 4. Environment variables

| App | File | Variables |
|-----|------|-----------|
| Web | `apps/web/.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Mobile | `apps/mobile/.env` | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` |

Copy from `env.example` in each app folder.

## 5. Verify

- Sign in with Google on web or mobile.
- Upload a PDF from the library screen.
- Document appears in **Table Editor → documents** and **Storage → documents**.

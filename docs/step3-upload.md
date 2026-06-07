# Blueprint Step 3 — Document upload to Supabase

**Goal (from blueprint):** User picks a PDF → uploads to Supabase Storage → document appears in the library. **No AI yet.**

## What was implemented

| Piece | Location |
|-------|----------|
| SQL schema + RLS | `supabase/migrations/001_documents.sql` |
| Setup guide | `supabase/README.md` |
| Web upload + library | `apps/web/services/documents/*`, upload screen, home page |
| Web Google auth | `services/auth/sign-in-google.ts`, `app/auth/callback/route.ts` |
| Mobile Supabase client | `apps/mobile/lib/supabase/*` |
| Mobile PDF picker upload | `pickAndUploadPdf()` → storage + `documents` row |
| Mobile library | `hooks/useDocuments.ts` on home screen |

## Setup checklist

1. Create Supabase project.
2. Run `001_documents.sql` in SQL Editor.
3. Enable **Google** provider under Authentication.
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (web)
   - `documind://auth/callback` (mobile)
5. Copy env files:
   - `apps/web/env.example` → `.env.local`
   - `apps/mobile/env.example` → `.env`
6. Sign in with Google → upload PDF → confirm row in **documents** table and file in **Storage**.

## Flow

```text
Login (Google OAuth)
    ↓
Pick PDF
    ↓
Insert documents row (status: uploading)
    ↓
Upload file to storage/documents/{user_id}/{doc_id}/{filename}
    ↓
Update status: ready
    ↓
Library lists documents from Postgres
    ↓
Processing screen (UI only — Step 4 adds AI ingest)
```

## Next: Step 4

Wire processing screen → `POST /api/v1/documents/{id}/ingest` (FastAPI RAG). See `docs/backend-step4.md`.

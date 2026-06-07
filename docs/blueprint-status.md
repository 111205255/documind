# DocuMind Blueprint — Build Status

Last updated: June 2026

## Step checklist

| Step | Status | Notes |
|------|--------|-------|
| 1 — Figma (15 frames) | Done | Mobile-first design complete |
| 2 — Project skeleton | Done | Next.js web + Expo mobile + Supabase auth |
| 3 — Document upload | Done | PDF + Word upload to Supabase Storage |
| 4 — AI backend (RAG) | Done locally | FastAPI + LangChain + ChromaDB + OpenAI |
| 5 — Chat UI ↔ API | Done | Web + mobile wired; history in Supabase |
| 6 — Polish | Done | Offline guard, share, settings, email auth (web + mobile) |
| 7 — Case study | Done | `docs/case-study.md` |

## Live URLs

- Web: https://documind-beige.vercel.app
- Mobile web: https://documind-app-two.vercel.app
- Supabase: https://vazxfcgbaawbreziszmy.supabase.co
- RAG API: via `RAG_API_URL` on Vercel (currently localtunnel while PC is on)

## What works end-to-end

- Google + email sign-in (web and mobile)
- Upload PDF or Word → Supabase Storage
- Ingest → ChromaDB indexing (PDF + .docx)
- Chat with page citations
- Chat history per document
- Offline screen auto-redirect (web `/offline`, mobile `/connection`)
- PWA manifest (web add-to-home-screen metadata)
- Share answer (WhatsApp / copy)
- Settings with real user + sign out
- Document delete (mobile)

## Remaining (needs your account — scripts are ready)

| Item | Command |
|------|---------|
| Permanent backend (Fly.io) | `flyctl auth login` then `.\backend\deploy-fly.ps1` |
| Permanent backend (Render) | `.\backend\deploy-render.ps1` then `.\scripts\finish-production.ps1 -ApiUrl ...` |
| Temporary (PC must stay on) | `.\scripts\keep-api-alive.ps1` |
| Native Android APK | `cd apps\mobile; npx eas-cli login; npx eas-cli build -p android --profile preview` |
| OpenAI key rotation | https://platform.openai.com/api-keys |

Full guide: `docs/production-deploy.md`

## Env reference

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Web Vercel | Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Web Vercel | Supabase anon key |
| `RAG_API_URL` | Web Vercel (server) | Next.js `/api/rag` proxy target |
| `EXPO_PUBLIC_SUPABASE_*` | Mobile Vercel | Auth + data |
| `EXPO_PUBLIC_API_URL` | Mobile Vercel | Direct RAG API calls |
| `OPENAI_API_KEY` | Backend host | GPT answers |
| `CORS_ORIGINS` | Backend | Allow Vercel origins |

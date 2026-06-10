# DocuMind Blueprint — Build Status

Last updated: June 2026

## Step checklist

| Step | Status | Notes |
|------|--------|-------|
| 1 — Figma (15 frames) | Done | Mobile-first design complete |
| 2 — Project skeleton | Done | Next.js web + Expo mobile + Supabase auth |
| 3 — Document upload | Done | PDF + Word + URL (web + mobile) |
| 4 — AI backend (RAG) | Done | FastAPI + LangChain + ChromaDB + Gemini on Render |
| 5 — Chat UI ↔ API | Done | Web + mobile wired; history in Supabase |
| 6 — Polish | Done | Offline guard, share, settings, follow-ups, PWA, auth guards |
| 7 — Case study | Done | `docs/case-study.md` |

## Must-have features (blueprint §6)

| Feature | Status |
|---------|--------|
| Login with Google | Done (+ email) |
| Upload PDF or Word | Done (web + mobile) |
| Ask questions in plain language | Done |
| Answers with page citations | Done |
| My documents vault | Done |
| Chat history per document | Done |

## V2 features (blueprint §6)

| Feature | Status |
|---------|--------|
| Paste URL / website link | Done |
| Suggested follow-up questions | Done |
| Share answer via WhatsApp | Done |
| Hindi document support | Not started |
| LangGraph / CrewAI agents | Not started |

## Live URLs

- Web: https://documind-beige.vercel.app
- Mobile web: https://documind-app-two.vercel.app
- Supabase: https://vazxfcgbaawbreziszmy.supabase.co
- RAG API: https://documind-api-drsq.onrender.com

## What works end-to-end

- Google + email sign-in (web and mobile) with route guards
- Upload PDF, Word, or URL → Supabase → ingest → ChromaDB
- Chat with page citations + suggested follow-up chips
- Chat history per document
- Document delete (web + mobile) with Chroma cleanup
- Offline screen auto-redirect
- PWA manifest + service worker + install icon
- Share answer (WhatsApp / copy)
- Terms page at `/terms`
- Optional API key auth (`RAG_API_KEY` / `X-API-Key`)

## Remaining (optional)

| Item | Notes |
|------|-------|
| Native Android APK | `cd apps\mobile; npx eas-cli build -p android --profile preview` |
| Hindi document support | Blueprint India v2 |
| LangGraph / CrewAI | Blueprint bonus v2 |
| Set `RAG_API_KEY` on Render + Vercel | Recommended for production API lock-down |

Full guide: `docs/production-deploy.md`

## Env reference

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Web Vercel | Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Web Vercel | Supabase anon key |
| `RAG_API_URL` | Web Vercel (server) | Next.js `/api/rag` proxy target |
| `RAG_API_KEY` | Web Vercel (server) | Sent as `X-API-Key` to backend |
| `EXPO_PUBLIC_SUPABASE_*` | Mobile Vercel | Auth + data |
| `EXPO_PUBLIC_API_URL` | Mobile Vercel | Direct RAG API calls |
| `EXPO_PUBLIC_RAG_API_KEY` | Mobile Vercel | Optional API key for mobile |
| `GOOGLE_API_KEY` | Backend host | Gemini answers + embeddings |
| `RAG_API_KEY` | Backend host | Optional ingest/chat auth |
| `CORS_ORIGINS` | Backend | Allow Vercel origins |

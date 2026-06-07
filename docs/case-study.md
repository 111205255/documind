# DocuMind — Portfolio Case Study

## Problem

Students and professionals waste hours reading long PDFs or searching with Ctrl+F. Generic AI chat tools often lack trustworthy citations tied to the exact page.

## Solution

**DocuMind** is a mobile-first AI knowledge assistant. Users sign in, upload PDFs, and ask questions in plain language. Every answer includes page-level citations from the actual document text.

**Tagline:** Ask anything. Know everything.

## Architecture

```text
User (Web / Mobile)
    ↓
Supabase Auth + Storage + Postgres (documents, chat_threads, chat_messages)
    ↓
FastAPI RAG API (LangChain chunking, ChromaDB vectors, OpenAI GPT)
    ↓
Cited answers back to chat UI
```

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React Native (Expo), Tailwind |
| Auth & DB | Supabase (Google + email, RLS) |
| File storage | Supabase Storage |
| AI API | FastAPI, LangChain, ChromaDB, OpenAI |
| Deploy | Vercel (web + mobile web), Render/Fly (API) |

## Key features shipped

- Google + email authentication
- PDF upload with private per-user storage
- RAG pipeline: chunk → embed → retrieve → cite
- Live chat with citation bottom sheet
- Chat history persisted in Supabase
- WhatsApp / copy share on answers
- Production URLs: documind-beige.vercel.app, documind-app-two.vercel.app

## Challenges

1. **OAuth on Windows + Vercel** — Required Web (not Desktop) Google client and separate redirect URLs for Supabase vs app.
2. **Vercel ↔ local API** — Solved with Next.js `/api/rag` proxy and `RAG_API_URL` server env.
3. **Mobile vs web parity** — Shared Supabase schema; mobile calls public API URL directly.

## Results

End-to-end flow: sign in → upload PDF → AI indexes in ~30s → ask questions with page citations. Suitable for portfolio demo and user testing.

## Links

- Live web: https://documind-beige.vercel.app
- Live mobile UI: https://documind-app-two.vercel.app
- Repo: documind monorepo (`apps/web`, `apps/mobile`, `backend`, `supabase`)

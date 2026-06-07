# DocuMind

**Ask anything. Know everything.**

Mobile-first AI document chat: upload any PDF or document, ask questions in plain language, get answers with exact page citations.

- **Blueprint:** [Google Doc](https://docs.google.com/document/d/1S0XeS2yeU8ex16fZ-M5jkjd87QsK3jYBFp0XpN0HCE8/edit)
- **Summary:** [docs/blueprint-summary.md](docs/blueprint-summary.md)

## Stack

| Layer | Tools |
|-------|--------|
| Design | Figma — 390×844px, 15 mobile frames |
| Mobile app | Expo (React Native) — `apps/mobile` |
| Web | Next.js, TypeScript, Tailwind CSS — `apps/web` |
| Auth + DB + Storage | Supabase |
| AI orchestration | LangChain (RAG pipeline) |
| Vector store | ChromaDB |
| LLM | OpenAI API (GPT-4o) |
| Backend API | FastAPI (Python) |
| Deploy | Vercel (frontend), Docker (backend) |

## Repository layout

```
documind/
├── apps/mobile/    # Native iOS & Android (Expo)
├── apps/web/       # Next.js web app (optional / admin)
├── backend/        # FastAPI + RAG (Step 4)
├── docs/           # Blueprint and project notes
├── design/         # Figma exports and design notes
└── docker-compose.yml
```

## Build order (from blueprint)

| Step | Focus |
|------|--------|
| **1** | Design all 15 Figma frames (start with 04, 07, 08) |
| **2** | Project skeleton — Next.js + Supabase, no AI |
| **3** | Document upload to Supabase storage + library UI |
| **4** | FastAPI + LangChain + ChromaDB + OpenAI RAG |
| **5** | Connect chat UI to backend with citations |
| **6** | Polish — loading, errors, WhatsApp share, Docker |
| **7** | Case study for portfolio (Behance + site) |

**Current status:** Figma-aligned UI (`apps/mobile`, `apps/web`). **Step 3** — Supabase documents table, storage upload, library wired ([docs/step3-upload.md](docs/step3-upload.md)). **Step 4** — FastAPI RAG in `backend/` ([docs/backend-step4.md](docs/backend-step4.md)). **Next: Step 5** — connect chat UI to `/api/v1/chat`.

## Getting started (after design)

1. Run `.\init-repo.ps1` once if git is not initialized (creates `apps/web/env.example` and runs `git init`).
2. Copy `apps/web/env.example` → `apps/web/.env.local` and fill Supabase keys in Step 2.
3. Copy `backend/env.example` → `backend/.env` when building Step 4.
4. Follow steps 2–7 in order; do not skip ahead.

## Target users

Indian students, working professionals, and startup teams who need fast, cited answers from long documents.

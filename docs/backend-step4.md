# Backend — Step 4 implementation notes

Source: `DocuMind_Project_Blueprint.docx` / [blueprint-summary.md](./blueprint-summary.md)

## What Step 4 requires

From the blueprint (Section 10, Step 4):

1. FastAPI as the Python backend server  
2. LangChain to split documents into chunks  
3. ChromaDB to store embeddings  
4. OpenAI to generate answers from retrieved chunks  
5. One end-to-end **RAG pipeline**

## What we built

| Blueprint piece | Implementation |
|-----------------|----------------|
| FastAPI | `backend/app/main.py`, routes under `/api/v1` |
| LangChain chunking | `RecursiveCharacterTextSplitter` in `services/rag/ingest.py` |
| ChromaDB | `langchain-chroma` persistent store in `services/vector_store.py` |
| OpenAI | `text-embedding-3-small` + `ChatOpenAI` in ingest/query |
| RAG | `ingest_*` → store; `answer_question` → retrieve → prompt → citations |

## How it connects to other steps

```text
Step 3 (upload)     →  Supabase Storage + Postgres metadata
Step 4 (this API)   →  POST /documents/{id}/ingest with PDF bytes
Step 5 (chat UI)    →  POST /chat with document_id + question
```

Use the **same `document_id`** in Supabase and Chroma metadata.

## Environment variables

See `backend/env.example`. Minimum for local dev:

- `OPENAI_API_KEY` (required)
- `CHROMA_PERSIST_DIRECTORY` (optional, default `./chroma_data`)
- `CORS_ORIGINS` (include Expo `http://localhost:8081` and Next `http://localhost:3000`)

## Step 5 wiring (web — implemented)

| Piece | Location |
|-------|----------|
| API URL helper | `apps/web/lib/api-url.ts` |
| Ingest client | `apps/web/services/api/ingest-document.ts` |
| Chat client | `apps/web/services/api/chat.ts` |
| Processing → ingest | `features/documents/components/processing-screen.tsx` |
| Live chat UI | `features/chat/components/active-chat-screen.tsx` |

Flow: upload → `/documents/{id}/processing` → download PDF from Supabase → `POST /api/v1/documents/{id}/ingest` → `/chat/{id}` → `POST /api/v1/chat`.

## Run locally

```bash
# Terminal 1 — backend (requires OPENAI_API_KEY in backend/.env)
cd backend
copy env.example .env   # add your OpenAI key
python run.py

# Terminal 2 — web
cd apps/web
# NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local
npm run dev
```

## Production note

Vercel hosts the web UI only. Deploy `backend/` to Railway, Render, or Fly.io and set `NEXT_PUBLIC_API_URL` to that URL. Add the same URL to `CORS_ORIGINS` in the backend.

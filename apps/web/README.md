# DocuMind Web

Next.js (App Router) + TypeScript + Tailwind CSS + Supabase.

## Status

**Phase 1 foundation** is scaffolded with route stubs for all 15 screens. UI uses **placeholder tokens** until Figma frames are synced.

## Docs

- [Implementation plan](../../docs/frontend-implementation-plan.md)
- [Component map](../../docs/component-map.md)

## Develop

```bash
cd apps/web
cp env.example .env.local   # add Supabase keys when ready
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — splash → login. Use **Continue to app (dev preview)** or navigate to `/home`, `/chat`, `/settings`.

## Routes

| Screen | Path |
|--------|------|
| Splash | `/` |
| Login | `/login` |
| Home / library | `/home` |
| Upload | `/documents/upload` |
| Processing | `/documents/[id]/processing` |
| Document detail | `/documents/[id]` |
| Chat empty | `/chat` |
| Active chat | `/chat/[id]` |
| Chat history | `/chat/history` |
| Settings | `/settings` |
| Offline | `/offline` |

## Structure

```
app/           Routes & layouts
components/    Shared UI, layout, motion, feedback
features/      auth, documents, chat, settings
lib/           utils, constants
hooks/         media query, reduced motion
types/         domain types
services/      Supabase clients
styles/        tokens.css, animations.css
```

# DocuMind Frontend — Implementation Plan

> **Status:** Phase 1 foundation scaffolded. **UI values are placeholders** until Figma frames (390×844) are provided and tokens are synced.

## Design-first workflow

1. Receive Figma screenshots / exports for all 15 frames (priority: **04** library, **07** chat empty, **08** active chat).
2. Extract colors, typography, spacing, radius, shadows → update `apps/web/styles/tokens.css`.
3. Build or adjust components screen-by-screen against designs.
4. Run visual QA at mobile (390px), tablet (~768px), desktop (1024px+).

## Screen hierarchy & routes

```
/                          → Splash (brand, auto-advance)
/login                     → Auth (Google / email per Figma)
/home                      → Documents library | empty home
/documents/upload          → Upload picker + progress
/documents/[id]/processing → Ingestion / indexing state
/documents/[id]            → Document detail + actions
/chat                      → Chat empty state (no thread)
/chat/[id]                 → Active conversation (hero)
/chat/history              → Past threads list
/settings                  → Profile & preferences
/offline                   → Error / offline full-screen

Overlays (not routes):
  • Citation bottom sheet      → opened from chat message
  • Share bottom sheet         → opened from document / chat
  • AI thinking inline state   → part of chat/[id]
```

## Phase breakdown

| Phase | Scope | Deliverables |
|-------|--------|--------------|
| **1** | Foundation | Tokens, theme, layout shell, nav, auth + home route stubs, base UI |
| **2** | Documents | Upload UI, processing, library list/cards, empty home |
| **3** | Chat | Messages, citations sheet, history, thinking state, animations |
| **4** | Polish | Settings, share sheet, offline/error, a11y pass, performance |

## Navigation model (mobile-first)

- **Primary:** Bottom tab bar — Home (documents), Chat, Settings (exact icons/labels from Figma).
- **Tablet/Desktop:** Same routes; bottom nav may become side rail or top sub-nav per breakpoint tokens.
- **Deep links:** Document detail, active chat, upload flow preserve back stack.

## State & data (later steps)

| Concern | Tool |
|---------|------|
| Auth session | Supabase Auth + `@supabase/ssr` |
| Documents metadata | Supabase Postgres |
| File blobs | Supabase Storage |
| Chat + RAG | FastAPI (Step 4) via `NEXT_PUBLIC_API_URL` |

Frontend keeps **presentational state** local; server state via React Query or similar can be added in Phase 2.

## Animation principles

- Respect `prefers-reduced-motion` (`useReducedMotion` hook).
- Durations: 150–250ms UI, 300–400ms sheets/page transitions.
- Use Framer Motion for chat messages, sheets, skeletons; CSS for button/card hovers.
- No layout-thrashing animations; prefer `transform` and `opacity`.

## Accessibility checklist (per screen)

- Focus order and visible focus rings (token: `--ring`)
- Touch targets ≥ 44×44px on mobile
- `aria-live` for chat streaming and processing status
- Bottom sheets: focus trap, `role="dialog"`, Escape to close
- Color contrast per WCAG AA after Figma colors land

## Figma → code sync checklist

When designs arrive, update in order:

1. `styles/tokens.css` — colors, type scale, spacing, radius, shadows
2. `tailwind` theme mapping in `globals.css` `@theme`
3. Typography component / utility classes
4. Per-screen layout spacing in feature components
5. Icons (export SVGs to `public/icons` or use specified icon set)
6. Empty state illustrations (SVG/Lottie from Figma export)

## File ownership

| Area | Path |
|------|------|
| Routes | `app/` |
| Shared UI | `components/ui/`, `components/layout/` |
| Feature logic + screens | `features/{auth,documents,chat,settings}/` |
| Supabase clients | `services/supabase/` |
| Types | `types/` |
| Hooks | `hooks/` |

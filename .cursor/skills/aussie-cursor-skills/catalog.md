# Aussie Cursor Skills — Catalog

**Install**: `npx skills add aussiegingersnap/cursor-skills --skill <name> -a cursor -g -y`

Upstream: https://github.com/aussiegingersnap/cursor-skills

## Core Workflow

| Skill | Description |
|-------|-------------|
| `feature-build` | Complete feature lifecycle — task selection, design, build loop, analytics, commit/docs |
| `skill-creator` | Guided workflow for creating or updating skills (6 steps) |
| `documentation` | Project documentation standards with metadata headers |
| `versioning` | Semantic versioning with CHANGELOG |
| `judge` | Quality review for complex/multi-file changes before important commits |

## UI & Frontend

| Skill | Description |
|-------|-------------|
| `ui-design-system` | Linear/Notion/Stripe-inspired design system + living style guide |
| `ui-principles` | Minimal, precise UI principles for dashboards and admin interfaces |
| `ui-shadcn-studio` | shadcn/studio components, MCP integration, theme generation, blocks |
| `ui-themes` | tweakcn themes for shadcn/ui + Magic UI animations |
| `nextjs-16` | Next.js 16 patterns — proxy.ts, cache components, App Router |
| `state-effector` | Effector reactive state for React/Next.js |
| `state-tanstack` | TanStack Query (server) + Zustand (client) patterns |

## Backend & Data

| Skill | Description |
|-------|-------------|
| `api-rest` | REST API conventions for Next.js App Router with Zod validation |
| `auth-better-auth` | Better Auth + Drizzle adapter, OAuth, protected routes |
| `auth-lucia` | Lucia auth patterns *(repo only; not in CLI list — manual copy)* |
| `db-postgres` | PostgreSQL with Drizzle ORM, migrations, type-safe queries |
| `db-prisma` | Prisma 7 + PostgreSQL — schema, migrations, Railway deployment |
| `db-sqlite` | SQLite with Prisma + Litestream backup on Railway |
| `nestjs` | NestJS 11 + Fastify, guards, pipes, Railway deployment |

## Infrastructure & Secrets

| Skill | Description |
|-------|-------------|
| `railway` | Railway deploy, logs, env vars, troubleshooting *(repo: `infra-railway`)* |
| `infra-docker` | Docker Compose for local PostgreSQL and services |
| `infra-env` | Environment variable conventions and security for Next.js |
| `secrets-1password` | 1Password CLI for secrets management and injection |
| `mise` | mise.toml tasks, dev tools, environments, hooks *(repo: `tools-mise`)* |

## MCP & AI

| Skill | Description |
|-------|-------------|
| `mcp-apps` | MCP Apps with interactive UI for Claude, ChatGPT, VSCode |

## Tools & Integrations

| Skill | Description |
|-------|-------------|
| `tools-linear` | Linear MCP — issues, tasks, status, labels |
| `tools-email` | Resend API — verification, password reset, DNS, deliverability |
| `tools-posthog` | Freemium/pro features with PostHog flags and usage tracking |
| `tools-repo-review` | GitHub repo analysis for engineering managers |
| `tools-artifacts` | Rich HTML artifacts with React, Tailwind, shadcn/ui |
| `youtube` | yt-dlp — download, transcripts, metadata, playlists *(repo: `tools-youtube`)* |

## Document Skills

Installed via CLI as flat names (source: `document-skills/`):

| Skill | Description |
|-------|-------------|
| `docx` | Word documents — create, edit, tracked changes, comments |
| `pdf` | PDF extract, merge, split, forms |
| `pptx` | PowerPoint — create, edit, layouts, speaker notes |
| `xlsx` | Excel/CSV — formulas, formatting, analysis, charts |

## Install methods summary

| Method | When to use |
|--------|-------------|
| `npx skills add` | Agent-driven install; single skill; CI/scripts |
| Cursor Settings → Remote Rule | Cursor 2.4+ UI; bulk pick from repo |
| Manual `cp -r` / `Copy-Item` | Custom path, air-gapped, or skills not in CLI list |
| MCP `import_skill` | Global skills across all projects; legacy Cursor |

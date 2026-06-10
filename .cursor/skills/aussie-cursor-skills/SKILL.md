---
name: aussie-cursor-skills
description: >-
  Discover, recommend, install, and invoke Cursor agent skills from
  aussiegingersnap/cursor-skills (https://github.com/aussiegingersnap/cursor-skills).
  Use when the user asks to browse, import, or use skills from this collection;
  when a task matches a curated skill (Next.js 16, Drizzle/Prisma, Railway, UI design
  system, feature-build, documents, MCP apps, PostHog, etc.); or when setting up
  skills via Cursor Settings, npx skills CLI, or the repo MCP server.
---

# Aussie Cursor Skills

Curated collection of 33 workflow skills for Next.js, databases, UI, infra, and documents. Prefer installing a proven skill over improvising a multi-step workflow.

**Catalog**: [catalog.md](catalog.md) — full skill index with CLI install names.
**Upstream**: https://github.com/aussiegingersnap/cursor-skills

## Quick workflow

1. **Check what's already installed**
   ```bash
   npx skills list -g -a cursor
   ```
   Also scan `~/.cursor/skills/` and project `.cursor/skills/`.

2. **Match the task** — search [catalog.md](catalog.md) by category or keyword. For live discovery:
   ```bash
   npx skills add aussiegingersnap/cursor-skills --list
   npx skills find <keywords>
   ```

3. **Recommend 1–3 skills** — name, one-line why, and install command. Skip skills already installed unless the user wants an update.

4. **Install on approval** — pick the right method:

   **CLI (preferred for agent installs):**
   ```bash
   npx skills add aussiegingersnap/cursor-skills --skill <skill-name> -a cursor -g -y
   ```
   Use `-g` for personal (`~/.cursor/skills/`), omit for project (`.cursor/skills/`). On Windows, add `--copy` if symlinks fail.

   **Cursor Settings UI (Cursor 2.4+):**
   Settings → Rules → Add Rule → Remote Rule (GitHub) → `https://github.com/aussiegingersnap/cursor-skills` → select skills.

   **Manual copy (single skill):**
   ```bash
   git clone --depth 1 https://github.com/aussiegingersnap/cursor-skills /tmp/cursor-skills
   cp -r /tmp/cursor-skills/skills/<dir-name> ~/.cursor/skills/<skill-name>/
   ```
   Windows (PowerShell):
   ```powershell
   git clone --depth 1 https://github.com/aussiegingersnap/cursor-skills $env:TEMP\cursor-skills
   Copy-Item -Recurse $env:TEMP\cursor-skills\skills\<dir-name> .cursor\skills\<skill-name>\
   ```

   **MCP server (global / legacy):** clone repo, configure `~/.cursor/mcp.json` per upstream README, then use `list_skills`, `import_skill`, `invoke_skill` tools.

5. **Invoke the skill** — after install, read the installed `SKILL.md` and follow its workflow:
   - Personal: `~/.cursor/skills/<skill-name>/SKILL.md`
   - Project: `.cursor/skills/<skill-name>/SKILL.md`
   - Document skills install as `docx`, `pdf`, `pptx`, `xlsx` (not `document-skills/...`)

## CLI vs repo directory names

Some skills use different names in `npx skills` vs the repo folder:

| CLI install name | Repo directory |
|------------------|----------------|
| `railway` | `infra-railway` |
| `mise` | `tools-mise` |
| `youtube` | `tools-youtube` |
| `docx`, `pdf`, `pptx`, `xlsx` | `document-skills/<type>` |

Always use the **CLI name** with `npx skills add --skill`.

## When to suggest a skill

| Signal | Likely skills |
|--------|---------------|
| New feature, multi-phase work | `feature-build` |
| Create or update a skill | `skill-creator` |
| Quality gate before commit | `judge` |
| Next.js 16 / proxy.ts / App Router | `nextjs-16` |
| REST API routes + Zod | `api-rest` |
| Postgres + Drizzle | `db-postgres` |
| Prisma + Postgres or SQLite | `db-prisma`, `db-sqlite` |
| NestJS API / Fastify backend | `nestjs` |
| Better Auth setup | `auth-better-auth` |
| TanStack Query + Zustand | `state-tanstack` |
| Linear/Notion-style UI | `ui-design-system`, `ui-principles` |
| shadcn themes / components | `ui-shadcn-studio`, `ui-themes` |
| Railway deploy / logs / env | `railway` |
| Docker local dev | `infra-docker` |
| Env vars / secrets patterns | `infra-env`, `secrets-1password` |
| MCP interactive UI tools | `mcp-apps` |
| Word / PDF / PPT / Excel | `docx`, `pdf`, `pptx`, `xlsx` |
| PostHog flags / freemium | `tools-posthog` |
| Resend email flows | `tools-email` |
| Linear issues | `tools-linear` |
| Repo analysis for managers | `tools-repo-review` |
| CHANGELOG / semver | `versioning` |
| Project docs standards | `documentation` |

## Recommendation format

```markdown
### Recommended: `<skill-name>`
**Why**: <one sentence tied to the user's task>
**Source**: aussiegingersnap/cursor-skills
**Install**:
\`\`\`bash
npx skills add aussiegingersnap/cursor-skills --skill <skill-name> -a cursor -g -y
\`\`\`
**Already installed?** <yes/no>
```

Offer to install; do not install without user approval.

## Maintenance

```bash
# List all skills in the repo (no install)
npx skills add aussiegingersnap/cursor-skills --list

# Update an installed skill
npx skills update <skill-name> -a cursor

# Remove
npx skills remove <skill-name> -a cursor
```

Refresh [catalog.md](catalog.md) when upstream adds skills (`npx skills add aussiegingersnap/cursor-skills --list`).

## Related resources

- **awesome-cursor-skills** — broader community catalog (65+ skills, marketplace plugins)
- **Create your own** — `/create-skill` or install `skill-creator` from this repo
- **Rules** (always-on) vs **skills** (on-demand workflows)

---
name: awesome-cursor-skills
description: >-
  Discover, recommend, and install Cursor agent skills from the awesome-cursor-skills
  catalog (https://github.com/spencerpauly/awesome-cursor-skills). Use when the user
  asks to find, browse, or install skills; when a task matches a known community skill
  (testing, auth, Stripe, Docker, CI, code review, browser QA, TDD, etc.); or when
  improvising a workflow that an existing skill already encodes.
---

# Awesome Cursor Skills

Curated index of 65+ community skills and marketplace plugins. Prefer installing a proven skill over reinventing a multi-step workflow.

**Catalog**: [catalog.md](catalog.md) — full skill index with install sources.
**Upstream**: https://github.com/spencerpauly/awesome-cursor-skills

## Quick workflow

1. **Check what's already installed**
   ```bash
   npx skills list -g -a cursor
   ```
   Also scan `~/.cursor/skills/` and project `.cursor/skills/`.

2. **Match the task** — search [catalog.md](catalog.md) by category or keyword. For live discovery:
   ```bash
   npx skills add spencerpauly/awesome-cursor-skills --list
   npx skills find <keywords>
   ```

3. **Recommend 1–3 skills** — name, one-line why, and install command. Skip skills already installed unless the user wants an update.

4. **Install on approval** — pick the right source and method:

   **CLI — bundled skills** (65 skills under `resources/`):
   ```bash
   npx skills add spencerpauly/awesome-cursor-skills --skill <skill-name> -a cursor -g -y
   ```

   **CLI — external repo** (see catalog for `owner/repo` + skill name):
   ```bash
   npx skills add <owner/repo> --skill <skill-name> -a cursor -g -y
   ```

   **Cursor Settings UI** (Cursor 2.4+):
   Settings → Rules → Add Rule → Remote Rule (GitHub) → `https://github.com/spencerpauly/awesome-cursor-skills` → select skills.

   **Manual copy** (single skill, no CLI):
   ```bash
   git clone --depth 1 https://github.com/spencerpauly/awesome-cursor-skills /tmp/awesome-cursor-skills
   cp -r /tmp/awesome-cursor-skills/resources/<skill-name> ~/.cursor/skills/<skill-name>/
   ```
   Windows (PowerShell):
   ```powershell
   git clone --depth 1 https://github.com/spencerpauly/awesome-cursor-skills $env:TEMP\awesome-cursor-skills
   Copy-Item -Recurse $env:TEMP\awesome-cursor-skills\resources\<skill-name> $env:USERPROFILE\.cursor\skills\<skill-name>\
   # Project-local:
   Copy-Item -Recurse $env:TEMP\awesome-cursor-skills\resources\<skill-name> .cursor\skills\<skill-name>\
   ```

   **Cursor marketplace plugin** (Vercel, Sentry, Figma, Supabase, etc.):
   Cursor Settings → Plugins → search plugin name. Do not `npx skills add` for plugins.

   **Scope flags**: `-g` = personal (`~/.cursor/skills/`); omit `-g` for project (`.cursor/skills/`).
   **Windows symlinks**: add `--copy` to `npx skills add` if install fails with symlink errors.

5. **Invoke the skill** — after install, read the installed `SKILL.md` and follow its workflow:
   - Personal: `~/.cursor/skills/<skill-name>/SKILL.md`
   - Project: `.cursor/skills/<skill-name>/SKILL.md`

## Install source decision tree

```
Task needs a skill?
├─ Listed in catalog with Source = awesome → npx skills add spencerpauly/awesome-cursor-skills --skill <name>
├─ Listed with external owner/repo → npx skills add <owner/repo> --skill <name>
├─ Listed under Marketplace Plugins → Cursor Settings → Plugins (not npx)
└─ Not in catalog → npx skills find <keywords> or search skills.sh
```

## When to suggest a skill

| Signal | Likely skills |
|--------|---------------|
| Repeated manual checks (lint, types, tests) | `suggesting-cursor-hooks`, `auto-type-checking` |
| Same convention corrected twice | `suggesting-cursor-rules` |
| UI change needs verification | `visual-qa-testing`, `verifying-in-browser`, `responsive-testing` |
| Multiple test failures | `parallel-test-fixing`, `grinding-until-pass` |
| Open PR with failing CI | `babysitting-pr`, `parallel-ci-triage` |
| Large unfamiliar codebase | `codebase-onboarding`, `parallel-exploring` |
| Add auth / Stripe / Sentry / PostHog | `adding-auth`, `adding-stripe`, `adding-error-tracking`, `adding-analytics` |
| New infra (Docker, CI, K8s, Terraform) | `adding-docker`, `setting-up-ci`, `kubernetes-deploying`, `setting-up-terraform` |
| Security or performance audit | `auditing-security`, `auditing-performance`, `parallel-code-review` |
| Create custom skill from a pattern | `building-skills-from-patterns`, or `/create-skill` |

## Recommendation format

```markdown
### Recommended: `<skill-name>`
**Why**: <one sentence tied to the user's task>
**Source**: awesome-cursor-skills | external (`owner/repo`) | marketplace plugin
**Install**:
\`\`\`bash
npx skills add ...
\`\`\`
**Already installed?** <yes/no>
```

Offer to install; do not install without user approval.

## Maintenance

```bash
# List all skills in the catalog repo (no install)
npx skills add spencerpauly/awesome-cursor-skills --list

# Update an installed skill
npx skills update <skill-name> -a cursor

# Remove
npx skills remove <skill-name> -a cursor
```

Refresh [catalog.md](catalog.md) if the upstream README changes significantly.

## Related resources

- **Rules** (always-on conventions) vs **skills** (on-demand workflows) — see catalog "Cursor Resources" section
- **skills.sh** — https://skills.sh/ leaderboard
- **aussie-cursor-skills** — complementary curated collection (Next.js, Drizzle, Railway, UI)
- **Create your own** — `/create-skill` or `building-skills-from-patterns`

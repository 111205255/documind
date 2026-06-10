---
name: webconsulting-skills
description: >-
  Discover, recommend, install, and invoke Cursor agent skills from
  dirnbauer/webconsulting-skills (https://github.com/dirnbauer/webconsulting-skills).
  Use when the user asks to browse, import, or use skills from this collection;
  when a task matches TYPO3, marketing, CRO, security, video, PHP, frontend design,
  platform HIG, documents, legal compliance, or enterprise engineering workflows;
  or when setting up skills via npx skills CLI or install.sh.
---

# Webconsulting Skills

Curated collection of **134** production-focused agent skills for TYPO3, marketing, security, video, frontend, and enterprise engineering. Prefer installing a proven skill over improvising a multi-step workflow.

**Catalog**: [catalog.md](catalog.md) — full skill index by category.
**Upstream**: https://github.com/dirnbauer/webconsulting-skills

> TYPO3 skills primarily target **v14.x** (v14.3 LTS). Verify extension compatibility on Packagist before applying upgrade guidance.

## Quick workflow

1. **Check what's already installed**
   ```bash
   npx skills list -g -a cursor
   ```
   Also scan `~/.cursor/skills/` and project `.cursor/skills/`.

2. **Match the task** — search [catalog.md](catalog.md) by category or keyword. For live discovery:
   ```bash
   npx skills add dirnbauer/webconsulting-skills --list
   npx skills find <keywords>
   ```

3. **Recommend 1–3 skills** — name, one-line why, and install command. Skip skills already installed unless the user wants an update.

4. **Install on approval** — pick the right method:

   **CLI (preferred for one or a few skills):**
   ```bash
   npx skills add dirnbauer/webconsulting-skills --skill <skill-name> -a cursor -g -y
   ```
   Use `-g` for personal (`~/.cursor/skills/`), omit for project (`.cursor/skills/`). On Windows, add `--copy` if symlinks fail.

   **Manual copy (single skill, no CLI):**
   ```bash
   git clone --depth 1 https://github.com/dirnbauer/webconsulting-skills /tmp/webconsulting-skills
   cp -r /tmp/webconsulting-skills/skills/<skill-name> ~/.cursor/skills/<skill-name>/
   ```
   Windows (PowerShell):
   ```powershell
   git clone --depth 1 https://github.com/dirnbauer/webconsulting-skills $env:TEMP\webconsulting-skills
   Copy-Item -Recurse $env:TEMP\webconsulting-skills\skills\<skill-name> .cursor\skills\<skill-name>\
   ```

   **Full collection (all 134 skills, multi-client — upstream recommended):**
   ```bash
   git clone --depth 1 https://github.com/dirnbauer/webconsulting-skills
   cd webconsulting-skills
   ./install.sh
   ```
   Options: `--user-only`, `--project-only`, `--no-sync`. Windows: use Git Bash or WSL. Symlinks whole skill dirs (including `references/`, `scripts/`, `assets/`) to `~/.cursor/skills/` and `.cursor/skills/`.

   **Composer (TYPO3 projects):**
   ```bash
   composer require --dev webconsulting/webconsulting-skills:dev-main
   ```
   Auto-runs `install.sh` after install.

   **Cursor Settings UI (Cursor 2.4+):**
   Settings → Rules → Add Rule → Remote Rule (GitHub) → `https://github.com/dirnbauer/webconsulting-skills` → select skills.

5. **Invoke the skill** — after install, read the installed `SKILL.md` and follow its workflow:
   - Personal: `~/.cursor/skills/<skill-name>/SKILL.md`
   - Project: `.cursor/skills/<skill-name>/SKILL.md`
   - Manual invoke in chat: `/typo3-content-blocks`, `/seo-audit`, etc.

## When to suggest a skill

| Signal | Likely skills |
|--------|---------------|
| TYPO3 extension, Content Blocks, v14 upgrade | `typo3-content-blocks`, `typo3-update`, `typo3-rector`, `typo3-extension-upgrade` |
| TYPO3 testing, CI matrix, PHPUnit | `typo3-testing`, `enterprise-readiness` |
| TYPO3 SEO, accessibility, security | `typo3-seo`, `typo3-accessibility`, `typo3-security` |
| DDEV local TYPO3 dev | `typo3-ddev` |
| Vite + Bootstrap TYPO3 frontend | `typo3-vite` |
| Solr search in TYPO3 | `typo3-solr` |
| Marketing copy, landing pages, CRO | `copywriting`, `cro`, `marketing-skills` |
| SEO audit, programmatic SEO, AI search | `seo-audit`, `programmatic-seo`, `ai-seo`, `ai-search-optimization` |
| Paid ads, ad creative | `ads`, `ad-creative` |
| Security audit, incident report | `security-audit`, `security-incident-reporting` |
| PHP modernization, Rector, PHPStan | `php-modernization`, `typo3-rector` |
| React/Next.js performance | `react-best-practices` |
| shadcn/ui setup | `shadcn-ui`, `typo3-shadcn-content-elements` |
| Video (Remotion, HyperFrames) | `remotion-best-practices`, `hyperframes`, `video` |
| Architecture diagrams | `excalidraw` |
| Postgres query optimization | `postgres-best-practices` |
| Code review before ship | `autoreview` |
| Debug hard bugs | `diagnose`, `tdd` |
| Create or improve a skill | `skill-creator`, `write-a-skill` |
| Austrian legal / Impressum | `legal-impressum` |
| iOS/Android/macOS HIG | `ios-design`, `android-design`, `macos-design` |
| Library docs lookup | `context7` |
| Web scraping / research | `firecrawl` |
| Find any skill in ecosystem | `find-skills` |

## Recommendation format

```markdown
### Recommended: `<skill-name>`
**Why**: <one sentence tied to the user's task>
**Source**: dirnbauer/webconsulting-skills
**Install**:
\`\`\`bash
npx skills add dirnbauer/webconsulting-skills --skill <skill-name> -a cursor -g -y
\`\`\`
**Already installed?** <yes/no>
```

Offer to install; do not install without user approval.

## Maintenance

```bash
# List all skills in the repo (no install)
npx skills add dirnbauer/webconsulting-skills --list

# Update an installed skill
npx skills update <skill-name> -a cursor

# Remove
npx skills remove <skill-name> -a cursor

# Full collection update (if cloned)
cd webconsulting-skills && git pull && ./update.sh

# Regenerate manifests only (no symlink deploy)
./install.sh --generate-only
```

Refresh [catalog.md](catalog.md) when upstream adds skills (`npx skills add dirnbauer/webconsulting-skills --list`).

## Related resources

- **awesome-cursor-skills** — broader community catalog (testing, auth, CI, browser QA)
- **aussie-cursor-skills** — Next.js, Drizzle, Railway, UI design system skills
- **Create your own** — `/create-skill` or install `skill-creator` / `write-a-skill` from this repo
- **Rules** (always-on) vs **skills** (on-demand workflows)

---
name: cursor-security-rules
description: >-
  Install, configure, and apply Cursor Security Rules from matank001/cursor-security-rules.
  Use when setting up AI security guardrails, auditing code for dangerous flows, reviewing
  security-sensitive changes (auth, file upload, SQL, SSRF, path traversal, MCP usage),
  or when the user mentions cursor-security-rules, secure coding rules, or AI agent security.
---

# Cursor Security Rules

Guardrails for AI-assisted development from [matank001/cursor-security-rules](https://github.com/matank001/cursor-security-rules). Rules live as `.mdc` files in `.cursor/rules/` and are enforced by Cursor during code generation and review.

## Quick Start

### Check if rules are installed

```bash
ls .cursor/rules/cursor-security-rules/
```

Expected: 15+ `.mdc` files including `secure-development-principles.mdc`, `dangerous-flows.mdc`, and language-specific rules.

### Install or update

**Option A — clone into rules directory (recommended):**

```bash
mkdir -p .cursor/rules
git clone https://github.com/matank001/cursor-security-rules.git .cursor/rules/cursor-security-rules
```

**Option B — sync all rules (Windows / no git clone):**

```powershell
.cursor/skills/cursor-security-rules/scripts/sync-rules.ps1
```

**Option C — update git clone install:**

```bash
cd .cursor/rules/cursor-security-rules && git pull origin main
```

**Option D — copy single rule from upstream:**

```bash
curl -o .cursor/rules/cursor-security-rules/xxe-prevention.mdc \
  https://raw.githubusercontent.com/matank001/cursor-security-rules/main/xxe-prevention.mdc
```

After install, restart Cursor or reload the window so rules are picked up.

## Rule Layers

Rules stack in three tiers. Read the relevant `.mdc` file before writing or reviewing security-sensitive code.

| Tier | When applied | Rules |
|------|--------------|-------|
| **Always-on** | Every session | `secure-development-principles`, `secure-sql-usage`, `ssrf-prevention`, `path-traversal-prevention`, `secure-mcp-usage` |
| **Language** | Matching file globs | `secure-dev-{python,node,go,rust,ruby,php,c,c-sharp,java}` |
| **On-demand** | Agent reads when triggered | `dangerous-flows`, `xxe-prevention` |

Full catalog with globs and topics: [rules-catalog.md](rules-catalog.md)

## When to Use This Skill

| User intent | Action |
|-------------|--------|
| "Set up security rules" | Install rules (above), verify always-on rules have `alwaysApply: true` |
| "Audit this code for vulnerabilities" | Run **Dangerous Flow Audit** (below) |
| "Review my PR for security" | Checklist below + language rule for changed files |
| Writing auth, uploads, URLs, SQL, shell, MCP | Read matching always-on + language rule first |
| "Update security rules" | Run `scripts/sync-rules.ps1` or `git pull` in rules dir |

## Dangerous Flow Audit

Read `.cursor/rules/cursor-security-rules/dangerous-flows.mdc` first, then:

```
Audit Progress:
- [ ] 1. Scope — confirm target (endpoint, feature, file, or full app)
- [ ] 2. Find inputs — routes, forms, CLI args, env, webhooks, stored DB fields
- [ ] 3. Trace flows — follow each input to sinks (shell, fs, SQL, render, fetch)
- [ ] 4. Flag risks — document source → path → sink → vulnerability class
- [ ] 5. Propose fixes — allow-lists, parameterization, validation, least privilege
- [ ] 6. Verify — no raw user input in sensitive operations
```

### Finding inputs

| Stack | Look for |
|-------|----------|
| Web/API | Route handlers, `req.body/query/params`, middleware, webhooks |
| Python/FastAPI | `@app.route`, `Request`, Pydantic models with untrusted fields |
| Next.js | Server Actions, API routes, `searchParams`, form data |
| CLI | `process.argv`, `argparse`, `input()`, stdin |
| Second-order | DB rows, config files, cached values reused unsafely |

### Dangerous sinks (flag if fed tainted input)

- **Shell**: `exec`, `spawn`, `subprocess`, `system`
- **Filesystem**: `readFile`, `writeFile`, `open`, `path.join` with user segments
- **SQL**: string-interpolated queries, unparameterized ORM calls
- **Render**: template/HTML output without escaping
- **Network**: `fetch`, `axios`, `requests.get` with user-controlled URLs (SSRF)
- **Dynamic code**: `eval`, `Function`, `pickle.load`, unsafe deserialization

### Finding template

For each issue:

```markdown
### [Severity] Vulnerability class — brief title

**Flow**: `[source file:line]` → `[intermediate]` → `[sink file:line]`
**Risk**: What an attacker can do
**PoC input**: Concrete malicious value (e.g. `?file=../../etc/passwd`)
**Fix**: Specific code change with allow-list / parameterization / validation
**Rule triggered**: e.g. path-traversal-prevention §1
```

Severity: **Critical** (RCE, auth bypass, data exfil) · **High** (injection, SSRF) · **Medium** (XSS, info leak) · **Low** (defense-in-depth gap)

## Pre-Merge Security Checklist

- [ ] No secrets in client code, logs, or committed config
- [ ] User input validated before file paths, URLs, SQL, or shell use
- [ ] Outbound requests block private IP ranges (SSRF)
- [ ] Auth/authorization enforced server-side, not client-only
- [ ] MCP tools do not auto-run shell commands or exfiltrate credentials
- [ ] Violations cite which rule was triggered and why

## Writing Secure Code

When generating security-sensitive code:

1. Read the always-on rules (already in context when `alwaysApply: true`)
2. Read the language rule for the file extension being edited
3. On violations, add a comment naming the rule and the safe alternative
4. Prefer allow-lists over block-lists; parameterized queries over string concat

## Project Layout

```
.cursor/
├── rules/
│   └── cursor-security-rules/   # upstream .mdc rules (git clone)
│       ├── secure-development-principles.mdc
│       ├── dangerous-flows.mdc
│       └── secure-dev-*.mdc
└── skills/
    └── cursor-security-rules/     # this skill
        ├── SKILL.md
        ├── rules-catalog.md
        └── scripts/
            └── sync-rules.ps1
```

Rules (`.mdc`) are enforced by Cursor. This skill (`.cursor/skills/`) teaches the agent how to install, audit, and apply them.

## Personal vs Project Scope

| Location | Path | Use when |
|----------|------|----------|
| Project | `.cursor/skills/cursor-security-rules/` | Team shares rules + skill via repo |
| Personal | `~/.cursor/skills/cursor-security-rules/` | Same workflow across all projects |

Copy this skill directory to `~/.cursor/skills/` for global availability.

## Upstream

- Repo: https://github.com/matank001/cursor-security-rules
- License: MIT
- Authors: Matan Kotick & Amit Ziv (AI agent security researchers)

To contribute improvements upstream, fork and PR to the repo above.

# Cursor Security Rules — Catalog

Source: [matank001/cursor-security-rules](https://github.com/matank001/cursor-security-rules)

Local path: `.cursor/rules/cursor-security-rules/<file>.mdc`

## Always-On Rules (`alwaysApply: true`)

Apply to all code regardless of language. Keep these enabled in every project.

| File | Topics |
|------|--------|
| `secure-development-principles.mdc` | No raw input in sensitive ops, no secrets in frontend, HTTPS only, no dynamic code exec, validate input, no sensitive logs, no bypassing controls, server-side auth, no hardcoded credentials |
| `secure-sql-usage.mdc` | Parameterized queries, input validation, least-privilege DB accounts, no raw DB errors to users |
| `ssrf-prevention.mdc` | Block user-controlled URLs, validate resolved IPs, HTTP/HTTPS only, safe ports, no auth header forwarding |
| `path-traversal-prevention.mdc` | Never use raw input in paths, validate with allow-lists, safe upload filenames, test traversal payloads |
| `secure-mcp-usage.mdc` | No auto shell exec from MCP, no PII/credentials in MCP params, require human approval for sensitive ops |

## Language-Specific Rules (glob-triggered)

Activated when editing matching files. Set `alwaysApply: false` and appropriate `globs`.

| File | Globs | Focus |
|------|-------|-------|
| `secure-dev-python.mdc` | `**/*.py`, `**/*.ipynb` | `subprocess`, pickle, Jinja2, Django/Flask patterns |
| `secure-dev-node.mdc` | `**/*.ts`, `**/*.tsx`, `**/*.js` | Express, prototype pollution, NoSQL injection, XSS |
| `secure-dev-golang.mdc` | `**/*.go` | Goroutines, `html/template`, SQL, crypto |
| `secure-dev-rust.mdc` | `**/*.rs` | Unsafe blocks, FFI, deserialization |
| `secure-dev-ruby.mdc` | `**/*.rb`, `**/*.erb` | Rails mass assignment, ERB escaping |
| `secure-dev-php.mdc` | `**/*.php` | `include`, `eval`, type juggling |
| `secure-dev-c.mdc` | `**/*.c`, `**/*.h` | Buffer overflows, format strings |
| `secure-dev-c-sharp.mdc` | `**/*.cs`, `**/*.csproj` | Deserialization, LINQ injection |
| `secure-dev-java.mdc` | `**/*.java` | Deserialization, JNDI, Spring Security patterns |

## On-Demand Rules (agent-requestable)

Read explicitly when the task requires them. Set `alwaysApply: false`.

| File | Trigger |
|------|---------|
| `dangerous-flows.mdc` | Security audit, trace untrusted input to dangerous sinks, penetration-style review |
| `xxe-prevention.mdc` | XML parsing, SOAP, SVG upload, document ingestion |

## Recommended Frontmatter

**Always-on example:**

```yaml
---
description:
globs:
alwaysApply: true
---
```

**Language rule example:**

```yaml
---
description:
globs: **/*.py,**/*.ipynb
alwaysApply: false
---
```

**On-demand example:**

```yaml
---
description: When you wish to test the currently implemented logic for dangers and insecure flows
globs:
alwaysApply: false
---
```

## Documind Stack Mapping

This monorepo uses Python (backend), TypeScript (web + mobile). Relevant rules:

| Area | Rules to enforce |
|------|------------------|
| `backend/` | `secure-dev-python`, `secure-sql-usage`, `ssrf-prevention`, `path-traversal-prevention` |
| `apps/web/`, `apps/mobile/` | `secure-dev-node`, `secure-development-principles` (no secrets in client) |
| URL document ingest | `ssrf-prevention`, `dangerous-flows` |
| File upload | `path-traversal-prevention`, `dangerous-flows` |
| Supabase / RAG API | `secure-sql-usage`, `secure-development-principles` |
| MCP integrations | `secure-mcp-usage` |

## Sync Check

Compare local install to upstream:

```bash
# List upstream files
curl -s https://api.github.com/repos/matank001/cursor-security-rules/contents/ \
  | grep '"name".*\.mdc"'

# List local files
ls .cursor/rules/cursor-security-rules/*.mdc
```

To refresh all rules from upstream, run `scripts/sync-rules.ps1`.

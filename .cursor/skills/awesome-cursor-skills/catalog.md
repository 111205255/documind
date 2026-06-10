# Awesome Cursor Skills — Catalog

Install bundled skills: `npx skills add spencerpauly/awesome-cursor-skills --skill <name> -a cursor -g -y`

## Cursor-Native

| Skill | Description | Source |
|-------|-------------|--------|
| `suggesting-cursor-rules` | Encode repeated conventions into `.cursor/rules/` | awesome |
| `suggesting-cursor-hooks` | Automate repeated checks via `.cursor/hooks.json` | awesome |
| `switching-projects` | Switch workspace via cursor-app-control MCP | awesome |
| `saving-workspace-context` | Persist research/decisions across conversations | awesome |
| `visual-qa-testing` | Browser screenshots, console, network audit | awesome |
| `verifying-in-browser` | Dev server + side-by-side browser verification | awesome |
| `profiling-performance` | CPU profiling via Cursor browser profiler | awesome |
| `screenshotting-changelog` | Visual before/after PR screenshots | awesome |
| `best-of-n-solving` | Parallel git worktrees, pick best solution | awesome |
| `parallel-exploring` | Parallel read-only subagents for codebase exploration | awesome |
| `grinding-until-pass` | Iterate until tests/build/lint pass | awesome |
| `finding-dev-server-url` | Scan terminals for dev server URLs | awesome |
| `monitoring-terminal-errors` | Watch process crashes, fix stack traces | awesome |
| `detecting-port-conflicts` | Resolve EADDRINUSE port conflicts | awesome |
| `tailing-build-output` | Stream build warnings/errors, fix early | awesome |
| `responsive-testing` | Screenshot mobile/tablet/desktop viewports | awesome |
| `dark-mode-testing` | Light/dark mode screenshot comparison | awesome |
| `accessibility-auditing` | ARIA tree audit for a11y issues | awesome |
| `form-testing` | Fill/submit forms with valid/invalid data | awesome |
| `parallel-test-fixing` | Parallel subagents fix multiple test failures | awesome |
| `codebase-onboarding` | Parallel explore → onboarding doc | awesome |
| `comparing-branches-visually` | Visual diff across branches on different ports | awesome |
| `auto-type-checking` | Run `tsc --noEmit` after edits | awesome |
| `suggesting-skills` | Suggest installing skills for matching tasks | awesome |
| `parallel-ci-triage` | Parallel subagents fix failing CI jobs | awesome |
| `parallel-code-review` | 4 parallel review lenses merged into one report | awesome |
| `network-request-auditing` | Flag failed/slow/duplicate network requests | awesome |
| `recording-browser-flow-as-test` | Record browser flow → Playwright spec | awesome |
| `building-skills-from-patterns` | Turn repeated workflows into new SKILL.md | awesome |

## Analytics & Tracking

| Skill | Description | Source |
|-------|-------------|--------|
| `adding-analytics` | PostHog events, page views, flags, replay | awesome |
| `adding-feature-flags` | Feature flags (PostHog or local) | awesome |
| `posthog-llm-analytics` | LLM token/latency/cost tracking | `PostHog/skills` |
| `posthog-migrations` | Migrate from Amplitude/Mixpanel/GA | `PostHog/skills` |

## Error Tracking

| Skill | Description | Source |
|-------|-------------|--------|
| `adding-error-tracking` | Sentry crashes, perf, source maps | awesome |

## Auth & Payments

| Skill | Description | Source |
|-------|-------------|--------|
| `adding-auth` | OAuth, sessions, protected routes (Auth.js) | awesome |
| `adding-stripe` | Checkout, subscriptions, webhooks | awesome |

## Testing

| Skill | Description | Source |
|-------|-------------|--------|
| `adding-e2e-tests` | Playwright setup + CI | awesome |
| `writing-tests` | Unit/integration tests with mocking | awesome |
| `python-tdd-with-uv` | Python TDD with uv | awesome |
| `mattpocock-tdd` | Vertical-slice TDD for agents | `mattpocock/skills` |
| `anthropic-webapp-testing` | Browser testing with screenshots | `anthropics/skills` |
| `api-smoke-testing` | Hit every API route, report errors | awesome |

## Workflow

| Skill | Description | Source |
|-------|-------------|--------|
| `babysitting-pr` | Keep PR merge-ready (CI, comments, conflicts) | awesome |
| `creating-pr` | Conventional PR titles and descriptions | awesome |
| `writing-commit-messages` | Conventional commits | awesome |
| `incident-response` | Triage, mitigate, postmortem | awesome |
| `systematic-debugging` | Reproduce, isolate, bisect, verify | awesome |
| `chatcrystal` | Local-first session memory via MCP | `ZengLiangYi/ChatCrystal` |

## Infrastructure & DevOps

| Skill | Description | Source |
|-------|-------------|--------|
| `adding-docker` | Dockerfile, compose, .dockerignore | awesome |
| `setting-up-ci` | GitHub Actions CI/CD | awesome |
| `setting-up-terraform` | IaC with modules and remote state | awesome |
| `antonbabenko-terraform` | Terraform/OpenTofu production patterns | `antonbabenko/terraform-skill` |
| `kubernetes-deploying` | K8s Deployments, Ingress, autoscaling | awesome |

## Code Quality & Security

| Skill | Description | Source |
|-------|-------------|--------|
| `reviewing-code` | Correctness, maintainability, performance | awesome |
| `auditing-security` | OWASP Top 10, secrets exposure | awesome |
| `auditing-performance` | Bundle, rendering, queries, CWV | awesome |
| `sentry-code-simplifier` | Refactor for clarity | `getsentry/skills` |
| `sentry-find-bugs` | Scan branch for bugs/vulns | `getsentry/skills` |
| `sentry-code-review` | Sentry engineering review practices | `getsentry/skills` |
| `sentry-security-review` | Injection, XSS, auth bypass, IDOR | `getsentry/skills` |
| `sentry-django-perf-review` | Django N+1, caching, serialization | `getsentry/skills` |
| `sentry-skill-scanner` | Scan skills for prompt injection risks | `getsentry/skills` |
| `verifying-markdown-formatting` | Markdown style consistency | awesome |
| `fixing-broken-links` | Crawl and fix broken URLs | awesome |

## Dependencies

| Skill | Description | Source |
|-------|-------------|--------|
| `updating-npm-package` | Safe npm updates with migration guides | awesome |

## Frontend & UI

| Skill | Description | Source |
|-------|-------------|--------|
| `using-ui-stack` | Design system enforcement (grid, tokens, dark mode) | awesome |
| `converting-css-to-tailwind` | CSS → Tailwind utilities | awesome |
| `converting-css-modules-to-tailwind` | CSS Modules → Tailwind migration | awesome |
| `anthropic-frontend-design` | Polished production UI | `anthropics/skills` |
| `shadcn-ui` | shadcn component management | ui.shadcn.com docs |
| `vercel-react-best-practices` | React/Next.js performance rules | `vercel-labs/agent-skills` |
| `vercel-web-design-guidelines` | Accessibility, UX, perf audit | `vercel-labs/agent-skills` |
| `vercel-react-view-transitions` | View Transitions API in React | `vercel-labs/agent-skills` |
| `vercel-composition-patterns` | Server/client composition patterns | `vercel-labs/agent-skills` |
| `react-native-patterns` | Expo/RN navigation and performance | awesome |

## Planning & Architecture

| Skill | Description | Source |
|-------|-------------|--------|
| `mattpocock-prd-to-issues` | PRD → GitHub issues | `mattpocock/skills` |
| `mattpocock-improve-architecture` | Architecture improvement proposals | `mattpocock/skills` |
| `mattpocock-grill-me` | Challenge assumptions before committing | `mattpocock/skills` |
| `anthropic-mcp-builder` | Build MCP servers | `anthropics/skills` |
| `architecture-decision-records` | Write ADRs | awesome |
| `database-design` | Schema design, indexes, ORM setup | awesome |

## Documentation

| Skill | Description | Source |
|-------|-------------|--------|
| `adding-api-docs` | OpenAPI/Swagger + interactive UI | awesome |
| `anthropic-doc-coauthoring` | Co-author technical docs | `anthropics/skills` |
| `anthropic-docx` | Generate Word documents | `anthropics/skills` |
| `anthropic-pdf` | Generate PDFs | `anthropics/skills` |
| `anthropic-pptx` | Generate PowerPoint | `anthropics/skills` |
| `anthropic-xlsx` | Generate Excel spreadsheets | `anthropics/skills` |

## Utilities

| Skill | Description | Source |
|-------|-------------|--------|
| `exporting-to-png` | Export snippets/UI to PNG | awesome |
| `generating-images` | OpenAI image generation/editing | awesome |
| `prompt-engineering` | System prompts, few-shot, CoT | awesome |
| `seo-auditing` | Technical SEO audit | awesome |
| `seo-analysis` | Full SEO audit + 30-day plan | `nowork-studio/toprank` |
| `writing-copy` | Marketing copy | awesome |
| `concise` | Chinese-first concise agent replies | `Cpp1022/concise` |

## Marketplace Plugins

Install via **Cursor Settings → Plugins** (not `npx skills`):

| Plugin | Notable skills |
|--------|----------------|
| Vercel | `ai-architect`, `deployment-expert`, `performance-optimizer` + 25 more |
| Sentry | `sentry-code-review`, `sentry-browser-sdk` + 26 more |
| Figma | `generate-design`, `code-connect-components` + 5 more |
| Stripe | `stripe-best-practices`, `upgrade-stripe` |
| Firebase | `firebase-auth-basics`, `firebase-ai-logic` + 9 more |
| Linear, Slack, Datadog, Shopify, dbt Labs, Elastic, Postman, Sanity, Langfuse, GitLab, Miro, AWS Amplify, Superpowers, Parallel, Tavily, and more | See upstream README |

## Cursor Resources

| Resource | URL |
|----------|-----|
| Cursor Skills docs | https://docs.cursor.com/agent/skills |
| Agent Skills spec | https://agentskills.io |
| skills.sh leaderboard | https://skills.sh |
| awesome-cursorrules | https://github.com/PatrickJS/awesome-cursorrules |
| npx skills CLI | https://github.com/vercel-labs/skills |
| Anthropic skill-creator | `anthropics/skills` → `skill-creator` |

**Source key**: `awesome` = `spencerpauly/awesome-cursor-skills`; external = `npx skills add <owner/repo> --skill <name>`

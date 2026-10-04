<!-- © Janus — yashxsanjay -->
# AGENTS.md — Janus Project Rulebook

> Single source of truth for the main agent and every subagent. Read this file before any task. If CLAUDE.md is your entry point, you were directed here — follow everything below.

---

## 1. Project Overview

**Janus** is a tech-niche social + professional network — a hybrid of Instagram and LinkedIn — for people in AI, ML, engineering, and science. Core idea: **"proof of work → hiring."** Builders post 30–45 second project demos; those demos act as their resume. Companies post jobs; candidates apply with a demo.

- **Brand:** black-blue gradient, dark by default, privacy-first.
- **Team:** Yash (non-technical founder/leader) + 1 junior dev + Claude Code.
- **Users:** builders (engineers, ML researchers, scientists) and companies.
- **Source of truth:** `Context/User-Provided/BLUEPRINT.md` — read it for scope, stack, architecture, security, and roadmap questions. Never edit it.

---

## 2. Session Protocol

**At the start of every session or task:**
1. Read `AGENTS.md` (this file).
2. Read the **Current Architecture** section and the latest 3 entries of `Context/Agent-Written/planning.md`.
3. Read **Next Up** and the latest 5 entries of `Context/Agent-Written/logbook.md`.
4. Check `Context/User-Provided/` for anything relevant to the task. Consult `BLUEPRINT.md` for scope questions.

**At the end of every task:**
1. Update `Context/Agent-Written/logbook.md` (and `planning.md` if a BIG change happened).
2. Update **Next Up** in `logbook.md`.
3. Update `docs/SECURITY.md` if auth, RLS, uploads, secrets, or headers changed.

Because of this protocol, it is safe to `/clear` between unrelated tasks — the context files carry continuity. Prefer `/clear` to save usage.

---

## 3. Context System

### Folder layout

```
Context/
├─ Agent-Written/
│   ├─ planning.md     # BIG changes + current architecture (maps to ARCHITECTURE.md + DECISIONS.md)
│   └─ logbook.md      # feature-level change log (maps to CHANGELOG.md)
└─ User-Provided/
    ├─ README.md
    └─ BLUEPRINT.md    # founder-provided — never edit
AGENTS.md              # this file — single source of truth for all agent rules
CLAUDE.md              # thin pointer to AGENTS.md
docs/
└─ SECURITY.md         # living security checklist
.claude/agents/        # subagent definitions
```

Do **not** create `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, or `CHANGELOG.md`. Wherever the blueprint references those, use `planning.md` and `logbook.md` instead.

### BIG vs FEATURE classification

A change is **BIG** if it touches any of:
- anything in `src/core/` (core is stable)
- tech stack, hosting, or third-party service choices
- folder structure, module boundaries, or the module registry / event bus contract
- database schema design, RLS strategy, or the expand → migrate → contract process for a rename
- the `StorageProvider` interface, entitlements (`can(actor, feature)`), or watermark system
- adding a new module, or turning a module's feature flag ON in production
- major dependency additions or replacements
- any deviation from `BLUEPRINT.md`

A change is **FEATURE-level** if it is: a new feature inside an existing module, enhancement, bug fix, local refactor, UI change, test addition, or CI tweak.

For BIG changes: write the `planning.md` entry as **Proposed**, explain it in plain language, and **wait for approval** before implementing. Mark it **Accepted** once approved.

If a change is both BIG and FEATURE-level, write a `planning.md` entry for the decision and a `logbook.md` entry for the implementation, referencing each other.

Trivial changes (typos, formatting) need no log entry.

### planning.md entry template

```markdown
### [YYYY-MM-DD] <Short title>
- **Status:** Proposed | Accepted | Superseded by <entry>
- **Context:** Why this change was needed
- **Decision:** What was decided
- **Alternatives considered:** What else was evaluated and why it was rejected
- **Impact:** Files/modules/tables affected, migration notes, risks
- **Blueprint deviation:** None | <what differs from BLUEPRINT.md and why>
```

### logbook.md entry template

```markdown
### [YYYY-MM-DD] <Feature or change name>
- **Type:** Feature | Enhancement | Bug fix | Refactor | Test | CI
- **Module:** <module id or "shared" / "app">
- **Flag:** <flag name and state, or "n/a">
- **Summary:** What changed, in 1–3 sentences
- **Files touched:** Key files
- **Tests:** What was added/run and the result
- **Notes / follow-ups:** Known issues, TODOs, things the next agent should know
```

---

## 4. Hard Constraints

- **Budget is ₹0:** free tiers only, and only services whose free plan allows commercial use. Do NOT use Vercel Hobby (personal/non-commercial only).
- **Team time is under 10 hours/week combined (~8 build-hours).** Follow the MVP scope and cut list in the blueprint. Do not add out-of-scope features. If behind schedule, cut in this order: likes → tag filter → email notifications → applicant filters → PWA polish.
- **Web first (PWA).** Android APK later via Capacitor. No native iOS.
- **Never claim "end-to-end encrypted"** anywhere in UI or copy until E2E messaging is actually built and independently reviewed.
- If a free-tier limit, price, or policy might have changed, say so and direct the team to verify on the official page.

---

## 5. Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React + Vite + TypeScript + Tailwind (PWA) | |
| Backend | Supabase (Postgres, Auth, RLS, Edge Functions) | 2 projects: `janus-dev`, `janus-prod` |
| Hosting | Cloudflare Pages | Not Vercel |
| Video storage | Supabase Storage → Cloudflare R2 | R2 adapter before beta |
| Bot protection | Cloudflare Turnstile | Signup only |
| Email | Supabase default (dev) → Resend or Brevo | |
| Analytics | PostHog free tier | |
| Error tracking | Sentry free | |
| CI/CD | GitHub Actions | |
| Package manager | pnpm | |
| Testing | Vitest + Testing Library + Playwright | |
| DB testing | pgTAP via `supabase test db` | |

No Docker. No local Supabase — use `janus-dev` project. If you believe an alternative is clearly better under the constraints, propose it as a `planning.md` entry before changing anything.

---

## 6. Architecture Rules (non-negotiable)

1. **Modular structure:** `src/core` (stable), `src/modules/<name>` (each with `module.ts` manifest, routes, api, components, tests), `src/shared`, `src/app`, `config/*.json`.
2. **Modules NEVER import each other.** They communicate only through the core event bus or a module's public `index.ts`.
3. **Every module has a manifest:** id, version, routes, nav items, required flag, events.
4. **Every module sits behind a feature flag** in `config/features.json`. New features ship OFF.
5. **DB migrations are additive only,** named `NNNN_<module>_<what>.sql`. Each module owns its tables. To rename or remove, use expand → migrate → contract (a BIG change).
6. **Generic `content` table** (`type` + `metadata jsonb`) for demos/posts/announcements. `jobs` and `applications` get dedicated tables.
7. **Everything configurable lives in config files:** theme tokens, categories, plans, flags, brand. No hardcoding.
8. **Storage goes through a `StorageProvider` interface** (Supabase now, R2 later). UI never knows which storage is active.
9. **Build `plans` / `subscriptions` / `can(actor, feature)` structure early,** checked in both UI and server (RLS/RPC). Write NO payment code in the MVP.
10. **Do not modify `src/core`** without a `planning.md` entry and explicit approval.
11. **Every module ships with tests.** CI must pass before anything is merged.

**Adding a feature:** new folder → manifest → additive migration → flag OFF → tests → review → flag ON. Never rewrite existing modules to add a new one.

---

## 7. Security Rules

*(Details and status checkboxes in `docs/SECURITY.md`)*

- Auth only through Supabase Auth (email, GitHub, Google). Email verification on. No custom password handling.
- RLS enabled on every table, default deny, with pgTAP tests (`supabase test db`) for each policy.
- The `service_role` key never reaches the client. Secrets only in env or Cloudflare secrets. `.env` is gitignored; keep `.env.example` updated. gitleaks as a pre-commit check.
- Validate all input with zod. Never use `dangerouslySetInnerHTML`. Sanitize user-supplied links.
- Uploads: allowlist MIME types (mp4/webm, jpg/png/webp), enforce 25 MB size and 45 s duration caps, random filenames, strip image EXIF.
- Turnstile on signup, rate limiting, security headers (CSP, HSTS, nosniff, Referrer-Policy) via Cloudflare Pages `_headers`. HTTPS only.
- Report/block and admin takedown.
- Dependabot and `npm audit` in CI.
- No passwords, tokens, or personal data in logs.
- Never write your own cryptography.
- Keep `docs/SECURITY.md` current, organized by Level 1 / Level 2 / Level 3, with a checkbox per item.

---

## 8. Watermark Rules

Mark ID `yashxsanjay` lives in `config/brand.json` and is used only through `src/core/watermark`.

| Layer | What | When |
|---|---|---|
| A: Ownership | `© Janus — yashxsanjay` header in every source file, proprietary LICENSE (All rights reserved) | Day 1 |
| B: Web | `<meta name="janus-wm">`, HTML comment, and zero-width-character encoding of the ID in a few fixed UI strings and email templates | MVP (week 10) |
| C: Media | Invisible image watermark on avatars/thumbnails via offline script | Phase 2 |

Rules:
- Layer A header goes in every `.ts`, `.tsx`, `.sql`, `.json` (config only) file created.
- Layer B: never in user-copyable or searchable text.
- Layer C: video watermark is skipped for MVP.
- Privacy Policy/Terms must mention that uploaded media may carry an invisible provenance mark.

---

## 9. Subagents

Every subagent's system prompt must begin with:
> *"Read AGENTS.md first. Check Context/User-Provided/ for anything relevant. Follow the context system rules."*

| Subagent | Model | Tools | Job | Context duty |
|---|---|---|---|---|
| `janus-architect` | sonnet | read-only | Plans BIG changes, designs modules, draws Mermaid diagrams. Never edits code. | Drafts **Proposed** planning.md entries |
| `ui-builder` | sonnet | edit | UI with Tailwind, shadcn/ui, Lucide; theme tokens only, no hardcoded colors | Logbook entry when done |
| `supabase-db` | sonnet | edit + bash | Migrations, RLS policies, pgTAP tests | Planning entry for schema design; logbook for policy tweaks |
| `feature-builder` | sonnet | edit + bash | Implements scoped features inside one module, following module rules | Logbook entry when done |
| `test-writer` | sonnet | edit + bash | Vitest, Testing Library, Playwright; fixes failures without weakening test intent | Notes test results in logbook entry |
| `security-reviewer` | sonnet | read-only | Reviews diffs for RLS coverage, secret leaks, validation, upload safety, XSS, authz bypass. Reports by severity with file/line and a minimal fix. | Flags items to update in SECURITY.md |
| `code-reviewer` | sonnet | read-only | Reviews readability, duplication, module boundaries, AGENTS.md compliance | None (reports only) |
| `devops-ci` | sonnet | edit + bash | GitHub Actions, Cloudflare Pages, keep-alive Action, `_headers` | Planning entry for pipeline/hosting changes |
| `docs-keeper` | haiku | edit (docs only) | Keeps planning.md, logbook.md, SECURITY.md, and Next Up accurate and in template format | Owns all context files |

**Delegation rules:**
- Use `janus-architect` before any BIG change.
- Use `security-reviewer` after any change to auth, RLS, uploads, secrets, headers, or payments.
- Use `code-reviewer` before every merge.
- Use `docs-keeper` (or update the files directly) before declaring any task done.
- Run independent reviewers in parallel when it saves time.

---

## 10. Working Agreement

- **Plan first.** Before coding each task, post a short plan (files to touch, BIG or FEATURE, risks, tests) and wait for approval.
- Small PRs, one concern each. Commit format: `type(scope): summary` (feat, fix, refactor, docs, test, chore, ci).
- Run tests and lint before saying "done".
- Be honest about uncertainty. When unsure about requirements, ask instead of guessing.
- Keep prompts and context small to save usage. Prefer `/clear` between unrelated tasks.
- Explain decisions in plain language — the founder (Yash) is non-technical.

---

## 11. Definition of Done (every task)

Code works, tests and lint pass, CI is green, required reviewers have no blocking issues, the correct context file is updated, and **Next Up** in `logbook.md` reflects reality.

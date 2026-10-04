<!-- © Janus — yashxsanjay -->
# logbook.md — Feature-Level Change Log

This file records FEATURE-level changes: new features inside an existing module, enhancements, bug fixes, local refactors, UI changes, test additions, CI tweaks.

See `AGENTS.md §3` for the full classification rules and entry template.

---

## Next Up

1. **Create Supabase `janus-dev` project** (Yash) — get URL + anon key and add to `.env.local`
2. **Connect Cloudflare Pages** (Yash) — link GitHub repo once created
3. **Run `pnpm install`** and verify the dev server starts (`pnpm dev`)
4. **Week-1 sprint:** wire up email + GitHub auth (Supabase Auth), build profile create/edit UI, write pgTAP RLS tests for `profiles` table
5. **Week-1 go/no-go check:** login works, profile edit works, app is live on `*.pages.dev`, CI is green

---

## Change Log

### [2026-10-03] Context system and project skeleton created

- **Type:** Feature
- **Module:** shared / app
- **Flag:** n/a
- **Summary:** Created the full context system (`AGENTS.md`, `CLAUDE.md`, `Context/Agent-Written/`, `Context/User-Provided/`), all 9 subagent definitions, `docs/SECURITY.md`, project scaffold (package.json, tsconfig, Vite, Tailwind, ESLint, Prettier, Vitest, Playwright, GitHub Actions CI), config files (features.json, theme.json, brand.json, categories.json, plans.json), core module stubs (supabase client, event bus, feature flags, storage adapter, entitlements, watermark), and the profiles module stub with RLS migration template.
- **Files touched:** All scaffolding files (see tree output).
- **Tests:** None yet — Vitest and Playwright configured, test stubs created.
- **Notes / follow-ups:** Supabase credentials needed before auth can be tested. Cloudflare Pages connection pending. See **Next Up** above.

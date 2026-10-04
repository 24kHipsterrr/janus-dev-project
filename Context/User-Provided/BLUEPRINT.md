<!-- © Janus — yashxsanjay -->
# JANUS: Master Blueprint v1.0
Tech-niche ke liye Instagram + LinkedIn hybrid | Web first, Android APK baad me | Budget ₹0 | Team: Yash (leader) + 1 junior dev + Claude Code

> **Dhyan do:** Free-tier limits aur pricing badalte rehte hain. Neeche ke numbers abhi (Oct 2026) ke search se liye hain. Kuch bhi use karne se pehle official pricing page ek baar check karo. Ye document legal ya financial advice nahi hai.

---

## 1. Vision

AI/ML/engineering builders apni 30-45 second ki project demo post karte hain. Wahi demo unka resume ban jata hai, aur companies demo dekhkar hire karti hain.

**"Proof of work → hiring."**

LinkedIn me text resume hota hai. Instagram me tech content dab jata hai. Janus me dono ek jagah.

Brand: black-blue gradient, privacy-first.

Naam check: "Janus" kaafi jagah use ho chuka hai. Domain/handle/trademark kharchne se pehle check karo. Fallback naam: Kymra, Krasyn.

---

## 2. Constraints (har decision inse chalega)

| Constraint | Matlab |
|---|---|
| Budget ₹0 | Sirf free tiers, aur wo bhi jo commercial use allow karein |
| 10 ghante/hafte se kam (dono milake) | 13 hafte ≈ 100 build-hours, isliye scope chhota |
| Leader non-technical | Claude Code ko guardrails chahiye, junior har cheez review karega |
| Web first | PWA ban ke, APK baad me Capacitor se |
| Monetise karna hai | Plans/entitlements ka structure abhi, payment code baad me |

---

## 3. MVP Scope (90 din)

**IN**
1. Signup/login (email + GitHub + Google)
2. Profile (builder aur company, dono type)
3. Demo post: short video + caption + tags
4. Feed (latest + tag filter) aur follow
5. Jobs: company job post karti hai, candidate demo ke saath apply karta hai
6. Report/block, basic admin takedown
7. Privacy Policy + Terms pages

**OUT (baad me)**
Messaging/E2E, stories, comments, payments, AI matching, native iOS, notifications push.

Cut list (agar peeche pad jao to is order me hatao):
likes → tag filter → email notifications → applicant filters → PWA polish.

---

## 4. Tech Stack (free, commercial-OK)

| Layer | Choice | Note |
|---|---|---|
| Frontend | React + Vite + TypeScript + Tailwind (PWA) | Capacitor se APK aasaan |
| Backend | Supabase (Postgres, Auth, RLS, Edge Functions) | Free: 500 MB DB, 1 GB file storage, 50 MB max upload, 5 GB egress, 50k MAU, 2 projects. Project 1 hafte idle rahe to pause ho jata hai |
| Hosting | Cloudflare Pages | Free hosting. Commercial terms ek baar padh lena |
| Video storage | Supabase Storage se shuru, phir Cloudflare R2 | R2 free: 10 GB storage, egress free |
| Bot protection | Cloudflare Turnstile | Signup spam rokne ke liye |
| Email | Supabase default (dev) → Resend ya Brevo free tier (beta) | Limits check karo |
| Analytics | PostHog free tier ya Umami (open-source) | |
| Error tracking | Sentry free | |
| CI/CD | GitHub Actions | |
| Uptime | Baad me UptimeRobot free + weekly keep-alive Action | |
| Later | Capacitor (APK), Razorpay (payments), libsignal (E2E) | |

> ⚠ Vercel Hobby plan use mat karo. Wo sirf personal/non-commercial use ke liye hai, aur Pro $20/user/month hai. Tum monetise karoge, isliye Cloudflare Pages.

2 Supabase projects: janus-dev aur janus-prod (free plan me 2 allowed hain).

Video math: 1 GB storage me ~30 sec ke 10 MB wale sirf ~100 videos aate hain. Isliye: video cap 30-45 sec / 25 MB, aur beta invite se pehle R2 adapter live.

---

## 5. Software jo use karna hai

- VS Code: haan, bilkul theek hai (free). Claude Code terminal me ya VS Code extension se chalao. Cursor ya paid IDE ki zaroorat nahi.
- Git + GitHub (private repo), Node.js LTS, pnpm
- Supabase CLI aur dashboard, Cloudflare dashboard
- Docker mat lagao (low-end laptop pe bhaari). Local Supabase ki jagah janus-dev project use karo.
- Design: Figma free ya seedha Tailwind/shadcn + Claude
- Board: GitHub Projects (free). Testers ki list: Google Sheet
- APK baad me: Android Studio (free) + Capacitor
- Accounts ka ownership Yash ke paas: GitHub, Supabase, Cloudflare, domain, sab Yash ke email pe. Junior ko collaborator banao. Sab pe 2FA on.

---

## 6. Architecture (dynamic: naya feature jodo, purana na toote)

```
janus/
├─ CLAUDE.md                  # rules, conventions (Claude Code padhta hai)
├─ docs/ ARCHITECTURE.md DECISIONS.md SECURITY.md
├─ .claude/agents/            # subagents
├─ config/ features.json categories.json theme.json plans.json brand.json
├─ supabase/ migrations/ tests/ functions/
└─ src/
    ├─ core/   auth, supabase client, config loader, feature flags,
    │          event bus, storage adapters, entitlements, watermark
    ├─ modules/ profiles/ demos/ feed/ jobs/ (messaging/ stories/ baad me)
    │          har module: module.ts (manifest) routes api components tests
    ├─ shared/ ui-kit, theme tokens, utils
    └─ app/    router jo sirf ENABLED modules load karta hai
```

> **Note:** The master prompt maps `docs/DECISIONS.md` and `docs/ARCHITECTURE.md` → `Context/Agent-Written/planning.md`, and `CHANGELOG.md` → `Context/Agent-Written/logbook.md`. Agents follow the master prompt mapping.

### Rules (non-negotiable)

1. `core` stable hai. Usme badlav sirf soch-samajh ke, aur planning.md me entry ke saath.
2. Modules ek doosre ko import nahi karte. Baat sirf core event bus ya module ke public index.ts se.
3. Har module ka manifest hota hai: id, version, routes, nav items, required flag, events.
4. Feature flags: naya feature OFF ship hota hai. Ready hone pe `features.json` me ON.
5. DB migrations additive only (add karo, delete/rename nahi). Rename chahiye to expand → migrate → contract.
6. Har module apni tables aur migrations own karta hai (`NNNN_<module>_<what>.sql`).
7. Config-driven: theme (black-blue gradient), categories (AI, ML, Robotics...), plans, flags, sab config files me. Hardcode nahi.
8. Storage adapter interface: `StorageProvider` (Supabase abhi, R2 baad me). UI ko pata nahi hota storage kaunsa hai.
9. Har module ke saath tests. CI fail to merge nahi.

Naya feature kaise jodte hain: naya folder → manifest → additive migration → flag OFF → tests → review → flag ON. Purane code ko haath nahi lagta.

### Data model (sketch)

- `profiles` (id, type: builder/company, handle, bio, links)
- `content` (id, author_id, type: demo/post/announcement, status, metadata jsonb): naya content type = schema change nahi
- `follows`, `reactions` (target_type, target_id)
- `jobs` (company_id, title, details, status) aur `applications` (job_id, applicant_id, demo_id): jobs ko alag rakha kyunki relations strict chahiye
- `reports`, `blocks`
- `plans`, `subscriptions` (khali, paywall ke liye taiyaar)

---

## 7. Security Plan

### Level 1: MVP me must-have

- Auth sirf Supabase Auth se. Khud ka password code nahi. Email verification on.
- RLS har table pe ON, default deny. Policies likho aur pgTAP tests (`supabase test db`) se check karo.
- `service_role` key kabhi client me nahi. Secrets env/Cloudflare secrets me. `.env` gitignore me. gitleaks pre-commit.
- Input validation (zod).
- `dangerouslySetInnerHTML` banned. User links sanitize.
- Uploads: sirf allowlisted types (mp4/webm, jpg/png/webp), size aur duration cap, random filenames, image EXIF strip.
- Turnstile signup pe. Rate limits (Supabase + Cloudflare).
- Security headers (CSP, HSTS, nosniff, Referrer-Policy) Cloudflare Pages ke `_headers` se. Sirf HTTPS.
- Report/block aur admin takedown.
- Dependabot + `npm audit` CI me.
- Logs me password/token/personal data nahi.
- Backup: free plan me automatic backup shayad nahi milta (verify). Migrations git me, aur weekly data export.

### Level 2: public launch se pehle

- Semgrep (open-source) CI me, OWASP ZAP baseline scan.
- Admin audit log, secrets rotate, email SPF/DKIM.
- Data delete/export request ka process.
- Privacy Policy, Terms, 18+ only, breach response plan.

### Level 3: messaging aur payments ke time

- E2E messaging: khud ka crypto mat likho. Proven library (jaise libsignal) use karo, aur independent review karao.
- "End-to-end encrypted" ka claim marketing me tab tak mat karo jab tak sach me live na ho.
- Payments: Razorpay hosted checkout (card data tumhare server se nahi guzarta), webhook signature verify.

---

## 8. Invisible Watermark: yashxsanjay

Mark ID `yashxsanjay` lives in `config/brand.json` and is used only through `src/core/watermark`.

| Layer | Kya | Kab |
|---|---|---|
| A: Ownership | Har source file me `© Janus — yashxsanjay` header, LICENSE (All rights reserved), git history | Day 1 |
| B: Web | `<meta name="janus-wm" content="yashxsanjay">`, HTML comment, aur kuch fixed UI strings/email templates me zero-width characters me encode kiya ID | MVP |
| C: Media | Avatars/thumbnails pe invisible image watermark (DWT-DCT type libraries, jaise Python invisible-watermark), offline script/Action se | Phase 2 |

Honest limits: re-encode, crop ya screenshot se invisible watermark hat sakta hai. Ye akela proof nahi hai. Asli taakat: git history + dated backups + copyright notice + Terms. Zero-width characters ko copy-paste/search wali text me mat daalo. Privacy Policy/Terms me likho ki uploaded media pe invisible provenance mark ho sakta hai. Video watermark MVP me skip.

---

## 9. Subagents aur Free/Open-source Tools

| Step | Subagent | Free/OSS tool |
|---|---|---|
| Plan / design | janus-architect (read-only) | Mermaid (diagrams), ADR files |
| UI | ui-builder | Tailwind, shadcn/ui, Lucide icons |
| DB / RLS | supabase-db | Supabase CLI, pgTAP |
| Feature code | feature-builder (module rules follow karta hai) | TypeScript, zod |
| Tests | test-writer | Vitest, Testing Library, Playwright |
| Security | security-reviewer (read-only) | gitleaks, Semgrep CE, OWASP ZAP, npm audit, Dependabot |
| Code review | code-reviewer (read-only) | ESLint, Prettier |
| CI / deploy | devops-ci | GitHub Actions, Cloudflare Pages |
| Docs | docs-keeper | Markdown |

---

## 10. Roadmap (13 hafte, ~8 build-hours/hafta)

| Hafta | Kaam | Hours |
|---|---|---|
| 1 | Trial sprint: repo, CLAUDE.md, subagents, Supabase dev/prod, theme, auth, profile, deploy | 8 |
| 2 | RLS + tests, CI, flags, module registry, staging URL | 8 |
| 3-4 | Demos module: upload (caps), storage adapter, thumbnails, tags | 16 |
| 5-6 | Feed, follow, (likes) | 16 |
| 7-8 | Jobs: company profile, job post, apply with demo, applicant list | 16 |
| 9 | Security pass (Level 1 complete), legal pages, report/block, admin view | 8 |
| 10 | Polish, onboarding, PWA, watermark layers A+B, R2 adapter | 8 |
| 11-12 | Beta: invite 20 → 50 → 100 users, bug fixes | 16 |
| 13 | Metrics review, monetisation experiment plan, APK (Capacitor) plan | 8 |

Week-1 go/no-go: login (email + GitHub), profile edit, live *.pages.dev URL, CI green. Agar nahi hua to scope aur chhota karo ya doosra developer lao.

Day-90 targets (suggested): 100 signups, 40 demos posted, 10 companies, 20 applications.

---

## 11. Monetisation aur Paywall

90 din tak sab free. Sirf demand measure karo.

- Phase 1: companies se paisa. Free plan (kam active jobs) → Pro plan (zyada jobs, featured placement, applicant filters/export, analytics). Price guess mat karo: 10-15 companies/founders se pucho "kya doge?"
- Phase 2: creator premium (analytics, verified badge, profile boost).
- Phase 3: sponsored "build challenges" (companies challenge sponsor karein) aur ads. Ads sabse last.
- Founding Member badge pehle 100 users ko (free, aur motivation).

Paywall tech (abhi structure, payment baad me): `config/plans.json` + `subscriptions` table + `can(actor, feature)` helper. UI aur server (RLS/RPC) dono check karein. Sirf UI check kaafi nahi. Payment: Razorpay hosted checkout + Edge Function webhook (signature verify), onboarding docs aur fees pehle check karo. Web payments pe app-store commission nahi hota. APK me digital goods bechne se pehle Google Play ke billing rules check karo.

Pehla paisa lene se pehle CA se business structure/GST ki baat karo. Free beta ke liye zaroori nahi.

---

## 12. Legal Basics (lawyer/CA se confirm karna)

Privacy Policy, Terms, 18+ only (jobs ke liye bhi, aur minors ka data handle karne ki jhanjhat bhi bachti hai), analytics consent, grievance email, takedown process, deletion on request. India ka DPDP Act 2023 ke rules phase-wise lagu ho rahe hain, current status check karo.

---

## 13. Yash ka Leader Playbook

Hafta me ~1-2 ghante:
1. Junior ke saath 20 min sync: kya bana, kya atka.
2. Claude (main) ke saath: priorities, copy, outreach messages.
3. Apne aap app use karke bugs/feedback likho.

100 testers kaise laao: College Discord/WhatsApp groups, AI/ML student communities, LinkedIn/X pe build-in-public posts. 10-15 startups/founders ko personally DM karo: "free job post, first 100 members me". Waves me invite: 20 → 50 → 100.

---

## 14. Risks

| Risk | Fix |
|---|---|
| Scope creep | Scope freeze, cut list follow karo |
| Junior ka skill unknown | Week-1 go/no-go |
| Supabase pause | Keep-alive Action |
| Free storage khatam | Caps, R2 adapter |
| Vibe-coded security gaps | RLS tests, security-reviewer, Semgrep, 2FA |
| Users nahi aaye | Yash ka outreach plan, tight niche |
| Claude usage limit | Chhote prompts, scoped subagents, /clear |
| Naam/trademark | Pehle search, fallback naam ready |
| Abuse/moderation | Report/block, 18+ takedown, admin |
| Time/burnout | 8 hr/week cap, cut list |

---

## 15. Is Hafte ke Next Steps

**Yash:**
- [ ] Accounts banao (2FA ke saath): GitHub (private repo), Supabase, Cloudflare. Junior ko collaborator banao.
- [ ] Janus ka domain/handle/trademark quick search
- [ ] JANUS_KICKOFF_PROMPT.md aur ye blueprint junior ko bhejo
- [ ] Testers ki list shuru karo (target 100 naam)
- [ ] Weekly time slot fix karo

**Junior:**
- [ ] Kickoff prompt Claude Code me paste karo aur Week-1 trial sprint chalao
- [ ] Hafte ke end me demo do (login + profile live)

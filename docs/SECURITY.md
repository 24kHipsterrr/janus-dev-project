<!-- © Janus — yashxsanjay -->
# SECURITY.md — Janus Security Checklist

Living document. Organized by Level (from BLUEPRINT.md §7). Update this file whenever auth, RLS, uploads, secrets, or headers change.

---

## Level 1: MVP must-have

### Authentication
- [ ] Auth only through Supabase Auth — no custom password handling
- [ ] Email verification enabled in Supabase dashboard
- [ ] GitHub OAuth provider configured
- [ ] Google OAuth provider configured
- [ ] `service_role` key never sent to the client — only `anon` key in frontend env

### Secrets & Environment
- [ ] `.env` / `.env.local` in `.gitignore`
- [ ] `.env.example` kept up to date with all required keys (no real values)
- [ ] gitleaks pre-commit hook installed and passing
- [ ] All secrets in environment variables or Cloudflare secrets — none hardcoded

### Row-Level Security
- [ ] RLS enabled on every table
- [ ] Default deny (no policy = no access)
- [ ] pgTAP tests written for every policy (`supabase/tests/`)
- [ ] `supabase test db` passes in CI

### Input Validation
- [ ] All user input validated with zod before use
- [ ] `dangerouslySetInnerHTML` never used
- [ ] User-supplied URLs sanitized (allowlist protocols, DOMPurify or equivalent)

### Uploads
- [ ] MIME type allowlist enforced: `video/mp4`, `video/webm`, `image/jpeg`, `image/png`, `image/webp`
- [ ] File size cap: 25 MB
- [ ] Video duration cap: 45 seconds (validated server-side in Edge Function)
- [ ] Random filenames (UUID) — no user-controlled paths
- [ ] Image EXIF stripped before storage

### Bot Protection & Rate Limiting
- [ ] Cloudflare Turnstile on signup form
- [ ] Supabase rate limiting configured
- [ ] Cloudflare rate limiting rules applied

### Security Headers (Cloudflare Pages `_headers`)
- [ ] `Content-Security-Policy` configured
- [ ] `Strict-Transport-Security` set
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] HTTPS only (Cloudflare enforced)

### Moderation
- [ ] Report/block functionality implemented
- [ ] Admin takedown workflow implemented

### Dependencies
- [ ] Dependabot enabled on GitHub repo
- [ ] `npm audit` (or `pnpm audit`) runs in CI and fails on high severity

### Logging
- [ ] No passwords, tokens, or personal data in logs
- [ ] No PII in error tracking (Sentry scrubbing configured)

### Backups
- [ ] DB migrations stored in git (authoritative schema history)
- [ ] Weekly manual data export process documented (Supabase free plan may not include automatic backups — verify)

---

## Level 2: Before public launch

- [ ] Semgrep (open-source CE) added to CI
- [ ] OWASP ZAP baseline scan completed
- [ ] Admin audit log implemented
- [ ] Secrets rotated before production launch
- [ ] Email SPF/DKIM configured for sending domain
- [ ] Data deletion and export request process documented
- [ ] Privacy Policy published (mentions provenance watermark on uploaded media)
- [ ] Terms of Service published (18+ only)
- [ ] Breach response plan documented
- [ ] DPDP Act 2023 (India) compliance status checked and documented

---

## Level 3: Messaging and payments

- [ ] E2E messaging uses proven library (libsignal or equivalent) — no custom crypto
- [ ] E2E claim NOT made in marketing until independently reviewed and live
- [ ] Razorpay hosted checkout used — card data never touches Janus servers
- [ ] Webhook signature verification implemented in Edge Function
- [ ] Razorpay onboarding requirements and fees verified

---

## Notes

- Never write your own cryptography.
- "End-to-end encrypted" must not appear in any UI or copy until E2E is built and independently audited.
- Video watermark (Layer C) is deferred to Phase 2. Layer A (source file headers) and Layer B (web meta/HTML) are MVP.

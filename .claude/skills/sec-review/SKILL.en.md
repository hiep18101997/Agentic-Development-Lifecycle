---
name: sec-review
description: >
  Structured security review before merge. 3 tiers: Always/Ask First/Never + OWASP Top 10 checklist.
  Triggers when: user says "security review", "security check", "check security before merge",
  "OWASP check", "security scan", "are there security issues", or types /sec-review.
---

# Skill: /sec-review
**Role**: Developer / Tech Lead / Security  
**Purpose**: Structured security review before merge. Three clear tiers: Always / Ask First / Never.

---

## Three Decision Tiers

### ✅ ALWAYS DO (automatic, no need to ask)
- Hash passwords with bcrypt/argon2 (not MD5/SHA1)
- Validate and sanitize all user input
- Use parameterized queries (no string concatenation for SQL)
- HTTPS for all external calls
- Do not log sensitive data (password, token, PII)
- Keep dependency versions up-to-date (check CVE)

### ⚠️ ASK FIRST (stop, ask human before proceeding)

> Full list + rationale: `assets/ask-first-gates.md`

- Changes to authentication / authorization logic
- Adding or modifying permission / role checks
- Breaking changes in public API
- Database migration that could lose data
- Database schema changes affecting access control
- Changes to shared infrastructure or config
- Storing new sensitive data (PII, payment info, health data)
- Changes to CORS configuration
- Changes to cryptographic implementation
- Adding new external API integration

### ❌ NEVER DO
- Implement custom encryption (use standard libraries)
- Hardcode credentials in code
- Disable SSL verification
- Log full request/response with sensitive headers
- eval() with user input
- Expose stack traces to users

---

## Execution Guide

### Step 1 — Scan changes

Spawn subagent to read the code diff:

> "Read git diff and look for: authentication logic, authorization checks, data storage, external API calls, input validation, cryptography usage. Return file:line for each finding."

### Step 2 — Classify and Gate

Classify each finding into one of the 3 tiers:

```
## Security Review: [PR/Feature name]

### ⚠️ Ask First — Needs Senior Review

| Finding | File | Issue / Question |
|---------|------|------------------|
| [Auth change] | [file:line] | [Need to confirm: does the new logic cover case X?] |

**Stop here — need senior confirmation on the above before proceeding.**

### 🔴 Issues to fix immediately

| Severity | File | Issue | Fix |
|----------|------|-------|-----|
| Critical | [file:line] | [SQL injection risk] | [Parameterized query] |
| High | [file:line] | [...] | [...] |

### 🟡 Recommended Improvements

| File | Suggestion |
|------|-----------|
| [file:line] | [...] |

### ✅ Security checks OK

- [ ] Input validation: OK
- [ ] SQL injection: OK
- [ ] Auth logic: [Pending review / OK]
- [ ] Sensitive data logging: OK
- [ ] Dependencies: OK / [X CVEs need updating]
```

### Step 3 — Final gate

```
Security review complete.

[If there are "Ask First" items]:
Before merging, need senior confirmation:

| # | Question | Options |
|---|---------|---------|
| 1 | [Specific question about auth change] | _(type here)_ |
| 2 | [Question about data storage] | _(type here)_ |

[If there are Critical/High issues]:
Need to fix [N] issues before merging.

[If clean]:
No security concerns. OK to merge from a security perspective.
```

---

## OWASP Top 10 Checklist (actionable)

| # | Risk | How to check | Dangerous pattern |
|---|------|-------------|-------------------|
| A01 | Broken Access Control | Look for route handlers — do they check `req.user` / role? | `app.get('/admin'` without `requireAuth` |
| A02 | Cryptographic Failures | Grep `MD5\|SHA1\|createCipher` — not used for password/token | `crypto.createHash('md5')` for passwords |
| A03 | Injection | Grep string concatenation into queries | `` `SELECT * FROM users WHERE id=${req.params.id}` `` |
| A04 | Insecure Design | Review business logic — rate limit, token expiry, single-use | Token without expiry, not invalidated on use |
| A05 | Security Misconfiguration | Check CORS origin, error messages exposing internals | `cors({ origin: '*' })` on production |
| A06 | Vulnerable Components | `npm audit` or `yarn audit` | High/Critical CVE severity |
| A07 | Auth Failures | Session fixation, brute force, JWT `alg: none` | `jwt.verify` without algorithm check |
| A08 | Software Integrity | Check dependency sources, lock file committed | `package-lock.json` not committed |
| A09 | Logging Failures | Grep log statements — logging password/token? | `console.log(req.body)` at auth endpoint |
| A10 | SSRF | Grep fetch/axios with user-controlled URL | `fetch(req.body.url)` |

**Quick grep commands**:
```bash
# SQL injection candidates
grep -rn "query\|execute\|raw" src/ | grep "\${" 

# Sensitive logging
grep -rn "console.log\|logger" src/auth/ | grep -i "password\|token\|secret"

# JWT issues  
grep -rn "jwt.verify\|jwt.decode" src/

# Missing auth on routes
grep -rn "router\.\(get\|post\|put\|delete\)" src/routes/ | grep -v "auth\|protect\|verify"
```

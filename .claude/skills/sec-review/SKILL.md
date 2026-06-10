---
name: sec-review
description: >
  Security review có cấu trúc trước khi merge. 3 tier: Always/Ask First/Never + OWASP Top 10 checklist.
  Trigger khi: user nói "security review", "review bảo mật", "check security trước merge",
  "OWASP check", "security scan", "có vấn đề bảo mật không", hoặc gõ /sec-review.
---

# Skill: /sec-review
**Role**: Developer / Tech Lead / Security  
**Mục đích**: Security review có cấu trúc trước khi merge. Ba tier rõ ràng: Always / Ask First / Never.

---

## Ba Tier Quyết định

### ✅ ALWAYS DO (tự động, không cần hỏi)
- Hash passwords với bcrypt/argon2 (không MD5/SHA1)
- Validate và sanitize tất cả input từ user
- Dùng parameterized queries (không string concatenation cho SQL)
- HTTPS cho tất cả external calls
- Không log sensitive data (password, token, PII)
- Dependency versions up-to-date (check CVE)

### ⚠️ ASK FIRST (dừng lại, hỏi human trước)

> Danh sách đầy đủ + lý do: `assets/ask-first-gates.md`

- Thay đổi authentication / authorization logic
- Thêm hoặc sửa permission / role checks
- Breaking changes trong public API
- Database migration có thể mất data
- Database schema thay đổi ảnh hưởng access control
- Thay đổi shared infrastructure hoặc config
- Lưu trữ sensitive data mới (PII, payment info, health data)
- Thay đổi CORS configuration
- Thay đổi cryptographic implementation
- Thêm new external API integration

### ❌ NEVER DO
- Implement custom encryption (dùng standard libraries)
- Hardcode credentials trong code
- Disable SSL verification
- Log full request/response với sensitive headers
- eval() với user input
- Expose stack traces cho user

---

## Hướng dẫn thực hiện

### Bước 1 — Scan changes

Spawn subagent đọc code diff:

> "Đọc git diff và tìm: authentication logic, authorization checks, data storage, external API calls, input validation, cryptography usage. Trả về file:line cho mỗi điểm tìm thấy."

### Bước 2 — Phân loại và Gate

Phân loại mỗi finding vào 3 tier:

```
## Security Review: [PR/Feature name]

### ⚠️ Ask First — Cần Senior Review

| Finding | File | Vấn đề / Câu hỏi |
|---------|------|------------------|
| [Auth change] | [file:line] | [Cần confirm: logic mới có cover case X không?] |

**Dừng lại — cần senior confirm những điểm trên trước khi proceed.**

### 🔴 Issues cần fix ngay

| Severity | File | Vấn đề | Fix |
|----------|------|--------|-----|
| Critical | [file:line] | [SQL injection risk] | [Parameterized query] |
| High | [file:line] | [...] | [...] |

### 🟡 Improvements nên làm

| File | Đề xuất |
|------|---------|
| [file:line] | [...] |

### ✅ Security checks OK

- [ ] Input validation: OK
- [ ] SQL injection: OK
- [ ] Auth logic: [Pending review / OK]
- [ ] Sensitive data logging: OK
- [ ] Dependencies: OK / [X CVEs cần update]
```

### Bước 3 — Gate cuối

```
Security review xong.

[Nếu có "Ask First" items]:
Trước khi merge, cần confirm với senior:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | [Câu hỏi cụ thể về auth change] | _(điền vào)_ |
| 2 | [Câu hỏi về data storage] | _(điền vào)_ |

[Nếu có Critical/High issues]:
Cần fix [N] issues trước khi merge.

[Nếu clean]:
Không có security concern. OK to merge từ góc độ security.
```

---

## OWASP Top 10 Checklist (actionable)

| # | Risk | Cách check | Pattern nguy hiểm |
|---|------|-----------|-------------------|
| A01 | Broken Access Control | Tìm route handlers — có check `req.user` / role không? | `app.get('/admin'` mà không có `requireAuth` |
| A02 | Cryptographic Failures | Grep `MD5\|SHA1\|createCipher` — không dùng cho password/token | `crypto.createHash('md5')` cho password |
| A03 | Injection | Grep string concatenation vào query | `` `SELECT * FROM users WHERE id=${req.params.id}` `` |
| A04 | Insecure Design | Review business logic — rate limit, token expiry, single-use | Token không có expiry, không invalidate khi dùng |
| A05 | Security Misconfiguration | Check CORS origin, error messages expose internals | `cors({ origin: '*' })` trên production |
| A06 | Vulnerable Components | `npm audit` hoặc `yarn audit` | CVE severity High/Critical |
| A07 | Auth Failures | Session fixation, brute force, JWT `alg: none` | `jwt.verify` không check algorithm |
| A08 | Software Integrity | Check dependency sources, lock file committed | `package-lock.json` không commit |
| A09 | Logging Failures | Grep log statements — có log password/token không? | `console.log(req.body)` tại auth endpoint |
| A10 | SSRF | Grep fetch/axios với user-controlled URL | `fetch(req.body.url)` |

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

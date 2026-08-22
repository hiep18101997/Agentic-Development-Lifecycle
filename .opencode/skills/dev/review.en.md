---
name: dev:review
description: >
  Comprehensive code review after implementation: code quality, architecture, performance, security in a single run.
  Replaces having to run /arch:review + /sec:review separately after dev:implement.
  Triggers when: user says "review code", "review trước merge", "check code xem ổn không",
  "code review", "review implementation", "kiểm tra code", or types /dev:review.
---

# /dev:review
**Role**: Developer / Tech Lead  
**Purpose**: Comprehensive review after `dev:implement` — code quality, architecture, performance, security — in a single run. The result is an Approve / Request Changes decision before running `/dev:pr`.

---

## Execution Guide

### Step 1 — Gather context (subagent)

**Determine the base branch before spawning:**

Check in this order:
1. User provides the base branch in the command (e.g. `/dev:review develop`)
2. Read `git remote show origin` to detect the default branch
3. If still unclear → use the `question` tool to ask for the base branch before proceeding

Spawn `review-reader` agent according to `agents/review-reader.md` with input:

task(
  description: "review-reader: parse diff into code/arch/security signals",
  prompt: "Parse this git diff and return structured signals per agents/review-reader.md spec.\n\nGIT DIFF:\n[git diff <BASE_BRANCH>..HEAD]\n\nBASE_BRANCH: <tên branch đã xác định>\n\nANALYSIS PATH:\ndocs/tasks/[TASK-ID]/analysis.md\n\nVERIFICATION PATH:\ndocs/tasks/[TASK-ID]/verification.md",
  subagent_type: "explorer"
)

Agent returns JSON with `code_signals`, `arch_signals`, `security_signals`, `review_priority`, `intent_alignment`. Use this result as input for Step 3.

**Fallback if agent fails** (timeout, diff too large, spawn error): skip subagent, manually run the 7 grep patterns from `agents/review-reader.md` directly on the diff and continue to Step 3 with raw grep results.

If there is no TASK-ID → use `git diff HEAD~1` (applies to standalone commits, not feature branches). If analysis.md does not exist → ask the developer for a brief description of the changes before spawning.

---

### Step 2 — Gate: Confirm scope

Use the `question` tool:

question({
  questions: [{
    question: "Focus review on which lenses?",
    header: "Focus",
    options: [
      { label: "Comprehensive", description: "Code + Architecture + Performance + Security" },
      { label: "Code only", description: "Code quality only" },
      { label: "Security focus", description: "Prioritize security review" },
    ]
  }, {
    question: "Are there any constraints to keep in mind?",
    header: "Constraints",
    options: [
      { label: "None", description: "Normal review" },
      { label: "Tight deadline", description: "Flag blocking issues only" },
    ]
  }]
})

**Wait for confirmation.**

---

### Step 3 — Review across 4 lenses

Run all 4 lenses concurrently on the same diff:

#### Lens 1 — Code Quality

| Check Point | What to look for |
|--------------|--------|
| Logic correctness | Obvious bugs, off-by-one, null pointer, race conditions |
| Naming | Unclear variable/function names, confusing abbreviations, inconsistency with codebase |
| Test coverage | Missing important happy path, edge case, error case |
| Duplication | DRY violations — copy-pasted logic that could be extracted |
| Performance | N+1 queries, unbounded loop, memory leak, blocking I/O |
| Error handling | Exceptions being swallowed, error messages exposing internals |

#### Lens 2 — Architecture

Evaluate across 6 dimensions:

| Dimension | Question |
|-------|--------|
| Correctness | Does the logic match the spec? |
| Scalability | Can it handle 10x load increase? Where are the bottlenecks? |
| Maintainability | Can a new developer understand and modify this in 6 months? |
| Coupling | Too many dependencies on other modules? Circular dependency? |
| Testability | Can it be unit-tested without excessive mocking? |
| Design decision | New pattern/approach not in the codebase → ADR needed? |

#### Lens 3 — Performance

| Check Point | What to look for |
|--------------|--------|
| Database queries | N+1 queries, missing indexes, full table scan in a loop |
| Caching | Data read multiple times without caching, incorrect cache invalidation |
| Payload size | Response returns all records, missing pagination |
| Blocking I/O | Sync I/O in async context, blocking calls in hot path |
| Resource leaks | DB connections not closed, file handles not released |
| Scalability | Stateful logic running on stateless server, shared mutable state |

> This lens only flags **potential issues** — not every N+1 needs immediate fixing. Classify severity: Critical (affects P1 users) / Medium (will become a problem at 10x scale) / Low (OK for backlog).

#### Lens 4 — Security (OWASP Top 10)

**Always check** (every PR):
- Input validation and sanitization
- Parameterized queries (no string concatenation into SQL)
- HTTPS for external calls
- No logging of sensitive data (passwords, tokens, PII)
- Dependency CVEs (`npm audit` / `pip audit` / `gradle audit`)

**Ask First** (stop if detected):
- Changes to authentication / authorization logic
- Adding or modifying permission or role checks
- Breaking changes in public API
- Storing new PII or sensitive data
- Changes to CORS configuration
- Changes to cryptographic implementation
- Database migration that could lose data

**Never** (flag immediately as Critical):
- Custom encryption (use standard libraries)
- Hardcoded credentials in code
- Disabling SSL verification
- `eval()` with user input
- Exposing stack traces to the user

---

### Step 4 — Present results

```
## Review Report: [Tên task / PR]

### 🔴 Blocking — Phải fix trước merge

| # | Lens | File | Vấn đề | Fix đề xuất |
|---|------|------|--------|------------|
| 1 | Security | auth/login.js:42 | SQL injection | Dùng parameterized query |
| 2 | Code | user.service.js:87 | Null pointer khi user không tồn tại | Add null check |

### ⚠️ Ask First — Cần senior confirm

| # | Vấn đề | Câu hỏi cụ thể |
|---|--------|---------------|
| 1 | Auth logic thay đổi | Flow mới có cover case token expired không? |

### 🟡 Non-blocking — Nên làm, không block merge

| # | Lens | File | Đề xuất |
|---|------|------|-------|
| 1 | Code | user.repo.js:23 | Biến `x` → `userId` cho rõ |
| 2 | Arch | order.service.js | N+1 query — cân nhắc batch load sau |

### 💡 Dài hạn (backlog)
- [Cải tiến kiến trúc có thể làm sau khi có time]

### ✅ Tổng hợp

| Lens | Kết quả |
|------|--------|
| Code Quality | ✅ OK / 🔴 [N] blocking / 🟡 [N] non-blocking |
| Architecture | ✅ OK / 🔴 [N] blocking — ADR cần tạo: [có / không] |
| Performance | ✅ OK / 🔴 [N] critical / 🟡 [N] medium / ℹ️ [N] low |
| Security (Always) | ✅ OK / 🔴 [N] issues |
| Security (Ask First) | ✅ Không có / ⚠️ [N] items cần confirm |
| Dependencies (CVEs) | ✅ OK / 🔴 [N] critical alerts |
```

---

### Step 5 — Gate: Decision

Use the `question` tool:

question({
  questions: [{
    question: "Verdict after review?",
    header: "Verdict",
    options: [
      { label: "Approve", description: "No blocking issues, proceed to /dev:pr" },
      { label: "Approve + minors", description: "Non-blocking issues, developer fixes before merge" },
      { label: "Request Changes", description: "Blocking issues exist, fix then review again" },
    ]
  }, {
    question: "Is an ADR needed for the new design decision?",
    header: "ADR?",
    options: [
      { label: "Not needed", description: "No significant new pattern" },
      { label: "ADR needed", description: "Create /arch:adr" },
    ]
  }]
})

**Wait for confirmation.**

---

### Step 6 — Conclusion + save review log

Write `docs/tasks/[TASK-ID]/review-log-R[N].md` using template `templates/review-log.en.md` — **always write this file regardless of verdict** (Approve / Approve with minor fixes / Request Changes). `/dev:pr` reads the latest round of this file to determine whether review has happened; if it's only written on Request Changes, `/dev:pr` has no way to distinguish "never reviewed" from "approved".

- Fill in Meta (task_id, round, verdict: `approve` | `approve-with-fixes` | `request-changes`, timestamp JST, base_branch)
- **Approve / Approve with minor fixes**: leave the Blocking table empty; populate Non-blocking if applicable
- **Request Changes**: populate the Blocking table with IDs like `B-xx` — one row per issue with file:line + specific fix

**If Approve / Approve with minor fixes:**
```
Review complete. Verdict: [Approve / Approve with minor fixes]

[List of non-blocking items if any — dev to judge before merge]

Review Log written: `docs/tasks/[TASK-ID]/review-log-R[N].md`
Next step: /dev:pr
```

**If Request Changes:**
```
Review complete. Verdict: Request Changes

Must fix before merge:
1. [Blocking issue 1 — file:line — specific fix]
2. [Blocking issue 2 — file:line — specific fix]

Review Log written: `docs/tasks/[TASK-ID]/review-log-R[N].md`
After fixes are done, re-run /dev:review.
```

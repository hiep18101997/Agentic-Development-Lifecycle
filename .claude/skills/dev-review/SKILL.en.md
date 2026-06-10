---
name: dev-review
description: >
  Comprehensive code review after implementation: code quality, architecture, performance, security in a single run.
  Replaces running /arch-review + /sec-review separately after dev-implement.
  Triggers when: user says "review code", "review trước merge", "check code xem ổn không",
  "code review", "review implementation", "kiểm tra code", or types /dev-review.
---

# Skill: /dev-review
**Role**: Developer / Tech Lead  
**Purpose**: Comprehensive review after `dev-implement` — code quality, architecture, performance, security — in a single run. The result is an Approve / Request Changes decision before running `/dev-pr`.

---

## Execution Guide

### Step 1 — Gather context (subagent)

**Check for a previous review round (if any):**

Look for `docs/tasks/[TASK-ID]/review-log-R*.md`. If it exists:
- Load the `B-xx` (Blocking) list from the most recent round
- Use that list to verify each item has been addressed in the current diff
- Report clearly: `B-01 ✅ fixed` / `B-01 ❌ still present`

**Determine the base branch before spawning:**

Check in order:
1. User provides the base branch in the command (e.g., `/dev-review develop`)
2. Read `git remote show origin` to detect the default branch
3. If still unclear → use `AskUserQuestion` to ask for the base branch before continuing

Spawn `review-reader` agent (model: haiku) according to `agents/review-reader.md` with input:

```
GIT DIFF:
[git diff <BASE_BRANCH>..HEAD]

BASE_BRANCH: <determined branch name>

ANALYSIS PATH:
docs/tasks/[TASK-ID]/analysis.md

VERIFICATION PATH:
docs/tasks/[TASK-ID]/verification.md
```

Agent returns JSON with `code_signals`, `arch_signals`, `security_signals`, `review_priority`, `intent_alignment`. Use this result as input for Step 3.

**Fallback if agent fails** (timeout, diff too large, spawn error): skip the subagent, manually run the 7 grep patterns from `agents/review-reader.md` directly on the diff and continue to Step 3 with raw grep results.

If there is no TASK-ID → use `git diff HEAD~1` (apply for standalone commits, not feature branches). If analysis.md does not exist → ask the dev for a short description of the changes before spawning.

---

### Step 2 — Gate: Confirm scope

Use the `AskUserQuestion` tool:

- **Focus**: All (default) / Code only / Architecture only / Performance only / Security only
- **Constraint**: Tight deadline? Known tech debt to ignore? Specific framework?

**Wait for confirmation.**

---

### Step 3 — Review across 4 lenses

Run all 4 lenses simultaneously on the same diff:

#### Lens 1 — Code Quality

| Check point | What to look for |
|-------------|------------------|
| Logic correctness | Obvious bugs, off-by-one, null pointer, race condition |
| Naming | Vague variable/function names, confusing abbreviations, inconsistent with codebase |
| Test coverage | Missing important happy path, edge case, error case |
| Duplication | DRY violations — copy-pasted logic that could be extracted |
| Performance | N+1 query, unbounded loop, memory leak, blocking I/O |
| Error handling | Swallowed exceptions, error messages exposing internals |

#### Lens 2 — Architecture

Evaluate across 6 dimensions:

| Dimension | Question |
|-----------|---------|
| Correctness | Is the logic correct per the spec? |
| Scalability | Can it handle 10x load? Where is the bottleneck? |
| Maintainability | Can a new dev understand and modify this in 6 months? |
| Coupling | Too many dependencies on other modules? Circular dependency? |
| Testability | Can it be unit tested without excessive mocking? |
| Design decision | Is there a new pattern/approach not yet in the codebase that needs an ADR? |

#### Lens 3 — Performance

| Check point | What to look for |
|-------------|------------------|
| Database queries | N+1 queries, missing indexes, full table scan in a loop |
| Caching | Data read multiple times without caching, incorrect cache invalidation |
| Payload size | Response returns all records, missing pagination |
| Blocking I/O | Sync I/O in async context, blocking calls in hot path |
| Resource leaks | DB connection not closed, file handle not released |
| Scalability | Stateful logic running on stateless server, shared mutable state |

> This lens only flags **potential issues** — not every N+1 needs an immediate fix. Classify severity: Critical (affects P1 users) / Medium (will become an issue at 10x scale) / Low (backlog OK).

#### Lens 4 — Security (OWASP Top 10)

**Always check** (every PR):
- Input validation and sanitization
- Parameterized queries (no string concat into SQL)
- HTTPS for external calls
- No sensitive data logged (password, token, PII)
- Dependency CVEs (`npm audit` / `pip audit` / `gradle audit`)

**Ask First** (stop if detected):
- Changes to authentication / authorization logic
- Adding/modifying permission or role checks
- Breaking changes in public API
- Storing new PII or sensitive data
- Changes to CORS configuration
- Changes to cryptographic implementation
- Database migration that may cause data loss

**Never** (flag immediately as Critical):
- Custom encryption (use standard libraries)
- Hardcoded credentials in code
- Disabling SSL verification
- `eval()` with user input
- Exposing stack traces to users

**Use `security_signals` from review-reader** to populate results:
- `always_check_hits` → fill into **🔴 Blocking** table if severity high
- `ask_first_triggers` → fill into **⚠️ Ask First** table — stop and ask senior before continuing
- `never_violations` → if any item exists, flag immediately as **🔴 Critical**, stop the review
- `dependency_changes` → note to run audit after merge

---

### Step 4 — Present results

```
## Review Report: [Task name / PR]

### 🔴 Blocking — Must fix before merge

| # | Lens | File | Issue | Suggested fix |
|---|------|------|-------|---------------|
| 1 | Security | auth/login.js:42 | SQL injection | Use parameterized query |
| 2 | Code | user.service.js:87 | Null pointer when user doesn't exist | Add null check |

### ⚠️ Ask First — Needs senior confirmation

| # | Issue | Specific question |
|---|-------|-------------------|
| 1 | Auth logic changed | Does the new flow cover the expired token case? |

### 🟡 Non-blocking — Should do, does not block merge

| # | Lens | File | Suggestion |
|---|------|------|-----------|
| 1 | Code | user.repo.js:23 | Variable `x` → `userId` for clarity |
| 2 | Arch | order.service.js | N+1 query — consider batch loading later |

### 💡 Long-term (backlog)
- [Architecture improvements that can be done when time permits]

### ✅ Summary

| Lens | Result |
|------|--------|
| Code Quality | ✅ OK / 🔴 [N] blocking / 🟡 [N] non-blocking |
| Architecture | ✅ OK / 🔴 [N] blocking — ADR needed: [yes / no] |
| Performance | ✅ OK / 🔴 [N] critical / 🟡 [N] medium / ℹ️ [N] low |
| Security (Always) | ✅ OK / 🔴 [N] issues |
| Security (Ask First) | ✅ None / ⚠️ [N] items needing confirmation |
| Dependencies (CVEs) | ✅ OK / 🔴 [N] critical alerts |
```

---

### Step 5 — Gate: Decision

Use the `AskUserQuestion` tool:

- **Verdict**:
  - `Approve` — no blocking issues, proceed to `/dev-pr`
  - `Approve with minor fixes` — non-blocking issues, dev fixes before merging
  - `Request Changes` — blocking issues exist, dev fixes then re-runs `/dev-review`

- **ADR**: If Lens 2 detected a new design decision → ask if `/arch-adr` should be created

**Wait for confirmation.**

---

### Step 6 — Conclusion

**If Approve / Approve with minor fixes:**
```
Review complete. Verdict: [Approve / Approve with minor fixes]

[List of non-blocking items if any — dev to judge before merge]

Next step: /dev-pr
```

**If Request Changes:**

Write `docs/tasks/[TASK-ID]/review-log-R[N].md` using template `templates/review-log.en.md`:
- Fill in Meta (task_id, round, verdict: request-changes, timestamp JST)
- Populate the Blocking table with IDs like `B-xx` — one row per issue with file:line + specific fix
- Populate Ask First if applicable
- Populate Non-blocking

```
Review complete. Verdict: Request Changes

Must fix before merge:
1. [Blocking issue 1 — file:line — specific fix]
2. [Blocking issue 2 — file:line — specific fix]

Review Log written: `docs/tasks/[TASK-ID]/review-log-R[N].md`
After fixes are done, re-run /dev-review — AI will verify each B-xx item automatically.
```

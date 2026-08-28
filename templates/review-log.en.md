# Review Log: [TASK-ID] — Round [N]

## Meta

| Field | Value |
|-------|-------|
| task_id | TASK-XXX |
| round | 1 |
| reviewer | AI / Human |
| harness | Claude Code (Sonnet) \| Codex CLI \| Copilot CLI \| OpenCode \| ... |
| verdict | request-changes \| approve \| approve-with-fixes |
| timestamp_jst | 2026-01-01T10:00:00+09:00 |
| base_branch | main |

---

## Blocking — Must fix before merge

| ID | Lens | File:Line | Issue | Suggested Fix |
|----|------|-----------|-------|---------------|
| B-01 | security | auth/login.js:42 | SQL injection | Use parameterized query |
| B-02 | code | user.service.js:87 | Null pointer when user doesn't exist | Add null check before access |

---

## Ask First — Needs senior confirmation before continuing

| ID | Issue | Specific Question |
|----|-------|------------------|
| AF-01 | Auth logic changed | Does the new flow cover the expired token case? |

---

## Non-blocking — Should do, does not block merge

| ID | Lens | File:Line | Suggestion |
|----|------|-----------|-----------|
| NB-01 | code | user.repo.js:23 | Rename variable `x` → `userId` |
| NB-02 | arch | order.service.js:45 | N+1 query — consider batch loading |

---

## Notes

_Append additional notes if needed — technical reasons, specific context, senior decisions._

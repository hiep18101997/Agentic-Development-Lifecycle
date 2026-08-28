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

## Blocking — Phải fix trước merge

| ID | Lens | File:Line | Vấn đề | Fix đề xuất |
|----|------|-----------|--------|------------|
| B-01 | security | auth/login.js:42 | SQL injection | Dùng parameterized query |
| B-02 | code | user.service.js:87 | Null pointer khi user không tồn tại | Add null check trước khi access |

---

## Ask First — Cần senior confirm trước khi tiếp tục

| ID | Vấn đề | Câu hỏi cụ thể |
|----|--------|---------------|
| AF-01 | Auth logic thay đổi | Flow mới có cover case token expired không? |

---

## Non-blocking — Nên làm, không block merge

| ID | Lens | File:Line | Đề xuất |
|----|------|-----------|-------|
| NB-01 | code | user.repo.js:23 | Đổi tên biến `x` → `userId` |
| NB-02 | arch | order.service.js:45 | N+1 query — cân nhắc batch load |

---

## Ghi chú

_Append ghi chú thêm nếu có — lý do kỹ thuật, context đặc thù, quyết định senior._

---
taskId: [TASK-ID]
lang: vi
createdAt: [YYYY-MM-DD HH:mm JST]
---

# Audit Log — [TASK-ID]

_Append-only log: mọi user input verbatim + agent decision với timestamp JST. Để defend quyết định khi khách JP chất vấn sau N tháng ("なぜこの設計?")._

**Khác biệt với Q&A History trong `requirements.md`**:
- Q&A History — chỉ ghi clarify Q&A của BA (1 skill)
- Audit log — ghi MỌI skill chạy trong task này (BA, Dev, QA, Arch...) + raw input của user

---

## [YYYY-MM-DD HH:mm JST] · skill=`/ba-spec` · round=1 · commit=`[short-sha]`

**User input** (verbatim):
> [Paste exact text user said]

**Skill action**: [Stage tên + tóm tắt 1 dòng]
**Decision**: [Quyết định cụ thể, hoặc reference đến file]
**Artifact**: `docs/tasks/[TASK-ID]/requirements.md` — section nào được cập nhật

---

## [YYYY-MM-DD HH:mm JST] · skill=`/dev-analyze` · agent=planner · commit=`[short-sha]`

**User input** (verbatim):
> [...]

**Skill action**: Spawned 3 subagents (task-reader, code-scout, planner)
**Decision**: User chọn Option B (Redis cache) over Option A (in-memory) — lý do: scale across pods
**Artifact**: `docs/tasks/[TASK-ID]/analysis.md`

---

<!-- Mỗi entry mới append xuống cuối. KHÔNG sửa entry cũ. -->

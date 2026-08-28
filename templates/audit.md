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

**Field `hash`** (tuỳ chọn, khuyến nghị khi cần tamper-evidence): SHA-256 digest của diff + timestamp + tên agent, sinh bằng `node bin/audit-hash.js --diff <file> --agent <name> --timestamp <iso>` — dùng để phát hiện entry bị sửa sau khi ghi.

**Field `duration`** (tuỳ chọn, self-reported bằng phút, vd: `12m`): thời gian từ khi user gọi skill đến khi hoàn tất gate cuối — dùng để dashboard tính overhead trung bình mỗi skill (panel "Skill Benchmark"). Không bắt buộc; nếu bỏ trống, skill đó không xuất hiện trong benchmark.

---

## [YYYY-MM-DD HH:mm JST] · skill=`/ba-spec` · round=1 · commit=`[short-sha]`

**User input** (verbatim):
> [Paste exact text user said]

**Skill action**: [Stage tên + tóm tắt 1 dòng]
**Decision**: [Quyết định cụ thể, hoặc reference đến file]
**Artifact**: `docs/tasks/[TASK-ID]/requirements.md` — section nào được cập nhật
**hash**: `[sha256 từ node bin/audit-hash.js]`
**duration**: `12m`

---

## [YYYY-MM-DD HH:mm JST] · skill=`/dev-analyze` · agent=planner · commit=`[short-sha]`

**User input** (verbatim):
> [...]

**Skill action**: Spawned 3 subagents (task-reader, code-scout, planner)
**Decision**: User chọn Option B (Redis cache) over Option A (in-memory) — lý do: scale across pods
**Artifact**: `docs/tasks/[TASK-ID]/analysis.md`
**hash**: `[sha256 từ node bin/audit-hash.js]`

---

<!-- Mỗi entry mới append xuống cuối. KHÔNG sửa entry cũ. -->

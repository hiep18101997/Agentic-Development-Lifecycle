---
name: dev-analyze
description: >
  Phân tích task/issue và đề xuất 2-3 phương án implement với trade-off. Dùng multi-agent để giữ context sạch.
  Trigger khi: user nói "analyze task", "phân tích issue", "xem có cách nào làm",
  "đề xuất phương án", "implementation options", hoặc gõ /dev-analyze.
---

# Skill: /dev-analyze
**Role**: Developer  
**Mục đích**: Phân tích task/issue và đề xuất các phương án thi công. Dùng multi-agent để giữ context sạch.

---

## Brain Dump Pattern (input contract)

Trước khi chạy skill này, dev nên cung cấp context block sau để giảm hallucination:

```
Tech stack: [language, framework, DB, infra]
Relevant files: [file paths đã biết liên quan]
Constraints: [performance, security, backward compat, deadline]
Known gotchas: [vấn đề đã biết trong codebase]
Issue/Task: [link hoặc paste nội dung]
```

Nếu không có đủ context → skill sẽ hỏi trước khi tiếp tục.

---

## Kiến trúc Multi-Agent

Skill này orchestrate các subagent để giữ context sạch:

```
dev-analyze (orchestrator)
├── [Subagent 1] task-reader    → parse issue → structured understanding
├── [Subagent 2] code-scout     → tìm code liên quan (read-only)
└── [Subagent 3] planner        → tổng hợp → đề xuất phương án
```

Mỗi subagent nhận **chỉ context cần thiết**, trả về kết quả nén.

## Cách spawn subagent

Dùng **Agent tool** để spawn mỗi subagent. Prompt phải self-contained — không pass full conversation history.

Ví dụ spawn task-reader:
```
Agent(
  description: "Parse GitHub issue into structured JSON",
  prompt: "Read this issue and return structured JSON per agents/task-reader.md spec.\n\nISSUE CONTENT:\n[paste issue content here]",
  model: "haiku"
)
```

Ví dụ spawn code-scout:
```
Agent(
  description: "Find relevant files for auth task",
  prompt: "Find files relevant to this task. Return JSON per agents/code-scout.md spec.\n\nTASK SUMMARY: [summary]\nTECH STACK: [stack]\nAFFECTED AREAS: [areas]",
  model: "haiku"
)
```

Ví dụ spawn planner:
```
Agent(
  description: "Synthesize task + code map into implementation options",
  prompt: "Create 2-3 implementation options per agents/planner.md spec.\n\nTASK: [task-reader JSON]\nCODE MAP: [code-scout JSON]\nCONSTRAINTS: [from Gate 1]",
  model: "sonnet"
)
```

---

## Hướng dẫn thực hiện

### Bước 0 — Risk Classification

Trước khi spawn bất kỳ subagent nào, classify risk theo `docs/risk-classifier.md`:

```
## Risk Classification — [TASK-ID]

**Input type**: [new-spec | spec-slice | change-request | maintenance | new-initiative | framework-improvement]
**Risk checklist**: [chỉ liệt kê items YES — ví dụ: R-06 ✅ (shared config)]
**Lane**: tiny | normal | high-risk
**Lý do**: [1 câu]
```

- **Tiny lane** → skip toàn bộ skill này, patch trực tiếp
- **High-risk lane** → dừng ngay, hiện `⚠️ Ask First Gate`, chờ confirm senior trước khi tiếp tục
- **Normal lane** → tiếp tục Bước 1 bên dưới

### Bước 1 — Spawn Subagent: task-reader

Spawn subagent với nhiệm vụ:
> "Đọc issue/task sau và trả về JSON structured:
> - task_id, title, type (feature/bug/refactor)
> - business_goal (tại sao cần làm)
> - acceptance_criteria (list)
> - technical_hints (nếu có trong issue)
> - unknowns (những gì chưa rõ)
> 
> Issue content: [paste nội dung issue]"

Subagent CHỈ nhận nội dung issue, không nhận codebase context.

### Bước 2 — Gate 1: Xác nhận hiểu task

```
## Tôi đọc task [TASK-ID] và hiểu như sau:

**Mục tiêu**: [business goal]
**Loại**: [Feature/Bug/Refactor]
**Acceptance Criteria**:
  - AC-001: [...]
  - AC-002: [...]

**Những điều chưa rõ**:
  - [?] [Điểm chưa rõ 1]
  - [?] [Điểm chưa rõ 2]

Trước khi tôi scan codebase, hãy xác nhận:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Tôi hiểu đúng mục tiêu chưa? | A: Đúng rồi / B: Chưa — sửa lại: ___ / C: Khác: ___ |
| 2 | Có constraint nào không đề cập trong issue? | A: Không / B: Có — constraint: ___ / C: Khác: ___ |
| 3 | Có màn hình/API doc nào tôi nên đọc trước? | A: Không cần / B: Có — link/path: ___ / C: Khác: ___ |
```

**Chờ confirm.**

### Bước 3 — Spawn Subagent: code-scout

Sau khi nhận confirm, spawn subagent với nhiệm vụ:
> "Tìm trong codebase các file/module liên quan đến: [task summary].
> Trả về:
> - file_path:line_number cho mỗi điểm liên quan
> - Mô tả ngắn tại sao file đó liên quan
> - Patterns/conventions hiện tại cần theo
> 
> CHỈ đọc, không sửa gì cả."

Subagent nhận task summary + file patterns để tìm kiếm, không nhận full conversation history.

### Bước 4 — Gate 2: Xác nhận code map

```
## Tôi tìm thấy các file liên quan:

| File | Line | Tại sao liên quan |
|------|------|-------------------|
| [path] | [N] | [...] |

**Conventions hiện tại**:
- [Pattern 1]
- [Pattern 2]

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Có file quan trọng nào tôi bỏ sót không? | A: Không / B: Có — file: ___ / C: Khác: ___ |
| 2 | Có module nào nên TRÁNH chạm vào trong task này? | A: Không / B: Có — module: ___ / C: Khác: ___ |
```

**Chờ confirm.**

### Bước 5 — Spawn Subagent: planner

Spawn subagent với:
> "Dựa trên:
> - Task: [summary]
> - AC: [list]
> - Relevant files: [file map]
> - Constraints: [từ Gate 1]
> 
> Đề xuất 2-3 phương án implement với trade-off.
> Mỗi phương án gồm: tên, mô tả, files cần thay đổi, estimate, ưu/nhược."

### Bước 5.5 — Parallel Design Stubs (nếu planner xác định artifact type)

Dựa trên planner output, spawn parallel design agents **trong cùng 1 message** (chạy song song):

- **Nếu task có màn hình mới hoặc sửa màn hình hiện tại** → spawn `screen-designer` (model: haiku) theo `agents/screen-designer.md`
- **Nếu task có API endpoint mới hoặc thay đổi contract API** → spawn `api-designer` (model: haiku) theo `agents/api-designer.md`
- **Nếu task không có màn hình / API** → bỏ qua bước này, tiếp tục Bước 6

Mỗi agent nhận input:
```
TASK SUMMARY: [task-reader JSON summary]
SELECTED OPTION: [tên + mô tả phương án planner đề xuất cao nhất]
AFFECTED SCREENS / AFFECTED APIS: [từ planner output hoặc code-scout]
EXISTING DOCS: [nội dung docs/screens hoặc docs/api liên quan nếu có]
```

Merge kết quả từ các agents vào `docs/tasks/[TASK-ID]/analysis.md` dưới section riêng:
- `## Screen Design Stub` — từ screen-designer output
- `## API Design Stub` — từ api-designer output

Stub này giúp human có đủ thông tin để chọn phương án ở Bước 6.

```
✓ Design stubs đã sinh:
  - Screen: [N] màn hình — [tên danh sách]
  - API: [N] endpoint — [danh sách method + path]
  Xem chi tiết trong analysis.md trước khi chọn phương án.
```

---

### Bước 6 — Gate 3: Trình bày phương án (QUAN TRỌNG NHẤT)

```
## Tôi có [N] phương án thi công:

### Phương án A: [Tên] — [Từ khóa đặc trưng]
**Mô tả**: [...]
**Files cần thay đổi**:
  - `[file]` — [lý do]
**Estimate**: [X giờ]
**Ưu**: [...]
**Nhược**: [...]
**Risk**: [...]

### Phương án B: [Tên]
[tương tự]

### Phương án C: [Tên] (nếu có)
[tương tự]

---
**Đề xuất của tôi**: Phương án [X] vì [lý do cụ thể].

Trước khi bạn chọn, tôi cần hỏi thêm:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | [Câu hỏi về constraint ảnh hưởng đến lựa chọn] | _(điền vào)_ |
| 2 | Priority: speed vs maintainability? | A: Ưu tiên tốc độ deliver / B: Ưu tiên maintainability / C: Cân bằng cả hai / D: Khác: ___ |

**Bạn muốn chọn phương án nào?**

| | Lựa chọn |
|---|---------|
| A | Phương án A |
| B | Phương án B |
| C | Phương án C |
| D | Khác: ___ |
```

**Chờ human chọn phương án.**

### Bước 6.5 — Render HTML companion (so sánh phương án)

Trước khi human chọn ở Bước 6, sinh `docs/tasks/[TASK-ID]/analysis-compare.html` từ template `templates/html-artifact.html`:

- Inject `<table id="options" data-sortable>` với các cột: Phương án | Effort (h) | Risk | Files chạm | Ưu | Nhược
- Mỗi phương án 1 row, cột Effort dùng `data-type="number"` để sort
- Risk render bằng `<span class="pill pill-ok|warn|err">` (Low/Med/High)
- Mỗi phương án có `<details>` mở rộng cho mô tả dài

File HTML là one-shot review artifact — KHÔNG commit (đã có `.gitignore` cho `docs/tasks/**/*.html`).

```
✓ Đã sinh `docs/tasks/[TASK-ID]/analysis-compare.html`
  Mở bằng browser để sort/filter trước khi quyết định.
```

### Bước 7 — Tạo Task Doc

Sau khi human chọn, tạo `docs/tasks/[TASK-ID]/analysis.md`:

```markdown
# Analysis: [TASK-ID]

## Phương án đã chọn: [Tên]
**Lý do**: [từ discussion]

## Files sẽ thay đổi
| File | Loại thay đổi | Ghi chú |
|------|--------------|---------|
| | | |

## Những phương án đã cân nhắc và lý do không chọn
- Phương án A: [lý do không chọn]
- Phương án B: [lý do không chọn]

## Câu hỏi mở còn lại
- [ ] [Question nếu có]
```

```
## Phân tích hoàn tất ✓

`docs/tasks/[TASK-ID]/analysis.md` đã được lưu.

**DỪNG TẠI ĐÂY.** Không tự động implement.

Hãy review `analysis.md`, sau đó dùng `/dev-implement` để bắt đầu code.
```

**Chờ human trigger `/dev-implement`.**  
Không được tự ý bắt đầu implement dù user có vẻ đồng ý.

---

## Lưu ý cho orchestrator

- Mỗi subagent nhận context tối thiểu cần thiết
- Không pass full conversation history vào subagent
- Kết quả từ subagent được tóm tắt trước khi dùng cho subagent tiếp theo
- Nếu subagent trả về quá nhiều file (>20), yêu cầu lọc thêm

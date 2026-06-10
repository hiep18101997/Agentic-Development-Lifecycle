---
name: pm-status
description: >
  Tổng hợp trạng thái sprint từ nhiều nguồn, tạo status report nhanh cho stakeholder.
  Trigger khi: user nói "báo cáo sprint", "status report", "tổng hợp tiến độ",
  "sprint health", "update cho PM", "report cho khách", hoặc gõ /pm-status.
---

# Skill: /pm-status
**Role**: Project Manager  
**Mục đích**: Tổng hợp trạng thái sprint/project từ nhiều nguồn, tạo báo cáo nhanh cho stakeholder.

---

## Hướng dẫn thực hiện

### Bước 1 — Thu thập thông tin

Yêu cầu người dùng cung cấp (hoặc đọc từ context có sẵn):
- Danh sách issues/tasks trong sprint và trạng thái
- Blockers đã biết
- Thời gian còn lại trong sprint

### Bước 2 — Gate: Xác nhận phạm vi báo cáo

```
## Tôi sẽ tạo status report cho Sprint [N].

Trước khi tổng hợp, cho tôi biết:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Báo cáo này dành cho ai? | A: Team internal / B: Stakeholder / C: Management / D: Khách hàng JP / E: Khác: ___ |
| 2 | Format mong muốn? | A: HTML dashboard (recommend cho stakeholder/khách JP) / B: Markdown (post Slack/Notion) / C: Text thuần / D: Khác: ___ |
| 3 | Có metric cụ thể nào cần highlight không? | A: Velocity / B: Burn rate / C: Blockers / D: Không cần / E: Khác: ___ |
```

### Bước 3 — Tạo Status Report

**Format quyết định ở Gate 2 câu 2**:
- **A — HTML dashboard** (default cho stakeholder / khách JP): sinh `docs/reports/sprint-[N]-status.html` từ template `templates/html-artifact.html` — xem cấu trúc bên dưới
- **B — Markdown**: sinh inline trong chat hoặc save `docs/reports/sprint-[N]-status.md` — dùng template Markdown phía dưới
- **C — Text**: tóm tắt 1 màn hình trong chat

#### HTML format (option A)

Inject vào template:
- Header: Sprint [N] · Velocity badge (X/Y points) · Burn rate pill (ok/warn/err)
- Section "Kanban view": 4 cột Done / In Progress / Blocked / To Do dùng CSS grid, mỗi card là một task
- `<table data-sortable>` cho Risks & Actions với cột Impact dùng pill
- Filter `<input type="search" data-filter="...">` cho task list
- `@media print` đảm bảo in A4 đẹp khi forward email cho khách JP

File HTML KHÔNG commit (nếu nằm trong `docs/tasks/`). Lưu vào `docs/reports/` thì commit được — quyết định theo nhu cầu lưu trữ của project.

#### Markdown format (option B/fallback)

```markdown
# Sprint [N] Status Report
**Ngày**: [Date]  
**PM**: [Name]

## 🟢 Tổng quan
[1-2 câu tóm tắt trạng thái tổng thể]

## ✅ Hoàn thành (Done)
| Task | Assignee | Story Points |
|------|----------|-------------|
| | | |

## 🔄 Đang làm (In Progress)
| Task | Assignee | % Done | Dự kiến xong |
|------|----------|--------|-------------|
| | | | |

## ⛔ Blocked
| Task | Blocker | Người cần action | Deadline |
|------|---------|-----------------|----------|
| | | | |

## 📋 Chưa bắt đầu (To Do)
| Task | Priority | Sprint Risk |
|------|----------|------------|
| | | |

## 📊 Sprint Health
- **Velocity**: [X] points done / [Y] points planned
- **Burn rate**: On track / At risk / Behind
- **Scope change**: [Mô tả nếu có]

## 🚨 Risks & Actions
| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| | | | |

## 📅 Lịch quan trọng
- [Event/Deadline sắp tới]
```

### Bước 4 — Gate cuối

```
Báo cáo đã soạn xong.

Câu hỏi trước khi gửi:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Có issue nào tôi hiểu sai trạng thái không? | A: Không / B: Có — issue + trạng thái đúng: ___ / C: Khác: ___ |
| 2 | Có risk nào bạn biết mà tôi chưa đề cập? | A: Không / B: Có — risk: ___ / C: Khác: ___ |
| 3 | Tone báo cáo có phù hợp với audience chưa? | A: Phù hợp / B: Cần formal hơn / C: Cần casual hơn / D: Khác: ___ |
```

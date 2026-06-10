---
name: qa-bug
description: >
  Tạo bug report chuẩn với severity, steps to reproduce, và evidence đủ để dev fix.
  Trigger khi: user nói "tìm thấy bug", "viết bug report", "báo cáo lỗi",
  "create bug ticket", "có defect", "lỗi cần report", hoặc gõ /qa-bug.
---

# Skill: /qa-bug
**Role**: QA Engineer  
**Mục đích**: Tạo bug report chuẩn, đủ thông tin để dev reproduce và fix.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Thu thập thông tin

```
## Tôi sẽ giúp bạn soạn bug report.

Cho tôi biết:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Mô tả ngắn gọn lỗi xảy ra | _(điền vào)_ |
| 2 | Môi trường phát hiện | A: Dev / B: Staging / C: Production / D: Khác: ___ |
| 3 | Browser / OS / device | _(điền vào)_ |
| 4 | Steps to reproduce | _(điền vào — dù rough cũng được)_ |
| 5 | Expected vs Actual behavior | _(điền vào)_ |
| 6 | Có screenshot/log không? | A: Có (đính kèm) / B: Không / C: Khác: ___ |
| 7 | Tần suất lỗi | A: 100% mỗi lần reproduce / B: Intermittent (~___%) / C: Khác: ___ |
```

### Bước 2 — Phân loại severity

Đánh giá dựa trên impact:

- **Critical**: Crash, data loss, security breach, payment failure
- **High**: Core feature broken, no workaround
- **Medium**: Feature degraded, workaround exists
- **Low**: UI issue, minor inconvenience

Hỏi nếu chưa rõ: *"Lỗi này có workaround không? User có thể tiếp tục công việc không?"*

### Bước 3 — Tạo Bug Report

Tạo bug report sử dụng template `templates/bug-report.md`.

### Bước 4 — Gate cuối

```
Bug report đã soạn xong.

Trước khi submit:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Steps to reproduce — confirm reproduce được không? | A: Có / B: Không — sửa steps: ___ / C: Khác: ___ |
| 2 | Severity [X] có đúng không? | A: Đúng / B: Cao hơn — lên: ___ / C: Thấp hơn — xuống: ___ / D: Khác: ___ |
| 3 | Cần tag thêm người nào không? | A: Không / B: Có — username: ___ / C: Khác: ___ |
```

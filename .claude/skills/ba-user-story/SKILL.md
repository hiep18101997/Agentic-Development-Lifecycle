---
name: ba-user-story
description: >
  Chuyển spec thành User Stories với Acceptance Criteria chuẩn, sẵn sàng để PM tạo issue.
  Trigger khi: user nói "tạo user stories", "viết user story", "breakdown spec thành stories",
  "create user stories", "AC cho stories", hoặc gõ /ba-user-story.
---

# Skill: /ba-user-story
**Role**: Business Analyst  
**Mục đích**: Chuyển spec thành User Stories với Acceptance Criteria chuẩn, sẵn sàng để PM tạo issue.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc spec hiện có

Đọc `docs/tasks/[TASK-ID]/requirements.md` nếu có. Nếu chưa có, yêu cầu người dùng chạy `/ba-spec` trước.

### Bước 2 — Gate: Xác nhận scope

```
## Tôi sẽ tạo User Stories từ spec: [Tên feature]

Spec có [N] Use Cases và [M] Acceptance Criteria.

Trước khi bắt đầu, tôi cần hỏi:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Granularity mong muốn? | A: Mỗi Use Case = 1 story / B: Gộp theo feature / C: Tách nhỏ hơn Use Case / D: Khác: ___ |
| 2 | Story format? | A: "As a [role], I want [action], so that [benefit]" / B: Format khác: ___ / C: Khác: ___ |
| 3 | Có Epic đã tồn tại để link vào không? | A: Có — tên/link: ___ / B: Không / C: Khác: ___ |
```

**Chờ confirm.**

### Bước 3 — Tạo User Stories

Tạo mỗi User Story sử dụng template `templates/user-story.md`.

### Bước 4 — Gate cuối: Review + Đề xuất thứ tự

```
## Đã tạo [N] User Stories:

| ID | Tên | Priority | Estimate | Dependencies |
|----|-----|----------|----------|--------------|
| US-001 | | | | |

**Đề xuất thứ tự implement** (dựa trên dependencies và value):
1. US-XXX — [lý do]
2. US-XXX — [lý do]

**Câu hỏi trước khi finalize**:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Estimate có hợp lý không? | A: Hợp lý / B: Quá cao — sửa US-XXX: ___ / C: Quá thấp — sửa US-XXX: ___ / D: Khác: ___ |
| 2 | US-XXX có thể chia nhỏ hơn để dễ demo không? | A: Không cần / B: Có — chia như sau: ___ / C: Khác: ___ |
| 3 | Có story nào nên defer sang sprint sau không? | A: Không / B: Có — story: ___ / C: Khác: ___ |
```

---

## Output files

- Cập nhật `docs/tasks/[TASK-ID]/requirements.md` với User Stories section
- Sẵn sàng để PM dùng `/pm-breakdown` để tạo GitHub Issues

---
name: qa-testplan
description: >
  Tạo test plan toàn diện từ spec/user stories: strategy, test cases happy/edge/negative, exit criteria.
  Trigger khi: user nói "tạo test plan", "viết test cases", "soạn kế hoạch test",
  "create test plan", "QA plan cho feature", "test strategy", hoặc gõ /qa-testplan.
---

# Skill: /qa-testplan
**Role**: QA Engineer  
**Mục đích**: Tạo test plan toàn diện từ spec/user stories, bao gồm test cases và strategy.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc input

Đọc `docs/tasks/[TASK-ID]/requirements.md` và màn hình/API docs liên quan.

### Bước 2 — Gate: Xác nhận scope test

```
## Tôi sẽ tạo test plan cho: [Feature name]

Tôi đọc spec và xác định:
- [N] Acceptance Criteria cần verify
- [M] Business Rules cần test
- Màn hình liên quan: [list]
- API liên quan: [list]

Trước khi soạn test plan, tôi cần hỏi:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Test level cần cover? | A: Unit / B: Integration / C: E2E / D: Performance / E: Security / F: Tất cả / G: Khác: ___ |
| 2 | Môi trường test? | A: Dev / B: Staging / C: Prod-like / D: Khác: ___ |
| 3 | Có dữ liệu test đặc biệt cần chuẩn bị không? | A: Không / B: Có — loại data: ___ / C: Khác: ___ |
| 4 | Regression scope — những gì cần retest? | _(liệt kê features/flows cần retest)_ |
```

### Bước 3 — Tạo Test Plan

Tạo `docs/tasks/[TASK-ID]/test-plan.md` sử dụng template `templates/test-plan.md`.

### Bước 3.5 — Render HTML companion (interactive checklist)

Sinh `docs/tasks/[TASK-ID]/test-plan.html` từ template `templates/html-artifact.html`:

- Inject `<ul class="checklist" data-storage-key="testplan-[TASK-ID]">` cho từng TC
- Mỗi `<li>` có `<input type="checkbox" data-id="TC-XXX">` + label = TC name
- Group theo type: Happy / Edge / Negative dùng `<details><summary>` mở rộng
- Header có `<input type="search" data-filter="...">` để filter TC theo từ khoá
- Pill `pill-ok|warn|err` cho priority High/Med/Low

QA tick checkbox khi chạy test, state lưu localStorage — không cần copy vào Markdown.
File HTML KHÔNG commit (đã có `.gitignore`). `test-plan.md` vẫn là source of truth commit vào repo.

```
✓ Đã sinh `docs/tasks/[TASK-ID]/test-plan.html`
  Mở bằng browser khi chạy test để tick checklist (state lưu localStorage).
```

### Bước 4 — Gate cuối

```
Test plan đã soạn xong với [N] test cases.

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Test case nào có vẻ thiếu? | A: Không thiếu / B: Thiếu — mô tả: ___ / C: Khác: ___ |
| 2 | Có edge case domain đặc thù tôi chưa cover? | A: Không / B: Có — edge case: ___ / C: Khác: ___ |
| 3 | Exit criteria có đủ chặt không? | A: Đủ rồi / B: Cần thêm điều kiện: ___ / C: Khác: ___ |
| 4 | Muốn tôi generate code test tự động từ test plan không? | A: Có / B: Không — sẽ viết tay / C: Khác: ___ |
```

### Bước 5 — (Optional) Spawn subagent: test-gen

Nếu user chọn "Có" ở câu 4, spawn test-gen để generate test code từ test plan đã approve:

```
Agent(
  description: "Generate test code from approved test plan",
  prompt: "Write test code per agents/test-gen.md spec.\n\nNEW CODE:\n[Files đã implement — chỉ pass files mới/changed]\n\nAC LIST:\n[AC list từ test plan]\n\nTEST FRAMEWORK:\n[Jest/JUnit/pytest/...]\n\nEXISTING TEST EXAMPLES:\n[1-2 file test hiện có]",
  model: "sonnet"
)
```

---
name: qa-ut
description: >
  Tạo Unit Test plan (testcase-functional) từ spec/requirements, hỗ trợ human thực thi và ghi kết quả.
  Tách biệt hoàn toàn với IT (integration/E2E). Khi fail có bug feedback loop về dev-debug.
  Trigger khi: user nói "tạo unit test", "UT plan", "functional test cases", "viết test đơn vị",
  "test từng hàm", "unit test cho feature", hoặc gõ /qa-ut.
---

# Skill: /qa-ut
**Role**: QA Engineer  
**Mục đích**: Tạo Unit Test plan cho từng function/component, hỗ trợ thực thi và ghi kết quả. Khi fail → bug feedback loop rõ ràng về dev phase.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc input

Đọc theo thứ tự:
1. `docs/tasks/[TASK-ID]/requirements.md` — AC list, business rules
2. `docs/tasks/[TASK-ID]/analysis.md` — files đã implement, approach đã chọn
3. Màn hình / API docs liên quan (nếu có trong analysis.md)

### Bước 2 — Gate: Xác nhận scope UT

Dùng `AskUserQuestion` tool:

- **Component/Function**: Những unit nào cần test? (Nếu không rõ → AI tự suy ra từ analysis.md)
- **Test framework**: Jest / JUnit / pytest / Vitest / khác?
- **Coverage target**: Line coverage target % nếu có requirement
- **Mock strategy**: Unit test thuần (mock all deps) hay lean integration (mock chỉ external)?

**Chờ confirm.**

### Bước 3 — Tạo UT Plan

Tạo `docs/tasks/[TASK-ID]/test-plan-ut.md` dùng template `templates/test-plan.md` với các TC:

Mỗi TC có:
- **TC-UT-XXX**: ID dạng `TC-UT-001`
- **Unit**: Tên function/method/component đang test
- **Input**: Dữ liệu đầu vào cụ thể
- **Expected**: Output/behavior mong đợi
- **Assertion**: Assertion cụ thể (ví dụ: `expect(result).toBe(42)`)
- **Type**: Happy / Edge / Negative / Error

Cover đầy đủ:
- Happy path (input hợp lệ, output đúng)
- Edge cases (boundary values, empty, null, zero)
- Negative cases (invalid input, type mismatch)
- Error cases (exception thrown, error message)

### Bước 3.5 — Render HTML checklist

Sinh `docs/tasks/[TASK-ID]/test-plan-ut.html` với:
- Checklist tick từng TC, state lưu localStorage (key: `ut-[TASK-ID]`)
- Group theo Unit (function/component) dùng `<details><summary>`
- Filter theo Type (Happy / Edge / Negative / Error)
- Pill màu theo priority: High=🔴, Med=🟡, Low=🟢

File HTML KHÔNG commit. `test-plan-ut.md` là source of truth.

```
✓ Đã sinh `docs/tasks/[TASK-ID]/test-plan-ut.html`
  Mở bằng browser khi chạy test để tick từng TC.
```

### Bước 4 — Gate: Validate test plan

Dùng `AskUserQuestion` tool:

- TC nào có vẻ thiếu hoặc thừa?
- Có edge case domain đặc thù chưa cover?
- Muốn AI generate test code từ plan không? (Nếu có → spawn test-gen agent)

**Chờ confirm.**

### Bước 5 — (Optional) Spawn test-gen

Nếu user muốn auto-generate test code:

```
Agent(
  description: "Generate UT code from approved test plan",
  prompt: "Write unit test code per agents/test-gen.md spec.\n\nIMPLEMENTED FILES:\n[files từ analysis.md]\n\nTC LIST:\n[TC-UT-xxx list từ test-plan-ut.md]\n\nTEST FRAMEWORK:\n[framework đã xác nhận ở Gate]\n\nEXISTING TEST EXAMPLES:\n[1-2 file test hiện có trong codebase]",
  model: "sonnet"
)
```

### Bước 6 — Gate: Kết quả thực thi UT

**⚠️ HUMAN ONLY — AI không thực thi test.**

Dùng `AskUserQuestion` tool sau khi human chạy test suite:

- Tổng TC: pass / fail / blocked / skipped?
- TC nào fail? (ID + error message ngắn)
- Có lỗi setup/environment không? (không tính là test fail)

**Chờ human báo kết quả.**

**Nếu tất cả TC pass:**

```
✅ UT PASSED — [N] TC passed, [N] skipped

Ghi kết quả vào: docs/tasks/[TASK-ID]/ut-results.md
Bước tiếp: /qa-it để chạy integration/E2E test.
```

Tạo `docs/tasks/[TASK-ID]/ut-results.md`:
```markdown
# UT Results: [TASK-ID]
- verdict: PASS
- timestamp_jst: [JST]
- total: [N] | pass: [N] | fail: 0 | skipped: [N]
```

**Nếu có TC fail:**

Tạo `docs/tasks/[TASK-ID]/bug-handoff.md`:

```markdown
# Bug Handoff: [TASK-ID] — UT Round [N]

## Failing Test Cases
| TC ID | Unit | Error Summary |
|-------|------|--------------|
| TC-UT-003 | userService.validate() | TypeError: Cannot read property 'id' of null |

## Suspected Files (từ analysis.md)
- [file:line liên quan đến unit bị fail]

## Hướng tiếp theo
- Chạy /dev-debug [TASK-ID] để root cause analysis
- Hoặc /dev-implement nếu fix đơn giản
- Sau khi fix xong, chạy lại /qa-ut
```

```
❌ UT FAILED — [N] TC fail

Bug handoff đã ghi: docs/tasks/[TASK-ID]/bug-handoff.md
Bước tiếp: /dev-debug [TASK-ID] để tìm nguyên nhân.
```

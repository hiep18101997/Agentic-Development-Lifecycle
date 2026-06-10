---
name: qa-it
description: >
  Tạo Integration/E2E Test plan từ spec và kết quả UT, hỗ trợ human thực thi E2E và ghi kết quả.
  Chỉ chạy SAU KHI /qa-ut passed. Khi fail có bug feedback loop về dev-debug.
  Trigger khi: user nói "tạo IT plan", "integration test", "E2E test cases", "test tích hợp",
  "end-to-end test", "IT plan cho feature", hoặc gõ /qa-it.
---

# Skill: /qa-it
**Role**: QA Engineer  
**Mục đích**: Tạo Integration/E2E Test plan cover luồng nghiệp vụ end-to-end. Chỉ chạy SAU KHI UT passed. Khi fail → bug feedback loop về dev phase.

---

## Hướng dẫn thực hiện

### Bước 0 — Kiểm tra UT prerequisite

Đọc `docs/tasks/[TASK-ID]/ut-results.md`.

- Nếu **không tồn tại** hoặc verdict ≠ `PASS`:
  ```
  ⚠️ IT không thể chạy khi UT chưa pass.
  Chạy /qa-ut trước, sau đó quay lại /qa-it.
  ```
  **Dừng tại đây.**

- Nếu verdict = `PASS` → tiếp tục Bước 1.

### Bước 1 — Đọc input

Đọc theo thứ tự:
1. `docs/tasks/[TASK-ID]/requirements.md` — luồng nghiệp vụ, AC end-to-end
2. `docs/tasks/[TASK-ID]/analysis.md` — phương án đã chọn, API/Screen affected
3. `docs/tasks/[TASK-ID]/test-plan-ut.md` — scope đã test ở UT, tránh duplicate
4. Screen/API docs liên quan (nếu có `## Screen Design Stub` hoặc `## API Design Stub` trong analysis.md)

### Bước 2 — Gate: Xác nhận scope IT

Dùng `AskUserQuestion` tool:

- **Integration flows**: Luồng nào cần test end-to-end? (Ví dụ: Đăng nhập → Tạo đơn → Thanh toán)
- **Environment**: Staging / Dev / Prod-like?
- **Test data**: Data đặc biệt cần setup? (user accounts, seed data, mock services)
- **External dependencies**: API bên thứ 3 cần mock hay dùng thật?

**Chờ confirm.**

### Bước 3 — Tạo IT Plan

Tạo `docs/tasks/[TASK-ID]/test-plan-it.md` dùng template `templates/test-plan.md` với các TC:

Mỗi TC có:
- **TC-IT-XXX**: ID dạng `TC-IT-001`
- **Flow**: Tên luồng nghiệp vụ end-to-end
- **Preconditions**: Data/state cần setup trước khi test
- **Steps**: Các bước thực thi có thứ tự (numbered)
- **Expected Result**: Kết quả mong đợi sau mỗi step quan trọng
- **Postconditions**: State của hệ thống sau khi test hoàn thành
- **Type**: Happy / Edge / Error / Performance

Cover đầy đủ:
- Happy flow (luồng chính hoàn chỉnh từ đầu đến cuối)
- Cross-component integration (API ↔ DB ↔ Cache, Screen ↔ API)
- Error recovery (service timeout, network failure, rollback)
- Data integrity (không mất data khi fail giữa chừng)

### Bước 3.5 — Render HTML checklist

Sinh `docs/tasks/[TASK-ID]/test-plan-it.html` với:
- Checklist tick từng TC và từng step, state lưu localStorage (key: `it-[TASK-ID]`)
- Group theo Flow dùng `<details><summary>`
- Badge go/no-go tự động: 🔴 nếu bất kỳ TC Happy fail
- Export button → copy kết quả thành Markdown để paste vào `it-results.md`

File HTML KHÔNG commit. `test-plan-it.md` là source of truth.

```
✓ Đã sinh `docs/tasks/[TASK-ID]/test-plan-it.html`
  Mở bằng browser để tick từng step khi chạy E2E.
```

### Bước 4 — Gate: Validate IT plan

Dùng `AskUserQuestion` tool:

- Flow nào có vẻ thiếu?
- Có integration scenario đặc thù (race condition, concurrent users) chưa cover?
- Preconditions nào khó setup — cần hỗ trợ gì?

**Chờ confirm.**

### Bước 5 — Gate: Kết quả thực thi IT

**⚠️ HUMAN ONLY — AI không thực thi E2E test.**

Dùng `AskUserQuestion` tool sau khi human chạy E2E:

- Tổng TC: pass / fail / blocked / skipped?
- TC nào fail? (ID + step fail + error/behavior thực tế)
- Có lỗi environment/data setup không? (không tính là test fail)

**Chờ human báo kết quả.**

**Nếu tất cả TC pass:**

```
✅ IT PASSED — [N] TC passed, [N] skipped

Ghi kết quả vào: docs/tasks/[TASK-ID]/it-results.md
🎉 Cả UT và IT đã pass — sẵn sàng cho /dev-pr và merge.
```

Tạo `docs/tasks/[TASK-ID]/it-results.md`:
```markdown
# IT Results: [TASK-ID]
- verdict: PASS
- timestamp_jst: [JST]
- total: [N] | pass: [N] | fail: 0 | skipped: [N]
- environment: [staging/dev/...]
- ut_prerequisite: PASS (xem ut-results.md)
```

**Nếu có TC fail:**

Tạo `docs/tasks/[TASK-ID]/bug-handoff.md` (append nếu đã có từ UT round):

```markdown
# Bug Handoff: [TASK-ID] — IT Round [N]

## Failing Test Cases
| TC ID | Flow | Step Fail | Actual Behavior | Expected |
|-------|------|-----------|----------------|----------|
| TC-IT-002 | Login → Order | Step 3: POST /api/orders | 500 Internal Error | 201 Created |

## Suspected Files (từ analysis.md + API Design Stub)
- [API handler / service liên quan đến step bị fail]
- [DB migration nếu liên quan]

## Hướng tiếp theo
- Chạy /dev-debug [TASK-ID] để root cause analysis
- Sau khi fix → chạy lại /qa-it (không cần chạy lại UT nếu unit code không thay đổi)
```

```
❌ IT FAILED — [N] TC fail

Bug handoff đã ghi: docs/tasks/[TASK-ID]/bug-handoff.md
Bước tiếp: /dev-debug [TASK-ID] để tìm nguyên nhân integration failure.
```

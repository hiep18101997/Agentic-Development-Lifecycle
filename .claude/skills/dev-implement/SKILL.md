---
name: dev-implement
description: >
  Implement code sau khi phương án đã chọn từ /dev-analyze. File-by-file với gate sau mỗi file.
  Trigger khi: user nói "bắt đầu implement", "code theo plan đã chọn", "viết code cho task",
  "start implementation", "implement feature", hoặc gõ /dev-implement.
---

# Skill: /dev-implement
**Role**: Developer  
**Mục đích**: Implement code sau khi phương án đã chọn từ /dev-analyze. File-by-file với gate sau mỗi file.

---

## Quan trọng: Chạy /dev-analyze trước

Skill này yêu cầu `docs/tasks/[TASK-ID]/analysis.md` đã tồn tại.
Nếu chưa có → chạy `/dev-analyze` trước.

---

## Cách spawn subagent

Dùng **Agent tool** để spawn subagent. Mỗi subagent nhận context tối thiểu cần thiết — không pass full conversation history.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc analysis doc

Đọc `docs/tasks/[TASK-ID]/analysis.md`:
- Phương án đã chọn
- Danh sách files cần thay đổi
- Quyết định kỹ thuật đã confirm

### Bước 1b — Gate: TDD Lane (opt-in)

Trước khi implement, hỏi:

```
## Mode implement

| | Lựa chọn |
|---|---------|
| A | Standard — implement code trước, test sau (mặc định) |
| B | TDD — viết test trước, code sau (recommend cho business logic phức tạp) |
```

**Nếu chọn TDD (B)**:
1. Với mỗi file business logic: viết test (failing) trước
2. Gate: confirm test cases cover đủ ACs
3. Implement code cho test pass
4. Báo cáo: "Tests: N passing / M failing" sau mỗi file

**Nếu chọn Standard (A)**: tiếp tục bình thường.

**Chờ confirm.**

### Bước 2 — Gate: Xác nhận implementation plan

```
## Tôi sẽ implement [TASK-ID] theo Phương án [X].

**Files cần thay đổi** (theo thứ tự):
1. `[file 1]` — [create/modify/delete] — [lý do]
2. `[file 2]` — [create/modify/delete] — [lý do]

**Thứ tự implement**: [giải thích tại sao thứ tự này — dependencies]

**Setup trước khi code**:
- Branch: `feature/[TASK-ID]-[slug]`
- DB migration cần tạo: [yes/no]
- ENV variables mới: [list hoặc "none"]

| | Lựa chọn |
|---|---------|
| A | Bắt đầu với `[file 1]` ngay |
| B | Điều chỉnh thứ tự — thứ tự mới: ___ |
| C | Khác: ___ |
```

**Chờ confirm.**

### Bước 3 — Implement từng file

Với **mỗi file**, theo thứ tự:

1. Đọc file hiện tại (nếu modify)
2. Implement thay đổi
3. Report ngắn

**Template báo cáo sau mỗi file**:

```
## File [N/Total]: `[path]` ✅

**Thay đổi**:
- [Mô tả thay đổi 1]
- [Mô tả thay đổi 2]

**Tests**: [Viết inline / Cần viết riêng / N/A]

| | Lựa chọn |
|---|---------|
| A | Tiếp tục `[file tiếp theo]` |
| B | Dừng lại — cần điều chỉnh: ___ |
| C | Khác: ___ |
```

**Chờ confirm trước khi sang file tiếp theo.**

Nếu gặp code không như expected (missing dependency, unexpected state, conflict với existing code):

```
## ⚠️ Blocked tại `[path]`

**Vấn đề**: [Mô tả cụ thể]

| | Lựa chọn |
|---|---------|
| A | [Hướng giải quyết A] |
| B | [Hướng giải quyết B] |
| C | Khác: ___ |
```

**Không tự quyết định — luôn hỏi khi blocked.**

### Bước 4 — Gate: Post-implementation checklist

Sau khi tất cả files xong:

```
## Implementation hoàn tất — [TASK-ID]

**Files đã thay đổi**: [N files]
**Migration cần chạy**: [yes/no — lệnh nếu yes]
**ENV cần thêm**: [list hoặc "none"]

**Dev self-check** (tự verify trước khi đưa cho user test):
- [ ] Không hardcode values (URL, credentials, magic numbers)
- [ ] Error cases được handle
- [ ] Input validated tại system boundary (API endpoint / form)
- [ ] Không log sensitive data (password, token, PII)
- [ ] DB migration reversible (nếu có)
```

**Chờ confirm dev self-check xong.**

### Bước 5 — Verification Gate: Diff Review + Self-Test

Sau khi dev confirm Bước 4, spawn subagent để phân tích diff:

> "Đọc `git diff main..HEAD` (hoặc diff của branch hiện tại). Trả về:
> 1. **Impact summary**: những gì thay đổi, module nào bị ảnh hưởng, edge cases tiềm ẩn
> 2. **Self-test steps**: 3-7 test steps cụ thể dựa trên thay đổi thực tế (không phải template chung).
>    Mỗi step: action rõ ràng, expected result rõ ràng.
>    Ưu tiên: happy path → edge case → error case.
> CHỈ đọc, không sửa gì."

Trình bày kết quả:

```
## Verification — [TASK-ID]

### Diff Summary
**Files thay đổi**: [list]
**Impact**: [module nào bị ảnh hưởng, risk gì]
**ACs được cover bởi code**:
- ✅ AC-001: [covered tại file:line]
- ⚠️ AC-002: [cần verify thủ công]

### Self-Test Steps
| # | Action | Expected Result |
|---|--------|----------------|
| T-01 | [Bước test cụ thể] | [Kết quả mong đợi] |
| T-02 | [Bước test cụ thể] | [Kết quả mong đợi] |
| T-03 | [Edge case] | [Kết quả mong đợi] |
| ... | | |

Hãy thực hiện các bước test trên và báo cáo kết quả:
- Mỗi test: PASS / FAIL / SKIP (+ ghi chú nếu FAIL)
```

**Chờ user báo cáo kết quả test.**

Sau khi nhận kết quả test, tạo `docs/tasks/[TASK-ID]/verification.md` dùng template `templates/verification.md`.

Điền vào:
- **Frontmatter**: `taskId`, `verifiedBy` (tên user), `signOffStatus` (Pending → cập nhật thành Pass/Fail sau khi user report)
- **Bảng kết quả AC**: từ kết quả subagent — mỗi AC ghi method test và kết quả
- **Automated Tests**: paste output test thực tế (lệnh + số pass/fail + coverage %)
- **Manual Test Steps**: T-01...T-N từ bảng Self-Test ở trên với kết quả thực tế điền vào
- **Issues Found**: các kết quả FAIL → mô tả với severity
- **Sign-off**: tick box dev self-review; ngày = hôm nay JST

```
## Verification hoàn tất ✓

`docs/tasks/[TASK-ID]/verification.md` đã được lưu.

**DỪNG TẠI ĐÂY.**

Bước tiếp theo (theo thứ tự):
1. `/sec-review` — security review trước khi tạo PR
2. `/dev-pr` — tạo PR (sẽ tự đọc verification.md)
```

**Không tự động chạy sec-review hay dev-pr.**

### Harness Delta Check

Trước khi kết thúc, tự hỏi:
- Có gate nào không rõ → phải đoán hành vi?
- Có template thiếu field quan trọng?
- Có vấn đề nào lặp lại từ task trước?

Nếu có → thêm entry vào `docs/improvement-backlog.md` ngay (không cần confirm human):
```
| IB-XXX | dev-implement / [TASK-ID] | [mô tả friction] | [proposed fix] | open |
```

---

## Quy tắc

- Implement từng file một — không jump ahead
- Không refactor code ngoài scope task
- Không thêm feature ngoài AC đã định nghĩa
- Migration có thể mất data → **luôn hỏi confirm** trước khi tạo
- Nếu phát hiện bất kỳ thay đổi nhạy cảm nào → dừng, xem `assets/ask-first-gates.md`
- Nếu phát hiện bug không liên quan → note lại, tạo issue riêng, không fix ngay

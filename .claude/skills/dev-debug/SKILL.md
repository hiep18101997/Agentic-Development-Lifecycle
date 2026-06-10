---
name: dev-debug
description: >
  Systematic debugging — tìm root cause trước khi fix. Reproduce → Localize → Reduce → Fix → Guard.
  Trigger khi: user nói "debug lỗi", "tìm nguyên nhân bug", "tại sao bị lỗi",
  "fix bug", "investigate error", "lỗi không biết tại sao", hoặc gõ /dev-debug.
---

# Skill: /dev-debug
**Role**: Developer  
**Mục đích**: Systematic debugging — tìm root cause trước khi fix. Tránh "fix ngẫu nhiên cho đến khi hết lỗi".

---

## Nguyên tắc cốt lõi

**Không bao giờ** touch code trước khi có minimal reproduction.  
Fix sai root cause = tạo thêm bugs.

## Quy trình 5 bước

### Bước 1 — Reproduce

```
## Tôi sẽ giúp debug vấn đề này.

Trước tiên:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Mô tả lỗi: gì xảy ra vs gì mong đợi? | _(điền vào)_ |
| 2 | Steps to reproduce | _(điền vào — dù rough cũng được)_ |
| 3 | Lỗi này mới xuất hiện hay luôn có? | A: Mới xuất hiện — sau thay đổi: ___ / B: Luôn có / C: Không chắc / D: Khác: ___ |
| 4 | Error message / stack trace | _(paste vào đây nếu có)_ |
```

**Ask First Gate**: Nếu lỗi xảy ra trên production với user thật → báo ngay cho team trước khi debug. Xem thêm `assets/ask-first-gates.md`.

### Bước 2 — Localize

Spawn subagent để đọc code liên quan (read-only):

> "Tìm code xử lý [behavior mô tả]. Trả về file:line và flow từ entry point đến điểm có thể fail. Không sửa gì."

Trình bày:

```
## Tôi xác định vùng code có thể là nguồn lỗi:

1. [file:line] — [lý do suspect]
2. [file:line] — [lý do suspect]

Hypothesis:
- H1: [Giả thuyết 1 về nguyên nhân]
- H2: [Giả thuyết 2]

Tôi sẽ kiểm tra H1 trước vì [lý do].
Bạn có thêm hypothesis nào dựa trên context bạn biết không?
```

### Bước 3 — Reduce

Tạo minimal reproduction — code nhỏ nhất có thể trigger lỗi.

```
## Minimal reproduction:

[Code snippet hoặc steps tối thiểu]

Lỗi có reproduce với code này không?
(Nếu không → vấn đề nằm ở interaction với phần khác, không phải đây)
```

**Không tiếp tục nếu chưa có minimal reproduction.**

### Bước 4 — Fix

Chỉ sau khi xác nhận root cause:

```
## Root cause xác định: [Mô tả rõ]

Đề xuất fix:
- Fix A: [Targeted fix] — sửa đúng chỗ, ít side effect
- Fix B: [Broader fix] — sửa cả pattern, nhiều file hơn

Đề xuất Fix A trước (nhỏ hơn, dễ review hơn).

| | Lựa chọn |
|---|---------|
| A | Đồng ý — Fix A |
| B | Muốn Fix B (broader) |
| C | Khác: ___ |
```

**Ask First Gate**: Nếu fix liên quan đến bất kỳ thay đổi nhạy cảm nào (`assets/ask-first-gates.md`) → cần senior review trước khi apply.

### Bước 5 — Guard

Sau khi fix:

```
## Fix đã apply.

Tôi cũng sẽ thêm test để prevent regression:
[Mô tả test case]

| | Lựa chọn |
|---|---------|
| A | Không, đủ rồi |
| B | Có — edge case: ___ |
| C | Khác: ___ |
```

---

## Red Flags (dừng lại nếu thấy)

- Đang thử fix nhiều thứ cùng lúc mà không hiểu tại sao
- Lỗi "biến mất" nhưng không biết tại sao
- Fix xong nhưng không thể reproduce được trường hợp fail ban đầu
- Stack trace trỏ vào library code — thường là cách dùng sai, không phải bug trong lib

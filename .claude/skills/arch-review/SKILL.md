---
name: arch-review
description: >
  Review design decision, phát hiện vấn đề kiến trúc, đề xuất cải thiện.
  Trigger khi: user nói "review design", "kiểm tra kiến trúc", "architecture review",
  "review technical decision", "xem design có ổn không", hoặc gõ /arch-review.
---

# Skill: /arch-review
**Role**: Tech Lead / Architect  
**Mục đích**: Review design decision, phát hiện vấn đề kiến trúc, đề xuất cải thiện.

---

## Hướng dẫn thực hiện

### Bước 1 — Nhận input

Input có thể là:
- Mô tả design decision cần review
- Code snippet / diagram
- PR link
- Spec document

### Bước 2 — Gate: Xác nhận scope review

```
## Tôi sẽ review [tên design/component].

Trước khi bắt đầu, cho tôi biết:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Review tập trung vào gì? | A: Scalability / B: Security / C: Maintainability / D: Performance / E: Tất cả / F: Khác: ___ |
| 2 | Có constraint nào tôi cần biết? | _(điền vào — team size, deadline, tech debt...)_ |
| 3 | Đã có ADR nào liên quan chưa? | A: Có — link: ___ / B: Không / C: Khác: ___ |
```

### Bước 3 — Phân tích và Review

Đánh giá theo các lens:

**1. Correctness** — Logic có đúng không?
**2. Scalability** — Chịu được load tăng không?
**3. Maintainability** — Team sau có hiểu và sửa được không?
**4. Security** — Có surface attack nào không?
**5. Performance** — Bottleneck ở đâu?
**6. Coupling** — Phụ thuộc quá nhiều vào module khác không?
**7. Testability** — Có thể test được dễ không?

### Bước 4 — Trình bày kết quả

```
## Architecture Review: [Tên]

### 🟢 Điểm mạnh
- [Điều tốt 1]
- [Điều tốt 2]

### 🔴 Vấn đề nghiêm trọng (cần sửa trước khi merge)
| ID | Vấn đề | Impact | Đề xuất sửa |
|----|--------|--------|------------|
| | | | |

### 🟡 Vấn đề nên cải thiện (không blocking)
| ID | Vấn đề | Đề xuất |
|----|--------|---------|
| | | |

### 💡 Đề xuất dài hạn
- [Cải tiến có thể làm sau]

### Câu hỏi cần làm rõ

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | [Quyết định design chưa rõ lý do] | _(điền vào)_ |
| 2 | [Trade-off chưa được document] | _(điền vào)_ |
```

### Bước 5 — Gate: Discussion

```
Sau khi review:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Vấn đề [ID] — lý do design như vậy là gì? | _(giải thích context nếu có)_ |
| 2 | Đề xuất [X] — có feasible trong timeline hiện tại không? | A: Có, sẽ làm / B: Không feasible / C: Cần cân nhắc thêm / D: Khác: ___ |
| 3 | Tạo ADR cho quyết định này? (/arch-adr) | A: Có / B: Không cần / C: Khác: ___ |
```

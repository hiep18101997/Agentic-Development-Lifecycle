---
adrId: ADR-[NNN]
date: [YYYY-MM-DD]
status: Proposed
deciders: [Names]
consulted: [Names — người được hỏi ý kiến trước khi quyết định]
informed: [Names — người được thông báo sau khi quyết định]
taskContext: [PROJECT-XXX nếu có]
lang: vi
---

# ADR-[NNN]: [Tiêu đề ngắn gọn mô tả quyết định]

<!-- status values: Proposed | Accepted | Deprecated | Superseded by ADR-[XXX] -->

---

## Bối cảnh và Vấn đề

[2-3 câu mô tả vấn đề cần giải quyết và tại sao đây là quyết định quan trọng cần document. Những force hoặc constraint nào ảnh hưởng đến quyết định này?]

## Yếu tố quyết định (Decision Drivers)

- [Force hoặc concern 1 — ví dụ: "Team cần giải pháp scale được lên 10x traffic trong 6 tháng"]
- [Force hoặc concern 2 — ví dụ: "Chi phí vận hành phải dưới ngưỡng X/tháng"]
- [Force hoặc concern 3]

## Các phương án đã cân nhắc

- [Phương án 1: Tên]
- [Phương án 2: Tên]
- [Phương án 3: Tên]

## Quyết định

**Chọn phương án**: [Tên phương án được chọn]

**Lý do**: [Giải thích rõ ràng tại sao phương án này được chọn so với các phương án khác. Liên hệ trực tiếp đến các Decision Drivers ở trên. Nêu rõ trade-off được chấp nhận một cách có ý thức.]

## Ưu và Nhược của từng phương án

### Phương án 1: [Tên]

[Mô tả ngắn — 1-2 câu về cách tiếp cận]

- **Ưu**: [Lợi ích rõ ràng nhất]
- **Ưu**: [Lợi ích thứ hai nếu có]
- **Nhược**: [Hạn chế hoặc rủi ro chính]
- **Nhược**: [Hạn chế thứ hai nếu có]

### Phương án 2: [Tên]

[Mô tả ngắn]

- **Ưu**: [...]
- **Nhược**: [...]

### Phương án 3: [Tên] — Đã chọn

[Mô tả ngắn]

- **Ưu**: [...]
- **Ưu**: [...]
- **Nhược**: [...]

## Hệ quả

### Tích cực
- [Lợi ích kỳ vọng từ quyết định này]
- [Kết quả tốt có thể dự đoán được]

### Tiêu cực / Trade-offs
- [Cost hoặc risk được chấp nhận có ý thức — không che giấu]
- [Hạn chế mà team phải sống chung]

### Trung tính
- [Side effect không tốt không xấu — thay đổi cách làm việc, cần training, v.v.]

## Xác nhận tuân thủ (Confirmation)

[Làm thế nào để verify rằng quyết định này được implement đúng? Phải cụ thể và có thể kiểm tra được.

Ví dụ:
- "Sau khi implement, chạy load test xác nhận p95 < 200ms tại 500 RPS"
- "Peer review checklist item #5 trong /dev-review phải pass"
- "CI pipeline bắt buộc phải có bước kiểm tra [X] trước khi merge"
]

## Điều kiện để revisit

[Khi nào quyết định này nên được xem xét lại? Phải cụ thể.

Ví dụ:
- "Khi traffic vượt 1M req/day trong 2 tuần liên tiếp"
- "Khi team scale lên > 15 devs"
- "Nếu vendor [X] ngừng hỗ trợ phiên bản đang dùng"
]

## Tài liệu liên quan

- [Link đến spec, PR, meeting notes, issue, hoặc ADR khác liên quan]
- [ADR-[NNN]: Tên ADR liên quan nếu có]

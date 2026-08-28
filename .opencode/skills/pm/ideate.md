---
name: pm:ideate
description: >
  Refine ý tưởng mờ nhạt thành concept rõ ràng với problem statement và NOT Doing list.
  Dùng trước /ba:spec để tránh spec sai từ đầu.
  Trigger khi: user nói "có ý tưởng muốn explore", "chưa biết làm gì", "brainstorm feature",
  "idea còn mơ hồ", "muốn clarify hướng đi", hoặc gõ /pm:ideate.
---

# /pm:ideate
**Role**: PM / BA
**Mục đích**: Refine ý tưởng mờ nhạt thành concept rõ ràng TRƯỚC khi chạy /ba:spec. Tránh spec sai từ đầu.

---

## Khi nào dùng

- Yêu cầu từ stakeholder còn rất mơ hồ ("làm cái gì đó với dashboard")
- Nhiều hướng khả thi, chưa rõ nên đi hướng nào
- Muốn explore options trước khi commit vào spec

## Hướng dẫn thực hiện

### Bước 1 — Gate: Thu thập ý tưởng thô

```
## Tôi sẽ giúp làm rõ ý tưởng này.

Mô tả cho tôi nghe: vấn đề bạn đang muốn giải quyết là gì?
(Không cần hoàn chỉnh — rough idea cũng được)
```

### Bước 2 — Diverge: Tạo 5-8 variations

**Research trước khi tạo variations**: Dùng `web_search` (nếu không có công cụ search, hỏi user qua `question()`) kiểm tra đã có sản phẩm/pattern nào giải quyết vấn đề tương tự chưa. Fold finding liên quan vào các variation bên dưới — tránh generate ý tưởng trong vacuum, bỏ qua prior art.

Phân tích ý tưởng qua các lens:

- **Inversion**: Nếu làm ngược lại thì sao?
- **Simplification**: Phiên bản đơn giản nhất có thể là gì?
- **Constraint removal**: Nếu không có giới hạn thời gian/budget thì sao?
- **Analogy**: Ngành khác giải quyết vấn đề tương tự như thế nào?
- **User focus**: Nếu chỉ cần giải quyết cho 1 user cụ thể, làm gì?

Tạo 5-8 variations ngắn gọn (2-3 câu mỗi cái).

### Bước 3 — Converge: Nhóm thành 2-3 hướng

Cluster các variations thành 2-3 strategic directions:

```
## Tôi thấy [N] hướng tiếp cận:

### Hướng A: [Tên — từ khóa đặc trưng]
[2-3 câu mô tả]
- Phù hợp khi: [điều kiện]
- Risk: [rủi ro chính]

### Hướng B: [Tên]
...

### Hướng C: [Tên] (nếu có)
...
```

### Bước 4 — One-pager + "Not Doing" list

```
## Đề xuất hướng đi: [Hướng X]

**Problem statement**: [1 câu]
**Proposed solution**: [2-3 câu]
**Target users**: [Ai]
**Success metric**: [Đo thành công bằng gì]

### ❌ NOT Doing (quan trọng)
- [Điều 1 không làm trong scope này]
- [Điều 2 không làm]
- [Điều 3 không làm]
```

### Bước 5 — Gate cuối: Xác nhận hướng đi

```
question({
  questions: [{
    question: "\"Not Doing list\" có đúng không?",
    header: "Not Doing",
    options: [
      { label: "Đúng", description: "Not Doing list đã chính xác" },
      { label: "Còn trong scope", description: "Có mục vẫn đang trong scope — cần điều chỉnh" },
    ]
  }, {
    question: "Success metric có measurable không?",
    header: "Metric",
    options: [
      { label: "Có", description: "Success metric measurable được" },
      { label: "Chưa đủ", description: "Cần sửa success metric cho rõ ràng hơn" },
    ]
  }, {
    question: "Sẵn sàng chạy /ba:spec với hướng này chưa?",
    header: "Next step",
    options: [
      { label: "Sẵn sàng", description: "Chạy /ba:spec để viết spec chi tiết" },
      { label: "Cần explore thêm", description: "Cần explore thêm hướng khác trước khi spec" },
    ]
  }]
})
```

---

## Lưu ý

- "Not Doing list" quan trọng không kém "Doing list" — giúp tránh scope creep
- Nếu team không đồng ý về hướng → đây là signal để facilitate thêm, không phải skip bước này

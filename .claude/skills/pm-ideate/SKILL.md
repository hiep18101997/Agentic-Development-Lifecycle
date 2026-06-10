---
name: pm-ideate
description: >
  Refine ý tưởng mờ nhạt thành concept rõ ràng với problem statement và NOT Doing list.
  Dùng trước /ba-spec để tránh spec sai từ đầu.
  Trigger khi: user nói "có ý tưởng muốn explore", "chưa biết làm gì", "brainstorm feature",
  "idea còn mơ hồ", "muốn clarify hướng đi", hoặc gõ /pm-ideate.
---

# Skill: /pm-ideate
**Role**: PM / BA  
**Mục đích**: Refine ý tưởng mờ nhạt thành concept rõ ràng TRƯỚC khi chạy /ba-spec. Tránh spec sai từ đầu.

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

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | "Not Doing list" có đúng không? | A: Đúng / B: Có gì vẫn trong scope — mục: ___ / C: Khác: ___ |
| 2 | Success metric có measurable không? | A: Có / B: Chưa đủ — sửa thành: ___ / C: Khác: ___ |
| 3 | Sẵn sàng chạy /ba-spec với hướng này chưa? | A: Sẵn sàng / B: Cần explore thêm — hướng: ___ / C: Khác: ___ |
```

---

## Lưu ý

- "Not Doing list" quan trọng không kém "Doing list" — giúp tránh scope creep
- Nếu team không đồng ý về hướng → đây là signal để facilitate thêm, không phải skip bước này

---
name: arch-adr
description: >
  Tạo Architecture Decision Record (ADR) để document quyết định kiến trúc quan trọng.
  Trigger khi: user nói "tạo ADR", "document quyết định kiến trúc", "viết ADR",
  "record design decision", hoặc gõ /arch-adr.
---

# Skill: /arch-adr
**Role**: Tech Lead / Architect  
**Mục đích**: Tạo Architecture Decision Record để document quyết định kiến trúc quan trọng.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Thu thập context

```
## Tôi sẽ tạo ADR cho quyết định: [tên]

Để soạn ADR đầy đủ, cho tôi biết:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Vấn đề / context dẫn đến quyết định này? | _(điền vào)_ |
| 2 | Những phương án nào đã được cân nhắc? | _(điền vào)_ |
| 3 | Tại sao chọn phương án hiện tại? | _(điền vào)_ |
| 4 | Ai là người ra quyết định? | _(điền vào)_ |
```

### Bước 2 — Tạo ADR

Tạo file `docs/decisions/ADR-[NNN]-[slug].md` dùng template `templates/adr.md`.

Điền đầy đủ các section:
- **Context**: tình huống + constraints dẫn đến quyết định
- **Quyết định**: dứt khoát, không mơ hồ
- **Các phương án đã cân nhắc**: tối thiểu 2, bao gồm phương án đã chọn
- **Hệ quả**: tích cực + tiêu cực/trade-offs
- **Điều kiện để revisit**: trigger cụ thể (không phải "khi cần")

### Bước 3 — Gate cuối

```
ADR-[NNN] đã soạn xong.

Câu hỏi trước khi finalize:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | "Hệ quả tiêu cực" có đủ honest không? | A: Đủ rồi / B: Cần thêm — cụ thể: ___ / C: Khác: ___ |
| 2 | "Điều kiện để revisit" có realistic không? | A: Có, hợp lý / B: Không — sửa lại: ___ / C: Khác: ___ |
| 3 | Có team member nào cần review trước khi accept? | A: Không cần / B: Có — tag: ___ / C: Khác: ___ |

Sau khi confirm, tôi sẽ update trạng thái sang "Accepted".
```

---
name: arch:adr
description: >
  Tạo Architecture Decision Record (ADR) để document quyết định kiến trúc quan trọng.
  Trigger khi: user nói "tạo ADR", "document quyết định kiến trúc", "viết ADR",
  "record design decision", hoặc gõ /arch:adr.
---

# /arch:adr
**Role**: Tech Lead / Architect  
**Mục đích**: Tạo Architecture Decision Record để document quyết định kiến trúc quan trọng.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Thu thập context

question({
  questions: [{
    question: "Vấn đề / context dẫn đến quyết định này là gì?",
    header: "Context",
    options: [
      { label: "Tôi sẽ mô tả", description: "Tôi sẽ cung cấp context chi tiết" },
    ]
  }, {
    question: "Những phương án nào đã được cân nhắc?",
    header: "Options",
    options: [
      { label: "Tôi sẽ liệt kê", description: "Tôi sẽ cung cấp các phương án" },
    ]
  }]
})

### Bước 2 — Tạo ADR

Tạo file `docs/decisions/ADR-[NNN]-[slug].md` dùng template `templates/adr.md`.

Điền đầy đủ các section:
- **Context**: tình huống + constraints dẫn đến quyết định
- **Quyết định**: dứt khoát, không mơ hồ
- **Các phương án đã cân nhắc**: tối thiểu 2, bao gồm phương án đã chọn
- **Hệ quả**: tích cực + tiêu cực/trade-offs
- **Điều kiện để revisit**: trigger cụ thể (không phải "khi cần")

### Bước 3 — Gate cuối

question({
  questions: [{
    question: "ADR đã soạn xong. 'Hệ quả tiêu cực' có đủ honest không?",
    header: "Review",
    options: [
      { label: "Đủ rồi", description: "Trade-offs đã được document đầy đủ" },
      { label: "Cần thêm", description: "Còn hệ quả tiêu cực chưa được đề cập" },
    ]
  }, {
    question: "Có team member nào cần review trước khi accept?",
    header: "Reviewers",
    options: [
      { label: "Không cần", description: "Có thể accept ngay" },
      { label: "Cần review", description: "Cần người khác review trước" },
    ]
  }]
})

Sau khi confirm, tôi sẽ update trạng thái sang "Accepted".

Sau khi ADR chuyển sang "Accepted", gợi ý chạy `node bin/generate-project-context.js` để refresh digest tự động `docs/project-context.md` (không hand-edit file này).

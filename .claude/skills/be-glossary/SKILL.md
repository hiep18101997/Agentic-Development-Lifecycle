---
name: be-glossary
description: >
  Duy trì glossary JP-VN-EN — thêm thuật ngữ mới, resolve xung đột dịch thuật,
  sync với tài liệu dự án. Trigger khi: user nói "thêm từ vào glossary",
  "cập nhật glossary", "thuật ngữ mới từ JP", "glossary có thiếu từ",
  "term không nhất quán", hoặc gõ /be-glossary.
---

# Skill: /be-glossary
**Role**: Bridge Engineer  
**Mục đích**: Duy trì `templates/jp-vn-en-glossary.md` — bộ từ vựng chuẩn dùng chung cho toàn dự án JP outsource.

---

## Context

Glossary là single source of truth cho thuật ngữ:
- BE dùng khi dịch yêu cầu JP → VN
- Dev dùng khi đọc spec
- QA dùng khi viết test report
- PM dùng khi viết status report

Mỗi khi `be-bridge` gặp `[GLOSSARY?]` tag → đó là signal cần chạy skill này.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Xác định công việc

Dùng `AskUserQuestion` tool:

- **Loại công việc**:
  - Thêm terms mới (từ session `be-bridge` vừa xong)
  - Review và chuẩn hóa terms hiện có
  - Tìm kiếm term trong glossary
  - Export glossary cho tài liệu JP

**Chờ confirm.**

### Bước 2 — Đọc glossary hiện tại

Đọc `templates/jp-vn-en-glossary.md` toàn bộ.

Kiểm tra:
- Có terms nào dùng nhiều cách dịch khác nhau không?
- Có terms nào thiếu column JP hoặc VN không?
- Có terms nào đã outdated không?

### Bước 3 — Xử lý theo loại công việc

#### 3a. Thêm terms mới

Với mỗi term cần thêm, confirm:

```
## Term mới cần thêm vào glossary

| # | JP | VN đề xuất | EN | Context | Conflict? |
|---|----|-----------|----|---------|----------|
| 1 | [JP term] | [VN] | [EN] | [Dùng trong context nào] | [Có term tương tự không?] |
| 2 | [...] | [...] | [...] | [...] | [...] |

Confirm để thêm vào glossary?
```

**Chờ confirm.**

Sau confirm: edit `templates/jp-vn-en-glossary.md` — thêm vào đúng section theo alphabet (JP reading order).

#### 3b. Resolve conflict dịch thuật

Khi phát hiện term có nhiều cách dịch:

```
## Conflict detected: "[JP term]"

Hiện tại trong glossary/tài liệu có:
- Cách 1: [VN variant A] — xuất hiện trong: [file list]
- Cách 2: [VN variant B] — xuất hiện trong: [file list]

Khuyến nghị: [Variant nào + lý do]

| | Lựa chọn |
|---|---------|
| A | Dùng "[Variant A]" — cập nhật tất cả tài liệu |
| B | Dùng "[Variant B]" — cập nhật tất cả tài liệu |
| C | Khác: ___ |
```

**Chờ confirm.**

Sau confirm: cập nhật glossary + search-replace trong `docs/` để nhất quán.

#### 3c. Tìm kiếm term

```
## Kết quả tìm kiếm: "[query]"

| JP | VN | EN | Context |
|----|----|----|---------|
| [...] | [...] | [...] | [...] |

Không tìm thấy match chính xác. Terms gần nhất:
- [Related term 1]
- [Related term 2]
```

#### 3d. Export glossary cho tài liệu JP

Tạo `docs/handover/glossary-export-[date].md` với format phù hợp để đính kèm vào 引き継ぎ書 hoặc gửi khách JP:

```markdown
# 用語集 / Glossary / Bảng thuật ngữ

**Project**: [Tên]  
**Updated**: [YYYY-MM-DD]

| 日本語 (JP) | ベトナム語 (VN) | English (EN) | 備考 / Ghi chú |
|------------|---------------|-------------|---------------|
| [...] | [...] | [...] | [...] |
```

### Bước 4 — Summary

```
## Glossary cập nhật xong.

Thay đổi:
- Thêm mới: [N] terms
- Cập nhật: [N] terms
- Conflicts resolved: [N]

Terms mới đáng chú ý:
| JP | VN | EN |
|----|----|----|
| [...] | [...] | [...] |

File đã cập nhật: templates/jp-vn-en-glossary.md
```

---

## Quy tắc

- Mỗi term phải có đủ 3 cột: JP + VN + EN — không để trống
- Term kỹ thuật chuẩn (JWT, API, CRUD...) → giữ nguyên tiếng Anh trong cột VN
- Context column quan trọng — ghi rõ term dùng trong domain nào (auth / payment / UI...)
- Khi có conflict: luôn hỏi BE/domain expert — không tự quyết định
- Sau khi thêm term mới → grep `docs/` xem có file nào dùng cách dịch cũ cần update không

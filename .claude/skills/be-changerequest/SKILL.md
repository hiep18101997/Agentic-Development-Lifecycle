---
name: be-changerequest
description: >
  Quản lý 変更依頼 (Change Request) — phân tích impact, tạo approval trail,
  version control thay đổi spec. Dùng khi spec thay đổi giữa sprint hoặc sau sign-off.
  Trigger khi: user nói "khách JP yêu cầu thay đổi", "tạo change request", "変更依頼",
  "spec thay đổi giữa chừng", "CR mới từ JP", "change request", hoặc gõ /be-changerequest.
---

# Skill: /be-changerequest
**Role**: Bridge Engineer / PM  
**Mục đích**: Xử lý yêu cầu thay đổi từ khách JP một cách có kiểm soát — impact analysis rõ ràng, approval trail đầy đủ, không merge thay đổi ngầm vào spec.

---

## Context

Thay đổi spec sau sign-off là rủi ro cao nhất trong JP outsource:
- Khách JP hay yêu cầu thay đổi nhỏ qua email/chat mà không có formal CR
- Dev VN implement "cho nhanh" mà không có approval trail → sau này khách chất vấn
- Impact chưa được estimate → scope creep không kiểm soát được

**Nguyên tắc**: Mọi thay đổi sau sign-off đều phải có CR document trước khi dev touch code.

---

## Hướng dẫn thực hiện

### Bước 0 — Load glossary

Đọc `templates/jp-vn-en-glossary.md` trước khi xử lý thuật ngữ kỹ thuật.

### Bước 1 — Gate: Thu thập thông tin CR

Dùng `AskUserQuestion` tool:

- **Nguồn yêu cầu**: Email từ JP / Meeting / Slack/Teams / Formal 変更依頼書
- **Loại thay đổi**: Thêm feature mới / Sửa spec hiện tại / Bỏ scope / Performance requirement mới / UI/UX adjustment
- **Urgency**: Cần trong sprint hiện tại / Sprint sau / Flexible

**Chờ confirm.**

### Bước 2 — Phân tích Impact

Đọc:
- `docs/tasks/[TASK-ID]/requirements.md` — spec gốc đang bị thay đổi
- `docs/tasks/[TASK-ID]/analysis.md` — implementation đã plan hoặc đang làm
- `docs/decisions/ADR-*.md` — quyết định kỹ thuật liên quan

Phân tích theo 4 chiều:

```
## Impact Analysis: CR-[NUMBER]

### Scope Impact
- Files/modules bị ảnh hưởng: [list]
- ACs bị thay đổi / thêm / bỏ: [diff so với spec gốc]
- Test cases cần cập nhật: [list]

### Effort Impact
- Estimate thêm: [X man-hours / man-days]
- Có thể làm trong sprint hiện tại: [Yes / No / Partial]
- Nếu No: cần push sang sprint [N+1 / TBD]

### Risk Impact
- Risk mới: [list]
- Dependencies bị ảnh hưởng: [list]
- Regression risk: [Low / Medium / High]

### Schedule Impact
- Deadline hiện tại: [Date]
- Impact đến deadline: [None / Trễ X ngày / Cần thương lượng lại]
```

### Bước 3 — Gate: Xác nhận impact trước khi soạn CR

```
## Tôi đã phân tích impact của yêu cầu thay đổi.

[Hiển thị impact analysis từ Bước 2]

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Impact analysis có chính xác không? | A: Chính xác / B: Cần điều chỉnh: ___ / C: Khác: ___ |
| 2 | Ai là người approve CR phía team? | _(điền tên PM / Tech Lead)_ |
| 3 | Cần gửi estimate cho JP trước khi approve không? | A: Có — gửi email estimate trước / B: Không — tiếp tục tạo CR doc / C: Khác: ___ |
```

**Chờ confirm.**

### Bước 4 — Tạo Change Request Documents

#### 4a. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md` (tiếng Việt — nội bộ)

Tạo dùng template `templates/change-request.md`.

Điền vào 10 mục từ kết quả phân tích ảnh hưởng:
- CR ID, tiêu đề, loại thay đổi, người yêu cầu, mức ảnh hưởng trong frontmatter
- Mô tả thay đổi (từ tóm tắt yêu cầu JP)
- Lý do/Bối cảnh
- Bảng chức năng bị ảnh hưởng (từ scope impact Bước 2)
- Bảng phân tích kỹ thuật (DB/API/UI/Integration/Security/Performance)
- Ước tính công việc (Dev/QA/Review+Deploy tính bằng 人日)
- Rủi ro và biện pháp
- Kế hoạch triển khai (ngày mục tiêu, sprint, điều kiện tiên quyết)
- Tiêu chí nghiệm thu (tối thiểu 2 ACs)
- Hiệu quả kỳ vọng
- Bảng lịch sử phê duyệt (PM + Tech Lead + Khách JP — đều bắt đầu là Pending)

#### 4b. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md` (tiếng Nhật — gửi khách JP)

Tạo dùng template `templates/change-request.ja.md`.

Đây là tài liệu chính thức gửi khách JP (変更依頼書). Dịch nội dung thay đổi và phân tích ảnh hưởng từ 4a sang tiếng Nhật dùng thuật ngữ từ `templates/jp-vn-en-glossary.md`.

### Bước 5 — Gate cuối

```
## Change Request CR-[NUMBER] đã soạn xong.

Files tạo ra:
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md (nội bộ — commit)
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md (gửi JP — commit)

Checklist:
- [ ] Impact analysis đã được PM và Tech Lead review
- [ ] Estimate đã được confirm (không phải "TBD")
- [ ] CR-jp.md đã được dịch đúng thuật ngữ từ glossary
- [ ] Approval table có đủ 3 bên: PM + Tech Lead + Khách JP

Bước tiếp theo:
- [ ] Gửi CR-jp.md cho khách JP để confirm
- [ ] Sau khi khách JP approve: cập nhật requirements.md (ghi rõ "CR-[NUMBER] approved [date]")
- [ ] Tạo GitHub Issue mới hoặc cập nhật issue gốc
```

**Chờ confirm.**

---

## Quy tắc

- **KHÔNG** implement thay đổi trước khi CR được approve bởi cả PM và khách JP
- Mọi CR phải có số (CR-001, CR-002...) — track trong `docs/tasks/[TASK-ID]/cr/`
- Nếu CR thay đổi kiến trúc → trigger `/arch-adr` sau khi approve
- Nếu CR thêm security-sensitive feature → trigger `/sec-review` sau implement

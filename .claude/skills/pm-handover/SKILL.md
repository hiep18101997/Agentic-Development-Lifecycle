---
name: pm-handover
description: >
  Tạo gói tài liệu bàn giao dự án (引き継ぎ) đầy đủ: codebase map, decision log,
  glossary, open issues, contact matrix. Dùng khi dev rời team, dự án chuyển giao,
  hoặc kết thúc contract JP outsource.
  Trigger khi: user nói "bàn giao dự án", "tạo tài liệu handover", "引き継ぎ",
  "dev nghỉ cần handover", "chuyển giao project", "project handoff", hoặc gõ /pm-handover.
---

# Skill: /pm-handover
**Role**: PM / Bridge Engineer / Tech Lead  
**Mục đích**: Tạo gói bàn giao dự án toàn diện — đủ để người mới tiếp quản mà không cần hỏi lại team cũ.

---

## Context

Bàn giao trong JP outsource model có 2 scenario:
- **Dev rời team giữa project**: bàn giao cho dev mới trong cùng team VN
- **Kết thúc contract**: bàn giao lại cho khách JP hoặc vendor mới

Tài liệu bàn giao JP (引き継ぎ書) phải đủ rõ để khách JP hiểu mà không cần gọi điện.

---

## Hướng dẫn thực hiện

### Bước 0 — Load glossary

Đọc `templates/jp-vn-en-glossary.md` trước khi viết bất kỳ thuật ngữ kỹ thuật nào.

### Bước 1 — Gate: Xác định loại bàn giao

Dùng `AskUserQuestion` tool:

- **Loại**: Internal (dev sang dev trong team VN) / Client handover (bàn giao lại cho khách JP) / Vendor handover (chuyển sang vendor mới)
- **Scope**: Full project / Một module cụ thể / Một role cụ thể (dev / QA / BE)
- **Deadline**: Khi nào cần hoàn tất?

**Chờ confirm.**

### Bước 2 — Thu thập thông tin dự án

Đọc song song các nguồn có sẵn:

```
Nguồn đọc:
- docs/baseline/codebase-overview.md (nếu có)
- docs/decisions/ADR-*.md — tất cả ADRs
- docs/tasks/*/requirements.md — open/in-progress tasks
- docs/workflows/sprint-lifecycle.md
- templates/jp-vn-en-glossary.md
- git log --oneline -50 (recent history)
- git branch -a (active branches)
```

Nếu thiếu `codebase-overview.md` → đề xuất chạy `/ba-reverse` trước.

### Bước 3 — Tạo Handover Package

#### 3a. `docs/handover/[DATE]-handover.md` (nội bộ — cho VN team)

Tạo dùng template `templates/handover.md`.

Điền vào đủ 7 mục:
1. **Tổng quan hệ thống**: mục đích, chức năng chính, users; tech stack; bảng môi trường (Production/Staging/Dev URLs)
2. **Trạng thái hiện tại**: phiên bản, bảng known issues/tech debt (từ `docs/improvement-backlog.md`), tasks đang dở
3. **Danh sách liên lạc quan trọng**: contact matrix đầy đủ cho tất cả roles; ghi chú credentials lưu riêng
4. **Hệ thống và công cụ**: mọi công cụ người mới cần access — platform, account type, ghi chú access
5. **Lịch công việc định kỳ**: mọi công việc định kỳ theo tần suất (ngày/tuần/tháng) với thời gian JST
6. **Lưu ý vận hành**: danh sách gotchas, sự cố thường gặp + cách xử lý, rollback procedure
7. **Tài liệu bổ sung**: bảng paths của tất cả tài liệu quan trọng

#### 3b. `docs/handover/[DATE]-引き継ぎ書.md` (tiếng Nhật — khi bàn giao cho khách JP)

Tạo dùng template `templates/handover.ja.md`.

Đây là tài liệu chính thức gửi khách JP. Dùng `templates/html-bilingual.html` nếu cần version HTML để gửi email.
Đảm bảo:
- Tất cả section headings bằng tiếng Nhật (template đã có)
- Dùng kính ngữ (敬語) trong mọi phần mô tả
- Credentials: ghi NƠI lấy, không ghi giá trị inline
- Thời gian dùng JST

### Bước 4 — Checklist hoàn chỉnh

```
## Handover Package đã soạn xong.

Checklist:
- [ ] Tất cả ENV variables được liệt kê (không để trống section)
- [ ] Contact matrix đầy đủ — đặc biệt contact JP side
- [ ] Open tasks và blockers được ghi rõ
- [ ] Setup instructions đã test được (người mới có thể follow mà không cần hỏi)
- [ ] Known issues được ghi với mức độ và hướng xử lý
- [ ] Credentials: ghi nguồn lấy, KHÔNG ghi giá trị trực tiếp

Files tạo ra:
- docs/handover/[DATE]-handover.md (VN — commit)
- docs/handover/[DATE]-引き継ぎ書.md (JP — commit, nếu client handover)

Confirm để finalize?
```

**Chờ confirm.**

### Bước 5 — Kết luận

```
Handover package hoàn tất.

Gợi ý bước tiếp theo:
- Tổ chức handover meeting — người bàn giao walk-through tài liệu
- Người tiếp nhận làm shadow 1-2 sprint trước khi fully own
- Sau handover meeting: cập nhật tài liệu dựa trên Q&A
```

---

## Quy tắc

- Không giả định người tiếp nhận đã biết context — giải thích mọi thứ như fresh start
- Credentials: KHÔNG bao giờ ghi trực tiếp vào tài liệu
- JP deliverable: dùng kính ngữ (敬語) trong tài liệu tiếng Nhật
- Sau khi merge, update `docs/workflows/role-guide.md` nếu contact matrix thay đổi

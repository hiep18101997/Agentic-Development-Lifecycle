---
name: ba-spec
description: >
  Chuyển đổi yêu cầu thô thành tài liệu đặc tả nghiệp vụ có cấu trúc.
  Trigger khi: user nói "viết spec", "soạn đặc tả", "phân tích yêu cầu", "write spec",
  "tạo requirements doc", "business spec", hoặc gõ /ba-spec.
---

# Skill: /ba-spec
**Role**: Business Analyst  
**Mục đích**: Chuyển đổi yêu cầu thô (raw requirement) thành tài liệu đặc tả nghiệp vụ có cấu trúc.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc và phân tích input

Nhận input từ người dùng (email, meeting notes, verbal description, Jira ticket...). Phân tích để xác định:
- Stakeholder chính
- Vấn đề cần giải quyết (problem statement)
- Phạm vi (scope)
- Các actor liên quan
- Điều kiện ràng buộc đã biết

### Bước 2 — Gate: Trình bày hiểu biết ban đầu + Hỏi làm rõ

Trình bày theo format:

```
## Tôi hiểu yêu cầu như sau:

**Vấn đề cần giải quyết**: [...]
**Stakeholder chính**: [...]
**Phạm vi sơ bộ**: [...]
**Các actor**: [...]

## Trước khi tôi soạn spec, tôi cần làm rõ:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | [Câu hỏi về business rule chưa rõ] | _(điền vào)_ |
| 2 | [Câu hỏi về edge case hoặc exception] | _(điền vào)_ |
| 3 | [Câu hỏi về tích hợp với hệ thống khác nếu có] | A: Có tích hợp — mô tả: ___ / B: Không / C: Khác: ___ |
```

**Chờ human trả lời trước khi tiếp tục.**

### Bước 3 — Soạn Specification Document

Sau khi nhận câu trả lời, tạo `docs/tasks/[TASK-ID]/requirements.md` dùng template `templates/task-doc-requirements.md`.

**Frontmatter**: điền `sessionId` (định dạng `TASK-ID-YYYYMMDD-HHMM`), `createdAt`, `updatedAt`, `roundCount: 1`.

Điền đầy đủ:
- Section 1-3: Context, mục tiêu, phạm vi
- Section 4-5: Actors + Business Rules (BR phải có ID để tham chiếu)
- Section 6-7: Happy path + alternative flows
- Section 8: Acceptance Criteria — mỗi AC phải testable (Given/When/Then nếu cần)
- Section 9: NFR nếu có performance/security requirements
- Section 10: User Stories — chỉ điền skeleton (ID + tên + priority); chi tiết AC sẽ do `/ba-user-story` mở rộng
- Section 11: Câu hỏi mở còn lại (không tự answer nếu không chắc)
- Section 12: Harness Delta — đánh dấu "Không có friction" hoặc log entry cụ thể
- Section 13: Q&A History — ghi entry "Round 1" với toàn bộ câu hỏi/đáp ở Bước 2, kèm `Impact` chỉ rõ section/BR/AC nào bị ảnh hưởng bởi mỗi answer

### Bước 4 — Gate cuối: Review và confirm

```
## Spec đã soạn xong.

Trước khi finalize, tôi muốn hỏi:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Có business rule nào tôi bỏ sót không? | A: Không, đủ rồi / B: Có — thêm: ___ / C: Khác: ___ |
| 2 | AC-XXX có đủ cụ thể để QA test được không? | A: Đủ rồi / B: Cần chi tiết hơn — AC nào: ___ / C: Khác: ___ |
| 3 | Có Open Question cần resolve trước khi đưa Dev không? | A: Không / B: Có — câu hỏi: ___ / C: Khác: ___ |

Nếu ok, tôi sẽ lưu file và bạn có thể dùng /ba-user-story để tạo User Stories từ spec này.
```

---

## Lưu ý quan trọng

- **Không bao giờ** tự động tạo spec mà không qua Gate làm rõ.
- Luôn highlight những gì **không chắc chắn** bằng `[?]` trong draft.
- Nếu input quá mơ hồ, hỏi thêm thay vì giả định.

### Resume + Q&A History (append-only)

Khi mở lại `requirements.md` đã tồn tại để clarify thêm:

1. **Đọc frontmatter** — coi `sessionId`, `roundCount` hiện tại để biết đã chạy bao nhiêu vòng.
2. **Đọc Section 13 (Q&A History)** trước khi hỏi câu mới — coi câu hỏi/đáp cũ là **ground truth**, không hỏi lại điều đã được answer.
3. **Sau mỗi vòng clarify mới**:
   - Append một block `### Round N — [timestamp JST]` vào CUỐI Section 13 (KHÔNG overwrite round cũ)
   - Cập nhật `updatedAt` và tăng `roundCount` trong frontmatter
   - Update các section liên quan của spec (BR/AC/scope) dựa trên answer mới
4. **Mục đích**: BE/khách JP có thể tra `Q&A History` để hiểu **lý do** spec được viết như vậy ("なぜこの設計?"), thay vì chỉ thấy kết quả cuối.

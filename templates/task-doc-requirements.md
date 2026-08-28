---
sessionId: [TASK-ID-YYYYMMDD-HHMM]
createdAt: [YYYY-MM-DD HH:mm JST]
updatedAt: [YYYY-MM-DD HH:mm JST]
commitSha: [short-sha]
roundCount: 0
lang: vi
---

# [Tên Feature/Task]

**Task ID**: [PROJECT-XXX]  
**Ngày tạo**: [YYYY-MM-DD]  
**BA**: [Name]  
**Trạng thái**: Draft / Review / Approved  
**Lane**: tiny | normal | high-risk — _(xem `docs/risk-classifier.md`)_  
**Depends on**: [Danh sách TASK-ID cách nhau bằng dấu phẩy, vd: TASK-003, TASK-007 — hoặc `None` nếu không phụ thuộc task nào]

---

## 1. Bối cảnh & Vấn đề

[Mô tả vấn đề kinh doanh cần giải quyết. Tại sao cần làm?]

## 2. Mục tiêu

- [Mục tiêu 1]
- [Mục tiêu 2]

## 2b. Ràng buộc thiết kế & triển khai

_IEEE 29148 §5.2.5 — Liệt kê các ràng buộc bắt buộc phải tuân theo khi thiết kế và triển khai giải pháp. Phân biệt với NFR (Section 9): NFR mô tả "tốt đến mức nào", ràng buộc mô tả "bắt buộc phải/không được làm gì"._

| Loại | Ràng buộc | Lý do |
|------|-----------|-------|
| Kỹ thuật | [Ví dụ: Phải dùng PostgreSQL — không được đổi DB engine] | [Hạ tầng hiện tại, chi phí migration] |
| Kinh doanh | [Ví dụ: Phải hoàn thành trước ngày XX/XX — hard deadline] | [Cam kết hợp đồng với khách] |
| Pháp lý / Tuân thủ | [Ví dụ: Dữ liệu cá nhân không được lưu ngoài lãnh thổ Nhật Bản] | [APPI compliance] |
| Giao diện | [Ví dụ: API phải tương thích ngược với v2.x] | [Client hiện tại chưa thể nâng cấp] |
| Nhân lực | [Ví dụ: Chỉ có 1 dev backend trong sprint này] | [Resource constraint] |

## 3. Phạm vi

### Trong phạm vi (In scope)
- [...]

### Ngoài phạm vi (Out of scope)
- [...]

## 4. Actors & Use Cases

| Actor | Use Case | Mô tả |
|-------|----------|-------|
| | | |

## 5. Business Rules

| ID | Rule | Ghi chú |
|----|------|---------|
| BR-001 | | |

## 6. Luồng nghiệp vụ chính (Happy Path)

1. [Bước 1]
2. [Bước 2]

## 7. Luồng thay thế & Exception

| Trường hợp | Xử lý |
|-----------|-------|
| | |

## 8. Acceptance Criteria

- [ ] AC-001: [Điều kiện nghiệm thu]
- [ ] AC-002: [Điều kiện nghiệm thu]

## 9. Non-functional Requirements

_Mỗi NFR phải có tiêu chí đo được (measurable). "Nhanh" không phải tiêu chí — "p95 < 300ms" mới là tiêu chí._

| NFR-ID | Loại | Tiêu chí | Độ ưu tiên |
|--------|------|----------|------------|
| NFR-001 | Performance | [Ví dụ: API response p95 < 300ms tại 100 concurrent users] | Must Have |
| NFR-002 | Security | [Ví dụ: Mọi endpoint xác thực qua JWT; token hết hạn sau 1 giờ] | Must Have |
| NFR-003 | Availability | [Ví dụ: Uptime >= 99.5% / tháng; RTO < 30 phút] | Must Have |
| NFR-004 | Scalability | [Ví dụ: Hệ thống xử lý được 5x traffic hiện tại mà không cần thay đổi kiến trúc] | Should Have |
| NFR-005 | Maintainability | [Ví dụ: Code coverage >= 80%; cyclomatic complexity <= 10 per function] | Should Have |
| NFR-006 | Compatibility | [Ví dụ: Hỗ trợ Chrome >= 90, Safari >= 14, Firefox >= 88] | Could Have |

_Độ ưu tiên: Must Have / Should Have / Could Have / Won't Have (MoSCoW)_

## 10. User Stories

| ID | Tên | Priority | Estimate |
|----|-----|----------|----------|
| US-001 | | | |

## 11. Câu hỏi mở (Open Questions)

| ID | Câu hỏi | Người trả lời | Deadline | Status |
|----|---------|---------------|----------|--------|
| Q-001 | | | | Open |

## 12. Harness Delta

_Ghi lại mọi cập nhật vào framework gây ra bởi task này — template thiếu field, gate không rõ, friction lặp lại._

- [ ] Không có friction phát hiện trong task này
- [ ] [Mô tả friction nếu có → thêm vào `docs/improvement-backlog.md`]

## 13. Q&A History

_Append-only — mỗi vòng clarify thêm entry mới ở cuối, KHÔNG overwrite. Giữ context để BE/khách JP audit được lý do quyết định ("なぜこの設計?")._

### Round 1 — [YYYY-MM-DD HH:mm JST]

**Q1**: [Câu hỏi]  
**Options**: A: [...] / B: [...] / C: [...]  
**Suggested**: [A/B/C]  
**Answer**: [Lựa chọn của user]  
**Impact**: [Section nào của spec được cập nhật do answer này — vd: BR-002, AC-003]

**Q2**: ...

<!-- Round 2 sẽ được append xuống dưới khi có vòng clarify tiếp theo -->

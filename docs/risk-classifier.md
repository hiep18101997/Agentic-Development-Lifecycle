# Risk Classifier

Cổng phân loại risk tập trung. Chạy trước khi bắt đầu bất kỳ task nào trong `/dev-analyze` và `/dev-implement`.

---

## Input Types

Xác định loại input trước khi classify risk:

| Loại | Mô tả | Ví dụ |
|------|-------|-------|
| **new-spec** | Spec mới chưa có story nào | Requirement JP mới từ khách |
| **spec-slice** | Một phần của spec lớn đã có | Story con của Epic đang làm |
| **change-request** | Thay đổi behavior đã tồn tại | Khách yêu cầu đổi logic validation |
| **maintenance** | Fix bug, cập nhật dependency | Bug report từ QA hoặc production |
| **new-initiative** | Cải tiến kỹ thuật chủ động | Refactor, performance improvement |
| **framework-improvement** | Cải tiến chính framework này | Thêm skill mới, cập nhật template |

---

## Risk Checklist (10 items)

Đánh dấu mỗi item áp dụng cho task:

| # | Câu hỏi | Nếu YES → tăng risk |
|---|---------|---------------------|
| R-01 | Task thay đổi authentication hoặc authorization? | +high |
| R-02 | Task thay đổi data model ảnh hưởng existing records? | +high |
| R-03 | Task tích hợp external provider mới (API, payment, OAuth)? | +high |
| R-04 | Task làm yếu validation hoặc remove safety check? | +high |
| R-05 | Task thay đổi public API (breaking change)? | +high |
| R-06 | Task ảnh hưởng shared infrastructure (config, CORS, env)? | +normal |
| R-07 | Task lưu trữ dữ liệu nhạy cảm mới (PII, payment, health)? | +high |
| R-08 | Task thay đổi hành vi của nhiều màn hình / nhiều user role? | +normal |
| R-09 | Task không có test coverage hiện tại cho area bị ảnh hưởng? | +normal |
| R-10 | Task có cross-domain impact (ảnh hưởng module khác team sở hữu)? | +normal |

---

## Lane Assignment

### Tiny Lane
**Điều kiện**: Không có item nào YES trong checklist, thay đổi nhỏ và self-contained.

**Quy trình**:
- Patch trực tiếp, không cần story doc
- Không cần analysis.md
- Verification tối thiểu: tự test happy path

**Ví dụ**: Sửa typo, đổi màu button, cập nhật copy text, fix lỗi validation message.

### Normal Lane
**Điều kiện**: Có 1+ item R-06/R-08/R-09/R-10 YES, nhưng không có R-01 đến R-05.

**Quy trình**:
- Tạo `docs/tasks/[TASK-ID]/analysis.md`
- Chạy đủ `/dev-analyze` → `/dev-implement` → `/dev-pr`
- Verification: tạo `verification.md` với self-test steps

**Ví dụ**: Thêm field mới vào form, thêm API endpoint mới, refactor một module.

### High-Risk Lane
**Điều kiện**: Có bất kỳ item R-01 đến R-05 YES, HOẶC là một trong Hard Triggers bên dưới.

**Quy trình**:
- **Dừng ngay** — không implement trước khi có confirm từ senior/tech lead
- Tạo analysis.md với risk section rõ ràng
- Cần `/sec-review` trước khi tạo PR
- Cần `/arch-review` nếu thay đổi design lớn
- Bridge Engineer review trước khi gửi khách (nếu deliverable JP)

---

## Hard High-Risk Triggers

Các thay đổi sau **tự động là high-risk** — không cần chạy checklist:

- Thay đổi authentication / authorization logic
- Thay đổi data model có thể mất data (drop column, change type)
- Tích hợp external payment provider
- Thay đổi cryptographic implementation
- Thêm lưu trữ PII/health data mới
- Xóa hoặc bypass validation/safety check hiện có

Khi gặp Hard Trigger → hiện `⚠️ Ask First Gate` theo format trong `assets/ask-first-gates.md`.

---

## Cách dùng trong skill

```
## Risk Classification — [TASK-ID]

**Input type**: [new-spec / spec-slice / change-request / maintenance / ...]
**Risk checklist**: R-01 ✅ R-02 ❌ R-03 ❌ ... (chỉ liệt kê những item YES)
**Lane**: tiny | normal | high-risk
**Lý do**: [1 câu giải thích]
```

Dán block này vào đầu mỗi analysis.md và vào gate đầu tiên của `/dev-implement`.

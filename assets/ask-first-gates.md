# Ask First Gates — Danh sách thay đổi nhạy cảm

Những thay đổi sau **bắt buộc phải dừng lại và hỏi senior/tech lead** trước khi thực hiện.  
File này là nguồn sự thật duy nhất — tham chiếu từ `/dev-implement`, `/dev-pr`, `/dev-debug`, `/sec-review`.

---

## Danh sách

| # | Loại thay đổi | Lý do nhạy cảm |
|---|---------------|----------------|
| 1 | Thay đổi authentication / authorization logic | Lỗi = toàn bộ hệ thống mất bảo mật |
| 2 | Thêm hoặc sửa permission / role checks | Miss một role = privilege escalation |
| 3 | Breaking changes trong public API | Phá vỡ client đang dùng; cần versioning plan |
| 4 | Database migration có thể mất data | Không reversible nếu không có backup plan |
| 5 | Database schema thay đổi ảnh hưởng access control | Có thể expose data sai user |
| 6 | Thay đổi shared infrastructure hoặc config | Ảnh hưởng tất cả service đang chạy |
| 7 | Lưu trữ sensitive data mới (PII, payment, health) | Compliance: APPI, PCI-DSS, GDPR |
| 8 | Thay đổi CORS configuration | Sai = CSRF hoặc block frontend production |
| 9 | Thay đổi cryptographic implementation | Custom crypto = almost always wrong |
| 10 | Thêm new external API integration | Mở surface attack mới, cần security review |

---

## Cách dùng trong skill

Khi skill phát hiện thay đổi thuộc danh sách trên, **dừng ngay** và hiện:

```
⚠️ Ask First Gate

Thay đổi này thuộc loại nhạy cảm: [loại — xem assets/ask-first-gates.md]

Trước khi tiếp tục, cần confirm với senior/tech lead:
1. [Câu hỏi cụ thể về thay đổi này]
2. [Risk cần acknowledge]

Chờ confirm trước khi proceed.
```

---

## Cập nhật danh sách

Khi team xác định loại thay đổi nhạy cảm mới (ví dụ: compliance mới, incident từ loại lỗi mới) → thêm vào bảng này.  
Tất cả skill tự động nhận update vì đều reference file này.

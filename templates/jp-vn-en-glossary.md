# JP ↔ VN ↔ EN Glossary

Bộ từ vựng chuẩn cho dự án outsource VN → JP.  
Cập nhật tại đây, reference từ `/be-bridge` và các skill có output JP.

---

## Quy tắc dùng

- Thuật ngữ JP kỹ thuật (ログイン, トークン...) → giữ nguyên hoặc dùng từ trong bảng này
- Spec VN phải đủ để dev VN làm không cần đọc JP gốc
- Tài liệu JP phải đủ để khách JP confirm không cần đọc spec VN

---

## Bảng thuật ngữ

### Giai đoạn dự án & Tài liệu

| JP | VN | EN |
|----|----|----|
| 基本設計 | Thiết kế cơ bản | Basic Design |
| 詳細設計 | Thiết kế chi tiết | Detail Design |
| 外部設計 | Thiết kế ngoài | External Design |
| 内部設計 | Thiết kế trong | Internal Design |
| 設計書 | Tài liệu thiết kế | Design Document |
| 手順書 | Tài liệu hướng dẫn | Procedure Manual |
| API仕様書 | Tài liệu đặc tả API | API Specification |
| ER図 | Sơ đồ ER | ER Diagram |
| シーケンス図 | Sơ đồ tuần tự | Sequence Diagram |
| フロー図 | Sơ đồ luồng | Flow Diagram |
| 成果物 | Deliverable | Deliverable |
| 納品物 | Sản phẩm bàn giao | Deliverable |
| 設計レビュー | Review thiết kế | Design Review |
| 変更依頼 | Yêu cầu thay đổi | Change Request |
| 障害報告書 | Báo cáo sự cố | Incident Report |
| 進捗報告 | Báo cáo tiến độ | Progress Report |

### Testing

| JP | VN | EN |
|----|----|----|
| 単体テスト | Unit test | Unit Test |
| 結合テスト | Integration test | Integration Test |
| システムテスト | System test | System Test |
| 受け入れテスト | Acceptance test | UAT |
| 単体テスト仕様書 | Tài liệu đặc tả unit test | Unit Test Specification |
| テスト項目 | Mục kiểm tra | Test Item |
| テスト結果 | Kết quả kiểm tra | Test Result |
| 確認観点 | Quan điểm kiểm tra | Check Point |
| テストデータ | Dữ liệu test | Test Data |
| バグ | Lỗi | Bug |
| 不具合 | Lỗi/Defect | Defect |
| 修正対応 | Sửa lỗi | Bug Fix |

### Trạng thái & Hành động

| JP | VN | EN |
|----|----|----|
| 仕様変更 | Thay đổi spec | Change Request |
| バグ修正 | Sửa bug | Bug Fix |
| 要確認 | Cần confirm | To be confirmed |
| 対象外 | Không áp dụng | N/A |
| 担当者 | Người phụ trách | Assignee |
| 確定 | Đã xác nhận / Chốt | Confirmed / Finalized |
| レビュー中 | Đang review | Under Review |
| 保留 | Tạm hoãn | On Hold |
| 完了 | Hoàn thành | Done / Completed |
| 対応中 | Đang xử lý | In Progress |

### Màn hình & UI

| JP | VN | EN |
|----|----|----|
| 画面 | Màn hình | Screen |
| 項目 | Trường/Field | Field |
| 必須 | Bắt buộc | Required |
| 任意 | Tùy chọn | Optional |
| 入力チェック | Kiểm tra đầu vào | Input Validation |
| バリデーション | Validation | Validation |
| エラーメッセージ | Thông báo lỗi | Error Message |
| 画面遷移 | Chuyển màn hình | Screen Transition |

### Database & Backend

| JP | VN | EN |
|----|----|----|
| テーブル定義 | Định nghĩa bảng | Table Definition |
| マスタ | Dữ liệu master | Master Data |
| トランザクション | Transaction | Transaction |
| ロールバック | Rollback | Rollback |
| コミット | Commit | Commit |
| 排他制御 | Kiểm soát độc quyền | Exclusive Control / Mutex |
| ストアドプロシージャ | Stored procedure | Stored Procedure |
| バッチ処理 | Xử lý batch | Batch Processing |
| ログ | Log | Log |

### Yêu cầu & Chất lượng

| JP | VN | EN |
|----|----|----|
| 非機能要件 | Yêu cầu phi chức năng | Non-functional Requirements |
| 機能要件 | Yêu cầu chức năng | Functional Requirements |
| 品質 | Chất lượng | Quality |
| 性能 | Hiệu năng | Performance |
| セキュリティ | Bảo mật | Security |
| 可用性 | Tính khả dụng | Availability |
| 保守性 | Tính bảo trì | Maintainability |
| 工数 | Nhân công / Man-days | Man-hours |
| 納期 | Deadline / Ngày bàn giao | Delivery Date |
| 移行 | Di chuyển / Migration | Migration |

### Auth & Access

| JP | VN | EN |
|----|----|----|
| 権限 | Quyền hạn | Permission / Authority |
| ユーザー管理 | Quản lý người dùng | User Management |
| セッション | Session | Session |
| インターフェース | Interface | Interface |

---

## Cập nhật glossary

Khi gặp thuật ngữ mới trong dự án → thêm vào bảng phù hợp ở đây.  
Không thêm inline vào skill files — luôn thêm tại đây.

---
name: be-bridge
description: >
  Hỗ trợ Bridge Engineer dịch yêu cầu khách hàng Nhật, tạo tài liệu song ngữ JP-VN,
  chuẩn bị deliverables theo chuẩn Nhật (設計書, 単体テスト仕様書, 成果物).
  Trigger khi: user nói "dịch yêu cầu JP", "tạo 設計書", "soạn tài liệu cho khách Nhật",
  "bridge engineer", "JP requirement", "translate JP spec", hoặc gõ /be-bridge.
---

# Skill: /be-bridge
**Role**: Bridge Engineer (Cầu nối JP ↔ VN)  
**Mục đích**: Hỗ trợ Bridge Engineer dịch yêu cầu khách hàng Nhật, tạo tài liệu song ngữ, chuẩn bị deliverables theo chuẩn Nhật.

---

## Context

Bridge Engineer là cầu nối giữa khách hàng Nhật và team dev VN:
- **Input**: Yêu cầu từ JP (tiếng Nhật hoặc Anh) — email, meeting notes, 仕様書 gốc
- **Output**: Spec cho dev VN (tiếng Việt) + Deliverables cho JP (tiếng Nhật)
- **Standard**: Tài liệu theo chuẩn SI Nhật — 設計書, 単体テスト仕様書, 成果物

---

## Hướng dẫn thực hiện

### Bước 0 — Load glossary (bắt buộc)

Trước khi phân tích/dịch bất kỳ thuật ngữ nào, đọc `templates/jp-vn-en-glossary.md` để load bộ từ vựng JP↔VN↔EN chuẩn.

Trong toàn bộ skill (Bước 1→4), khi gặp thuật ngữ kỹ thuật/nghiệp vụ JP:
- Ưu tiên dùng từ tương ứng trong glossary
- Nếu thuật ngữ KHÔNG có trong glossary → đánh dấu `[GLOSSARY?]` và đề xuất bổ sung ở Bước 4

### Bước 1 — Gate: Xác định loại công việc

```
## Tôi nhận yêu cầu từ khách hàng JP.

Loại tài liệu cần tạo:
- [ ] 基本設計書 (Basic Design) — spec cấp cao, confirm với JP trước khi dev
- [ ] 詳細設計書 (Detail Design) — spec chi tiết cho dev VN
- [ ] 単体テスト仕様書 (UT Spec) — test cases format chuẩn JP
- [ ] 変更依頼 (Change Request) — yêu cầu thay đổi + impact analysis → **dùng `/be-changerequest` thay thế** để có approval trail đầy đủ
- [ ] 障害報告書 (Incident Report) — báo cáo bug/incident

Input language: JP / EN / VN
Output cần: Song ngữ JP+VN / JP only / VN only

Confirm để tôi tiếp tục?
```

**Chờ confirm.**

### Bước 2 — Phân tích và làm rõ yêu cầu

Đọc yêu cầu và identify:

```
## Phân tích yêu cầu từ JP

**Tóm tắt** (VI): [...]
**要約** (JP): [...]

**Điểm chưa rõ cần confirm với khách hàng JP**:

| # | Câu hỏi (VI) | 質問 (JP) |
|---|--------------|-----------|
| 1 | [...] | [...] |
| 2 | [...] | [...] |

**Assumptions tôi tự hiểu** (cần confirm trước khi doc):
- [...]

| | Lựa chọn |
|---|---------|
| A | Có — gửi câu hỏi cho JP trước |
| B | Không — tiếp tục với assumptions đã nêu |
| C | Khác: ___ |
```

**Chờ confirm.**

### Bước 3 — Tạo deliverables

#### 3a. Spec cho dev VN

Tạo `docs/tasks/[TASK-ID]/requirements.md` theo template chuẩn (xem `templates/task-doc-requirements.md`).
Ngôn ngữ: Tiếng Việt.

#### 3b. 設計書 cho khách hàng JP

Tạo `docs/tasks/[TASK-ID]/design-jp.md`:

```markdown
# 詳細設計書: [機能名]

**プロジェクト**: [Project name]  
**作成日**: [YYYY-MM-DD]  
**バージョン**: 1.0  
**作成者**: [Bridge Engineer name]  
**ステータス**: Draft / レビュー中 / 確定

---

## 1. 概要

[機能の概要を記述。背景と目的を含める。]

## 2. 対象画面

| 画面名 | URL/Route | 説明 |
|--------|-----------|------|
| | | |

## 3. 画面仕様

### 3.1 [画面名]

**項目定義**:

| 項目名 | 型 | 必須 | バリデーション | 備考 |
|--------|-----|------|----------------|------|
| | | | | |

**画面遷移**:
[遷移フローを記述]

## 4. API仕様

| エンドポイント | メソッド | リクエスト | レスポンス | 認証 |
|----------------|----------|-----------|-----------|------|
| | | | | |

## 5. エラー処理

| エラーコード | 発生条件 | メッセージ | 対応方法 |
|--------------|----------|-----------|---------|
| | | | |

## 6. 非機能要件

- **パフォーマンス**: [要件があれば]
- **セキュリティ**: [要件があれば]
- **互換性**: [要件があれば]

## 7. 変更履歴

| バージョン | 日付 | 変更内容 | 担当者 |
|------------|------|---------|--------|
| 1.0 | [Date] | 初版作成 | [Name] |
```

#### 3c. 単体テスト仕様書 (nếu cần)

Tạo `docs/tasks/[TASK-ID]/ut-spec-jp.md`:

```markdown
# 単体テスト仕様書: [機能名]

**作成日**: [YYYY-MM-DD]  
**対象**: [TASK-ID] [機能名]

## テストケース一覧

| No. | テスト項目 | 入力値 | 期待結果 | 担当者 | 結果 | 備考 |
|-----|-----------|--------|---------|--------|------|------|
| 1 | | | | | | |
| 2 | | | | | | |

## 結果凡例

- ○ : テスト合格
- × : テスト不合格 → バグ報告書作成
- — : 対象外
```

#### 3d. Deliverable HTML song ngữ (cho khách JP)

Sinh `docs/tasks/[TASK-ID]/deliverable.html` từ template `templates/html-bilingual.html` — đây là format chính khi forward cho khách Nhật:

- Header: title JP/VN, TASK-ID, timestamp JST, label "成果物"
- Mỗi item nội dung tạo 1 `<div class="row">` 2 cột (JP trái, VN phải) với nội dung tương ứng
- Thuật ngữ kỹ thuật JP có trong glossary → wrap bằng `<span class="glossary" data-tooltip="JP=VN">` để khách hover thấy bản dịch
- Copy button per row (`data-copy-parent`) để khách copy đoạn JP/VN bất kỳ
- `@media print`: in A4 đẹp, 2 cột giữ nguyên, copy button ẩn — khách có thể Cmd+P → Save as PDF làm bản chính thức

File HTML KHÔNG commit (đã có `.gitignore` cho `docs/tasks/**/*.html`). Nếu cần lưu version chính thức gửi khách → export PDF rồi attach vào email/issue.

```
✓ Đã sinh:
  - docs/tasks/[TASK-ID]/requirements.md   (cho dev VN, commit)
  - docs/tasks/[TASK-ID]/design-jp.md       (gửi khách JP qua email, commit)
  - docs/tasks/[TASK-ID]/deliverable.html   (mở review nội bộ trước khi gửi khách, KHÔNG commit)
```

### Bước 4 — Gate cuối

```
## Tài liệu đã soạn xong.

Checklist song ngữ:
- [ ] Thuật ngữ JP ↔ VN nhất quán trong toàn bộ tài liệu
- [ ] Tất cả thuật ngữ đã match với `templates/jp-vn-en-glossary.md` — không còn `[GLOSSARY?]` nào chưa resolve
- [ ] Thuật ngữ mới (không có trong glossary) đã liệt kê để bổ sung vào glossary
- [ ] Business logic trong spec VN = 設計書 JP (không thừa/thiếu)
- [ ] Câu hỏi mở đã resolve hoặc đánh dấu [要確認]
- [ ] Format tài liệu JP đúng chuẩn (bảng, thứ tự mục)

Files:
- Gửi JP: `docs/tasks/[TASK-ID]/design-jp.md`
- Cho dev VN: `docs/tasks/[TASK-ID]/requirements.md`

Confirm để finalize?
```

---

## Bộ từ vựng chuẩn JP ↔ VN ↔ EN

> Danh sách đầy đủ (70+ terms): `templates/jp-vn-en-glossary.md`

Một số terms hay dùng nhất:

| JP | VN | EN |
|----|----|----|
| 基本設計 | Thiết kế cơ bản | Basic Design |
| 詳細設計 | Thiết kế chi tiết | Detail Design |
| 単体テスト仕様書 | Tài liệu đặc tả unit test | Unit Test Specification |
| 不具合 | Lỗi/Defect | Defect |
| 要確認 | Cần confirm | To be confirmed |
| 対象外 | Không áp dụng | N/A |
| 成果物 | Deliverable | Deliverable |
| 担当者 | Người phụ trách | Assignee |
| 納期 | Deadline | Delivery Date |
| 工数 | Nhân công | Man-hours |

---

## Quy tắc

- Không tự assume khi JP yêu cầu không rõ — hỏi ngay
- Thuật ngữ kỹ thuật JP (ログイン, トークン...) → giữ nguyên hoặc dùng từ tiêu chuẩn trong bộ từ vựng
- Spec VN phải đủ để dev VN làm việc mà không cần đọc tài liệu JP gốc
- Tài liệu JP phải đủ để khách hàng JP confirm mà không cần đọc spec VN

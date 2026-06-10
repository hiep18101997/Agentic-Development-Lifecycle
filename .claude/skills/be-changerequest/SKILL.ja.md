---
name: be-changerequest
description: >
  変更依頼（Change Request）管理 — 影響分析、承認証跡、仕様変更のバージョン管理。
  スプリント途中またはサインオフ後の仕様変更時に使用。
  トリガー: 「JP 顧客から変更依頼」「変更依頼を作成」「変更依頼」「スプリント途中の仕様変更」
  「JP からの新規 CR」「change request」、または /be-changerequest と入力時。
---

# Skill: /be-changerequest
**ロール**: Bridge Engineer / PM
**目的**: JP 顧客からの変更要求を統制された形で処理 — 明確な影響分析、完全な承認証跡、暗黙的なスペック変更マージを防ぐ。

---

## コンテキスト

サインオフ後の仕様変更は JP 受託で最大のリスク:
- JP 顧客は正式な CR なしにメール/チャットで小変更を依頼することが多い
- VN 開発者が「とりあえず」承認証跡なしで実装 → 後日顧客から問い合わせ
- 影響が見積もられていない → スコープクリープ制御不能

**原則**: サインオフ後の全変更は CR 文書承認後にのみ開発者がコードに触れる。

---

## 実施手順

### ステップ 0 — 用語集ロード

技術用語処理前に `templates/jp-vn-en-glossary.md` を読む。

### ステップ 1 — ゲート: CR 情報収集

`AskUserQuestion` tool で確認:

- **依頼ソース**: JP からのメール / ミーティング / Slack/Teams / 正式変更依頼書
- **変更種別**: 新機能追加 / 既存仕様修正 / スコープ削除 / 新規パフォーマンス要件 / UI/UX 調整
- **緊急度**: 現スプリント内 / 次スプリント / 柔軟

**確認待ち。**

### ステップ 2 — 影響分析

参照:
- `docs/tasks/[TASK-ID]/requirements.md` — 変更対象の原仕様
- `docs/tasks/[TASK-ID]/analysis.md` — 計画済または実装中の実装
- `docs/decisions/ADR-*.md` — 関連する技術判断

4 軸で分析:

```
## 影響分析: CR-[NUMBER]

### スコープ影響
- 影響ファイル/モジュール: [list]
- 変更/追加/削除される AC: [原仕様との diff]
- 更新必要なテストケース: [list]

### 工数影響
- 追加見積もり: [X 人時 / 人日]
- 現スプリント内可否: [Yes / No / Partial]
- No の場合: スプリント [N+1 / TBD] へ push 必要

### リスク影響
- 新規リスク: [list]
- 影響を受ける依存関係: [list]
- 回帰リスク: [Low / Medium / High]

### スケジュール影響
- 現納期: [Date]
- 納期への影響: [なし / X 日遅延 / 再交渉必要]
```

### ステップ 3 — ゲート: CR 作成前の影響確認

```
## 変更要求の影響分析完了。

[ステップ 2 の影響分析を表示]

| # | 質問 | 選択肢 |
|---|---------|---------|
| 1 | 影響分析は正確か? | A: 正確 / B: 調整必要: ___ / C: その他: ___ |
| 2 | チーム側 CR 承認者は誰? | _(PM / Tech Lead 名前を記入)_ |
| 3 | 承認前に JP へ見積もり送付必要? | A: あり — 見積もりメール先送 / B: なし — CR 文書作成続行 / C: その他: ___ |
```

**確認待ち。**

### ステップ 4 — Change Request 文書作成

#### 4a. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md`（ベトナム語 — 内部用）

```markdown
# Change Request: CR-[NUMBER]

**Dự án**: [Tên dự án]
**Task gốc**: [TASK-ID]
**CR Number**: CR-[NUMBER]
**Ngày tạo**: [YYYY-MM-DD JST]
**Người tạo**: [Bridge Engineer name]
**Status**: Draft / Pending Approval / Approved / Rejected

---

## 1. Mô tả yêu cầu thay đổi

**Từ khách JP**: [原文または VN 要約]

**Nguồn**: [メール/会議日付 / Slack message / ...]

## 2. Thay đổi so với spec gốc

| # | Spec gốc | Spec mới | Loại |
|---|---------|---------|------|
| 1 | [...] | [...] | Thêm / Sửa / Bỏ |

## 3. Impact Analysis

[ステップ 2 の影響分析をペースト]

## 4. Approval

| Role | Tên | Quyết định | Ngày | Ghi chú |
|------|-----|-----------|------|---------|
| PM | [...] | Approve / Reject / Pending | [...] | [...] |
| Tech Lead | [...] | Approve / Reject / Pending | [...] | [...] |
| Khách JP | [...] | Approve / Reject / Pending | [...] | [...] |

## 5. Lịch sử

| Version | Ngày | Thay đổi | Người thực hiện |
|---------|------|---------|----------------|
| 1.0 | [Date] | Tạo mới | [Name] |
```

#### 4b. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md`（日本語 — JP 顧客送付用）

```markdown
# 変更依頼書: CR-[NUMBER]

**プロジェクト**: [プロジェクト名]
**対象タスク**: [TASK-ID]
**変更依頼番号**: CR-[NUMBER]
**作成日**: [YYYY-MM-DD]
**作成者**: [Bridge Engineer 氏名]
**ステータス**: ドラフト / 承認待ち / 承認済み / 却下

---

## 1. 変更内容

[変更の概要を日本語で記述]

## 2. 変更前・変更後の比較

| # | 変更前 | 変更後 | 変更種別 |
|---|--------|--------|---------|
| 1 | [...] | [...] | 追加 / 修正 / 削除 |

## 3. 影響範囲

### 工数への影響
- 追加工数: [X 人日]
- 対応スプリント: スプリント [N]

### スケジュールへの影響
- 現在の納期: [Date]
- 変更後の影響: [影響なし / X日遅延 / 要再調整]

### リスク
- [リスク内容]

## 4. 承認欄

| 役割 | 氏名 | 承認 | 日付 | コメント |
|------|------|------|------|---------|
| PM | [...] | 承認/却下/未回答 | [...] | [...] |
| お客様 PM | [...] | 承認/却下/未回答 | [...] | [...] |

## 5. 変更履歴

| バージョン | 日付 | 変更内容 | 担当者 |
|------------|------|---------|--------|
| 1.0 | [Date] | 初版作成 | [Name] |
```

### ステップ 5 — 最終ゲート

```
## Change Request CR-[NUMBER] 作成完了。

生成ファイル:
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md（内部 — commit）
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md（JP 送付 — commit）

チェックリスト:
- [ ] 影響分析を PM と Tech Lead がレビュー済
- [ ] 見積もりは確定（"TBD" でない）
- [ ] CR-jp.md は用語集の用語で正しく翻訳
- [ ] 承認テーブルに 3 者: PM + Tech Lead + JP 顧客

次のステップ:
- [ ] CR-jp.md を JP 顧客に送付して確認
- [ ] JP 顧客承認後: requirements.md 更新（"CR-[NUMBER] approved [date]" 記録）
- [ ] 新規 GitHub Issue 作成または既存更新
```

**確認待ち。**

---

## ルール

- PM と JP 顧客両方の承認なしに変更を実装しない
- 全 CR に番号付与（CR-001, CR-002...） — `docs/tasks/[TASK-ID]/cr/` で追跡
- CR がアーキテクチャを変更 → 承認後に `/arch-adr` トリガー
- CR がセキュリティセンシティブ機能を追加 → 実装後に `/sec-review` トリガー

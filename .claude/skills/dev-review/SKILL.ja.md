---
name: dev-review
description: >
  実装後の総合コードレビュー: コード品質 + アーキテクチャ + パフォーマンス + セキュリティを 1 回で。/arch-review + /sec-review の個別実行を置換。
  トリガー: 「コードレビュー」「マージ前レビュー」「コード問題ないか」「実装をレビュー」「コードチェック」、または /dev-review と入力時。
---

# Skill: /dev-review
**ロール**: Developer / Tech Lead
**目的**: 実装後の総合 4-レンズレビュー（コード品質 + アーキテクチャ + パフォーマンス + セキュリティ）— /arch-review + /sec-review の個別実行を置換。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `review.en.md`
- ベトナム語版（正本）: `review.md`

**サブエージェント生成**: `Agent({ description, prompt, model })`。ゲートツール: `AskUserQuestion`。

---

## JP 特有の考慮事項

- **JST タイムゾーン**: スケジュール、デッドライン、リリースには JST (UTC+9) を使用
- **用語**: 業務 / 技術用語は `templates/jp-vn-en-glossary.md` から使用 — 不整合があれば `/be-glossary` で追加
- **成果物フォーマット**: JP 顧客送付物は `templates/html-bilingual.html` または日本標準テンプレート使用
- **リスク分類**: タスク開始前に `docs/risk-classifier.ja.md` に従い分類（tiny/normal/high-risk）
- **Ask First Gates**: 機微変更（認証、データ損失、決済など）は `assets/ask-first-gates.ja.md` を参照 → 続行前にシニア確認

---

## 出力

レビューレポート → Approve / Request Changes

### レビューログ (verdict を問わず毎回作成)

`docs/tasks/[TASK-ID]/review-log-R[N].md` を `templates/review-log.ja.md` を使って **verdict に関わらず毎回作成**（Approve / Approve with minor fixes / Request Changes のいずれでも）。`/dev-pr` が最新ラウンドのこのファイルで review 済みかを判定するため、Request Changes 時のみ作成すると「未 review」と「approve 済み」を区別できない:
- Meta に task_id / round / verdict（`approve` | `approve-with-fixes` | `request-changes`）/ JST タイムスタンプ を記入
- Approve / Approve with minor fixes: ブロッキング表は空のまま
- Request Changes: ブロッキング表に `B-xx` ID、ファイル:行、問題、修正案を記入 — 再レビュー時に AI が各 `B-xx` を自動検証

### 前ラウンドのレビューログ確認 (ステップ 1)

`docs/tasks/[TASK-ID]/review-log-R*.md` が存在する場合:
- 最新ラウンドの `B-xx` リストをロード
- 現在の diff で各アイテムが修正済みか検証
- 明示的に報告: `B-01 ✅ 修正済み` / `B-01 ❌ 未修正`

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

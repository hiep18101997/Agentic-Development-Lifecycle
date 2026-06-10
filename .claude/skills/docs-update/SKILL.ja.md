---
name: docs-update
description: >
  タスク検証 + マージ後にベースライン文書（画面 + API）を更新。各タスクの最終ステップ。
  トリガー: 「文書を更新」「ベースラインを更新」「タスク完了後文書更新」「マージ後文書を同期」「画面文書を更新」「API 文書を更新」、または /docs-update と入力時。
---

# Skill: /docs-update
**ロール**: All
**目的**: タスク検証 + マージ後にベースライン文書（`docs/screens/`、`docs/api/`）を更新、living docs として維持。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `update.en.md`
- ベトナム語版（正本）: `update.md`

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

更新されたベースライン文書 + メタデータ（Last updated JST、commit SHA）

**テンプレート**:
- 画面定義書: `templates/baseline-screen.ja.md`
- API定義書: `templates/baseline-api.ja.md`
- 検証記録: `templates/verification.ja.md`

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

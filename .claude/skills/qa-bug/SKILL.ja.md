---
name: qa-bug
description: >
  重要度、再現手順、開発者が修正可能な十分な証拠付きの標準バグレポートを作成。
  トリガー: 「バグを発見」「バグレポートを書く」「不具合報告」「バグチケット作成」「defect」「障害報告」、または /qa-bug と入力時。
---

# Skill: /qa-bug
**ロール**: QA
**目的**: 重要度、再現手順、証拠付きの標準バグレポート作成 — 開発者が追加情報なしで修正可能なレベル。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `bug.en.md`
- ベトナム語版（正本）: `bug.md`

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

バグレポート — テンプレート: `templates/bug-report.ja.md` を使用（GitHub Issue または `docs/tasks/[TASK]/bugs/` に保存）

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

---
name: qa-regression
description: >
  リリース前の回帰テストチェックリスト作成、ブラスト半径分析、Go/No-go 判定。
  トリガー: 「回帰テスト」「リリース前テスト」「回帰なしを検証」「スプリントサインオフ」「本番デプロイ前 QA」、または /qa-regression と入力時。
---

# Skill: /qa-regression
**ロール**: QA
**目的**: リリース前の回帰テストチェックリスト + ブラスト半径分析 + Go/No-go 判定 — JP 顧客が証跡を要求する場合に PDF エクスポート可能。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `regression.en.md`
- ベトナム語版（正本）: `regression.md`

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

regression-checklist.html (Go/No-go 判定、ステータスバッジ自動更新)

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

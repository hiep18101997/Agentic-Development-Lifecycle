---
name: ba-user-story
description: >
  仕様をユーザーストーリーと標準受け入れ基準に変換、PM が Issue 作成可能な形式に。
  トリガー: 「ユーザーストーリーを作成」「user story を書く」「仕様をストーリーに分解」「AC を作成」、または /ba-user-story と入力時。
---

# Skill: /ba-user-story
**ロール**: Business Analyst
**目的**: 仕様をユーザーストーリー形式（As a [role], I want [action], so that [benefit]）+ AC に変換、PM が Issue 作成可能。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `user-story.en.md`
- ベトナム語版（正本）: `user-story.md`

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

`docs/tasks/[TASK-ID]/requirements.md` 内 User Stories セクション — テンプレート: `templates/user-story.ja.md` を使用

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

---
name: ba-reverse
description: >
  ブラウンフィールドコードベース（旧ベンダー引き継ぎ / レガシー）をリバースエンジニアリング、ベースライン文書化。
  トリガー: 「コードベースを reverse engineer」「レガシーコードベースを分析」「旧ベンダーから引き継ぎ」「codemap 作成」「ブラウンフィールド分析」、または /ba-reverse と入力時。
---

# Skill: /ba-reverse
**ロール**: Business Analyst / Tech Lead
**目的**: ブラウンフィールドコードベースをリバースエンジニアリングし、ベースライン文書（business overview, tech stack, key APIs, technical debt）を生成。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `reverse.en.md`
- ベトナム語版（正本）: `reverse.md`

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

docs/baseline/codebase-overview.md

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

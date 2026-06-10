---
name: arch-adr
description: >
  重要なアーキテクチャ判断を文書化するため Architecture Decision Record (ADR) を作成。
  トリガー: 「ADR を作成」「アーキテクチャ判断を文書化」「ADR を書く」「設計判断を記録」、または /arch-adr と入力時。
---

# Skill: /arch-adr
**ロール**: Architect / Tech Lead
**目的**: 重要なアーキテクチャ判断を ADR として文書化、後の "なぜこの設計?" 問い合わせに備える。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `adr.en.md`
- ベトナム語版（正本）: `adr.md`

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

docs/decisions/ADR-[NNN]-[slug].md

**テンプレート**: `templates/adr.ja.md`

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

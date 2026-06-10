---
name: pm-kickoff
description: >
  新規グリーンフィールドプロジェクト立ち上げ: 技術スタック選定、フォルダ構造作成、CLAUDE.md カスタマイズ、文書構造と Sprint 0 チェックリスト初期化。
  トリガー: 「新規プロジェクト開始」「kickoff project」「グリーンフィールドプロジェクト」「プロジェクトを最初から設定」「JP 顧客向け新規プロジェクト」「新規フレームワーク初期化」、または /pm-kickoff と入力時。
---

# Skill: /pm-kickoff
**ロール**: PM / Tech Lead
**目的**: グリーンフィールドプロジェクトを最初から立ち上げ — 技術スタック決定 → ADR → 文書構造 → Sprint 0 チェックリスト。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `kickoff.en.md`
- ベトナム語版（正本）: `kickoff.md`

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

Project スキャフォルド + Sprint 0 チェックリスト

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

---
name: pm-handover
description: >
  包括的なプロジェクト引き継ぎパッケージ（引き継ぎ書）を作成: コードベースマップ、決定ログ、用語集、オープン Issue、連絡先マトリクス。開発者離任、プロジェクト譲渡、JP 受託契約終了時に使用。
  トリガー: 「プロジェクトを引き継ぐ」「引き継ぎ書を作成」「引き継ぎ」「開発者離任で引き継ぎ必要」「プロジェクト譲渡」「project handoff」、または /pm-handover と入力時。
---

# Skill: /pm-handover
**ロール**: PM / Bridge Engineer / Tech Lead
**目的**: プロジェクトの包括的引き継ぎパッケージ作成 — 後任が旧チームに問い合わせなしに引き継げる十分性。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `handover.en.md`
- ベトナム語版（正本）: `handover.md`

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

docs/handover/handover.md (VN) + 引き継ぎ書.md (JP)

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

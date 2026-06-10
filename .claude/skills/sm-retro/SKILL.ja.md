---
name: sm-retro
description: >
  スプリントレトロスペクティブのファシリテーション、テーマ別フィードバック集約、アクション可能なアクションアイテム作成。
  トリガー: 「スプリントレトロ」「retrospective」「スプリント末ミーティング」「スプリント総括」「what went well」「レトロからアクションアイテム」、または /sm-retro と入力時。
---

# Skill: /sm-retro
**ロール**: Scrum Master
**目的**: スプリントレトロスペクティブのファシリテーション、Went well / Didn't go well / Actions 構造でフィードバック集約。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `retro.en.md`
- ベトナム語版（正本）: `retro.md`

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

レトロレポート + アクションアイテム

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

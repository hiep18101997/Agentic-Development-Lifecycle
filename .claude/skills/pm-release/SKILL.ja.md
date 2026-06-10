---
name: pm-release
description: >
  マージ済み PR + クローズ済み Issue から自動でリリースノートを生成。JP 顧客またはステークホルダーへの各リリース前に使用。
  トリガー: 「リリースノートを作成」「リリースノートを書く」「スプリント changelog」「JP 顧客向けリリースノート」「リリース変更まとめ」、または /pm-release と入力時。
---

# Skill: /pm-release
**ロール**: PM / Bridge Engineer
**目的**: マージ済み PR + クローズ済み Issue から正式リリースノート生成 — JP 顧客へのデリバラブルとして送付可能。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `release.en.md`
- ベトナム語版（正本）: `release.md`

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

docs/reports/release-[version]-[date].html (HTML) + Markdown (バイリンガル)

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

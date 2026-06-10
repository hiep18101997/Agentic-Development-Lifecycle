---
name: ops-incident
description: >
  インシデントトリアージガイド、3 方向並列調査、なぜなぜ分析付き RCA テンプレート。
  トリガー: 「インシデント発生」「本番システム障害」「インシデントをトリアージ」「RCA を書く」「根本原因分析」「オンコールインシデント」、または /ops-incident と入力時。
---

# Skill: /ops-incident
**ロール**: DevOps
**目的**: インシデントトリアージ → 3 方向並列調査 → RCA テンプレート（なぜなぜ分析）。JP 顧客向けは 障害報告書 形式。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `incident.en.md`
- ベトナム語版（正本）: `incident.md`

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

RCA 文書 + 障害報告書（JP 顧客送付）

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。

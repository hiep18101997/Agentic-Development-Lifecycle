---
name: dev-autopilot
description: >
  自律実行用の coding harness を使い、baseline、反復実装、検証、独立レビュー、
  controlled escalation を実行する。"autopilot"、"自律でタスクを実行"、"agent loop"、
  または /dev-autopilot で起動する。
---

# Skill: /dev-autopilot
**ロール**: Autonomous Developer
**目的**: risk-classify 済みタスク向けの opt-in autonomy lane — initializer、incremental implementation loop、独立した 2 名の evaluator、evidence-based handoff。`/dev-implement` のようなファイル毎の confirm gate はない。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `SKILL.en.md`
- ベトナム語版（正本）: `SKILL.md`

**重要**: これは **opt-in** lane であり、デフォルトの手動 lane（`/dev-analyze` → `/dev-implement` →
`/dev-review` → `/dev-pr`）を置き換えるものではありません。他の全スキルは各ステップ後の hard stop を
維持します。autopilot は user が明示的に自律実行を許可したタスクにのみ適用します。`docs/agent-harness.ja.md`
を operating contract として使用します。

**サブエージェント生成**: `Agent({ description, prompt, model })`。ゲートツール: `AskUserQuestion`。

---

## JP 特有の考慮事項

- **JST タイムゾーン**: iteration timestamp、baseline 記録には JST (UTC+9) を使用
- **リスク分類**: Step 0 で必ず `docs/risk-classifier.ja.md` に従い分類（tiny/normal/high-risk）
- **Ask First Gates**: 機微変更（認証、データ損失、決済など）は `assets/ask-first-gates.ja.md` を参照 → 続行前にシニア確認
- **用語**: 業務 / 技術用語は `templates/jp-vn-en-glossary.md` から使用

---

## 出力

1. **2 名の blind evaluator + anti-sycophancy check** — `agents/autopilot-reviewer.md`（Evaluator A）と
   `agents/autopilot-adversary.md`（Evaluator B, adversarial）を毎 iteration 後に起動。両方が `pass` の場合、
   3 回目の devil's-advocate 再チェックを実行してから確定（詳細は EN/VN 版参照）。
2. `docs/tasks/[TASK-ID]/agent-state.md` — durable state（Decisions / Next steps / Open questions を含む）。
3. `docs/tasks/[TASK-ID]/verification.md`（`templates/verification.ja.md` 使用）— evaluator が `pass` を
   返した場合のみ `signOffStatus: Pass`。
4. `docs/tasks/[TASK-ID]/review-log-R1.md`（`templates/review-log.ja.md` 使用）— `verdict: approve`、
   `reviewer: AI (autopilot dual-evaluator)` を記入し、`/dev-review` を別途実行せず `/dev-pr` に進めるようにする。

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。Step 0 の autonomy envelope 確認、high-risk/Ask First
trigger の確認、Step 4 完了後の停止（push/merge/`/dev-pr` は別途権限が必要）は必須。
ゲート内容の詳細は VN/EN 版を参照。

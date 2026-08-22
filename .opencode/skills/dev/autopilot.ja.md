---
name: dev:autopilot
description: >
  自律実行用の coding harness を使い、baseline、反復実装、検証、独立レビュー、
  controlled escalation を実行する。"autopilot"、"自律でタスクを実行"、"agent loop"、
  または /dev:autopilot で起動する。
---

# /dev:autopilot
**ロール**: Autonomous Developer
**目的**: risk-classify 済みタスク向けの opt-in autonomy lane — initializer、incremental implementation loop、独立した 2 名の evaluator、evidence-based handoff。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `autopilot.en.md`
- ベトナム語版（正本）: `autopilot.md`

**重要**: これは **opt-in** lane であり、デフォルトの手動 lane（`/dev:analyze` → `/dev:implement` →
`/dev:review` → `/dev:pr`）を置き換えません。user が明示的に自律実行を許可したタスクにのみ適用します。
`docs/agent-harness.ja.md` を operating contract として使用します。

**サブエージェント生成**: `task({ description, prompt, subagent_type: "oracle" })`。ゲートツール: `question`。

---

## JP 特有の考慮事項

- **JST タイムゾーン**: iteration timestamp、baseline 記録には JST (UTC+9) を使用
- **リスク分類**: ステップ0 で必ず `docs/risk-classifier.ja.md` に従い分類
- **Ask First Gates**: 機微変更は `assets/ask-first-gates.ja.md` を参照 → 続行前にシニア確認

---

## 出力

1. **2 名の blind evaluator + anti-sycophancy check** — `agents/autopilot-reviewer.md` / `agents/autopilot-adversary.md`。両方 `pass` の場合、3 回目の devil's-advocate 再チェック後に確定。
2. `docs/tasks/[TASK-ID]/agent-state.md`、`verification.md`（`signOffStatus: Pass` は evaluator pass 後のみ）、`review-log-R1.md`（`verdict: approve`）— `/dev:review` を別途実行せず `/dev:pr` に進める。

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。ゲート内容の詳細は VN/EN 版を参照。

# Agent Harness 契約

ユーザーが `/dev-autopilot` で自律実行を明示的に許可した場合のみ使用します。長時間タスクをセッション間で
再開可能にし、検証可能な証拠がそろった場合だけ完了とします。

## 必須成果物

コード変更前に `docs/tasks/[TASK-ID]/agent-state.md` を作成し、status、iteration budget、目的と受入条件、
risk lane、許可範囲、baseline、検証証拠、reviewer verdict、未解決リスクを記録します。さらに、新しい
agent/human がログを読み返さずに即座に状況を把握できるよう、3 つの handoff フィールドを明記します:
**Decisions**（何を決めたか・理由）、**Next steps**（「実装を続ける」ではない具体的な次の一手）、
**Open questions**（未解決で resume を妨げる疑問）。

## Initializer

1. リポジトリ指示と git/worktree 状態を確認します。
2. `docs/risk-classifier.ja.md` でリスク分類し、機微変更には `assets/ask-first-gates.ja.md` を使用します。
3. 目的を検証可能な受入条件へ変換します。normal/high-risk では、既に `analysis.md`（`/dev-analyze` 由来）
   があれば実装前に作成/更新します。
4. 最小限で意味のある baseline を実行して記録します。before/after の証拠なしに既存失敗をタスク原因と
   判断しません。

## 自律ループ

1. 未完了の最小 AC を選び、一つの一貫した increment を実装します。
2. 狭い deterministic check から実行し、その後に広い check を行います。
3. コマンド、結果要約、次の仮説を `agent-state.md` に記録します。
4. 互いに blind な read-only evaluator を2名実行します: `agents/autopilot-reviewer.md` と
   `agents/autopilot-adversary.md`。両方が `pass` の場合、それを本当の pass として扱う前にもう1回
   devil's-advocate 的再チェックを実行します（`.claude/skills/dev-autopilot/SKILL.ja.md` 参照）。
5. verdict を処理します。`pass`（unanimous の場合は anti-sycophancy check 通過後）は続行/完了、どちらか
   の evaluator の `changes_required` は budget 内で修正と再評価、どちらかの `escalate` は証拠と必要な
   最小判断を提示して停止します。

失敗は feedback です。pass を作るために test を弱めたり AC を変更してはいけません。

## Guardrails

- High-risk と Ask First trigger は実装前の確認が必須で、承認後も security/architecture review を省略できません。
- 同じ blocker に対する異なる二つの仮説が失敗した場合、baseline failure を説明できない場合、要件競合、または iteration budget 到達時に escalation します。
- Evaluator は read-only で、自身の finding を waive できません。
- 別途許可なしに push、merge、release、production 変更を行いません。
- `agent-state.md`、`analysis.md`、`verification.md`、`review-log-R[N].md` を handoff context とします。

## 完了条件

全 AC に証拠または明記した limitation があり、evaluator loop が `pass`、`verification.md` と
`review-log-R[N].md`（`verdict: approve` または `approve-with-fixes`）が記録された場合のみ完了します。

## Recovery tier（現状とロードマップ）

autonomy-tier × recovery-tier タクソノミー（none → retry → resumable → durable）に基づく:

- **現在の recovery tier: `resumable`** — `agent-state.md` はセッション間で読み返せる markdown
  チェックポイントだが、resume は agent/human が再度読み解くことに依存しており、自動 resume を実行する
  仕組みはない。
- **`durable` には未到達** — crash 後に自動復旧する process/daemon が存在せず、iteration 途中で
  セッションが中断された場合は human が `agent-state.md` を開いて手動で続行を指示する必要がある。
- **現在の autonomy tier**: `checkpoint-gated`（各 increment に evaluator が必要、`escalate` では human
  も必要）と `bounded`（宣言済み iteration budget 内で実行）の間 — `/dev-autopilot` の Step 0 は常に
  ファイル変更前の確認を要求するため `headless` ではない。

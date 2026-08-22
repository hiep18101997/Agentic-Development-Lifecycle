# Agent Harness Contract

Use this contract only after the user explicitly authorizes autonomous execution via `/dev-autopilot`. It
makes long-running work resumable across sessions and closes only on verified evidence.

## Required artifact

Create `docs/tasks/[TASK-ID]/agent-state.md` before editing code. It records status, iteration budget,
objective and ACs, risk lane, autonomy envelope, baseline commands, iteration evidence, reviewer verdicts,
and open risks — plus three explicit handoff fields so a new agent/human can immediately orient without
re-deriving them from the raw log: **Decisions** (what was decided and why), **Next steps** (the concrete
next action, not "continue implementing"), and **Open questions** (what's unresolved and blocks a clean
resume).

## Initializer

1. Read repository instructions and inspect git/worktree state.
2. Classify risk with `docs/risk-classifier.md`; use `assets/ask-first-gates.md` for sensitive changes.
3. Normalize the objective into verifiable ACs. For normal/high-risk work, create or update
   `analysis.md` (from `/dev-analyze`) before coding if one already exists.
4. Run and record the smallest meaningful baseline. Do not attribute a pre-existing failure to the task
   without a before/after signal.

## Autonomous loop

1. Select the smallest incomplete AC and make one coherent increment.
2. Run narrow deterministic checks first, then broader checks.
3. Record commands, summarized output, and the next hypothesis in `agent-state.md`.
4. Run two read-only evaluators, blind to each other: `agents/autopilot-reviewer.md` and
   `agents/autopilot-adversary.md`. If both return `pass`, run one more devil's-advocate re-check before
   treating it as an earned pass (see `.claude/skills/dev-autopilot/SKILL.en.md` Step 3).
5. Handle the verdict: `pass` (past the anti-sycophancy check if unanimous) continues/finalizes;
   `changes_required` from either evaluator logs findings and iterates within budget; `escalate` from
   either evaluator stops with evidence and the smallest human decision required.

Failure is feedback; never weaken a test or rewrite an AC to manufacture a pass.

## Guardrails

- High-risk and Ask First triggers require confirmation before implementation; approval does not waive
  security or architecture review.
- Escalate after two materially different failed hypotheses on one blocker, an unexplained failing
  baseline, a requirement conflict, or exhaustion of the iteration budget.
- The evaluators are read-only and may not waive their own findings.
- Do not push, merge, release, or change production without separate authority.
- Use `agent-state.md`, `analysis.md`, `verification.md`, and `review-log-R[N].md` as handoff context, not
  chat history.

## Completion

Complete only when every AC has evidence or an explicit limitation, the evaluator loop returns `pass`, and
`verification.md` plus `review-log-R[N].md` (`verdict: approve` or `approve-with-fixes`) have been written.

## Recovery tier (current state and roadmap)

Using the autonomy-tier × recovery-tier taxonomy (none → retry → resumable → durable):

- **Current recovery tier: `resumable`** — `agent-state.md` is a markdown checkpoint readable across
  sessions, but resuming still depends on an agent/human re-reading and re-interpreting it; nothing
  executes an automatic resume.
- **Not yet `durable`** — no process/daemon recovers automatically after a crash; if a session is
  interrupted mid-iteration, a human must reopen `agent-state.md` and issue the continue instruction by
  hand.
- **Current autonomy tier**: between `checkpoint-gated` (every increment needs the evaluators, possibly a
  human at `escalate`) and `bounded` (runs within a declared iteration budget) — not `headless`, since
  `/dev-autopilot`'s Step 0 always requires confirmation before touching files.

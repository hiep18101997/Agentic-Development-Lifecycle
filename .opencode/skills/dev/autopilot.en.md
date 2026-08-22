---
name: dev:autopilot
description: >
  Run a coding task through an autonomy harness: baseline, incremental loop, validation,
  independent review, and controlled escalation. Triggers when the user says "autopilot",
  "run the full task autonomously", "autonomous agent loop", or types /dev:autopilot.
---

# /dev:autopilot
**Role**: Autonomous Developer
**Purpose**: Opt-in autonomy lane for an already risk-classified task — initializer, incremental implementation loop, two independent evaluators, and evidence-based handoff, without a confirm gate after every file like `/dev:implement`.

---

## Important

This is an **opt-in** lane — it does not replace the default manual lane
`/dev:analyze` → `/dev:implement` → `/dev:review` → `/dev:pr`. Every other skill keeps its hard stop after
each step; autopilot applies only to a task the user has explicitly granted autonomy for. Read
`docs/agent-harness.en.md` and follow it as the operating contract.

---

## Execution Guide

### Step 0 — Risk and autonomy gate

Classify with `docs/risk-classifier.md`: input type, which R-01..R-10 apply, tiny/normal/high-risk lane.
Hard Trigger → use `assets/ask-first-gates.md` format and stop for senior confirmation.

Use the `question` tool once to confirm: Task ID, objective/ACs, base branch or worktree, allowed
commands, iteration budget (default 3), PR authority. High-risk approval does not waive the evaluator loop
in Step 3.

**Wait for confirmation before editing.**

### Step 1 — Initializer and durable state

Read `docs/tasks/[TASK-ID]/analysis.md` if it exists (tiny lane records the plan directly in state).
Normalize the objective into verifiable ACs. Create `docs/tasks/[TASK-ID]/agent-state.md` per
`docs/agent-harness.en.md`. Run a meaningful baseline, record the command + result before touching code.

An unexplained failing baseline or requirement conflict → `status: blocked` and escalate.

### Step 2 — Incremental implementation loop

Each iteration: pick the smallest incomplete AC, make one coherent increment (no jumping ahead, no
out-of-scope refactor); run narrow checks first, broad checks after; record commands/output/next
hypothesis in `agent-state.md` (Decisions / Next steps / Open questions). Two materially different
hypotheses failing on the same blocker, or budget exhausted → escalate.

### Step 3 — Read-only evaluator loop (2 blind evaluators + anti-sycophancy check)

After every increment, call `task(subagent_type: "oracle")` **twice**, blind to each other (never pass
evaluator A's verdict into evaluator B's prompt):

- Oracle A: prompt from `agents/autopilot-reviewer.md` — TASK_ID, AC, RISK_LANE, BASE_BRANCH, ITERATION,
  analysis/state paths, validation evidence, git diff.
- Oracle B (adversarial): prompt from `agents/autopilot-adversary.md` — same input, verdict A not revealed.

Reconcile: either `changes_required` → treat as blocking, log both findings, fix, revalidate, call both
again. Either `escalate` → stop with evidence. **Both `pass`** → call `task(subagent_type: "oracle")` a
third time as a devil's-advocate re-check (assume the pass is wrong, argue the strongest case against it);
a genuine blocking issue found there becomes `changes_required`; nothing found means `pass` is earned
across three independent checks. No evaluator may waive a blocking finding; log all verdicts to
`agent-state.md`.

### Step 4 — Evidence-based handoff

Create `docs/tasks/[TASK-ID]/verification.md` from `templates/verification.en.md`, mapping every AC to
evidence or an explicit limitation. `signOffStatus: Pass` only once the evaluator loop returns `pass` past
the anti-sycophancy check.

Write `docs/tasks/[TASK-ID]/review-log-R1.md` from `templates/review-log.en.md` with `verdict: approve`
(or `approve-with-fixes`) and `reviewer: AI (autopilot dual-evaluator)` — so the task can proceed into
`/dev:pr` as if it already passed `/dev:review`, without running it separately.

```
Autopilot complete — [TASK-ID]. Iteration: [N]/[budget]. Files changed: [N].
Artifacts: agent-state.md, verification.md, review-log-R1.md.

STOP HERE. Do not automatically push, merge, or run /dev:pr without separate authority.
```

## Rules

Failure is feedback, never weaken a test/AC to pass. Escalate after two different failed hypotheses on
the same blocker, an unclear failing baseline, a requirement conflict, or budget exhaustion. High-risk/Ask
First always requires confirmation; approval never waives security/architecture review or the evaluator
verdict. Evaluators are read-only, never waive their own findings. Do not push/merge/release without
separate authority.

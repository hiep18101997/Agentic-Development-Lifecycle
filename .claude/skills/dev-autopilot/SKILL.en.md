---
name: dev-autopilot
description: >
  Run a coding task through an autonomy harness: baseline, incremental loop, validation,
  independent review, and controlled escalation. Triggers when the user says "autopilot",
  "run the full task autonomously", "autonomous agent loop", or types /dev-autopilot.
---

# Skill: /dev-autopilot
**Role**: Autonomous Developer
**Purpose**: Opt-in autonomy lane for an already risk-classified task — initializer, incremental implementation loop, two independent evaluators, and evidence-based handoff, without a confirm gate after every file like `/dev-implement`.

---

## Important

This is an **opt-in** lane — it does not replace the default manual lane
`/dev-analyze` → `/dev-implement` → `/dev-review` → `/dev-pr`. Every other skill in the framework keeps
its hard stop after each step; autopilot applies only to a task the user has explicitly granted autonomy
for. Read `docs/agent-harness.en.md` and follow it as the operating contract throughout the task.

---

## Execution Guide

### Step 0 — Risk and autonomy gate

Classify the task with `docs/risk-classifier.md`: input type, which R-01..R-10 items apply, and the
tiny/normal/high-risk lane. On a Hard Trigger → use the `⚠️ Ask First Gate` format in
`assets/ask-first-gates.md` and stop for senior confirmation before continuing.

Use `AskUserQuestion` once, before running anything, to confirm: Task ID, objective/ACs, base branch or
worktree, allowed commands, iteration budget (default 3), and PR authority. **High-risk approval does not
waive the mandatory evaluator loop in Step 3.**

**Wait for confirmation before editing files.**

---

### Step 1 — Initializer and durable state

1. Read `docs/tasks/[TASK-ID]/analysis.md` if it already exists (tiny lane may skip this — record the plan
   directly in state instead).
2. Normalize the objective into verifiable ACs.
3. Create `docs/tasks/[TASK-ID]/agent-state.md` using the template in `docs/agent-harness.en.md`.
4. Run the smallest meaningful baseline (the repo's existing build/test) and record the command + result
   **before touching any code**. Do not attribute a pre-existing failure to this task without a before/after
   signal.

An unexplained failing baseline or a requirement conflict → set `status: blocked` in `agent-state.md` and
escalate via `AskUserQuestion`.

---

### Step 2 — Incremental implementation loop

For each iteration:

1. Pick the smallest incomplete AC and make one coherent increment — same discipline as `/dev-implement`:
   no jumping ahead, no out-of-scope refactoring, no features beyond the defined ACs.
2. Run narrow deterministic checks first (the relevant unit tests), broader checks once the increment is
   complete.
3. Record commands, summarized output, and the next hypothesis in `agent-state.md` — under **Decisions**
   (what was decided and why), **Next steps** (the concrete next action), **Open questions** (what's
   unresolved).
4. If the same blocker fails under two materially different hypotheses, or the iteration budget is
   exhausted → escalate.

A migration that could lose data → always stop and confirm, never create it unattended. Any sensitive
change (`assets/ask-first-gates.md`) → stop immediately, never decide alone.

---

### Step 3 — Independent evaluator loop (2 blind evaluators + anti-sycophancy check)

After each complete increment, spawn **two** read-only evaluators, blind to each other — never paste one's
verdict into the other's prompt:

```
Agent({
  description: "Evaluate autonomous iteration (Evaluator A)",
  prompt: "Read agents/autopilot-reviewer.md. Evaluate TASK_ID, AC, RISK_LANE, BASE_BRANCH, ITERATION, analysis/state paths, validation evidence, and git diff. Return JSON only.",
  model: "sonnet"
})

Agent({
  description: "Evaluate autonomous iteration (Evaluator B — adversarial)",
  prompt: "Read agents/autopilot-adversary.md. Same TASK_ID, AC, RISK_LANE, BASE_BRANCH, ITERATION, analysis/state paths, validation evidence, and git diff — do NOT reveal Evaluator A's verdict. Return JSON only.",
  model: "sonnet"
})
```

Reconcile the two verdicts:

- **Either returns `changes_required`** → treat as blocking; log both sets of findings in `agent-state.md`,
  fix, revalidate, spawn both evaluators again.
- **Either returns `escalate`** → stop with evidence and the smallest human decision required.
- **Both return `pass`** → this is the unanimous-approval case — **do not finalize yet**, spawn one more
  devil's-advocate re-check:

```
Agent({
  description: "Devil's-advocate re-check on unanimous pass",
  prompt: "Both independent evaluators returned pass for this iteration. Assume that is wrong. Re-read the same evidence and git diff and argue the strongest case for why this should NOT pass. If you find a genuine blocking issue, return verdict: changes_required with the finding. If after genuinely trying you find nothing, return verdict: pass and state explicitly what you tried to break. Return JSON only, same shape as agents/autopilot-reviewer.md.",
  model: "sonnet"
})
```

  - A real blocking issue found there is handled as `changes_required`.
  - Nothing found means `pass` is earned (evidence from three independent passes) — mark the AC and continue
    or finalize.

All 3 evaluators are read-only; the orchestrator may not waive a blocking finding from any of them. Log
all verdicts (not just the final one) to `agent-state.md` for a complete audit trail.

---

### Step 4 — Evidence-based handoff

Create `docs/tasks/[TASK-ID]/verification.md` from `templates/verification.en.md`: map every AC to
command output, a repeatable manual observation, or an explicitly noted limitation. `signOffStatus` may
only be set to `Pass` once the Step 3 evaluator loop returns `pass` past the anti-sycophancy check (if
unanimous).

Write `docs/tasks/[TASK-ID]/review-log-R1.md` from `templates/review-log.en.md` with
`verdict: approve` (or `approve-with-fixes` if non-blocking items remain) and
`reviewer: AI (autopilot dual-evaluator)` — so the task can proceed straight into `/dev-pr` the same way a
manual-lane task that already passed `/dev-review` would, without a separate `/dev-review` run, since the
two independent evaluators plus devil's-advocate check in Step 3 are already equivalent.

```
Autopilot complete — [TASK-ID]

Iteration: [N] / [budget]
Commands run: [list]
Files changed: [N files]
Residual risks: [if any]

Artifacts:
- docs/tasks/[TASK-ID]/agent-state.md
- docs/tasks/[TASK-ID]/verification.md
- docs/tasks/[TASK-ID]/review-log-R1.md

**STOP HERE.** Do not automatically push, merge, or run /dev-pr without separate authority.
```

---

## Rules

- Failure is feedback — never weaken a test or rewrite an AC to manufacture a pass.
- Escalate after two materially different failed hypotheses on the same blocker, an unexplained failing
  baseline, a requirement conflict, or exhaustion of the iteration budget.
- High-risk or an Ask First trigger always requires confirmation before implementing; approval never waives
  security/architecture review or the evaluator verdict.
- The evaluators are read-only; they may not modify the implementation or waive their own findings.
- Do not push, merge, release, or change production without separate authority.
- `agent-state.md`, `verification.md`, and `review-log-R[N].md` are handoff context — never rely on chat
  history.

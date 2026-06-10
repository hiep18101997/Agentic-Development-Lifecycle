---
name: dev-implement
description: >
  Implement code after the option has been selected from /dev-analyze. File-by-file with a gate after each file.
  Triggers when: user says "bắt đầu implement", "code theo plan đã chọn", "viết code cho task",
  "start implementation", "implement feature", or types /dev-implement.
---

# Skill: /dev-implement
**Role**: Developer  
**Purpose**: Implement code after the option has been selected from /dev-analyze. File-by-file with a gate after each file.

---

## Important: Run /dev-analyze first

This skill requires `docs/tasks/[TASK-ID]/analysis.md` to exist.
If it does not exist, run `/dev-analyze` first.

---

## How to spawn subagents

Use the **Agent tool** to spawn subagents. Each subagent receives the minimum context needed — do not pass full conversation history.

---

## Execution Guide

### Step 1 — Read the analysis doc

Read `docs/tasks/[TASK-ID]/analysis.md`:
- Selected option
- List of files to change
- Technical decisions confirmed

### Step 1b — Gate: TDD Lane (opt-in)

Before implementing, ask:

```
## Implementation mode

| | Choice |
|---|--------|
| A | Standard — implement code first, test later (default) |
| B | TDD — write tests first, code later (recommended for complex business logic) |
```

**If TDD (B) is selected**:
1. For each business logic file: write (failing) tests first
2. Gate: confirm test cases cover all ACs
3. Implement code to make tests pass
4. Report: "Tests: N passing / M failing" after each file

**If Standard (A) is selected**: continue normally.

**Wait for confirmation.**

### Step 2 — Gate: Confirm implementation plan

```
## I will implement [TASK-ID] according to Option [X].

**Files to change** (in order):
1. `[file 1]` — [create/modify/delete] — [reason]
2. `[file 2]` — [create/modify/delete] — [reason]

**Implementation order**: [explain why this order — dependencies]

**Pre-code setup**:
- Branch: `feature/[TASK-ID]-[slug]`
- DB migration needed: [yes/no]
- New ENV variables: [list or "none"]

| | Choice |
|---|--------|
| A | Start with `[file 1]` right away |
| B | Adjust order — new order: ___ |
| C | Other: ___ |
```

**Wait for confirmation.**

### Step 3 — Implement each file

For **each file**, in order:

1. Read the current file (if modifying)
2. Implement the change
3. Short report

**Report template after each file**:

```
## File [N/Total]: `[path]` ✅

**Changes**:
- [Description of change 1]
- [Description of change 2]

**Tests**: [Inline / Needs separate file / N/A]

| | Choice |
|---|--------|
| A | Continue with `[next file]` |
| B | Stop — need to adjust: ___ |
| C | Other: ___ |
```

**Wait for confirmation before moving to the next file.**

If code is not as expected (missing dependency, unexpected state, conflict with existing code):

```
## ⚠️ Blocked at `[path]`

**Issue**: [Specific description]

| | Choice |
|---|--------|
| A | [Solution A] |
| B | [Solution B] |
| C | Other: ___ |
```

**Do not decide on your own — always ask when blocked.**

### Step 4 — Gate: Post-implementation checklist

After all files are done:

```
## Implementation complete — [TASK-ID]

**Files changed**: [N files]
**Migration to run**: [yes/no — command if yes]
**ENV to add**: [list or "none"]

**Dev self-check** (verify before handing to user for testing):
- [ ] No hardcoded values (URLs, credentials, magic numbers)
- [ ] Error cases are handled
- [ ] Input validated at system boundary (API endpoint / form)
- [ ] No sensitive data logged (password, token, PII)
- [ ] DB migration reversible (if applicable)
```

**Wait for confirmation that dev self-check is done.**

### Step 5 — Verification Gate: Diff Review + Self-Test

After the dev confirms Step 4, spawn a subagent to analyze the diff:

> "Read `git diff main..HEAD` (or the current branch diff). Return:
> 1. **Impact summary**: what changed, which modules are affected, potential edge cases
> 2. **Self-test steps**: 3-7 specific test steps based on the actual changes (not generic templates).
>    Each step: clear action, clear expected result.
>    Priority: happy path → edge case → error case.
> READ only, do not modify anything."

Present the results:

```
## Verification — [TASK-ID]

### Diff Summary
**Files changed**: [list]
**Impact**: [which modules are affected, what risks]
**ACs covered by code**:
- ✅ AC-001: [covered at file:line]
- ⚠️ AC-002: [needs manual verification]

### Self-Test Steps
| # | Action | Expected Result |
|---|--------|----------------|
| T-01 | [Specific test step] | [Expected result] |
| T-02 | [Specific test step] | [Expected result] |
| T-03 | [Edge case] | [Expected result] |
| ... | | |

Please execute the test steps above and report results:
- Each test: PASS / FAIL / SKIP (+ note if FAIL)
```

**Wait for user to report test results.**

After receiving results, create `docs/tasks/[TASK-ID]/verification.md` using template `templates/verification.en.md`.

Fill in:
- **Frontmatter**: `taskId`, `verifiedBy` (user name), `signOffStatus` (Pending → update to Pass/Fail after user reports results)
- **AC Results table**: from diff-reader AC coverage — each AC row with test method and result
- **Automated Tests section**: paste actual test output (command + pass/fail counts + coverage %)
- **Manual Test Steps table**: T-01...T-N from the Self-Test Steps table above with actual results filled in
- **Issues Found**: any FAIL results → describe with severity
- **Sign-off**: check dev self-review box; date = today JST

```
## Verification complete ✓

`docs/tasks/[TASK-ID]/verification.md` has been saved.

**STOP HERE.**

Next steps (in order):
1. `/sec-review` — security review before creating PR
2. `/dev-pr` — create PR (will automatically read verification.md)
```

**Do not automatically run sec-review or dev-pr.**

### Harness Delta Check

Before finishing, ask yourself:
- Was any gate unclear — forcing you to guess the behavior?
- Is any template missing an important field?
- Is there a recurring issue from a previous task?

If yes → add an entry to `docs/improvement-backlog.md` immediately (no human confirmation needed):
```
| IB-XXX | dev-implement / [TASK-ID] | [friction description] | [proposed fix] | open |
```

---

## Rules

- Implement one file at a time — do not jump ahead
- Do not refactor code outside the task scope
- Do not add features outside the defined ACs
- Migrations can cause data loss → **always ask for confirmation** before creating them
- If any sensitive changes are discovered → stop, refer to `assets/ask-first-gates.md`
- If an unrelated bug is found → note it, create a separate issue, do not fix it immediately

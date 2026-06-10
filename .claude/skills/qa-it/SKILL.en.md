---
name: qa-it
description: >
  Create Integration/E2E Test plan from spec and UT results, support human E2E execution and result recording.
  Only runs AFTER /qa-ut passes. On failure, explicit bug feedback loop back to dev-debug.
  Triggers when: user says "tạo IT plan", "integration test", "E2E test cases", "integration testing",
  "end-to-end test", "IT plan for feature", or types /qa-it.
---

# Skill: /qa-it
**Role**: QA Engineer  
**Purpose**: Create Integration/E2E Test plan covering end-to-end business flows. Only runs AFTER UT passes. On failure → explicit bug feedback loop back to dev phase.

---

## Execution Guide

### Step 0 — Check UT prerequisite

Read `docs/tasks/[TASK-ID]/ut-results.md`.

- If it **does not exist** or verdict ≠ `PASS`:
  ```
  ⚠️ IT cannot run until UT has passed.
  Run /qa-ut first, then return to /qa-it.
  ```
  **Stop here.**

- If verdict = `PASS` → continue to Step 1.

### Step 1 — Read input

Read in order:
1. `docs/tasks/[TASK-ID]/requirements.md` — business flows, end-to-end ACs
2. `docs/tasks/[TASK-ID]/analysis.md` — chosen approach, affected APIs/Screens
3. `docs/tasks/[TASK-ID]/test-plan-ut.md` — UT scope already tested, avoid duplicating
4. Relevant Screen/API docs (if `## Screen Design Stub` or `## API Design Stub` exists in analysis.md)

### Step 2 — Gate: Confirm IT scope

Use the `AskUserQuestion` tool:

- **Integration flows**: Which end-to-end flows need testing? (e.g., Login → Create Order → Payment)
- **Environment**: Staging / Dev / Prod-like?
- **Test data**: Special data setup needed? (user accounts, seed data, mock services)
- **External dependencies**: Mock third-party APIs or use real ones?

**Wait for confirmation.**

### Step 3 — Create IT Plan

Create `docs/tasks/[TASK-ID]/test-plan-it.md` using template `templates/test-plan.md` with TCs:

Each TC must include:
- **TC-IT-XXX**: ID in format `TC-IT-001`
- **Flow**: End-to-end business flow name
- **Preconditions**: Data/state to set up before testing
- **Steps**: Numbered execution steps
- **Expected Result**: Expected outcome after key steps
- **Postconditions**: System state after test completes
- **Type**: Happy / Edge / Error / Performance

Cover fully:
- Happy flow (complete main flow from start to finish)
- Cross-component integration (API ↔ DB ↔ Cache, Screen ↔ API)
- Error recovery (service timeout, network failure, rollback)
- Data integrity (no data loss on mid-flow failure)

### Step 3.5 — Render HTML checklist

Generate `docs/tasks/[TASK-ID]/test-plan-it.html` with:
- Checkbox per TC and per step, state saved in localStorage (key: `it-[TASK-ID]`)
- Grouped by Flow using `<details><summary>`
- Auto go/no-go badge: 🔴 if any Happy TC fails
- Export button → copy results as Markdown to paste into `it-results.md`

HTML file is NOT committed. `test-plan-it.md` is the source of truth.

```
✓ Generated `docs/tasks/[TASK-ID]/test-plan-it.html`
  Open in browser to tick each step during E2E execution.
```

### Step 4 — Gate: Validate IT plan

Use the `AskUserQuestion` tool:

- Which flows seem missing?
- Any specific integration scenarios (race conditions, concurrent users) not yet covered?
- Which preconditions are hard to set up — what support is needed?

**Wait for confirmation.**

### Step 5 — Gate: IT Execution Results

**⚠️ HUMAN ONLY — AI does not execute E2E tests.**

Use the `AskUserQuestion` tool after human runs E2E:

- Total TCs: pass / fail / blocked / skipped?
- Which TCs failed? (ID + failing step + actual behavior)
- Any environment/data setup errors? (these don't count as test failures)

**Wait for human to report results.**

**If all TCs pass:**

```
✅ IT PASSED — [N] TCs passed, [N] skipped

Results written to: docs/tasks/[TASK-ID]/it-results.md
🎉 Both UT and IT have passed — ready for /dev-pr and merge.
```

Create `docs/tasks/[TASK-ID]/it-results.md`:
```markdown
# IT Results: [TASK-ID]
- verdict: PASS
- timestamp_jst: [JST]
- total: [N] | pass: [N] | fail: 0 | skipped: [N]
- environment: [staging/dev/...]
- ut_prerequisite: PASS (see ut-results.md)
```

**If any TCs fail:**

Create `docs/tasks/[TASK-ID]/bug-handoff.md` (append if already exists from UT round):

```markdown
# Bug Handoff: [TASK-ID] — IT Round [N]

## Failing Test Cases
| TC ID | Flow | Step Fail | Actual Behavior | Expected |
|-------|------|-----------|----------------|----------|
| TC-IT-002 | Login → Order | Step 3: POST /api/orders | 500 Internal Error | 201 Created |

## Suspected Files (from analysis.md + API Design Stub)
- [API handler / service related to the failing step]
- [DB migration if relevant]

## Next Steps
- Run /dev-debug [TASK-ID] for root cause analysis
- After fix → re-run /qa-it (no need to re-run UT if unit code is unchanged)
```

```
❌ IT FAILED — [N] TCs failed

Bug handoff written: docs/tasks/[TASK-ID]/bug-handoff.md
Next step: /dev-debug [TASK-ID] to find the root cause of the integration failure.
```

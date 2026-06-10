---
name: qa-ut
description: >
  Create Unit Test plan (testcase-functional) from spec/requirements, support human execution and result recording.
  Completely separate from IT (integration/E2E). On failure, explicit bug feedback loop back to dev-debug.
  Triggers when: user says "tạo unit test", "UT plan", "functional test cases", "create unit tests",
  "test each function", "unit test for feature", or types /qa-ut.
---

# Skill: /qa-ut
**Role**: QA Engineer  
**Purpose**: Create Unit Test plan per function/component, support execution and result recording. On failure → explicit bug feedback loop back to dev phase.

---

## Execution Guide

### Step 1 — Read input

Read in order:
1. `docs/tasks/[TASK-ID]/requirements.md` — AC list, business rules
2. `docs/tasks/[TASK-ID]/analysis.md` — implemented files, chosen approach
3. Relevant screen / API docs (if referenced in analysis.md)

### Step 2 — Gate: Confirm UT scope

Use the `AskUserQuestion` tool:

- **Component/Function**: Which units need testing? (If unclear → AI infers from analysis.md)
- **Test framework**: Jest / JUnit / pytest / Vitest / other?
- **Coverage target**: Line coverage % if there's a requirement
- **Mock strategy**: Pure unit (mock all deps) or lean integration (mock only externals)?

**Wait for confirmation.**

### Step 3 — Create UT Plan

Create `docs/tasks/[TASK-ID]/test-plan-ut.md` using template `templates/test-plan.md` with TCs:

Each TC must include:
- **TC-UT-XXX**: ID in format `TC-UT-001`
- **Unit**: Function/method/component being tested
- **Input**: Specific input data
- **Expected**: Expected output/behavior
- **Assertion**: Specific assertion (e.g., `expect(result).toBe(42)`)
- **Type**: Happy / Edge / Negative / Error

Cover fully:
- Happy path (valid input, correct output)
- Edge cases (boundary values, empty, null, zero)
- Negative cases (invalid input, type mismatch)
- Error cases (exception thrown, error message)

### Step 3.5 — Render HTML checklist

Generate `docs/tasks/[TASK-ID]/test-plan-ut.html` with:
- Checkbox per TC, state saved in localStorage (key: `ut-[TASK-ID]`)
- Grouped by Unit (function/component) using `<details><summary>`
- Filter by Type (Happy / Edge / Negative / Error)
- Priority pills: High=🔴, Med=🟡, Low=🟢

HTML file is NOT committed. `test-plan-ut.md` is the source of truth.

```
✓ Generated `docs/tasks/[TASK-ID]/test-plan-ut.html`
  Open in browser during test execution to tick each TC.
```

### Step 4 — Gate: Validate test plan

Use the `AskUserQuestion` tool:

- Which TCs seem missing or redundant?
- Any domain-specific edge cases not yet covered?
- Should AI generate test code from the plan? (If yes → spawn test-gen agent)

**Wait for confirmation.**

### Step 5 — (Optional) Spawn test-gen

If user wants auto-generated test code:

```
Agent(
  description: "Generate UT code from approved test plan",
  prompt: "Write unit test code per agents/test-gen.md spec.\n\nIMPLEMENTED FILES:\n[files from analysis.md]\n\nTC LIST:\n[TC-UT-xxx list from test-plan-ut.md]\n\nTEST FRAMEWORK:\n[confirmed framework from Gate]\n\nEXISTING TEST EXAMPLES:\n[1-2 existing test files from codebase]",
  model: "sonnet"
)
```

### Step 6 — Gate: UT Execution Results

**⚠️ HUMAN ONLY — AI does not execute tests.**

Use the `AskUserQuestion` tool after human runs the test suite:

- Total TCs: pass / fail / blocked / skipped?
- Which TCs failed? (ID + short error message)
- Any setup/environment errors? (these don't count as test failures)

**Wait for human to report results.**

**If all TCs pass:**

```
✅ UT PASSED — [N] TCs passed, [N] skipped

Results written to: docs/tasks/[TASK-ID]/ut-results.md
Next step: /qa-it to run integration/E2E tests.
```

Create `docs/tasks/[TASK-ID]/ut-results.md`:
```markdown
# UT Results: [TASK-ID]
- verdict: PASS
- timestamp_jst: [JST]
- total: [N] | pass: [N] | fail: 0 | skipped: [N]
```

**If any TCs fail:**

Create `docs/tasks/[TASK-ID]/bug-handoff.md`:

```markdown
# Bug Handoff: [TASK-ID] — UT Round [N]

## Failing Test Cases
| TC ID | Unit | Error Summary |
|-------|------|--------------|
| TC-UT-003 | userService.validate() | TypeError: Cannot read property 'id' of null |

## Suspected Files (from analysis.md)
- [file:line related to the failing unit]

## Next Steps
- Run /dev-debug [TASK-ID] for root cause analysis
- Or /dev-implement for a straightforward fix
- After fixing, re-run /qa-ut
```

```
❌ UT FAILED — [N] TCs failed

Bug handoff written: docs/tasks/[TASK-ID]/bug-handoff.md
Next step: /dev-debug [TASK-ID] to find the root cause.
```

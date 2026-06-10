---
name: qa-testplan
description: >
  Create a comprehensive test plan from spec/user stories: strategy, test cases happy/edge/negative, exit criteria.
  Triggers when: user says "create test plan", "write test cases", "test strategy",
  "QA plan", or types /qa-testplan.
---

# Skill: /qa-testplan
**Role**: QA Engineer  
**Purpose**: Create a comprehensive test plan from spec/user stories, including test cases and strategy.

---

## Execution Guide

### Step 1 — Read input

Read `docs/tasks/[TASK-ID]/requirements.md` and related screen/API docs.

### Step 2 — Gate: Confirm test scope

```
## I will create a test plan for: [Feature name]

I have read the spec and identified:
- [N] Acceptance Criteria to verify
- [M] Business Rules to test
- Related screens: [list]
- Related APIs: [list]

Before writing the test plan, I need to ask:

| # | Question | Options |
|---|---------|---------|
| 1 | Test levels to cover? | A: Unit / B: Integration / C: E2E / D: Performance / E: Security / F: All / G: Other: ___ |
| 2 | Test environment? | A: Dev / B: Staging / C: Prod-like / D: Other: ___ |
| 3 | Any special test data needed? | A: No / B: Yes — data type: ___ / C: Other: ___ |
| 4 | Regression scope — what needs retesting? | _(list features/flows to retest)_ |
```

### Step 3 — Create Test Plan

Create `docs/tasks/[TASK-ID]/test-plan.md` using template `templates/test-plan.en.md`.

### Step 3.5 — Render HTML companion (interactive checklist)

Generate `docs/tasks/[TASK-ID]/test-plan.html` from template `templates/html-artifact.html`:

- Inject `<ul class="checklist" data-storage-key="testplan-[TASK-ID]">` for each TC
- Each `<li>` has `<input type="checkbox" data-id="TC-XXX">` + label = TC name
- Group by type: Happy / Edge / Negative using `<details><summary>` expandable sections
- Header includes `<input type="search" data-filter="...">` to filter TCs by keyword
- Pill `pill-ok|warn|err` for priority High/Med/Low

QA ticks checkboxes when running tests, state saved to localStorage — no need to copy to Markdown.
HTML file is NOT committed (already in `.gitignore`). `test-plan.md` remains the source of truth committed to the repo.

```
✓ Generated `docs/tasks/[TASK-ID]/test-plan.html`
  Open in browser when running tests to tick the checklist (state saved to localStorage).
```

### Step 4 — Final gate

```
Test plan has been written with [N] test cases.

| # | Question | Options |
|---|---------|---------|
| 1 | Are any test cases missing? | A: None missing / B: Missing — describe: ___ / C: Other: ___ |
| 2 | Are there domain-specific edge cases I haven't covered? | A: No / B: Yes — edge case: ___ / C: Other: ___ |
| 3 | Are the exit criteria strict enough? | A: Good enough / B: Need more criteria: ___ / C: Other: ___ |
| 4 | Should I auto-generate test code from the test plan? | A: Yes / B: No — will write manually / C: Other: ___ |
```

### Step 5 — (Optional) Spawn subagent: test-gen

If user selects "Yes" on question 4, spawn test-gen to generate test code from the approved test plan:

```
Agent(
  description: "Generate test code from approved test plan",
  prompt: "Write test code per agents/test-gen.md spec.\n\nNEW CODE:\n[Files đã implement — chỉ pass files mới/changed]\n\nAC LIST:\n[AC list từ test plan]\n\nTEST FRAMEWORK:\n[Jest/JUnit/pytest/...]\n\nEXISTING TEST EXAMPLES:\n[1-2 file test hiện có]",
  model: "sonnet"
)
```

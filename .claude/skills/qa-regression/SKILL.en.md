---
name: qa-regression
description: >
  Create a regression test checklist before release, analyze blast radius, determine go/no-go.
  Triggers when: user says "regression test", "test before release", "verify no regression",
  "sprint sign-off", "QA before production deploy", or types /qa-regression.
---

# Skill: /qa-regression
**Role**: QA Engineer  
**Purpose**: Create a regression test checklist before release. Verify existing features are not affected by new changes.

---

## When to use

- Before each release / sprint end
- After merging PRs that affect shared code (auth, middleware, DB migration)
- When PM requests sign-off before deploying to production

---

## Execution Guide

### Step 1 — Gather scope of changes

Spawn a subagent (using **Agent tool**) to read:
- `git log [base]..HEAD --name-only` — files that have changed
- `docs/tasks/[TASK-IDs]/requirements.md` — all tasks in the release

Subagent returns: file list + blast radius analysis.

### Step 2 — Gate: Confirm regression scope

```
## Regression scope for release [version/sprint]:

**Tasks in release**: [list TASK-IDs]
**Files changed**: [N files]

**Blast radius analysis**:

| Area | Risk | Reason |
|------|------|--------|
| [Auth flow] | High | auth.service.js modified |
| [Payment] | Low | No related changes |
| [Dashboard] | Medium | Shared component updated |

**Suggested test priority**:
- 🔴 Must Test: [list areas]
- 🟡 Should Test: [list areas]
- 🟢 Smoke only: [list areas — skip if time is short]

| | Options |
|---|---------|
| A | Confirm — create checklist with this scope |
| B | Adjust scope — modify: ___ |
| C | Other: ___ |
```

**Wait for confirmation.**

### Step 3 — Create Regression Checklist (HTML is primary format)

Regression checklist is a **one-shot decision artifact** (run → tick → go/no-go) — primary format is HTML, no Markdown commit needed. Generate `docs/tasks/regression-[sprint-or-version].html` from template `templates/html-artifact.html`:

- 3 collapsible `<details>` sections for 🔴 Must Test / 🟡 Should Test / 🟢 Smoke
- Each section is a `<table data-sortable>` with columns: ID | Test Case | Steps | Expected | Result | Bug?
- Result column has `<select>` (Pass/Fail/Blocked) that updates `data-state` and changes row background color by state
- Header has auto-updating Go/No-Go badge: turns red if any Must Test = Fail
- Toolbar has "Export results" button — copies the table to Markdown for pasting into sprint report

HTML file is NOT committed (it's under `docs/tasks/**/*.html` which is ignored). If the JP client requires evidence, **export to PDF from browser** (Cmd+P → Save as PDF) and attach.

Content structure (skill injects into HTML):

```markdown
# Regression Test: [Sprint/Version]

**QA**: [Name]  
**Date**: [Date]  
**Release scope**: [TASK-IDs]  
**Environment**: Staging  
**Status**: In Progress / Pass / Fail

---

## 🔴 Must Test (High Risk)

### [Area 1 — e.g., Auth Flow]

| ID | Test Case | Steps | Expected | Result | Bug? |
|----|-----------|-------|----------|--------|------|
| RT-001 | Login with valid email/password | 1. POST /auth/login with correct credentials | 200 + JWT token | | |
| RT-002 | Login with wrong password | 1. POST /auth/login with wrong password | 401 + error message | | |
| RT-003 | [Newly merged feature] | [...] | [...] | | |

### [Area 2 — if applicable]

| ID | Test Case | Steps | Expected | Result | Bug? |
|----|-----------|-------|----------|--------|------|
| RT-XXX | | | | | |

---

## 🟡 Should Test (Medium Risk)

| ID | Test Case | Steps | Expected | Result | Bug? |
|----|-----------|-------|----------|--------|------|
| RT-XXX | | | | | |

---

## 🟢 Smoke Test (Low Risk)

| ID | Test Case | Result |
|----|-----------|--------|
| RT-XXX | Core flow X still works | |

---

## Bugs Found

| Bug ID | Severity | Test Case | Description | Status |
|--------|----------|-----------|-------------|--------|
| | | | | |

---

## Sign-off

- [ ] All 🔴 Must Test pass
- [ ] No unresolved Critical/High bugs
- [ ] PM confirms acceptable risk for remaining Medium/Low bugs
- [ ] QA Lead sign-off: __________________  Date: __________
```

### Step 4 — Gate: Sign-off confirmation

```
Regression checklist created with [N] test cases.

Go/no-go conditions:
- ✅ Go: All Must Test pass, no Critical/High bugs
- ⛔ No-go: Any Must Test fails, or there are Critical bugs

After execution → update results in the table and send results to PM.
If bugs are found → create a GitHub issue immediately, set priority.
```

---

## Rules

- Regression scope must cover all High Risk areas — do not skip
- If a new bug is found → create an issue immediately, set priority, do not assume "it will be fixed later"
- Do not deploy to production with unresolved Critical or High bugs
- Regression results must be saved to `docs/tasks/` for audit trail

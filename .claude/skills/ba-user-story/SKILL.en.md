---
name: ba-user-story
description: >
  Transform specs into User Stories with standard Acceptance Criteria, ready for PM to create issues.
  Trigger when: user says "tạo user stories", "viết user story", "breakdown spec thành stories",
  "create user stories", "AC cho stories", or types /ba-user-story.
---

# Skill: /ba-user-story
**Role**: Business Analyst  
**Purpose**: Transform specs into User Stories with standard Acceptance Criteria, ready for PM to create issues.

---

## Execution Guide

### Step 1 — Read existing spec

Read `docs/tasks/[TASK-ID]/requirements.md` if it exists. If not yet created, ask the user to run `/ba-spec` first.

### Step 2 — Gate: Confirm scope

```
## I will create User Stories from spec: [Feature name]

The spec has [N] Use Cases and [M] Acceptance Criteria.

Before I start, I need to ask:

| # | Question | Options |
|---|---------|---------|
| 1 | Desired granularity? | A: Each Use Case = 1 story / B: Group by feature / C: Split smaller than Use Case / D: Other: ___ |
| 2 | Story format? | A: "As a [role], I want [action], so that [benefit]" / B: Different format: ___ / C: Other: ___ |
| 3 | Any existing Epic to link to? | A: Yes — name/link: ___ / B: No / C: Other: ___ |
```

**Wait for confirmation.**

### Step 3 — Create User Stories

Create each User Story using template `templates/user-story.en.md`.

### Step 4 — Final Gate: Review + Suggest ordering

```
## Created [N] User Stories:

| ID | Name | Priority | Estimate | Dependencies |
|----|------|----------|----------|--------------|
| US-001 | | | | |

**Suggested implementation order** (based on dependencies and value):
1. US-XXX — [reason]
2. US-XXX — [reason]

**Questions before finalizing**:

| # | Question | Options |
|---|---------|---------|
| 1 | Are the estimates reasonable? | A: Reasonable / B: Too high — adjust US-XXX: ___ / C: Too low — adjust US-XXX: ___ / D: Other: ___ |
| 2 | Can US-XXX be split further for easier demo? | A: No need / B: Yes — split as follows: ___ / C: Other: ___ |
| 3 | Should any stories be deferred to the next sprint? | A: No / B: Yes — story: ___ / C: Other: ___ |
```

---

## Output files

- Update `docs/tasks/[TASK-ID]/requirements.md` with the User Stories section
- Ready for PM to use `/pm-breakdown` to create GitHub Issues

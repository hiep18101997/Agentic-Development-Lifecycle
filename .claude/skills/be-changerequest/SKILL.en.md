---
name: be-changerequest
description: >
  Manage 変更依頼 (Change Requests) — analyze impact, create approval trail,
  version control spec changes. Use when specs change mid-sprint or after sign-off.
  Trigger when: user says "khách JP yêu cầu thay đổi", "tạo change request", "変更依頼",
  "spec thay đổi giữa chừng", "CR mới từ JP", "change request", or types /be-changerequest.
---

# Skill: /be-changerequest
**Role**: Bridge Engineer / PM  
**Purpose**: Handle change requests from JP clients in a controlled manner — clear impact analysis, full approval trail, no silent changes merged into specs.

---

## Project Context

Spec changes after sign-off are the highest risk in JP outsource:
- JP clients often request small changes via email/chat without a formal CR
- VN devs implement "to be fast" without an approval trail → later the client questions it
- Impact is not estimated → scope creep goes uncontrolled

**Core Principle**: Every change after sign-off must have a CR document before dev touches code.

---

## Execution Guide

### Step 0 — Load glossary

Read `templates/jp-vn-en-glossary.md` before handling technical terminology.

### Step 1 — Gate: Collect CR information

Use the `AskUserQuestion` tool:

- **Request source**: Email from JP / Meeting / Slack/Teams / Formal 変更依頼書
- **Change type**: New feature addition / Existing spec modification / Scope removal / New performance requirement / UI/UX adjustment
- **Urgency**: Needed in current sprint / Next sprint / Flexible

**Wait for confirmation.**

### Step 2 — Impact Analysis

Read:
- `docs/tasks/[TASK-ID]/requirements.md` — the original spec being changed
- `docs/tasks/[TASK-ID]/analysis.md` — implementation already planned or in progress
- `docs/decisions/ADR-*.md` — related technical decisions

Analyze across 4 dimensions:

```
## Impact Analysis: CR-[NUMBER]

### Scope Impact
- Affected files/modules: [list]
- Changed / added / removed ACs: [diff from original spec]
- Test cases needing update: [list]

### Effort Impact
- Additional estimate: [X man-hours / man-days]
- Doable in current sprint: [Yes / No / Partial]
- If No: needs to be moved to sprint [N+1 / TBD]

### Risk Impact
- New risks: [list]
- Affected dependencies: [list]
- Regression risk: [Low / Medium / High]

### Schedule Impact
- Current deadline: [Date]
- Impact on deadline: [None / Delayed X days / Needs renegotiation]
```

### Step 3 — Gate: Confirm impact before drafting CR

```
## I have analyzed the impact of the change request.

[Display impact analysis from Step 2]

| # | Question | Options |
|---|---------|---------|
| 1 | Is the impact analysis accurate? | A: Accurate / B: Needs adjustment: ___ / C: Other: ___ |
| 2 | Who will approve the CR from team side? | _(enter PM / Tech Lead name)_ |
| 3 | Should we send the estimate to JP before approval? | A: Yes — send estimate email first / B: No — proceed with CR doc / C: Other: ___ |
```

**Wait for confirmation.**

### Step 4 — Create Change Request Documents

#### 4a. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md` (Vietnamese — internal)

Create using template `templates/change-request.en.md`.

Fill in the 10 sections from the impact analysis results:
- CR ID, title, change type, requester, impact level in frontmatter
- Change Description (from JP request summary)
- Reason/Background
- Affected Functionality table (from Step 2 scope impact)
- Technical Impact Analysis table (DB/API/UI/Integration/Security/Performance)
- Effort Estimate (Dev/QA/Review+Deploy in 人日)
- Risks and Mitigations
- Deployment Plan (target date, sprint, prerequisites)
- Acceptance Criteria (minimum 2 ACs)
- Expected Benefits
- Approval History table (PM + Tech Lead + JP Client — all start as Pending)

#### 4b. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md` (Japanese — send to JP client)

Create using template `templates/change-request.ja.md`.

This is a formal Japanese deliverable (変更依頼書). Translate the change content and impact analysis from 4a into Japanese using terminology from `templates/jp-vn-en-glossary.md`.

### Step 5 — Final Gate

```
## Change Request CR-[NUMBER] has been drafted.

Files created:
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md (internal — commit)
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md (send to JP — commit)

Checklist:
- [ ] Impact analysis reviewed by PM and Tech Lead
- [ ] Estimate confirmed (not "TBD")
- [ ] CR-jp.md translated using correct glossary terminology
- [ ] Approval table includes all 3 parties: PM + Tech Lead + JP Client

Next steps:
- [ ] Send CR-jp.md to JP client for confirmation
- [ ] After JP client approves: update requirements.md (note "CR-[NUMBER] approved [date]")
- [ ] Create new GitHub Issue or update original issue
```

**Wait for confirmation.**

---

## Rules

- **DO NOT** implement changes before the CR is approved by both PM and JP client
- Every CR must have a number (CR-001, CR-002...) — track in `docs/tasks/[TASK-ID]/cr/`
- If the CR changes architecture → trigger `/arch-adr` after approval
- If the CR adds a security-sensitive feature → trigger `/sec-review` after implementation

---
name: pm-status
description: >
  Aggregate sprint status from multiple sources, generate a quick status report for stakeholders.
  Trigger when: user says "báo cáo sprint", "status report", "tổng hợp tiến độ",
  "sprint health", "update cho PM", "report cho khách",
  "sprint report", "progress summary", "status for PM", "report for client",
  or type /pm-status.
---

# Skill: /pm-status
**Role**: Project Manager  
**Purpose**: Aggregate sprint/project status from multiple sources, generate a quick report for stakeholders.

---

## Execution Guide

### Step 1 — Collect information

Ask the user to provide (or read from available context):
- List of issues/tasks in the sprint and their status
- Known blockers
- Remaining time in the sprint

### Step 2 — Gate: Confirm report scope

```
## I will create a status report for Sprint [N].

Before compiling, let me know:

| # | Question | Choice |
|---|---------|--------|
| 1 | Who is this report for? | A: Team internal / B: Stakeholder / C: Management / D: Japanese client / E: Other: ___ |
| 2 | Preferred format? | A: HTML dashboard (recommended for stakeholders/JP clients) / B: Markdown (post to Slack/Notion) / C: Plain text / D: Other: ___ |
| 3 | Any specific metrics to highlight? | A: Velocity / B: Burn rate / C: Blockers / D: Not needed / E: Other: ___ |
```

### Step 3 — Generate Status Report

**Format determined by Gate 2 question 2**:
- **A — HTML dashboard** (default for stakeholders/JP clients): generate `docs/reports/sprint-[N]-status.html` from template `templates/html-artifact.html` — see structure below
- **B — Markdown**: generate inline in chat or save `docs/reports/sprint-[N]-status.md` — use Markdown template below
- **C — Text**: one-screen summary in chat

#### HTML format (option A)

Inject into template:
- Header: Sprint [N] · Velocity badge (X/Y points) · Burn rate pill (ok/warn/err)
- Section "Kanban view": 4 columns Done / In Progress / Blocked / To Do using CSS grid, each card is a task
- `<table data-sortable>` for Risks & Actions with Impact column using pill
- Filter `<input type="search" data-filter="...">` for task list
- `@media print` ensures clean A4 printing when forwarding by email to JP clients

HTML file is NOT committed (if inside `docs/tasks/`). Saving to `docs/reports/` means it can be committed — decide based on project storage needs.

#### Markdown format (option B/fallback)

```markdown
# Sprint [N] Status Report
**Date**: [Date]  
**PM**: [Name]

## 🟢 Overview
[1-2 sentence summary of overall status]

## ✅ Done
| Task | Assignee | Story Points |
|------|----------|-------------|
| | | |

## 🔄 In Progress
| Task | Assignee | % Done | Expected completion |
|------|----------|--------|-------------------|
| | | | |

## ⛔ Blocked
| Task | Blocker | Action needed by | Deadline |
|------|---------|-----------------|----------|
| | | | |

## 📋 To Do
| Task | Priority | Sprint Risk |
|------|----------|------------|
| | | |

## 📊 Sprint Health
- **Velocity**: [X] points done / [Y] points planned
- **Burn rate**: On track / At risk / Behind
- **Scope change**: [Description if any]

## 🚨 Risks & Actions
| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| | | | |

## 📅 Important Dates
- [Upcoming events/deadlines]
```

### Step 4 — Final gate

```
Report has been prepared.

Questions before sending:

| # | Question | Choice |
|---|---------|--------|
| 1 | Are any issue statuses incorrect? | A: No / B: Yes — issue + correct status: ___ / C: Other: ___ |
| 2 | Are there any risks you know of that I haven't mentioned? | A: No / B: Yes — risk: ___ / C: Other: ___ |
| 3 | Is the report tone appropriate for the audience? | A: Appropriate / B: Needs to be more formal / C: Needs to be more casual / D: Other: ___ |
```

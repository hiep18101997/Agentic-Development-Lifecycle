---
name: pm-maintain
description: >
  Lightweight workflow for projects in maintenance/sustain phase — after go-live, only
  bug fixes and minor improvements remain, no active development sprints.
  Trigger when: user says "dự án đang maintenance", "chế độ bảo trì", "post go-live support",
  "sustain phase", "không có sprint mới chỉ fix bug",
  "project in maintenance", "post-go-live support",
  "no new sprints just bug fixes", or type /pm-maintain.
---

# Skill: /pm-maintain
**Role**: PM / Dev / BE  
**Purpose**: Minimal workflow for the maintenance phase — enough control without the overhead of an active sprint.

---

## Project Context

Maintenance phase differs from active development:
- No regular sprint planning / backlog grooming
- Requests arrive ad-hoc — JP client emails bug reports anytime
- Smaller team — usually 1-2 devs + 1 part-time BE
- JP outsource: SLA / 保守契約 defines response time and fix time
- Need clear history tracking for billing / monthly client reports

---

## Maintenance Workflow

```
JP Bug Report / Request
    → Triage (classify + priority)
    → Fix (tiny: patch directly / normal: dev-analyze → implement)
    → QA verify
    → Release (hotfix or monthly batch)
    → 月次報告書 (monthly report sent to JP)
```

---

## Execution Guide

### Step 1 — Gate: Determine request type

Use the `AskUserQuestion` tool:

- **Type**: Bug fix / Minor improvement / Performance issue / Security patch / Question from JP
- **Source**: Reported by JP client / Reported by user / Monitoring alert / Internal discovery
- **SLA**: Is there an SLA obligation? Required response time?

**Wait for confirmation.**

### Step 2 — Triage

Classify using the Maintenance Priority Matrix:

```
## Triage: [Issue name]

**Priority**: P1 / P2 / P3 / P4

| Priority | Definition | Target fix time |
|----------|-----------|----------------|
| P1 — Critical | Production down / Data loss / Security breach | Fix immediately, within the day |
| P2 — High | Feature broken, difficult workaround | Fix within 1-3 days |
| P3 — Medium | Feature broken, workaround exists | Fix within 1-2 weeks |
| P4 — Low | UI glitch / minor inconvenience | Batch into monthly release |

**Classification**: [P1/P2/P3/P4]
**Reason**: [...]
**Assignee**: [Dev name]
**Fix deadline (JST)**: [Date]
```

### Step 3 — Fix workflow by priority

#### P1 — Critical (Hotfix)

```
P1 Hotfix Protocol:
1. Notify BE immediately → BE notifies JP client within 30 minutes
2. Dev fixes (use tiny lane — patch directly)
3. QA quick verify (smoke test)
4. Deploy hotfix immediately
5. Post-mortem: write to docs/reports/incident-[date].md
6. Send 障害報告書 to JP client (use /ops-incident)
```

#### P2/P3 — Normal fix

Apply abbreviated dev workflow:

```
For tasks with analysis.md (normal risk):
  /dev-analyze → /dev-implement → /dev-review → /dev-pr → merge → deploy

For small patches (tiny):
  Fix directly → /dev-review → /dev-pr → merge → batch into monthly release
```

#### P4 — Batch into monthly release

Record in `docs/maintenance/[YEAR-MONTH]-backlog.md`:

```markdown
# Maintenance Backlog: [YYYY-MM]

| ID | Description | Reporter | Priority | Status |
|----|-------------|----------|----------|--------|
| M-001 | [...] | [JP client / internal] | P4 | Open |
```

### Step 4 — Monthly Report

Create `docs/reports/monthly-[YYYY-MM].md` using template `templates/monthly-maintenance-report.en.md`.

Fill in the 5 sections:
1. **Objectives and Results This Month** — SLA %, bugs resolved, CRs implemented vs target
2. **Work Performed** — list every task/CR with ID, type, effort in 人日, result
3. **Incidents/Issues** — list all incidents with severity, RCA summary, status; calculate MTTR
4. **System Health** — assess Performance/Security/Dependencies/Backup status
5. **Next Month's Plan** — list planned work with priority and estimate; note any risks

Translate key sections to Japanese if the report will be sent to the JP client (BE reviews before sending).

### Step 5 — Final gate

```
## Maintenance task complete.

| # | Question | Choice |
|---|---------|--------|
| 1 | Should this task be recorded in the monthly report? | A: Yes — already added to backlog / B: No — P1/P2 hotfix, separate report / C: Other: ___ |
| 2 | Does the JP client need to be notified about this fix? | A: Yes — BE will email / B: Not needed / C: Wait for monthly report / D: Other: ___ |
| 3 | Do baseline docs need updating? | A: Yes — run /docs-update / B: No spec changes / C: Other: ___ |
```

---

## Rules

- P1: Notify JP client before fix is complete — do not stay silent
- Every fix needs a ticket (GitHub Issue) — no matter how small — for billing and monthly reporting
- Monthly report is sent on the first business day of the following month (JST)
- When monthly man-hours exceed the 保守契約 limit → alert PM immediately to negotiate a CR

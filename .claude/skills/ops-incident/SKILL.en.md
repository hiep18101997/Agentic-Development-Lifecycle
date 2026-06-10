---
name: ops-incident
description: >
  Guide for triaging incidents, parallel 3-direction investigation, and creating an RCA template with 5 Whys.
  Triggers when: user says "there's an incident", "production system error", "triage an issue",
  "write RCA", "root cause analysis", "on-call incident", or types /ops-incident.
---

# Skill: /ops-incident
**Role**: DevOps / On-call Engineer  
**Purpose**: Guide for triaging incidents, creating an RCA template, and documenting lessons learned.

---

## Execution Guide

### Step 1 — Quick triage (DO NOT stop to ask, run immediately)

When an incident occurs, triage in order:

```
## INCIDENT TRIAGE

| # | Question | Options |
|---|---------|---------|
| 1 | IMPACT: How many users/services are affected? | _(type here)_ |
| 2 | SEVERITY | A: P1 — complete outage / B: P2 — degraded / C: P3 — minor / D: Other: ___ |
| 3 | STARTED: When did it start? | _(enter time)_ |
| 4 | SYMPTOMS: What specific symptoms? | _(type here)_ |
```

### Step 2 — Assist Investigation

Based on symptoms, suggest **3 parallel investigation directions**:

```
## Incident [INC-XXX] — P[N]

**Impact**: [Description]
**Started**: [Time]

### 3 priority investigation directions:

**Direction A**: [Hypothesis 1] — Check: [specific command/dashboard]
**Direction B**: [Hypothesis 2] — Check: [...]
**Direction C**: [Hypothesis 3] — Check: [...]

I suggest starting with Direction A because [reason].
Who will check which direction?
```

### Step 3 — Create RCA Template

After the incident is resolved, create `docs/reports/INC-[XXX]-RCA.md` using template `templates/incident-report.en.md`.

Fill in:
- **Frontmatter**: incidentId, severity (P1-P4), startTime/endTime/durationMinutes, incidentCommander
- **Summary**: 2-3 sentences — what happened, when, user impact
- **Impact**: users affected, features affected, SLA impact, whether JP client was notified
- **Timeline**: use actual timestamps from the incident; include detection → ack → root cause found → fix → resolved
- **Root Cause**: trigger event + 5 Whys analysis + contributing factors
- **What Went Well / What Didn't**: blameless — focus on systems, not people
- **Action Items**: at minimum AI-001 (prevent recurrence), AI-002 (improve detection), AI-003 (update runbook)
- **Supporting Materials**: links to logs, dashboards, related PRs

### Step 4 — Final RCA gate

```
RCA draft completed.

Important questions:

| # | Question | Options |
|---|---------|---------|
| 1 | "5 Whys" — is root cause [X] correct? | A: Correct / B: There's a deeper layer — that layer is: ___ / C: Other: ___ |
| 2 | Action Items — is AI-001 realistic within the deadline? | A: Yes / B: No — needs adjustment: ___ / C: Other: ___ |
| 3 | Is there any contributing factor that was missed? | A: No / B: Yes — factor: ___ / C: Other: ___ |
| 4 | Who needs to review this RCA before wider sharing? | _(enter name)_ |
```

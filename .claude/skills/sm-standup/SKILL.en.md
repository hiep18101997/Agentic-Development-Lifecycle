---
name: sm-standup
description: >
  Summarize and format daily standup quickly from raw input, highlight blockers and sprint health.
  Triggers when: user says "summarize standup", "format daily standup", "daily scrum",
  "today's standup", "paste team updates", or types /sm-standup.
---

# Skill: /sm-standup
**Role**: Scrum Master / Team  
**Purpose**: Summarize and format daily standup quickly, highlight blockers.

---

## Execution Guide

### Step 1 — Gather input

Receive input from the team (paste raw content from Slack/chat or a list from each person):

```
## Paste your team's standup updates here.

Input format doesn't matter — raw text, bullet points, or prose are all fine.
I will format it properly.

I need to know: When does Sprint [N] end?
```

### Step 2 — Summarize and format

```markdown
# Daily Standup — [Date]
**Sprint [N]** | **Day [X]/[Y]**

---

## Team Updates

### [Member 1 name]
- ✅ **Yesterday**: [...]
- 🔄 **Today**: [...]
- ⛔ **Blockers**: [None / Description]

### [Member 2 name]
...

---

## 🚨 Blockers Needing Action

| Person | Blocker | Needs help from |
|--------|---------|-----------------|
| | | |

## ⚠️ Sprint Health

- Tasks completed: [N]/[Total]
- Days remaining: [X]
- At-risk items: [list if any]

## 📌 Follow-up

- [Was yesterday's action item completed?]
```

### Step 3 — Gate: Highlight concerns

```
Standup summary complete.

I noticed:

| # | Observation | Options |
|---|-------------|---------|
| 1 | [Member X] has been blocked for [N] days — should we escalate? | A: Escalate now / B: Give it one more day / C: Not needed / D: Other: ___ |
| 2 | Task [Y] is at risk — only [Z] days left | A: Needs additional support / B: Being handled / C: Already rescoped / D: Other: ___ |
| 3 | Velocity looks unusual — am I missing anything? | A: Nothing missing / B: Yes — context: ___ / C: Other: ___ |
```

**Wait for confirmation.**

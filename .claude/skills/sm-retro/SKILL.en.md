---
name: sm-retro
description: >
  Facilitate sprint retrospective, synthesize feedback by theme, create actionable action items.
  Triggers when: user says "sprint retro", "retrospective", "end of sprint meeting",
  "sprint review", "what went well", "retro action items", or types /sm-retro.
---

# Skill: /sm-retro
**Role**: Scrum Master  
**Purpose**: Facilitate sprint retrospective, synthesize feedback, create actionable action items.

---

## Execution Guide

### Step 1 — Gate: Setup retro

```
## I will facilitate the retrospective for Sprint [N].

Before we start:

| # | Question | Options |
|---|---------|---------|
| 1 | Preferred retro format? | A: Start/Stop/Continue / B: 4Ls (Liked/Learned/Lacked/Longed for) / C: Mad/Sad/Glad / D: Other: ___ |
| 2 | Team size | _(enter number of people)_ |
| 3 | Retro timebox | _(enter minutes)_ |
| 4 | Are there any unfinished action items from the previous retro? | A: No / B: Yes — [N] items not done / C: Other: ___ |
```

**Wait for confirmation.**

### Step 2 — Synthesize feedback

Receive input from the team (paste anonymous feedback or session notes).

Categorize and group into themes:

```markdown
# Sprint [N] Retrospective

**Date**: [Date]  
**Facilitator**: [SM name]  
**Attendees**: [N] people  
**Sprint**: [N] | [Start date] → [End date]

---

## Sprint Highlights

- **Velocity**: [X] points ([+/-N%] vs previous sprint)
- **Delivered**: [N]/[M] planned items
- **Team health**: 🟢 Good / 🟡 OK / 🔴 Needs attention

---

## What Went Well ✅

### [Theme 1: e.g., "Collaboration"]
- [Specific observation]
- [Votes: N]

### [Theme 2]
...

---

## What Needs Improvement 🔧

### [Theme 1: e.g., "Requirements clarity"]
- [Specific observation]
- [Votes: N]
- [Suggested fix]

### [Theme 2]
...

---

## Action Items

| # | Action | Owner | Done by | Success metric |
|---|--------|-------|---------|----------------|
| 1 | [Specific action, not vague] | [Name] | Sprint [N+1] Day 1 | [...] |
| 2 | | | | |

---

## Action Items from Previous Retro

| Action | Owner | Status | Notes |
|--------|-------|--------|-------|
| [Action from Sprint N-1] | [Name] | ✅ Done / ❌ Not done / 🔄 In progress | [...] |

---

## Shoutouts 🌟

- [Member X] — [specific reason for shoutout]
```

### Step 3 — Final gate

```
Retro summary is ready.

I have [N] action items.

Important questions:

| # | Question | Options |
|---|---------|---------|
| 1 | Action item [X] — does [Name] accept ownership? | A: Yes / B: No — reassign to: ___ / C: Other: ___ |
| 2 | Are there too many action items? | A: Just right / B: Too many — cut to top 2-3 / C: Other: ___ |
| 3 | Is there an important theme that was miscategorized and needs splitting? | A: No / B: Yes — theme: ___ / C: Other: ___ |
| 4 | Old unfinished action items — should we escalate or drop? | A: Escalate / B: Drop / C: Carry over one more sprint / D: Other: ___ |
```

**Wait for confirmation.**

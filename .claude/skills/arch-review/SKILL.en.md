---
name: arch-review
description: >
  Review design decisions, detect architecture issues, propose improvements.
  Triggers when: user says "review design", "check architecture", "architecture review",
  "review technical decision", "is this design okay", or types /arch-review.
---

# Skill: /arch-review
**Role**: Tech Lead / Architect  
**Purpose**: Review design decisions, detect architecture issues, propose improvements.

---

## Execution Guide

### Step 1 — Receive input

Input can be:
- Description of the design decision to review
- Code snippet / diagram
- PR link
- Spec document

### Step 2 — Gate: Confirm review scope

```
## I will review [design/component name].

Before I start, tell me:

| # | Question | Options |
|---|---------|---------|
| 1 | What should the review focus on? | A: Scalability / B: Security / C: Maintainability / D: Performance / E: All / F: Other: ___ |
| 2 | Are there any constraints I should know? | _(type here — team size, deadline, tech debt...)_ |
| 3 | Are there any related ADRs? | A: Yes — link: ___ / B: No / C: Other: ___ |
```

**Wait for confirmation.**

### Step 3 — Analyze and Review

Evaluate across these lenses:

**1. Correctness** — Is the logic correct?
**2. Scalability** — Can it handle increased load?
**3. Maintainability** — Can future team members understand and modify it?
**4. Security** — Are there any attack surfaces?
**5. Performance** — Where are the bottlenecks?
**6. Coupling** — Is it too dependent on other modules?
**7. Testability** — Is it easy to test?

### Step 4 — Present results

```
## Architecture Review: [Name]

### 🟢 Strengths
- [Strength 1]
- [Strength 2]

### 🔴 Critical Issues (must fix before merge)
| ID | Issue | Impact | Suggested fix |
|----|-------|--------|---------------|
| | | | |

### 🟡 Should Improve (non-blocking)
| ID | Issue | Suggestion |
|----|-------|-----------|
| | | |

### 💡 Long-term Suggestions
- [Improvements to consider later]

### Questions to clarify

| # | Question | Options |
|---|---------|---------|
| 1 | [Design decision without clear rationale] | _(type here)_ |
| 2 | [Undocumented trade-off] | _(type here)_ |
```

### Step 5 — Gate: Discussion

```
After review:

| # | Question | Options |
|---|---------|---------|
| 1 | Issue [ID] — what was the reasoning behind this design? | _(explain context if any)_ |
| 2 | Suggestion [X] — is it feasible within the current timeline? | A: Yes, will do / B: Not feasible / C: Needs more consideration / D: Other: ___ |
| 3 | Should we create an ADR for this decision? (/arch-adr) | A: Yes / B: Not needed / C: Other: ___ |
```

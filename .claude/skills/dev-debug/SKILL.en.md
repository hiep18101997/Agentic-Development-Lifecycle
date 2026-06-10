---
name: dev-debug
description: >
  Systematic debugging — find root cause before fixing. Reproduce → Localize → Reduce → Fix → Guard.
  Triggers when: user says "debug lỗi", "tìm nguyên nhân bug", "tại sao bị lỗi",
  "fix bug", "investigate error", "lỗi không biết tại sao", or types /dev-debug.
---

# Skill: /dev-debug
**Role**: Developer  
**Purpose**: Systematic debugging — find root cause before fixing. Avoid "fixing randomly until the error goes away".

---

## Core Principles

**Never** touch code before having a minimal reproduction.  
Fixing the wrong root cause = creating more bugs.

## 5-Step Process

### Step 1 — Reproduce

```
## I will help debug this issue.

First:

| # | Question | Options |
|---|---------|---------|
| 1 | Describe the bug: what happens vs what is expected? | _(fill in)_ |
| 2 | Steps to reproduce | _(fill in — rough is fine)_ |
| 3 | Is this bug new or has it always existed? | A: New — after change: ___ / B: Always existed / C: Not sure / D: Other: ___ |
| 4 | Error message / stack trace | _(paste here if available)_ |
```

**Ask First Gate**: If the bug occurs on production with real users → notify the team immediately before debugging. See `assets/ask-first-gates.md` for details.

### Step 2 — Localize

Spawn a subagent to read related code (read-only):

> "Find code handling [describe behavior]. Return file:line and the flow from entry point to the potential failure point. Do not modify anything."

Present:

```
## I identified the code areas that could be the source of the bug:

1. [file:line] — [reason for suspicion]
2. [file:line] — [reason for suspicion]

Hypotheses:
- H1: [Hypothesis 1 about the root cause]
- H2: [Hypothesis 2]

I will check H1 first because [reason].
Do you have any additional hypotheses based on your context?
```

### Step 3 — Reduce

Create a minimal reproduction — the smallest code that can trigger the bug.

```
## Minimal reproduction:

[Code snippet or minimal steps]

Does the bug reproduce with this code?
(If not → the issue lies in the interaction with another part, not here)
```

**Do not continue without a minimal reproduction.**

### Step 4 — Fix

Only after the root cause is confirmed:

```
## Root cause identified: [Clear description]

Proposed fixes:
- Fix A: [Targeted fix] — fixes the exact spot, minimal side effects
- Fix B: [Broader fix] — fixes the pattern across more files

I recommend Fix A first (smaller, easier to review).

| | Choice |
|---|--------|
| A | Agreed — Fix A |
| B | Prefer Fix B (broader) |
| C | Other: ___ |
```

**Ask First Gate**: If the fix involves any sensitive changes (`assets/ask-first-gates.md`) → needs senior review before applying.

### Step 5 — Guard

After applying the fix:

```
## Fix applied.

I will also add a test to prevent regression:
[Test case description]

| | Choice |
|---|--------|
| A | No, that's enough |
| B | Yes — edge case: ___ |
| C | Other: ___ |
```

---

## Red Flags (stop if observed)

- Trying to fix multiple things at once without understanding why
- The bug "disappeared" but you don't know why
- Fixed but cannot reproduce the original failing case
- Stack trace points to library code — usually a usage error, not a bug in the library

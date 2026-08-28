---
name: dev:debug
description: >
  Systematic debugging — find the root cause before fixing. Reproduce → Localize → Reduce → Fix → Guard.
  Triggers when: user says "debug lỗi", "tìm nguyên nhân bug", "tại sao bị lỗi",
  "fix bug", "investigate error", "lỗi không biết tại sao", or types /dev:debug.
---

# /dev:debug
**Role**: Developer  
**Purpose**: Systematic debugging — find the root cause before fixing. Avoid "random fixing until the bug goes away."

---

## Core Principles

**Never** touch code before having a minimal reproduction.  
Fixing the wrong root cause = creating more bugs.

## 5-Step Process

### Step 1 — Reproduce

Use the `question` tool to gather information:

question({
  questions: [{
    question: "Describe the bug: what happened vs what was expected?",
    header: "Describe",
    options: [
      { label: "Will describe", description: "Provide description + steps" },
    ]
  }, {
    question: "Is this bug new or has it always existed?",
    header: "Timing",
    options: [
      { label: "New", description: "After a recent change" },
      { label: "Always existed", description: "Bug has existed for a long time" },
      { label: "Not sure", description: "Cannot determine yet" },
    ]
  }, {
    question: "Is there an error message / stack trace?",
    header: "Error info",
    options: [
      { label: "Yes", description: "Will paste stack trace" },
      { label: "No", description: "No error message available" },
    ]
  }]
})

**Ask First Gate**: If the bug occurs on production with real users → notify the team immediately before debugging. See `assets/ask-first-gates.md`.

### Step 2 — Localize

Spawn a subagent to read related code (read-only), reusing `agents/code-scout.md`:

task(
  description: "Find code related to reported bug",
  prompt: "Find code handling the behavior described below. Return JSON per agents/code-scout.md spec — relevant_files (file:line + reason for suspicion) and entry_points (entry point to the potential failure point). Read-only, do not modify anything.\n\nTASK SUMMARY: [bug description + steps to reproduce + error message from Step 1]\nTECH STACK: [language, framework, folder structure if known]",
  subagent_type: "explorer"
)

Subagent returns `relevant_files` (file:line + reason for suspicion) and `entry_points` — use these to present below.

Present results:

```
## I identified the code areas that could be the source of the bug:

1. [file:line] — [reason for suspicion]
2. [file:line] — [reason for suspicion]

Hypothesis:
- H1: [Hypothesis 1 about the cause]
- H2: [Hypothesis 2]

I will check H1 first because [reason].
```

Use the `question` tool:

question({
  questions: [{
    question: "Do you have any additional hypotheses based on your context?",
    header: "Hypothesis",
    options: [
      { label: "No", description: "Proceed with current hypotheses" },
      { label: "Yes", description: "Will add hypotheses" },
    ]
  }]
})

### Step 3 — Reduce

Create a minimal reproduction — the smallest code that can trigger the bug.

```
## Minimal reproduction:

[Code snippet or minimal steps]

Does the bug reproduce with this code?
(If not → the issue lies in interaction with another part, not this one)
```

**Do not proceed without a minimal reproduction.**

### Step 4 — Fix

Only after confirming the root cause, use the `question` tool:

question({
  questions: [{
    question: "Root cause identified. Choose fix approach?",
    header: "Fix",
    options: [
      { label: "Targeted fix", description: "Fix exactly at the source, minimal side effects" },
      { label: "Broader fix", description: "Fix the whole pattern, more files involved" },
    ]
  }]
})
**Wait for confirmation.**

**Ask First Gate**: If the fix involves any sensitive changes (`assets/ask-first-gates.md`) → requires senior review before applying.

### Step 5 — Guard

After applying the fix, use the `question` tool:

**Mandatory**: Re-run the exact minimal reproduction case captured in Step 3, and confirm the original failure no longer occurs. The bug MUST NOT be considered closed until it has been re-verified with this minimal reproduction.

question({
  questions: [{
    question: "Fix applied. Are additional tests needed to prevent regression?",
    header: "Guard",
    options: [
      { label: "Not needed", description: "Fix is sufficient" },
      { label: "Add tests", description: "Add regression tests" },
    ]
  }]
})
**Wait for confirmation.**

---

## Red Flags (stop if observed)

- Trying to fix multiple things at once without understanding why
- Bug "disappeared" but don't know why
- Fixed but can no longer reproduce the original failing case
- Stack trace points to library code — usually incorrect usage, not a bug in the library

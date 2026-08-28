---
name: arch:adr
description: >
  Create an Architecture Decision Record (ADR) to document important architectural decisions.
  Trigger when: user says "create ADR", "document architectural decision", "write ADR",
  "record design decision", or types /arch:adr.
---

# /arch:adr
**Role**: Tech Lead / Architect  
**Purpose**: Create an Architecture Decision Record to document important architectural decisions.

---

## Execution Guide

### Step 1 — Gate: Gather context

question({
  questions: [{
    question: "What is the problem/context leading to this decision?",
    header: "Context",
    options: [
      { label: "I will describe", description: "I will provide detailed context" },
    ]
  }, {
    question: "What options have been considered?",
    header: "Options",
    options: [
      { label: "I will list them", description: "I will provide the options considered" },
    ]
  }]
})

### Step 2 — Create ADR

Create file `docs/decisions/ADR-[NNN]-[slug].md` using template `templates/adr.en.md`.

Fill in all sections:
- **Context**: situation + constraints leading to the decision
- **Decision**: definitive, not ambiguous
- **Options Considered**: at least 2, including the chosen option
- **Consequences**: positive + negative/trade-offs
- **Conditions to Revisit**: specific triggers (not "when needed")

### Step 3 — Final Gate

question({
  questions: [{
    question: "ADR is ready. Are the 'negative consequences' honest enough?",
    header: "Review",
    options: [
      { label: "Sufficient", description: "Trade-offs have been fully documented" },
      { label: "Need more", description: "Some negative consequences are not mentioned" },
    ]
  }, {
    question: "Does any team member need to review before accepting?",
    header: "Reviewers",
    options: [
      { label: "Not needed", description: "Can be accepted immediately" },
      { label: "Needs review", description: "Someone else needs to review first" },
    ]
  }]
})

After confirmation, I will update the status to "Accepted".

Once the ADR moves to "Accepted", suggest running `node bin/generate-project-context.js` to refresh the auto-generated `docs/project-context.md` digest (never hand-edit that file).

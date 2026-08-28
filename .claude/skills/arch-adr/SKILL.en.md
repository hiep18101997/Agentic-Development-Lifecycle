---
name: arch-adr
description: >
  Create an Architecture Decision Record (ADR) to document important architectural decisions.
  Triggers when: user says "create ADR", "document architecture decision", "write ADR",
  "record design decision", or types /arch-adr.
---

# Skill: /arch-adr
**Role**: Tech Lead / Architect  
**Purpose**: Create an Architecture Decision Record to document important architectural decisions.

---

## Execution Guide

### Step 1 — Gate: Gather context

```
## I will create an ADR for the decision: [name]

To write a complete ADR, tell me:

| # | Question | Options |
|---|---------|---------|
| 1 | What problem/context led to this decision? | _(type here)_ |
| 2 | What alternatives were considered? | _(type here)_ |
| 3 | Why was the current approach chosen? | _(type here)_ |
| 4 | Who made the decision? | _(type here)_ |
```

### Step 2 — Create ADR

Create file `docs/decisions/ADR-[NNN]-[slug].md` using template `templates/adr.en.md`.

Fill in all sections:
- **Context**: situation + constraints leading to the decision
- **Decision**: definitive, not ambiguous
- **Alternatives Considered**: at least 2, including the chosen option
- **Consequences**: positive + negative/trade-offs
- **Conditions to Revisit**: specific triggers (not "when needed")

### Step 3 — Final gate

```
ADR-[NNN] has been written.

Questions before finalizing:

| # | Question | Options |
|---|---------|---------|
| 1 | Are the "negative consequences" honest enough? | A: Good enough / B: Need to add — specifics: ___ / C: Other: ___ |
| 2 | Are the "conditions to revisit" realistic? | A: Yes, reasonable / B: No — revise: ___ / C: Other: ___ |
| 3 | Does any team member need to review before acceptance? | A: Not needed / B: Yes — tag: ___ / C: Other: ___ |

After confirmation, I will update the status to "Accepted".
```

Once the ADR moves to "Accepted", suggest running `node bin/generate-project-context.js` to refresh the auto-generated `docs/project-context.md` digest (never hand-edit that file).

**Wait for confirmation.**

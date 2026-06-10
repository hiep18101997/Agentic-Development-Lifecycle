---
adrId: ADR-[NNN]
date: [YYYY-MM-DD]
status: Proposed
deciders: [Names]
consulted: [Names — people consulted before the decision]
informed: [Names — people notified after the decision]
taskContext: [PROJECT-XXX if applicable]
lang: en
---

# ADR-[NNN]: [Short title describing the decision]

<!-- status values: Proposed | Accepted | Deprecated | Superseded by ADR-[XXX] -->

---

## Context and Problem Statement

[2-3 sentences describing the problem to be solved and why this is an architectural decision worth documenting. What forces or constraints are at play?]

## Decision Drivers

- [Force or concern 1 — e.g., "The team needs a solution that scales to 10x current traffic within 6 months"]
- [Force or concern 2 — e.g., "Operational cost must stay below $X/month"]
- [Force or concern 3]

## Considered Options

- [Option 1: Name]
- [Option 2: Name]
- [Option 3: Name]

## Decision Outcome

**Chosen option**: [Name of the chosen option]

**Justification**: [Explain clearly why this option was chosen over the others. Reference the Decision Drivers above. State explicitly which trade-offs are being consciously accepted.]

## Pros and Cons of the Options

### Option 1: [Name]

[Short description — 1-2 sentences on the approach]

- **Pro**: [Most significant benefit]
- **Pro**: [Second benefit if applicable]
- **Con**: [Main limitation or risk]
- **Con**: [Second limitation if applicable]

### Option 2: [Name]

[Short description]

- **Pro**: [...]
- **Con**: [...]

### Option 3: [Name] — Chosen

[Short description]

- **Pro**: [...]
- **Pro**: [...]
- **Con**: [...]

## Consequences

### Positive
- [Expected benefit from this decision]
- [Foreseeable good outcomes]

### Negative / Trade-offs
- [Cost or risk consciously accepted — do not hide these]
- [Limitation the team must live with]

### Neutral
- [Neither good nor bad side effects — workflow changes, training needed, etc.]

## Confirmation

[How will we verify that this decision has been implemented correctly? Must be specific and testable.

Examples:
- "After implementation, run a load test confirming p95 < 200ms at 500 RPS"
- "Peer review checklist item #5 in /dev-review must pass"
- "CI pipeline must include a step checking [X] before merge"
]

## Conditions to Revisit

[When should this decision be reconsidered? Must be specific.

Examples:
- "When traffic exceeds 1M req/day for two consecutive weeks"
- "When the team scales beyond 15 developers"
- "If vendor [X] drops support for the version currently in use"
]

## Related Documents

- [Link to spec, PR, meeting notes, issue, or related ADR]
- [ADR-[NNN]: Name of related ADR if applicable]

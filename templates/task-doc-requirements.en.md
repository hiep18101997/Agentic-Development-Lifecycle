---
sessionId: [TASK-ID-YYYYMMDD-HHMM]
createdAt: [YYYY-MM-DD HH:mm JST]
updatedAt: [YYYY-MM-DD HH:mm JST]
commitSha: [short-sha]
roundCount: 0
lang: en
---

# [Feature/Task Name]

**Task ID**: [PROJECT-XXX]  
**Date Created**: [YYYY-MM-DD]  
**BA**: [Name]  
**Status**: Draft / Review / Approved  
**Lane**: tiny | normal | high-risk — _(see `docs/risk-classifier.md`)_  
**Depends on**: [Comma-separated list of TASK-IDs, e.g. TASK-003, TASK-007 — or `None` if no dependency]

---

## 1. Context & Problem Statement

[Describe the business problem to be solved. Why does this need to be done? What happens if it is not addressed?]

## 2. Objectives

- [Objective 1 — measurable if possible]
- [Objective 2]

## 2b. Design & Implementation Constraints

_IEEE 29148 §5.2.5 — List mandatory constraints that the solution design and implementation must respect. Distinguish from NFRs (Section 9): NFRs describe "how good", constraints describe "must/must not do"._

| Type | Constraint | Reason |
|------|------------|--------|
| Technical | [Example: Must use PostgreSQL — no DB engine change permitted] | [Existing infrastructure, migration cost] |
| Business | [Example: Must be delivered by XX/XX — hard contractual deadline] | [Client contract commitment] |
| Legal / Compliance | [Example: Personal data must not be stored outside Japan] | [APPI compliance] |
| Interface | [Example: API must remain backward-compatible with v2.x] | [Existing clients cannot upgrade yet] |
| Resource | [Example: Only 1 backend dev available this sprint] | [Resource constraint] |

## 3. Scope

### In scope
- [...]

### Out of scope
- [...]

## 4. Actors & Use Cases

| Actor | Use Case | Description |
|-------|----------|-------------|
| | | |

## 5. Business Rules

| ID | Rule | Notes |
|----|------|-------|
| BR-001 | | |

## 6. Main Business Flow (Happy Path)

1. [Step 1]
2. [Step 2]

## 7. Alternative Flows & Exceptions

| Scenario | Handling |
|----------|----------|
| | |

## 8. Acceptance Criteria

_Given/When/Then format is encouraged for testability._

- [ ] AC-001: Given [...] When [...] Then [...]
- [ ] AC-002: Given [...] When [...] Then [...]

## 9. Non-functional Requirements

_Each NFR must have a measurable criterion. "Fast" is not a criterion — "p95 < 300ms" is._

| NFR-ID | Category | Criterion | Priority |
|--------|----------|-----------|----------|
| NFR-001 | Performance | [Example: API response p95 < 300ms at 100 concurrent users] | Must Have |
| NFR-002 | Security | [Example: All endpoints authenticated via JWT; token expires after 1 hour] | Must Have |
| NFR-003 | Availability | [Example: Uptime >= 99.5% per month; RTO < 30 minutes] | Must Have |
| NFR-004 | Scalability | [Example: System handles 5x current traffic without architectural changes] | Should Have |
| NFR-005 | Maintainability | [Example: Code coverage >= 80%; cyclomatic complexity <= 10 per function] | Should Have |
| NFR-006 | Compatibility | [Example: Support Chrome >= 90, Safari >= 14, Firefox >= 88] | Could Have |

_Priority: Must Have / Should Have / Could Have / Won't Have (MoSCoW)_

## 10. User Stories

| ID | Name | Priority | Estimate |
|----|------|----------|----------|
| US-001 | | | |

## 11. Open Questions

| ID | Question | Owner | Deadline | Status |
|----|----------|-------|----------|--------|
| Q-001 | | | | Open |

## 12. Harness Delta

_Record any framework gaps or friction discovered during this task — missing template fields, unclear gates, repeated friction._

- [ ] No friction detected in this task
- [ ] [Describe friction if any → add to `docs/improvement-backlog.md`]

## 13. Q&A History

_Append-only — each clarification round adds a new entry below. Do NOT overwrite. Preserved for audit trail when Japanese clients ask "why was this decision made?" months later._

### Round 1 — [YYYY-MM-DD HH:mm JST]

**Q1**: [Question]  
**Options**: A: [...] / B: [...] / C: [...]  
**Suggested**: [A/B/C]  
**Answer**: [User's choice]  
**Impact**: [Which spec sections were updated as a result — e.g., BR-002, AC-003]

**Q2**: ...

<!-- Round 2 will be appended below when the next clarification round occurs -->

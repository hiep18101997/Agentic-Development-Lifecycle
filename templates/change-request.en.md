---
crId: CR-[NNN]
projectId: [PROJECT-XXX]
createdAt: [YYYY-MM-DD HH:mm JST]
status: Draft  # Draft | Submitted | Under Review | Approved | Rejected | Implemented
lang: en
---

# Change Request Document — CR-[NNN]

**Title**: [Short name of the change]
**Change Type**: Addition / Modification / Removal
**Requested By**: [Name — client-side or internal]
**Date Created**: [YYYY-MM-DD]
**Prepared By**: [Name]
**Business Impact**: High / Medium / Low

---

## 1. Change Description

[Detailed description of what needs to change — WHAT is being changed]

## 2. Reason / Background

[WHY the change is needed — current problem, client requirement, or user feedback]

## 3. Affected Functionality

| Screen / Module | Impact Type | Description |
|-----------------|-------------|-------------|
| [Name] | Modification / Addition / Removal | [...] |

## 4. Technical Impact Analysis

| Area | Impact | Details |
|------|--------|---------|
| Database / Schema | Yes / No | [...] |
| API / Endpoints | Yes / No | [...] |
| UI / Screens | Yes / No | [...] |
| Integration / External System | Yes / No | [...] |
| Security / Auth | Yes / No | [...] |
| Performance | Yes / No | [...] |

## 5. Effort Estimate

**Dev**: [X person-days / X hours]
**QA**: [X person-days / X hours]
**Review & Deploy**: [X person-days]
**Total**: [X person-days]

## 6. Risks and Mitigations

| Risk | Level | Mitigation |
|------|-------|-----------|
| [...] | High / Medium / Low | [...] |

## 7. Deployment Plan

**Target Date**: [YYYY-MM-DD]
**Sprint**: Sprint [N]
**Prerequisites**: [Dependencies, required approvals]

## 8. Acceptance Criteria

- [ ] AC-001: [Specific, testable condition]
- [ ] AC-002: [...]

## 9. Expected Benefits

[Expected benefits after the change is implemented]

## 10. Related Documents

- Original spec: `docs/tasks/[TASK-ID]/requirements.md`
- Analysis: `docs/tasks/[TASK-ID]/analysis.md`
- Issue: #[issue-number]

---

## Approval History

| Date | Person | Role | Decision | Notes |
|------|--------|------|----------|-------|
| [YYYY-MM-DD] | [Name] | BE / PM / Client | Approved / Rejected / Pending | [...] |

---
<!-- Template version: 1.0 | Use /be-changerequest to generate CRs automatically -->

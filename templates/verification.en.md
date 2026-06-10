---
taskId: [TASK-ID]
createdAt: [YYYY-MM-DD HH:mm JST]
verifiedBy: [Name]
signOffStatus: Pending | Pass | Fail | Conditional Pass
lang: en
---

# Verification: [TASK-ID] — [Task Name]

**Task ID**: [PROJECT-XXX]  
**Dev self-test**: [Name]  
**Verified on**: [YYYY-MM-DD]  
**Status**: Pending / Pass / Fail / Conditional Pass

---

## Acceptance Criteria Results

| AC-ID | Description | Test method | Result | Notes |
|-------|-------------|-------------|--------|-------|
| AC-001 | [...] | Automated / Manual | Pass / Fail | [...] |
| AC-002 | [...] | Automated / Manual | Pass / Fail | [...] |

---

## Automated Tests

```
[Test command]
```

**Results**:
- Unit tests: [N passed / N failed]
- Integration tests: [N passed / N failed]
- Coverage: [X%]

---

## Manual Test Steps

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | [...] | [...] | [...] | Pass/Fail |
| 2 | [...] | [...] | [...] | Pass/Fail |

**Test environment**: [staging / local / dev]  
**Test data**: [Description of data used for testing]  
**Test account**: [If applicable — do not paste credentials, only describe account type]

---

## Issues Found During Testing

| ID | Description | Severity | Action |
|----|-------------|----------|--------|
| | | | |

---

## Sign-off

- [ ] **Dev self-review**: Code meets all AC
- [ ] **QA review** (if applicable): [Name] — [YYYY-MM-DD]
- [ ] **BA acceptance** (if required): [Name] — [YYYY-MM-DD]

**Sign-off notes**: [Conditions or exceptions accepted, if any]

---
<!-- Created by /dev-implement. After pass, run /dev-pr to create PR. -->

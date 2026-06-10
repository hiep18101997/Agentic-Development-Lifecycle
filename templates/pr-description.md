---
templateId: pr-description
version: "1.0"
lang: vi
---
<!-- lang: vi -->

## [TASK-ID] [Mô tả ngắn gọn thay đổi]

### Type of change

- [ ] Bug fix (non-breaking change — fixes an issue)
- [ ] New feature (non-breaking change — adds functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Refactor (code change with no functional effect)
- [ ] Documentation update
- [ ] Tech debt / dependency update

### Summary

<!-- 2-3 câu: WHAT thay đổi và WHY. Đủ để reviewer hiểu ngữ cảnh mà không cần đọc spec. -->

### Links

- Closes #[issue-number]
- Spec: `docs/tasks/[TASK-ID]/requirements.md`
- Analysis: `docs/tasks/[TASK-ID]/analysis.md`

### Acceptance Criteria

- [x] AC-001: [Mô tả] — verified by `[test file / manual step]`
- [x] AC-002: [Mô tả] — verified by `[...]`
- [ ] AC-003: [Not done — reason, will be addressed in issue #XXX]

### Changes

| File | Type | Description |
|------|------|-------------|
| `src/[file]` | Modified | [...] |
| `src/[file]` | Added | [...] |
| `src/[file]` | Deleted | [...] |

### How to Test

**Automated**:
- [ ] Unit tests pass: `[test command]`
- [ ] Integration tests pass: `[test command]`

**Manual verification**:
<!-- Steps to manually verify the change. Include test data, environment, test accounts if applicable. -->
1. [Step 1]
2. [Step 2]
3. Expected result: [...]

### Breaking Changes

<!-- None / Or describe specifically: endpoint X changed response format, field Y now required... -->

### Database Changes

<!-- None / Migration: [migration filename] — [description] -->

### Notes for Reviewer

<!-- 
- Important design decisions and rationale
- Areas needing closest review
- Known limitations or intentionally accepted tech debt
-->

### Release Notes Summary

<!-- One-line description for release notes (as it should appear to end users / customers) -->

### Docs to Update After Merge

- [ ] `docs/screens/[feature]/screen.md` — [describe change]
- [ ] `docs/api/[domain]/[endpoint].md` — [describe change]

<!-- Run /docs-update after merge to sync baseline docs -->

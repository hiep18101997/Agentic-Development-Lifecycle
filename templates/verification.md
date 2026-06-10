---
taskId: [TASK-ID]
createdAt: [YYYY-MM-DD HH:mm JST]
verifiedBy: [Name]
signOffStatus: Pending | Pass | Fail | Conditional Pass
lang: vi
---

# Verification: [TASK-ID] — [Tên Task]

**Task ID**: [PROJECT-XXX]  
**Dev tự test**: [Name]  
**Ngày verify**: [YYYY-MM-DD]  
**Trạng thái**: Pending / Pass / Fail / Conditional Pass

---

## Kết quả Acceptance Criteria

| AC-ID | Mô tả | Test method | Kết quả | Ghi chú |
|-------|-------|-------------|---------|---------|
| AC-001 | [...] | Automated / Manual | Pass / Fail | [...] |
| AC-002 | [...] | Automated / Manual | Pass / Fail | [...] |

---

## Automated Tests

```
[Test command]
```

**Kết quả**:
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
**Test data**: [Mô tả data đã dùng để test]  
**Test account**: [Nếu có — không paste credential, chỉ ghi tên account type]

---

## Issues phát hiện khi test

| ID | Mô tả | Severity | Hành động |
|----|-------|----------|-----------|
| | | | |

---

## Sign-off

- [ ] **Dev self-review**: Code đáp ứng tất cả AC
- [ ] **QA review** (nếu có): [Name] — [YYYY-MM-DD]
- [ ] **BA acceptance** (nếu cần): [Name] — [YYYY-MM-DD]

**Ghi chú sign-off**: [Điều kiện hoặc exceptions được chấp nhận, nếu có]

---
<!-- Tạo bởi /dev-implement. Sau khi pass, chạy /dev-pr để tạo PR. -->

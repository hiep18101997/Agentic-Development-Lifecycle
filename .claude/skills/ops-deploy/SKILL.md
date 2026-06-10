---
name: ops-deploy
description: >
  Tạo deployment checklist đầy đủ, CI quality gate, và rollback plan trước khi deploy.
  Trigger khi: user nói "chuẩn bị deploy", "deployment checklist", "release lên production",
  "deploy staging", "deploy plan", "CI gate trước release", hoặc gõ /ops-deploy.
---

# Skill: /ops-deploy
**Role**: DevOps / Developer  
**Mục đích**: Checklist và hướng dẫn deployment, đảm bảo không bỏ sót bước quan trọng.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Thu thập thông tin deployment

```
## Tôi sẽ tạo deployment checklist.

Cho tôi biết:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Deploy lên môi trường nào? | A: Staging / B: Production / C: DR / D: Khác: ___ |
| 2 | Có database migration không? | A: Có / B: Không / C: Khác: ___ |
| 3 | Có config/env var thay đổi không? | A: Có — vars: ___ / B: Không / C: Khác: ___ |
| 4 | Có service dependency nào thay đổi? | A: Có — service: ___ / B: Không / C: Khác: ___ |
| 5 | Deployment window? | _(điền thời gian — có maintenance window không?)_ |
| 6 | Rollback plan nếu xảy ra sự cố? | _(mô tả)_ |
```

### CI Quality Gate (phải pass trước khi deploy)

```
- [ ] Lint / format check
- [ ] Type check  
- [ ] Unit tests pass
- [ ] Build thành công
- [ ] Integration tests pass
- [ ] Security scan: không có Critical/High CVE mới
```

**Ask First**: Nếu bất kỳ check nào fail → không deploy. Phải fix trước.

### Bước 2 — Tạo Deployment Checklist

```markdown
# Deployment Checklist: [Release version/feature]

**Date**: [Date]  
**Environment**: [Staging/Production]  
**Deploy by**: [Name]  
**Reviewer**: [Name]

---

## Pre-deployment

### Code & Build
- [ ] PR đã được merge và CI pass
- [ ] Build artifact đã được verify trên Staging
- [ ] Version tag đã được tạo: `v[X.Y.Z]`

### Database
- [ ] Migration scripts đã được review
- [ ] Migration đã chạy thành công trên Staging
- [ ] Backup database production trước khi deploy
- [ ] Migration có rollback script chưa?

### Configuration
- [ ] Env vars mới đã được add vào production config
- [ ] Secret/credential đã được update (nếu có)
- [ ] Feature flags đã được set đúng

### Dependencies
- [ ] Service dependencies đã được notify (nếu breaking change)
- [ ] Third-party API quota đã được check
- [ ] Infrastructure đã scale up nếu cần

### Communication
- [ ] Stakeholder đã được thông báo về deployment
- [ ] Maintenance window đã được announce (nếu cần)
- [ ] On-call engineer đã sẵn sàng

---

## Deployment Steps

1. [ ] [Bước 1 — cụ thể theo project]
2. [ ] [Bước 2]
3. [ ] Verify health check endpoint
4. [ ] Monitor error rate 5 phút sau deploy

---

## Post-deployment Verification

- [ ] Smoke test: [Test case quan trọng nhất]
- [ ] API health check pass
- [ ] Error rate < [threshold]%
- [ ] Response time < [X]ms
- [ ] Logs không có ERROR unexpected

---

## Rollback Plan

**Trigger rollback khi**: [Điều kiện cụ thể]

**Bước rollback**:
1. [Bước rollback 1]
2. [Bước rollback 2]

**Ước tính thời gian rollback**: [X phút]

---

## Sign-off

- [ ] Deploy engineer: [Name] — [Time]
- [ ] QA verify: [Name] — [Time]
```

### Bước 3 — Gate cuối

```
Deployment checklist đã chuẩn bị xong.

Trước khi bắt đầu deploy:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Database backup đã được confirm chưa? | A: Đã backup / B: Chưa — cần backup trước / C: Không có DB / D: Khác: ___ |
| 2 | Rollback estimate [X phút] — có đủ trong deployment window không? | A: Đủ / B: Không đủ — cần extend window / C: Khác: ___ |
| 3 | Có dependency service nào chưa được notify không? | A: Tất cả đã notify / B: Còn service: ___ / C: Khác: ___ |
```

**Không deploy cho đến khi tất cả câu hỏi trên được trả lời.**

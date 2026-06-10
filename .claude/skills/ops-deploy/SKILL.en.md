---
name: ops-deploy
description: >
  Create a comprehensive deployment checklist, CI quality gate, and rollback plan before deploying.
  Triggers when: user says "prepare deploy", "deployment checklist", "release to production",
  "deploy staging", "deploy plan", "CI gate before release", or types /ops-deploy.
---

# Skill: /ops-deploy
**Role**: DevOps / Developer  
**Purpose**: Checklist and deployment guide, ensuring no important steps are missed.

---

## Execution Guide

### Step 1 — Gate: Gather deployment information

```
## I will create a deployment checklist.

Tell me:

| # | Question | Options |
|---|---------|---------|
| 1 | Which environment are we deploying to? | A: Staging / B: Production / C: DR / D: Other: ___ |
| 2 | Is there a database migration? | A: Yes / B: No / C: Other: ___ |
| 3 | Are there config/env var changes? | A: Yes — vars: ___ / B: No / C: Other: ___ |
| 4 | Are there any service dependency changes? | A: Yes — service: ___ / B: No / C: Other: ___ |
| 5 | Deployment window? | _(enter time — is there a maintenance window?)_ |
| 6 | Rollback plan if something goes wrong? | _(describe)_ |
```

### CI Quality Gate (must pass before deploying)

```
- [ ] Lint / format check
- [ ] Type check  
- [ ] Unit tests pass
- [ ] Build succeeds
- [ ] Integration tests pass
- [ ] Security scan: no new Critical/High CVE
```

**Ask First**: If any check fails → do not deploy. Must fix first.

### Step 2 — Create Deployment Checklist

```markdown
# Deployment Checklist: [Release version/feature]

**Date**: [Date]  
**Environment**: [Staging/Production]  
**Deploy by**: [Name]  
**Reviewer**: [Name]

---

## Pre-deployment

### Code & Build
- [ ] PR has been merged and CI passes
- [ ] Build artifact has been verified on Staging
- [ ] Version tag has been created: `v[X.Y.Z]`

### Database
- [ ] Migration scripts have been reviewed
- [ ] Migration ran successfully on Staging
- [ ] Back up production database before deploying
- [ ] Does the migration have a rollback script?

### Configuration
- [ ] New env vars have been added to production config
- [ ] Secrets/credentials have been updated (if any)
- [ ] Feature flags have been set correctly

### Dependencies
- [ ] Service dependencies have been notified (if breaking change)
- [ ] Third-party API quota has been checked
- [ ] Infrastructure has been scaled up if needed

### Communication
- [ ] Stakeholders have been notified about the deployment
- [ ] Maintenance window has been announced (if needed)
- [ ] On-call engineer is ready

---

## Deployment Steps

1. [ ] [Step 1 — specific to project]
2. [ ] [Step 2]
3. [ ] Verify health check endpoint
4. [ ] Monitor error rate 5 minutes after deploy

---

## Post-deployment Verification

- [ ] Smoke test: [Most important test case]
- [ ] API health check passes
- [ ] Error rate < [threshold]%
- [ ] Response time < [X]ms
- [ ] Logs have no unexpected ERROR

---

## Rollback Plan

**Trigger rollback when**: [Specific conditions]

**Rollback steps**:
1. [Rollback step 1]
2. [Rollback step 2]

**Estimated rollback time**: [X minutes]

---

## Sign-off

- [ ] Deploy engineer: [Name] — [Time]
- [ ] QA verify: [Name] — [Time]
```

### Step 3 — Final gate

```
Deployment checklist is ready.

Before starting the deployment:

| # | Question | Options |
|---|---------|---------|
| 1 | Has the database backup been confirmed? | A: Backed up / B: Not yet — need to backup first / C: No DB / D: Other: ___ |
| 2 | Rollback estimate [X min] — is it sufficient within the deployment window? | A: Sufficient / B: Not enough — need to extend window / C: Other: ___ |
| 3 | Are there any dependency services that haven't been notified? | A: All notified / B: Still need to notify: ___ / C: Other: ___ |
```

**Do not deploy until all questions above have been answered.**

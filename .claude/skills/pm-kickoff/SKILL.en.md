---
name: pm-kickoff
description: >
  Bootstrap a new project from scratch (greenfield): choose tech stack, create folder structure,
  customize CLAUDE.md, initialize docs structure and sprint 0 checklist.
  Trigger when: user says "bắt đầu dự án mới", "kickoff project", "greenfield project",
  "setup dự án từ đầu", "project mới cho khách JP", "khởi tạo framework mới",
  "start new project", "new greenfield project", "project for JP client",
  "init new framework", or type /pm-kickoff.
---

# Skill: /pm-kickoff
**Role**: PM / Tech Lead / Bridge Engineer  
**Purpose**: Bootstrap a greenfield project — from idea to a structured project with docs and team ready for sprint 1.

---

## Project Context

Greenfield project differs from brownfield:
- No `ba-reverse` — no existing codebase to read
- Tech stack decisions must be made upfront — affects everything downstream
- JP clients typically expect 基本設計書 before coding begins
- Sprint 0 = environment setup + architecture decisions + initial docs

---

## Execution Guide

### Step 1 — Gate: Collect project information

Use the `AskUserQuestion` tool:

- **Project type**: Web app / Mobile app / API / Microservice / Library / Other
- **Client**: JP outsource / Internal / Other
- **Timeline**: First deadline (format YYYY-MM-DD JST)
- **Team size**: Number of devs / QA / BE

**Wait for confirmation.**

### Step 2 — Analyze requirements and propose tech stack

Based on input from Step 1 and project context, propose:

```
## Proposed Tech Stack: [Project name]

### Option A: [Stack name] — [Main trade-off]
| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | [...] | [...] |
| Backend | [...] | [...] |
| Database | [...] | [...] |
| Cache | [...] | [...] |
| CI/CD | [...] | [...] |
| Hosting | [...] | [...] |

**Best when**: [...]
**Trade-off**: [...]

### Option B: [Stack name] — [Main trade-off]
[Similar]

### Option C: [Stack name] — [Main trade-off]
[Similar]
```

**Wait for confirmation on tech stack.**

### Step 3 — Gate: Architecture decisions

After selecting the tech stack, confirm initial architecture decisions:

```
## Architecture Decisions to Confirm

| # | Decision | Option A | Option B | Recommend |
|---|---------|----------|----------|-----------|
| 1 | Auth strategy | JWT stateless | Session-based | JWT (scales better) |
| 2 | API style | REST | GraphQL | REST (JP clients more familiar) |
| 3 | DB schema | Monolithic | Multi-tenant | [depends on project] |
| 4 | Deployment | Monorepo | Multi-repo | Monorepo (small team) |
| 5 | Logging | Structured JSON | Plain text | Structured JSON |

Each decision will be recorded in an ADR afterward.
```

**Wait for confirmation.**

### Step 4 — Create Project Structure

Create the following files (using Write tool):

#### 4a. Update/create `CLAUDE.md` for the specific project

Add a "Project Context" section to CLAUDE.md:

```markdown
## Project Context

**Project name**: [Name]
**Client**: [JP client name]
**Bridge Engineer**: [Name]
**PM**: [Name]
**Repo**: [URL]
**Staging**: [URL]
**Production**: [URL]

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| [...] | [...] | [...] |

### Conventions for this project

- [Naming convention]
- [Branch naming: feature/TASK-XXX-slug]
- [Commit message format]
- [Code review policy]

### ENV Variables (required)

| Variable | Purpose | Source |
|----------|---------|--------|
| DATABASE_URL | DB connection | 1Password / team lead |
| [...] | [...] | [...] |
```

#### 4b. Create docs structure

```
docs/
  tasks/          (gitignored in framework source, tracked in project)
  baseline/
    codebase-overview.md  (empty — fill in after sprint 1-2)
  decisions/
    ADR-001.md    (Tech Stack decision)
    ADR-002.md    (Auth strategy)
    ...
  screens/        (fill when design is ready)
  api/            (fill when API spec is ready)
  reports/        (release notes, sprint status)
  handover/       (fill when needed)
  workflows/
    sprint-lifecycle.md  (copy from framework)
    role-guide.md        (copy from framework)
```

#### 4c. Create ADRs for decisions from Step 3

For each confirmed decision, call `/arch-adr` or create directly:

```markdown
# ADR-001: [Decision title]

**Date**: [YYYY-MM-DD]
**Status**: Accepted
**Decision makers**: [Tech Lead + PM]

## Context
[Why this decision was needed]

## Decision
[Which option was chosen and why]

## Consequences
[What needs to be done next as a result of this decision]
```

### Step 5 — Sprint 0 Checklist

```
## Sprint 0 Checklist: [Project name]

### Environment Setup
- [ ] Repo created and team added
- [ ] Branch protection rules (main, develop)
- [ ] CI/CD pipeline working (lint + test + build)
- [ ] Staging environment up
- [ ] ENV variables documented (not values — source of truth)
- [ ] Database schema initialized

### Documentation
- [ ] CLAUDE.md customized for the project
- [ ] ADRs for tech stack decisions written
- [ ] Glossary JP-VN-EN seeded with project-specific terms
- [ ] 基本設計書 draft sent to JP (if JP client)

### Process
- [ ] GitHub Issues template setup
- [ ] Sprint board created
- [ ] Team onboarding doc (README or CLAUDE.md)
- [ ] Contact matrix (JP client + BE + VN PM + dev team)

### Technical
- [ ] Linting rules configured
- [ ] Test framework setup (at least 1 test runs)
- [ ] Logging format agreed upon
- [ ] Error handling pattern agreed upon
```

### Step 6 — Final gate

```
## Project Kickoff Complete: [Project name]

Created:
- Customized CLAUDE.md
- ADR-001 through ADR-[N] for confirmed decisions
- docs/ structure with proper folders
- Sprint 0 checklist

| # | Question | Choice |
|---|---------|--------|
| 1 | Does the tech stack need any adjustments? | A: No / B: Yes — adjustment: ___ / C: Other: ___ |
| 2 | Do we need to create a 基本設計書 to send to JP before coding starts? | A: Yes — run /be-bridge next / B: Not needed / C: Other: ___ |
| 3 | When does Sprint 1 start? | _(Enter date YYYY-MM-DD)_ |

Next steps:
- [ ] Team walk-through CLAUDE.md
- [ ] If JP client: /be-bridge to create 基本設計書
- [ ] Sprint 1: /pm-breakdown to create tasks from requirements
```

---

## Rules

- Tech stack decisions must have an ADR — no implicit decisions
- ENV variables: NEVER commit actual values — only document names and sources
- If JP client: 基本設計書 must be completed and JP-approved before sprint 1
- CLAUDE.md project section must be updated when team/tech changes occur

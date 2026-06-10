---
name: pm-handover
description: >
  Create a comprehensive project handover package (引き継ぎ): codebase map, decision log,
  glossary, open issues, contact matrix. Use when a dev leaves the team, project is transferred,
  or a JP outsource contract ends.
  Trigger when: user says "bàn giao dự án", "tạo tài liệu handover", "引き継ぎ",
  "dev nghỉ cần handover", "chuyển giao project", "project handoff",
  "project handover", "handover documents", "transfer project",
  "dev leaving handover", or type /pm-handover.
---

# Skill: /pm-handover
**Role**: PM / Bridge Engineer / Tech Lead  
**Purpose**: Create a comprehensive project handover package — sufficient for a new person to take over without needing to ask the old team.

---

## Project Context

Handover in the JP outsource model has 2 scenarios:
- **Dev leaves mid-project**: handover to a new dev within the same VN team
- **Contract ends**: handover back to the JP client or a new vendor

JP handover documents (引き継ぎ書) must be clear enough for the JP client to understand without needing a phone call.

---

## Execution Guide

### Step 0 — Load glossary

Read `templates/jp-vn-en-glossary.md` before writing any technical terms.

### Step 1 — Gate: Determine handover type

Use the `AskUserQuestion` tool:

- **Type**: Internal (dev to dev within VN team) / Client handover (handover back to JP client) / Vendor handover (transfer to new vendor)
- **Scope**: Full project / A specific module / A specific role (dev / QA / BE)
- **Deadline**: When does it need to be completed?

**Wait for confirmation.**

### Step 2 — Collect project information

Read available sources in parallel:

```
Sources to read:
- docs/baseline/codebase-overview.md (if available)
- docs/decisions/ADR-*.md — all ADRs
- docs/tasks/*/requirements.md — open/in-progress tasks
- docs/workflows/sprint-lifecycle.md
- templates/jp-vn-en-glossary.md
- git log --oneline -50 (recent history)
- git branch -a (active branches)
```

If `codebase-overview.md` is missing → suggest running `/ba-reverse` first.

### Step 3 — Create Handover Package

#### 3a. `docs/handover/[DATE]-handover.md` (Internal — for VN team)

Create using template `templates/handover.en.md`.

Fill in all 7 sections:
1. **System Overview**: purpose, key features, users; tech stack; environments table (Production/Staging/Dev URLs)
2. **Current Status**: version, known issues/tech debt table (from `docs/improvement-backlog.md`), in-progress tasks
3. **Key Contacts**: complete contact matrix for all roles; note that credentials are stored separately
4. **Systems and Tools**: every tool the new person needs access to — platform, account type, access notes
5. **Recurring Tasks Schedule**: all recurring obligations by frequency (daily/weekly/monthly) with times in JST
6. **Operational Notes**: gotchas list, common incidents with resolution steps, rollback procedure
7. **Additional Documents**: table of all key doc paths

#### 3b. `docs/handover/[DATE]-引き継ぎ書.md` (Japanese — when handing over to JP client)

Create using template `templates/handover.ja.md`.

This is a formal Japanese deliverable. Use `templates/html-bilingual.html` if an HTML version is needed for email forwarding.
Ensure:
- All section headings in Japanese (template already provides these)
- 敬語 (honorific language) in all descriptive text
- Credentials: document WHERE to get them, never inline
- Timing references in JST

### Step 4 — Completion checklist

```
## Handover Package has been prepared.

Checklist:
- [ ] All ENV variables listed (no empty sections)
- [ ] Contact matrix complete — especially JP side contacts
- [ ] Open tasks and blockers clearly documented
- [ ] Setup instructions are testable (new person can follow without asking)
- [ ] Known issues documented with severity and resolution approach
- [ ] Credentials: source documented, DO NOT write actual values

Files created:
- docs/handover/[DATE]-handover.md (VN — commit)
- docs/handover/[DATE]-引き継ぎ書.md (JP — commit, if client handover)

Confirm to finalize?
```

**Wait for confirmation.**

### Step 5 — Conclusion

```
Handover package complete.

Suggested next steps:
- Schedule a handover meeting — the person handing over walks through the document
- The recipient shadows for 1-2 sprints before fully owning
- After handover meeting: update documents based on Q&A
```

---

## Rules

- Do not assume the recipient already knows the context — explain everything as if starting fresh
- Credentials: NEVER write directly into the document
- JP deliverable: use honorific language (敬語) in Japanese documents
- After merge, update `docs/workflows/role-guide.md` if the contact matrix changes

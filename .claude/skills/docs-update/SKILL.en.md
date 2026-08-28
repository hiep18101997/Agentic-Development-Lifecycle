---
name: docs-update
description: >
  Update Baseline Docs (screen + API) after a task has been verified and merged. The final step of every task.
  Triggers when: user says "update docs", "update baseline", "task done need doc update",
  "sync docs after merge", "update screen doc", "update API doc", or types /docs-update.
---

# Skill: /docs-update
**Role**: Developer / QA (after verification)  
**Purpose**: Update Baseline Docs (screen + API) after a task has been verified and merged. This is the FINAL step of every task.

---

## Important

Baseline Docs are the **source of truth** for the team. Incorrect updates = technical debt.  
This skill always proposes changes for human review, never overwrites automatically.

---

## Execution Guide

### Step 1 — Spawn subagent: diff-reader

Spawn subagent to read:
- `git diff [base-branch]..HEAD -- docs/` — have docs already changed?
- `git diff [base-branch]..HEAD -- [src/]` — what code changed?
- `docs/tasks/[TASK-ID]/requirements.md` — original spec

```
Agent(
  description: "Map merged code changes to baseline docs that need updating",
  prompt: "Read git diff and spec, return docs impact per agents/diff-reader.md spec.\n\nGIT DIFF:\n[git diff base-branch..HEAD]\n\nSPEC PATH: docs/tasks/[TASK-ID]/requirements.md\n\nBASELINE DOCS TO CHECK: [list docs/screens/ and docs/api/ files related to this task]",
  model: "haiku"
)
```

Subagent returns: list of changes that need to be reflected in docs.

### Step 1b — Spawn subagent: doc-updater

After receiving output from diff-reader, spawn doc-updater to create proposals:

```
Agent(
  description: "Propose specific content changes for each baseline doc",
  prompt: "Create update proposals per agents/doc-updater.md spec.\n\nDIFF READER OUTPUT:\n[JSON từ diff-reader]\n\nCURRENT DOC CONTENT:\n[Nội dung hiện tại của từng file trong docs_update_needed]\n\nCHANGES SUMMARY:\n[changes_summary từ diff-reader]",
  model: "sonnet"
)
```

### Step 2 — Gate: Confirm update scope

```
## Task [TASK-ID] has been verified and merged.

I analyzed the code changes and identified docs that need updating:

**Screen docs to update**:
- `docs/screens/[feature]/screen.md` — [reason: new field / flow change / ...]

**API docs to update**:
- `docs/api/[domain]/[endpoint].md` — [reason: response format change / new endpoint / ...]

**No update needed**:
- [Docs files not affected]

| | Options |
|---|---------|
| A | No, that's sufficient |
| B | Yes — missed docs: ___ |
| C | Other: ___ |
```

### Step 3 — Propose specific update content

For each file that needs updating, show a clear diff:

```
## Proposed update: docs/screens/[feature]/screen.md

### Additions:
[New content]

### Changes:
~~[Old content]~~ → [New content]

### Deletions:
~~[Content to remove because it's no longer accurate]~~
```

**Template reference**:
- Screen docs follow `templates/baseline-screen.en.md` — update only the changed sections
- API docs follow `templates/baseline-api.en.md` — update only the changed fields/behaviors

### Step 4 — Gate: Review each file

```
For each proposed file update:

| # | Question | Options |
|---|---------|---------|
| 1 | Is the new content accurate? | A: Accurate / B: Wrong — fix: ___ / C: Other: ___ |
| 2 | Is there any other information that needs updating that I missed? | A: No / B: Yes — add: ___ / C: Other: ___ |
| 3 | Is the description clear enough? | A: Clear enough / B: Needs more clarity — where: ___ / C: Other: ___ |
```

**Wait for confirmation before writing the file.**

### Step 5 — After applying

Before writing any doc file, get the current HEAD commit (must be post-merge — if not merged, this is the feature branch HEAD):

```bash
git log -1 --format="%h %s"   # short-sha + commit message
```

Use the result to fill in the metadata fields of each updated doc:
- `**Last updated**: [YYYY-MM-DD HH:mm JST]` — timestamp when skill was run
- `**Updated by task**: [TASK-ID]`
- `**Commit**: \`[short-sha]\` — [commit message]`

Update `docs/tasks/[TASK-ID]/verification.md` (using `templates/verification.en.md` if creating from scratch):

Add to the **Docs Updated** section in the verification file:
- [x] `docs/screens/[feature]/screen.md` — [summary of change]
- [x] `docs/api/[domain]/[endpoint].md` — [summary of change]

Update status to "Pass" if all docs are confirmed accurate.

```
Task [TASK-ID] is fully complete:
✅ Code merged
✅ Baseline docs updated
✅ Verification doc saved

Full task doc at: docs/tasks/[TASK-ID]/
```

---

## Doc update principles

- Docs describe **current behavior**, not history
- Delete outdated information, do not comment it out
- If behavior changes significantly → consider creating an ADR (`/arch-adr`)
- Conflict between code and docs → code is the source of truth, update docs to match code

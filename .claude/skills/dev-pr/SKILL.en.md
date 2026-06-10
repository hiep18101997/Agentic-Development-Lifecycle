---
name: dev-pr
description: >
  Create a standardized PR description from code changes, verify AC coverage, link task docs.
  Triggers when: user says "tạo PR", "viết PR description", "chuẩn bị pull request",
  "create PR", "soạn mô tả PR", or types /dev-pr.
---

# Skill: /dev-pr
**Role**: Developer  
**Purpose**: Create a standardized PR description from code changes, link to task docs, and update baselines.

---

## Ask First Gates (stop before creating PR if any apply)

> Full list + rationale: `assets/ask-first-gates.md`

If the PR contains any sensitive changes from the list above → flag it clearly in Gate 2 and wait for senior confirmation.

---

## Execution Guide

### Step 0 — Gate: Verify review

Check that `docs/tasks/[TASK-ID]/verification.md` exists and contains a line like `review: approved` (or equivalent).

If no evidence of `/dev-review` having run is found → use `AskUserQuestion`:
- **Question**: Has `/dev-review` been run and approved?
- Options: `Approved — continue` / `Not yet — run /dev-review first`

If the user chooses not yet → stop, guide them to run `/dev-review` first.

**Wait for confirmation.**

---

### Step 1 — Read context

Determine the base branch in order: user provides in command → `git remote show origin` → ask the user.

Spawn a subagent to read:
- `git diff <BASE_BRANCH>..HEAD` — what changed
- `docs/tasks/[TASK-ID]/analysis.md` — the selected option
- `docs/tasks/[TASK-ID]/requirements.md` — ACs to verify
- `docs/tasks/[TASK-ID]/verification.md` — self-test results (if available)

```
Agent(
  description: "Read git diff and map changes to AC coverage",
  prompt: "Read the git diff and spec, return AC coverage per agents/diff-reader.md spec.\n\nGIT DIFF:\n[git diff <BASE_BRANCH>..HEAD]\n\nBASE_BRANCH: <determined branch name>\n\nSPEC PATH: docs/tasks/[TASK-ID]/requirements.md\n\nBASELINE DOCS TO CHECK: [list relevant docs/screens/ and docs/api/ files]",
  model: "haiku"
)
```

The subagent returns: summary of changes, files changed, AC coverage, test results (if any).

### Step 2 — Gate: Confirm coverage

```
## I read the code changes and see:

**Files changed**: [N files]
**AC coverage**:
- ✅ AC-001: [Covered by file X]
- ✅ AC-002: [Covered by file Y]
- ⚠️ AC-003: [Not sure if covered — needs clarification]

**Tests**:
- Unit tests: [Yes/No/Partial]
- Integration tests: [Yes/No]

| # | Question | Options |
|---|---------|---------|
| 1 | AC-003 — is this covered? | A: Yes — in file: ___ / B: Not covered / C: N/A / D: Other: ___ |
| 2 | Are there any breaking changes to note in the PR? | A: No / B: Yes — describe: ___ / C: Other: ___ |
| 3 | Who should review this PR? | _(enter username)_ |
```

### Step 3 — Create PR Description

Create PR description using template `templates/pr-description.en.md`.

Fill in all sections from the diff-reader output and AC coverage data:
- **Summary**: 2-3 sentences from the context
- **Links**: issue number, spec path, analysis path
- **Acceptance Criteria**: from requirements.md, mark each [x] with test evidence
- **Changes table**: from diff-reader file list
- **How to Test**: from verification.md T-steps (manual verification steps T-01...T-N)
- **Breaking Changes**: from Gate 2 answers
- **Notes for Reviewer**: from Gate 2 answers
- **Release Notes Summary**: 1-line description for the changelog
- **Docs to Update**: from verification.md docs list

### Step 3b — PR Comment Resolver (opt-in)

If the PR already has review comments from a reviewer (re-review cycle), ask:

```
## Are there review comments to resolve?

| | Choice |
|---|--------|
| A | Yes — spawn pr-resolver agent to analyze and propose fixes |
| B | No — skip this step |
```

**If A is selected**, spawn subagent:

```
Agent(
  description: "pr-resolver: analyze review comments and propose fixes",
  prompt: "[per agents/pr-resolver.md input contract]\n\nPR NUMBER: [N]\nCOMMENTS: [paste from GitHub/GitLab]\nDIFF CONTEXT: [summarized git diff main..HEAD]",
  model: "sonnet"
)
```

Present results from pr-resolver — blocking comments first, sorted by priority.

**Wait for confirmation on each blocking item before implementing fixes.**

### Step 4 — Final Gate

```
PR description has been drafted.

| # | Question | Options |
|---|---------|---------|
| 1 | Anything to add to "Notes for Reviewer"? | A: Not needed / B: Add: ___ / C: Other: ___ |
| 2 | Which docs need updating after merge? | A: None / B: Screen docs — path: ___ / C: API docs — path: ___ / D: Other: ___ |
| 3 | Should commits be squashed before merging? | A: Yes / B: Not needed / C: Other: ___ |

After the PR is approved and merged, please run /docs-update to update baseline docs.
```

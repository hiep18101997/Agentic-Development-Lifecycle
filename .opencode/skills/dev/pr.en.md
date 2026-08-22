---
name: dev:pr
description: >
  Create a standard PR description from code changes, verify AC coverage, link task docs.
  Triggers when: user says "tạo PR", "viết PR description", "chuẩn bị pull request",
  "create PR", "soạn mô tả PR", or types /dev:pr.
---

# /dev:pr
**Role**: Developer  
**Purpose**: Create a standard PR description from code changes, link to task docs, and update baselines.

---

## Ask First Gates (stop before creating PR if any apply)

> Full list + rationale: `assets/ask-first-gates.md`

If the PR contains any sensitive changes from the list above → flag them clearly in Gate 2 and wait for senior confirmation.

---

## Execution Guide

### Step 0 — Gate: Check review status

Find `docs/tasks/[TASK-ID]/review-log-R[N].md` with the highest N (the latest round — `/dev:review` always writes this file regardless of verdict). If it exists, read `Meta.verdict`:
- `approve` or `approve-with-fixes` → review passed, continue to Step 1
- `request-changes` → stop, tell the user there are unresolved `B-xx` blocking items — re-run `/dev:review` first

If NO `review-log-R*.md` file exists at all → use the `question` tool:

question({
  questions: [{
    question: "Has /dev:review been run and approved?",
    header: "Reviewed?",
    options: [
      { label: "Approved", description: "Continue creating PR" },
      { label: "Not yet", description: "Run /dev:review first" },
    ]
  }]
})

If the user selects "Not yet" → stop, guide them to run `/dev:review` first.

**Wait for confirmation.**

---

### Step 1 — Read context

Determine the base branch in this order: user provides it in the command → `git remote show origin` → ask the user.

Spawn a subagent to read:

task(
  description: "Read git diff and map changes to AC coverage",
  prompt: "Read the git diff and spec, return AC coverage per agents/diff-reader.md spec.\n\nGIT DIFF:\n[git diff <BASE_BRANCH>..HEAD]\n\nBASE_BRANCH: <tên branch đã xác định>\n\nSPEC PATH: docs/tasks/[TASK-ID]/requirements.md\n\nBASELINE DOCS TO CHECK: [list relevant docs/screens/ and docs/api/ files]",
  subagent_type: "explorer"
)

Subagent returns: summary of changes, files changed, AC coverage, test results (if any).

### Step 2 — Gate: Confirm coverage

Use the `question` tool:

question({
  questions: [{
    question: "Are all ACs fully covered?",
    header: "AC Coverage",
    options: [
      { label: "All covered", description: "All ACs are covered" },
      { label: "Missing some", description: "Some ACs not covered" },
      { label: "Breaking change", description: "Needs to be noted in PR" },
    ]
  }, {
    question: "Who should review this PR?",
    header: "Reviewers",
    options: [
      { label: "Team lead", description: "Review by tech lead" },
      { label: "Peer", description: "Review by teammate" },
    ]
  }]
})

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

If the PR already has review comments from a reviewer (re-review cycle), use the `question` tool:

question({
  questions: [{
    question: "Are there review comments to resolve?",
    header: "Comments?",
    options: [
      { label: "Yes", description: "Spawn pr-resolver agent to analyze and propose fixes" },
      { label: "No", description: "Skip this step" },
    ]
  }]
})

**If Yes is selected**, spawn subagent:

task(
  description: "pr-resolver: analyze review comments and propose fixes",
  prompt: "[theo agents/pr-resolver.md input contract]\n\nPR NUMBER: [N]\nCOMMENTS: [paste từ GitHub/GitLab]\nDIFF CONTEXT: [git diff main..HEAD tóm tắt]",
  subagent_type: "oracle"
)

Present results from pr-resolver — blocking comments first, sorted by priority.

**Wait for confirmation on each blocking item before implementing fixes.**

### Step 4 — Final gate

Use the `question` tool:

question({
  questions: [{
    question: "PR description is ready. Anything to add?",
    header: "Final check",
    options: [
      { label: "Ready", description: "PR description OK, create PR" },
      { label: "Add notes", description: "Need to add Notes for Reviewer" },
      { label: "Update docs", description: "Need to note docs to update after merge" },
    ]
  }]
})

After the PR is approved and merged, run `/docs:update` to update baseline docs.

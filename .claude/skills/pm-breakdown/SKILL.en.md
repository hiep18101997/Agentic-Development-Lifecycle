---
name: pm-breakdown
description: >
  Break down Epics/User Stories into concrete Tasks with estimates, create standard GitHub/GitLab Issues.
  Trigger when: user says "breakdown epic", "tạo tasks từ story", "phân rã feature",
  "tạo github issues", "tạo gitlab issues", "sprint planning", "estimate tasks",
  "create tasks from story", "generate issues", or type /pm-breakdown.
---

# Skill: /pm-breakdown
**Role**: Project Manager  
**Purpose**: Break down Epics/User Stories into concrete Tasks, create GitHub/GitLab Issues with standard templates.

---

## Execution Guide

### Step 1 — Read input

Receive: Epic description, User Stories, or direct request from PM.  
Read `docs/tasks/[TASK-ID]/requirements.md` if available.

### Step 2 — Gate: Clarify before breakdown

Use the `AskUserQuestion` tool with the following questions:

- **Platform**: Which platform do you use to create issues?
  - `GitHub (gh CLI / MCP)` — use `gh issue create` or GitHub MCP tools
  - `GitLab (glab CLI)` — use `glab issue create`
  - `Generate markdown only` — do not auto-create issues

- **Capacity**: How many devs in this sprint and what's the capacity (人日 or story points)?

- **Milestone**: Is there a specific milestone/deadline? (to attach to issues)

- **Labels**: What label convention is the team using? (e.g., `backend`, `flutter`, `P0`, `testing`)

**Wait for confirmation.**

### Step 3 — Propose task breakdown (2-3 options)

```
## I have [N] breakdown options:

### Option A: [Name] — [Main advantage]
[Task list with estimate]
- Pros: [...]
- Cons: [...]

### Option B: [Name] — [Main advantage]  
[Task list with estimate]
- Pros: [...]
- Cons: [...]

**My recommendation**: Option [X] because [reason].  
Which option would you like, or a combination?
```

### Step 4 — Create GitHub Issue format

After PM confirms, create issue content using template `templates/github-issue.en.md`.

Fill in all fields:
- **TASK-ID** and task name from the breakdown
- **Type**: Feature / Bug / Tech Debt / Refactor
- **Priority**: High / Medium / Low (decided in Step 3)
- **Estimate**: from confirmed estimate
- **Sprint**: current Sprint N
- **Acceptance Criteria**: from the task's requirements.md
- **Technical Notes**: key technical points for developers
- **Labels**: per the team convention selected in Step 2

### Step 5 — Final gate before creation

Use the `AskUserQuestion` tool:

- **Review list**: List [N] prepared issues — which issues need priority or estimate adjustment?
- **Dependencies**: Is there an order dependency between issues?
- **Confirm creation**: Create all, or select individual issues?

**Wait for confirmation.**

---

### Step 6 — Create issues on the platform

#### If GitLab chosen (`glab` CLI)

Check if `glab` is authenticated:
```bash
glab auth status
```

Create each issue by template (run sequentially, not batch):
```bash
glab issue create \
  --title "[TASK-ID] Task name" \
  --description "$(cat <<'EOF'
## Description
[Task description]

## Links
- Spec: docs/tasks/[TASK-ID]/requirements.md

## Acceptance Criteria
- [ ] AC-001: ...
- [ ] AC-002: ...

## Definition of Done
- [ ] Code complete + unit tests pass
- [ ] Code review approved
- [ ] Demo to BA/PM
EOF
)" \
  --label "P0,backend,flutter" \
  --assignee "username" \
  --milestone "Sprint N"
```

After each successful issue creation, print the issue URL for confirmation:
```
✅ Issue created successfully: https://gitlab.com/[org]/[repo]/-/issues/[number]
```

If `glab` is not installed or not authenticated, provide guidance:
```bash
# Install glab
brew install glab          # macOS
# or: https://gitlab.com/gitlab-org/cli#installation

# Auth
glab auth login
```

#### If GitHub chosen (`gh` CLI or MCP)

Use `gh issue create`:
```bash
gh issue create \
  --title "[TASK-ID] Task name" \
  --body "$(cat issue-body.md)" \
  --label "P0,backend" \
  --assignee "username" \
  --milestone "Sprint N"
```

Or use GitHub MCP tool `mcp__github__issue_write` if available in the session.

#### If markdown-only chosen

Output file `docs/tasks/sprint-[N]-issues.md` containing all issue content, ready for manual paste.

---

## Notes

- Each issue must be self-contained: a developer should understand it immediately without asking follow-up questions.
- Always use relative repo paths when linking to docs.
- Task ID format: `[PROJECT-XXX]` — customize per team convention.
- `glab` must be authenticated with a token that has `api` scope on the GitLab project.
- For GitLab self-hosted: set `GITLAB_HOST` or use `glab auth login --hostname gitlab.your-company.com`.

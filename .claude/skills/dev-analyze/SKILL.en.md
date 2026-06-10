---
name: dev-analyze
description: >
  Analyze task/issue and propose 2-3 implementation options with trade-offs. Uses multi-agent to keep context clean.
  Triggers when: user says "analyze task", "phân tích issue", "xem có cách nào làm",
  "đề xuất phương án", "implementation options", or types /dev-analyze.
---

# Skill: /dev-analyze
**Role**: Developer  
**Purpose**: Analyze task/issue and propose implementation options. Uses multi-agent to keep context clean.

---

## Brain Dump Pattern (input contract)

Before running this skill, the dev should provide the following context block to reduce hallucination:

```
Tech stack: [language, framework, DB, infra]
Relevant files: [known relevant file paths]
Constraints: [performance, security, backward compat, deadline]
Known gotchas: [known issues in the codebase]
Issue/Task: [link or paste content]
```

If there is insufficient context, the skill will ask before continuing.

---

## Multi-Agent Architecture

This skill orchestrates subagents to keep context clean:

```
dev-analyze (orchestrator)
├── [Subagent 1] task-reader    → parse issue → structured understanding
├── [Subagent 2] code-scout     → find relevant code (read-only)
└── [Subagent 3] planner        → synthesize → propose options
```

Each subagent receives **only the necessary context** and returns compressed results.

## How to spawn subagents

Use the **Agent tool** to spawn each subagent. Prompts must be self-contained — do not pass full conversation history.

Example spawning task-reader:
```
Agent(
  description: "Parse GitHub issue into structured JSON",
  prompt: "Read this issue and return structured JSON per agents/task-reader.md spec.\n\nISSUE CONTENT:\n[paste issue content here]",
  model: "haiku"
)
```

Example spawning code-scout:
```
Agent(
  description: "Find relevant files for auth task",
  prompt: "Find files relevant to this task. Return JSON per agents/code-scout.md spec.\n\nTASK SUMMARY: [summary]\nTECH STACK: [stack]\nAFFECTED AREAS: [areas]",
  model: "haiku"
)
```

Example spawning planner:
```
Agent(
  description: "Synthesize task + code map into implementation options",
  prompt: "Create 2-3 implementation options per agents/planner.md spec.\n\nTASK: [task-reader JSON]\nCODE MAP: [code-scout JSON]\nCONSTRAINTS: [from Gate 1]",
  model: "sonnet"
)
```

---

## Execution Guide

### Step 0 — Risk Classification

Before spawning any subagent, classify risk according to `docs/risk-classifier.md`:

```
## Risk Classification — [TASK-ID]

**Input type**: [new-spec | spec-slice | change-request | maintenance | new-initiative | framework-improvement]
**Risk checklist**: [list only YES items — e.g.: R-06 ✅ (shared config)]
**Lane**: tiny | normal | high-risk
**Reason**: [1 sentence]
```

- **Tiny lane** → skip this entire skill, patch directly
- **High-risk lane** → stop immediately, show `⚠️ Ask First Gate`, wait for senior confirmation before continuing
- **Normal lane** → continue to Step 1 below

### Step 1 — Spawn Subagent: task-reader

Spawn subagent with the following task:
> "Read the following issue/task and return structured JSON:
> - task_id, title, type (feature/bug/refactor)
> - business_goal (why this is needed)
> - acceptance_criteria (list)
> - technical_hints (if present in the issue)
> - unknowns (what is not yet clear)
> 
> Issue content: [paste issue content]"

The subagent receives ONLY the issue content, not the codebase context.

### Step 2 — Gate 1: Confirm task understanding

```
## I read task [TASK-ID] and understand the following:

**Goal**: [business goal]
**Type**: [Feature/Bug/Refactor]
**Acceptance Criteria**:
  - AC-001: [...]
  - AC-002: [...]

**Unclear points**:
  - [?] [Unclear point 1]
  - [?] [Unclear point 2]

Before I scan the codebase, please confirm:

| # | Question | Options |
|---|---------|---------|
| 1 | Do I understand the goal correctly? | A: Yes / B: No — correct it: ___ / C: Other: ___ |
| 2 | Are there any constraints not mentioned in the issue? | A: No / B: Yes — constraint: ___ / C: Other: ___ |
| 3 | Are there any screen/API docs I should read first? | A: Not needed / B: Yes — link/path: ___ / C: Other: ___ |
```

**Wait for confirmation.**

### Step 3 — Spawn Subagent: code-scout

After receiving confirmation, spawn subagent with the following task:
> "Search the codebase for files/modules related to: [task summary].
> Return:
> - file_path:line_number for each relevant point
> - Short description of why that file is relevant
> - Current patterns/conventions to follow
> 
> READ only, do not modify anything."

The subagent receives the task summary + file patterns to search, not the full conversation history.

### Step 4 — Gate 2: Confirm code map

```
## I found the following relevant files:

| File | Line | Why relevant |
|------|------|--------------|
| [path] | [N] | [...] |

**Current conventions**:
- [Pattern 1]
- [Pattern 2]

| # | Question | Options |
|---|---------|---------|
| 1 | Did I miss any important files? | A: No / B: Yes — file: ___ / C: Other: ___ |
| 2 | Are there any modules to AVOID touching in this task? | A: No / B: Yes — module: ___ / C: Other: ___ |
```

**Wait for confirmation.**

### Step 5 — Spawn Subagent: planner

Spawn subagent with:
> "Based on:
> - Task: [summary]
> - AC: [list]
> - Relevant files: [file map]
> - Constraints: [from Gate 1]
> 
> Propose 2-3 implementation options with trade-offs.
> Each option includes: name, description, files to change, estimate, pros/cons."

### Step 5.5 — Parallel Design Stubs (if planner identifies artifact types)

Based on the planner output, spawn parallel design agents **in a single message** (runs concurrently):

- **If the task involves new or modified screens** → spawn `screen-designer` (model: haiku) per `agents/screen-designer.md`
- **If the task involves new or modified API endpoints** → spawn `api-designer` (model: haiku) per `agents/api-designer.md`
- **If the task has no screens or APIs** → skip this step and continue to Step 6

Each agent receives:
```
TASK SUMMARY: [task-reader JSON summary]
SELECTED OPTION: [name + description of the planner's top recommended option]
AFFECTED SCREENS / AFFECTED APIS: [from planner output or code-scout]
EXISTING DOCS: [content from docs/screens or docs/api if available]
```

Merge the agents' output into `docs/tasks/[TASK-ID]/analysis.md` under dedicated sections:
- `## Screen Design Stub` — from screen-designer output
- `## API Design Stub` — from api-designer output

These stubs give the human richer context when selecting an option in Step 6.

```
✓ Design stubs generated:
  - Screen: [N] screens — [name list]
  - API: [N] endpoints — [method + path list]
  See details in analysis.md before choosing an option.
```

---

### Step 6 — Gate 3: Present options (MOST IMPORTANT)

```
## I have [N] implementation options:

### Option A: [Name] — [Key characteristic]
**Description**: [...]
**Files to change**:
  - `[file]` — [reason]
**Estimate**: [X hours]
**Pros**: [...]
**Cons**: [...]
**Risk**: [...]

### Option B: [Name]
[similar]

### Option C: [Name] (if applicable)
[similar]

---
**My recommendation**: Option [X] because [specific reason].

Before you choose, I need to ask:

| # | Question | Options |
|---|---------|---------|
| 1 | [Question about constraints affecting the choice] | _(fill in)_ |
| 2 | Priority: speed vs maintainability? | A: Prioritize delivery speed / B: Prioritize maintainability / C: Balance both / D: Other: ___ |

**Which option would you like to choose?**

| | Choice |
|---|--------|
| A | Option A |
| B | Option B |
| C | Option C |
| D | Other: ___ |
```

**Wait for human to select an option.**

### Step 6.5 — Render HTML companion (option comparison)

Before the human chooses in Step 6, generate `docs/tasks/[TASK-ID]/analysis-compare.html` from the template `templates/html-artifact.html`:

- Inject `<table id="options" data-sortable>` with columns: Option | Effort (h) | Risk | Files touched | Pros | Cons
- One row per option, Effort column uses `data-type="number"` for sorting
- Risk rendered using `<span class="pill pill-ok|warn|err">` (Low/Med/High)
- Each option has a `<details>` expand for the full description

The HTML file is a one-shot review artifact — do NOT commit (`.gitignore` already covers `docs/tasks/**/*.html`).

```
✓ Generated `docs/tasks/[TASK-ID]/analysis-compare.html`
  Open in browser to sort/filter before deciding.
```

### Step 7 — Create Task Doc

After the human selects, create `docs/tasks/[TASK-ID]/analysis.md`:

```markdown
# Analysis: [TASK-ID]

## Selected option: [Name]
**Reason**: [from discussion]

## Files to change
| File | Change type | Notes |
|------|-------------|-------|
| | | |

## Options considered and why they were not chosen
- Option A: [reason not chosen]
- Option B: [reason not chosen]

## Open remaining questions
- [ ] [Question if any]
```

```
## Analysis complete ✓

`docs/tasks/[TASK-ID]/analysis.md` has been saved.

**STOP HERE.** Do not automatically implement.

Please review `analysis.md`, then use `/dev-implement` to start coding.
```

**Wait for human to trigger `/dev-implement`.**  
Do not start implementing on your own even if the user seems to agree.

---

## Notes for orchestrator

- Each subagent receives the minimum context needed
- Do not pass full conversation history into subagents
- Results from subagents are summarized before being used for the next subagent
- If a subagent returns too many files (>20), request further filtering

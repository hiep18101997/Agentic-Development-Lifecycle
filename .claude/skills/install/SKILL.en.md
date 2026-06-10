---
name: install
description: >
  Install the Agentic Development Lifecycle framework into the current project — copy commands, agents, templates, workflows.
  Does not use shell, only Glob/Read/Write tools.
  Triggers when: user says "install framework", "install skill pack", "setup ADL framework",
  "copy commands into project", or types /install.
---

# Skill: /install
**Purpose**: Install the framework into the current project. Uses Claude file tools (no shell) to avoid permission classifier blocking.

---

## Input

No arguments needed. The skill auto-detects:
- **Source**: the directory containing this framework (where `/install/SKILL.md` lives = `[SOURCE]/.claude/skills/`)
- **Target**: the current working directory of the Claude Code session

---

## Execution Guide

### Step 0 — Determine paths

Use Glob/Read to find:
- Source root: parent directory 2 levels up from this file (`../../` from this file's location)
- Target root: `$PWD` of the current session (from working directory)

Display for user confirmation:
```
Source : [SOURCE_PATH]
Target : [TARGET_PATH]
```

**Wait for "y" confirmation before proceeding.**

### Step 1 — Copy `.claude/skills/`

Use Glob to list all files in `[SOURCE]/.claude/skills/**/SKILL*.md`. Skills are flat folders, each containing SKILL.md (VN) + SKILL.en.md + SKILL.ja.md.

For each file:
- Compute target path: `[TARGET]/.claude/skills/[relative_path]`
- If target file already exists → report `[SKIP]`, do not overwrite
- If it does not exist → use Read + Write to copy

Report each file: `[OK]` or `[SKIP]`.

### Step 2 — Copy `agents/`

Glob `[SOURCE]/agents/*.md`. Copy each file to `[TARGET]/agents/`.  
Skip if already exists.

### Step 3 — Copy `templates/`

Glob ALL files in `[SOURCE]/templates/` (both `.md` and `.html`). Copy each file to `[TARGET]/templates/`.  
Skip if already exists.

### Step 4 — Copy `docs/workflows/`

Glob `[SOURCE]/docs/workflows/*.md`. Copy to `[TARGET]/docs/workflows/`.  
Skip if already exists.

### Step 4b — Copy framework doc files

For each file:
- `docs/risk-classifier.md`
- `docs/validation-matrix.md`

Read from `[SOURCE]/docs/[FILE]`, Write to `[TARGET]/docs/[FILE]`.  
Skip if target already exists.

### Step 4c — Copy `docs/improvement-backlog.md` (user-mutable)

ONLY copy if `[TARGET]/docs/improvement-backlog.md` does NOT already exist.  
This file is updated by the user after tasks — NEVER overwrite for any reason.

### Step 4d — Copy `docs/analysis/`

Glob `[SOURCE]/docs/analysis/*.md`. Copy to `[TARGET]/docs/analysis/`.  
Skip if file already exists.

### Step 5 — Create empty doc dirs

Check and create (if not present) `.gitkeep` files in:
- `[TARGET]/docs/api/.gitkeep`
- `[TARGET]/docs/screens/.gitkeep`
- `[TARGET]/docs/tasks/.gitkeep`
- `[TARGET]/docs/decisions/.gitkeep`

Use Write tool with empty content.

### Step 6 — Copy `CLAUDE.md`

- If `[TARGET]/CLAUDE.md` already exists → report `[SKIP] CLAUDE.md already exists — merge manually`, print source path for reference
- If not → Read + Write

---

## Installation Report

```
## Installation Results

.claude/skills/               [OK/SKIP per file]
agents/                       [OK/SKIP]
templates/                    [OK/SKIP] (md + html)
docs/workflows/               [OK/SKIP]
docs/ (framework files)       [OK/SKIP] (risk-classifier, validation-matrix)
docs/improvement-backlog.md   [OK/SKIP]
docs/analysis/                [OK/SKIP]
docs/ (empty dirs)            [OK/SKIP] (api, screens, tasks, decisions)
CLAUDE.md                     [OK/SKIP]

Next steps:
1. Open CLAUDE.md, update the "Project Context" section (project name, client, repo URL, tech stack)
2. Type / to see available commands: /pm-ideate  /ba-spec  /dev-analyze  /qa-testplan ...
```

---

## Notes

- This skill does NOT use PowerShell/Bash — only Glob, Read, Write tools from Claude Code
- Do not overwrite existing files — always Skip and inform the user to merge manually
- `docs/improvement-backlog.md` is user-mutable — never overwrite even if the user requests a re-install
- If working directory = source directory → report an error, do not install

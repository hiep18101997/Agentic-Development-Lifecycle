---
name: docs-project
description: >
  Sync project-level documentation: README, workflow guides, install guides, install scripts, CLAUDE.md.
  Unlike /docs-update (baseline screen/API after task), this skill is for project-level docs.
  Triggers when: user says "update README", "update install guide", "fix workflow guide",
  "update install script", "update CLAUDE.md", "sync project docs", or types /docs-project.
---

# Skill: /docs-project
**Role**: Developer / Tech Lead / DevOps  
**Purpose**: Sync all project-level documentation (README, guides, install scripts, CLAUDE.md) with the actual state of the codebase.

---

## Distinction from /docs-update

| Skill | Used for | Trigger |
|-------|----------|---------|
| `/docs-update` | Baseline screen + API docs after task verification | After each task merge |
| `/docs-project` | README, workflow, install, CLAUDE.md | When project undergoes major changes |

---

## Execution Guide

### Step 1 — Determine scope

Read the following files to understand the current state:
- `README.md` (or `README.vi.md` if it exists)
- `CLAUDE.md`
- `docs/workflows/*.md`
- `bin/install.js`, `setup.sh`, `setup.ps1` (if they exist)
- `package.json` (scripts, version, dependencies)
- `pubspec.yaml` (if Flutter project)
- `.claude/settings.json`

Use the `AskUserQuestion` tool to ask:

- **Update type**: Which parts do you want to update?
  - `README` — intro content, quick start, badges
  - `Workflow guides` — docs/workflows/*.md (sprint lifecycle, role guide)
  - `Install scripts` — bin/install.js, setup.sh, setup.ps1
  - `CLAUDE.md` — skill commands, directory structure, project context
  - `All` — scan everything and suggest what's outdated

- **Source of changes**: Where are the changes coming from?
  - New code/feature just merged
  - New skill commands added
  - Team/process changes
  - Onboarding new developer (needs full review)

**Wait for confirmation.**

---

### Step 2 — Audit: Find outdated content

For each file in scope, compare current content with reality:

**README audit checklist:**
- [ ] Are version numbers / badges still correct?
- [ ] Are the quick start steps executable? (test each command)
- [ ] Is the prerequisites list missing any new tools?
- [ ] Are screenshots/demos outdated?
- [ ] Are links to docs still valid?

**CLAUDE.md audit checklist:**
- [ ] Does the skill commands table include all 22+ skills?
- [ ] Does the directory structure match `ls .claude/skills/`?
- [ ] Is the subagent table in `agents/` accurate?
- [ ] Does the Project Context need a project name / repo URL update?

**Workflow guides audit checklist:**
- [ ] `docs/workflows/sprint-lifecycle.md` — is the process still accurate?
- [ ] `docs/workflows/role-guide.md` — are there new roles not yet added?
- [ ] Do workflows reference any renamed skill commands?

**Install scripts audit checklist:**
- [ ] `bin/install.js` — does the files-to-copy list include all new skills?
- [ ] `setup.sh` / `setup.ps1` — are dependency versions correct?
- [ ] Do `package.json` scripts reflect the correct install workflow?
- [ ] Does the `npx` command in README work?

---

### Step 3 — Propose changes

For each file that needs updating, present in the following format:

```
## 📄 [File name]

**Issues found:**
- [Description of outdated / incorrect / missing content]

**Proposed changes:**

--- CURRENT ---
[Content to delete/change]

--- PROPOSED ---
[New content]

**Reason:** [Brief explanation of why the change is needed]
```

If a new section needs to be added (not a modification): present the full new content and suggest where to insert it.

**Wait for confirmation on each file before applying.**

---

### Step 4 — Gate: Review each change

Use the `AskUserQuestion` tool for each file:

- **Proposed content**: Is it accurate and complete?
- **Tone/language**: Appropriate for the audience (internal developer / end user / JP client)?
- **Anything missed?**

**Wait for confirmation before writing the file.**

---

### Step 5 — Apply and verify

After the user confirms, apply each change:

1. **Edit files** — use the Edit tool, do not rewrite the entire file unless necessary
2. **Verify links** — check internal links (relative paths) after editing
3. **Verify install script** — if `bin/install.js` changed, check the `FILES_TO_COPY` list:
   ```bash
   node bin/install.js --dry-run 2>/dev/null || echo "dry-run not supported, review manually"
   ```
4. **Check README quick start** — if quick start commands changed, verify syntax is correct

---

### Step 6 — Create commit

After all files have been updated and verified:

```bash
git add README.md CLAUDE.md docs/workflows/ bin/install.js setup.sh setup.ps1
git status
```

Suggest commit message following convention:

```
docs: sync project docs for [feature/change name]

- README: [summary of changes]
- CLAUDE.md: [summary of changes]  
- docs/workflows/: [summary of changes]
- bin/install.js: [summary of changes]
```

**Ask the user before committing** — do not auto-commit.

---

### Step 7 — Notify team (optional)

If changes affect the onboarding flow (install script, README quick start), suggest:

- Create a GitLab/GitHub issue to notify the team to re-install
- Post to the relevant Slack/Teams channel
- If it's a breaking change in the `npx` install: bump version in `package.json`

---

## Principles

- **Do not auto-commit** — always show the diff and wait for confirmation
- **Edit, don't rewrite** — keep content that's correct, only fix what's wrong
- **Verify after editing** — especially for install scripts and links
- **Be audience-aware** — README for end users differs from CLAUDE.md for AI
- **Vietnamese for internal documentation** — README can be bilingual if there are JP clients

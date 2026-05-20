# Contributing to Agentic Development Lifecycle

Thanks for your interest. This guide covers how to add skills, fix bugs, and submit PRs.

---

## Quick start

```bash
git clone https://github.com/hiepdnh/Agentic-Development-Lifecycle.git
cd Agentic-Development-Lifecycle
npm install
```

No build step — skill files are plain Markdown.

---

## Repository layout

```
.claude/commands/       # Claude Code skills (VN + .en.md EN variants)
.opencode/skills/       # OpenCode skills (VN + .en.md EN variants)
agents/                 # Subagent definitions spawned by orchestrator skills
templates/              # Skeleton templates referenced by skills
bin/CLAUDE.lite.md      # Drop-in CLAUDE.md used by `--lite` minimal install
tests/skill-triggering/ # Trigger test prompts + test scripts
bin/install.js          # npm installer
```

---

## Adding a new skill

Every skill ships in **4 files**:

| File | Platform | Language |
|------|----------|----------|
| `.claude/commands/<role>/<name>.md` | Claude Code | Vietnamese |
| `.claude/commands/<role>/<name>.en.md` | Claude Code | English |
| `.opencode/skills/<role>/<name>.md` | OpenCode | Vietnamese |
| `.opencode/skills/<role>/<name>.en.md` | OpenCode | English |

### Claude Code skill anatomy

```markdown
---
name: role:command
description: >
  One-line description. Used for auto-triggering.
  Trigger khi: user nói "...", hoặc gõ /role:command.
---

# Skill: /role:command
**Role**: Developer
**Mục đích**: What this skill does.

## Step 1 — ...

**Chờ confirm.**
```

### OpenCode skill differences

- Header: `# /role:command` (no "Skill:" prefix)
- Spawn agents: `task(subagent_type: "explorer"|"oracle")` not `Agent(model:)`
- Gate tool: `question` not `AskUserQuestion`
- EN variant: `Triggers when:` not `Trigger khi:`

### Rules

- Every skill must have **at least 1 human gate** (`**Chờ confirm.**` / `**Wait for confirm.**`)
- `name` in frontmatter must match file path (`role:command`)
- `description` drives auto-trigger — include natural-language phrases users would type

---

## Adding test prompts

For each new skill, add prompt files to `tests/skill-triggering/prompts/`:

```
tests/skill-triggering/prompts/<role>-<name>.txt       # VN Claude Code
tests/skill-triggering/prompts/<role>-<name>.en.txt    # EN Claude Code
tests/skill-triggering/opencode-prompts/<role>-<name>.txt     # VN OpenCode
tests/skill-triggering/opencode-prompts-en/<role>-<name>.txt  # EN OpenCode
```

Filename convention: first hyphen becomes colon → `ba-spec.txt` tests `ba:spec`.

Run tests:

```bash
# Claude Code
bash tests/skill-triggering/run-all.sh
bash tests/skill-triggering/run-all.sh --filter ba-*

# OpenCode (validates prompt→file mapping)
pwsh tests/skill-triggering/opencode-run-all.ps1
```

Requires: `claude` CLI authenticated + `jq` installed.

---

## Updating the installer

When adding skills, update `bin/install.js` if new directories need to be copied. The installer uses `copyDir()` — add a new step following the existing pattern.

Test the installer from a separate directory:

```bash
mkdir /tmp/test-install && cd /tmp/test-install
npx agentic-development-lifecycle --yes
```

---

## Submitting a PR

1. Fork → create branch `feat/<name>` or `fix/<name>`
2. Make changes — 4 files per new skill (VN + EN × Claude Code + OpenCode)
3. Add test prompts
4. Verify installer still works
5. Open PR against `main`

PR description should list:
- Which skills added/modified
- Whether EN variants are included
- Whether OpenCode variants are included
- Test prompt files added

---

## Commit style

```
feat(skill): add /role:command — short description
fix(skill): fix VN phrases in role:command.en.md
docs: update README install commands
chore: bump version to x.x.x
```

---

## Publishing (maintainers only)

```bash
# Bump version in package.json, then:
npm publish --access public "--//registry.npmjs.org/:_authToken=$NPM_TOKEN"

# Create GitHub release
gh release create vX.X.X --title "vX.X.X — description" --notes "..."
```

---

## Questions

Open an [issue](https://github.com/hiepdnh/Agentic-Development-Lifecycle/issues) or start a [discussion](https://github.com/hiepdnh/Agentic-Development-Lifecycle/discussions).

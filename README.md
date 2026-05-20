# Agentic Development Lifecycle

<div align="right">
  <strong>🇬🇧 English</strong> &nbsp;|&nbsp; <a href="README.vi.md">🇻🇳 Tiếng Việt</a> &nbsp;|&nbsp; <a href="README.ja.md">🇯🇵 日本語</a>
</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/hiepdnh/Agentic-Development-Lifecycle/main/assets/banner.png" alt="Agentic Development Lifecycle" width="100%">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/agentic-development-lifecycle"><img src="https://img.shields.io/npm/v/agentic-development-lifecycle.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/agentic-development-lifecycle"><img src="https://img.shields.io/npm/dm/agentic-development-lifecycle.svg" alt="npm downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

> **32 skills for Claude Code, OpenCode, Cursor & Antigravity** — covering the full SDLC for teams building software with AI assistance.

---

## What is this?

An **AI skill pack** for software development teams. Install it into any project to get structured, role-aware skills that cover every phase of the sprint lifecycle.

Supports **Claude Code, OpenCode, Cursor, and Google Antigravity** — same skill source, different runtime targets (Cursor + Antigravity are transformed at install time from the canonical Claude Code source).

Works for any team that wants structured AI assistance — especially useful for outsource/consulting teams with client handoffs and multilingual deliverables.

---

## Quick Install

### Claude Code

```bash
# macOS / Linux — run from your target project directory
npx agentic-development-lifecycle --yes
```

```powershell
# Windows — run from your target project directory
npx agentic-development-lifecycle --yes
```

Update an existing install:

```bash
npx agentic-development-lifecycle --update --yes
```

### OpenCode

```bash
# macOS / Linux
npx agentic-development-lifecycle --yes --opencode
```

```powershell
# Windows
npx agentic-development-lifecycle --yes --opencode
```

### Cursor

```bash
npx agentic-development-lifecycle --yes --cursor
```

Generates `.cursor/rules/<role>/<name>.mdc` + `.cursorrules` (project context). Cursor Agent auto-attaches rules based on the `description` frontmatter. Single-agent runtime — multi-agent skills (e.g. `/dev:analyze`) execute inline.

### Antigravity

```bash
npx agentic-development-lifecycle --yes --antigravity
```

Generates `.antigravity/skills/` (ported from OpenCode source — `task()` / `question()` syntax) + `AGENTS.md` (project context).

What gets installed (all platforms): skills directory + `templates/` + `docs/workflows/` (and `agents/` for Claude Code only).

### Language filter

Install only the language variant you need:

```bash
npx agentic-development-lifecycle --yes --lang ja      # Japanese skills only
npx agentic-development-lifecycle --yes --lang en      # English skills only
npx agentic-development-lifecycle --yes --lang vi      # Vietnamese only (default source)
npx agentic-development-lifecycle --yes --lang all     # All variants (default)
```

When using `--lang ja` or `--lang en`, skills are installed **without the language suffix** — so `/ba:spec` not `/ba:spec.ja`. The Japanese skill file `ba/spec.ja.md` is installed as `ba/spec.md`, replacing the Vietnamese base. Files with no translated variant fall back to the Vietnamese base automatically.

### Developer Lite (minimal install)

Just want the developer workflow without PM/BA/QA/Ops overhead?

```bash
npx agentic-development-lifecycle --yes --lite
```

Installs only 8 skills: `/dev:analyze` `/dev:implement` `/dev:review` `/dev:pr` `/dev:debug` `/sec:review` `/arch:adr` `/docs:update` (Claude Code only). Combine with `--lang ja` or `--lang en` to pick a language. Upgrade to the full framework later with `npx agentic-development-lifecycle --update --yes`.

---

## Skill Commands

### Business Analysis

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/pm:ideate` | Refine vague idea → clear concept with problem statement + NOT Doing list | Rough idea → Concept doc |
| `/ba:spec` | Raw requirement → structured spec | Requirements → `requirements.md` |
| `/ba:user-story` | Spec → User Stories with AC | Spec → User Stories |
| `/ba:reverse` | Reverse engineer legacy codebase → baseline docs | Codebase → `docs/baseline/` |
| `/be:bridge` | Translate JP requirements, create bilingual JP-VN deliverables | JP req → VN spec + JP doc |
| `/be:changerequest` | 変更依頼 — impact analysis, approval trail, version control spec changes | CR → Impact analysis + JP doc |
| `/be:glossary` | Maintain JP↔VN↔EN glossary — add terms, resolve translation conflicts | New term → Glossary update |

### Project Management

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/pm:breakdown` | Epic/Stories → Tasks with estimates + GitHub/GitLab Issues | Epic → Issues |
| `/pm:status` | Sprint status report for stakeholders | Tasks → Status report |
| `/pm:dashboard` | Static HTML sprint dashboard (kanban + health + backlog) | `docs/tasks/*/` → HTML |
| `/pm:kickoff` | Bootstrap greenfield project: tech stack → ADRs → docs structure → sprint 0 checklist | Requirement → Project scaffold |
| `/pm:release` | Generate Release Notes / リリースノート from merged PRs + closed issues | PRs + Issues → Release Notes |
| `/pm:handover` | Create project handover package (引き継ぎ) — codebase map + decisions + contact matrix | Project → Handover package |
| `/pm:maintain` | Maintenance phase workflow: triage → fix → monthly report (月次保守報告書) | Incident → Fix + Report |

### Development

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/dev:analyze` | Task → 2-3 implementation options with trade-offs | Issue + codebase → `analysis.md` |
| `/dev:implement` | Implement file-by-file with human gates + verification + harness delta check | `analysis.md` → Code → `verification.md` |
| `/dev:review` | Holistic review after implement: code quality + architecture + security in one run | Diff + `analysis.md` → Review report → Approve / Request Changes |
| `/dev:pr` | Generate PR description | Code diff → PR description |
| `/dev:debug` | Structured debugging: reproduce → localize → fix | Bug report → Fix |

### Architecture

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/arch:review` | Design decision review | Design → Feedback |
| `/arch:adr` | Create Architecture Decision Record | Decision → `docs/decisions/ADR-NNN.md` |

### QA

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/qa:testplan` | Spec → Test plan | Spec → `test-plan.md` |
| `/qa:bug` | Standardized bug report | Bug info → Bug report |
| `/qa:regression` | Regression checklist before release | Release → Go/No-go checklist |

### DevOps

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/ops:deploy` | Deployment checklist + CI quality gate + rollback plan | Release → Checklist |
| `/ops:incident` | Incident triage + parallel investigation + RCA template | Incident → RCA |

### Security

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/sec:review` | Security review: Always check / Ask First / Never (OWASP Top 10) | Code → Security report |

### Documentation

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/docs:update` | Update baseline screen/API docs after task verify | Verified task → Updated docs |
| `/docs:project` | Sync project-level docs: README, workflow guides, CLAUDE.md | Changes → Updated project docs |

### Scrum

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/sm:standup` | Daily standup summary | Updates → Standup report |
| `/sm:retro` | Sprint retrospective | Sprint → Retro report |

---

## Templates & Artifacts

Every skill writes output to a structured template. All templates support **VN / EN / JP** variants (`name.md` / `name.en.md` / `name.ja.md`).

| Template | Artifact produced | Standard |
|----------|------------------|---------|
| `task-doc-requirements` | Requirements spec | IEEE 29148 (SRS) |
| `user-story` | User stories + Acceptance Criteria | Connextra / INVEST |
| `analysis` | Implementation options + trade-offs | — |
| `verification` | Test results + sign-off | IEEE 829 |
| `test-plan` | Test plan with TC matrix | IEEE 829 |
| `bug-report` | Bug report (Severity / Priority / Steps) | — |
| `adr` | Architecture Decision Record | MADR (Markdown Architectural Decision Records) |
| `pr-description` | Pull Request description | — |
| `github-issue` | GitHub / GitLab issue | — |
| `audit` | Append-only audit log per task | — |
| `change-request` | 変更依頼書 — impact analysis + approval trail | — |
| `release-notes` | Release Notes / リリースノート | Keep a Changelog |
| `handover` | 引き継ぎ書 — codebase map + contact matrix | — |
| `monthly-maintenance-report` | 月次保守報告書 | — |
| `incident-report` | Incident RCA + blameless postmortem | Google SRE / PagerDuty |
| `baseline-screen` | Screen spec / 画面定義書 | IPA 基本設計書 conventions (JP) |
| `baseline-api` | API spec / API定義書 | IPA API定義書 conventions (JP) |

JP variants include client-facing fields (`顧客名`, `プロジェクト名`, `対象システム`) and use formal 敬語 language where appropriate.

---

## How It Works

### Subagents (multi-agent pattern)

Heavy tasks spawn lightweight subagents to keep context clean:

| Agent | Used by | Claude Code | OpenCode | Purpose |
|-------|---------|-------------|----------|---------|
| `task-reader` | `/dev:analyze` | haiku | explorer | Parse issue → structured JSON |
| `code-scout` | `/dev:analyze` | haiku | explorer | Find relevant files |
| `planner` | `/dev:analyze` | sonnet | oracle | Synthesize options |
| `diff-reader` | `/dev:pr`, `/docs:update` | haiku | explorer | Map diff → AC coverage |
| `review-reader` | `/dev:review` | haiku | explorer | Parse diff → code/arch/security signals |
| `test-gen` | `/qa:testplan` | sonnet | oracle | Generate test cases |
| `doc-updater` | `/docs:update` | sonnet | oracle | Update baseline docs |
| `pr-resolver` | `/dev:pr` | sonnet | oracle | Analyze review comments → fixes |

### Human Gates

Every skill has at least 1 human gate — skills present options and **wait for your decision** before proceeding. No auto-execution.

- **Claude Code**: `AskUserQuestion` tool
- **OpenCode**: `question` tool

### Typical Workflows

<p align="center">
  <img src="https://raw.githubusercontent.com/hiepdnh/Agentic-Development-Lifecycle/main/assets/workflow.png" alt="Sprint Workflow" width="100%">
</p>

### Full sprint (end to end)

```
/pm:ideate → /ba:spec → /ba:user-story → /pm:breakdown

    ↓ (per task)

/dev:analyze → [review analysis.md] → /dev:implement
    → /dev:review → /dev:pr
```

### Developer flow (single task)

```
/dev:analyze → [review analysis.md] → /dev:implement → /dev:review → /dev:pr
```

> **`/dev:analyze`** classifies risk first (tiny / normal / high-risk), then stops after writing `analysis.md`. Review it, then trigger `/dev:implement` manually.  
> **`/dev:implement`** stops after writing `verification.md` (diff review + self-test results), then prompts a Harness Delta check. Then trigger `/dev:review` — 3-lens report (code quality, architecture, security). After Approve, trigger `/dev:pr`.

Full step-by-step: [`docs/workflows/sprint-lifecycle.md`](docs/workflows/sprint-lifecycle.md)  
Who uses which skill: [`docs/workflows/role-guide.md`](docs/workflows/role-guide.md)

---

## Two-tier Documentation

```
docs/
  tasks/          ← Type 1: Per-task (ephemeral, gitignored in framework source)
    TASK-001/
      requirements.md
      analysis.md
      test-plan.md
      verification.md
      audit.md        ← Append-only log of all skill runs + user input verbatim
  baseline/         ← Type 2: Baseline (living docs, updated after verify)
  screens/
  api/
  decisions/        ← ADRs
  workflows/        ← Process guides
```

**Type 1** (task docs): Created per issue, gitignored in this framework repo. Your project keeps them.  
**Type 2** (baseline docs): Updated after each verified task merge via `/docs:update`.

---

## Project Context

Designed for consulting/outsource teams with structured client communication:

- **Bridge Engineer** — translates client requirements → team spec (`/be:bridge`)
- **BA** — writes spec from clarified requirements (`/ba:spec`)
- **Dev** — implements with structured AI guidance, code comments in English
- **QA** — tests per spec, generates formatted test reports if needed
- **Deliverables** — 設計書, 単体テスト仕様書, 成果物 formatted for Japanese clients

---

## Project Structure

```
.claude/commands/         # 32 Claude Code slash command files (canonical source)
.opencode/skills/         # 32 OpenCode skill files (hand-ported — task()/question() syntax)
agents/                   # 8 subagent definitions (Claude Code only)
bin/
  install.js              # Interactive installer — flags: --opencode | --cursor | --antigravity
  transformers/
    cursor.js             # .claude/commands/*.md → .cursor/rules/*.mdc at install time
    antigravity.js        # .opencode/skills/ → .antigravity/skills/ alias
docs/
  workflows/              # Sprint lifecycle, role guide, flowchart
  decisions/              # ADR templates
templates/                # Skeleton templates referenced by all skills
setup.ps1                 # PowerShell installer (Claude Code)
setup.sh                  # Bash installer (Claude Code)
```

---

## Development

This repo IS the framework. The canonical source lives in `.claude/commands/` (32 files × 3 languages = 96 files). The `.opencode/skills/` tree is a hand-maintained port. Cursor and Antigravity targets are generated at install time by transformers in `bin/transformers/` — no separate source files to keep in sync.

### Test skill triggering

**Claude Code:**
```bash
bash tests/skill-triggering/run-all.sh
bash tests/skill-triggering/run-all.sh --verbose
bash tests/skill-triggering/run-all.sh --filter dev-*
```
Requires: `claude` CLI authenticated + `jq` installed.

**OpenCode:**
```powershell
pwsh tests/skill-triggering/opencode-run-all.ps1
pwsh tests/skill-triggering/opencode-run-all.ps1 -Verbose
pwsh tests/skill-triggering/opencode-run-all.ps1 -Filter "dev-*"
```
Validates prompt→skill file mapping. Full trigger validation requires an OpenCode session.

---

## License

MIT — Free to use and customize for your own projects.

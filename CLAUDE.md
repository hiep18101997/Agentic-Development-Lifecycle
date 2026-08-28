# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Agentic Development Lifecycle

Framework hỗ trợ toàn bộ SDLC cho mọi role. Dùng được cho bất kỳ team nào muốn AI assistance có cấu trúc.

---

## Developing This Framework

This repo IS the framework source. Two hand-maintained skill trees serve as canonical sources:

- `.claude/skills/` — Claude Code **Agent Skills** (35 skills × 3 langs = 105 `SKILL*.md` files). Each skill is a flat folder `.claude/skills/<role-command>/` holding `SKILL.md` (VN) + `SKILL.en.md` + `SKILL.ja.md`. Skills **auto-trigger** from their `description` frontmatter and can also be invoked explicitly as `/role-command` (e.g. `/ba-spec`).
- `.opencode/skills/` — OpenCode hand port (102 files) with `task()` / `question()` syntax, nested `<role>/<name>.md`, invoked as `role:command`.

Cursor, Antigravity, Codex CLI, and Copilot CLI targets are **generated at install time** from these sources — no separate hand-maintained tree:

- **Cursor** → `bin/transformers/cursor.js` transforms `.claude/skills/*/SKILL.md` → `.cursor/rules/*.mdc` (one flat `.mdc` per skill; rewrites frontmatter to `description` + `globs: []` + `alwaysApply: false`; strips the `# Skill:` prefix; relabels `Agent(...)` blocks as `Sub-task Agent(...)`). Cursor Agent is single-agent, so multi-agent skills execute inline.
- **Antigravity** → `bin/transformers/antigravity.js` copies `.opencode/skills/*` → `.antigravity/skills/*` (alias — OpenCode `task()`/`question()` syntax is reused since Antigravity's skill convention is not yet stable).
- **Codex CLI** → `bin/transformers/codex.js` transforms `.claude/skills/*/SKILL.md` → `.agents/skills/*/SKILL.md` (rewrites `AskUserQuestion`/`Agent(...)`/model hints into host-neutral prose; copies referenced `agents/*.md` contracts into a `references/` subfolder).
- **Copilot CLI** → `bin/transformers/copilot.js` targets `.github/skills/*/SKILL.md` (Copilot CLI reads the same SKILL.md standard as Codex) by delegating to `codexTransformer.copyAndTransform` with `contractLabel: 'Copilot CLI'` — no separate transform logic, since the host-neutral rewrite is identical. New; not yet smoke-tested against a live Copilot CLI session.

**Language variants** (per skill / agent / template / workflow doc):
- Claude skills: `SKILL.md` (VN, canonical), `SKILL.en.md`, `SKILL.ja.md` — all in the same skill folder.
- Other artifacts (agents / templates / workflow docs): `name.md` (VN), `name.en.md`, `name.ja.md`.

When adding a new skill, create the folder `.claude/skills/<role-command>/` with all 3 `SKILL*.md` variants. Translation flows from VN → EN → JA; keep frontmatter `name:` identical across variants (must equal the folder name). JP variants reference `assets/ask-first-gates.ja.md`, `docs/risk-classifier.ja.md`, and use JP business terminology from `templates/jp-vn-en-glossary.md`.

**JA-variant convention exception**: most skills' `SKILL.ja.md` is a short pointer-style summary (role/purpose + link to the EN/VN canonical file). Six skills are an intentional exception and carry a FULL inline JA translation instead — `dev-analyze`, `pm-maintain`, `install`, `be-changerequest`, `be-glossary`, `be-bridge` (+ their `.opencode/skills/` mirrors where applicable). These are the JP-client-facing/terminology-heavy skills where a JP engineer or bridge engineer needs to read the entire workflow without switching files. Do not "fix" these to pointer-style — this is deliberate, not drift.

### Run installer locally

```bash
# From a DIFFERENT directory (installer blocks src === dst)
node /path/to/ClaudeSkill/bin/install.js

# Non-interactive
node /path/to/ClaudeSkill/bin/install.js --yes

# Update existing install (overwrites all skill files)
node /path/to/ClaudeSkill/bin/install.js --update
node /path/to/ClaudeSkill/bin/install.js --update --yes
```

Or via npm:

```bash
npm run install-framework           # fresh install
npm run install-framework -- --update  # update existing
```

### Install via npx (end-user path)

Package published at: https://www.npmjs.com/package/agentic-development-lifecycle

```bash
# macOS/Linux — from the target project directory
npx agentic-development-lifecycle --yes

# OpenCode
npx agentic-development-lifecycle --yes --opencode

# Cursor (.cursor/rules/*.mdc + .cursorrules)
npx agentic-development-lifecycle --yes --cursor

# Antigravity (.antigravity/skills/ + AGENTS.md — aliases OpenCode source)
npx agentic-development-lifecycle --yes --antigravity

# Codex CLI (.agents/skills/ + managed AGENTS.md section)
npx agentic-development-lifecycle --yes --codex

# GitHub Copilot CLI (.github/skills/ + managed .github/copilot-instructions.md section)
# New target — not yet smoke-tested against a live Copilot CLI session.
npx agentic-development-lifecycle --yes --copilot

# Update existing install
npx agentic-development-lifecycle --update --yes

# Install single-language variant (one skill folder per command)
# --lang ja: ba-spec/SKILL.ja.md → installed as ba-spec/SKILL.md
# --lang en: ba-spec/SKILL.en.md → installed as ba-spec/SKILL.md
# --lang vi: VN SKILL.md only
# --lang all: fan out to ba-spec/, ba-spec-en/, ba-spec-ja/ (each SKILL.md) — default
npx agentic-development-lifecycle --yes --lang ja
npx agentic-development-lifecycle --yes --lang en
npx agentic-development-lifecycle --yes --lang vi
npx agentic-development-lifecycle --yes --lang all
```

Mutually-exclusive platform flags: pass only one of `--opencode`, `--cursor`, `--antigravity`, `--codex`, `--copilot`. Default (no flag) is Claude Code. Codex and Copilot CLI both default to `--lang vi` and require a single language (`vi`, `en`, or `ja`) — both read the same folder-per-skill `.claude/skills/` source and fan out per language the same way.

Developer Lite minimal install (Claude Code only — 8 dev/sec/arch/docs skills, no PM/BA/QA/Ops):

```bash
npx agentic-development-lifecycle --yes --lite
npx agentic-development-lifecycle --yes --lite --lang en
```

`--lite` cannot combine with `--opencode/--cursor/--antigravity`. Skips `docs/workflows/`, `risk-classifier.md`, `analysis/`, `improvement-backlog.md`, and uses `bin/CLAUDE.lite.md` as the CLAUDE.md source.

### Test installation

```powershell
# Windows: test in temp dir
$tmp = "$env:TEMP\test-install"; mkdir $tmp -Force
Set-Location $tmp; npx agentic-development-lifecycle --yes
```

### Testing skill triggering

Verify Claude auto-invokes the correct skill for naive prompts (no `/command` syntax):

**Claude Code:**
```bash
# All skills — VN prompts + EN variants (.en.txt)
bash tests/skill-triggering/run-all.sh

# With flags
bash tests/skill-triggering/run-all.sh --verbose          # show full output per test
bash tests/skill-triggering/run-all.sh --filter dev-*     # run only dev-* prompts

# Single skill (max-turns defaults to 3)
bash tests/skill-triggering/run-test.sh tests/skill-triggering/prompts/ba-spec.txt
bash tests/skill-triggering/run-test.sh tests/skill-triggering/prompts/ba-spec.txt 5  # custom max-turns
```

Requires: `claude` CLI authenticated, `jq` installed. Raw logs in `tests/.results/<timestamp>/` (gitignored).

**OpenCode:**
```powershell
pwsh tests/skill-triggering/opencode-run-all.ps1
pwsh tests/skill-triggering/opencode-run-all.ps1 -Verbose
pwsh tests/skill-triggering/opencode-run-all.ps1 -Filter "dev-*"
```
Validates prompt→skill file mapping (smoke test). Full trigger validation requires a live OpenCode session.

**Prompt filename → expected skill**: the basename maps directly to the skill folder name (`ba-spec.txt` → `ba-spec`, `ba-user-story.en.txt` → `ba-user-story`). New prompt files must follow this pattern.

### Validate skill files

```bash
npm run validate
# or: node scripts/validate-skills.js
```

Checks per-skill: for Claude skills, each `.claude/skills/<skill>/` folder has `SKILL.md` + `SKILL.en.md` + `SKILL.ja.md`, frontmatter has `name:` + `description:`, and `name:` equals the folder name (`role-command`). OpenCode skills are checked with the nested `role:command` convention.

### CI (GitHub Actions)

- `.github/workflows/installer-smoke.yml` — runs `bin/install.js` for all 6 platforms × {ubuntu, windows} on every PR, asserts the expected skills and config file are present.
- `.github/workflows/validate-skills.yml` — runs the validator above on every PR.
- `.github/workflows/skill-triggering.yml` — runs the free, no-API-key OpenCode trigger-accuracy suite (`opencode-run-all.ps1`, matrix vi/en/ja) on every PR; tracks pass/fail trend via GitHub Actions run history. The Claude Code bash suite is NOT wired here (needs a live authenticated `claude` CLI + real API credit per run) — run it locally per "Testing skill triggering" above.

### Skill file anatomy

**Claude Code (VN)** — `.claude/skills/[role-command]/SKILL.md`:

```markdown
---
name: role-command
description: >
  One-line description for Claude to match triggers.
  Trigger khi: user nói "...", hoặc gõ /role-command.
---

# Skill: /role-command
**Role**: [Role name]
**Mục đích**: [Purpose]

## [Steps with Human Gates]
```

**Claude Code (EN)** — `.claude/skills/[role-command]/SKILL.en.md`:

```markdown
---
name: role-command
description: >
  One-line description in English.
  Triggers when: user says "...", or types /role-command.
---

# Skill: /role-command
**Role**: [Role name]
**Purpose**: [Purpose]
```

Each skill folder bundles `SKILL.md` (VN, auto-loaded) + `SKILL.en.md` + `SKILL.ja.md`. Only `SKILL.md` auto-loads in this repo; the installer's `--lang` flag selects which variant is written as the active `SKILL.md` in the target project.

**OpenCode** — `.opencode/skills/[role]/[name].md` (VN) and `[name].en.md` (EN):
- Header: `# /role:command` (no "Skill:" prefix) — OpenCode keeps the `role:command` convention
- Spawn syntax: `task(subagent_type: "explorer"|"oracle")` instead of `Agent(model: "haiku"|"sonnet")`
- Gate tool: `question` instead of `AskUserQuestion`

**Cursor** (generated at install) — `.cursor/rules/[role-command].mdc` (flat, one per skill):
- Frontmatter drops `name:`, keeps `description`, adds `globs: []` + `alwaysApply: false`
- Header `# /role-command` (Skill: prefix stripped)
- Body keeps Claude `Agent(...)` blocks, relabelled as `Sub-task Agent(...)` so Cursor Agent treats them as inline subtasks (Cursor is single-agent)
- Project context: `.cursorrules` at repo root (copied from CLAUDE.md)

**Antigravity** (generated at install) — `.antigravity/skills/[role]/[name].md`:
- Alias of `.opencode/skills/` (same `task()` / `question()` syntax, `role:command` convention)
- Project context: `AGENTS.md` at repo root

Rules:
- `name` — must equal the skill folder name (`role-command`) for Claude; OpenCode uses `role:command`
- `description` — used to auto-trigger; VN files include Vietnamese phrases, EN files include English phrases
- Every skill must have at least 1 human gate (`**Chờ confirm.**` in VN, `**Wait for confirm.**` in EN)

### Subagent definitions (`agents/`)

Each agent file defines an **input contract** and **output JSON shape**. When spawning:
- Pass ONLY the minimal context the agent needs (no full conversation history)
- Summarize agent output before passing to the next agent in a chain

| Agent | Spawned by | Model | Purpose |
|-------|-----------|-------|--------|
| `task-reader` | `/dev-analyze` | haiku | Parse issue → structured JSON (no codebase access) |
| `code-scout` | `/dev-analyze` | haiku | Find relevant files for a task (read-only) |
| `planner` | `/dev-analyze` | sonnet | Synthesize task + code map → 2-3 implementation options |
| `diff-reader` | `/dev-pr`, `/docs-update` | haiku | Summarize git diff for PR description |
| `review-reader` | `/dev-review` | haiku | Parse diff → code/arch/security signals cho 3-lens review |
| `autopilot-reviewer` | `/dev-autopilot` | sonnet | Read-only evaluator (Evaluator A) → JSON verdict cho autonomous loop |
| `autopilot-adversary` | `/dev-autopilot` | sonnet | Read-only evaluator (Evaluator B, blind, adversarial) → JSON verdict; cùng `autopilot-reviewer` tạo cặp 2-evaluator + anti-sycophancy re-check |
| `test-gen` | `/qa-testplan` | sonnet | Generate test cases from spec |
| `doc-updater` | `/docs-update` | sonnet | Update baseline docs after verification |
| `pr-resolver` | `/dev-pr` | sonnet | Analyze PR review comments → propose fixes per comment |
| `screen-designer` | `/dev-analyze` | haiku | Draft screen spec proposal for UI-affecting tasks |
| `api-designer` | `/dev-analyze` | haiku | Draft API spec proposal for endpoint-affecting tasks |

### Permissions model

`.claude/settings.json` gates what Claude Code can do in this repo:

- **Allow**: Read, Glob, Grep, Write, Edit, `git log/diff/status`
- **Deny**: `git push`, `git reset --hard`, `rm -rf`, `curl`, `wget`, `nc`

`curl`/`wget`/`nc` bị deny để giảm rủi ro exfiltration khi 1 lần chạy autonomous/không giám sát (vd: `/dev-autopilot`) xử lý nội dung repo độc hại/đối kháng.

**Về khả năng "evasion" của prefix-glob deny** (verified qua [docs.claude.com/en/docs/claude-code/permissions](https://docs.claude.com/en/docs/claude-code/permissions), mục "Bash" → "Compound commands" và phần env-var stripping, đọc trực tiếp 2026-08-28 — không phải suy đoán):

- **Mid-pipeline (`echo x | curl ...`) đã được xử lý**: Claude Code nhận diện shell operator (`&&`, `||`, `;`, `|`, `|&`, `&`, newline) và match từng subcommand độc lập, nên subcommand `curl ...` sau dấu `|` vẫn bị `Bash(curl*)` chặn.
- **Leading env-var (`FOO=bar curl ...`) đã được xử lý**: deny rule match qua bất kỳ leading assignment nào (khác với allow rule, vốn chỉ strip 1 whitelist biến "known-safe") — nên `FOO=bar curl ...` vẫn bị `Bash(curl*)` chặn.
- Do đó 2 kịch bản nêu trong backlog IB-050 (mid-pipeline, leading env-var) **không phải lỗ hổng thật** với behavior hiện tại của Claude Code — không cần workaround (hook) cho việc này.

**Giới hạn còn lại (documented, không phải bug của repo)**: prefix-glob deny match theo *command text*, không hiểu ngữ nghĩa chương trình. `curl` gọi gián tiếp qua interpreter khác (vd `bash script.sh` chứa `curl`, `python -c "import urllib..."`, `node -e "..."`) không bị `Bash(curl*)`/`Bash(wget*)` bắt vì subcommand thực thi là `bash`/`python`/`node`, không phải `curl`. Deny list cũng chỉ gate Bash tool — `WebFetch` là tool riêng, hiện chưa có deny rule tương ứng nên vẫn có thể fetch URL qua đường đó. Vì vậy prefix-glob deny không phải sandbox tuyệt đối; chạy `/dev-autopilot` không giám sát trên nội dung repo không tin cậy/đối kháng không nên coi đây là 1 hard security boundary.

When adding new commands that need shell access, update `settings.json`.

---

## Project Context

**Công ty**: [Tên công ty / Company name]  
**Model**: [Mô hình team — ví dụ: Dev team ↔ Bridge Engineer ↔ Client]  
**Ngôn ngữ**: Code comments = tiếng Anh; Tài liệu nội bộ = tiếng Việt; Giao tiếp khách JP = tiếng Nhật  
**Encoding**: UTF-8 (hỗ trợ ký tự Nhật)  
**Timezone**: JST (UTC+9) cho deadline và meeting với khách  
**Deliverables JP style**: 設計書 (design doc), 単体テスト仕様書 (unit test spec), 成果物 (deliverables), 引き継ぎ書 (handover doc), 月次保守報告書 (monthly maintenance report), 変更依頼書 (change request doc), リリースノート (release notes)

### 日本語ユーザー向けクイックスタート (Japanese Quick Start)

このフレームワークは日本語ネイティブで利用可能です。

- **インストール**: `npx agentic-development-lifecycle --yes --lang ja`
- **スキルファイル**: `.claude/skills/<role-command>/SKILL.ja.md` (Claude Code) / `.opencode/skills/<role>/<name>.ja.md` (OpenCode)
- **トリガー例** (`--lang ja` でインストール時、スキル名はサフィックスなし):
  - 「バグ報告を作成して」→ `/qa-bug`
  - 「設計書を書きたい」→ `/ba-spec`
  - 「月次保守報告書を作って」→ `/pm-maintain`
  - 「変更依頼の影響分析」→ `/be-changerequest`
  - 「引き継ぎ書を作成」→ `/pm-handover`
- **用語集**: `templates/jp-vn-en-glossary.md` (JP-VN-EN 70+ 用語)
- **ロールガイド**: `docs/workflows/role-guide.ja.md`
- **スプリントフロー**: `docs/workflows/sprint-lifecycle.ja.md`
- **リスク分類**: `docs/risk-classifier.ja.md`
- **Ask First ゲート**: `assets/ask-first-gates.ja.md`

### Roles

| Role | Mô tả |
|------|-------|
| **Bridge Engineer (BE)** | Cầu nối giữa team VN và khách JP. Nhận requirement JP → clarify → chuyển spec cho team VN → review output trước khi gửi khách |
| **PM** | Quản lý sprint, resource, timeline. Báo cáo khách JP qua BE |
| **BA** | Phân tích nghiệp vụ, viết spec tiếng Việt từ requirement JP đã được BE dịch/clarify |
| **Dev** | Implement theo spec. Code comment tiếng Anh |
| **QA** | Test theo spec. Viết test report theo format JP nếu cần |
| **Arch** | Review design, tạo ADR |
| **DevOps** | Deploy, incident. Chú ý timezone JST khi lên schedule |
| **SM** | Scrum facilitation |

---

## Nguyên tắc cốt lõi

1. **Human Gate**: Không bao giờ tự động thực hiện. Luôn trình bày kết quả → hỏi câu hỏi làm rõ → chờ confirm.
2. **Multiple Options**: Luôn đưa ra 2-3 phương án với trade-off rõ ràng. Không bao giờ chỉ đưa 1 giải pháp.
3. **Fresh Context**: Dev tasks dùng subagent (Agent tool) để giữ context sạch, tiết kiệm token.
4. **Two-tier Docs**: Task docs (ephemeral, per issue) + Baseline docs (living, cập nhật sau verify).
5. **Delta Specs**: Mỗi thay đổi là 1 proposal có cấu trúc, không phải monolith.
6. **Template-first**: Commands reference templates, không duplicate format inline.

---

## Cấu trúc thư mục

```
.claude/skills/           # Canonical source — Agent Skills, 1 folder/skill: SKILL.md (VN) + SKILL.en.md + SKILL.ja.md
.opencode/skills/         # Hand port cho OpenCode (task() / question() syntax, role:command)
agents/                   # Subagent definitions (spawned bởi orchestrator skills)
bin/
  install.js              # Interactive installer — flags: --opencode | --cursor | --antigravity | --codex | --copilot | --lite
  CLAUDE.lite.md          # Dropped-in as CLAUDE.md when --lite is set
  transformers/
    cursor.js             # Transform .claude/skills/*/SKILL.md → .cursor/rules/*.mdc at install
    antigravity.js        # Alias .opencode/skills/ → .antigravity/skills/ at install
    codex.js              # Transform .claude/skills/*/SKILL.md → .agents/skills/*/SKILL.md at install
    copilot.js            # Delegates to codex.js -> .github/skills/*/SKILL.md at install
docs/
  tasks/                  # Task docs (Type 1) — mỗi issue 1 folder, kèm audit.md
  baseline/               # Codebase reverse-engineering output (từ /ba-reverse)
  screens/                # Screen baseline docs (Type 2)
  api/                    # API baseline docs (Type 2)
  decisions/              # Architecture Decision Records (ADR)
  workflows/              # Process guides và sprint lifecycle
templates/                # Template skeleton — commands reference đến đây
setup.ps1 / setup.sh      # Shell-based installer alternatives (Claude Code only)
```

---

## Skill Commands

| Role | Command | Chức năng |
|------|---------|----------|
| BE | `/be-bridge` | Requirement JP → Clarify ambiguity → Spec cho team VN |
| BE | `/be-changerequest` | 変更依頼 — impact analysis, approval trail, version control spec changes |
| BE | `/be-glossary` | Duy trì glossary JP-VN-EN — thêm term mới, resolve conflict dịch thuật |
| PM / BA | `/pm-ideate` | Ý tưởng mờ → Concept rõ (trước /ba-spec) |
| PM | `/pm-kickoff` | Bootstrap greenfield project: tech stack → ADRs → docs structure → sprint 0 checklist |
| BA | `/ba-spec` | Raw requirement → Structured spec |
| BA | `/ba-user-story` | Spec → User Stories + AC |
| BA / Tech Lead | `/ba-reverse` | Reverse engineer codebase brownfield → baseline docs (take-over, audit) |
| PM | `/pm-breakdown` | Epic → Tasks với estimate, tạo GitHub Issues |
| PM | `/pm-status` | Sprint status report |
| PM | `/pm-dashboard` | Generate static HTML dashboard từ `docs/tasks/*/` — kanban + health table + backlog |
| PM | `/pm-release` | Tạo Release Notes / リリースノート từ merged PRs + closed issues |
| PM | `/pm-handover` | Tạo gói bàn giao dự án (引き継ぎ) — codebase map + decisions + contact matrix |
| PM | `/pm-maintain` | Workflow maintenance phase: triage → fix → monthly report (月次保守報告書) |
| Dev | `/dev-analyze` | Task → Implementation options (multi-agent) |
| Dev | `/dev-implement` | Implement theo analysis.md, file-by-file với gates (hỗ trợ TDD lane opt-in) |
| Dev | `/dev-review` | Review toàn diện: code quality + architecture + performance + security trong 1 lần |
| Dev | `/dev-pr` | Code changes → PR description (hỗ trợ PR comment resolver) |
| Dev | `/dev-debug` | Systematic debugging: reproduce → localize → fix |
| Dev | `/dev-autopilot` | Autonomy harness có state bền vững, 2-evaluator loop và escalation theo rủi ro (opt-in, cần user cấp quyền rõ ràng) |
| Arch | `/arch-review` | Review design decision |
| Arch | `/arch-adr` | Generate Architecture Decision Record |
| QA | `/qa-testplan` | Spec → Test plan |
| QA | `/qa-bug` | Standardized bug report |
| QA | `/qa-regression` | Regression test checklist trước release |
| DevOps | `/ops-deploy` | Deployment checklist + CI quality gate |
| DevOps | `/ops-incident` | Incident response + RCA |
| SM | `/sm-standup` | Daily standup summary |
| SM | `/sm-retro` | Sprint retrospective |
| All | `/sec-review` | Security review trước merge (3-tier: Always/Ask First/Never) |
| All | `/docs-update` | Update baseline screen/API docs sau verify |
| All | `/docs-project` | Sync project-level docs: README, workflow guides, install scripts, CLAUDE.md |
| All | `/install` | Cài Agentic Development Lifecycle vào project hiện tại — copy commands, agents, templates, workflows |

---

## Gate Patterns

### AskUserQuestion Tool — bắt buộc cho multi-choice gates

**Mọi gate có multiple options PHẢI dùng `AskUserQuestion` tool** — không output plain text markdown. Điều này render native TUI trong Claude Code thay vì numbered list.

```
AskUserQuestion({
  questions: [{
    question: "Câu hỏi cụ thể?",
    header: "Label ngắn",   // max 12 chars, hiện trên tab
    multiSelect: false,      // true nếu cho chọn nhiều
    options: [
      { label: "Option A", description: "Trade-off / chi tiết" },
      { label: "Option B", description: "Trade-off / chi tiết" },
    ]
  }]
})
```

Rules:
- `header`: max 12 ký tự, viết tắt nếu cần (ví dụ: "Scope", "Shell", "Approach")
- Max 4 options per question, max 4 questions per call
- `description`: giải thích trade-off — không để trống
- Câu hỏi open-ended (không có options rõ ràng) → output plain text bình thường

### Full Human Gate (mặc định)
```
[Skill chạy] → [Trình bày kết quả + assumptions] → [AskUserQuestion] → [Chờ confirm] → [Tiếp tục]
```

### Risk Classifier Gate — bước 0 của mọi task

Trước khi bắt đầu bất kỳ task nào, classify risk theo `docs/risk-classifier.md`:

```
Input type: [new-spec | spec-slice | change-request | maintenance | ...]
Risk checklist: [R-01 ✅ / ❌ ... R-10 ✅ / ❌]
Lane: tiny | normal | high-risk
```

- **Tiny** → patch trực tiếp, bỏ qua analysis.md
- **Normal** → chọn manual lane (`dev-analyze → dev-implement → dev-review → dev-pr`) hoặc explicit autonomous lane (`/dev-autopilot` — cần user cấp autonomy envelope trước khi sửa file)
- **High-risk** → dừng, hỏi senior trước khi tiếp tục; nếu dùng `/dev-autopilot`, Ask First gate vẫn bắt buộc và approval không waive evaluator loop

`/dev-autopilot` là lane riêng, không gọi nested `/dev-review`: nó dùng 2 evaluator read-only mù với nhau (`autopilot-reviewer` + `autopilot-adversary`) và JSON verdict để tránh các human gate của manual review làm đứt loop; nếu cả hai đồng thuận `pass`, chạy thêm 1 devil's-advocate re-check trước khi finalize (anti-sycophancy). Xem `docs/agent-harness.md`.

### Ask First Gate (thay đổi nhạy cảm)
Dừng ngay và hỏi senior trước khi thực hiện (xem đầy đủ tại `assets/ask-first-gates.md`):
- Thay đổi authentication / authorization
- Breaking changes trong API
- Database migration ảnh hưởng data
- Thay đổi shared infrastructure
- Lưu trữ sensitive/PII data mới

### Harness Delta — cuối mỗi task

Sau khi task hoàn tất, ghi lại friction vào `docs/improvement-backlog.md` nếu có:
- Gate không rõ → phải đoán
- Template thiếu field
- Cùng vấn đề lần thứ 2+

---

## Spawning Subagents

Commands có multi-agent pattern dùng **Agent tool** của Claude Code để spawn subagents:

```
Agent({
  description: "task-reader: parse issue",
  prompt: "[nội dung theo agents/task-reader.md input contract]",
  model: "haiku"   // đọc từ agent frontmatter model: field
})
```

Mỗi subagent nhận **chỉ context cần thiết** — không pass full conversation history.  
Output từ subagent được tóm tắt trước khi pass vào subagent tiếp theo.

Model được chỉ định per-agent để tối ưu token (xem frontmatter `model:` trong mỗi file `agents/*.md`):
- **haiku**: read-only/parse agents (task-reader, code-scout, diff-reader, review-reader)
- **sonnet**: reasoning/synthesis agents (planner, doc-updater, test-gen, autopilot-reviewer, autopilot-adversary)

Subagent definitions: `agents/` folder.

---

## Two-tier Documentation

**Type 1 — Task Docs** (`docs/tasks/TASK-XXX/`) — **gitignored trong framework source repo**
- `requirements.md` — parsed từ issue (template: `templates/task-doc-requirements.md`)
- `analysis.md` — options đã cân nhắc
- `test-plan.md` — test cases
- `verification.md` — test results, sign-off
- `review-log-R[N].md` — review verdict theo round (template: `templates/review-log.md`), ghi bởi `/dev-review` mỗi lần chạy bất kể verdict
- `agent-state.md` — resumable state cho `/dev-autopilot` (template trong `docs/agent-harness.md`)
- `audit.md` — append-only log mọi skill chạy + user input verbatim (template: `templates/audit.md`)

**Type 2 — Baseline Docs** (cập nhật sau verify)
- `docs/baseline/codebase-overview.md` — codebase map từ `/ba-reverse` (brownfield only)
- `docs/screens/[feature]/screen.md` — (template: `templates/baseline-screen.md`)
- `docs/api/[domain]/[endpoint].md` — (template: `templates/baseline-api.md`)
- `docs/decisions/ADR-XXX.md` — (template: `templates/adr.md`)

---

## Output Format Convention

Tham khảo bài viết Thariq Shihipar — *"The Unreasonable Effectiveness of HTML"* ([phân tích nội bộ](docs/analysis/html-effectiveness-thariq.md)). Mỗi skill chọn format theo **consumer cuối cùng** của artifact, KHÔNG theo thói quen:

| Loại artifact | Consumer | Format | Lý do |
|---------------|----------|--------|-------|
| Storage / commit vào repo | Git, future devs | **Markdown** | Diffable, GitHub render |
| One-shot review/decision | Human đang quyết định | **HTML** | Click, sort, filter — nhanh hơn |
| JP deliverable (成果物) | Khách Nhật | **HTML** | Đẹp khi forward email/print |
| Chained vào agent kế tiếp | LLM | **Markdown/JSON** | Token rẻ, parse dễ |
| Platform render (GitHub/Slack) | Web platform | **Markdown** | Platform tự render |

**Quy tắc**: artifact nào có ý định *để tiếp tục làm việc* (sort, filter, tick checkbox, copy field) → HTML. Artifact để *đọc rồi commit* → Markdown.

### Skill format matrix

| Skill | Format chính | HTML companion (one-shot, không commit) |
|-------|-------------|------------------------------------------|
| `/dev-analyze` | MD (`analysis.md`) | `analysis-compare.html` — sort/filter phương án |
| `/qa-testplan` | MD (`test-plan.md`) | `test-plan.html` — checklist tick + localStorage |
| `/qa-regression` | HTML | `regression-checklist.html` — go/no-go decision |
| `/pm-status` | HTML | `sprint-status.html` — kanban + velocity |
| `/be-bridge` | MD + HTML | `deliverable.html` — 2 cột JP/VN, copy button |
| Còn lại (27 skill) | MD | (xem nhóm B trong `docs/analysis/html-effectiveness-thariq.md` để mở rộng khi cần) |

HTML artifact dùng template `templates/html-artifact.html` (interactive) hoặc `templates/html-bilingual.html` (JP-VN). File HTML one-shot KHÔNG commit — `.gitignore` loại trừ `docs/tasks/**/*.html`.

### Audit Log convention

Mọi skill thay đổi state của task (BA/Dev/QA/Arch...) PHẢI append entry vào `docs/tasks/[TASK-ID]/audit.md`:
- **User input verbatim** (không paraphrase)
- **Timestamp JST** ISO format
- **Skill name** + stage
- **Decision + artifact reference**

Khác biệt với Q&A History trong `requirements.md`: Q&A History chỉ ghi clarify Q&A của BA; audit log ghi MỌI skill chạy trong task. Dùng để defend quyết định khi khách JP chất vấn ("なぜこの設計?") sau N tháng.

---

## Deliverable Standards

Khi cần gửi tài liệu cho khách JP, format theo:

| Deliverable JP | Maps to framework |
|---------------|-------------------|
| 基本設計書 (Basic Design) | `docs/screens/` + `docs/api/` |
| 詳細設計書 (Detail Design) | `docs/tasks/[TASK]/analysis.md` |
| 単体テスト仕様書 (UT Spec) | `docs/tasks/[TASK]/test-plan.md` |
| 単体テスト結果 (UT Result) | `docs/tasks/[TASK]/verification.md` |

BE dùng `/be-bridge` để review và format lại trước khi gửi khách.

---

## Customization per project

1. Cập nhật section "Project Context" với project name, khách hàng, repo URL
2. Thêm GitHub token, Jira URL, Confluence space vào `.env` hoặc settings
3. Thêm domain-specific skills nếu cần (ví dụ: `/domain-check` cho business rules đặc thù)
4. Cập nhật estimate unit: story points, man-days (人日), hay hours

**Xem full workflow**: `docs/workflows/sprint-lifecycle.md`  
**Role guide (ai dùng skill nào)**: `docs/workflows/role-guide.md`

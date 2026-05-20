# Agentic Development Lifecycle

<div align="right">
  <a href="README.md">🇬🇧 English</a> &nbsp;|&nbsp; <strong>🇻🇳 Tiếng Việt</strong> &nbsp;|&nbsp; <a href="README.ja.md">🇯🇵 日本語</a>
</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/hiepdnh/Agentic-Development-Lifecycle/main/assets/banner.png" alt="Agentic Development Lifecycle" width="100%">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/agentic-development-lifecycle"><img src="https://img.shields.io/npm/v/agentic-development-lifecycle.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/agentic-development-lifecycle"><img src="https://img.shields.io/npm/dm/agentic-development-lifecycle.svg" alt="npm downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

> **32 skills cho Claude Code & OpenCode** — phủ toàn bộ SDLC cho team phát triển phần mềm với AI.

---

## Đây là gì?

Một **bộ skill AI** cho team phát triển phần mềm. Cài vào bất kỳ project nào để có các skill theo role, có cấu trúc, phủ toàn bộ vòng đời sprint.

Hỗ trợ **cả Claude Code và OpenCode** — cùng bộ skill, khác runtime.

Phù hợp với bất kỳ team nào muốn AI hỗ trợ có cấu trúc — đặc biệt hữu ích cho các team outsource/consulting có Bridge Engineer và deliverables format JP.

---

## Cài đặt nhanh

### Claude Code

```bash
# macOS / Linux — chạy từ thư mục project của bạn
npx agentic-development-lifecycle --yes
```

```powershell
# Windows — chạy từ thư mục project của bạn
npx agentic-development-lifecycle --yes
```

Cập nhật bản cài đặt hiện tại:

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

**Cài gì**: thư mục skills + `agents/` + `templates/` + `docs/workflows/`

### Developer Lite (cài tối giản)

Chỉ cần developer workflow mà không cần overhead PM/BA/QA/Ops?

```bash
npx agentic-development-lifecycle --yes --lite
```

Cài 8 skill: `/dev:analyze` `/dev:implement` `/dev:review` `/dev:pr` `/dev:debug` `/sec:review` `/arch:adr` `/docs:update` (chỉ Claude Code). Kết hợp với `--lang ja` hoặc `--lang en` để chọn ngôn ngữ. Sau này muốn nâng cấp lên full framework: `npx agentic-development-lifecycle --update --yes`.

---

## Các Skill Command

### Phân tích Nghiệp vụ

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/pm:ideate` | Ý tưởng mơ hồ → concept rõ với problem statement + NOT Doing list | Rough idea → Concept doc |
| `/ba:spec` | Requirement thô → spec có cấu trúc | Requirements → `requirements.md` |
| `/ba:user-story` | Spec → User Stories với AC | Spec → User Stories |
| `/ba:reverse` | Reverse engineer legacy codebase → baseline docs | Codebase → `docs/baseline/` |
| `/be:bridge` | Dịch requirement JP, tạo tài liệu song ngữ JP-VN | JP req → VN spec + JP doc |
| `/be:changerequest` | 変更依頼 — impact analysis, approval trail, version control spec thay đổi | CR → Impact analysis + JP doc |
| `/be:glossary` | Duy trì glossary JP↔VN↔EN — thêm term, resolve conflict dịch thuật | Term mới → Glossary update |

### Quản lý Dự án

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/pm:breakdown` | Epic/Stories → Tasks với estimate + GitHub/GitLab Issues | Epic → Issues |
| `/pm:status` | Báo cáo trạng thái sprint cho stakeholder | Tasks → Status report |
| `/pm:dashboard` | Dashboard HTML tĩnh (kanban + health + backlog) | `docs/tasks/*/` → HTML |
| `/pm:kickoff` | Bootstrap greenfield project: tech stack → ADRs → docs structure → sprint 0 checklist | Requirement → Project scaffold |
| `/pm:release` | Tạo Release Notes / リリースノート từ merged PRs + closed issues | PRs + Issues → Release Notes |
| `/pm:handover` | Tạo gói bàn giao dự án (引き継ぎ) — codebase map + decisions + contact matrix | Project → Handover package |
| `/pm:maintain` | Workflow maintenance phase: triage → fix → monthly report (月次保守報告書) | Incident → Fix + Report |

### Phát triển

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/dev:analyze` | Task → 2-3 phương án implement với trade-off | Issue + codebase → `analysis.md` |
| `/dev:implement` | Implement file-by-file với human gate + verification + harness delta | `analysis.md` → Code → `verification.md` |
| `/dev:review` | Review toàn diện sau implement: code quality + architecture + security trong 1 lần | Diff + `analysis.md` → Review report → Approve / Request Changes |
| `/dev:pr` | Tạo PR description | Code diff → PR description |
| `/dev:debug` | Debug có cấu trúc: reproduce → localize → fix | Bug report → Fix |

### Kiến trúc

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/arch:review` | Review design decision | Design → Feedback |
| `/arch:adr` | Tạo Architecture Decision Record | Decision → `docs/decisions/ADR-NNN.md` |

### QA

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/qa:testplan` | Spec → Test plan | Spec → `test-plan.md` |
| `/qa:bug` | Bug report chuẩn hóa | Bug info → Bug report |
| `/qa:regression` | Checklist regression trước release | Release → Go/No-go checklist |

### DevOps

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/ops:deploy` | Deployment checklist + CI quality gate + rollback plan | Release → Checklist |
| `/ops:incident` | Triage incident + điều tra song song + RCA template | Incident → RCA |

### Bảo mật

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/sec:review` | Security review: Always check / Ask First / Never (OWASP Top 10) | Code → Security report |

### Tài liệu

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/docs:update` | Cập nhật baseline screen/API docs sau task verify | Verified task → Updated docs |
| `/docs:project` | Sync project-level docs: README, workflow guides, CLAUDE.md | Changes → Updated project docs |

### Scrum

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/sm:standup` | Tóm tắt daily standup | Updates → Standup report |
| `/sm:retro` | Sprint retrospective | Sprint → Retro report |

---

## Templates & Artifacts

Mỗi skill ghi output ra một template có cấu trúc. Tất cả template hỗ trợ **VN / EN / JP** (`name.md` / `name.en.md` / `name.ja.md`).

| Template | Artifact tạo ra | Chuẩn |
|----------|----------------|-------|
| `task-doc-requirements` | Spec yêu cầu | IEEE 29148 (SRS) |
| `user-story` | User Story + Acceptance Criteria | Connextra / INVEST |
| `analysis` | Các phương án implement + trade-off | — |
| `verification` | Kết quả kiểm thử + sign-off | IEEE 829 |
| `test-plan` | Kế hoạch kiểm thử với ma trận TC | IEEE 829 |
| `bug-report` | Báo cáo lỗi (Severity / Priority / Steps) | — |
| `adr` | Architecture Decision Record | MADR (Markdown Architectural Decision Records) |
| `pr-description` | Mô tả Pull Request | — |
| `github-issue` | GitHub / GitLab issue | — |
| `audit` | Audit log append-only theo task | — |
| `change-request` | 変更依頼書 — phân tích ảnh hưởng + lịch sử duyệt | — |
| `release-notes` | Release Notes / リリースノート | Keep a Changelog |
| `handover` | 引き継ぎ書 — codebase map + contact matrix | — |
| `monthly-maintenance-report` | 月次保守報告書 | — |
| `incident-report` | RCA sự cố + blameless postmortem | Google SRE / PagerDuty |
| `baseline-screen` | Đặc tả màn hình / 画面定義書 | IPA 基本設計書 (JP) |
| `baseline-api` | Đặc tả API / API定義書 | IPA API定義書 (JP) |

Variant JP bao gồm các trường phía khách hàng (`顧客名`, `プロジェクト名`, `対象システム`) và dùng ngôn ngữ 敬語 khi cần thiết.

---

## Cách hoạt động

### Subagents (multi-agent pattern)

Task nặng spawn subagent nhẹ để giữ context sạch:

| Agent | Dùng bởi | Claude Code | OpenCode | Mục đích |
|-------|----------|-------------|----------|----------|
| `task-reader` | `/dev:analyze` | haiku | explorer | Parse issue → structured JSON |
| `code-scout` | `/dev:analyze` | haiku | explorer | Tìm files liên quan |
| `planner` | `/dev:analyze` | sonnet | oracle | Tổng hợp phương án |
| `diff-reader` | `/dev:pr`, `/docs:update` | haiku | explorer | Map diff → AC coverage |
| `review-reader` | `/dev:review` | haiku | explorer | Parse diff → code/arch/security signals |
| `test-gen` | `/qa:testplan` | sonnet | oracle | Tạo test cases |
| `doc-updater` | `/docs:update` | sonnet | oracle | Cập nhật baseline docs |
| `pr-resolver` | `/dev:pr` | sonnet | oracle | Phân tích review comments → fixes |

### Human Gates

Mọi skill đều có ít nhất 1 human gate — skill trình bày lựa chọn và **chờ quyết định của bạn** trước khi tiếp tục. Không tự động thực hiện.

- **Claude Code**: `AskUserQuestion` tool
- **OpenCode**: `question` tool

### Workflow điển hình

<p align="center">
  <img src="https://raw.githubusercontent.com/hiepdnh/Agentic-Development-Lifecycle/main/assets/workflow.png" alt="Sprint Workflow" width="100%">
</p>

### Sprint đầy đủ (end to end)

```
/pm:ideate → /ba:spec → /ba:user-story → /pm:breakdown

    ↓ (mỗi task)

/dev:analyze → [review analysis.md] → /dev:implement
    → /dev:review → /dev:pr
```

### Developer flow (một task)

```
/dev:analyze → [review analysis.md] → /dev:implement → /dev:review → /dev:pr
```

> **`/dev:analyze`** phân loại risk trước (tiny / normal / high-risk), sau đó dừng sau khi ghi `analysis.md`. Review xong mới trigger `/dev:implement` thủ công.  
> **`/dev:implement`** dừng sau khi ghi `verification.md` (diff review + kết quả self-test) và nhắc Harness Delta check. Sau đó trigger `/dev:review` — review 3 lens (code quality, architecture, security). Sau khi Approve mới trigger `/dev:pr`.

Xem chi tiết từng bước tại [`docs/workflows/sprint-lifecycle.md`](docs/workflows/sprint-lifecycle.md)  
Ai dùng skill nào: [`docs/workflows/role-guide.md`](docs/workflows/role-guide.md)

---

## Two-tier Documentation

```
docs/
  tasks/          ← Type 1: Per-task (ephemeral, gitignored trong framework source)
    TASK-001/
      requirements.md
      analysis.md
      test-plan.md
      verification.md
      audit.md        ← Append-only log mọi skill chạy + user input verbatim
  baseline/         ← Type 2: Baseline (living docs, cập nhật sau verify)
  screens/
  api/
  decisions/        ← ADRs
  workflows/        ← Hướng dẫn quy trình
```

**Type 1** (task docs): Tạo per issue, gitignored trong framework repo này. Project của bạn giữ lại.  
**Type 2** (baseline docs): Cập nhật sau mỗi task merge qua `/docs:update`.

---

## Project Context

Tối ưu cho các team outsource/consulting có giao tiếp với client:

- **Bridge Engineer** — dịch requirement khách → spec cho team (`/be:bridge`)
- **BA** — viết spec từ requirement đã clarify (`/ba:spec`)
- **Dev** — implement với AI guidance có cấu trúc, code comment tiếng Anh
- **QA** — test theo spec, tạo test report format Nhật nếu cần
- **Deliverables** — 設計書, 単体テスト仕様書, 成果物 format cho khách Nhật

---

## Cấu trúc dự án

```
.claude/commands/    # 32 Claude Code slash command files
.opencode/skills/    # 32 OpenCode skill files (auto-trigger)
agents/              # 8 subagent definitions
docs/
  workflows/         # Sprint lifecycle, role guide, flowchart
  decisions/         # ADR templates
templates/           # Skeleton templates
bin/install.js       # Installer tương tác (@clack/prompts) — hỗ trợ --opencode
setup.ps1            # PowerShell installer (Claude Code)
setup.sh             # Bash installer (Claude Code)
```

---

## Phát triển

Repo này là framework source. "Sản phẩm" là skill files cho cả hai nền tảng — `.claude/commands/` và `.opencode/skills/` (mỗi bên 32 files).

### Test skill triggering

**Claude Code:**
```bash
bash tests/skill-triggering/run-all.sh
bash tests/skill-triggering/run-all.sh --verbose
bash tests/skill-triggering/run-all.sh --filter dev-*
```
Yêu cầu: `claude` CLI đã auth + `jq` đã cài.

**OpenCode:**
```powershell
pwsh tests/skill-triggering/opencode-run-all.ps1
pwsh tests/skill-triggering/opencode-run-all.ps1 -Verbose
pwsh tests/skill-triggering/opencode-run-all.ps1 -Filter "dev-*"
```
Kiểm tra mapping prompt→skill file. Full trigger validation cần chạy trong OpenCode session.

---

## License

MIT — Tự do sử dụng và customize cho dự án của bạn.

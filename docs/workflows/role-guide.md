# Role Guide — Ai dùng skill nào?

**Framework**: Agentic Development Lifecycle  
**Last updated**: 2026-05-15

---

## PM (Project Manager)

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/pm-kickoff` | Bắt đầu dự án mới greenfield | Tech stack ADRs + docs structure + Sprint 0 checklist |
| `/pm-ideate` | Nhận yêu cầu mơ hồ từ stakeholder | One-pager + Not Doing list |
| `/pm-breakdown` | Sau khi có User Stories | GitHub Issues |
| `/pm-status` | Báo cáo sprint cho stakeholder / khách JP | Status summary (Markdown) hoặc `sprint-status.html` (dashboard kanban + velocity, recommend khi gửi khách) |
| `/pm-dashboard` | Xem tổng quan sprint bất kỳ lúc nào | `docs/dashboard.html` — kanban + KPIs + git activity + health chart |
| `/pm-release` | Trước mỗi release gửi JP / stakeholder | `release-[version].html` + Markdown — リリースノート song ngữ |
| `/pm-handover` | Dev rời team / kết thúc contract JP | `handover.md` (VN) + `引き継ぎ書.md` (JP) |
| `/pm-maintain` | Project vào maintenance/sustain phase | Triage board + fix workflow + `月次保守報告書` |

**Dashboard usage**:
```bash
npm run dashboard           # gen 1 lần
npm run dashboard:watch     # auto-regen khi có thay đổi file
```
Mở `docs/dashboard.html` trong browser. Không cần server. Sections: Stats KPIs · Kanban · Activity timeline (audit + git 14d) · Validation health doughnut · Skill heatmap · Sprint health table · Improvement backlog.

**Không dùng**: dev-*, sec-*, qa-*, arch-*

**Last updated**: 2026-05-12

---

## BA (Business Analyst)

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/ba-spec` | Sau pm-ideate, trước pm-breakdown | requirements.md |
| `/ba-user-story` | Sau ba-spec | User Stories trong requirements.md |
| `/ba-reverse` | Brownfield: take-over codebase legacy / vendor cũ | docs/baseline/codebase-overview.md |

**Không dùng**: dev-*, sec-*, arch-*

---

## Developer

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/dev-analyze` | Nhận issue, trước khi code | Risk classification + `analysis.md` + `analysis-compare.html` (**dừng — review trước khi implement**) |
| `/dev-implement` | Sau dev-analyze, phương án đã chọn | Code + `verification.md` + harness delta (**dừng — user test rồi mới dev:review**) |
| `/dev-review` | Sau implement, trước tạo PR | Review report: code quality + architecture + security trong 1 lần |
| `/dev-debug` | Khi bị blocked hoặc phát hiện bug | Root cause + fix |
| `/dev-pr` | Sau dev:review Approve, trước tạo PR | PR description (tự đọc `verification.md`) |

**Thứ tự bắt buộc**: `dev:analyze` → [review `analysis.md`] → `dev:implement` → [report test results] → `dev:review` → `dev:pr`

**Risk lanes** (xem `docs/risk-classifier.md`):
- **Tiny** → patch trực tiếp, bỏ qua `dev:analyze`
- **Normal** → quy trình đầy đủ như trên
- **High-risk** → dừng trước khi implement, cần senior confirm

---

## Tech Lead / Architect

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/dev-review` | Review code của dev sau implement — chạy thay vì /arch-review + /sec-review riêng lẻ | Review report: code + arch + security |
| `/arch-adr` | Khi `/dev-review` phát hiện design decision mới cần document | `docs/decisions/ADR-NNN.md` |
| `/arch-review` | Standalone — khi chỉ cần review design decision, không phải full review | Architecture findings |
| `/sec-review` | Standalone — khi cần quick security check (hotfix, emergency patch) | Security findings |

**Vị trí trong sprint:**
```
dev:analyze → [Tech Lead review analysis.md nếu high-risk]
           → dev:implement
           → arch:review  (nếu có design decision mới)
           → sec:review   (nếu có security changes)
           → dev:pr
```

**3 vai trò chính:**
1. **Gate high-risk tasks** — Khi `/dev-analyze` phân loại task là `high-risk`, framework bắt buộc dừng và yêu cầu senior/Tech Lead confirm trước khi implement. Đây là gate cứng, không phải tùy chọn.
2. **Review design decision** — Dùng `/arch-review` khi team đề xuất pattern, cấu trúc DB, API contract... Tránh rework tốn kém do design sai từ đầu.
3. **Audit trail cho khách JP** — Mọi quyết định kiến trúc → tạo ADR bằng `/arch-adr`. Phục vụ khi khách hỏi "なぜこの設計?" sau nhiều tháng.

**Không dùng**: pm-*, ba-*, qa-testplan, ops-*

---

## QA Engineer

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/qa-testplan` | Sau spec, song song với dev | `test-plan.md` + `test-plan.html` (checklist tick được, lưu localStorage) |
| `/docs-update` | Sau verify và merge | verification.md + updated baseline docs |
| `/qa-regression` | Trước mỗi release | `regression-checklist.html` (go/no-go decision, status badge tự cập nhật) — export PDF nếu khách JP cần evidence |

---

## Bridge Engineer

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/be-bridge` | Nhận yêu cầu từ JP / Gửi deliverables cho JP | requirements.md (VN) + design-jp.md (JP) + `deliverable.html` (song ngữ 2 cột, copy/print A4 cho 成果物) |
| `/be-changerequest` | Khách JP yêu cầu thay đổi spec | CR-NNN-vn.md + CR-NNN-jp.md (変更依頼書) |
| `/be-glossary` | Sau mỗi session bridge có `[GLOSSARY?]` tag / Thuật ngữ không nhất quán | templates/jp-vn-en-glossary.md updated |

---

## Scrum Master / Team Lead

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/pm-ideate` | Facilitate sprint planning | One-pager |
| `/arch-adr` | Document team decisions | ADR |

---

## Workflow nhanh theo tình huống

### "Bắt đầu dự án mới (greenfield)"
```
/pm-kickoff → [tech stack + ADRs + docs structure] → /be-bridge (基本設計書 nếu JP)
    → /pm-breakdown → Sprint 1
```

### "Nhận yêu cầu từ khách hàng Nhật"
```
/be-bridge → /ba-spec → /ba-user-story → /pm-breakdown
```

### "Take-over codebase brownfield từ vendor cũ"
```
/ba-reverse → [review baseline docs] → /be-bridge (review JP) → /ba-spec (cho feature mới)
```

### "Nhận issue mới, cần code"
```
/dev-analyze → [review analysis.md] → /dev-implement → [report test results] → /dev-review → /dev-pr
```

### "Khách JP yêu cầu thay đổi spec giữa sprint"
```
/be-changerequest → [impact analysis] → [JP approve] → update requirements.md → /dev-analyze
```

### "Code xong, cần QA"
```
/qa-testplan → [execute manual] → /docs-update
```

### "Trước khi release"
```
/qa-regression → [sign-off] → deploy → /pm-release (release notes)
```

### "Project vào maintenance phase"
```
/pm-maintain triage → fix → cuối tháng: monthly report gửi JP
```

### "Dev rời team / kết thúc contract JP"
```
/pm-handover → [handover meeting] → người mới shadow → update CLAUDE.md
```

### "Trả lời review comments trên PR"
```
/dev-pr → [chọn PR resolver] → pr-resolver agent phân tích → fix blocking items → re-push
```

### "Xem sprint health nhanh"
```bash
npm run dashboard
# mở docs/dashboard.html → kanban + KPIs + git activity + validation health
```
Hoặc trong Claude Code: `/pm-dashboard`

### "Cần document quyết định kỹ thuật"
```
/arch-adr
```

---

## Ghi chú

- Mỗi skill có **gate** — luôn chờ confirm trước khi tiếp tục
- Multi-choice gates dùng `AskUserQuestion` tool (native TUI, không phải plain text)
- Subagent được dùng trong dev-analyze, dev-implement (verification), sec-review, qa-regression
- `dev:analyze` và `dev:implement` đều có **hard stop** — không tự động chạy bước tiếp theo
- **Risk Classifier** (`docs/risk-classifier.md`) — bước 0 bắt buộc trước khi bất kỳ dev task nào bắt đầu
- **Improvement Backlog** (`docs/improvement-backlog.md`) — agent ghi friction sau mỗi task; xem khi muốn cải tiến framework
- **Validation Matrix** (`docs/validation-matrix.md`) — chạy `bash tests/skill-triggering/run-all.sh` rồi update cột Status
- Xem flow đầy đủ tại `docs/workflows/sprint-lifecycle.md`
- **Output Format Convention** — 5 skill (`/dev-analyze`, `/qa-testplan`, `/qa-regression`, `/pm-status`, `/be-bridge`) sinh HTML companion ngoài Markdown để hỗ trợ review tương tác (sort, filter, checklist, song ngữ). File HTML là one-shot, không commit — xem `CLAUDE.md` section "Output Format Convention" và `docs/analysis/html-effectiveness-thariq.md`.

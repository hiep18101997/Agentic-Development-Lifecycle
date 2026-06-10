# Sprint Lifecycle — End-to-End Guide

**Framework**: Agentic Development Lifecycle  
**Last updated**: 2026-05-15

> 📊 Xem quick dashboard: chạy `/pm-dashboard` → tạo `sprint-status.html` (kanban + health table + backlog)

---

## Tổng quan Sprint Flow

```
Giai đoạn 1: Khởi đầu Sprint
  PM: /pm-ideate (optional) → /ba-spec → /ba-user-story → /pm-breakdown
  
  [GitHub Issues được tạo, được assign cho dev]

Giai đoạn 2: Dev Implementation  
  Dev: /dev-analyze → /dev-implement → /dev-review → /dev-pr

Giai đoạn 3: Review & Merge
  Reviewer: Code review (manual + /ultrareview optional)
  QA: /qa-testplan (nếu cần) → Test execution

Giai đoạn 4: Release
  DevOps: /ops-deploy → Deploy → Monitor
  
  [Nếu incident: /ops-incident]

Giai đoạn 5: Retrospective
  SM: /sm-retro
```

---

## Giai đoạn 1: Khởi đầu Sprint

### 1.1 Ideation (Optional) `/pm-ideate`
**Người dùng**: PM / BA / Product Owner  
**Khi dùng**: Ý tưởng còn mơ hồ, chưa rõ scope. Chạy trước `/ba-spec` để tránh spec sai hướng.  
**Input**: Ý tưởng thô  
**Output**: Concept doc với problem statement, goals, NOT Doing list

### 1.2 Business Spec `/ba-spec`
**Người dùng**: BA  
**Input**: Raw requirement (JP translated bởi BE, hoặc VN trực tiếp)  
**Output**: `docs/tasks/[TASK-ID]/requirements.md`  
**Gates**:
1. Confirm scope (in/out)
2. Confirm AC list  
3. Q&A History append-only (resume sau interrupt)

### 1.3 User Stories `/ba-user-story`
**Người dùng**: BA / PM  
**Input**: `requirements.md`  
**Output**: User Stories format: "As a [user], I want [action], so that [benefit]" + AC

### 1.4 Task Breakdown `/pm-breakdown`
**Người dùng**: PM / Tech Lead  
**Input**: Epic hoặc User Stories  
**Output**: GitHub Issues (hoặc GitLab) với estimate, label, assignee  
**Hỗ trợ**: GitHub (`gh` CLI) và GitLab (`glab` CLI)

---

## Giai đoạn 2: Development

### 2.1 Risk Classification
Trước khi bắt đầu bất kỳ task nào, classify risk theo `docs/risk-classifier.md`:
- **Tiny** → patch trực tiếp, bỏ qua analysis.md
- **Normal** → chạy đủ analyze → implement → review → PR
- **High-risk** → dừng, hỏi senior trước khi tiếp tục

### 2.2 Task Analysis `/dev-analyze`
**Người dùng**: Dev  
**Input**: GitHub Issue + codebase  
**Output**: `docs/tasks/[TASK-ID]/analysis.md` với 2-3 phương án + trade-off  
**Gates**:
1. Confirm tech stack / affected areas
2. Chọn phương án (sau khi đọc analysis.md)

**Multi-agent pattern**: `task-reader` (haiku) → `code-scout` (haiku) → `planner` (sonnet) → orchestrator tổng hợp

**Hard stop** — `dev:analyze` dừng sau khi ghi `analysis.md`. User tự trigger `/dev-implement` sau khi review.

### 2.3 Implementation `/dev-implement`
**Người dùng**: Dev  
**Input**: `analysis.md` (phương án đã chọn)  
**Output**: Code changes + `docs/tasks/[TASK-ID]/verification.md`  
**Gates** (per file):
1. Confirm implementation plan + file order
2. Confirm sau mỗi file (không tự nhảy sang file tiếp theo)
3. Bước 4 — Dev self-check
4. Bước 5 — Verification Gate: diff review → AI generates self-test steps → user reports results → saves `verification.md`
5. **Harness Delta Check** — agent tự hỏi có friction nào không, ghi vào `docs/improvement-backlog.md` nếu có

**Hard stop sau Bước 5** — user phải tự trigger `/dev-review`.

### 2.4 Dev Review `/dev-review`
**Người dùng**: Dev / Tech Lead  
**Input**: Code diff + `analysis.md` + `verification.md`  
**Output**: Review report gồm 4 lens: code quality, architecture, performance, security  
**Gates**:
1. Confirm focus (All / Code / Arch / Security)
2. Verdict: Approve / Approve with minor fixes / Request Changes
3. Nếu có design decision mới → hỏi có tạo `/arch-adr` không

Review 4 lens trong 1 lần chạy:
- **Code Quality** — logic, naming, test coverage, performance, error handling
- **Architecture** — scalability, coupling, maintainability, design decision mới
- **Security** — OWASP Top 10, auth/authz (Ask First gate), dependency CVEs

**Blocking issues** → dev fix và chạy lại `/dev-review`  
**Approve** → tiếp tục `/dev-pr`

---

## Giai đoạn 3: Review & Merge

### 3.1 Dev PR `/dev-pr`
**Người dùng**: Dev  
**Input**: Code diff + `analysis.md` + `verification.md` (nếu có)  
**Output**: PR description (Testing section tự động populate từ `verification.md`)  
**Prerequisite**: `/dev-review` đã chạy và verdict = Approve (hoặc Approve with minor fixes).  
**Gate**:
1. Kiểm tra `/dev-review` đã Approve chưa — nếu chưa, dừng và hướng dẫn chạy review trước
2. Confirm AC coverage
3. Confirm reviewer list

### 3.2 Code Review (manual)
- Reviewer dùng `/ultrareview` nếu cần AI assist
- Tối thiểu 1 approve
- Address comments

### 3.3 QA (nếu cần)
- `/qa-testplan` — tạo test plan từ spec (thường làm trước implement)
- `/qa-regression` — regression checklist trước release lớn

---

## Giai đoạn 4: Release

### 4.1 Deployment `/ops-deploy`
**Người dùng**: DevOps / Dev  
**Output**: Deployment checklist + CI quality gate + rollback plan  
**Chú ý**: Timezone JST đối với khách Nhật

### 4.2 Incident (nếu xảy ra) `/ops-incident`
**Trigger**: Hệ thống bị lỗi production  
**Pattern**: Triage → điều tra song song 3 hướng → RCA template (5 Whys)

---

## Giai đoạn 5: Docs Update

### 5.1 Baseline Docs Update `/docs-update`
**Trigger**: Sau khi task merge và verify  
**Input**: `verification.md` + actual code  
**Output**: Cập nhật `docs/screens/` hoặc `docs/api/` baseline, kèm metadata: `Last updated` (JST), `Updated by task`, `Commit` (short-sha)

### 5.2 Project Docs `/docs-project`
**Trigger**: Khi có thay đổi lớn (skill mới, team thay đổi, process update)  
**Output**: README, CLAUDE.md, workflow guides được sync

---

## Giai đoạn 6: Retrospective

### 6.1 Sprint Retro `/sm-retro`
**Trigger**: Cuối sprint  
**Output**: Went well / Didn't go well / Actions  

### 6.2 Standup `/sm-standup`
**Trigger**: Hàng ngày  
**Output**: Yesterday / Today / Blockers per member

---

## Greenfield Project Kickoff

Trước giai đoạn 1, khi bắt đầu dự án mới từ đầu:

```
/pm-kickoff → Tech stack decision + ADRs → docs/ structure → Sprint 0 checklist
    → Nếu JP client: /be-bridge tạo 基本設計書 → JP confirm
    → Sprint 1: vào giai đoạn Discovery bình thường
```

---

## Change Request Workflow (giữa sprint)

Khi spec thay đổi sau sign-off:

```
JP yêu cầu thay đổi → /be-changerequest → Impact analysis + CR document
    → Approval (PM + khách JP) → Cập nhật requirements.md (ghi CR ref)
    → Tạo issue mới hoặc cập nhật issue gốc → Dev workflow bình thường
```

**Không implement trước khi CR được approve.**

---

## Maintenance Mode Workflow

Sau go-live, khi project vào sustain/support phase:

```
Yêu cầu đến → /pm-maintain triage (P1/P2/P3/P4)
    → P1: Hotfix ngay + /ops-incident
    → P2/P3: Dev fix (tiny hoặc normal lane)
    → P4: Batch vào monthly backlog
    → Cuối tháng: /pm-maintain → 月次保守報告書 → gửi JP
```

---

## Handover Workflow

Khi kết thúc project hoặc team member rời:

```
/pm-handover → 引き継ぎ書 VN + JP
    → Handover meeting + walk-through
    → Người tiếp nhận shadow 1-2 sprint
    → Update contact matrix trong CLAUDE.md
```

---

## Tóm tắt Gates quan trọng

| Skill | Gate | Loại |
|-------|------|-------|
| `/dev-analyze` | Chọn phương án | Decision |
| `/dev-implement` | Confirm từng file | Safety |
| `/dev-implement` | Verification + Harness Delta | Quality |
| `/dev-review` | Scope + Verdict | Quality |
| `/dev-pr` | AC coverage + Reviewer | Process |
| `/ops-deploy` | Pre-deploy checklist | Safety |
| `/ba-spec` | Scope + AC confirm | Requirement |

---

## Output Format

Mỗi skill chọn format theo consumer:

| Artifact | Consumer | Format |
|----------|----------|--------|
| `analysis.md`, `requirements.md` | Git, future devs | Markdown |
| Sprint status, regression checklist | Human đang quyết định | HTML |
| JP deliverable (成果物) | Khách Nhật | HTML |
| Chained sang agent | LLM | JSON |

HTML artifact: interactive, sortable, dùng cho one-shot decision. Đẹp hơn Markdown.

---

## Quick Reference: Ai dùng skill nào?

Xem `docs/workflows/role-guide.md`

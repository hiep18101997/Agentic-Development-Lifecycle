---
name: pm-kickoff
description: >
  Bootstrap dự án mới từ đầu (greenfield): chọn tech stack, tạo cấu trúc folder,
  customize CLAUDE.md, khởi tạo docs structure và sprint 0 checklist.
  Trigger khi: user nói "bắt đầu dự án mới", "kickoff project", "greenfield project",
  "setup dự án từ đầu", "project mới cho khách JP", "khởi tạo framework mới", hoặc gõ /pm-kickoff.
---

# Skill: /pm-kickoff
**Role**: PM / Tech Lead / Bridge Engineer  
**Mục đích**: Bootstrap dự án greenfield — từ ý tưởng đến dự án có cấu trúc, docs, và team sẵn sàng sprint 1.

---

## Context

Greenfield project khác brownfield:
- Không có `ba-reverse` — không có codebase cũ để đọc
- Cần quyết định tech stack ngay từ đầu — ảnh hưởng mọi thứ sau
- Khách JP thường expect 基本設計書 trước khi bắt đầu code
- Sprint 0 = setup môi trường + architecture decisions + initial docs

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Thu thập thông tin dự án

Dùng `AskUserQuestion` tool:

- **Loại dự án**: Web app / Mobile app / API / Microservice / Library / Other
- **Khách hàng**: JP outsource / Internal / Other
- **Timeline**: Deadline đầu tiên (format YYYY-MM-DD JST)
- **Team size**: Số dev / QA / BE

**Chờ confirm.**

### Bước 2 — Phân tích yêu cầu và đề xuất tech stack

Dựa trên input từ Bước 1 và context của dự án, đề xuất:

```
## Đề xuất Tech Stack: [Tên dự án]

### Option A: [Tên stack] — [Trade-off chính]
| Layer | Technology | Lý do |
|-------|-----------|-------|
| Frontend | [...] | [...] |
| Backend | [...] | [...] |
| Database | [...] | [...] |
| Cache | [...] | [...] |
| CI/CD | [...] | [...] |
| Hosting | [...] | [...] |

**Phù hợp khi**: [...]
**Trade-off**: [...]

### Option B: [Tên stack] — [Trade-off chính]
[Tương tự]

### Option C: [Tên stack] — [Trade-off chính]
[Tương tự]
```

**Chờ confirm tech stack.**

### Bước 3 — Gate: Architecture decisions

Sau khi chọn tech stack, xác nhận các quyết định kiến trúc ban đầu:

```
## Architecture Decisions cần xác nhận

| # | Quyết định | Option A | Option B | Recommend |
|---|-----------|---------|---------|----------|
| 1 | Auth strategy | JWT stateless | Session-based | JWT (scale tốt hơn) |
| 2 | API style | REST | GraphQL | REST (JP clients quen hơn) |
| 3 | DB schema | Monolithic | Multi-tenant | [tùy dự án] |
| 4 | Deployment | Monorepo | Multi-repo | Monorepo (team nhỏ) |
| 5 | Logging | Structured JSON | Plain text | Structured JSON |

Mỗi quyết định sẽ được ghi vào ADR sau.
```

**Chờ confirm.**

### Bước 4 — Tạo Project Structure

Tạo các files sau (dùng Write tool):

#### 4a. Cập nhật/tạo `CLAUDE.md` cho dự án cụ thể

Bổ sung section "Project Context" vào CLAUDE.md:

```markdown
## Project Context

**Tên dự án**: [Tên]
**Khách hàng**: [Tên JP client]
**Bridge Engineer**: [Tên]
**PM**: [Tên]
**Repo**: [URL]
**Staging**: [URL]
**Production**: [URL]

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| [...] | [...] | [...] |

### Conventions dự án này

- [Naming convention]
- [Branch naming: feature/TASK-XXX-slug]
- [Commit message format]
- [Code review policy]

### ENV Variables (required)

| Variable | Purpose | Source |
|----------|---------|--------|
| DATABASE_URL | DB connection | 1Password / team lead |
| [...] | [...] | [...] |
```

#### 4b. Tạo cấu trúc docs

```
docs/
  tasks/          (gitignored trong framework source, track trong project)
  baseline/
    codebase-overview.md  (empty — điền sau sprint 1-2)
  decisions/
    ADR-001.md    (Tech Stack decision)
    ADR-002.md    (Auth strategy)
    ...
  screens/        (điền khi có design)
  api/            (điền khi có API spec)
  reports/        (release notes, sprint status)
  handover/       (điền khi cần)
  workflows/
    sprint-lifecycle.md  (copy từ framework)
    role-guide.md        (copy từ framework)
```

#### 4c. Tạo ADRs cho các quyết định ở Bước 3

Với mỗi quyết định đã confirm, gọi `/arch-adr` hoặc tạo trực tiếp:

```markdown
# ADR-001: [Tên quyết định]

**Ngày**: [YYYY-MM-DD]
**Status**: Accepted
**Người quyết định**: [Tech Lead + PM]

## Bối cảnh
[Vì sao cần quyết định này]

## Quyết định
[Chọn option nào và tại sao]

## Hệ quả
[Những gì phải làm tiếp theo do quyết định này]
```

### Bước 5 — Sprint 0 Checklist

```
## Sprint 0 Checklist: [Tên dự án]

### Setup môi trường
- [ ] Repo tạo và team được add
- [ ] Branch protection rules (main, develop)
- [ ] CI/CD pipeline chạy được (lint + test + build)
- [ ] Staging environment up
- [ ] ENV variables documented (không phải giá trị — nguồn lấy)
- [ ] Database schema khởi tạo

### Documentation
- [ ] CLAUDE.md đã customize cho dự án
- [ ] ADRs cho tech stack decisions đã viết
- [ ] Glossary JP-VN-EN đã seed với terms đặc thù dự án
- [ ] 基本設計書 draft đã gửi JP (nếu JP client)

### Process
- [ ] GitHub Issues template đã setup
- [ ] Sprint board tạo
- [ ] Team onboarding doc (README hoặc CLAUDE.md)
- [ ] Contact matrix (khách JP + BE + PM VN + team dev)

### Kỹ thuật
- [ ] Linting rules đã config
- [ ] Test framework đã setup (ít nhất 1 test chạy được)
- [ ] Logging format đã thống nhất
- [ ] Error handling pattern đã thống nhất
```

### Bước 6 — Gate cuối

```
## Project Kickoff hoàn tất: [Tên dự án]

Đã tạo:
- CLAUDE.md đã customize
- ADR-001 đến ADR-[N] cho decisions đã confirm
- docs/ structure với đúng folders
- Sprint 0 checklist

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Tech stack có cần điều chỉnh gì không? | A: Không / B: Có — điều chỉnh: ___ / C: Khác: ___ |
| 2 | Cần tạo 基本設計書 gửi JP trước khi bắt đầu code không? | A: Có — chạy /be-bridge tiếp theo / B: Không cần / C: Khác: ___ |
| 3 | Sprint 1 bắt đầu khi nào? | _(Nhập ngày YYYY-MM-DD)_ |

Bước tiếp theo:
- [ ] Team walk-through CLAUDE.md
- [ ] Nếu JP client: /be-bridge để tạo 基本設計書
- [ ] Sprint 1: /pm-breakdown để tạo tasks từ requirements
```

---

## Quy tắc

- Tech stack decision phải có ADR — không quyết định ngầm
- ENV variables: KHÔNG bao giờ commit giá trị thực — chỉ document tên và nguồn lấy
- Nếu JP client: 基本設計書 phải xong và JP confirm trước sprint 1
- CLAUDE.md project section phải được cập nhật khi có thay đổi team/tech

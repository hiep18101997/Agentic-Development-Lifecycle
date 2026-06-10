---
name: ba-reverse
description: >
  Reverse engineer codebase brownfield (legacy/take-over từ vendor cũ) thành tài liệu baseline:
  business overview, tech stack, package inventory, key APIs, technical debt.
  Trigger khi: user nói "reverse engineer codebase", "onboard codebase legacy", "phân tích codebase cũ",
  "take-over từ vendor", "tạo codemap", "brownfield analysis", hoặc gõ /ba-reverse.
---

# Skill: /ba-reverse
**Role**: Business Analyst / Tech Lead  
**Mục đích**: Onboard codebase brownfield (legacy hoặc take-over từ vendor cũ) — sinh tài liệu baseline để team VN có context trước khi nhận maintenance/feature mới.

**Khi nào dùng**:
- Khách JP take-over project từ vendor khác → cần hiểu codebase trước khi commit estimate
- Team VN inherit codebase legacy không có docs
- Audit codebase cũ trước khi quyết định refactor / rebuild

**Khi nào KHÔNG dùng**: Greenfield project (dùng `/ba-spec` từ đầu).

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Xác định scope reverse

```
AskUserQuestion({
  questions: [
    {
      question: "Mục tiêu reverse engineer là gì?",
      header: "Goal",
      multiSelect: false,
      options: [
        { label: "Take-over đầy đủ", description: "Chuẩn bị nhận maintenance — cần hiểu toàn bộ" },
        { label: "Estimate scope mới", description: "Chỉ cần overview để estimate feature mới — không deep-dive" },
        { label: "Audit refactor", description: "Đánh giá technical debt để quyết định refactor/rebuild" }
      ]
    },
    {
      question: "Phạm vi codebase?",
      header: "Scope",
      multiSelect: false,
      options: [
        { label: "Toàn bộ repo", description: "Quét mọi package/module" },
        { label: "Subset cụ thể", description: "User chỉ định path/module" },
        { label: "Single service", description: "Chỉ 1 service trong monorepo" }
      ]
    }
  ]
})
```

**Chờ confirm.**

### Bước 2 — Spawn subagent để scan (tránh nhồi context chính)

Dùng **Explore subagent** (read-only, fast) để khảo sát song song:

```
Agent({
  description: "Codebase scout for reverse engineering",
  subagent_type: "Explore",
  prompt: "Scan codebase tại [scope]. Tìm và report theo cấu trúc:
    1. Languages + frameworks (đọc package.json/pom.xml/requirements.txt/go.mod...)
    2. Top-level package structure (max 3 cấp)
    3. Entry points (main, server start, CLI)
    4. Database schemas (migrations folder, ORM models)
    5. External integrations (API clients, SDK imports)
    6. Test coverage signals (test folder size, CI config)
    7. Code quality red flags (TODO/FIXME density, file size outliers)
  Report dưới 600 từ, kèm file path:line cho mỗi finding quan trọng."
})
```

### Bước 3 — Gate: Trình bày findings + xác nhận hướng đào sâu

```
## Tôi đã scan codebase. Findings ban đầu:

**Tech stack**: [...]
**Architecture pattern**: [Monolith / Microservices / Modular monolith]
**Entry points**: [...]
**Red flags phát hiện**: [Top 3 technical debt — file:line]

## Trước khi sinh tài liệu baseline, tôi cần xác nhận:
```

```
AskUserQuestion({
  questions: [
    {
      question: "Mức độ chi tiết của codemap?",
      header: "Depth",
      multiSelect: false,
      options: [
        { label: "Overview (1 page)", description: "Architecture diagram + tech stack — đủ cho estimate" },
        { label: "Standard (5-10 page)", description: "+ package inventory + API list + DB schema — đủ cho take-over" },
        { label: "Deep (20+ page)", description: "+ data flow + business rules suy ra từ code — đủ cho rebuild" }
      ]
    },
    {
      question: "Ngôn ngữ output?",
      header: "Lang",
      multiSelect: false,
      options: [
        { label: "Tiếng Việt", description: "Cho team VN" },
        { label: "Song ngữ VN-JP", description: "Có khách JP review — cần `/be-bridge` review sau" },
        { label: "English", description: "Cho team mixed" }
      ]
    }
  ]
})
```

**Chờ confirm.**

### Bước 4 — Sinh baseline docs

Trước khi viết bất kỳ file nào, lấy commit baseline hiện tại:

```bash
git log -1 --format="%h %s"   # short-sha + commit message
```

Dùng kết quả để điền vào `generatedFrom` (short-sha) và `generatedAt` (timestamp JST tại thời điểm chạy skill).

Tạo folder `docs/baseline/` (nếu chưa có) và viết:

**`docs/baseline/codebase-overview.md`** — luôn tạo:
```markdown
---
generatedAt: [YYYY-MM-DD HH:mm JST]
generatedFrom: [short-sha]
scope: [path scanned]
---

# Codebase Overview — [Project Name]

## 1. Business Context (suy ra từ code)
[Mô tả app làm gì, dựa trên route names + DB tables + UI labels]

## 2. Tech Stack
| Layer | Technology | Version | Notes |

## 3. Architecture
[ASCII/Mermaid diagram + 1 đoạn mô tả]

## 4. Package Inventory
[Top 10 package quan trọng nhất + 1 dòng mô tả mỗi cái]

## 5. Entry Points
[Cách app khởi động — main file, server start, CLI commands]

## 6. External Integrations
[API/SDK/MQ external mà code đang gọi]

## 7. Database
[Schema overview — tables chính, relationships]

## 8. Code Quality Assessment
- **Test coverage signal**: [folder size ratio, CI badge nếu có]
- **Technical debt** (top 5 hotspot — file:line + lý do)
- **Security red flags** (hardcoded secrets, outdated deps — chỉ flag, không fix)

## 9. Unknown / Cần khách hàng làm rõ
- [Q1: Có spec gốc không?]
- [Q2: Module X mục đích nghiệp vụ?]
```

**Optional** (nếu Standard/Deep depth):
- `docs/baseline/api-inventory.md` — list endpoints + nguồn gốc trong code
- `docs/baseline/db-schema.md` — tables + relationships

**Audit**: append entry vào `docs/baseline/audit.md` (template: `templates/audit.md`).

### Bước 5 — Gate cuối: Review + handoff

```
## Baseline docs đã tạo:
- docs/baseline/codebase-overview.md ([N] sections)
- [other files nếu có]

**Findings nổi bật cần khách hàng/PM biết**:
1. [Top finding 1 — vd: 30% code không có test]
2. [Top finding 2 — vd: dùng framework EOL từ 2022]
3. [Top finding 3 — vd: 15 endpoints không document]

## Bước tiếp theo:
- Nếu **Take-over**: dùng `/be-bridge` review docs + format JP trước khi gửi khách
- Nếu **Estimate scope mới**: dùng `/ba-spec` với context từ codebase-overview.md
- Nếu **Audit refactor**: dùng `/arch-adr` để document quyết định refactor/rebuild
```

---

## Lưu ý quan trọng

- **Không tự suy diễn business rule** mà không có evidence trong code → đánh dấu `[?]` và đưa vào "Unknown" section
- **Không fix gì** trong skill này — chỉ document. Fix là việc của `/dev-implement` hoặc refactor task riêng
- **Không expose secrets** dù tìm thấy — chỉ flag "hardcoded credential at file:line" mà không paste content
- **Luôn dùng Explore subagent** cho scan — không scan trong main context để tránh nhồi token
- **Output `docs/baseline/`** — phân biệt với `docs/screens/` (screen baseline) và `docs/api/` (API baseline cho feature mới)
- **Re-run sau N tháng**: nếu codebase thay đổi nhiều, append section `## Drift since [date] · commit=[short-sha]` thay vì overwrite. Cập nhật frontmatter:
  ```yaml
  generatedAt: [original date]
  generatedFrom: [original short-sha]
  updatedAt: [YYYY-MM-DD HH:mm JST]
  updatedCommit: [new short-sha]
  ```

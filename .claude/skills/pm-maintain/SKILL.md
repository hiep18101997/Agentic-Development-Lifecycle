---
name: pm-maintain
description: >
  Workflow nhẹ cho dự án trong giai đoạn maintenance/sustain — sau go-live, chỉ còn
  bug fixes và minor improvements, không có active development sprint.
  Trigger khi: user nói "dự án đang maintenance", "chế độ bảo trì", "post go-live support",
  "sustain phase", "không có sprint mới chỉ fix bug", hoặc gõ /pm-maintain.
---

# Skill: /pm-maintain
**Role**: PM / Dev / BE  
**Mục đích**: Workflow tối giản cho giai đoạn maintenance — đủ control mà không overhead như active sprint.

---

## Context

Maintenance phase khác active development:
- Không có sprint planning / backlog grooming thường xuyên
- Requests đến theo kiểu "ad-hoc" — khách JP email bug report bất kỳ lúc
- Team nhỏ hơn — thường 1-2 dev + 1 BE part-time
- JP outsource: SLA / 保守契約 quy định response time và fix time
- Cần track history rõ để billing / báo cáo tháng cho khách

---

## Maintenance Workflow

```
JP Bug Report / Request
    → Triage (classify + priority)
    → Fix (tiny: patch trực tiếp / normal: dev-analyze → implement)
    → QA verify
    → Release (hotfix hoặc monthly batch)
    → 月次報告書 (monthly report gửi JP)
```

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Xác định loại yêu cầu

Dùng `AskUserQuestion` tool:

- **Loại**: Bug fix / Minor improvement / Performance issue / Security patch / Question từ JP
- **Source**: Khách JP báo / User báo / Monitoring alert / Internal discovery
- **SLA**: Có SLA obligation không? Response time yêu cầu?

**Chờ confirm.**

### Bước 2 — Triage

Classify theo Maintenance Priority Matrix:

```
## Triage: [Tên vấn đề]

**Priority**: P1 / P2 / P3 / P4

| Priority | Định nghĩa | Target fix time |
|----------|-----------|----------------|
| P1 — Critical | Production down / Data loss / Security breach | Fix ngay, trong ngày |
| P2 — High | Feature broken, workaround khó | Fix trong 1-3 ngày |
| P3 — Medium | Feature broken, có workaround | Fix trong 1-2 tuần |
| P4 — Low | UI glitch / minor inconvenience | Batch vào monthly release |

**Classification**: [P1/P2/P3/P4]
**Lý do**: [...]
**Assignee**: [Dev name]
**Fix deadline (JST)**: [Date]
```

### Bước 3 — Fix workflow theo priority

#### P1 — Critical (Hotfix)

```
P1 Hotfix Protocol:
1. Thông báo BE ngay → BE notify khách JP trong 30 phút
2. Dev fix (dùng tiny lane — patch trực tiếp)
3. QA quick verify (smoke test)
4. Deploy hotfix ngay
5. Post-mortem: ghi vào docs/reports/incident-[date].md
6. Gửi 障害報告書 cho khách JP (dùng /ops-incident)
```

#### P2/P3 — Normal fix

Áp dụng dev workflow rút gọn:

```
Với task có analysis.md (normal risk):
  /dev-analyze → /dev-implement → /dev-review → /dev-pr → merge → deploy

Với patch nhỏ (tiny):
  Fix trực tiếp → /dev-review → /dev-pr → merge → batch vào monthly release
```

#### P4 — Batch vào monthly release

Ghi vào `docs/maintenance/[YEAR-MONTH]-backlog.md`:

```markdown
# Maintenance Backlog: [YYYY-MM]

| ID | Mô tả | Reporter | Priority | Status |
|----|-------|----------|----------|--------|
| M-001 | [...] | [JP client / internal] | P4 | Open |
```

### Bước 4 — Monthly Report

Tạo `docs/reports/monthly-[YYYY-MM].md` dùng template `templates/monthly-maintenance-report.md`.

Điền vào 5 mục:
1. **Mục tiêu và kết quả tháng này** — SLA %, bug resolve, CR thực hiện so với mục tiêu
2. **Công việc thực hiện** — liệt kê mọi task/CR với ID, loại, effort 人日, kết quả
3. **Sự cố/Vấn đề** — liệt kê sự cố với severity, tóm tắt RCA, trạng thái; tính MTTR
4. **Trạng thái hệ thống** — đánh giá Performance/Security/Dependencies/Backup
5. **Kế hoạch tháng tới** — liệt kê công việc với priority và estimate; ghi rủi ro nếu có

BE review phần Japanese trước khi gửi khách JP.

### Bước 5 — Gate cuối

```
## Maintenance task hoàn tất.

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Task này cần ghi vào monthly report không? | A: Có — đã add vào backlog / B: Không — P1/P2 hotfix, report riêng / C: Khác: ___ |
| 2 | Cần notify khách JP về fix này không? | A: Có — BE sẽ email / B: Không cần / C: Đợi monthly report / D: Khác: ___ |
| 3 | Cần cập nhật baseline docs không? | A: Có — chạy /docs-update / B: Không thay đổi spec / C: Khác: ___ |
```

---

## Quy tắc

- P1: Thông báo khách JP trước khi fix xong — không im lặng
- Mọi fix đều cần ticket (GitHub Issue) — dù nhỏ — để billing và monthly report
- Monthly report gửi vào ngày làm việc đầu tiên của tháng sau (JST)
- Khi monthly man-hours vượt 保守契約 limit → alert PM ngay để thương lượng CR

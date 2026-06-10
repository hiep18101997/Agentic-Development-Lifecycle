---
name: pm-dashboard
description: >
  Generate a static HTML dashboard showing sprint kanban, task health, and improvement backlog.
  Trigger when: user says "tạo dashboard", "xem tiến độ sprint", "sprint overview",
  "show dashboard", "generate dashboard", "view sprint progress", or type /pm-dashboard.
---

# Skill: /pm-dashboard
**Role**: Project Manager / All roles  
**Purpose**: Create `docs/dashboard.html` — kanban view + health table + improvement backlog — read from existing `docs/tasks/*/`. Open in a browser, no server needed.

---

## Execution Guide

### Step 1 — Run the generator

```bash
node bin/dashboard.js
```

Default output: `docs/dashboard.html`

Custom path:
```bash
node bin/dashboard.js --out /tmp/sprint-review.html
```

### Step 2 — Open the dashboard

Open the generated file in a browser:
- Windows: `start docs/dashboard.html`
- Mac: `open docs/dashboard.html`
- Linux: `xdg-open docs/dashboard.html`

### Step 3 — Results Report

```
Dashboard created: docs/dashboard.html

Contents:
- [N] tasks in docs/tasks/
- Kanban: Discovery → Planning → Dev → Review → QA/Done
- Sprint health table (sortable/filterable)
- [N] improvement backlog items

Open the file in a browser to view. Re-run `node bin/dashboard.js` anytime to refresh.
```

---

## Notes

- Dashboard is a **static snapshot** — must re-run to update when task state changes
- Status is derived from file presence in `docs/tasks/[ID]/`:
  - `requirements.md` only → Discovery
  - `+ analysis.md` → Planning
  - `+ verification.md` → Dev / Pending PR
  - `+ pr.md` → In Review
  - `+ test-plan.md` → QA / Done
- Risk lane parsed from `Lane: tiny|normal|high-risk` in `analysis.md`
- `docs/dashboard.html` can be committed (useful snapshot) or gitignored (team preference)
- Dashboard sections: Stats KPIs · Kanban · Activity timeline (audit + git) · Validation health doughnut · Skill heatmap · Growth counters · Sprint health table · Improvement backlog
- `npm run dashboard:watch` — auto-regen on file changes; manual browser reload (F5)

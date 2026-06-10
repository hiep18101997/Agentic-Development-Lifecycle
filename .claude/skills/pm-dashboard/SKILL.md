---
name: pm-dashboard
description: >
  Generate static HTML dashboard showing sprint kanban, task health, and improvement backlog.
  Trigger khi: user nói "tạo dashboard", "xem tiến độ sprint", "sprint overview",
  "show dashboard", "generate dashboard", hoặc gõ /pm-dashboard.
---

# Skill: /pm-dashboard
**Role**: Project Manager / All roles  
**Mục đích**: Tạo file `docs/dashboard.html` — kanban view + health table + improvement backlog — đọc từ `docs/tasks/*/` hiện có. Mở bằng browser, không cần server.

---

## Hướng dẫn thực hiện

### Bước 0 — Confirm scope

Trước khi generate, trình bày:
- Sẽ scan: `docs/tasks/*/` (tất cả task folder hiện có)
- Sẽ ghi: `docs/dashboard.html` (hoặc custom `--out` path)
- Sẽ overwrite file dashboard.html cũ nếu đã tồn tại

**Chờ confirm.** Tiếp tục generate?

### Bước 1 — Chạy generator

```bash
node bin/dashboard.js
```

Output mặc định: `docs/dashboard.html`

Custom path:
```bash
node bin/dashboard.js --out /tmp/sprint-review.html
```

### Bước 2 — Mở dashboard

Mở file vừa gen trong browser:
- Windows: `start docs/dashboard.html`
- Mac: `open docs/dashboard.html`
- Linux: `xdg-open docs/dashboard.html`

### Bước 3 — Báo kết quả

```
Dashboard đã tạo: docs/dashboard.html

Nội dung:
- [N] tasks trong docs/tasks/
- Kanban: Discovery → Planning → Dev → Review → QA/Done
- Sprint health table (sortable/filterable)
- [N] improvement backlog items

Mở file trong browser để xem. Re-run `node bin/dashboard.js` bất cứ lúc nào để refresh.
```

---

## Notes

- Dashboard là **snapshot tĩnh** — phải re-run để cập nhật khi task state thay đổi
- Status derive từ file presence trong `docs/tasks/[ID]/`:
  - `requirements.md` only → Discovery
  - `+ analysis.md` → Planning
  - `+ verification.md` → Dev / Pending PR
  - `+ pr.md` → In Review
  - `+ test-plan.md` → QA / Done
- Risk lane parse từ `Lane: tiny|normal|high-risk` trong `analysis.md`
- `docs/dashboard.html` có thể commit (snapshot hữu ích) hoặc gitignore (tuỳ team)
- Dashboard sections: Stats KPIs · Kanban · Activity timeline (audit + git) · Validation health doughnut · Skill heatmap · Growth counters · Sprint health table · Improvement backlog
- `npm run dashboard:watch` — auto-regen khi file thay đổi; reload browser thủ công (F5)

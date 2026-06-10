---
name: docs-project
description: >
  Cập nhật tài liệu dự án: README, workflow guides, hướng dẫn cài đặt, install scripts, CLAUDE.md.
  Khác với /docs-update (baseline screen/API sau task) — skill này dành cho project-level docs.
  Trigger khi: user nói "cập nhật README", "update hướng dẫn cài đặt", "sửa workflow guide",
  "update install script", "cập nhật CLAUDE.md", "sync project docs", hoặc gõ /docs-project.
---

# Skill: /docs-project
**Role**: Developer / Tech Lead / DevOps  
**Mục đích**: Đồng bộ tất cả tài liệu project-level (README, guides, install scripts, CLAUDE.md) với trạng thái thực tế của codebase.

---

## Phân biệt với /docs-update

| Skill | Dùng cho | Trigger |
|-------|----------|---------|
| `/docs-update` | Baseline screen + API docs sau task verify | Sau mỗi task merge |
| `/docs-project` | README, workflow, install, CLAUDE.md | Khi project thay đổi lớn |

---

## Hướng dẫn thực hiện

### Bước 1 — Xác định scope

Đọc các file sau để hiểu trạng thái hiện tại:
- `README.md` (hoặc `README.vi.md` nếu có)
- `CLAUDE.md`
- `docs/workflows/*.md`
- `bin/install.js`, `setup.sh`, `setup.ps1` (nếu có)
- `package.json` (scripts, version, dependencies)
- `pubspec.yaml` (nếu Flutter project)
- `.claude/settings.json`

Dùng `AskUserQuestion` tool để hỏi:

- **Loại update**: Bạn muốn cập nhật phần nào?
  - `README` — nội dung giới thiệu, quick start, badges
  - `Workflow guides` — docs/workflows/*.md (sprint lifecycle, role guide)
  - `Install scripts` — bin/install.js, setup.sh, setup.ps1
  - `CLAUDE.md` — skill commands, cấu trúc thư mục, project context
  - `Tất cả` — scan toàn bộ và đề xuất những gì lỗi thời

- **Nguồn thay đổi**: Thay đổi đến từ đâu?
  - Code/feature mới vừa merge
  - Skill commands mới được thêm
  - Team/process thay đổi
  - Onboarding developer mới (cần review toàn bộ)

**Chờ confirm.**

---

### Bước 2 — Audit: Tìm nội dung lỗi thời

Với mỗi file trong scope, so sánh nội dung hiện tại với thực tế:

**README audit checklist:**
- [ ] Version number / badges còn đúng không?
- [ ] Quick start steps có chạy được không? (test từng lệnh)
- [ ] Prerequisites list có thiếu tool nào mới không?
- [ ] Screenshot/demo có lỗi thời không?
- [ ] Link đến docs có còn valid không?

**CLAUDE.md audit checklist:**
- [ ] Skill commands table có đủ 22+ skills không?
- [ ] Cấu trúc thư mục có khớp với `ls .claude/skills/` không?
- [ ] Subagent table trong `agents/` có đúng không?
- [ ] Project Context có cần update project name / repo URL không?

**Workflow guides audit checklist:**
- [ ] `docs/workflows/sprint-lifecycle.md` — process còn đúng không?
- [ ] `docs/workflows/role-guide.md` — có role mới chưa được thêm không?
- [ ] Workflow có tham chiếu skill command đã đổi tên không?

**Install scripts audit checklist:**
- [ ] `bin/install.js` — danh sách files copy có đủ skill mới không?
- [ ] `setup.sh` / `setup.ps1` — dependencies có đúng version không?
- [ ] `package.json` scripts có phản ánh đúng workflow install không?
- [ ] `npx` command trong README có chạy được không?

---

### Bước 3 — Đề xuất thay đổi

Với mỗi file cần update, trình bày theo format:

```
## 📄 [Tên file]

**Vấn đề tìm thấy:**
- [Mô tả nội dung lỗi thời / sai / thiếu]

**Đề xuất thay đổi:**

--- HIỆN TẠI ---
[Nội dung cần xóa/sửa]

--- ĐỀ XUẤT ---
[Nội dung mới]

**Lý do:** [Giải thích ngắn gọn tại sao cần thay đổi]
```

Nếu cần thêm section mới (không phải sửa): trình bày full nội dung mới, đề xuất vị trí insert.

**Chờ confirm từng file trước khi apply.**

---

### Bước 4 — Gate: Review từng thay đổi

Dùng `AskUserQuestion` tool cho mỗi file:

- **Nội dung đề xuất**: Có chính xác và đủ không?
- **Tone/ngôn ngữ**: Phù hợp với audience (developer nội bộ / end user / khách JP)?
- **Có bỏ sót gì không?**

**Chờ confirm trước khi ghi file.**

---

### Bước 5 — Apply và verify

Sau khi user confirm, apply từng thay đổi:

1. **Edit files** — dùng Edit tool, không rewrite toàn bộ file trừ khi cần thiết
2. **Verify links** — kiểm tra internal links (relative paths) sau khi sửa
3. **Verify install script** — nếu `bin/install.js` thay đổi, check danh sách `FILES_TO_COPY`:
   ```bash
   node bin/install.js --dry-run 2>/dev/null || echo "dry-run not supported, review manually"
   ```
4. **Check README quick start** — nếu lệnh quick start thay đổi, verify syntax đúng

---

### Bước 6 — Tạo commit

Sau khi tất cả files đã update và verify:

```bash
git add README.md CLAUDE.md docs/workflows/ bin/install.js setup.sh setup.ps1
git status
```

Đề xuất commit message theo convention:

```
docs: sync project docs với [tên feature/thay đổi]

- README: [tóm tắt thay đổi]
- CLAUDE.md: [tóm tắt thay đổi]  
- docs/workflows/: [tóm tắt thay đổi]
- bin/install.js: [tóm tắt thay đổi]
```

**Hỏi user trước khi commit** — không tự commit.

---

### Bước 7 — Thông báo team (tuỳ chọn)

Nếu thay đổi ảnh hưởng đến onboarding flow (install script, README quick start), đề xuất:

- Tạo GitLab/GitHub issue để thông báo team re-install
- Post vào channel Slack/Teams tương ứng
- Nếu là breaking change trong `npx` install: bump version trong `package.json`

---

## Nguyên tắc

- **Không tự động commit** — luôn show diff và chờ confirm
- **Edit, không rewrite** — giữ lại nội dung đúng, chỉ sửa phần sai
- **Verify sau khi sửa** — đặc biệt với install scripts và links
- **Audience-aware** — README cho end user khác với CLAUDE.md cho AI
- **Tiếng Việt cho tài liệu nội bộ** — README có thể song ngữ nếu có khách JP

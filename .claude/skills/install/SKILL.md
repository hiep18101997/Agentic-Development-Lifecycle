---
name: install
description: >
  Cài Agentic Development Lifecycle framework vào project hiện tại — copy commands, agents, templates, workflows.
  Không dùng shell, chỉ dùng Glob/Read/Write tools.
  Trigger khi: user nói "cài framework", "install skill pack", "setup ADL framework",
  "copy commands vào project", hoặc gõ /install.
---

# Skill: /install
**Mục đích**: Cài framework vào project hiện tại. Dùng file tools của Claude (không chạy shell) để tránh permission classifier block.

---

## Input

Không cần argument. Skill tự detect:
- **Source**: thư mục chứa framework này (nơi file `/install/SKILL.md` tọa lạc = `[SOURCE]/.claude/skills/`)
- **Target**: working directory hiện tại của Claude Code session

---

## Hướng dẫn thực hiện

### Bước 0 — Xác định paths

Dùng Glob/Read để tìm:
- Source root: thư mục cha 2 cấp của file này (`../../` từ vị trí file này)
- Target root: `$PWD` của session hiện tại (từ working directory)

Hiển thị để user xác nhận:
```
Source : [SOURCE_PATH]
Target : [TARGET_PATH]
```

```
AskUserQuestion({
  questions: [
    {
      question: "Xác nhận cài đặt framework từ Source vào Target ở trên?",
      header: "Confirm",
      multiSelect: false,
      options: [
        { label: "Cài đặt", description: "Tiếp tục copy commands/agents/templates/workflows vào Target" },
        { label: "Hủy", description: "Dừng lại, không cài đặt gì" }
      ]
    }
  ]
})
```

**Chờ confirm trước khi tiếp tục.**

### Bước 1 — Copy `.claude/skills/`

Dùng Glob để list tất cả file trong `[SOURCE]/.claude/skills/**/SKILL*.md`. Skills là flat folders, mỗi folder chứa SKILL.md (VN) + SKILL.en.md + SKILL.ja.md.

Với mỗi file:
- Compute đường dẫn target: `[TARGET]/.claude/skills/[relative_path]`
- Nếu target file đã tồn tại → báo `[SKIP]`, không ghi đè
- Nếu chưa tồn tại → dùng Read + Write để copy

Báo cáo từng file: `[OK]` hoặc `[SKIP]`.

### Bước 2 — Copy `agents/`

Glob `[SOURCE]/agents/*.md`. Copy từng file sang `[TARGET]/agents/`.  
Skip nếu đã tồn tại.

### Bước 3 — Copy `templates/`

Glob TẤT CẢ file trong `[SOURCE]/templates/` (cả `.md` và `.html`). Copy từng file sang `[TARGET]/templates/`.  
Skip nếu đã tồn tại.

### Bước 4 — Copy `docs/workflows/`

Glob `[SOURCE]/docs/workflows/*.md`. Copy sang `[TARGET]/docs/workflows/`.  
Skip nếu đã tồn tại.

### Bước 4b — Copy framework doc files

Với mỗi file:
- `docs/risk-classifier.md`
- `docs/validation-matrix.md`

Read từ `[SOURCE]/docs/[FILE]`, Write sang `[TARGET]/docs/[FILE]`.  
Skip nếu target đã tồn tại.

### Bước 4c — Copy `docs/improvement-backlog.md` (user-mutable)

CHỈ copy nếu `[TARGET]/docs/improvement-backlog.md` CHƯA tồn tại.  
File này user tự cập nhật sau task — TUYỆT ĐỐI không ghi đè dù với lý do gì.

### Bước 4d — Copy `docs/analysis/`

Glob `[SOURCE]/docs/analysis/*.md`. Copy sang `[TARGET]/docs/analysis/`.  
Skip nếu file đã tồn tại.

### Bước 5 — Tạo empty doc dirs

Kiểm tra và tạo (nếu chưa có) các file `.gitkeep` trong:
- `[TARGET]/docs/api/.gitkeep`
- `[TARGET]/docs/screens/.gitkeep`
- `[TARGET]/docs/tasks/.gitkeep`
- `[TARGET]/docs/decisions/.gitkeep`

Dùng Write tool với content rỗng.

### Bước 6 — Copy `CLAUDE.md`

- Nếu `[TARGET]/CLAUDE.md` đã tồn tại → báo `[SKIP] CLAUDE.md đã tồn tại — merge thủ công`, in path source để tham khảo
- Nếu chưa → Read + Write

---

## Báo cáo kết quả

```
## Kết quả cài đặt

.claude/skills/               [OK/SKIP mỗi file]
agents/                       [OK/SKIP]
templates/                    [OK/SKIP] (md + html)
docs/workflows/               [OK/SKIP]
docs/ (framework files)       [OK/SKIP] (risk-classifier, validation-matrix)
docs/improvement-backlog.md   [OK/SKIP]
docs/analysis/                [OK/SKIP]
docs/ (empty dirs)            [OK/SKIP] (api, screens, tasks, decisions)
CLAUDE.md                     [OK/SKIP]

Bước tiếp theo:
1. Mở CLAUDE.md, cập nhật section "Project Context" (project name, khách hàng, repo URL, tech stack)
2. Gõ / để xem commands có sẵn: /pm-ideate  /ba-spec  /dev-analyze  /qa-testplan ...
```

---

## Lưu ý

- Skill này KHÔNG dùng PowerShell/Bash — chỉ dùng Glob, Read, Write tools của Claude Code
- Không ghi đè file đã tồn tại — luôn Skip và báo user merge thủ công
- `docs/improvement-backlog.md` là user-mutable — không bao giờ ghi đè dù user yêu cầu re-install
- Nếu working directory = source directory → báo lỗi, không cài

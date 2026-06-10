---
name: pm-breakdown
description: >
  Phân rã Epic/User Stories thành Tasks cụ thể với estimate, tạo GitHub/GitLab Issues chuẩn.
  Trigger khi: user nói "breakdown epic", "tạo tasks từ story", "phân rã feature",
  "tạo github issues", "tạo gitlab issues", "sprint planning", "estimate tasks", hoặc gõ /pm-breakdown.
---

# Skill: /pm-breakdown
**Role**: Project Manager  
**Mục đích**: Phân rã Epic/User Stories thành Tasks cụ thể, tạo GitHub/GitLab Issues với template chuẩn.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc input

Nhận vào: Epic description, User Stories, hoặc yêu cầu trực tiếp từ PM.  
Đọc `docs/tasks/[TASK-ID]/requirements.md` nếu có.

### Bước 2 — Gate: Clarify trước khi breakdown

Dùng `AskUserQuestion` tool với các câu hỏi sau:

- **Platform**: Bạn dùng platform nào để tạo issues?
  - `GitHub (gh CLI / MCP)` — dùng `gh issue create` hoặc GitHub MCP tools
  - `GitLab (glab CLI)` — dùng `glab issue create`
  - `Chỉ generate markdown` — không tạo issue tự động

- **Capacity**: Sprint này có bao nhiêu dev và capacity (人日 hoặc story points)?

- **Milestone**: Có milestone/deadline cụ thể không? (để gắn vào issue)

- **Labels**: Team đang dùng label convention nào? (ví dụ: `backend`, `flutter`, `P0`, `testing`)

**Chờ confirm.**

### Bước 3 — Đề xuất task breakdown (2-3 phương án)

```
## Tôi có [N] phương án breakdown:

### Phương án A: [Tên] — [Ưu điểm chính]
[Task list với estimate]
- Ưu: [...]
- Nhược: [...]

### Phương án B: [Tên] — [Ưu điểm chính]  
[Task list với estimate]
- Ưu: [...]
- Nhược: [...]

**Đề xuất của tôi**: Phương án [X] vì [lý do].  
Bạn muốn chọn phương án nào, hoặc kết hợp?
```

### Bước 4 — Tạo GitHub Issue format

Sau khi PM confirm, tạo nội dung issue sử dụng template `templates/github-issue.md`.

Điền vào các trường:
- **TASK-ID** và tên task từ breakdown
- **Type**: Feature / Bug / Tech Debt / Refactor
- **Priority**: High / Medium / Low (đã quyết định ở Bước 3)
- **Estimate**: từ estimate đã chốt
- **Sprint**: Sprint N hiện tại
- **Acceptance Criteria**: từ requirements.md của task
- **Technical Notes**: những điểm kỹ thuật quan trọng cho dev
- **Labels**: theo convention team đã chọn ở Bước 2

### Bước 5 — Gate cuối trước khi tạo

Dùng `AskUserQuestion` tool:

- **Review list**: Liệt kê [N] issues đã chuẩn bị — issue nào cần adjust priority hoặc estimate?
- **Dependencies**: Thứ tự tạo issue có phụ thuộc vào nhau không?
- **Confirm tạo**: Tạo tất cả, hay chọn từng issue?

**Chờ confirm.**

---

### Bước 6 — Tạo issues trên platform

#### Nếu chọn GitLab (`glab` CLI)

Kiểm tra `glab` đã auth chưa:
```bash
glab auth status
```

Tạo từng issue theo template (chạy tuần tự, không batch):
```bash
glab issue create \
  --title "[TASK-ID] Tên task" \
  --description "$(cat <<'EOF'
## Mô tả
[Mô tả task]

## Liên kết
- Spec: docs/tasks/[TASK-ID]/requirements.md

## Acceptance Criteria
- [ ] AC-001: ...
- [ ] AC-002: ...

## Definition of Done
- [ ] Code complete + unit tests pass
- [ ] Code review approved
- [ ] Demo cho BA/PM
EOF
)" \
  --label "P0,backend,flutter" \
  --assignee "username" \
  --milestone "Sprint N"
```

Sau mỗi issue tạo thành công, in ra URL issue để confirm:
```
✅ Issue tạo thành công: https://gitlab.com/[org]/[repo]/-/issues/[number]
```

Nếu `glab` chưa có hoặc chưa auth, hướng dẫn:
```bash
# Cài glab
brew install glab          # macOS
# hoặc: https://gitlab.com/gitlab-org/cli#installation

# Auth
glab auth login
```

#### Nếu chọn GitHub (`gh` CLI hoặc MCP)

Dùng `gh issue create`:
```bash
gh issue create \
  --title "[TASK-ID] Tên task" \
  --body "$(cat issue-body.md)" \
  --label "P0,backend" \
  --assignee "username" \
  --milestone "Sprint N"
```

Hoặc dùng GitHub MCP tool `mcp__github__issue_write` nếu có sẵn trong session.

#### Nếu chọn chỉ generate markdown

Output file `docs/tasks/sprint-[N]-issues.md` chứa toàn bộ nội dung issues, sẵn sàng paste thủ công.

---

## Lưu ý

- Mỗi issue phải self-contained: dev đọc xong hiểu ngay mà không cần hỏi thêm.
- Link đến docs luôn dùng relative path trong repo.
- Task ID format: `[PROJECT-XXX]` — customize theo convention của team.
- `glab` cần được auth với token có quyền `api` scope trên GitLab project.
- Với GitLab self-hosted: set `GITLAB_HOST` hoặc dùng `glab auth login --hostname gitlab.your-company.com`.

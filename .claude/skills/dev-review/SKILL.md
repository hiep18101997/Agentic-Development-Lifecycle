---
name: dev-review
description: >
  Review toàn diện code sau implement: code quality, architecture, performance, security trong 1 lần chạy.
  Thay thế việc phải chạy /arch-review + /sec-review riêng lẻ sau dev-implement.
  Trigger khi: user nói "review code", "review trước merge", "check code xem ổn không",
  "code review", "review implementation", "kiểm tra code", hoặc gõ /dev-review.
---

# Skill: /dev-review
**Role**: Developer / Tech Lead  
**Mục đích**: Review toàn diện sau `dev-implement` — code quality, architecture, performance, security — trong 1 lần chạy. Kết quả là quyết định Approve / Request Changes trước khi chạy `/dev-pr`.

---

## Hướng dẫn thực hiện

### Bước 1 — Thu thập context (subagent)

**Independent Harness Review (opt-in):**

Nếu team có sẵn CLI/model khác ngoài harness đang chạy `/dev-review` này (ví dụ: code được implement bằng Claude Code nhưng máy có sẵn Codex CLI, Copilot CLI, hoặc OpenCode đã cấu hình) — khuyến nghị chạy review đó bằng công cụ **khác** thay vì cùng session/model đã implement, để giảm rủi ro "tự review chính mình" (reviewer blind-spot). Đây là gợi ý advisory, hoàn toàn opt-in — `/dev-review` không thể tự gọi CLI của vendor khác. Nếu chọn chạy cross-harness: thực hiện thủ công ở công cụ đó, sau đó quay lại ghi rõ harness nào đã review vào field `harness` của `review-log.md` (xem Bước 6). Nếu bỏ qua, tiếp tục review trong session hiện tại như bình thường.

**Kiểm tra review round trước (nếu có):**

Tìm `docs/tasks/[TASK-ID]/review-log-R*.md`. Nếu tồn tại:
- Load danh sách `B-xx` (Blocking) từ round gần nhất
- Dùng list đó để verify từng item đã được fix trong diff hiện tại
- Báo cáo rõ: `B-01 ✅ fixed` / `B-01 ❌ still present`

**Xác định base branch trước khi spawn:**

Kiểm tra theo thứ tự:
1. User cung cấp base branch trong lệnh (ví dụ: `/dev-review develop`)
2. Đọc `git remote show origin` để detect default branch
3. Nếu vẫn không rõ → dùng `AskUserQuestion` hỏi base branch trước khi tiếp tục

Spawn `review-reader` agent (model: haiku) theo `agents/review-reader.md` với input:

```
GIT DIFF:
[git diff <BASE_BRANCH>..HEAD]

BASE_BRANCH: <tên branch đã xác định>

ANALYSIS PATH:
docs/tasks/[TASK-ID]/analysis.md

VERIFICATION PATH:
docs/tasks/[TASK-ID]/verification.md
```

Agent trả về JSON với `code_signals`, `arch_signals`, `security_signals`, `review_priority`, `intent_alignment`. Dùng kết quả này làm input cho Bước 3.

**Fallback nếu agent fail** (timeout, diff quá lớn, lỗi spawn): bỏ qua subagent, chạy thủ công 7 grep patterns từ `agents/review-reader.md` trực tiếp trên diff và tiếp tục Bước 3 với kết quả grep thô.

Nếu không có TASK-ID → dùng `git diff HEAD~1` (áp dụng cho standalone commit, không phải feature branch). Nếu analysis.md không tồn tại → hỏi dev mô tả ngắn về thay đổi trước khi spawn.

---

### Bước 2 — Gate: Xác nhận scope

Dùng `AskUserQuestion` tool:

- **Focus**: All (mặc định) / Code only / Architecture only / Performance only / Security only
- **Constraint**: Deadline gấp? Known tech debt cần bỏ qua? Framework đặc thù?

**Chờ confirm.**

---

### Bước 3 — Review theo 4 lens

Chạy 4 lens đồng thời trên cùng diff:

#### Lens 1 — Code Quality

| Điểm kiểm tra | Tìm gì |
|--------------|--------|
| Logic correctness | Bug hiển nhiên, off-by-one, null pointer, race condition |
| Naming | Variable/function tên mờ, viết tắt khó hiểu, không nhất quán với codebase |
| Test coverage | Thiếu happy path, edge case, error case quan trọng |
| Duplication | Vi phạm DRY — copy-paste logic có thể extract |
| Performance | N+1 query, unbounded loop, memory leak, blocking I/O |
| Error handling | Exception bị nuốt, error message expose internals |

> Nếu task ảnh hưởng UI, dùng `browser` tool để verify trực quan (screenshot/tương tác) trước khi Approve — không chỉ đọc code tĩnh.

#### Lens 2 — Architecture

Đánh giá theo 6 chiều:

| Chiều | Câu hỏi |
|-------|--------|
| Correctness | Logic có đúng với spec không? |
| Scalability | Chịu được load tăng 10x không? Bottleneck ở đâu? |
| Maintainability | Dev mới có hiểu và sửa được trong 6 tháng không? |
| Coupling | Phụ thuộc module khác quá nhiều? Circular dependency? |
| Testability | Có thể unit test mà không cần mock quá nhiều không? |
| Design decision | Có pattern/approach mới chưa có trong codebase → cần ADR không? |

#### Lens 3 — Performance

| Điểm kiểm tra | Tìm gì |
|--------------|--------|
| Database queries | N+1 queries, missing indexes, full table scan trong loop |
| Caching | Data read nhiều lần mà không cache, cache invalidation sai |
| Payload size | Response trả toàn bộ records, thiếu pagination |
| Blocking I/O | Sync I/O trong async context, blocking calls trong hot path |
| Resource leaks | DB connection không close, file handle không release |
| Scalability | Stateful logic chạy trên stateless server, shared mutable state |

> Lens này chỉ flag **potential issues** — không phải mọi N+1 đều cần fix ngay. Classify severity: Critical (ảnh hưởng P1 users) / Medium (sẽ thành vấn đề ở scale 10x) / Low (backlog OK).

#### Lens 4 — Security (OWASP Top 10)

**Always check** (mọi PR):
- Input validation và sanitize
- Parameterized queries (không string concat vào SQL)
- HTTPS cho external calls
- Không log sensitive data (password, token, PII)
- Dependency CVEs (`npm audit` / `pip audit` / `gradle audit`)

**Ask First** (dừng lại nếu phát hiện):
- Thay đổi authentication / authorization logic
- Thêm/sửa permission hoặc role checks
- Breaking changes trong public API
- Lưu trữ PII hoặc sensitive data mới
- Thay đổi CORS configuration
- Thay đổi cryptographic implementation
- Database migration có thể mất data

**Never** (flag ngay là Critical):
- Custom encryption (dùng standard libraries)
- Hardcoded credentials trong code
- Disable SSL verification
- `eval()` với user input
- Expose stack traces cho user

**Dùng `security_signals` từ review-reader** để populate kết quả:
- `always_check_hits` → điền vào bảng **🔴 Blocking** nếu severity high
- `ask_first_triggers` → điền vào bảng **⚠️ Ask First** — dừng và hỏi senior trước khi tiếp tục
- `never_violations` → nếu có bất kỳ item nào → flag ngay là **🔴 Critical**, dừng review
- `dependency_changes` → ghi chú cần chạy audit sau merge

---

### Bước 4 — Trình bày kết quả

```
## Review Report: [Tên task / PR]

### 🔴 Blocking — Phải fix trước merge

| # | Lens | File | Vấn đề | Fix đề xuất |
|---|------|------|--------|------------|
| 1 | Security | auth/login.js:42 | SQL injection | Dùng parameterized query |
| 2 | Code | user.service.js:87 | Null pointer khi user không tồn tại | Add null check |

### ⚠️ Ask First — Cần senior confirm

| # | Vấn đề | Câu hỏi cụ thể |
|---|--------|---------------|
| 1 | Auth logic thay đổi | Flow mới có cover case token expired không? |

### 🟡 Non-blocking — Nên làm, không block merge

| # | Lens | File | Đề xuất |
|---|------|------|-------|
| 1 | Code | user.repo.js:23 | Biến `x` → `userId` cho rõ |
| 2 | Arch | order.service.js | N+1 query — cân nhắc batch load sau |

### 💡 Dài hạn (backlog)
- [Cải tiến kiến trúc có thể làm sau khi có time]

### ✅ Tổng hợp

| Lens | Kết quả |
|------|--------|
| Code Quality | ✅ OK / 🔴 [N] blocking / 🟡 [N] non-blocking |
| Architecture | ✅ OK / 🔴 [N] blocking — ADR cần tạo: [có / không] |
| Performance | ✅ OK / 🔴 [N] critical / 🟡 [N] medium / ℹ️ [N] low |
| Security (Always) | ✅ OK / 🔴 [N] issues |
| Security (Ask First) | ✅ Không có / ⚠️ [N] items cần confirm |
| Dependencies (CVEs) | ✅ OK / 🔴 [N] critical alerts |
```

---

### Bước 5 — Gate: Decision

Dùng `AskUserQuestion` tool:

- **Verdict**:
  - `Approve` — không có blocking issue, tiếp tục `/dev-pr`
  - `Approve with minor fixes` — non-blocking issues, dev tự fix trước khi merge
  - `Request Changes` — có blocking issues, dev fix rồi chạy lại `/dev-review`

- **ADR**: Nếu Lens 2 phát hiện design decision mới → hỏi có cần tạo `/arch-adr` không

**Chờ confirm.**

---

### Bước 6 — Kết luận + Lưu review log

Ghi `docs/tasks/[TASK-ID]/review-log-R[N].md` dùng template `templates/review-log.md` — **LUÔN ghi file này bất kể verdict nào** (Approve / Approve with minor fixes / Request Changes). `/dev-pr` đọc round gần nhất của file này để xác định đã review chưa; nếu chỉ ghi khi Request Changes, `/dev-pr` không có cách nào phân biệt "chưa review" với "đã approve".

- Điền đầy đủ Meta (task_id, round, verdict: `approve` | `approve-with-fixes` | `request-changes`, timestamp JST, base_branch, harness: Claude Code | Codex CLI | Copilot CLI | OpenCode | ...)
- **Approve / Approve with minor fixes**: bảng Blocking để trống (không row nào); populate Non-blocking nếu Lens phát hiện gì
- **Request Changes**: populate bảng Blocking với ID dạng `B-xx` — mỗi issue 1 row có file:line + fix cụ thể; populate Ask First nếu có

**Nếu Approve / Approve with minor fixes:**
```
Review hoàn tất. Verdict: [Approve / Approve with minor fixes]

[Danh sách non-blocking items nếu có — dev tự judge trước merge]

Review Log đã ghi: `docs/tasks/[TASK-ID]/review-log-R[N].md`
Bước tiếp: /dev-pr
```

**Nếu Request Changes:**
```
Review hoàn tất. Verdict: Request Changes

Cần fix trước khi merge:
1. [Blocking issue 1 — file:line — fix cụ thể]
2. [Blocking issue 2 — file:line — fix cụ thể]

Review Log đã ghi: `docs/tasks/[TASK-ID]/review-log-R[N].md`
Sau khi fix xong, chạy lại /dev-review — AI sẽ tự verify từng B-xx item.
```

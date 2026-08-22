---
name: dev:pr
description: >
  Tạo PR description chuẩn từ code changes, verify AC coverage, link task docs.
  Trigger khi: user nói "tạo PR", "viết PR description", "chuẩn bị pull request",
  "create PR", "soạn mô tả PR", hoặc gõ /dev:pr.
---

# /dev:pr
**Role**: Developer  
**Mục đích**: Tạo PR description chuẩn từ code changes, link đến task docs và cập nhật baseline.

---

## Ask First Gates (dừng lại trước khi tạo PR nếu có)

> Danh sách đầy đủ + lý do: `assets/ask-first-gates.md`

Nếu PR chứa bất kỳ thay đổi nhạy cảm nào trong danh sách trên → flag rõ trong Gate 2 và chờ confirm senior.

---

## Hướng dẫn thực hiện

### Bước 0 — Gate: Kiểm tra review

Tìm `docs/tasks/[TASK-ID]/review-log-R[N].md` với số N cao nhất (round gần nhất — `/dev:review` luôn ghi file này bất kể verdict). Nếu tồn tại, đọc `Meta.verdict`:
- `approve` hoặc `approve-with-fixes` → review đã pass, tiếp tục Bước 1
- `request-changes` → dừng, báo user còn `B-xx` blocking chưa fix, chạy lại `/dev:review` trước

Nếu KHÔNG tìm thấy file `review-log-R*.md` nào → dùng `question` tool:

question({
  questions: [{
    question: "/dev:review đã chạy và Approve chưa?",
    header: "Reviewed?",
    options: [
      { label: "Đã approve", description: "Tiếp tục tạo PR" },
      { label: "Chưa chạy", description: "Chạy /dev:review trước" },
    ]
  }]
})

Nếu user chọn chưa → dừng, hướng dẫn chạy `/dev:review` trước.

**Chờ confirm.**

---

### Bước 1 — Đọc context

Xác định base branch theo thứ tự: user cung cấp trong lệnh → `git remote show origin` → hỏi user.

Spawn subagent để đọc:

task(
  description: "Read git diff and map changes to AC coverage",
  prompt: "Read the git diff and spec, return AC coverage per agents/diff-reader.md spec.\n\nGIT DIFF:\n[git diff <BASE_BRANCH>..HEAD]\n\nBASE_BRANCH: <tên branch đã xác định>\n\nSPEC PATH: docs/tasks/[TASK-ID]/requirements.md\n\nBASELINE DOCS TO CHECK: [list relevant docs/screens/ and docs/api/ files]",
  subagent_type: "explorer"
)

Subagent trả về: summary of changes, files changed, AC coverage, test results (nếu có).

### Bước 2 — Gate: Xác nhận coverage

Dùng `question` tool:

question({
  questions: [{
    question: "Các AC đã được cover đầy đủ chưa?",
    header: "AC Coverage",
    options: [
      { label: "Đủ hết", description: "Tất cả AC được cover" },
      { label: "Còn thiếu", description: "Có AC chưa cover" },
      { label: "Có breaking change", description: "Cần note trong PR" },
    ]
  }, {
    question: "PR này cần review từ ai?",
    header: "Reviewers",
    options: [
      { label: "Team lead", description: "Review bởi tech lead" },
      { label: "Peer", description: "Review bởi đồng đội" },
    ]
  }]
})

### Bước 3 — Tạo PR Description

Tạo file PR description cho task này sử dụng template `templates/pr-description.md`.

Điền vào tất cả các section từ kết quả diff-reader và dữ liệu AC coverage:
- **Summary**: 2-3 câu từ context
- **Links**: số issue, đường dẫn spec, đường dẫn analysis
- **Acceptance Criteria**: từ requirements.md, đánh dấu [x] với bằng chứng test
- **Changes table**: từ danh sách file của diff-reader
- **How to Test**: từ verification.md các bước T-
- **Breaking Changes**: từ câu trả lời ở Gate 2
- **Notes for Reviewer**: từ câu trả lời ở Gate 2
- **Release Notes Summary**: mô tả 1 dòng cho changelog
- **Docs to Update**: từ danh sách docs trong verification.md

### Bước 3b — PR Comment Resolver (opt-in)

Nếu PR đã có review comments từ reviewer (re-review cycle), dùng `question` tool:

question({
  questions: [{
    question: "Có review comments cần resolve không?",
    header: "Comments?",
    options: [
      { label: "Có", description: "Spawn pr-resolver agent để phân tích và đề xuất fix" },
      { label: "Không", description: "Bỏ qua bước này" },
    ]
  }]
})

**Nếu chọn Có**, spawn subagent:

task(
  description: "pr-resolver: analyze review comments and propose fixes",
  prompt: "[theo agents/pr-resolver.md input contract]\n\nPR NUMBER: [N]\nCOMMENTS: [paste từ GitHub/GitLab]\nDIFF CONTEXT: [git diff main..HEAD tóm tắt]",
  subagent_type: "oracle"
)

Trình bày kết quả từ pr-resolver — blocking comments trước, sorted by priority.

**Chờ confirm từng blocking item trước khi implement fix.**

### Bước 4 — Gate cuối

Dùng `question` tool:

question({
  questions: [{
    question: "PR description đã sẵn sàng. Có gì cần thêm không?",
    header: "Final check",
    options: [
      { label: "Sẵn sàng", description: "PR description OK, tạo PR" },
      { label: "Thêm notes", description: "Cần thêm Notes cho Reviewer" },
      { label: "Cập nhật docs", description: "Cần note docs cần update sau merge" },
    ]
  }]
})

Sau khi PR được approve và merge, hãy chạy `/docs:update` để cập nhật baseline docs.

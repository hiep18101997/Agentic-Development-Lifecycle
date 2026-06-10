---
name: pm-release
description: >
  Tạo Release Notes / リリースノート tự động từ merged PRs và closed issues.
  Dùng trước mỗi release gửi cho khách JP hoặc stakeholder.
  Trigger khi: user nói "tạo release notes", "viết リリースノート", "changelog sprint",
  "release notes cho khách JP", "tổng hợp thay đổi release", hoặc gõ /pm-release.
---

# Skill: /pm-release
**Role**: PM / Bridge Engineer  
**Mục đích**: Tạo Release Notes từ merged PRs + closed issues — đủ để gửi khách JP như một deliverable chính thức.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Xác định phạm vi release

Dùng `AskUserQuestion` tool:

- **Version/Sprint**: Release v[X.Y.Z] / Sprint [N] / Hotfix [date]
- **Audience**: Team internal / Khách hàng JP / Management / Public
- **Format output**: HTML (recommend cho JP delivery) / Markdown (Slack/Notion/commit) / Cả hai

**Chờ confirm.**

### Bước 2 — Thu thập dữ liệu

Spawn subagent để đọc:

```
Agent(
  description: "Collect release data from git and task docs",
  prompt: "Read the following and return structured JSON:
  1. git log --oneline --merges [base-tag]..HEAD — list of merged PRs
  2. git tag --sort=-version:refname | head -5 — recent tags
  3. List all docs/tasks/*/requirements.md for tasks completed this sprint
  4. List docs/tasks/*/verification.md for sign-off status

  Return JSON: { mergedPRs: [...], closedTasks: [...], openTasks: [...], tagHistory: [...] }
  Read only, no changes.",
  model: "haiku"
)
```

### Bước 3 — Phân loại thay đổi

Phân loại tự động từ PR titles + task descriptions:

| Category | Tiếng Việt | 日本語 |
|----------|-----------|--------|
| New Feature | Tính năng mới | 新機能 |
| Bug Fix | Sửa lỗi | バグ修正 |
| Improvement | Cải tiến | 改善 |
| Performance | Hiệu năng | パフォーマンス改善 |
| Security | Bảo mật | セキュリティ |
| Breaking Change | Thay đổi không tương thích | 互換性のない変更 |
| Maintenance | Bảo trì nội bộ | メンテナンス |

### Bước 4 — Tạo Release Notes

#### Format HTML (option A — cho JP delivery)

Sinh `docs/reports/release-[version]-[date].html` từ template `templates/html-artifact.html`:

- Header: Release [version] · [Date JST] · badge "リリース済み"
- Section **新機能 / New Features**: cards với icon ✨, mô tả JP + VN
- Section **バグ修正 / Bug Fixes**: cards với icon 🐛
- Section **改善 / Improvements**: cards với icon ⚡
- Section **⚠️ 互換性のない変更 / Breaking Changes**: nếu có, highlight đỏ
- Footer: link đến repo, PR list, Contact BE

`@media print`: A4 đẹp để forward email hoặc attach PDF cho khách JP.

#### Format Markdown (option B — commit/Slack)

Tạo `docs/reports/release-[version]-[date].md` dùng template `templates/release-notes.md`.

Điền vào từ danh sách thay đổi phân loại ở Bước 3:
- **Thêm mới (Added)**: tính năng mới
- **Cải tiến (Changed)**: thay đổi tính năng hiện có
- **Deprecated**: tính năng sẽ xóa trong release sau + migration path
- **Xóa bỏ (Removed)**: tính năng đã xóa
- **Sửa lỗi (Fixed)**: bug fixes với issue references
- **Bảo mật (Security)**: security patches (CVE nếu có)
- **Breaking Changes**: kèm hướng dẫn migration
- **Merged PRs / Closed Issues**: bảng đầy đủ từ git log

### Bước 5 — Gate cuối

```
## Release Notes v[X.Y.Z] đã soạn xong.

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Có thay đổi nào tôi bỏ sót không? | A: Không / B: Có — thêm: ___ / C: Khác: ___ |
| 2 | Breaking Changes có được mô tả đủ rõ chưa? | A: Đủ rõ / B: Cần thêm migration guide / C: Không có breaking changes / D: Khác: ___ |
| 3 | Gửi cho ai? | A: Khách JP (qua BE) / B: Team internal Slack / C: Cả hai / D: Khác: ___ |

Bước tiếp theo nếu gửi JP:
- BE review lại phần 日本語 trước khi gửi
- Gửi kèm regression test results (từ /qa-regression)
```

---

## Quy tắc

- Breaking changes: LUÔN có migration guide — không chỉ ghi "có breaking change"
- Phần JP trong release notes: dùng thuật ngữ từ `templates/jp-vn-en-glossary.md`
- CRs đã implement: list rõ ràng với CR number và ngày JP approved
- File HTML: lưu vào `docs/reports/` (có thể commit để lưu lịch sử release)

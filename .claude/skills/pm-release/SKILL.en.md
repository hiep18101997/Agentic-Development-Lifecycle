---
name: pm-release
description: >
  Generate Release Notes / リリースノート automatically from merged PRs and closed issues.
  Use before each release to send to JP clients or stakeholders.
  Trigger when: user says "tạo release notes", "viết リリースノート", "changelog sprint",
  "release notes cho khách JP", "tổng hợp thay đổi release",
  "generate release notes", "write changelog", "release notes for JP client",
  "summarize release changes", or type /pm-release.
---

# Skill: /pm-release
**Role**: PM / Bridge Engineer  
**Purpose**: Generate Release Notes from merged PRs + closed issues — sufficient to send to JP clients as an official deliverable.

---

## Execution Guide

### Step 1 — Gate: Define release scope

Use the `AskUserQuestion` tool:

- **Version/Sprint**: Release v[X.Y.Z] / Sprint [N] / Hotfix [date]
- **Audience**: Team internal / Japanese client / Management / Public
- **Output format**: HTML (recommended for JP delivery) / Markdown (Slack/Notion/commit) / Both

**Wait for confirmation.**

### Step 2 — Collect data

Spawn a subagent to read:

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

### Step 3 — Categorize changes

Auto-categorize from PR titles + task descriptions:

| Category | Vietnamese | 日本語 |
|----------|-----------|--------|
| New Feature | Tính năng mới | 新機能 |
| Bug Fix | Sửa lỗi | バグ修正 |
| Improvement | Cải tiến | 改善 |
| Performance | Hiệu năng | パフォーマンス改善 |
| Security | Bảo mật | セキュリティ |
| Breaking Change | Thay đổi không tương thích | 互換性のない変更 |
| Maintenance | Bảo trì nội bộ | メンテナンス |

### Step 4 — Generate Release Notes

#### HTML format (option A — for JP delivery)

Generate `docs/reports/release-[version]-[date].html` from template `templates/html-artifact.html`:

- Header: Release [version] · [Date JST] · badge "リリース済み"
- Section **新機能 / New Features**: cards with icon ✨, description JP + VN
- Section **バグ修正 / Bug Fixes**: cards with icon 🐛
- Section **改善 / Improvements**: cards with icon ⚡
- Section **⚠️ 互換性のない変更 / Breaking Changes**: if any, red highlight
- Footer: link to repo, PR list, Contact BE

`@media print`: Clean A4 for email forwarding or PDF attachment for JP clients.

#### Markdown format (option B — commit/Slack)

Create `docs/reports/release-[version]-[date].md` using template `templates/release-notes.en.md`.

Fill in from the categorized change list in Step 3:
- **Added**: new features
- **Changed**: improvements to existing functionality
- **Deprecated**: features to be removed in future releases + migration path
- **Removed**: deleted features
- **Fixed**: bug fixes with issue references
- **Security**: security patches (CVE if applicable)
- **Breaking Changes**: with migration guide
- **Merged PRs / Closed Issues**: full table from git log data

### Step 5 — Final gate

```
## Release Notes v[X.Y.Z] have been prepared.

| # | Question | Choice |
|---|---------|--------|
| 1 | Are there any changes I missed? | A: No / B: Yes — add: ___ / C: Other: ___ |
| 2 | Are Breaking Changes described clearly enough? | A: Clear enough / B: Need migration guide / C: No breaking changes / D: Other: ___ |
| 3 | Who should this be sent to? | A: JP client (via BE) / B: Team internal Slack / C: Both / D: Other: ___ |

Next steps if sending to JP:
- BE reviews the 日本語 section before sending
- Attach regression test results (from /qa-regression)
```

---

## Rules

- Breaking changes: ALWAYS include a migration guide — don't just say "breaking change"
- JP section in release notes: use terminology from `templates/jp-vn-en-glossary.md`
- Implemented CRs: list clearly with CR number and JP approval date
- HTML file: save to `docs/reports/` (can be committed to keep release history)

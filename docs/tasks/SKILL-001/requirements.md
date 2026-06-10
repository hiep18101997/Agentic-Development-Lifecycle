# Per-Agent Model Selection for Token Optimization

**Task ID**: SKILL-001  
**Ngày tạo**: 2026-05-09  
**BA**: Hiep Dinh  
**Trạng thái**: Draft  
**Lane**: normal

---

## 1. Bối cảnh & Vấn đề

Framework hiện tại spawn tất cả subagents qua `Agent()` tool mà không chỉ định `model` param. Kết quả: mọi subagent inherit model của session (thường là `sonnet`). Các read-only/parse agents như `task-reader` và `code-scout` thực hiện công việc đơn giản (JSON parsing, file search) nhưng vẫn tiêu thụ token ở mức sonnet — gây lãng phí cost không cần thiết khi chạy nhiều tasks/ngày.

Claude Code `Agent()` tool hỗ trợ param `model: "haiku" | "sonnet" | "opus"` để kiểm soát model per spawn call.

## 2. Mục tiêu

- Giảm ≥30% token consumption cho normal-lane tasks bằng cách route read-only agents sang haiku
- Đảm bảo reasoning-heavy agents vẫn dùng sonnet để giữ output quality
- Chuẩn bị nền tảng cho Phase 2 user-configurable model presets

## 3. Phạm vi

### Trong phạm vi (In scope)

**Phase 1 — Static defaults**:
- Thêm `model:` field vào frontmatter của cả 6 agent files (`agents/*.md`)
- Thêm **Recommended model** line vào body header của cả 6 agent files
- Update spawn examples trong 4 skill files: `dev/analyze.md`, `dev/pr.md`, `docs/update.md`, `qa/testplan.md`

**Phase 2 — Config schema (spec only, không implement)**:
- Định nghĩa JSON schema cho `.claude/model-config.json`
- Document cách agents sẽ đọc config để override static defaults

### Ngoài phạm vi (Out of scope)

- Không build token usage dashboard hay logging
- Không tự động switch model dựa theo response quality
- Không support non-Anthropic models (OpenAI, Gemini)
- Không implement runtime flag (`/dev-analyze --tier=budget`) trong Phase 1
- Không implement Phase 2 config file (chỉ spec schema)

## 4. Actors & Use Cases

| Actor | Use Case | Mô tả |
|-------|----------|-------|
| Claude Code (orchestrator) | Spawn subagent với đúng model | Đọc `model:` từ agent definition, pass vào `Agent({model: ...})` |
| Framework maintainer | Update agent defaults | Sửa `model:` trong frontmatter khi cần điều chỉnh |
| End-user (Phase 2) | Override model preset | Sửa `.claude/model-config.json` để chọn budget/balanced/quality |

## 5. Business Rules

| ID | Rule | Ghi chú |
|----|------|---------|
| BR-001 | Read-only agents phải dùng `haiku` làm default | task-reader, code-scout, diff-reader — chỉ parse/search, không cần reasoning sâu |
| BR-002 | Reasoning agents phải dùng `sonnet` làm default | planner, doc-updater, test-gen — tạo output phức tạp cần quality |
| BR-003 | `model:` field phải xuất hiện trong cả frontmatter lẫn body | Frontmatter cho machine-parsing (Phase 2), body text cho human clarity |
| BR-004 | Spawn examples trong skill files phải include `model:` param | Làm gương cho người viết skills mới follow convention |
| BR-005 | Static defaults có thể bị override bởi Phase 2 config | Khi `.claude/model-config.json` tồn tại, nó ưu tiên hơn agent frontmatter |

## 6. Luồng nghiệp vụ chính (Happy Path) — Phase 1

1. Claude đọc skill file (ví dụ: `dev/analyze.md`)
2. Skill chỉ định spawn `task-reader` subagent
3. Claude đọc `agents/task-reader.md`, thấy `model: haiku` trong frontmatter
4. Claude spawn: `Agent({ description: "...", prompt: "...", model: "haiku" })`
5. task-reader chạy trên haiku, trả kết quả về orchestrator
6. Orchestrator spawn `planner` với `model: "sonnet"`
7. Planner tạo implementation options với quality cao hơn cần thiết cho read-only tasks

## 7. Luồng thay thế & Exception

| Trường hợp | Xử lý |
|-----------|-------|
| Task là high-risk (BR-002 từ risk classifier) | Planner vẫn dùng sonnet — không tự động upgrade lên opus trong Phase 1 |
| Haiku trả output không đủ structured | Orchestrator có thể re-spawn với sonnet (manual decision, không automate) |
| Phase 2 config tồn tại | Config value override agent frontmatter (Phase 2 behavior, không Phase 1) |

## 8. Acceptance Criteria

- [ ] **AC-001**: Mỗi file trong `agents/*.md` có `model:` field trong YAML frontmatter với giá trị `haiku` hoặc `sonnet`
- [ ] **AC-002**: Mỗi file trong `agents/*.md` có dòng `**Recommended model**: haiku|sonnet` trong header section (sau dòng Type/Scope)
- [ ] **AC-003**: Spawn examples trong `dev/analyze.md` include `model: "haiku"` cho task-reader và code-scout, `model: "sonnet"` cho planner
- [ ] **AC-004**: Spawn examples trong `dev/pr.md` include `model: "haiku"` cho diff-reader
- [ ] **AC-005**: Spawn examples trong `docs/update.md` include `model: "haiku"` cho diff-reader, `model: "sonnet"` cho doc-updater
- [ ] **AC-006**: Spawn examples trong `qa/testplan.md` include `model: "sonnet"` cho test-gen
- [ ] **AC-007**: Phase 2 JSON schema được document trong spec (section 9 NFR hoặc separate file)
- [ ] **AC-008**: Không có skill file nào bị break — tất cả Agent() calls vẫn valid sau update

## 9. Non-functional Requirements

### Phase 2 Config Schema (sơ bộ)

File: `.claude/model-config.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "preset": "balanced",
  "presets": {
    "budget": {
      "task-reader": "haiku",
      "code-scout": "haiku",
      "diff-reader": "haiku",
      "planner": "haiku",
      "doc-updater": "haiku",
      "test-gen": "sonnet"
    },
    "balanced": {
      "task-reader": "haiku",
      "code-scout": "haiku",
      "diff-reader": "haiku",
      "planner": "sonnet",
      "doc-updater": "sonnet",
      "test-gen": "sonnet"
    },
    "quality": {
      "task-reader": "haiku",
      "code-scout": "haiku",
      "diff-reader": "sonnet",
      "planner": "opus",
      "doc-updater": "sonnet",
      "test-gen": "opus"
    }
  }
}
```

**Convention đọc config (Phase 2)**:
1. Check `.claude/model-config.json` tồn tại không
2. Nếu có: lookup `presets[preset][agent-name]` → dùng giá trị này
3. Nếu không: fallback về `model:` trong agent frontmatter

- **Security**: Config file không chứa credentials, chỉ model names — không cần encrypt
- **Compatibility**: `model` param của Agent() tool accept `"haiku" | "sonnet" | "opus"` shorthand

## 10. User Stories

| ID | Tên | Priority | Estimate |
|----|-----|----------|----------|
| US-001 | Update 6 agent definition files với model field | High | 0.5h |
| US-002 | Update spawn examples trong 4 skill files | High | 0.5h |
| US-003 | Document Phase 2 config schema | Medium | 0.25h |

## 11. Câu hỏi mở (Open Questions)

| ID | Câu hỏi | Người trả lời | Deadline | Status |
|----|---------|---------------|----------|--------|
| Q-001 | Khi Phase 2 implement, installer (`bin/install.js`) có hỏi user chọn preset không, hay generate `balanced` mặc định? | Hiep | Khi làm Phase 2 | Open |
| Q-002 | `quality` preset có cần option `opus` cho planner không, hay sonnet đủ cho mọi trường hợp? | Hiep | Khi làm Phase 2 | Open |
| Q-003 | test-gen dùng `sonnet` — có trường hợp nào cần opus không (ví dụ: complex integration test generation)? | Hiep | Open | Open |

## 12. Harness Delta

- [ ] Không có friction phát hiện trong task này

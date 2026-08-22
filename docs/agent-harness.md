# Hợp đồng Agent Harness

Dùng hợp đồng này khi user cấp quyền chạy autonomous rõ ràng qua `/dev-autopilot`. Mục tiêu là giúp task
dài hạn có thể tiếp tục qua nhiều session và chỉ kết thúc khi có bằng chứng kiểm chứng.

## Artifact bắt buộc

Tạo `docs/tasks/[TASK-ID]/agent-state.md` trước khi sửa code:

```markdown
---
taskId: [TASK-ID]
status: initializing | implementing | validating | reviewing | blocked | ready_for_review
iteration: 0
iterationBudget: 3
lastUpdated: [ISO-8601]
---

# Agent state: [TASK-ID]

## Objective và Acceptance Criteria
- [ ] AC-001: ...

## Risk và autonomy envelope
- Risk lane: tiny | normal | high-risk
- Base branch / worktree: ...
- Lệnh được phép chạy: ...
- PR authority: none | open-only

## Baseline
- Reproduction command + kết quả: ...
- Validation commands: ...

## Iteration log
| # | AC | Giả thuyết / thay đổi | Bằng chứng | Reviewer verdict | Hành động tiếp theo |
|---|---|---|---|---|---|

## Decisions
- [ISO-8601] Quyết định + lý do ngắn

## Next steps
- Bước tiếp theo cụ thể (không phải "tiếp tục implement")

## Open questions
- Câu hỏi chưa trả lời cần người/agent kế tiếp xử lý trước khi resume

## Open risks và escalation
- None / ...
```

`Decisions` / `Next steps` / `Open questions` tách riêng khỏi `Iteration log` và `Open risks` để một
agent/human mới mở `agent-state.md` có thể "immediately orient" — biết ngay điều gì đã quyết, việc gì làm
tiếp, và câu hỏi nào đang treo, không phải suy luận lại từ log thô.

## Initializer

1. Đọc instruction của repo và trạng thái git/worktree.
2. Classify risk theo `docs/risk-classifier.md`; dùng `assets/ask-first-gates.md` cho thay đổi nhạy cảm.
3. Chuẩn hóa objective thành AC kiểm chứng được. Với normal/high-risk, tạo hoặc cập nhật `analysis.md`
   (từ `/dev-analyze`) trước khi code nếu đã có.
4. Chạy baseline nhỏ nhất có ý nghĩa và ghi lại kết quả. Không nhận một lỗi là do task nếu chưa có
   before/after signal.

## Vòng autonomous

1. Chọn AC nhỏ nhất chưa hoàn thành.
2. Thực hiện một increment nhất quán, không mở rộng scope.
3. Chạy deterministic checks hẹp trước, rồi checks rộng khi increment hoàn tất.
4. Ghi command, output tóm tắt và giả thuyết tiếp theo vào `agent-state.md`.
5. Chạy 2 evaluator read-only mù với nhau: `agents/autopilot-reviewer.md` và `agents/autopilot-adversary.md`.
   Nếu cả hai trả `pass`, chạy thêm 1 devil's-advocate re-check trước khi coi là pass thật (xem
   `.claude/skills/dev-autopilot/SKILL.md` Bước 3).
6. Xử lý verdict: `pass` (đã qua anti-sycophancy check nếu unanimous) để tiếp tục/finalize; `changes_required`
   từ bất kỳ evaluator nào để log, sửa và lặp trong budget; `escalate` từ bất kỳ evaluator nào để dừng với
   evidence và quyết định nhỏ nhất cần human.

Failure là feedback; không được sửa AC hoặc làm yếu test để tạo kết quả pass.

## Guardrails

- High-risk hoặc Ask First trigger luôn cần confirm trước khi implement; approval không miễn security/architecture review.
- Escalate sau hai giả thuyết khác nhau cùng thất bại trên một blocker, baseline fail không giải thích được, requirement conflict, hoặc hết iteration budget.
- Reviewer chỉ đọc; reviewer không được sửa implementation hay tự waive finding.
- Không push, merge, release hoặc thay đổi production nếu chưa được cấp quyền riêng.
- `agent-state.md`, `analysis.md`, `verification.md`, `review-log-R[N].md` là handoff context; không phụ thuộc chat history.

## Điều kiện hoàn tất

Chỉ chuyển `ready_for_review` khi mọi AC được map tới automated command output, manual observation có thể
lặp lại, hoặc limitation được ghi rõ; evaluator loop trả `pass`; `verification.md` cùng
`review-log-R[N].md` (`verdict: approve` hoặc `approve-with-fixes`) đã được ghi.

## Recovery tier (hiện trạng và roadmap)

Theo taxonomy autonomy-tier × recovery-tier (none → retry → resumable → durable):

- **Recovery tier hiện tại: `resumable`** — `agent-state.md` là checkpoint dạng markdown, đọc lại được
  giữa các session, nhưng phụ thuộc agent/human tự đọc và diễn giải lại state; không có executor nào tự
  động resume.
- **Chưa đạt `durable`** — không có process/daemon tự khôi phục sau crash; nếu session bị ngắt giữa
  iteration, human phải mở lại `agent-state.md` và ra lệnh tiếp tục bằng tay.
- **Autonomy tier hiện tại**: giữa `checkpoint-gated` (mỗi increment cần evaluator, có thể cần human ở
  `escalate`) và `bounded` (chạy trong iteration budget đã khai báo) — chưa `headless` vì Bước 0 của
  `/dev-autopilot` luôn yêu cầu xác nhận trước khi sửa file.

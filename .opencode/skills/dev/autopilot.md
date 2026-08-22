---
name: dev:autopilot
description: >
  Chạy một coding task theo autonomy harness: baseline, incremental loop, validation,
  independent review và escalation có kiểm soát. Trigger khi user nói "autopilot",
  "tự chạy trọn task", "chạy autonomous", "agent loop", hoặc gõ /dev:autopilot.
---

# /dev:autopilot
**Role**: Autonomous Developer
**Mục đích**: Autonomy lane opt-in cho task đã risk-classify — initializer, incremental implementation loop, 2 evaluator độc lập, và evidence-based handoff, không cần confirm sau mỗi file như `/dev:implement`.

---

## Quan trọng

Đây là lane **opt-in**, không thay thế lane thủ công mặc định `/dev:analyze` → `/dev:implement` →
`/dev:review` → `/dev:pr`. Mọi skill khác vẫn giữ hard-stop sau mỗi bước; autopilot chỉ áp dụng cho task
đã được user cấp quyền tự động rõ ràng. Đọc `docs/agent-harness.md` và tuân thủ như operating contract.

---

## Hướng dẫn thực hiện

### Bước 0 — Risk + autonomy gate

Classify task theo `docs/risk-classifier.md`: input type, R-01..R-10 áp dụng, lane tiny/normal/high-risk.
Hard Trigger → dùng đúng format `assets/ask-first-gates.md` và dừng chờ confirm senior.

Dùng `question` tool xác nhận một lần: Task ID, objective/AC, base branch hoặc worktree, lệnh được phép
chạy, iteration budget (mặc định 3), quyền mở PR. Approval cho high-risk không loại bỏ evaluator loop ở
Bước 3.

**Chờ confirm trước khi sửa file.**

### Bước 1 — Initializer và durable state

Đọc `docs/tasks/[TASK-ID]/analysis.md` nếu có (tiny lane ghi plan trực tiếp vào state). Chuẩn hóa
objective thành AC kiểm chứng được. Tạo `docs/tasks/[TASK-ID]/agent-state.md` theo `docs/agent-harness.md`.
Chạy baseline nhỏ nhất có ý nghĩa, ghi command + kết quả trước khi sửa code.

Baseline fail không giải thích được hoặc requirement conflict → `status: blocked` và escalate.

### Bước 2 — Incremental implementation loop

Mỗi iteration: chọn AC nhỏ nhất chưa hoàn thành, implement một increment nhất quán (không jump ahead,
không refactor ngoài scope); chạy checks hẹp trước, rộng sau; ghi command/output/next hypothesis vào
`agent-state.md` (Decisions / Next steps / Open questions). Hai hypothesis khác nhau cùng fail trên một
blocker, hoặc hết budget → escalate.

### Bước 3 — Read-only evaluator loop (2 evaluator độc lập + anti-sycophancy check)

Sau mỗi increment, gọi **hai lần** `task(subagent_type: "oracle")`, mù với nhau (không đưa verdict
evaluator A vào prompt evaluator B):

- Oracle A: prompt theo `agents/autopilot-reviewer.md` — TASK_ID, AC, RISK_LANE, BASE_BRANCH, ITERATION,
  analysis/state paths, validation evidence, git diff.
- Oracle B (adversarial): prompt theo `agents/autopilot-adversary.md` — cùng input, không tiết lộ verdict A.

Reconcile: một trong hai `changes_required` → coi là blocking, ghi cả hai findings, sửa, revalidate, gọi
lại cả hai. Một trong hai `escalate` → dừng với evidence. **Cả hai `pass`** → gọi thêm 1 lần
`task(subagent_type: "oracle")` thứ ba làm devil's-advocate re-check (giả định pass là sai, tìm lý do mạnh
nhất để bác); tìm ra blocking issue thật → `changes_required`; không tìm ra gì → `pass` được coi là earned
qua 3 lần độc lập. Không evaluator nào tự waive blocking finding; ghi tất cả verdict vào `agent-state.md`.

### Bước 4 — Evidence-based handoff

Tạo `docs/tasks/[TASK-ID]/verification.md` từ `templates/verification.md`, map mọi AC tới evidence hoặc
limitation rõ ràng. `signOffStatus: Pass` chỉ khi evaluator loop trả `pass` đã qua anti-sycophancy check.

Ghi `docs/tasks/[TASK-ID]/review-log-R1.md` từ `templates/review-log.md` với `verdict: approve` (hoặc
`approve-with-fixes`) và `reviewer: AI (autopilot dual-evaluator)` — để task tiếp tục vào `/dev:pr` như đã
qua `/dev:review`, không cần chạy riêng.

```
Autopilot hoàn tất — [TASK-ID]. Iteration: [N]/[budget]. Files thay đổi: [N].
Artifacts: agent-state.md, verification.md, review-log-R1.md.

DỪNG TẠI ĐÂY. Không tự động push, merge hoặc chạy /dev:pr nếu chưa có quyền riêng.
```

## Quy tắc

Failure là feedback, không sửa AC/test để pass. Escalate sau 2 hypothesis khác nhau cùng fail, baseline
fail không rõ, requirement conflict, hoặc hết budget. High-risk/Ask First luôn cần confirm; approval không
miễn security/architecture review hay evaluator verdict. Evaluator chỉ đọc, không tự waive finding. Không
push/merge/release nếu chưa được cấp quyền riêng.

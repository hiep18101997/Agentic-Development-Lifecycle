---
name: dev-autopilot
description: >
  Chạy một coding task theo autonomy harness: baseline, incremental loop, validation,
  independent review và escalation có kiểm soát. Trigger khi user nói "autopilot",
  "tự chạy trọn task", "chạy autonomous", "agent loop", hoặc gõ /dev-autopilot.
---

# Skill: /dev-autopilot
**Role**: Autonomous Developer
**Mục đích**: Autonomy lane opt-in cho task đã risk-classify — initializer, incremental implementation loop, 2 evaluator độc lập, và evidence-based handoff, không cần confirm sau mỗi file như `/dev-implement`.

---

## Quan trọng

Đây là lane **opt-in**, không thay thế lane thủ công mặc định `/dev-analyze` → `/dev-implement` → `/dev-review` → `/dev-pr`. Mọi skill khác của framework vẫn giữ hard-stop sau mỗi bước; autopilot chỉ áp dụng cho task đã được user cấp quyền tự động rõ ràng. Đọc `docs/agent-harness.md` và tuân thủ như operating contract trong suốt task.

---

## Hướng dẫn thực hiện

### Bước 0 — Risk + autonomy gate

Classify task theo `docs/risk-classifier.md`: xác định input type, R-01..R-10 nào áp dụng, và lane tiny/normal/high-risk. Nếu gặp Hard Trigger → dùng đúng format `⚠️ Ask First Gate` trong `assets/ask-first-gates.md` và dừng chờ confirm senior trước khi tiếp tục.

Dùng `AskUserQuestion` xác nhận một lần trước khi chạy: Task ID, objective/AC, base branch hoặc worktree, lệnh được phép chạy, iteration budget (mặc định 3), và quyền mở PR. **Approval cho high-risk không loại bỏ evaluator loop bắt buộc ở Bước 3.**

**Chờ confirm trước khi sửa file.**

---

### Bước 1 — Initializer và durable state

1. Đọc `docs/tasks/[TASK-ID]/analysis.md` nếu đã tồn tại (tiny lane có thể bỏ qua — ghi plan trực tiếp vào state).
2. Chuẩn hóa objective thành AC kiểm chứng được.
3. Tạo `docs/tasks/[TASK-ID]/agent-state.md` theo template trong `docs/agent-harness.md`.
4. Chạy baseline nhỏ nhất có ý nghĩa (build/test hiện có của repo) và ghi command + kết quả **trước khi sửa code**. Không nhận một lỗi có sẵn là do task nếu chưa có before/after signal.

Baseline fail không giải thích được hoặc requirement conflict → set `status: blocked` trong `agent-state.md` và escalate qua `AskUserQuestion`.

---

### Bước 2 — Incremental implementation loop

Mỗi iteration:

1. Chọn AC nhỏ nhất chưa hoàn thành, implement một increment nhất quán — cùng nguyên tắc như `/dev-implement`: không jump ahead, không refactor ngoài scope, không thêm feature ngoài AC.
2. Chạy deterministic checks hẹp trước (unit test liên quan), checks rộng sau khi increment hoàn tất.
3. Ghi command, output tóm tắt và giả thuyết tiếp theo vào `agent-state.md` — mục **Decisions** (quyết định + lý do), **Next steps** (bước tiếp cụ thể), **Open questions** (câu hỏi chưa trả lời).
4. Nếu cùng một blocker thất bại với hai hypothesis khác nhau, hoặc hết iteration budget → escalate.

Migration có thể mất data → luôn dừng hỏi confirm, không tự tạo. Phát hiện thay đổi nhạy cảm (`assets/ask-first-gates.md`) → dừng ngay, không tự quyết định.

---

### Bước 3 — Independent evaluator loop (2 evaluator mù + anti-sycophancy check)

Sau mỗi increment hoàn chỉnh, spawn **hai** evaluator read-only, mù với nhau — không paste verdict của evaluator này vào input evaluator kia:

```
Agent({
  description: "Evaluate autonomous iteration (Evaluator A)",
  prompt: "Read agents/autopilot-reviewer.md. Evaluate TASK_ID, AC, RISK_LANE, BASE_BRANCH, ITERATION, analysis/state paths, validation evidence, and git diff. Return JSON only.",
  model: "sonnet"
})

Agent({
  description: "Evaluate autonomous iteration (Evaluator B — adversarial)",
  prompt: "Read agents/autopilot-adversary.md. Same TASK_ID, AC, RISK_LANE, BASE_BRANCH, ITERATION, analysis/state paths, validation evidence, and git diff — do NOT reveal Evaluator A's verdict. Return JSON only.",
  model: "sonnet"
})
```

Reconcile hai verdict:

- **Một trong hai trả `changes_required`** → coi là blocking; ghi findings của cả hai vào `agent-state.md`, sửa, revalidate, spawn lại cả hai evaluator.
- **Một trong hai trả `escalate`** → dừng với evidence và quyết định nhỏ nhất cần human.
- **Cả hai trả `pass`** → đây là trường hợp "unanimous approval" — **không finalize ngay**, spawn thêm một devil's-advocate re-check:

```
Agent({
  description: "Devil's-advocate re-check on unanimous pass",
  prompt: "Both independent evaluators returned pass for this iteration. Assume that is wrong. Re-read the same evidence and git diff and argue the strongest case for why this should NOT pass. If you find a genuine blocking issue, return verdict: changes_required with the finding. If after genuinely trying you find nothing, return verdict: pass and state explicitly what you tried to break. Return JSON only, same shape as agents/autopilot-reviewer.md.",
  model: "sonnet"
})
```

  - Devil's-advocate tìm ra blocking issue thật → xử lý như `changes_required`.
  - Devil's-advocate cũng không tìm ra gì → `pass` được coi là earned (evidence từ 3 lượt độc lập), đánh dấu AC và tiếp tục hoặc finalize.

Cả 3 evaluator đều read-only; orchestrator không được tự waive blocking finding của bất kỳ evaluator nào. Ghi cả 2-3 verdict (không chỉ verdict cuối) vào `agent-state.md` để audit trail đầy đủ.

---

### Bước 4 — Evidence-based handoff

Tạo `docs/tasks/[TASK-ID]/verification.md` dùng template `templates/verification.md`: map mọi AC tới automated command output, manual observation lặp lại được, hoặc limitation ghi rõ. `signOffStatus` chỉ được set thành `Pass` khi evaluator loop ở Bước 3 trả `pass` đã qua anti-sycophancy check (nếu unanimous).

Ghi `docs/tasks/[TASK-ID]/review-log-R1.md` dùng template `templates/review-log.md` với `verdict: approve` (hoặc `approve-with-fixes` nếu còn non-blocking) và `reviewer: AI (autopilot dual-evaluator)` — để task tiếp tục được vào `/dev-pr` như một task lane thủ công đã qua `/dev-review`, không cần chạy `/dev-review` riêng vì 2 evaluator độc lập + devil's-advocate ở Bước 3 đã tương đương.

```
Autopilot hoàn tất — [TASK-ID]

Iteration: [N] / [budget]
Commands đã chạy: [danh sách]
Files thay đổi: [N files]
Residual risks: [nếu có]

Artifacts:
- docs/tasks/[TASK-ID]/agent-state.md
- docs/tasks/[TASK-ID]/verification.md
- docs/tasks/[TASK-ID]/review-log-R1.md

**DỪNG TẠI ĐÂY.** Không tự động push, merge hoặc chạy /dev-pr nếu chưa được cấp quyền riêng.
```

---

## Quy tắc

- Failure là feedback — không sửa AC hoặc làm yếu test để tạo kết quả pass.
- Escalate sau hai hypothesis khác nhau cùng thất bại trên một blocker, baseline fail không giải thích được, requirement conflict, hoặc hết iteration budget.
- High-risk hoặc Ask First trigger luôn cần confirm trước khi implement; approval không miễn security/architecture review hay evaluator verdict.
- Reviewer chỉ đọc; reviewer không được sửa implementation hay tự waive finding.
- Không push, merge, release hoặc thay đổi production nếu chưa được cấp quyền riêng.
- `agent-state.md`, `verification.md`, `review-log-R[N].md` là handoff context — không phụ thuộc chat history.

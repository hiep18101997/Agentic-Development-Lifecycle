# Agentic Development Lifecycle — Dev Skills Deck

> Khung slide thuyết trình dành cho developer. Format tối ưu cho NotebookLM:
> mỗi slide ngăn bởi `---`, có `## Slide N — Tiêu đề` + bullet content + speaker notes.
> Mục tiêu: 22 slide, ~25–30 phút thuyết trình.

---

## Slide 1 — Tiêu đề

**Agentic Development Lifecycle**
Bộ skill AI có cấu trúc cho developer

- Framework biến Claude Code / Cursor / OpenCode thành đồng đội tuân thủ quy trình
- Trọng tâm: 5 skill `/dev:*` + ecosystem hỗ trợ (arch, sec, docs)
- Cài 1 lệnh: `npx agentic-development-lifecycle --yes`

**Speaker notes**: Mở đầu — đặt vấn đề: AI coding hiện nay vẫn chủ yếu là "vibe coding". Framework này giải quyết bài toán đó bằng cách áp guardrails có cấu trúc.

---

## Slide 2 — Vấn đề: AI coding không có guardrails

Dev dùng AI hôm nay gặp 4 nỗi đau:

1. **Hallucination** — AI bịa API, file, function không tồn tại
2. **No memory** — mỗi prompt phải re-feed context, tốn token
3. **One-shot** — AI tự chạy đến cuối, sai phương án mới biết
4. **No audit** — không trace được "tại sao quyết định thế này?"

> Hệ quả: senior phải review từng dòng AI sinh ra → ROI âm.

**Speaker notes**: Đây là bài toán team đang gặp. Khung framework này design để giải quyết cả 4 nỗi đau này.

---

## Slide 3 — Triết lý cốt lõi (6 nguyên tắc)

1. **Human Gate** — không bao giờ tự động, luôn dừng hỏi confirm
2. **Multiple Options** — luôn đưa 2-3 phương án + trade-off, không độc đoán
3. **Fresh Context** — multi-agent giữ context sạch, tiết kiệm token
4. **Two-tier Docs** — task docs ephemeral + baseline docs living
5. **Delta Specs** — mỗi thay đổi là 1 proposal có cấu trúc
6. **Template-first** — commands reference template, không duplicate

**Speaker notes**: 6 nguyên tắc này là "constitution" của framework — mọi skill đều tuân theo.

---

## Slide 4 — Map toàn bộ skill (32 skill, 8 role)

| Role | Skill count | Skill chính cho dev |
|------|-------------|---------------------|
| **Dev** | 5 | `/dev:analyze`, `/implement`, `/review`, `/debug`, `/pr` |
| Arch | 2 | `/arch:review`, `/arch:adr` |
| Sec | 1 | `/sec:review` |
| Docs | 2 | `/docs:update`, `/docs:project` |
| QA | 4 | `/qa:testplan`, `/ut`, `/it`, `/bug` |
| BA / PM / Ops / SM | 18 | (không cover hôm nay) |

> Focus hôm nay: **5 dev skill + 5 skill hỗ trợ trực tiếp**

**Speaker notes**: Framework rộng (32 skill) nhưng dev chỉ cần biết 5 + 5. Skill khác là role khác xài.

---

## Slide 5 — Vòng đời 1 task dev

```
   Issue / Ticket
        │
        ▼
   /dev:analyze    ← phân tích, đưa 2-3 phương án
        │  (human chọn)
        ▼
   /dev:implement  ← code file-by-file, có gate
        │
        ▼
   /dev:review     ← code quality + arch + perf + security trong 1 lần
        │  (Approve)
        ▼
   /dev:pr         ← sinh PR description chuẩn
        │
        ▼
   /docs:update    ← cập nhật baseline screen/API docs
```

> Mỗi mũi tên = 1 human gate. AI không tự chạy qua.

**Speaker notes**: Quan trọng: từ analyze → pr là 4 skill, không phải 1 skill khổng lồ. Lý do: giữa các bước có gate cho human can thiệp.

---

## Slide 6 — /dev:analyze (skill quan trọng nhất)

**Mục đích**: Issue → 2-3 phương án implement với trade-off

**Multi-agent orchestration**:
```
dev:analyze (orchestrator)
├── task-reader  (haiku) → parse issue → JSON
├── code-scout   (haiku) → tìm file liên quan
└── planner      (sonnet)→ tổng hợp → 2-3 options
```

**Output**: `docs/tasks/[TASK-ID]/analysis.md` + `analysis-compare.html`

**Gates**: 3 gate (xác nhận hiểu task → xác nhận code map → chọn phương án)

**Speaker notes**: Đây là skill bị skip nhiều nhất nhưng quan trọng nhất. Skip analyze = dev phóng tay implement phương án sai → mất 2x thời gian sửa.

---

## Slide 7 — Multi-agent: tại sao quan trọng?

**Vấn đề "context rotting"**: 1 conversation dài → AI quên đầu, hallucination tăng

**Giải pháp**: Mỗi subagent chỉ nhận **context tối thiểu**, trả về kết quả nén

| Agent | Model | Input | Output |
|-------|-------|-------|--------|
| `task-reader` | haiku | Chỉ nội dung issue | Structured JSON |
| `code-scout` | haiku | Task summary + patterns | File list + line numbers |
| `planner` | sonnet | Task + code map | 2-3 phương án |

**Token economics**: haiku rẻ hơn sonnet ~10x → phân tách thông minh tiết kiệm 60-70% token

**Speaker notes**: Đây là pattern "agent specialization" — đừng dùng 1 con AI to làm hết. Tách ra theo task → vừa rẻ vừa chính xác.

---

## Slide 8 — Risk Classifier (bước 0 của mọi task)

Trước khi spawn agent → classify task vào 1 trong 3 lane:

| Lane | Khi nào | Action |
|------|---------|--------|
| **Tiny** | Patch nhỏ, đổi text, fix typo | Skip analyze, patch luôn |
| **Normal** | Feature/bug bình thường | Chạy full flow analyze → pr |
| **High-risk** | Auth, DB migration, API breaking | **DỪNG**, hỏi senior trước |

**10 checkpoint** (R-01 → R-10): touch auth? touch shared config? touch DB? data PII? ...

> Không phải task nào cũng cần full ceremonial. Framework tự scale theo risk.

**Speaker notes**: Đừng overhead cho việc nhỏ. Nhưng nếu chạm auth/payment/migration → MUST có gate dày.

---

## Slide 9 — /dev:implement: file-by-file gate

**Quy trình**:
1. Đọc `analysis.md` → biết files cần đổi
2. Chọn mode: **Standard** hoặc **TDD** (opt-in)
3. Với mỗi file:
   - Trình bày diff dự kiến
   - **Gate**: ✅ apply / ✏️ chỉnh / ❌ skip
   - Apply → chạy linter/typecheck → confirm

**Tại sao file-by-file**:
- Diff nhỏ → human review nhanh, dễ catch bug
- Lỗi 1 file không destroy 10 file khác
- Audit trail rõ ràng

**Speaker notes**: Nhiều dev complaint "AI sửa 1 phát 50 files, không review nổi". File-by-file gate giải quyết đúng đau đó.

---

## Slide 10 — /dev:review: 1 skill thay 3

**Trước**: chạy `/arch:review` + `/sec:review` + manual code review → 3 lần round-trip

**Sau**: `/dev:review` chạy **4 lens trong 1 lần**:

1. **Code quality** — naming, structure, dead code
2. **Architecture** — separation of concern, dependencies
3. **Performance** — N+1, hot path, memory leak
4. **Security** — OWASP Top 10 quick scan

**Output**: `docs/tasks/[TASK-ID]/review-log-R[N].md`
- Mỗi finding có severity: `B-xx` (Blocking) / `M-xx` (Major) / `m-xx` (minor)
- Multi-round support — round 2 verify round 1 fixes

**Speaker notes**: Skill này tiết kiệm 60% thời gian review. Đặc biệt round-2 verify: AI tự check item nào đã fix, không bắt human check thủ công.

---

## Slide 11 — /dev:debug: 5 bước có hệ thống

**Nguyên tắc vàng**: KHÔNG touch code trước khi có minimal reproduction

```
1. Reproduce  → minimal repro case
2. Localize   → file:line khả nghi (subagent scan)
3. Reduce     → cô lập biến: cái gì gây ra?
4. Fix        → patch root cause (không patch symptom)
5. Guard      → thêm test prevent regression
```

**Anti-pattern bị chặn**: "thử fix random cho đến khi hết lỗi"

**Speaker notes**: Skill này force junior dev follow methodology của senior. Không skip step được — mỗi step có gate.

---

## Slide 12 — /dev:pr: PR description chuẩn

**Input**: diff + `analysis.md` + `requirements.md` + `verification.md`

**Output**: PR description gồm:
- Summary (1-2 dòng)
- AC coverage table (✅ ✅ ❌ ✅)
- Files changed + lý do
- Test plan
- Screenshots (nếu UI)
- Risk callouts (Ask First Gates đã flag)

**Bonus**: `pr-resolver` subagent → khi reviewer comment, AI propose fix per comment

**Speaker notes**: PR description tốt = merge nhanh hơn. Skill này force dev viết PR đàng hoàng, không "fix bug" 1 dòng.

---

## Slide 13 — Two-tier Documentation

```
┌─ Type 1: Task Docs (ephemeral, per issue) ─────────┐
│ docs/tasks/TASK-XXX/                                │
│   ├── requirements.md   (parsed từ issue)           │
│   ├── analysis.md       (options đã cân nhắc)       │
│   ├── test-plan.md      (test cases)                │
│   ├── verification.md   (sign-off, results)         │
│   └── audit.md          (append-only log)           │
└─────────────────────────────────────────────────────┘
                          │
                          ▼ (sau khi verify + merge)
┌─ Type 2: Baseline Docs (living) ────────────────────┐
│ docs/screens/[feature]/screen.md                    │
│ docs/api/[domain]/[endpoint].md                     │
│ docs/decisions/ADR-XXX.md                           │
└─────────────────────────────────────────────────────┘
```

> Task docs chết sau khi merge. Baseline docs sống mãi với codebase.

**Speaker notes**: Tách ephemeral vs living tránh được vấn đề "tài liệu thừa lỗi thời ngập folder". Cái nào ephemeral thì gitignore.

---

## Slide 14 — AskUserQuestion: native gate UI

**Sai cách (plain markdown)**:
```
1. Option A — abc
2. Option B — xyz
Bạn chọn gì?
```

**Đúng cách (AskUserQuestion tool)**:
```javascript
AskUserQuestion({
  question: "Chọn approach?",
  header: "Approach",     // max 12 chars
  options: [
    { label: "Option A", description: "Trade-off chi tiết" },
    { label: "Option B", description: "Trade-off chi tiết" }
  ]
})
```

→ Render native UI trong Claude Code, tab có label "Approach", chọn bằng phím.

**Speaker notes**: Detail nhỏ nhưng UX khác biệt rất lớn. Plain text option = phải gõ "A" hay "1". Native UI = arrow key + enter. Skill nào không follow rule này, fix ngay.

---

## Slide 15 — Audit Log: defend quyết định sau N tháng

**Vấn đề**: 6 tháng sau khách hỏi "tại sao design API trả về 401 không phải 403?" → không ai nhớ.

**Giải pháp**: `docs/tasks/[TASK-ID]/audit.md` — append-only log

Mỗi skill chạy ghi:
```
- Timestamp: 2026-05-22T14:32:11+09:00 (JST)
- Skill: /dev:analyze
- User input verbatim: "tôi muốn auth bằng JWT vì..."
- Decision: chọn phương án B (JWT stateless)
- Artifact: analysis.md
```

> "Verbatim" = không paraphrase. Đây là evidence khi khách JP chất vấn 「なぜ?」

**Speaker notes**: Đặc biệt quan trọng với khách JP — họ hay hỏi lại sau 6-12 tháng. Có audit trail = defended. Không có = phải đoán lại.

---

## Slide 16 — HTML companion: artifact 1-shot

Convention: artifact để **review/quyết định 1 lần** → HTML, **để commit** → Markdown

| Skill | MD (commit) | HTML companion (gitignored) |
|-------|-------------|-----------------------------|
| `/dev:analyze` | `analysis.md` | `analysis-compare.html` — sort, filter options |
| `/qa:testplan` | `test-plan.md` | checklist tick + localStorage |
| `/pm:status` | — | `sprint-status.html` — kanban + velocity |

**HTML companion có gì**:
- Bảng sortable, filterable
- Checkbox lưu trong localStorage
- Pill màu cho risk/severity
- Copy button cho field

> Cảm hứng: Thariq Shihipar — *"The Unreasonable Effectiveness of HTML"*

**Speaker notes**: HTML không commit (gitignored). Mục đích là tool review nhanh — sort phương án theo effort, filter test case theo severity, etc.

---

## Slide 17 — Ask First Gates: 7 trường hợp dừng

Skill **dừng ngay** và hỏi senior trước khi tiếp tục nếu chạm:

1. Thay đổi auth / authorization
2. Breaking change trong public API
3. Database migration ảnh hưởng data
4. Shared infrastructure (config, secrets)
5. Lưu trữ PII mới
6. Production incident (debug live system)
7. Force push, reset hard, delete branch

**Trigger**: skill tự detect → render warning đỏ → `AskUserQuestion`

> Không phải "AI tự quyết định không làm". Mà "AI flag → human quyết".

**Speaker notes**: Đây là safety net. Junior dev có thể không biết "đổi cột này sẽ break 3 service khác" — framework biết, force flag.

---

## Slide 18 — Integration với role khác

Dev không làm việc một mình. Skill `/dev:*` integrate với:

```
BA: /ba:spec       ───┐
                      ▼
PM: /pm:breakdown ───→  Issue ──→  /dev:analyze
                                       │
                                       ▼
                                /dev:implement
                                       │
                                       ▼
QA: /qa:testplan  ←─── /dev:review  ────┘
                          │
                          ▼
Arch: /arch:adr    ←── /dev:pr  ──→  /docs:update
Sec: /sec:review                       │
                                       ▼
                                Baseline docs updated
```

> Framework không bắt dev kiêm role khác. Mỗi role có skill riêng, dev chỉ trigger khi cần.

**Speaker notes**: Quan trọng: dev không cần biết hết 32 skill. Chỉ cần biết 5 dev skill + biết "khi cần ADR thì gõ /arch:adr".

---

## Slide 19 — Demo flow: từ issue đến PR (5 phút)

**Scenario**: Issue "Thêm endpoint POST /api/orders để tạo order mới"

```
1. /dev:analyze
   → task-reader đọc issue
   → code-scout tìm `controllers/orders.ts`, `models/order.ts`
   → planner đưa 3 phương án: REST/RPC/GraphQL
   → human chọn REST → analysis.md
   
2. /dev:implement
   → mode: Standard
   → file 1: controllers/orders.ts → apply
   → file 2: models/order.ts → apply
   → file 3: tests/orders.test.ts → apply
   
3. /dev:review
   → review-reader scan diff
   → finding: B-01 missing input validation
   → fix → round 2 → B-01 ✅ fixed → Approve
   
4. /dev:pr
   → PR description tự sinh với AC coverage
   → push, tạo draft PR
   
5. /docs:update
   → cập nhật docs/api/orders/create.md
```

**Tổng thời gian**: ~30 phút (vs 2-3h nếu làm thuần thủ công)

**Speaker notes**: Đây là happy path. Real-world sẽ có gate phụ — nhưng workflow nguyên là vầy.

---

## Slide 20 — Cài đặt: 1 lệnh

**Claude Code (default)**:
```bash
npx agentic-development-lifecycle --yes
```

**Variants**:
```bash
# OpenCode
npx agentic-development-lifecycle --yes --opencode

# Cursor (auto-transform Claude commands → .cursor/rules/*.mdc)
npx agentic-development-lifecycle --yes --cursor

# Antigravity
npx agentic-development-lifecycle --yes --antigravity

# Developer Lite (chỉ 8 skill dev/sec/arch/docs)
npx agentic-development-lifecycle --yes --lite

# Ngôn ngữ
npx agentic-development-lifecycle --yes --lang ja   # JP
npx agentic-development-lifecycle --yes --lang en   # EN
```

**Speaker notes**: Cài 1 phát, all 4 platforms supported. Lite mode cho dev không muốn ceremonial PM/BA.

---

## Slide 21 — ROI: con số thực tế

**Trước framework**:
- 1 task feature: 4-6h (gồm context-load, design, code, review, PR description)
- Review back-and-forth: 2-3 round
- AI hallucination: ~15-20% diff cần sửa

**Sau framework**:
- 1 task feature: 1.5-2.5h (analyze 15 phút + implement 1h + review 20 phút + pr 15 phút)
- Review back-and-forth: 1 round (skill tự catch issue trước khi PR)
- AI hallucination: ~3-5% (multi-agent + risk classifier filter)

**Trade-off**:
- Setup cost: 30 phút cài + 2h học flow
- Đổi lại: -50% thời gian/task, -70% revision

**Speaker notes**: Số này từ pilot 3 dự án nội bộ. Anh em ngại "thêm process" — nhưng framework thực sự tiết kiệm thời gian, không thêm overhead.

---

## Slide 22 — Next steps & resources

**Cho dev muốn thử**:
1. Cài lite mode vào 1 repo cá nhân: `npx agentic-development-lifecycle --yes --lite`
2. Chạy 1 task pilot end-to-end (analyze → pr)
3. Feedback vào `docs/improvement-backlog.md`

**Resources**:
- Repo: https://github.com/hiepdnh/agentic-development-lifecycle
- npm: https://www.npmjs.com/package/agentic-development-lifecycle
- Role guide: `docs/workflows/role-guide.md`
- Sprint lifecycle: `docs/workflows/sprint-lifecycle.md`
- Risk classifier: `docs/risk-classifier.md`

**Q&A**

**Speaker notes**: Pilot trên dự án nhỏ trước. Đừng force toàn team adopt 1 phát. Lessons learned đẩy vào improvement-backlog → iterate framework.

---

## Appendix A — Skill reference card (in cho dev)

| Skill | Khi nào dùng | Output chính |
|-------|--------------|--------------|
| `/dev:analyze` | Có issue mới, chưa rõ approach | `analysis.md` + 2-3 options |
| `/dev:implement` | Đã chọn phương án từ analyze | Code changes file-by-file |
| `/dev:review` | Implement xong, trước PR | `review-log-R[N].md` + Approve/Request |
| `/dev:debug` | Có bug, chưa rõ root cause | Root cause + fix + regression test |
| `/dev:pr` | Review approved, ready merge | PR description chuẩn + draft PR |
| `/arch:adr` | Quyết định kiến trúc cần document | `ADR-XXX.md` |
| `/sec:review` | Standalone security audit | Security findings |
| `/docs:update` | Sau merge, cập nhật baseline | `docs/screens/*` + `docs/api/*` |

---

## Appendix B — Subagent reference

| Agent | Model | Dùng bởi | Vai trò |
|-------|-------|----------|---------|
| `task-reader` | haiku | dev:analyze | Parse issue → JSON |
| `code-scout` | haiku | dev:analyze | Tìm file liên quan |
| `planner` | sonnet | dev:analyze | Tổng hợp → options |
| `screen-designer` | haiku | dev:analyze | Stub screen design |
| `api-designer` | haiku | dev:analyze | Stub API design |
| `diff-reader` | haiku | dev:pr, docs:update | Tóm tắt diff |
| `review-reader` | haiku | dev:review | Parse diff → 4-lens signals |
| `pr-resolver` | sonnet | dev:pr | Analyze review comments → fix proposals |
| `doc-updater` | sonnet | docs:update | Update baseline docs |
| `test-gen` | sonnet | qa:testplan | Generate test cases |

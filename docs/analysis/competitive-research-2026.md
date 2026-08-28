# Competitive Research 2026 — Agentic Dev-Lifecycle Tooling Landscape

- **Mục đích**: khảo sát các công cụ/framework agentic SDLC mới nhất (2025-2026) đang cạnh tranh hoặc liền kề với ADLC, tìm gap và đề xuất phương án cải tiến có trade-off rõ ràng.
- **Phạm vi**: research-only — không implement. Theo pattern "Competitive research (G-XX)" đã dùng ở IB-007..015.
- **Ngày thực hiện**: 2026-08-27

---

## 1. Nguồn đã khảo sát (20 nguồn, 5 nhóm)

### Nhóm A — Spec-driven development frameworks

| # | Nguồn | Điểm khác biệt so với ADLC |
|---|-------|------------------------------|
| A1 | [GitHub Spec Kit](https://github.com/github/spec-kit) — 131.8k★, MIT, official GitHub project, v1.0.0 (Aug 2026) | Command-driven (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement` → **`/speckit-converge`**) với bước cuối tự động re-check implementation khớp spec/plan/tasks, lặp lại đến khi "Converged". ADLC không có bước converge tự động — `/dev-review` là review 1 lần, không loop. Spec Kit còn có **opt-in "bug" extension** (assess→fix→test, ghi thành spec artifact) và **"assess" extension** (intake→research→define→shape→**decide: go/needs-clarification/kill**) — output quyết định rõ ràng hơn `/pm-ideate`. |
| A2 | [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) — 52.4k★, MIT+trademark, npm `bmad-method` | 12+ persona agent (Analyst/PM/Architect/SM/Dev/QA/UX...), có **"Party Mode"** (nhiều persona thảo luận cùng lúc, hiển thị cho user) và **"BMad Loop"** (build+verify+retro cả 1 epic không cần người can thiệp — gần giống `/dev-autopilot` nhưng ở cấp epic, không phải 1 task). Cũng ship `.claude-plugin/marketplace.json` — cài qua Claude Code Plugin marketplace song song với `npx bmad-method install`. |
| A3 | [OpenSpec](nhắc đến trong so sánh nhiều bài, xem [DEV.to so sánh 2026](https://dev.to/willtorber/spec-kit-vs-bmad-vs-openspec-choosing-an-sdd-framework-in-2026-d3j)) | Được benchmark là **nhanh nhất** trong 1 case thực tế (12 phút vs 90 phút Spec Kit vs 5.5 giờ BMAD cho cùng 1 CRM dashboard) — trade-off tốc độ/độ nghiêm ngặt là trục lựa chọn chính giữa các framework loại này, ADLC hiện chỉ có 1 mức độ nghiêm ngặt cố định (risk-classifier chọn quy trình nhưng không có "siêu nhẹ" mode). |
| A4 | [ai-sdlc-framework/ai-sdlc](https://github.com/ai-sdlc-framework/ai-sdlc) — Apache-2.0, TypeScript, docs tại ai-sdlc.io | Không phải "spec-first" thuần mà là **"Decision Engine"**: Definition-of-Ready (DoR) gate chặn dispatch task chưa đủ quyết định; **Cross-Harness Review** — 3 reviewer subagent chạy song song, DSSE envelope ghi rõ harness nào review — nếu Claude implement thì Claude KHÔNG được review chính mình, Codex review ngược lại — "reviewer collusion mechanically impossible". Đây là gap lớn nhất so với `/dev-review` (xem Gap G-10). |

### Nhóm B — Multi-agent orchestration frameworks

| # | Nguồn | Điểm khác biệt so với ADLC |
|---|-------|------------------------------|
| B1 | [CrewAI](https://zenml.io/blog/crewai-vs-autogen) — 35k★, 1.3M installs/tháng trên PyPI | Role-based crew, orchestration top-down/deterministic — gần triết lý ADLC nhất (mỗi skill = 1 role rõ ràng) nhưng CrewAI target runtime Python app, không phải markdown skill-pack cho coding assistant. |
| B2 | [AutoGen/AG2 (Microsoft)](https://www.zenml.io/blog/crewai-vs-autogen) | Bottom-up, conversation-driven — agent tự quyết định khi nào "nói", nhiều agent brainstorm qua message. Khác hẳn ADLC (orchestrator skill luôn chủ động điều phối tuần tự/song song, không có "emergent dialogue"). |
| B3 | [Microsoft Agent Framework](https://www.langchain.com/resources/ai-agent-frameworks) — unified successor của AutoGen + Semantic Kernel, GA 10/2025 | Có "responsible AI guardrails" tích hợp qua Azure AI Foundry — governance-as-a-service, khác với ADLC's approach (governance nằm trong markdown convention, không có runtime enforcement). |
| B4 | ai-sdlc-framework's **Autonomous Pipeline Orchestrator** (`cli-orchestrator tick`) — xem A4 | Duyệt dependency graph nhiều task, tự dispatch task đã "ready" (qua DoR gate) vào git worktree riêng, chạy Step 0-13 pipeline, quarantine khi fail, resume từ checkpoint. ADLC's `/dev-autopilot` chỉ tự động hoá **1 task**, không có multi-task dependency dispatch (xem Gap G-11). |

### Nhóm C — IDE-native / CLI coding agent tooling

| # | Nguồn | Điểm khác biệt so với ADLC |
|---|-------|------------------------------|
| C1 | [Cursor](https://weavai.app/blog/en/2026/05/31/cursor-vs-windsurf-2026-ultimate-ai-ide-comparison/) — 1M+ DAU, $2B+ ARR, OS-level sandboxing từ đầu 2026 (giảm 40% permission prompt) | Sandbox ở cấp OS, ADLC chỉ có allow/deny list trong `.claude/settings.json` (không sandbox thật) — ADLC là skill-pack nên không tự làm được sandbox, nhưng có thể khuyến nghị policy chặt hơn (xem Gap G-16). |
| C2 | [Codex CLI](https://blog.arcbjorn.com/state-of-cli-coding-agents-2026) — 67k★, Linux kernel-level sandbox mặc định, có "persistent Goals with token budgets" + "thread-level delegation to subagents" từ đầu 2026 | Codex CLI's "Goals with token budgets" gần giống chính cơ chế `goal` tool đang dùng trong session này — xác nhận xu hướng ngành đang chuẩn hoá pattern goal-mode + budget cho agentic work. |
| C3 | [Google Antigravity CLI](https://www.danilchenko.dev/posts/antigravity-cli-vs-claude-code/) — Go, async multi-agent orchestration, "Manager View" chạy tối đa 5 agent song song trong 1 editor | ADLC đã có transformer xuất bản cho Antigravity (`.antigravity/skills/`) nhưng dùng chung OpenCode syntax — chưa tận dụng Antigravity's "Manager View" multi-agent-song-song đặc thù. |
| C4 | [Aider](https://amux.io/guides/ai-coding-tools-compared-2026/) — 44k★, model-agnostic, giữ nguyên interactive-by-design triết lý (không autonomous) | Đối lập hẳn với autonomous trend — xác nhận vẫn có thị trường cho interactive-only, củng cố nguyên tắc "Human Gate" cốt lõi của ADLC không lỗi thời. |

### Nhóm D — Claude/Agent Skills marketplace & skill-pack ecosystem

| # | Nguồn | Điểm khác biệt so với ADLC |
|---|-------|------------------------------|
| D1 | [anthropics/skills](https://github.com/anthropics/skills) — 172k★, official Anthropic repo, "Agent Skills" giờ là **open standard** (công bố 12/2025, hỗ trợ cả Claude Code, Claude.ai, API, OpenAI Codex, Cursor, Gemini CLI, Antigravity, Windsurf) | Phân phối qua **Claude Code Plugin marketplace** (`.claude-plugin/marketplace.json`, `/plugin marketplace add`, `/plugin install`) — ADLC hiện chỉ phân phối qua `npx` installer script tự viết, chưa dùng cơ chế plugin marketplace native (xem Gap G-14). Cũng xác nhận **skill progressive-loading** (chỉ ~100 token name+description load trước, full body <5000 token load khi cần) — đúng kiến trúc ADLC đang dùng (frontmatter description để trigger). |
| D2 | [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) — 1000+ skill/plugin curated | Cho thấy category phổ biến nhất là domain-specific single-purpose skills (PDF, brand guideline, data...), khác ADLC (skill-pack theo *role* cho toàn bộ SDLC) — ADLC là outlier hiếm về độ toàn diện, không nhiều đối thủ trực tiếp "toàn bộ SDLC role-based skill pack". |
| D3 | Antigravity Awesome Skills (qua [bài Medium 10 Must-Have Skills 2026](https://medium.com/@unicodeveloper/10-must-have-skills-for-claude-and-any-coding-agent-in-2026-b5451b013051)) — 1,234+ skill, 22k★, cross-tool (mọi coding assistant chính) | Tổ chức theo category + "installable with a single command" — closer về UX cài đặt so với ADLC's multi-flag npx installer (`--opencode/--cursor/--antigravity/--codex/--copilot/--lite/--lang`), có thể là điểm ADLC nên đơn giản hoá UX cài đặt. |
| D4 | [skillmarketplace.ai](https://skillmarketplace.ai/) / [SkillsMP](https://skillsmp.com/) / [mcpservers.org/agent-skills](https://mcpservers.org/agent-skills) — các marketplace tổng hợp skill công khai | Xác nhận thị trường "skill discovery" đang hình thành — ADLC's 35 skill hiện KHÔNG được list trên các marketplace này (chỉ phân phối qua npm registry riêng) — cơ hội tăng reach nếu submit. |

### Nhóm E — JP market / bilingual offshore dev trends (differentiator ngách của ADLC)

| # | Nguồn | Điểm khác biệt so với ADLC |
|---|-------|------------------------------|
| E1 | [Japan AI Basic Plan (Dec 2025)](https://www.helloworldjapan.com/en/articles/japan-wants-ai-talent-foreign-engineers-2026) — chính phủ Nhật tự nhận "behind in AI use, AI development, AI investment" | Xác nhận nhu cầu thị trường JP về công cụ AI dev process hoá — đúng đối tượng ADLC nhắm tới (JP outsource teams), nhưng ADLC chưa có tài liệu/case study nào định lượng lợi ích cho khách JP (ROI, time-saved) để làm sale material. |
| E2 | [Bridge Engineer role definition (TokyoDev)](https://www.tokyodev.com/articles/what-is-a-bridge-engineer-in-japan) | Xác nhận role `be-bridge`/`be-changerequest`/`be-glossary` của ADLC ánh xạ đúng thực tế nghề nghiệp — không có framework đối thủ nào (Spec Kit/BMAD/CrewAI...) có khái niệm bridge-engineer hay JP deliverable format (設計書, 単体テスト仕様書...) — đây là **lợi thế cạnh tranh độc nhất của ADLC**, không nên hy sinh khi "hiện đại hoá". |
| E3 | [AGNTCon + MCPCon Japan 2026](https://techedgeai.com/agntcon-japan-2026-puts-enterprise-ai-agent-security-in-focus/) — sự kiện Tokyo 10-11/9/2026, 40+ session về agent orchestration/interoperability/security | Sự kiện lớn đầu tiên tại Nhật riêng về agentic AI — cơ hội quan sát trend JP-specific agent tooling adoption, và khả năng ADLC có thể present/case-study tại đây để tăng nhận diện trong chính thị trường mục tiêu. |
| E4 | [AI code review tools trong offshore dev 2026](https://nkk.com.vn/ai-code-review-tools-offshore-development-2026/) | Xác nhận AI code review đã trở thành "cornerstone" cho remote team productivity — `/dev-review` của ADLC đã có, nhưng chưa tích hợp voice/browser-verification như Antigravity 2.0 (built-in browser verification) cho UI-affecting task. |

---

## 2. Gap Analysis — 10 gap, mỗi gap 2-3 phương án kèm trade-off

### G-10: Không có cơ chế Cross-Harness Review — reviewer có thể "tự review chính mình"

**Nguồn**: A4 (ai-sdlc-framework Cross-Harness Review). ADLC's `/dev-review` chạy trong cùng 1 session/model đã implement (dù `/dev-autopilot` có 2 evaluator riêng — `autopilot-reviewer` + `autopilot-adversary` — nhưng cả 2 đều cùng model `sonnet`, cùng harness Claude).

| Option | Mô tả | Effort | Risk | Ai hưởng lợi |
|--------|-------|--------|------|---------------|
| A | Thêm "Independent Harness" gate opt-in vào `/dev-review`: nếu user có sẵn CLI khác (Codex/Copilot/OpenCode) đã cấu hình, `/dev-review` đề xuất chạy review đó bằng công cụ khác thay vì cùng Claude session, và ghi rõ trong `review-log.md` harness nào đã review | Trung bình — cần thêm field "harness" vào `templates/review-log.md`, hướng dẫn user chạy review chéo thủ công | Thấp — chỉ document + optional field, không auto-invoke tool khác (ADLC không thể tự gọi CLI khác từ trong 1 skill) | Team có multi-tool stack (rất phổ biến ở JP outsource — nhiều dev dùng Copilot, PM dùng Claude) |
| B | Tăng cường `autopilot-reviewer`/`autopilot-adversary` — chỉ định model KHÁC nhau thực sự (vd: reviewer=sonnet, adversary=opus hoặc haiku) thay vì cùng sonnet, giảm correlated blind-spot dù vẫn cùng 1 harness (Claude) | Thấp — sửa `agents/autopilot-reviewer.md`/`autopilot-adversary.md` model hint | Thấp | Chỉ user dùng `/dev-autopilot` |
| C | Bỏ qua — DSSE cryptographic attestation + đa-harness orchestration là hạ tầng cấp enterprise (đòi hỏi CI/CD tích hợp thật), không hợp với triết lý "skill-pack chạy trong 1 phiên chat" của ADLC | 0 | 0 | — |

### G-11: Không có multi-task dependency-graph dispatcher — `/dev-autopilot` chỉ tự động 1 task

**Nguồn**: A4, B4 (ai-sdlc-framework `cli-orchestrator tick`).

| Option | Mô tả | Effort | Risk | Ai hưởng lợi |
|--------|-------|--------|------|---------------|
| A | Thêm field `Depends on: TASK-XXX` vào `templates/task-doc-requirements.md` frontmatter + panel "Blocked / Ready" mới trong `bin/dashboard.js` (đọc frontmatter, vẽ trạng thái) — chỉ **hiển thị**, không tự động dispatch | Trung bình — 1 field template + 1 parser mới trong dashboard.js | Thấp | PM theo dõi sprint nhiều task song song |
| B | Full autonomous multi-task dispatcher (như `cli-orchestrator tick`) — 1 script mới lặp qua `docs/tasks/*/requirements.md`, tự trigger `/dev-autopilot` cho task "ready" tiếp theo | Cao — cần state machine, worktree isolation, resume-from-checkpoint | Cao — mâu thuẫn "Human Gate" nguyên tắc cốt lõi (CLAUDE.md #1), rủi ro chạy nhầm task, khó review trước khi build | Team lớn, nhiều task độc lập chạy song song |
| C | Bỏ qua — ADLC target team nhỏ (VN outsource + JP bridge), thường 1-3 dev/sprint, multi-task auto-dispatch giá trị thấp so với effort/risk | 0 | 0 | — |

### G-12: `/pm-ideate` thiếu bước research cạnh tranh + quyết định Go/Kill rõ ràng

**Nguồn**: A1 (Spec Kit "assess" extension: intake→research→define→shape→**decide: go/needs-clarification/kill**).

| Option | Mô tả | Effort | Risk | Ai hưởng lợi |
|--------|-------|--------|------|---------------|
| A | Thêm sub-bước "Research" vào Bước 2 (Diverge) của `/pm-ideate`: dùng `web_search` kiểm tra đã có sản phẩm/pattern nào giải quyết vấn đề tương tự chưa, trước khi generate variations | Thấp — thêm 1 đoạn hướng dẫn + ví dụ web_search call | Thấp | PM/BA tránh "reinvent the wheel" |
| B | Đổi output cuối `/pm-ideate` từ "chọn 1 hướng" sang 3-way quyết định tường minh: **Go** (chạy `/ba-spec` ngay) / **Cần research thêm** (lặp lại Bước 2-3) / **Kill** (dừng, ghi lý do vào backlog) | Thấp — sửa Bước 4 gate table | Thấp | Tránh spec cho ý tưởng đáng lẽ nên bị loại sớm |
| C | Bỏ qua — `/pm-ideate` hiện đã đủ nhẹ cho quy mô team ADLC nhắm tới; thêm research step có thể làm chậm ý tưởng đơn giản không cần | 0 | 0 | — |

### G-13: `/dev-debug` không có bước "converge" tự xác nhận fix khớp báo cáo gốc

**Nguồn**: A1 (Spec Kit's `/speckit-converge` — loop lại đến khi implementation khớp spec/plan/tasks).

| Option | Mô tả | Effort | Risk | Ai hưởng lợi |
|--------|-------|--------|------|---------------|
| A | Thêm sub-check vào Bước 5 (Guard) của `/dev-debug`: bắt buộc re-chạy chính minimal reproduction từ Bước 3 sau khi fix, xác nhận không còn lỗi, TRƯỚC khi cho phép đóng — hiện tại Bước 5 chỉ hỏi "thêm test regression?" mà không bắt buộc re-run repro gốc | Thấp — thêm 1 dòng bắt buộc vào Bước 5 | Thấp | Tránh trường hợp "tưởng đã fix" nhưng chưa verify lại đúng cách |
| B | Bỏ qua — Bước 4 (Fix) trong `/dev-debug` v.v đã có Ask First Gate, coi việc re-verify là trách nhiệm ngầm định của dev, không cần thêm bước tường minh | 0 | 0 | — |

### G-14: ADLC chưa phân phối qua Claude Code Plugin Marketplace (chuẩn mới official từ 12/2025)

**Nguồn**: D1 (anthropics/skills, BMAD-METHOD's `.claude-plugin/marketplace.json`).

| Option | Mô tả | Effort | Risk | Ai hưởng lợi |
|--------|-------|--------|------|---------------|
| A | Thêm `.claude-plugin/marketplace.json` mô tả ADLC skill-pack, cho phép `/plugin marketplace add hiepdnh/Agentic-Development-Lifecycle` + `/plugin install adlc@...` — **kênh phân phối song song**, không thay thế `npx` installer hiện tại (giữ đa nền tảng Codex/Cursor/OpenCode/Copilot/Antigravity) | Trung bình — cần hiểu rõ schema marketplace.json, test cài qua plugin | Thấp — thêm file mới, không đụng luồng cài hiện có | User Claude Code muốn cài nhanh không cần rời terminal, tăng discoverability trên marketplace liệt kê ở D4 |
| B | Submit ADLC vào các awesome-list/marketplace bên thứ 3 đã khảo sát (D2-D4: ComposioHQ, travisvn, skillmarketplace.ai, SkillsMP) — chỉ cần PR, không sửa code ADLC | Rất thấp | Rất thấp | Tăng reach, marketing thuần tuý |
| C | Bỏ qua — Plugin marketplace chỉ hỗ trợ Claude Code, ADLC's core value là multi-platform; effort thêm channel không tương xứng với lợi ích khi core dev vẫn ưu tiên npx | 0 | 0 | — |

### G-15: `dev-review`/`dev-autopilot` chưa tận dụng "browser verification" pattern (Antigravity 2.0)

**Nguồn**: C3, E4 (Google Antigravity 2.0 built-in browser verification).

| Option | Mô tả | Effort | Risk | Ai hưởng lợi |
|--------|-------|--------|------|---------------|
| A | Thêm ghi chú vào `/dev-review` Lens 1 (Code Quality): nếu task ảnh hưởng UI, khuyến nghị dùng `browser` tool (đã sẵn có trong harness omp) chụp screenshot/verify trước khi Approve — chính là pattern § Workflow đã ghi ("UI change → verify against actual surface") nhưng chưa được nhắc lại tường minh trong `/dev-review` skill | Thấp — thêm 1 dòng gợi ý trong `.claude/skills/dev-review/SKILL.md` | Thấp | Giảm bug UI lọt qua review |
| B | Bỏ qua — quy tắc verify UI đã nằm ở cấp harness-wide (§ Workflow bước 5), không cần lặp lại trong từng skill riêng lẻ — tránh trùng lặp | 0 | 0 | — |

### G-16: `.claude/settings.json` permission model chưa có deny-list phòng exfiltration khi chạy autonomous

**Nguồn**: C1, C2 (Cursor OS-sandbox, Codex CLI kernel-sandbox — ADLC không tự làm được sandbox nhưng có thể siết policy).

| Option | Mô tả | Effort | Risk | Ai hưởng lợi |
|--------|-------|--------|------|---------------|
| A | Thêm khuyến nghị vào CLAUDE.md: deny thêm `curl`, `wget`, `nc` trong `.claude/settings.json` khi chạy `/dev-autopilot` không giám sát, giảm rủi ro exfiltration nếu agent bị prompt-injection từ nội dung code độc hại | Thấp — chỉ update tài liệu + ví dụ settings.json | Thấp | Team chạy `/dev-autopilot` không giám sát trên codebase lạ/brownfield |
| B | Bỏ qua — deny-list hiện tại (chặn `git push`, `git reset --hard`, `rm -rf`) đã đủ cho mô hình đe doạ hiện tại (nội bộ team, không phải đối kháng); thêm network-tool deny có thể chặn nhầm workflow hợp lệ (vd: gọi API test) | 0 | 0 | — |

### G-17: `docs/decisions/ADR` + `docs/baseline` không có 1 "project-context digest" auto-load

**Nguồn**: BMAD's "durable context" concept (`docs/explanation/project-context.md`, "carry decisions forward instead of re-explaining every chat").

| Option | Mô tả | Effort | Risk | Ai hưởng lợi |
|--------|-------|--------|------|---------------|
| A | Thêm `docs/project-context.md` — 1 file digest ngắn (không quá 1 trang) tóm tắt kiến trúc hiện tại + constraint cứng, được `arch-adr`/`docs-update` cập nhật incremental mỗi khi có ADR mới; CLAUDE.md hướng dẫn skill đọc file này ở Bước 0 nếu tồn tại | Trung bình — cần quy tắc "khi nào update" rõ để tránh lệch với ADR gốc | Trung bình — nguy cơ trở thành **second source of truth** lệch pha với `docs/decisions/ADR-*.md` nếu không maintain đều | Task mới/onboard nhanh không cần đọc hết ADR history |
| B | Bỏ qua — `docs/decisions/ADR-*.md` (append-only, versioned) đã là nguồn thật; thêm digest file rủi ro DRY violation, đi ngược nguyên tắc "Template-first" và "Delta Specs" của CLAUDE.md | 0 | 0 | — |

### G-18: Không có tamper-evidence tối thiểu cho `templates/audit.md` (so với DSSE attestation)

**Nguồn**: A4 (ai-sdlc-framework DSSE envelope + compliance posture EU AI Act/NIST AI RMF/ISO 42001).

| Option | Mô tả | Effort | Risk | Ai hưởng lợi |
|--------|-------|--------|------|---------------|
| A | Thêm field `hash` (SHA-256 của diff + timestamp + tên agent/model) vào mỗi entry `audit.md`, sinh bởi 1 helper nhỏ `bin/audit-hash.js` — tamper-evidence tối thiểu, không cần PKI | Trung bình — script mới + update `templates/audit.md` | Thấp | Team JP cần audit trail khi khách hỏi "ai/agent nào làm thay đổi gì" |
| B | Bỏ qua — DSSE/Sigstore-grade attestation là hạ tầng compliance doanh nghiệp lớn, không tương xứng đối tượng ADLC (team nhỏ VN/JP outsource); `audit.md` plain-text đã đủ minh bạch nội bộ | 0 | 0 | — |

### G-19: Cài đặt ADLC có 7 flag riêng biệt (`--opencode/--cursor/--antigravity/--codex/--copilot/--lite/--lang`) — UX phức tạp hơn "1-command install" của đối thủ

**Nguồn**: D3 (Antigravity Awesome Skills "installable with a single command"), C-nhóm (đối thủ đều có UX cài 1 lệnh).

| Option | Mô tả | Effort | Risk | Ai hưởng lợi |
|--------|-------|--------|------|---------------|
| A | Thêm bước interactive picker vào `bin/install.js` khi chạy KHÔNG có flag nào (hiện đã dùng `@clack/prompts` — kiểm tra xem đã có picker chưa; nếu chưa, thêm 1 màn hình chọn platform+lang trước khi copy, giảm nhu cầu nhớ flag) | Thấp-Trung bình — tuỳ code hiện tại của `bin/install.js` đã có prompt chưa | Thấp | User lần đầu cài, không đọc hết README flag list |
| B | Bỏ qua — flag hiện tại đã map trực tiếp 1-1 với nhu cầu chọn platform, người dùng lặp lại (update) hưởng lợi từ flag tường minh hơn hỏi lại mỗi lần; không phải vấn đề thực tế | 0 | 0 | — |

---

## 3. Ghi chú tổng hợp

- **Không nguồn nào đề xuất bỏ Human Gate / Multiple Options / Fresh Context / Two-tier Docs / Delta Specs / Template-first** (6 nguyên tắc cốt lõi CLAUDE.md) — các framework đối thủ đi theo hướng "autonomous hơn" (BMad Loop, ai-sdlc-framework's autonomous orchestrator) đều đánh đổi bằng governance hạ tầng nặng hơn (DSSE, worktree isolation, dependency graph state machine) mà ADLC's target user (team nhỏ VN/JP outsource) chưa cần.
- **Lợi thế cạnh tranh độc nhất đã xác nhận qua research**: không có framework/tool nào khảo sát được (Spec Kit, BMAD, CrewAI, AutoGen, ai-sdlc-framework, Cursor, Windsurf, Antigravity, Codex CLI, Aider) có khái niệm bridge-engineer, JP deliverable format (設計書/引き継ぎ書/変更依頼書...), hay bilingual VN-EN-JP glossary workflow — đây là "moat" ADLC nên bảo vệ, không hy sinh khi hiện đại hoá.
- **Xu hướng ngành mạnh nhất 2025→2026**: (1) spec-as-executable-contract thay vì tài liệu tĩnh, (2) cross-harness/independent review để loại bỏ reviewer collusion, (3) autonomous multi-task dispatch với dependency graph, (4) phân phối qua plugin marketplace chuẩn hoá. ADLC đã bắt kịp (1) một phần (task-doc-requirements + delta specs) nhưng còn thiếu (2), (3) ở mức multi-task, và (4).

---

## 4. Traceability

Mỗi gap G-10..G-19 tương ứng 1 entry trong `docs/improvement-backlog.md` (IB-039..IB-048), status `open`, chờ user chọn phương án trước khi implement.

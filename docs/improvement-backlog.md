# Improvement Backlog

Log các friction và gap phát hiện khi dùng framework. Agent **bắt buộc** thêm entry vào đây thay vì tự suy luận lại nhiều lần.

---

## Khi nào thêm entry

Thêm entry khi gặp bất kỳ tình huống nào sau:

- Phải manually reason về điều gì đó đáng lẽ đã có rule/template
- Gate không đủ rõ → phải đoán hành vi
- Template thiếu field quan trọng → phải tự bổ sung
- Cùng một vấn đề xuất hiện lần thứ 2+ trong các tasks khác nhau
- Skill trigger không đúng với intent thực tế của user
- Subagent output không đủ để bước tiếp theo xử lý

---

## Cách thêm entry

Dán vào bảng bên dưới. Không cần confirm với human — thêm trực tiếp.

Format:
```
| IB-XXX | [skill/context phát hiện] | [mô tả friction cụ thể] | [proposed fix ngắn gọn] | open |
```

---

## Backlog

| ID | Phát hiện từ | Friction | Proposed Fix | Status |
|----|-------------|----------|--------------|--------|
| IB-001 | dev:analyze | Không có bước classify risk trước khi spawn subagents — dễ miss high-risk task | Thêm Risk Classifier bước 0 vào dev:analyze | ✅ done |
| IB-002 | dev:implement | verification.md per-task không cho thấy toàn cảnh coverage | Tạo validation-matrix.md global | ✅ done |
| IB-003 | Tổng quát | Không có cơ chế để agent log gaps — mỗi session phải reason lại từ đầu | Tạo improvement-backlog.md này | ✅ done |
| IB-004 | Tổng quát (post bài viết Thariq) | Skill output mặc định Markdown kể cả khi artifact để review tương tác — bỏ lỡ giá trị HTML cho sort/filter/checklist | Thêm Output Format Convention vào CLAUDE.md, tạo `templates/html-artifact.html` + `templates/html-bilingual.html`, nâng cấp 5 skill nhóm A (dev:analyze, qa:testplan, qa:regression, pm:status, be:bridge) | ✅ done |
| IB-005 | Tổng quát (học từ AIDLC repo) | Không có observability layer — PM/BE/SM phải đào từng `docs/tasks/[ID]/*.md` để biết sprint health | Tạo `bin/dashboard.js` generator + `templates/dashboard.html` + `/pm-dashboard` slash command | ✅ done |
| IB-006 | Dashboard v1 | Dashboard v1 chỉ có kanban + 2 table đơn giản, thiếu git activity/skill heatmap/validation chart/watch mode | Rebuild v2: ckm-design-system tokens, 6 new parsers (git/audit/validation/skills/growth), SVG charts, watch mode | ✅ done |
| IB-007 | Competitive research (G-01) | Không có knowledge transfer / handover flow — JP client hỏi "dev nghỉ thì sao?" | Tạo /pm-handover skill + 引き継ぎ書 template (VN + JP) | ✅ done |
| IB-008 | Competitive research (G-02) | Không có maintenance mode workflow — sprint lifecycle quá heavy cho sustain phase | Tạo /pm-maintain skill với triage matrix + 月次保守報告書 | ✅ done |
| IB-009 | Competitive research (G-03) | Không có formal 変更管理 — spec thay đổi giữa sprint không có approval trail | Tạo /be-changerequest skill + CR document template (VN + JP) | ✅ done |
| IB-010 | Competitive research (G-04) | Không có release notes skill — JP clients muốn リリースノート chính thức | Tạo /pm-release skill với HTML + Markdown output | ✅ done |
| IB-011 | Competitive research (G-05) | Glossary template có nhưng không có skill cập nhật — term mới bị bỏ qua | Tạo /be-glossary skill | ✅ done |
| IB-012 | Competitive research (G-06) | ba:reverse chỉ brownfield — không có greenfield kickoff flow | Tạo /pm-kickoff skill với tech stack ADRs + Sprint 0 checklist | ✅ done |
| IB-013 | Competitive research (G-07) | Không có PR comment resolver — dev phải manually address từng comment | Tạo agents/pr-resolver.md + wire vào /dev-pr opt-in gate | ✅ done |
| IB-014 | Competitive research (G-08) | dev:implement không enforce test-first — TDD lane không có | Thêm TDD lane opt-in (Bước 1b) vào /dev-implement | ✅ done |
| IB-015 | Competitive research (G-09) | dev:review bỏ qua performance lens — N+1, caching, scalability không được check | Thêm Lens 3 Performance vào /dev-review | ✅ done |
| IB-016 | Framework review 2026-05-13 | `be:changerequest`, `pm:handover` inline templates thay vì reference `templates/` — DRY risk | Extract inline templates ra `templates/change-request.md`, `templates/handover.md` | ✅ done |
| IB-017 | Framework review 2026-05-13 | `pm:ideate` dùng plain text Q&A thay vì `AskUserQuestion` tool | Refactor sang AskUserQuestion cho gates có options rõ ràng | ✅ done |
| IB-018 | Framework review 2026-05-13 | `install.md` dùng text confirmation thay vì `AskUserQuestion` | Chuyển sang AskUserQuestion cho consistency | ✅ done |
| IB-019 | Framework review 2026-05-13 | `dev:debug.md` mô tả subagent trong lý thuyết nhưng không spawn trong execution flow | Hoặc wire Agent() spawn vào flow, hoặc xoá phần lý thuyết | ✅ done |
| IB-020 | Framework review 2026-05-13 | `agents/test-gen.md` output hybrid JSON + prose, không consistent với 7 agents còn lại | Chuẩn hoá thành pure JSON | ✅ done |
| IB-021 | Framework review 2026-05-13 | `agents/code-scout.md` `read_status: "partial \| full"` không có guidance khi nào dùng gì | Thêm decision rule vào agent spec | ✅ done |
| IB-022 | Framework review 2026-05-13 | `bin/dashboard.js:176` date comparison dùng string compare — fragile với non-ISO inputs | Convert sang Date object trước khi compare | ✅ done |
| IB-023 | Framework review 2026-05-13 | `bin/dashboard.js` watch mode không watch git activity changes | Thêm git HEAD/index vào watcher | ✅ done |
| IB-024 | Framework review 2026-05-13 | `setup.ps1` + `setup.sh` prompt `[y/N]` chỉ accept `Y/y`, không accept `yes` (không consistent với `install.js`) | Accept cả `yes`/`y` (case-insensitive) | ✅ done |
| IB-025 | Framework review 2026-05-13 | `setup.ps1:162` GitHub URL hardcoded — khó maintain khi đổi org/repo | Đưa URL ra biến đầu file | ✅ done |
| IB-026 | Security audit 2026-08-27 | `bin/dashboard.js` embed `JSON.stringify(data)` thô vào `<script>` inline của `templates/dashboard.html` — chuỗi `</script>` trong commit message/task title thoát khỏi thẻ script, XSS trong dashboard.html sinh ra | Escape `<` (`\u003c`) trong embedded JSON trước khi substitute | ✅ done |
| IB-027 | Security audit 2026-08-27 | `mcp-server/adlc-tasks/server.js` `getTaskStatus`/`getRiskClassification` nối `taskId` do client cung cấp vào fs path không sanitize — path traversal | Thêm guard `isValidTaskId()` (pattern TASK-XXX) trước path.join | ✅ done |
| IB-028 | CI audit 2026-08-27 | `tests/skill-triggering/opencode-run-test.ps1` không bao giờ so khớp prompt với description — luôn pass nếu file tồn tại, không bắt được regression trigger sai skill | Implement keyword/trigger-phrase overlap check thực sự | ✅ done |
| IB-029 | Skill consistency audit 2026-08-27 | 11 skills (sm-standup, sm-retro, ops-incident, dev-debug, arch-review, arch-adr, ops-deploy, docs-update, pm-status, qa-testplan, qa-bug) có gate Q&A table nhưng không emit bold marker `**Chờ confirm.**`/`**Wait for confirmation.**` theo yêu cầu CLAUDE.md | Thêm marker sau mỗi gate block (VN+EN) | ✅ done |
| IB-030 | Skill consistency audit 2026-08-27 | CLAUDE.md Subagent table thiếu `screen-designer` + `api-designer` (đang live, được dev-analyze Bước 5.5 spawn) | Thêm 2 dòng vào bảng | ✅ done |
| IB-031 | Skill consistency audit 2026-08-27 | 6/35 file `.ja.md` (dev-analyze, pm-maintain, install, be-changerequest, be-glossary, be-bridge) là full inline JA translation (150-313 dòng) thay vì convention pointer-style của 29/35 skill còn lại (tóm tắt ngắn + link sang EN/VN canonical) | Quyết định: collapse về pointer-style, HOẶC document rõ đây là exception có chủ đích cho skill JP-client-facing trong CLAUDE.md | ✅ done |
| IB-032 | Security audit 2026-08-27 | `bin/install.js`/`setup.sh`/`setup.ps1` `--yes` bypass confirm prompt mà không có safety check độc lập trên destination — `--yes --update` chạy unattended có thể silently overwrite framework files sai thư mục | Thêm target-sanity guard (yêu cầu marker file hoặc `--force` khi target không rỗng/không liên quan) khi `--yes` kết hợp `--update` | ✅ done |
| IB-033 | Security audit 2026-08-27 | Chưa verify CVE status của `@clack/prompts`/`picocolors` từ nội dung file | Chạy `npm audit` / tra OSV trước release tiếp theo | ✅ done |
| IB-034 | CI audit 2026-08-27 | `.github/workflows/*.yml` dùng mutable tag (`actions/checkout@v4`, `actions/setup-node@v4`) thay vì SHA-pinned — supply-chain hardening gap chuẩn | Pin về commit SHA | ✅ done |
| IB-035 | CI audit 2026-08-27 | `package.json` `engines.node: ">=16"` chưa từng được test thật — cả 2 CI workflow chỉ chạy Node 20 | Thêm job Node 16 vào installer-smoke.yml, hoặc nâng floor khai báo cho khớp thực tế | ✅ done |
| IB-036 | CI audit 2026-08-27 | Không có `npm test` script dù có thư mục `tests/` — `scripts/validate-skills.js` (không phụ thuộc live API) là candidate tự nhiên cho `npm test` nhưng chưa được wire | Thêm `"test": "node scripts/validate-skills.js"` vào package.json scripts | ✅ done |
| IB-037 | Follow-up từ fix IB-028 | Prompt JA của OpenCode skill-triggering dùng dấu ngoặc full-width `「...」` cho trigger phrase; matcher mới của `opencode-run-test.ps1` chỉ parse dấu `"..."` ASCII — chạy suite JA sẽ không tìm thấy quoted phrase nào | Mở rộng regex trigger-phrase để match cả `「...」` | ✅ done |
| IB-038 | CI audit 2026-08-27 | Cursor và Antigravity installer-smoke check chỉ assert file count/existence, không có content/frontmatter validator tương đương `scripts/validate-codex-skills.js` (đang gate codex/copilot) | Mở rộng pattern validate-codex-skills.js (hoặc validator nhẹ mới) sang output cursor/antigravity | ✅ done |
| IB-039 | Competitive research (G-10) 2026-08-27 | Không có cơ chế Cross-Harness Review — `/dev-review` và `/dev-autopilot`'s 2 evaluator đều chạy cùng harness/model, reviewer có thể "tự review chính mình" (so với ai-sdlc-framework's DSSE-attested cross-harness review) | Xem `docs/analysis/competitive-research-2026.md#G-10` — 2 phương án: opt-in independent-harness gate trong dev-review, hoặc model đa dạng hơn cho autopilot-reviewer/adversary | ✅ done |
| IB-040 | Competitive research (G-11) 2026-08-27 | Không có multi-task dependency-graph dispatcher — `/dev-autopilot` chỉ tự động 1 task, không như ai-sdlc-framework's `cli-orchestrator tick` duyệt dependency graph nhiều task | Xem `docs/analysis/competitive-research-2026.md#G-11` — field `Depends on` + dashboard panel (nhẹ) vs full autonomous dispatcher (nặng, mâu thuẫn Human Gate) | ✅ done |
| IB-041 | Competitive research (G-12) 2026-08-27 | `/pm-ideate` thiếu bước research cạnh tranh + quyết định Go/Kill rõ ràng so với Spec Kit's assess extension (intake→research→define→shape→decide) | Xem `docs/analysis/competitive-research-2026.md#G-12` — thêm sub-bước research + 3-way Go/Cần research thêm/Kill | ✅ done |
| IB-042 | Competitive research (G-13) 2026-08-27 | `/dev-debug` không bắt buộc re-run minimal reproduction sau fix để tự xác nhận khớp báo cáo gốc, khác Spec Kit's `/speckit-converge` loop | Xem `docs/analysis/competitive-research-2026.md#G-13` — thêm bắt buộc re-verify vào Bước 5 Guard | ✅ done |
| IB-043 | Competitive research (G-14) 2026-08-27 | ADLC chưa phân phối qua Claude Code Plugin Marketplace (chuẩn official từ 12/2025, `anthropics/skills` + BMAD-METHOD đều đã dùng) | Xem `docs/analysis/competitive-research-2026.md#G-14` — thêm `.claude-plugin/marketplace.json` làm kênh song song, hoặc submit vào awesome-list bên thứ 3 | ✅ done |
| IB-044 | Competitive research (G-15) 2026-08-27 | `/dev-review` chưa nhắc tường minh dùng browser tool verify UI-affecting task, khác Antigravity 2.0's built-in browser verification | Xem `docs/analysis/competitive-research-2026.md#G-15` — thêm gợi ý browser verify vào Lens 1 Code Quality | ✅ done |
| IB-045 | Competitive research (G-16) 2026-08-27 | `.claude/settings.json` chưa có deny-list network tool (curl/wget/nc) phòng exfiltration khi chạy `/dev-autopilot` không giám sát, khác Cursor/Codex CLI's OS/kernel-level sandbox | Xem `docs/analysis/competitive-research-2026.md#G-16` — khuyến nghị deny-list mở rộng trong CLAUDE.md | ✅ done |
| IB-046 | Competitive research (G-17) 2026-08-27 | `docs/decisions/ADR` không có 1 "project-context digest" auto-load như BMAD's durable-context concept — mỗi skill phải tự đọc lại toàn bộ ADR history | Xem `docs/analysis/competitive-research-2026.md#G-17` — cân nhắc `docs/project-context.md` digest (rủi ro DRY/second-source-of-truth nếu không maintain đều) | ✅ done |
| IB-047 | Competitive research (G-18) 2026-08-27 | `templates/audit.md` không có tamper-evidence tối thiểu (hash) so với ai-sdlc-framework's DSSE attestation — quan trọng cho compliance JP client | Xem `docs/analysis/competitive-research-2026.md#G-18` — thêm field hash SHA-256 qua `bin/audit-hash.js` helper | ✅ done |
| IB-048 | Competitive research (G-19) 2026-08-27 | Cài đặt ADLC có 7 flag riêng biệt, UX phức tạp hơn "1-command install" của Antigravity Awesome Skills và các đối thủ | Xem `docs/analysis/competitive-research-2026.md#G-19` — cân nhắc interactive picker khi chạy không flag trong `bin/install.js` | ✅ done |
| IB-049 | Independent review 2026-08-27 (post-implementation dogfood) | `tests/skill-triggering/opencode-run-test.ps1`'s fuzzy fallback matching does raw substring containment (not word-boundary) and tolerates 1 missing word for 3+-word phrases — latent false-positive risk, though all 30 current fixtures pass via the strict exact-phrase path so it's not currently exploited | Switch substring `.Contains()` to word-boundary regex matching in the fallback branch | ✅ done |
| IB-050 | Independent review 2026-08-27 (post-implementation dogfood) | `.claude/settings.json`'s prefix-glob deny entries (`Bash(curl*)` etc., added for IB-045) can't catch curl/wget/nc invoked mid-pipeline or with an env-var prefix (e.g. `FOO=bar curl ...`) — same limitation pre-existing entries already had, not newly introduced, but worth hardening | Investigate Claude Code's permission-pattern syntax for pipeline/env-prefixed command matching, or accept as a documented limitation | ✅ done |
| IB-051 | Follow-up from fixing IB-037/049 (opencode-run-test.ps1) | Fixing the fuzzy matcher exposed a much deeper pre-existing bug: `opencode-run-test.ps1` NEVER selected the language-specific skill file — it always compared prompts against the VN `.md` regardless of `-Language en/ja`, masking real trigger-phrase/prompt-content misalignment. After fixing the file-selection bug too, real gaps surfaced: EN 28/32 pass (be-glossary, dev-debug, dev-pr, ops-incident fail), JA 16/32 pass (16 skills fail) — genuine trigger-phrase/prompt-content mismatches, not test bugs | Review and align EN/JA prompt fixtures (or skill trigger phrases) for the ~20 failing skills; `.github/workflows/skill-triggering.yml`'s en/ja matrix legs are `continue-on-error: true` until this is done (vi remains a hard gate, 32/32) | open |

---

## Resolved

Entries đã fix chuyển sang bảng này để giữ lịch sử:

| ID | Fix đã thực hiện | Task | Ngày |
|----|-----------------|------|------|
| IB-001 | Thêm Risk Classifier vào dev:analyze | FRAMEWORK-001 | 2026-05-07 |
| IB-002 | Tạo validation-matrix.md | FRAMEWORK-001 | 2026-05-07 |
| IB-003 | Tạo file này | FRAMEWORK-001 | 2026-05-07 |
| IB-004 | Output Format Convention + HTML companion cho 5 skill nhóm A | claude/analyze-html-article-AR7iy | 2026-05-10 |
| IB-005 | Tạo `bin/dashboard.js` generator + `templates/dashboard.html` + `/pm-dashboard` slash command | (backfilled 2026-08-27 review — original task/date not recorded) | — |
| IB-006 | Rebuild dashboard v2: ckm-design-system tokens, 6 new parsers, SVG charts, watch mode | (backfilled 2026-08-27 review — original task/date not recorded) | — |
| IB-007 | Tạo /pm-handover skill + 引き継ぎ書 template (VN + JP) | (backfilled 2026-08-27 review — original task/date not recorded) | — |
| IB-008 | Tạo /pm-maintain skill với triage matrix + 月次保守報告書 | (backfilled 2026-08-27 review — original task/date not recorded) | — |
| IB-009 | Tạo /be-changerequest skill + CR document template (VN + JP) | (backfilled 2026-08-27 review — original task/date not recorded) | — |
| IB-010 | Tạo /pm-release skill với HTML + Markdown output | (backfilled 2026-08-27 review — original task/date not recorded) | — |
| IB-011 | Tạo /be-glossary skill | (backfilled 2026-08-27 review — original task/date not recorded) | — |
| IB-012 | Tạo /pm-kickoff skill với tech stack ADRs + Sprint 0 checklist | (backfilled 2026-08-27 review — original task/date not recorded) | — |
| IB-013 | Tạo agents/pr-resolver.md + wire vào /dev-pr opt-in gate | (backfilled 2026-08-27 review — original task/date not recorded) | — |
| IB-014 | Thêm TDD lane opt-in (Bước 1b) vào /dev-implement | (backfilled 2026-08-27 review — original task/date not recorded) | — |
| IB-015 | Thêm Lens 3 Performance vào /dev-review | (backfilled 2026-08-27 review — original task/date not recorded) | — |
| IB-016 | Verify `templates/change-request.md` + `templates/handover.md` đã được reference đầy đủ (VN/EN/JA, Claude + OpenCode) — fix đã tồn tại sẵn, chỉ cập nhật status | FRAMEWORK-002 | 2026-08-27 |
| IB-017 | pm-ideate tách Bước 4→5, gate cuối dùng `AskUserQuestion`/`question()` (Claude + OpenCode, VN/EN) | FRAMEWORK-002 | 2026-08-27 |
| IB-018 | install skill Bước 0 chuyển sang `AskUserQuestion`/`question()` (Claude + OpenCode, VN/EN/JA) | FRAMEWORK-002 | 2026-08-27 |
| IB-019 | dev-debug Bước 2 wire `Agent()`/`task()` thực sự, dùng contract `agents/code-scout.md` | FRAMEWORK-002 | 2026-08-27 |
| IB-020 | `agents/test-gen.md` output pure JSON — nội dung test file nằm trong field `content` | FRAMEWORK-002 | 2026-08-27 |
| IB-021 | `agents/code-scout.md` thêm decision rule cho `read_status` | FRAMEWORK-002 | 2026-08-27 |
| IB-022 | `bin/dashboard.js` date sort dùng Date object, NaN-safe fallback | FRAMEWORK-002 | 2026-08-27 |
| IB-023 | `bin/dashboard.js` watch mode thêm `.git/HEAD` + `.git/index` | FRAMEWORK-002 | 2026-08-27 |
| IB-024 | `setup.ps1` + `setup.sh` confirm regex accept `y`/`yes` case-insensitive | FRAMEWORK-002 | 2026-08-27 |
| IB-025 | `setup.ps1` + `setup.sh` GitHub URL extracted thành `$RepoUrl`/`$REPO_URL` | FRAMEWORK-002 | 2026-08-27 |
| IB-026 | `bin/dashboard.js` escape `<` trong embedded JSON trước khi ghi vào `<script>` | FRAMEWORK-002 | 2026-08-27 |
| IB-027 | `mcp-server/adlc-tasks/server.js` thêm `isValidTaskId()` guard trước `path.join` | FRAMEWORK-002 | 2026-08-27 |
| IB-028 | `opencode-run-test.ps1` implement keyword-overlap check thực sự (thay always-pass stub) | FRAMEWORK-002 | 2026-08-27 |
| IB-029 | Thêm bold gate marker vào 11 skills (22 files VN+EN) | FRAMEWORK-002 | 2026-08-27 |
| IB-030 | CLAUDE.md Subagent table thêm `screen-designer` + `api-designer` | FRAMEWORK-002 | 2026-08-27 |
| IB-039 | `/dev-review` + `/opencode dev:review` thêm "Independent Harness Review" (opt-in) + field `harness` vào `templates/review-log.md` | FRAMEWORK-003 | 2026-08-27 |
| IB-040 | `templates/task-doc-requirements.md` (VN/EN/JA) thêm field `Depends on`; `bin/dashboard.js` + `dashboard.html` thêm panel Blocked/Ready (display-only, không auto-dispatch) | FRAMEWORK-003 | 2026-08-27 |
| IB-041 | `/pm-ideate` (Claude + OpenCode, VN/EN) thêm sub-bước research trước khi generate variations | FRAMEWORK-003 | 2026-08-27 |
| IB-042 | `/dev-debug` (Claude + OpenCode, VN/EN) Bước 5 Guard bắt buộc re-run minimal reproduction trước khi đóng bug | FRAMEWORK-003 | 2026-08-27 |
| IB-043 | Tạo `.claude-plugin/marketplace.json` — kênh phân phối song song qua Claude Code Plugin Marketplace, verify schema từ anthropics/skills + BMAD-METHOD | FRAMEWORK-003 | 2026-08-27 |
| IB-044 | `/dev-review` Lens 1 thêm gợi ý dùng browser tool verify UI-affecting task | FRAMEWORK-003 | 2026-08-27 |
| IB-045 | `.claude/settings.json` deny-list thêm `git push` (fix doc/impl mismatch), `curl`/`wget`/`nc`; CLAUDE.md Permissions model cập nhật khớp | FRAMEWORK-003 | 2026-08-27 |
| IB-046 | Tạo `bin/generate-project-context.js` sinh `docs/project-context.md` (auto-generated only, không hand-edit) từ `docs/decisions/ADR-*.md`; wire gợi ý regenerate vào `/arch-adr` | FRAMEWORK-003 | 2026-08-27 |
| IB-047 | Tạo `bin/audit-hash.js` (SHA-256 tamper-evidence helper); field `hash` thêm vào `templates/audit.md` (VN/EN/JA) | FRAMEWORK-003 | 2026-08-27 |
| IB-048 | `bin/install.js` thêm interactive platform/lang picker khi chạy không flag + không `--yes`; mọi flag hiện có giữ nguyên hành vi | FRAMEWORK-003 | 2026-08-27 |
| IB-031 | Thêm ghi chú exception vào CLAUDE.md — 6 skill JP-client-facing giữ full JA translation có chủ đích | FRAMEWORK-004 | 2026-08-28 |
| IB-032 | `bin/install.js`/`setup.sh`/`setup.ps1` thêm target-sanity guard khi `--update` — chặn nếu target không có marker install (CLAUDE.md/skill dir) | FRAMEWORK-004 | 2026-08-28 |
| IB-033 | Chạy `npm audit` — 0 vulnerabilities, không có CVE nào trong `@clack/prompts`/`picocolors` | FRAMEWORK-004 | 2026-08-28 |
| IB-034 | SHA-pin `actions/checkout`/`actions/setup-node` trong cả 3 workflow file (verify SHA thật qua GitHub API) | FRAMEWORK-004 | 2026-08-28 |
| IB-035 | Thêm Node 16 vào matrix `installer-smoke.yml` (chỉ platform `claude`, tránh nổ 6×2×2 job) | FRAMEWORK-004 | 2026-08-28 |
| IB-036 | Thêm `"test": "node scripts/validate-skills.js"` vào package.json | FRAMEWORK-004 | 2026-08-28 |
| IB-037 | `opencode-run-test.ps1` regex trigger-phrase mở rộng match `「...」` full-width | FRAMEWORK-004 | 2026-08-28 |
| IB-038 | Tạo `scripts/validate-cursor-skills.js` + `scripts/validate-antigravity-skills.js`, wire vào `installer-smoke.yml`; fix phụ: CRLF/BOM normalization trong `bin/transformers/cursor.js`, 3 file `.opencode/skills/be|pm/*.ja.md` còn sót `AskUserQuestion` (Claude-syntax leak) | FRAMEWORK-004 | 2026-08-28 |
| IB-049 | `opencode-run-test.ps1` fallback matching đổi sang word-boundary regex thay vì substring `.Contains()` | FRAMEWORK-004 | 2026-08-28 |
| IB-050 | Investigate: premise sai — Claude Code Bash permission matcher đã tự tách compound command + strip leading env-var (docs.claude.com/permissions), 2 case nêu trong IB-050 KHÔNG phải gap thật. Document lại giới hạn thật (indirect invocation qua interpreter khác, WebFetch không có deny tương ứng) vào CLAUDE.md | FRAMEWORK-004 | 2026-08-28 |

# Phân tích: "Using Claude Code — The Unreasonable Effectiveness of HTML"

- **Tác giả**: Thariq Shihipar (Claude Code team, Anthropic) — [@trq212](https://x.com/trq212)
- **Ngày đăng**: 2026-05-08
- **Nguồn gốc bài viết**: bài blog cá nhân, được Simon Willison repost và lan rộng trên X / Hacker News
- **Companion demo**: `thariqs.github.io/html-effectiveness` — 20 file HTML do Claude Code sinh ra, mỗi file minh hoạ một use case thực tế

---

## 1. Luận điểm trung tâm

> *"Markdown là một bản báo cáo để đọc. HTML là một giao diện để tiếp tục làm việc."*

Thariq lập luận rằng cộng đồng đang **mặc định yêu cầu Claude Code xuất Markdown** vì quán tính (chat UI render Markdown đẹp), nhưng Markdown thực ra **không phù hợp** với phần lớn output của một coding agent:

- Markdown tối ưu cho **đọc tuyến tính** (báo cáo, README, doc).
- HTML tối ưu cho **tương tác**: click, sort, filter, copy, compare, edit inline, chia sẻ.

Khi output có ý định để "tiếp tục làm việc" — review code diff, so sánh phương án, tra cứu data, demo UI — thì HTML gần với *workspace thật* hơn nhiều, còn Markdown chỉ là ảnh chụp tĩnh.

## 2. Vì sao HTML "unreasonably effective" với LLM

| Khía cạnh | Markdown | HTML |
|-----------|----------|------|
| Cấu trúc dữ liệu | Phẳng (heading + list) | Cây (DOM, nested) |
| Tương tác | Không | `<details>`, `<input>`, `<button>`, JS inline |
| Style / hierarchy | Hạn chế | CSS đầy đủ, color coding, responsive |
| Phát hành | Cần renderer | Mở bằng browser bất kỳ |
| Token cost | Thấp | Cao hơn ~20–40% nhưng **giá trị/token cao hơn nhiều** |
| Độ "thuần thục" của LLM | Tốt | **Cực tốt** — HTML là một trong những format có nhiều training data nhất |

Điểm bất ngờ: vì web là corpus huấn luyện khổng lồ nhất, các model như Claude viết HTML + CSS + vanilla JS *fluent hơn cả* khi viết Markdown phức tạp. Thariq gọi đây là "unreasonable effectiveness" — tương tự cách Wigner mô tả sự hiệu quả bất thường của toán học trong khoa học tự nhiên.

## 3. Các use case được demo (20 ví dụ)

Theo các snippet và discussion trên HN/Linux.do, bộ demo gồm những pattern điển hình:

1. **Code review dashboard** — diff với syntax highlight, comment inline, checklist.
2. **Comparison table tương tác** — sort/filter các option khi `/dev-analyze` ra 2–3 phương án.
3. **Data exploration** — bảng JSON/CSV với search box thay vì dump Markdown table.
4. **API explorer** — form gọi thử endpoint từ chính file HTML output.
5. **Test report** — pass/fail cards, click expand stack trace.
6. **Migration plan** — timeline + collapse từng bước.
7. **Architecture diagram** — Mermaid hoặc SVG nhúng inline.
8. **Style guide / design tokens** — render thực tế từng token.
9. **Codebase map** — file tree click được với preview.
10. **PR description** — sections collapse được + link diff.
11. **Mock UI** — prototype có thể bấm thử ngay trong browser.
12. **Decision log** — ADR có filter theo trạng thái.
13. **Onboarding doc** — checklist tick được, lưu trong localStorage.
14. **Performance report** — chart từ Chart.js inline.
15. **Translation table** (đặc biệt phù hợp cho outsource teams: JP↔VN) — cột song ngữ, click copy.
16. **Glossary** — search-as-you-type.
17. **Form spec** — render form đúng như sẽ build, validate inline.
18. **Bug repro** — minimal HTML repro chạy được, không cần setup.
19. **Sprint status** — kanban tĩnh với filter.
20. **Prompt cookbook** — copy-to-clipboard từng prompt mẫu.

## 4. Khi nào *vẫn nên* dùng Markdown

Thariq không cực đoan — bài viết thừa nhận Markdown vẫn tốt khi:

- Output được **commit vào repo** (README, ADR, CHANGELOG) — Git diff dễ đọc.
- Output được **render bởi platform khác** (GitHub issue, Slack, Notion).
- Output **thuần text**, không có cấu trúc tương tác.
- **Chain agent**: agent kế tiếp parse Markdown rẻ hơn HTML.

→ Quy tắc rút ra: chọn format theo *consumer cuối cùng*, không theo thói quen.

## 5. Implication for Agentic Development Lifecycle

Bài viết có vài hệ luỵ trực tiếp với framework này:

| Skill | Output hiện tại | Gợi ý sau bài viết |
|-------|----------------|---------------------|
| `/dev-analyze` | `analysis.md` (Markdown) | Cân nhắc thêm `analysis.html` so sánh 2–3 option dạng tương tác (giữ `.md` để commit) |
| `/qa-testplan` | Markdown table | HTML có checkbox + filter status — QA tick trực tiếp khi chạy |
| `/pm-status` | Markdown | HTML dashboard cho stakeholder JP — đẹp hơn khi forward email |
| `/be-bridge` | Markdown song ngữ | HTML 2 cột JP/VN có copy button — phù hợp deliverable JP (設計書) |
| `/ba-reverse` | `codebase-overview.md` | HTML codebase map clickable — onboard nhanh hơn |
| `/dev-pr` | Markdown PR body | Giữ Markdown (GitHub render) |
| `/docs-update` (baseline) | Markdown | Giữ Markdown (commit vào repo) |

**Nguyên tắc đề xuất**: với output **dùng một lần để review/quyết định** → HTML; với output **lưu lâu dài trong repo** → Markdown.

## 6. Phản biện đáng chú ý (từ HN discussion)

- **Token cost**: HTML tốn ~20–40% token hơn → đắt hơn với task lặp lại.
- **Diffability**: HTML khó review qua Git diff — không hợp với artifact cần version control.
- **Security**: HTML có thể chứa `<script>`, cần sandbox khi mở (Thariq khuyến nghị xem qua `file://` local, không deploy thẳng).
- **Lock-in vào browser**: mất tính portable của plain text.

## 7. Kết luận

Bài viết là một **format-shift call** quan trọng:

1. Đừng mặc định Markdown chỉ vì chat UI render đẹp.
2. Hỏi: *"Output này dùng để đọc, hay để tiếp tục làm việc?"* — nếu vế sau, dùng HTML.
3. Claude Code (và các coding agent nói chung) viết HTML rất tốt — tận dụng đi.
4. Áp dụng có chọn lọc: artifact một lần → HTML; artifact lưu trữ → Markdown.

Đây là cơ hội nâng cấp deliverables cho khách JP (vốn coi trọng hình thức 成果物) mà không tốn thêm effort thiết kế — chỉ cần thay đổi prompt cuối của một số skill.

---

**Tham khảo**:
- Simon Willison repost: simonwillison.net/2026/May/8/unreasonable-effectiveness-of-html/
- HN thread: news.ycombinator.com/item?id=48071940
- StableLearn breakdown EN: stable-learn.com/en/claude-code-html-output/
- ABMedia (TW): abmedia.io/anthropic-engineer-html-claude-code-output-format-may-2026
- Linux.do (CN): linux.do/t/topic/2138856
- Demo: thariqs.github.io/html-effectiveness

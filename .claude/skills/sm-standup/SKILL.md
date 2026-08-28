---
name: sm-standup
description: >
  Tổng hợp và format daily standup nhanh từ input thô, highlight blockers và sprint health.
  Trigger khi: user nói "tổng hợp standup", "format daily standup", "daily scrum",
  "standup hôm nay", "paste update team vào", hoặc gõ /sm-standup.
---

# Skill: /sm-standup
**Role**: Scrum Master / Team  
**Mục đích**: Tổng hợp và format daily standup nhanh, highlight blockers.

---

## Hướng dẫn thực hiện

### Bước 1 — Thu thập input

Nhận input từ team (paste nội dung thô từ Slack/chat hoặc danh sách từng người):

```
## Paste standup updates của team vào đây.

Format input không quan trọng — text thô, bullet points, hay prose đều OK.
Tôi sẽ format lại cho chuẩn.

Cần biết thêm: Sprint [N] kết thúc khi nào?
```

### Bước 2 — Tổng hợp và format

```markdown
# Daily Standup — [Date]
**Sprint [N]** | **Day [X]/[Y]**

---

## Team Updates

### [Tên member 1]
- ✅ **Hôm qua**: [...]
- 🔄 **Hôm nay**: [...]
- ⛔ **Blockers**: [None / Mô tả]

### [Tên member 2]
...

---

## 🚨 Blockers cần action

| Người | Blocker | Cần hỗ trợ từ |
|-------|---------|--------------|
| | | |

## ⚠️ Sprint Health

- Tasks completed: [N]/[Total]
- Days remaining: [X]
- At-risk items: [list nếu có]

## 📌 Follow-up

- [Action item từ hôm qua đã xong chưa?]
```

### Bước 3 — Gate: Highlight concerns

```
Standup tổng hợp xong.

Tôi nhận thấy:

| # | Quan sát | Lựa chọn |
|---|---------|---------|
| 1 | [Member X] bị block [N] ngày — cần escalate không? | A: Escalate ngay / B: Để thêm 1 ngày / C: Không cần / D: Khác: ___ |
| 2 | Task [Y] at risk — chỉ còn [Z] ngày | A: Cần hỗ trợ thêm / B: Đang xử lý / C: Đã scope lại / D: Khác: ___ |
| 3 | Velocity bất thường — có gì tôi miss không? | A: Không miss gì / B: Có — context: ___ / C: Khác: ___ |
```

**Chờ confirm.**

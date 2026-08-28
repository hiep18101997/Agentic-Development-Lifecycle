---
name: sm-retro
description: >
  Facilitate sprint retrospective, tổng hợp feedback theo theme, tạo action items actionable.
  Trigger khi: user nói "retro sprint", "retrospective", "họp cuối sprint",
  "tổng kết sprint", "what went well", "action items từ retro", hoặc gõ /sm-retro.
---

# Skill: /sm-retro
**Role**: Scrum Master  
**Mục đích**: Facilitate sprint retrospective, tổng hợp feedback, tạo action items có thể thực hiện được.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Setup retro

```
## Tôi sẽ facilitate retro cho Sprint [N].

Trước khi bắt đầu:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Format retro ưa thích? | A: Start/Stop/Continue / B: 4Ls (Liked/Learned/Lacked/Longed for) / C: Mad/Sad/Glad / D: Khác: ___ |
| 2 | Team size | _(điền số người)_ |
| 3 | Thời gian retro | _(điền số phút)_ |
| 4 | Có action items từ retro trước chưa done không? | A: Không / B: Có — [N] items chưa done / C: Khác: ___ |
```

**Chờ confirm.**

### Bước 2 — Tổng hợp feedback

Nhận input từ team (paste anonymous feedback hay notes từ session).

Phân loại và nhóm themes:

```markdown
# Sprint [N] Retrospective

**Date**: [Date]  
**Facilitator**: [SM name]  
**Attendees**: [N] people  
**Sprint**: [N] | [Start date] → [End date]

---

## Sprint Highlights

- **Velocity**: [X] points ([+/-N%] vs previous sprint)
- **Delivered**: [N]/[M] planned items
- **Team health**: 🟢 Good / 🟡 OK / 🔴 Needs attention

---

## What Went Well ✅

### [Theme 1: e.g., "Collaboration"]
- [Specific observation]
- [Votes: N]

### [Theme 2]
...

---

## What Needs Improvement 🔧

### [Theme 1: e.g., "Requirements clarity"]
- [Specific observation]
- [Votes: N]
- [Suggested fix]

### [Theme 2]
...

---

## Action Items

| # | Action | Owner | Done by | Success metric |
|---|--------|-------|---------|----------------|
| 1 | [Specific action, not vague] | [Name] | Sprint [N+1] Day 1 | [...] |
| 2 | | | | |

---

## Action Items từ Retro trước

| Action | Owner | Status | Ghi chú |
|--------|-------|--------|---------|
| [Action từ Sprint N-1] | [Name] | ✅ Done / ❌ Not done / 🔄 In progress | [...] |

---

## Shoutouts 🌟

- [Member X] — [cụ thể tại sao được shoutout]
```

### Bước 3 — Gate cuối

```
Retro summary đã soạn xong.

Tôi có [N] action items.

Câu hỏi quan trọng:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Action item [X] — [Name] có accept ownership không? | A: Có / B: Không — assign lại cho: ___ / C: Khác: ___ |
| 2 | Action items có quá nhiều không? | A: Vừa đủ / B: Quá nhiều — cắt xuống top 2-3 / C: Khác: ___ |
| 3 | Có theme quan trọng bị gộp nhầm cần tách ra không? | A: Không / B: Có — theme: ___ / C: Khác: ___ |
| 4 | Action items cũ chưa done — cần escalate hay drop? | A: Escalate / B: Drop / C: Carry over thêm 1 sprint / D: Khác: ___ |
```

**Chờ confirm.**

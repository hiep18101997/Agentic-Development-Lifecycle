---
name: ba-spec
description: >
  Transform raw requirements into structured business specification documents.
  Trigger when: user says "viết spec", "soạn đặc tả", "phân tích yêu cầu", "write spec",
  "tạo requirements doc", "business spec", or types /ba-spec.
---

# Skill: /ba-spec
**Role**: Business Analyst  
**Purpose**: Transform raw requirements into structured business specification documents.

---

## Execution Guide

### Step 1 — Read and analyze input

Receive input from the user (email, meeting notes, verbal description, Jira ticket...). Analyze to identify:
- Primary stakeholders
- Problem statement
- Scope
- Related actors
- Known constraints

### Step 2 — Gate: Present initial understanding + Ask clarifying questions

Present in the following format:

```
## I understand the requirement as follows:

**Problem statement**: [...]
**Primary stakeholders**: [...]
**Preliminary scope**: [...]
**Actors**: [...]

## Before I draft the spec, I need to clarify:

| # | Question | Options |
|---|---------|---------|
| 1 | [Question about unclear business rule] | _(fill in)_ |
| 2 | [Question about edge case or exception] | _(fill in)_ |
| 3 | [Question about integration with other systems if any] | A: Has integration — describe: ___ / B: No / C: Other: ___ |
```

**Wait for human response before proceeding.**

### Step 3 — Draft Specification Document

After receiving answers, create `docs/tasks/[TASK-ID]/requirements.md` using template `templates/task-doc-requirements.en.md`.

**Frontmatter**: fill in `sessionId` (format `TASK-ID-YYYYMMDD-HHMM`), `createdAt`, `updatedAt`, `roundCount: 1`.

Fill in completely:
- Sections 1-3: Context, objectives, scope
- Sections 4-5: Actors + Business Rules (BRs must have IDs for reference)
- Sections 6-7: Happy path + alternative flows
- Section 8: Acceptance Criteria — each AC must be testable (Given/When/Then if needed)
- Section 9: NFRs if there are performance/security requirements
- Section 10: User Stories — only fill skeleton (ID + name + priority); detailed ACs will be expanded by `/ba-user-story`
- Section 11: Remaining open questions (do not self-answer if unsure)
- Section 12: Harness Delta — mark "No friction" or log a specific entry
- Section 13: Q&A History — record entry "Round 1" with all questions/answers from Step 2, including `Impact` specifying which section/BR/AC was affected by each answer

### Step 4 — Final Gate: Review and confirm

```
## Spec has been drafted.

Before finalizing, I would like to ask:

| # | Question | Options |
|---|---------|---------|
| 1 | Did I miss any business rules? | A: No, it's complete / B: Yes — add: ___ / C: Other: ___ |
| 2 | Is AC-XXX specific enough for QA to test? | A: Sufficient / B: Needs more detail — which AC: ___ / C: Other: ___ |
| 3 | Are there any Open Questions that need to be resolved before handing to Dev? | A: No / B: Yes — question: ___ / C: Other: ___ |

If OK, I will save the file and you can use /ba-user-story to create User Stories from this spec.
```

---

## Important Notes

- **Never** auto-generate a spec without going through the clarification Gate.
- Always highlight what is **uncertain** with `[?]` in the draft.
- If the input is too vague, ask more questions instead of assuming.

### Resume + Q&A History (append-only)

When re-opening an existing `requirements.md` for further clarification:

1. **Read frontmatter** — check `sessionId`, current `roundCount` to know how many rounds have run.
2. **Read Section 13 (Q&A History)** before asking new questions — treat previous Q&A as **ground truth**, do not re-ask what has already been answered.
3. **After each new clarification round**:
   - Append a `### Round N — [timestamp JST]` block at the END of Section 13 (DO NOT overwrite old rounds)
   - Update `updatedAt` and increment `roundCount` in frontmatter
   - Update relevant spec sections (BR/AC/scope) based on new answers
4. **Purpose**: BE/JP client can check `Q&A History` to understand the **reasoning** behind the spec ("なぜこの設計?"), rather than only seeing the final output.

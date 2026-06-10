---
name: be-glossary
description: >
  Maintain the JP-VN-EN glossary — add new terms, resolve translation conflicts,
  sync with project documents. Trigger when: user says "thêm từ vào glossary",
  "cập nhật glossary", "thuật ngữ mới từ JP", "glossary có thiếu từ",
  "term không nhất quán", or types /be-glossary.
---

# Skill: /be-glossary
**Role**: Bridge Engineer  
**Purpose**: Maintain `templates/jp-vn-en-glossary.md` — the standard vocabulary set shared across the entire JP outsource project.

---

## Project Context

The glossary is the single source of truth for terminology:
- BE uses it when translating JP requirements → VN
- Dev uses it when reading specs
- QA uses it when writing test reports
- PM uses it when writing status reports

Whenever `be-bridge` encounters a `[GLOSSARY?]` tag → that is the signal to run this skill.

---

## Execution Guide

### Step 1 — Gate: Determine work type

Use the `AskUserQuestion` tool:

- **Work type**:
  - Add new terms (from the just-completed `be-bridge` session)
  - Review and standardize existing terms
  - Search for a term in the glossary
  - Export glossary for JP documentation

**Wait for confirmation.**

### Step 2 — Read current glossary

Read the entire `templates/jp-vn-en-glossary.md`.

Check:
- Are any terms using multiple different translations?
- Are any terms missing the JP or VN column?
- Are any terms outdated?

### Step 3 — Process by work type

#### 3a. Add new terms

For each term to be added, confirm:

```
## New terms to add to glossary

| # | JP | Proposed VN | EN | Context | Conflict? |
|---|----|-----------|----|---------|----------|
| 1 | [JP term] | [VN] | [EN] | [Usage context] | [Any similar terms?] |
| 2 | [...] | [...] | [...] | [...] | [...] |

Confirm to add to glossary?
```

**Wait for confirmation.**

After confirmation: edit `templates/jp-vn-en-glossary.md` — add to the correct section alphabetically (by JP reading order).

#### 3b. Resolve translation conflicts

When a term with multiple translations is detected:

```
## Conflict detected: "[JP term]"

Currently in glossary/documents:
- Version 1: [VN variant A] — appears in: [file list]
- Version 2: [VN variant B] — appears in: [file list]

Recommendation: [Which variant + reason]

| | Option |
|---|--------|
| A | Use "[Variant A]" — update all documents |
| B | Use "[Variant B]" — update all documents |
| C | Other: ___ |
```

**Wait for confirmation.**

After confirmation: update glossary + search-replace in `docs/` for consistency.

#### 3c. Search for a term

```
## Search results: "[query]"

| JP | VN | EN | Context |
|----|----|----|---------|
| [...] | [...] | [...] | [...] |

No exact match found. Closest terms:
- [Related term 1]
- [Related term 2]
```

#### 3d. Export glossary for JP documentation

Create `docs/handover/glossary-export-[date].md` in a suitable format to attach to a 引き継ぎ書 or send to JP client:

```markdown
# 用語集 / Glossary / Glossary

**Project**: [Name]  
**Updated**: [YYYY-MM-DD]

| 日本語 (JP) | ベトナム語 (VN) | English (EN) | 備考 / Notes |
|------------|---------------|-------------|---------------|
| [...] | [...] | [...] | [...] |
```

### Step 4 — Summary

```
## Glossary update complete.

Changes:
- Newly added: [N] terms
- Updated: [N] terms
- Conflicts resolved: [N]

Notable new terms:
| JP | VN | EN |
|----|----|----|
| [...] | [...] | [...] |

File updated: templates/jp-vn-en-glossary.md
```

---

## Rules

- Every term must have all 3 columns: JP + VN + EN — do not leave blanks
- Standard technical terms (JWT, API, CRUD...) → keep English in the VN column
- The Context column is important — specify which domain the term is used in (auth / payment / UI...)
- When there is a conflict: always ask the BE/domain expert — do not decide alone
- After adding a new term → grep `docs/` to check if any files use an old translation that needs updating

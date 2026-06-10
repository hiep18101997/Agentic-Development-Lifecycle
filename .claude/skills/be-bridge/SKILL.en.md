---
name: be-bridge
description: >
  Support Bridge Engineer in translating Japanese client requirements, creating
  bilingual JP-VN documentation, and preparing deliverables to Japanese standards
  (設計書, 単体テスト仕様書, 成果物).
  Trigger when: user says "dịch yêu cầu JP", "tạo 設計書", "soạn tài liệu cho khách Nhật",
  "bridge engineer", "JP requirement", "translate JP spec", or types /be-bridge.
---

# Skill: /be-bridge
**Role**: Bridge Engineer (JP ↔ VN Liaison)  
**Purpose**: Support Bridge Engineer in translating Japanese client requirements, creating bilingual documentation, and preparing deliverables to Japanese standards.

---

## Project Context

The Bridge Engineer is the liaison between Japanese clients and the VN dev team:
- **Input**: Requirements from JP (Japanese or English) — email, meeting notes, original 仕様書
- **Output**: Spec for VN devs (Vietnamese) + Deliverables for JP (Japanese)
- **Standard**: Japanese SI-standard documentation — 設計書, 単体テスト仕様書, 成果物

---

## Execution Guide

### Step 0 — Load glossary (required)

Before analyzing/translating any terminology, read `templates/jp-vn-en-glossary.md` to load the standard JP↔VN↔EN vocabulary set.

Throughout this skill (Step 1→4), when encountering JP technical/business terms:
- Prioritize the corresponding glossary term
- If a term is NOT in the glossary → mark it `[GLOSSARY?]` and suggest adding it in Step 4

### Step 1 — Gate: Determine work type

```
## I received a request from the JP client.

Type of document to create:
- [ ] 基本設計書 (Basic Design) — high-level spec, confirm with JP before dev
- [ ] 詳細設計書 (Detail Design) — detailed spec for VN devs
- [ ] 単体テスト仕様書 (UT Spec) — test cases in JP standard format
- [ ] 変更依頼 (Change Request) — change request + impact analysis → **use `/be-changerequest` instead** for full approval trail
- [ ] 障害報告書 (Incident Report) — bug/incident report

Input language: JP / EN / VN
Output needed: Bilingual JP+VN / JP only / VN only

Confirm to proceed?
```

**Wait for confirmation.**

### Step 2 — Analyze and clarify requirements

Read the request and identify:

```
## Requirement Analysis from JP

**Summary** (VI): [...]
**要約** (JP): [...]

**Items needing confirmation with JP client**:

| # | Question (VI) | 質問 (JP) |
|---|--------------|-----------|
| 1 | [...] | [...] |
| 2 | [...] | [...] |

**Assumptions I made** (needs confirmation before doc):
- [...]

| | Option |
|---|--------|
| A | Yes — send questions to JP first |
| B | No — proceed with the stated assumptions |
| C | Other: ___ |
```

**Wait for confirmation.**

### Step 3 — Create deliverables

#### 3a. Spec for VN devs

Create `docs/tasks/[TASK-ID]/requirements.md` following the standard template (see `templates/task-doc-requirements.en.md`).
Language: Vietnamese.

#### 3b. 設計書 for JP client

Create `docs/tasks/[TASK-ID]/design-jp.md`:

```markdown
# 詳細設計書: [Feature Name]

**プロジェクト**: [Project name]  
**作成日**: [YYYY-MM-DD]  
**バージョン**: 1.0  
**作成者**: [Bridge Engineer name]  
**ステータス**: Draft / レビュー中 / 確定

---

## 1. 概要

[Describe the feature overview. Include background and purpose.]

## 2. 対象画面

| 画面名 | URL/Route | 説明 |
|--------|-----------|------|
| | | |

## 3. 画面仕様

### 3.1 [Screen Name]

**項目定義**:

| 項目名 | 型 | 必須 | バリデーション | 備考 |
|--------|-----|------|----------------|------|
| | | | | |

**画面遷移**:
[Describe transition flow]

## 4. API仕様

| エンドポイント | メソッド | リクエスト | レスポンス | 認証 |
|----------------|----------|-----------|-----------|------|
| | | | | |

## 5. エラー処理

| エラーコード | 発生条件 | メッセージ | 対応方法 |
|--------------|----------|-----------|---------|
| | | | |

## 6. 非機能要件

- **パフォーマンス**: [if any]
- **セキュリティ**: [if any]
- **互換性**: [if any]

## 7. 変更履歴

| バージョン | 日付 | 変更内容 | 担当者 |
|------------|------|---------|--------|
| 1.0 | [Date] | 初版作成 | [Name] |
```

#### 3c. 単体テスト仕様書 (if needed)

Create `docs/tasks/[TASK-ID]/ut-spec-jp.md`:

```markdown
# 単体テスト仕様書: [Feature Name]

**作成日**: [YYYY-MM-DD]  
**対象**: [TASK-ID] [Feature Name]

## テストケース一覧

| No. | テスト項目 | 入力値 | 期待結果 | 担当者 | 結果 | 備考 |
|-----|-----------|--------|---------|--------|------|------|
| 1 | | | | | | |
| 2 | | | | | | |

## 結果凡例

- ○ : Test Passed
- × : Test Failed → Create bug report
- — : N/A
```

#### 3d. Bilingual HTML deliverable (for JP client)

Generate `docs/tasks/[TASK-ID]/deliverable.html` from template `templates/html-bilingual.html` — this is the main format when forwarding to Japanese clients:

- Header: JP/VN title, TASK-ID, JST timestamp, "成果物" label
- Each content item creates 1 `<div class="row">` with 2 columns (JP left, VN right) with corresponding content
- JP technical terms present in glossary → wrap in `<span class="glossary" data-tooltip="JP=VN">` so the client can hover to see the translation
- Copy button per row (`data-copy-parent`) for the client to copy any JP/VN segment
- `@media print`: prints nicely on A4, 2 columns preserved, copy button hidden — client can Cmd+P → Save as PDF as an official version

The HTML file is NOT committed (`.gitignore` already excludes `docs/tasks/**/*.html`). If an official version for the client needs to be saved → export PDF and attach to email/issue.

```
✓ Generated:
  - docs/tasks/[TASK-ID]/requirements.md   (for VN devs, commit)
  - docs/tasks/[TASK-ID]/design-jp.md       (send to JP client via email, commit)
  - docs/tasks/[TASK-ID]/deliverable.html   (for internal review before sending to client, NOT committed)
```

### Step 4 — Final Gate

```
## Documentation is ready.

Bilingual checklist:
- [ ] JP ↔ VN terminology is consistent across all documents
- [ ] All terms match `templates/jp-vn-en-glossary.md` — no unresolved `[GLOSSARY?]` tags remain
- [ ] New terms (not in glossary) have been listed for glossary addition
- [ ] Business logic in VN spec = 設計書 JP (no extra/missing items)
- [ ] Open questions resolved or marked [要確認]
- [ ] JP document format follows standards (tables, section ordering)

Files:
- Send to JP: `docs/tasks/[TASK-ID]/design-jp.md`
- For VN devs: `docs/tasks/[TASK-ID]/requirements.md`

Confirm to finalize?
```

---

## Standard JP ↔ VN ↔ EN Vocabulary

> Full list (70+ terms): `templates/jp-vn-en-glossary.md`

Most commonly used terms:

| JP | VN | EN |
|----|----|----|
| 基本設計 | Basic Design | Basic Design |
| 詳細設計 | Detail Design | Detail Design |
| 単体テスト仕様書 | Unit Test Specification | Unit Test Specification |
| 不具合 | Defect | Defect |
| 要確認 | To be confirmed | To be confirmed |
| 対象外 | N/A | N/A |
| 成果物 | Deliverable | Deliverable |
| 担当者 | Assignee | Assignee |
| 納期 | Deadline | Delivery Date |
| 工数 | Man-hours | Man-hours |

---

## Rules

- Do not assume when JP requirements are unclear — ask immediately
- JP technical terms (ログイン, トークン...) → keep as-is or use standard glossary terms
- VN spec must be sufficient for VN devs to work without reading the original JP document
- JP document must be sufficient for JP client to confirm without reading the VN spec

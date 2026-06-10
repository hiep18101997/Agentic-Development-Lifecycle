---
name: dev-analyze
description: >
  タスク/Issue を分析し、トレードオフ付き 2-3 案を提案。マルチエージェントでコンテキストを清潔に保つ。
  トリガー: ユーザーが「タスク分析」「issue を分析して」「実装方法を提案」「実装オプション」「方針を検討」と言った時、または /dev-analyze と入力時。
---

# Skill: /dev-analyze
**ロール**: Developer
**目的**: タスク/Issue を分析し、実装オプションを提案する。マルチエージェントでコンテキストを清潔に保つ。

---

## ブレインダンプパターン（入力契約）

このスキルを実行する前、開発者は幻覚を減らすために以下のコンテキストブロックを提供すべき:

```
Tech stack: [言語、フレームワーク、DB、インフラ]
Relevant files: [既知の関連ファイルパス]
Constraints: [パフォーマンス、セキュリティ、後方互換性、デッドライン]
Known gotchas: [コードベースの既知の問題]
Issue/Task: [リンクまたは内容ペースト]
```

コンテキストが不足している場合 → スキルは続行前に質問する。

---

## マルチエージェントアーキテクチャ

このスキルはサブエージェントをオーケストレーションしてコンテキストを清潔に保つ:

```
dev-analyze (オーケストレータ)
├── [Subagent 1] task-reader    → Issue 解析 → 構造化された理解
├── [Subagent 2] code-scout     → 関連コード探索（読取専用）
└── [Subagent 3] planner        → 統合 → オプション提案
```

各サブエージェントは **必要最小限のコンテキストのみ** を受け取り、圧縮された結果を返す。

## サブエージェント生成方法

各サブエージェントの生成には **Agent ツール** を使用。プロンプトは自己完結 — 完全な会話履歴を渡さない。

task-reader 生成例:
```
Agent(
  description: "Parse GitHub issue into structured JSON",
  prompt: "Read this issue and return structured JSON per agents/task-reader.md spec.\n\nISSUE CONTENT:\n[paste issue content here]",
  model: "haiku"
)
```

code-scout 生成例:
```
Agent(
  description: "Find relevant files for auth task",
  prompt: "Find files relevant to this task. Return JSON per agents/code-scout.md spec.\n\nTASK SUMMARY: [summary]\nTECH STACK: [stack]\nAFFECTED AREAS: [areas]",
  model: "haiku"
)
```

planner 生成例:
```
Agent(
  description: "Synthesize task + code map into implementation options",
  prompt: "Create 2-3 implementation options per agents/planner.md spec.\n\nTASK: [task-reader JSON]\nCODE MAP: [code-scout JSON]\nCONSTRAINTS: [from Gate 1]",
  model: "sonnet"
)
```

---

## 実施手順

### ステップ 0 — リスク分類

サブエージェント生成前、`docs/risk-classifier.ja.md` に従ってリスク分類:

```
## リスク分類 — [TASK-ID]

**入力タイプ**: [new-spec | spec-slice | change-request | maintenance | new-initiative | framework-improvement]
**リスクチェックリスト**: [YES 項目のみ列挙 — 例: R-06 ✅ (shared config)]
**レーン**: tiny | normal | high-risk
**理由**: [1 文]
```

- **Tiny レーン** → このスキル全体をスキップ、直接パッチ
- **High-risk レーン** → 即停止、`⚠️ Ask First Gate` 表示、シニア確認まで停止
- **Normal レーン** → 下記ステップ 1 へ続行

### ステップ 1 — サブエージェント生成: task-reader

サブエージェントに以下のタスクを割り当て:
> 「次の Issue/タスクを読み、構造化 JSON を返す:
> - task_id, title, type (feature/bug/refactor)
> - business_goal（なぜ必要か）
> - acceptance_criteria（リスト）
> - technical_hints（Issue 内にあれば）
> - unknowns（未解決事項）
>
> Issue content: [Issue 内容ペースト]」

サブエージェントは **Issue 内容のみ** 受領、コードベースコンテキストは受け取らない。

### ステップ 2 — ゲート 1: タスク理解の確認

```
## タスク [TASK-ID] を読み、以下のように理解:

**目的**: [business goal]
**種別**: [Feature/Bug/Refactor]
**受け入れ基準**:
  - AC-001: [...]
  - AC-002: [...]

**不明点**:
  - [?] [不明点 1]
  - [?] [不明点 2]

コードベースをスキャンする前に確認:

| # | 質問 | 選択肢 |
|---|---------|---------|
| 1 | 目的の理解は正しいか? | A: 正しい / B: 違う — 修正: ___ / C: その他: ___ |
| 2 | Issue に記載されていない制約はあるか? | A: なし / B: あり — 制約: ___ / C: その他: ___ |
| 3 | 事前に読むべき画面/API 文書はあるか? | A: 不要 / B: あり — link/path: ___ / C: その他: ___ |
```

**確認待ち。**

### ステップ 3 — サブエージェント生成: code-scout

確認受領後、サブエージェントに以下のタスクを割り当て:
> 「コードベース内で次に関連するファイル/モジュールを探索: [task summary]。
> 返却内容:
> - 各関連箇所の file_path:line_number
> - そのファイルが関連する理由の簡潔な説明
> - 従うべき既存パターン/規約
>
> **読取のみ、変更なし**。」

サブエージェントは task summary + 検索パターンのみ受領、完全な会話履歴は受け取らない。

### ステップ 4 — ゲート 2: コードマップ確認

```
## 関連ファイル発見:

| File | Line | 関連理由 |
|------|------|-------------------|
| [path] | [N] | [...] |

**既存規約**:
- [Pattern 1]
- [Pattern 2]

| # | 質問 | 選択肢 |
|---|---------|---------|
| 1 | 重要なファイルで漏れたものはあるか? | A: なし / B: あり — file: ___ / C: その他: ___ |
| 2 | このタスクで触れるべきでないモジュールはあるか? | A: なし / B: あり — module: ___ / C: その他: ___ |
```

**確認待ち。**

### ステップ 5 — サブエージェント生成: planner

サブエージェント生成プロンプト:
> 「以下に基づき:
> - Task: [summary]
> - AC: [list]
> - Relevant files: [file map]
> - Constraints: [ゲート 1 から]
>
> トレードオフ付き 2-3 実装オプションを提案。
> 各オプション: 名前、説明、変更ファイル、見積もり、長所/短所。」

### ステップ 5.5 — 並列デザインスタブ（プランナーがアーティファクトタイプを特定した場合）

プランナー出力に基づき、**1 つのメッセージで**並列設計エージェントをスポーン（同時実行）:

- **タスクに新規または変更された画面が含まれる場合** → `agents/screen-designer.md` に従い `screen-designer`（model: haiku）をスポーン
- **タスクに新規または変更された API エンドポイントが含まれる場合** → `agents/api-designer.md` に従い `api-designer`（model: haiku）をスポーン
- **タスクに画面 / API がない場合** → このステップをスキップしてステップ 6 へ

各エージェントへの入力:
```
TASK SUMMARY: [task-reader JSON サマリー]
SELECTED OPTION: [プランナー推奨オプションの名前 + 説明]
AFFECTED SCREENS / AFFECTED APIS: [プランナー出力または code-scout から]
EXISTING DOCS: [docs/screens または docs/api の関連内容（あれば）]
```

エージェントの出力を `docs/tasks/[TASK-ID]/analysis.md` の専用セクションにマージ:
- `## Screen Design Stub` — screen-designer 出力から
- `## API Design Stub` — api-designer 出力から

これらのスタブにより、ステップ 6 でのオプション選択時に十分な情報を提供。

```
✓ デザインスタブ生成完了:
  - 画面: [N] 件 — [名前リスト]
  - API: [N] エンドポイント — [メソッド + パス一覧]
  オプション選択前に analysis.md を確認してください。
```

---

### ステップ 6 — ゲート 3: オプション提示（最重要）

```
## [N] 実装オプション:

### オプション A: [名前] — [特徴キーワード]
**説明**: [...]
**変更ファイル**:
  - `[file]` — [理由]
**見積もり**: [X 時間]
**長所**: [...]
**短所**: [...]
**リスク**: [...]

### オプション B: [名前]
[同様]

### オプション C: [名前]（あれば）
[同様]

---
**推奨**: オプション [X]、理由: [具体的理由]。

選択前に追加質問:

| # | 質問 | 選択肢 |
|---|---------|---------|
| 1 | [選択に影響する制約に関する質問] | _(記入)_ |
| 2 | 優先度: スピード vs 保守性? | A: デリバリースピード優先 / B: 保守性優先 / C: 両者バランス / D: その他: ___ |

**どのオプションを選択しますか?**

| | 選択肢 |
|---|---------|
| A | オプション A |
| B | オプション B |
| C | オプション C |
| D | その他: ___ |
```

**ユーザーの選択待ち。**

### ステップ 6.5 — HTML コンパニオン（オプション比較）

ステップ 6 でユーザーが選択する前、`templates/html-artifact.html` から `docs/tasks/[TASK-ID]/analysis-compare.html` を生成:

- `<table id="options" data-sortable>` を挿入、カラム: オプション | 工数 (h) | リスク | 影響ファイル | 長所 | 短所
- 各オプション 1 行、工数カラムは `data-type="number"` でソート
- リスクは `<span class="pill pill-ok|warn|err">` でレンダリング（Low/Med/High）
- 各オプションに長文用 `<details>` を展開可能

HTML ファイルはワンショットレビュー成果物 — **コミットしない**（`.gitignore` に `docs/tasks/**/*.html` 設定済）。

```
✓ `docs/tasks/[TASK-ID]/analysis-compare.html` 生成完了
  ブラウザで開き、決定前にソート/フィルタ可能。
```

### ステップ 7 — タスク文書作成

ユーザー選択後、`docs/tasks/[TASK-ID]/analysis.md` を作成:

```markdown
# Analysis: [TASK-ID]

## 選択オプション: [名前]
**理由**: [議論より]

## 変更予定ファイル
| File | 変更種別 | 備考 |
|------|--------------|---------|
| | | |

## 検討した他のオプションと不採用理由
- オプション A: [不採用理由]
- オプション B: [不採用理由]

## 残存する未解決の質問
- [ ] [Question あれば]
```

```
## 分析完了 ✓

`docs/tasks/[TASK-ID]/analysis.md` 保存完了。

**ここで停止。** 自動実装しない。

`analysis.md` をレビュー後、`/dev-implement` でコーディング開始。
```

**ユーザーが `/dev-implement` をトリガーするまで待つ。**
ユーザーが同意したように見えても、勝手に実装を開始しない。

---

## オーケストレータへの注意

- 各サブエージェントは必要最小限のコンテキストのみ受領
- 完全な会話履歴をサブエージェントに渡さない
- サブエージェントからの結果は次のサブエージェントに渡す前に要約
- サブエージェントが過剰なファイル（>20）を返した場合、追加フィルタリングを要求

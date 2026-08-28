---
name: install
description: >
  Agentic Development Lifecycle フレームワーク（OpenCode 版）を現在のプロジェクトにインストール。
  skills、agents、templates、workflows を .opencode/ ディレクトリにコピー。
  トリガー: 「フレームワークをインストール」「SDLC をセットアップ」「skills をセットアップ」
  「/install」、または新規プロジェクトへのフレームワーク導入が必要な時。
---

# /install
**ロール**: All
**目的**: Agentic Development Lifecycle フレームワーク（OpenCode 版）を現在のプロジェクトにインストール。

---

## 方法 1 — 自動インストール（推奨）

```bash
# ターゲットプロジェクトのディレクトリから（フレームワークの source ディレクトリではない）
npx github:hiepdnh/Agentic-Development-Lifecycle --yes

# フレームワーク repo を clone 済みの場合は installer を使用
node /path/to/ClaudeSkill/bin/install.js --yes
```

## 方法 2 — 手動インストール（このスキルを使用）

---

## 入力

引数不要。スキルは自動検出:
- **Source**: このフレームワークが置かれているディレクトリ（`/install.md` の場所 = `[SOURCE]/.opencode/skills/install/`）
- **Target**: 現在の OpenCode セッションのワーキングディレクトリ

---

## 実施手順

### ステップ 0 — Gate: 確認

<!-- Gate: インストール確認 -->
question({
  questions: [{
    question: "Agentic Development Lifecycle (OpenCode) をこのプロジェクトにインストールしますか?",
    header: "確認",
    options: [
      { label: "インストール", description: "skills を .opencode/skills/ にコピー" },
      { label: "キャンセル", description: "インストールしない" },
    ]
  }]
})

### ステップ 0b — パス特定

Glob/Read で検出:
- Source root: このファイルから 3 つ親（`../../../`）
- Target root: 現セッションのワーキングディレクトリ（`$PWD`）

確認:
- ワーキングディレクトリ = source ディレクトリ → エラー報告、インストールしない
- 異なる場合 → ユーザー確認用に表示:

```
Source : [SOURCE_PATH]
Target : [TARGET_PATH]
```

### ステップ 1 — `.opencode/skills/` コピー

Glob で `[SOURCE]/.opencode/skills/**/*.md` を全リスト。

各ファイルについて:
- ターゲットパス計算: `[TARGET]/.opencode/skills/[relative_path]`
- ターゲット存在 → `[SKIP]` 報告、上書きしない
- 存在しない → Read + Write でコピー

各ファイル `[OK]` または `[SKIP]` を報告。

### ステップ 2 — `agents/` コピー

Glob `[SOURCE]/agents/*.md`。各ファイルを `[TARGET]/agents/` にコピー。
既存ならスキップ。

### ステップ 3 — `templates/` コピー

`[SOURCE]/templates/` の全ファイル（`.md` と `.html`）を Glob。各ファイルを `[TARGET]/templates/` にコピー。
既存ならスキップ。

### ステップ 4 — `docs/workflows/` コピー

Glob `[SOURCE]/docs/workflows/*.md`。`[TARGET]/docs/workflows/` にコピー。
既存ならスキップ。

### ステップ 4b — フレームワーク文書コピー

各ファイルについて:
- `docs/risk-classifier.md`
- `docs/validation-matrix.md`

`[SOURCE]/docs/[FILE]` から Read、`[TARGET]/docs/[FILE]` に Write。
ターゲット存在ならスキップ。

### ステップ 4c — `docs/improvement-backlog.md` コピー（user-mutable）

`[TARGET]/docs/improvement-backlog.md` が **存在しない** 場合のみコピー。
このファイルはタスク後にユーザーが更新 — **絶対に上書きしない**。

### ステップ 4d — `docs/analysis/` コピー

Glob `[SOURCE]/docs/analysis/*.md`。`[TARGET]/docs/analysis/` にコピー。
既存ならスキップ。

### ステップ 5 — 空ディレクトリ作成

以下に `.gitkeep` ファイル作成（未存在時）:
- `[TARGET]/docs/api/.gitkeep`
- `[TARGET]/docs/screens/.gitkeep`
- `[TARGET]/docs/tasks/.gitkeep`
- `[TARGET]/docs/decisions/.gitkeep`

Write tool で空コンテンツ。

### ステップ 6 — `CLAUDE.md` コピー

- `[TARGET]/CLAUDE.md` 存在 → `[SKIP] CLAUDE.md は既存 — 手動マージ` 報告、参照用に source パス表示
- 存在しない → Read + Write

---

## 結果報告

```
## インストール結果

.opencode/skills/              [OK/SKIP 各ファイル]
agents/                        [OK/SKIP]
templates/                     [OK/SKIP] (md + html)
docs/workflows/                [OK/SKIP]
docs/ (framework files)        [OK/SKIP] (risk-classifier, validation-matrix)
docs/improvement-backlog.md    [OK/SKIP]
docs/analysis/                 [OK/SKIP]
docs/ (空ディレクトリ)          [OK/SKIP] (api, screens, tasks, decisions)
CLAUDE.md                      [OK/SKIP]

次のステップ:
1. CLAUDE.md を開き「Project Context」セクションを更新（プロジェクト名、顧客、repo URL、技術スタック）
2. `/` を入力して利用可能スキルを確認: pm:ideate  ba:spec  dev:analyze  qa:testplan ...
```

---

## 注意

- このスキルは shell を使わない — OpenCode の Glob、Read、Write tool のみ使用
- 既存ファイルを上書きしない — 常に Skip して手動マージを依頼
- `docs/improvement-backlog.md` は user-mutable — 再インストール要求時も絶対に上書きしない
- ワーキングディレクトリ = source ディレクトリ → エラー報告、インストールしない

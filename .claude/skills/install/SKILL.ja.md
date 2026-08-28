---
name: install
description: >
  Agentic Development Lifecycle フレームワークを現プロジェクトにインストール — commands、agents、templates、workflows をコピー。
  シェル不使用、Glob/Read/Write tools のみ。
  トリガー: 「フレームワークをインストール」「skill pack をインストール」「ADL フレームワークをセットアップ」
  「プロジェクトに commands をコピー」、または /install と入力時。
---

# Skill: /install
**目的**: フレームワークを現プロジェクトにインストール。Claude のファイル tool を使用（shell 不実行）、パーミッション分類器のブロックを回避。

---

## 入力

引数不要。スキルは自動検出:
- **Source**: このフレームワークのディレクトリ（`/install/SKILL.md` がある場所 = `[SOURCE]/.claude/skills/`）
- **Target**: 現 Claude Code セッションのワーキングディレクトリ

`--lang` フラグ相当の設定が必要な場合、対象言語ファイルのみをコピーする選択肢をステップ 0 で確認可能。

---

## 実施手順

### ステップ 0 — パス特定

Glob/Read で検出:
- Source root: このファイルから 2 つ親（`../../`）
- Target root: 現セッションのワーキングディレクトリ

ユーザー確認用に表示:
```
Source : [SOURCE_PATH]
Target : [TARGET_PATH]
Language: all (デフォルト) | ja | en | vi
```

```
AskUserQuestion({
  questions: [
    {
      question: "上記の Source から Target へフレームワークをインストールしてよいですか?",
      header: "確認",
      multiSelect: false,
      options: [
        { label: "インストール", description: "commands/agents/templates/workflows を Target にコピーして続行" },
        { label: "キャンセル", description: "中止し、何もインストールしない" }
      ]
    }
  ]
})
```

**続行前に確認を待つ。**

### ステップ 1 — `.claude/skills/` コピー

Glob で `[SOURCE]/.claude/skills/**/SKILL*.md` を全リスト。スキルはフラットフォルダで、各フォルダに SKILL.md (VN) + SKILL.en.md + SKILL.ja.md を含む。

言語フィルタ適用:
- `all`: 全 `SKILL*.md` ファイル
- `ja`: `SKILL.ja.md` + 言語サフィックスなしのベース
- `en`: `SKILL.en.md` + 言語サフィックスなしのベース
- `vi`: 言語サフィックス（`.en.md`/`.ja.md`）なしのみ

各ファイルについて:
- ターゲットパス計算: `[TARGET]/.claude/skills/[relative_path]`
- ターゲット存在 → `[SKIP]` 報告、上書きしない
- 存在しない → Read + Write でコピー

各ファイル `[OK]` または `[SKIP]` を報告。

### ステップ 2 — `agents/` コピー

Glob `[SOURCE]/agents/*.md`。各ファイルを `[TARGET]/agents/` にコピー。
既存ならスキップ。言語フィルタ適用。

### ステップ 3 — `templates/` コピー

`[SOURCE]/templates/` の全ファイル（`.md` と `.html`）を Glob。各ファイルを `[TARGET]/templates/` にコピー。
既存ならスキップ。言語フィルタ適用（HTML は常にコピー）。

### ステップ 4 — `docs/workflows/` コピー

Glob `[SOURCE]/docs/workflows/*.md`。`[TARGET]/docs/workflows/` にコピー。
既存ならスキップ。言語フィルタ適用。

### ステップ 4b — フレームワーク文書コピー

各ファイルについて:
- `docs/risk-classifier.md`、`docs/risk-classifier.ja.md`
- `docs/validation-matrix.md`

`[SOURCE]/docs/[FILE]` から Read、`[TARGET]/docs/[FILE]` に Write。
ターゲット存在ならスキップ。言語フィルタ適用。

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

.claude/skills/               [OK/SKIP 各ファイル]
agents/                       [OK/SKIP]
templates/                    [OK/SKIP] (md + html)
docs/workflows/               [OK/SKIP]
docs/ (framework files)       [OK/SKIP] (risk-classifier, validation-matrix)
docs/improvement-backlog.md   [OK/SKIP]
docs/analysis/                [OK/SKIP]
docs/ (空ディレクトリ)        [OK/SKIP] (api, screens, tasks, decisions)
CLAUDE.md                     [OK/SKIP]

言語フィルタ: [all|ja|en|vi]

次のステップ:
1. CLAUDE.md を開き「Project Context」セクションを更新（プロジェクト名、顧客、repo URL、技術スタック）
2. `/` を入力して利用可能コマンドを確認: /pm-ideate  /ba-spec  /dev-analyze  /qa-testplan ...
3. 日本語版を使う場合: `npx agentic-development-lifecycle --lang ja --update`
```

---

## 注意

- このスキルは PowerShell/Bash を使わない — Claude Code の Glob、Read、Write tool のみ使用
- 既存ファイルを上書きしない — 常に Skip して手動マージを依頼
- `docs/improvement-backlog.md` は user-mutable — 再インストール要求時も絶対に上書きしない
- ワーキングディレクトリ = source ディレクトリ → エラー報告、インストールしない

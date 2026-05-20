# Agentic Development Lifecycle

<div align="right">
  <a href="README.md">🇬🇧 English</a> &nbsp;|&nbsp; <a href="README.vi.md">🇻🇳 Tiếng Việt</a> &nbsp;|&nbsp; <strong>🇯🇵 日本語</strong>
</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/hiepdnh/Agentic-Development-Lifecycle/main/assets/banner.png" alt="Agentic Development Lifecycle" width="100%">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/agentic-development-lifecycle"><img src="https://img.shields.io/npm/v/agentic-development-lifecycle.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/agentic-development-lifecycle"><img src="https://img.shields.io/npm/dm/agentic-development-lifecycle.svg" alt="npm downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

> **Claude Code & OpenCode 向け 32 スキル** — AI 支援でソフトウェアを開発するチームのために、SDLC 全フェーズをカバーします。

---

## これは何ですか？

ソフトウェア開発チーム向けの **AI スキルパック** です。任意のプロジェクトにインストールすることで、スプリントライフサイクルの各フェーズをカバーする、ロール認識型の構造化スキルセットが利用できます。

**Claude Code と OpenCode の両方をサポート** — 同じスキル、異なるランタイム。

構造化された AI 支援を必要とするあらゆるチームで利用可能ですが、特に **クライアント引き継ぎや多言語成果物** を扱う受託・コンサルティングチームに有用です。日本のお客様向けには `設計書` `単体テスト仕様書` `引き継ぎ書` `月次保守報告書` などの成果物テンプレートを標準装備しています。

---

## クイックインストール

### Claude Code

```bash
# macOS / Linux — 対象プロジェクトのディレクトリで実行
npx agentic-development-lifecycle --yes

# 日本語版のみインストール
npx agentic-development-lifecycle --yes --lang ja
```

```powershell
# Windows — 対象プロジェクトのディレクトリで実行
npx agentic-development-lifecycle --yes --lang ja
```

既存インストールの更新:

```bash
npx agentic-development-lifecycle --update --yes --lang ja
```

### OpenCode

```bash
# macOS / Linux
npx agentic-development-lifecycle --yes --opencode --lang ja
```

```powershell
# Windows
npx agentic-development-lifecycle --yes --opencode --lang ja
```

インストールされるもの: スキルディレクトリ + `agents/` + `templates/` + `docs/workflows/`

### 言語フラグ `--lang`

| 値 | コピーされるファイル |
|---|---|
| `all`（デフォルト） | 全ての言語バリアント（VN + EN + JP） |
| `ja` | 日本語ファイル（`*.ja.md`）+ 共通ベース |
| `en` | 英語ファイル（`*.en.md`）+ 共通ベース |
| `vi` | ベトナム語ファイル（`*.md` で言語サフィックスなし） |

### Developer Lite（最小インストール）

PM/BA/QA/Ops のスキル不要で、開発者ワークフローだけ欲しい場合:

```bash
npx agentic-development-lifecycle --yes --lite
```

8 つのスキルのみインストール: `/dev:analyze` `/dev:implement` `/dev:review` `/dev:pr` `/dev:debug` `/sec:review` `/arch:adr` `/docs:update`（Claude Code 専用）。 `--lang ja` または `--lang en` と組み合わせて言語を選択可能。後でフルフレームワークへアップグレード: `npx agentic-development-lifecycle --update --yes`。

---

## スキルコマンド

### ビジネス分析（Business Analysis）

| コマンド | 機能 | 入力 → 出力 |
|---------|------|-------------|
| `/pm:ideate` | 曖昧なアイデア → 明確なコンセプト（問題ステートメント + NOT Doing リスト） | アイデア → コンセプト文書 |
| `/ba:spec` | 生要件 → 構造化された仕様書 | 要件 → `requirements.md` |
| `/ba:user-story` | 仕様 → 受け入れ基準付きユーザーストーリー | 仕様 → ユーザーストーリー |
| `/ba:reverse` | レガシーコードベースのリバースエンジニアリング → ベースライン文書 | コードベース → `docs/baseline/` |
| `/be:bridge` | 日本語要件の翻訳、JP-VN バイリンガル成果物の作成 | JP 要件 → VN 仕様 + JP 設計書 |
| `/be:changerequest` | 変更依頼 — 影響分析、承認証跡、仕様変更のバージョン管理 | CR → 影響分析 + JP 文書 |
| `/be:glossary` | JP↔VN↔EN 用語集の維持 — 用語追加、翻訳の不一致解消 | 新用語 → 用語集更新 |

### プロジェクト管理（Project Management）

| コマンド | 機能 | 入力 → 出力 |
|---------|------|-------------|
| `/pm:breakdown` | Epic/Stories → 見積もり付きタスク + GitHub/GitLab Issues | Epic → Issues |
| `/pm:status` | ステークホルダー向けスプリントステータスレポート | タスク → ステータスレポート |
| `/pm:dashboard` | 静的 HTML スプリントダッシュボード（カンバン + ヘルス + バックログ） | `docs/tasks/*/` → HTML |
| `/pm:kickoff` | グリーンフィールドプロジェクトの立ち上げ: 技術スタック → ADR → 文書構造 → スプリント 0 チェックリスト | 要件 → プロジェクト雛形 |
| `/pm:release` | マージ済み PR + クローズ済み Issue から **リリースノート** を生成 | PR + Issues → リリースノート |
| `/pm:handover` | プロジェクト **引き継ぎパッケージ** の作成 — コードベースマップ + 決定事項 + 連絡先マトリクス | プロジェクト → 引き継ぎパッケージ |
| `/pm:maintain` | 保守フェーズワークフロー: トリアージ → 修正 → **月次保守報告書** | インシデント → 修正 + 報告書 |

### 開発（Development）

| コマンド | 機能 | 入力 → 出力 |
|---------|------|-------------|
| `/dev:analyze` | タスク → トレードオフ付き 2-3 実装オプション | Issue + コードベース → `analysis.md` |
| `/dev:implement` | ヒューマンゲート + 検証 + ハーネスデルタチェック付きでファイル単位に実装 | `analysis.md` → コード → `verification.md` |
| `/dev:review` | 実装後の総合レビュー: コード品質 + アーキテクチャ + セキュリティを 1 回で | 差分 + `analysis.md` → レビューレポート → 承認 / 変更依頼 |
| `/dev:pr` | PR ディスクリプション生成 | コード差分 → PR ディスクリプション |
| `/dev:debug` | 構造化デバッグ: 再現 → 局所化 → 修正 | バグレポート → 修正 |

### アーキテクチャ（Architecture）

| コマンド | 機能 | 入力 → 出力 |
|---------|------|-------------|
| `/arch:review` | 設計判断のレビュー | 設計 → フィードバック |
| `/arch:adr` | Architecture Decision Record の作成 | 決定 → `docs/decisions/ADR-NNN.md` |

### QA

| コマンド | 機能 | 入力 → 出力 |
|---------|------|-------------|
| `/qa:testplan` | 仕様 → **単体テスト仕様書** | 仕様 → `test-plan.md` |
| `/qa:bug` | 標準化されたバグレポート | バグ情報 → バグレポート |
| `/qa:regression` | リリース前の回帰チェックリスト | リリース → Go/No-go チェックリスト |

### DevOps

| コマンド | 機能 | 入力 → 出力 |
|---------|------|-------------|
| `/ops:deploy` | デプロイチェックリスト + CI 品質ゲート + ロールバックプラン | リリース → チェックリスト |
| `/ops:incident` | インシデントトリアージ + 並列調査 + RCA テンプレート | インシデント → RCA |

### セキュリティ（Security）

| コマンド | 機能 | 入力 → 出力 |
|---------|------|-------------|
| `/sec:review` | セキュリティレビュー: Always check / Ask First / Never（OWASP Top 10） | コード → セキュリティレポート |

### ドキュメント（Documentation）

| コマンド | 機能 | 入力 → 出力 |
|---------|------|-------------|
| `/docs:update` | タスク検証後にベースライン画面/API 文書を更新 | 検証済タスク → 更新済文書 |
| `/docs:project` | プロジェクトレベル文書の同期: README、ワークフローガイド、CLAUDE.md | 変更 → 更新済プロジェクト文書 |

### スクラム（Scrum）

| コマンド | 機能 | 入力 → 出力 |
|---------|------|-------------|
| `/sm:standup` | 日次スタンドアップサマリー | 更新内容 → スタンドアップレポート |
| `/sm:retro` | スプリントレトロスペクティブ | スプリント → レトロレポート |

---

## テンプレートと成果物

各スキルは構造化されたテンプレートに出力を書き込みます。すべてのテンプレートは **VN / EN / JP** バリアントに対応しています (`name.md` / `name.en.md` / `name.ja.md`)。

| テンプレート | 生成される成果物 | 準拠規格 |
|-------------|---------------|---------|
| `task-doc-requirements` | 要件定義書 | IEEE 29148 (SRS) |
| `user-story` | ユーザーストーリー + 受入条件 | Connextra / INVEST |
| `analysis` | 実装方針オプション + トレードオフ | — |
| `verification` | テスト結果 + サインオフ | IEEE 829 |
| `test-plan` | テスト計画書 (TCマトリクス付き) | IEEE 829 |
| `bug-report` | バグ報告書 (重大度 / 優先度 / 再現手順) | — |
| `adr` | アーキテクチャ決定記録 | MADR (Markdown Architectural Decision Records) |
| `pr-description` | プルリクエスト説明 | — |
| `github-issue` | GitHub / GitLab イシュー | — |
| `audit` | タスク単位の追記専用監査ログ | — |
| `change-request` | 変更依頼書 — 影響分析 + 承認履歴 | — |
| `release-notes` | リリースノート | Keep a Changelog |
| `handover` | 引き継ぎ書 — コードベースマップ + 連絡先一覧 | — |
| `monthly-maintenance-report` | 月次保守報告書 | — |
| `incident-report` | 障害報告書 + ブレームレス振り返り | Google SRE / PagerDuty |
| `baseline-screen` | 画面定義書 | IPA 基本設計書 規約 |
| `baseline-api` | API定義書 | IPA API定義書 規約 |

JPバリアントには顧客向けフィールド (`顧客名`、`プロジェクト名`、`対象システム`) が含まれ、適切な箇所では敬語を使用しています。

---

## 仕組み

### サブエージェント（マルチエージェントパターン）

重いタスクは軽量サブエージェントを生成してコンテキストを清潔に保ちます:

| エージェント | 使用元 | Claude Code | OpenCode | 目的 |
|-------|---------|-------------|----------|------|
| `task-reader` | `/dev:analyze` | haiku | explorer | Issue → 構造化 JSON |
| `code-scout` | `/dev:analyze` | haiku | explorer | 関連ファイル検索 |
| `planner` | `/dev:analyze` | sonnet | oracle | オプション合成 |
| `diff-reader` | `/dev:pr`, `/docs:update` | haiku | explorer | 差分 → AC カバレッジ |
| `review-reader` | `/dev:review` | haiku | explorer | 差分 → コード/アーキ/セキュリティシグナル |
| `test-gen` | `/qa:testplan` | sonnet | oracle | テストケース生成 |
| `doc-updater` | `/docs:update` | sonnet | oracle | ベースライン文書更新 |
| `pr-resolver` | `/dev:pr` | sonnet | oracle | レビューコメント分析 → 修正案 |

### ヒューマンゲート

すべてのスキルには少なくとも 1 つのヒューマンゲートがあります — スキルはオプションを提示し、**判断を待ってから** 次に進みます。自動実行はありません。

- **Claude Code**: `AskUserQuestion` ツール
- **OpenCode**: `question` ツール

### 典型的なワークフロー

<p align="center">
  <img src="https://raw.githubusercontent.com/hiepdnh/Agentic-Development-Lifecycle/main/assets/workflow.png" alt="Sprint Workflow" width="100%">
</p>

### フルスプリント（最初から最後まで）

```
/pm:ideate → /ba:spec → /ba:user-story → /pm:breakdown

    ↓ （タスクごとに）

/dev:analyze → [analysis.md をレビュー] → /dev:implement
    → /dev:review → /dev:pr
```

### 開発者フロー（単一タスク）

```
/dev:analyze → [analysis.md をレビュー] → /dev:implement → /dev:review → /dev:pr
```

> **`/dev:analyze`** は最初にリスクを分類（tiny / normal / high-risk）し、`analysis.md` を書いた後に停止します。レビュー後、`/dev:implement` を手動でトリガーしてください。
> **`/dev:implement`** は `verification.md`（差分レビュー + セルフテスト結果）の作成後に停止し、ハーネスデルタチェックを促します。その後 `/dev:review` をトリガー — 3 レンズレポート（コード品質、アーキテクチャ、セキュリティ）。承認後、`/dev:pr` をトリガー。

ステップバイステップ詳細: [`docs/workflows/sprint-lifecycle.ja.md`](docs/workflows/sprint-lifecycle.ja.md)
誰がどのスキルを使うか: [`docs/workflows/role-guide.ja.md`](docs/workflows/role-guide.ja.md)

---

## 2 階層文書

```
docs/
  tasks/          ← Type 1: タスク単位（一時的、フレームワークソースでは gitignored）
    TASK-001/
      requirements.md
      analysis.md
      test-plan.md
      verification.md
      audit.md        ← 全スキル実行 + ユーザー入力の追記専用ログ
  baseline/         ← Type 2: ベースライン（生きた文書、検証後に更新）
  screens/
  api/
  decisions/        ← ADR
  workflows/        ← プロセスガイド
```

**Type 1**（タスク文書）: Issue ごとに作成、このフレームワークリポジトリでは gitignored。プロジェクト側で保持。
**Type 2**（ベースライン文書）: 各検証済タスクのマージ後に `/docs:update` で更新。

---

## プロジェクトコンテキスト

構造化されたクライアントコミュニケーションを必要とする受託・コンサルティングチーム向けに設計:

- **ブリッジエンジニア（BE）** — クライアント要件をチーム仕様に翻訳（`/be:bridge`）
- **BA** — 明確化された要件から仕様を作成（`/ba:spec`）
- **開発者** — 構造化された AI ガイダンスで実装、コードコメントは英語
- **QA** — 仕様に基づいてテスト、必要に応じてフォーマット済テストレポート生成
- **成果物** — 日本のお客様向けにフォーマットされた `設計書` `単体テスト仕様書` `成果物`

### 日本市場向けの特徴

- JP-VN-EN 3 言語用語集（`templates/jp-vn-en-glossary.md`）— 70+ 用語
- JP-VN バイリンガル成果物テンプレート（`templates/html-bilingual.html`）— 2 カラム表示、コピーボタン、印刷対応
- ブリッジエンジニアワークフロー — JP 要件の曖昧さ解消から成果物提出まで
- 変更依頼ワークフロー — 影響分析、承認証跡、バージョン管理
- 月次保守報告書テンプレート（`/pm:maintain`）
- 引き継ぎパッケージ生成（`/pm:handover`）

---

## プロジェクト構造

```
.claude/commands/    # Claude Code スラッシュコマンドファイル（VN/EN/JP の 3 バリアント）
.opencode/skills/    # OpenCode スキルファイル（自動トリガー、VN/EN/JP の 3 バリアント）
agents/              # 8 サブエージェント定義
docs/
  workflows/         # スプリントライフサイクル、ロールガイド、フローチャート
  decisions/         # ADR テンプレート
templates/           # 全スキルが参照するスケルトンテンプレート
bin/install.js       # インタラクティブインストーラ（@clack/prompts）— --opencode と --lang サポート
setup.ps1            # PowerShell インストーラ（Claude Code）
setup.sh             # Bash インストーラ（Claude Code）
```

---

## 開発

このリポジトリは **フレームワーク本体** です。「製品」は両プラットフォーム向けのスキルファイルです — `.claude/commands/` と `.opencode/skills/`（各 32 ファイル × 3 言語）。

### スキルトリガーテスト

**Claude Code:**
```bash
bash tests/skill-triggering/run-all.sh
bash tests/skill-triggering/run-all.sh --lang ja
bash tests/skill-triggering/run-all.sh --filter dev-* --verbose
```
要件: 認証済 `claude` CLI + `jq` インストール済。

**OpenCode:**
```powershell
pwsh tests/skill-triggering/opencode-run-all.ps1 -Language ja
pwsh tests/skill-triggering/opencode-run-all.ps1 -Verbose
pwsh tests/skill-triggering/opencode-run-all.ps1 -Filter "dev-*"
```
プロンプト → スキルファイルマッピングを検証。完全なトリガー検証には OpenCode セッションが必要。

---

## ライセンス

MIT — 自身のプロジェクトで自由に使用・カスタマイズ可能。

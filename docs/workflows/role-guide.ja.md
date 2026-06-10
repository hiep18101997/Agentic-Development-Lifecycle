# ロールガイド — 誰がどのスキルを使うか?

**フレームワーク**: Agentic Development Lifecycle
**最終更新**: 2026-05-15

---

## PM（プロジェクトマネージャー）

| スキル | 使用タイミング | 出力 |
|-------|---------|--------|
| `/pm-kickoff` | グリーンフィールド新規プロジェクト開始 | 技術スタック ADR + 文書構造 + Sprint 0 チェックリスト |
| `/pm-ideate` | ステークホルダーから曖昧な要望受領 | ワンページ概要 + Not Doing リスト |
| `/pm-breakdown` | ユーザーストーリー作成後 | GitHub Issues |
| `/pm-status` | ステークホルダー / JP 顧客向けスプリントレポート | ステータスサマリ（Markdown）または `sprint-status.html`（カンバン + ベロシティダッシュボード、顧客送付時は HTML 推奨） |
| `/pm-dashboard` | いつでもスプリント全体像を確認 | `docs/dashboard.html` — カンバン + KPI + Git アクティビティ + ヘルスチャート |
| `/pm-release` | 各リリース前、JP / ステークホルダー送付 | `release-[version].html` + Markdown — バイリンガル**リリースノート** |
| `/pm-handover` | 開発者離任 / JP 契約終了時 | `handover.md`（VN）+ `引き継ぎ書.md`（JP） |
| `/pm-maintain` | プロジェクトが保守 / サスティンフェーズへ | トリアージボード + 修正ワークフロー + `月次保守報告書` |

**ダッシュボード使用**:
```bash
npm run dashboard           # 1 回生成
npm run dashboard:watch     # ファイル変更時に自動再生成
```
ブラウザで `docs/dashboard.html` を開く。サーバー不要。セクション: 統計 KPI · カンバン · アクティビティタイムライン（監査 + Git 14 日） · 検証ヘルスドーナツ · スキルヒートマップ · スプリントヘルステーブル · 改善バックログ。

**使わない**: dev-*, sec-*, qa-*, arch-*

---

## BA（ビジネスアナリスト）

| スキル | 使用タイミング | 出力 |
|-------|---------|--------|
| `/ba-spec` | pm:ideate 後、pm:breakdown 前 | requirements.md |
| `/ba-user-story` | ba:spec 後 | requirements.md 内ユーザーストーリー |
| `/ba-reverse` | ブラウンフィールド: レガシー / 旧ベンダーコードベース引き継ぎ | docs/baseline/codebase-overview.md |

**使わない**: dev-*, sec-*, arch-*

---

## 開発者（Developer）

| スキル | 使用タイミング | 出力 |
|-------|---------|--------|
| `/dev-analyze` | Issue 受領、コーディング前 | リスク分類 + `analysis.md` + `analysis-compare.html`（**停止 — 実装前にレビュー**） |
| `/dev-implement` | dev:analyze 後、案選択済 | コード + `verification.md` + ハーネスデルタ（**停止 — ユーザーテスト後 dev:review へ**） |
| `/dev-review` | 実装後、PR 作成前 | レビューレポート: コード品質 + アーキ + セキュリティを 1 回で |
| `/dev-debug` | ブロック時 / バグ発見時 | 根本原因 + 修正 |
| `/dev-pr` | dev:review 承認後、PR 作成前 | PR 説明（`verification.md` を自動参照） |

**必須順序**: `dev:analyze` → [`analysis.md` レビュー] → `dev:implement` → [テスト結果報告] → `dev:review` → `dev:pr`

**リスクレーン**（`docs/risk-classifier.ja.md` 参照）:
- **Tiny** → 直接パッチ、`dev:analyze` スキップ
- **Normal** → 上記フル手順
- **High-risk** → 実装前停止、シニア確認必須

---

## テックリード / アーキテクト

| スキル | 使用タイミング | 出力 |
|-------|---------|--------|
| `/dev-review` | 実装後の開発者コードレビュー — /arch-review + /sec-review を個別に実行する代わりに使う | レビューレポート: コード + アーキ + セキュリティ |
| `/arch-adr` | `/dev-review` で新規設計判断が必要と判明した時 | `docs/decisions/ADR-NNN.md` |
| `/arch-review` | スタンドアロン — 設計判断レビューのみ、フルレビュー不要時 | アーキテクチャ所見 |
| `/sec-review` | スタンドアロン — クイックセキュリティチェック（ホットフィックス、緊急パッチ） | セキュリティ所見 |

**スプリント内位置:**
```
dev:analyze → [high-risk なら Tech Lead が analysis.md レビュー]
           → dev:implement
           → arch:review  （新規設計判断がある場合）
           → sec:review   （セキュリティ変更がある場合）
           → dev:pr
```

**主な 3 役割:**
1. **High-risk タスクのゲート** — `/dev-analyze` がタスクを `high-risk` と分類した場合、フレームワークは強制的に停止し、実装前にシニア / Tech Lead 確認を要求する。これはハードゲートで、オプションではない。
2. **設計判断のレビュー** — チームがパターン、DB 構造、API 契約などを提案する際 `/arch-review` を使用。初期設計ミスによる高コストな手戻りを回避。
3. **JP 顧客向け監査証跡** — すべての設計判断 → `/arch-adr` で ADR 作成。数か月後に顧客から「なぜこの設計?」と問われた際に役立つ。

**使わない**: pm-*, ba-*, qa-testplan, ops-*

---

## QA エンジニア

| スキル | 使用タイミング | 出力 |
|-------|---------|--------|
| `/qa-testplan` | 仕様確定後、開発と並行 | `test-plan.md` + `test-plan.html`（チェック可能、localStorage 保存） |
| `/docs-update` | 検証 + マージ後 | verification.md + 更新済ベースライン文書 |
| `/qa-regression` | 各リリース前 | `regression-checklist.html`（Go/No-go 判定、ステータスバッジ自動更新） — JP 顧客が証跡を必要とする場合は PDF エクスポート |

---

## ブリッジエンジニア

| スキル | 使用タイミング | 出力 |
|-------|---------|--------|
| `/be-bridge` | JP 顧客から要件受領 / JP 顧客へ成果物送付 | requirements.md（VN）+ design-jp.md（JP）+ `deliverable.html`（2 カラムバイリンガル、A4 印刷対応、成果物用） |
| `/be-changerequest` | JP 顧客から仕様変更依頼 | CR-NNN-vn.md + CR-NNN-jp.md（変更依頼書） |
| `/be-glossary` | bridge セッション後に `[GLOSSARY?]` タグ / 用語不一致発生時 | templates/jp-vn-en-glossary.md 更新 |

---

## スクラムマスター / チームリード

| スキル | 使用タイミング | 出力 |
|-------|---------|--------|
| `/pm-ideate` | スプリントプランニングのファシリテーション | ワンページ概要 |
| `/arch-adr` | チーム判断の文書化 | ADR |

---

## シチュエーション別クイックワークフロー

### 「新規グリーンフィールドプロジェクト開始」
```
/pm-kickoff → [技術スタック + ADR + 文書構造] → /be-bridge (JP の場合 基本設計書)
    → /pm-breakdown → Sprint 1
```

### 「JP 顧客から要件受領」
```
/be-bridge → /ba-spec → /ba-user-story → /pm-breakdown
```

### 「旧ベンダーからブラウンフィールドコードベース引き継ぎ」
```
/ba-reverse → [ベースライン文書レビュー] → /be-bridge (JP レビュー) → /ba-spec (新機能向け)
```

### 「新規 Issue 受領、コーディング必要」
```
/dev-analyze → [analysis.md レビュー] → /dev-implement → [テスト結果報告] → /dev-review → /dev-pr
```

### 「スプリント途中で JP 顧客から仕様変更依頼」
```
/be-changerequest → [影響分析] → [JP 承認] → requirements.md 更新 → /dev-analyze
```

### 「コード完了、QA 必要」
```
/qa-testplan → [手動実行] → /docs-update
```

### 「リリース前」
```
/qa-regression → [サインオフ] → デプロイ → /pm-release (リリースノート)
```

### 「プロジェクトが保守フェーズへ」
```
/pm-maintain トリアージ → 修正 → 月末: JP 顧客へ月次報告書送付
```

### 「開発者離任 / JP 契約終了」
```
/pm-handover → [引き継ぎミーティング] → 後任シャドウイング → CLAUDE.md 更新
```

### 「PR レビューコメントへの対応」
```
/dev-pr → [PR resolver 選択] → pr-resolver エージェント分析 → 必須項目修正 → re-push
```

### 「スプリント健全性のクイック確認」
```bash
npm run dashboard
# docs/dashboard.html を開く → カンバン + KPI + Git アクティビティ + 検証ヘルス
```
または Claude Code 内: `/pm-dashboard`

### 「技術判断の文書化」
```
/arch-adr
```

---

## 注意事項

- 各スキルには **ゲート** がある — 続行前に必ず確認を待つ
- 複数選択ゲートは `AskUserQuestion` ツールを使用（プレーンテキストではなくネイティブ TUI）
- サブエージェントは dev:analyze、dev:implement（検証）、sec:review、qa:regression で使用
- `dev:analyze` と `dev:implement` には **ハードストップ** あり — 次ステップへ自動進行しない
- **リスク分類器**（`docs/risk-classifier.ja.md`）— すべての開発タスク開始前の Step 0、必須
- **改善バックログ**（`docs/improvement-backlog.md`）— エージェントが各タスク後に摩擦を記録、フレームワーク改善時に参照
- **検証マトリクス**（`docs/validation-matrix.md`）— `bash tests/skill-triggering/run-all.sh --lang ja` 実行後、Status カラムを更新
- 完全フローは `docs/workflows/sprint-lifecycle.ja.md` を参照
- **出力フォーマット規約** — 5 スキル（`/dev-analyze`、`/qa-testplan`、`/qa-regression`、`/pm-status`、`/be-bridge`）は Markdown 以外に HTML コンパニオンを生成し、インタラクティブレビュー（ソート、フィルタ、チェックリスト、バイリンガル）をサポート。HTML ファイルはワンショット、コミットしない — `CLAUDE.md` の「Output Format Convention」セクションと `docs/analysis/html-effectiveness-thariq.md` を参照。

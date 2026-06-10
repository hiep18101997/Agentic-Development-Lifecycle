# スプリントライフサイクル — エンドツーエンドガイド

**フレームワーク**: Agentic Development Lifecycle
**最終更新**: 2026-05-15

> 📊 クイックダッシュボード: `/pm-dashboard` 実行 → `sprint-status.html` 生成（カンバン + ヘルステーブル + バックログ）

---

## スプリントフロー全体像

```
フェーズ 1: スプリント開始
  PM: /pm-ideate (optional) → /ba-spec → /ba-user-story → /pm-breakdown

  [GitHub Issues 作成、開発者に割り当て]

フェーズ 2: 開発実装
  Dev: /dev-analyze → /dev-implement → /dev-review → /dev-pr

フェーズ 3: レビュー & マージ
  Reviewer: コードレビュー（手動 + /ultrareview オプション）
  QA: /qa-testplan (必要に応じて) → テスト実行

フェーズ 4: リリース
  DevOps: /ops-deploy → デプロイ → 監視

  [インシデント発生時: /ops-incident]

フェーズ 5: レトロスペクティブ
  SM: /sm-retro
```

---

## フェーズ 1: スプリント開始

### 1.1 アイデーション（オプション） `/pm-ideate`
**使用者**: PM / BA / Product Owner
**使用タイミング**: アイデアが曖昧でスコープ不明確。`/ba-spec` の前に実行し、仕様のミスを回避。
**入力**: 生のアイデア
**出力**: 問題ステートメント、ゴール、NOT Doing リスト付きコンセプト文書

### 1.2 ビジネス仕様 `/ba-spec`
**使用者**: BA
**入力**: 生要件（BE が翻訳した JP、または直接 VN）
**出力**: `docs/tasks/[TASK-ID]/requirements.md`
**ゲート**:
1. スコープ確認（in/out）
2. AC リスト確認
3. Q&A 履歴を追記専用で記録（中断後の再開対応）

### 1.3 ユーザーストーリー `/ba-user-story`
**使用者**: BA / PM
**入力**: `requirements.md`
**出力**: 形式「As a [ユーザー], I want [アクション], so that [メリット]」+ AC

### 1.4 タスク分解 `/pm-breakdown`
**使用者**: PM / テックリード
**入力**: Epic またはユーザーストーリー
**出力**: 見積もり、ラベル、担当者付き GitHub Issues（または GitLab）
**サポート**: GitHub（`gh` CLI）と GitLab（`glab` CLI）

---

## フェーズ 2: 開発

### 2.1 リスク分類
すべてのタスク開始前、`docs/risk-classifier.ja.md` に従ってリスク分類:
- **Tiny** → 直接パッチ、`analysis.md` スキップ
- **Normal** → analyze → implement → review → PR のフルフロー
- **High-risk** → 停止、シニア確認後に続行

### 2.2 タスク分析 `/dev-analyze`
**使用者**: 開発者
**入力**: GitHub Issue + コードベース
**出力**: 2-3 案 + トレードオフ付き `docs/tasks/[TASK-ID]/analysis.md`
**ゲート**:
1. 技術スタック / 影響範囲確認
2. 案選択（`analysis.md` レビュー後）

**マルチエージェントパターン**: `task-reader`（haiku）→ `code-scout`（haiku）→ `planner`（sonnet）→ オーケストレータが統合

**ハードストップ** — `dev:analyze` は `analysis.md` 記録後に停止。ユーザーがレビュー後、手動で `/dev-implement` トリガー。

### 2.3 実装 `/dev-implement`
**使用者**: 開発者
**入力**: `analysis.md`（選択済案）
**出力**: コード変更 + `docs/tasks/[TASK-ID]/verification.md`
**ゲート**（ファイル単位）:
1. 実装プラン + ファイル順序確認
2. 各ファイル後に確認（次ファイルへ自動進行しない）
3. ステップ 4 — 開発者セルフチェック
4. ステップ 5 — 検証ゲート: 差分レビュー → AI がセルフテスト手順生成 → ユーザーが結果報告 → `verification.md` 保存
5. **ハーネスデルタチェック** — エージェントが摩擦の有無を確認、ある場合 `docs/improvement-backlog.md` に記録

**ステップ 5 後ハードストップ** — ユーザーが `/dev-review` を手動トリガー。

### 2.4 開発レビュー `/dev-review`
**使用者**: 開発者 / テックリード
**入力**: コード差分 + `analysis.md` + `verification.md`
**出力**: 4 レンズレビューレポート: コード品質、アーキテクチャ、パフォーマンス、セキュリティ
**ゲート**:
1. フォーカス確認（All / Code / Arch / Security）
2. 判定: Approve / Approve with minor fixes / Request Changes
3. 新規設計判断あり → `/arch-adr` 作成可否を確認

1 回の実行で 4 レンズレビュー:
- **コード品質** — ロジック、命名、テストカバレッジ、パフォーマンス、エラーハンドリング
- **アーキテクチャ** — スケーラビリティ、結合度、保守性、新規設計判断
- **セキュリティ** — OWASP Top 10、認証/認可（Ask First ゲート）、依存関係 CVE

**ブロッキング Issue** → 開発者が修正、`/dev-review` 再実行
**承認** → `/dev-pr` へ続行

---

## フェーズ 3: レビュー & マージ

### 3.1 開発 PR `/dev-pr`
**使用者**: 開発者
**入力**: コード差分 + `analysis.md` + `verification.md`（あれば）
**出力**: PR 説明（Testing セクションは `verification.md` から自動入力）
**前提条件**: `/dev-review` 実行済 + 判定 = Approve（または Approve with minor fixes）
**ゲート**:
1. `/dev-review` Approve 確認 — 未実行ならレビュー実行を促して停止
2. AC カバレッジ確認
3. レビュアーリスト確認

### 3.2 コードレビュー（手動）
- レビュアーは AI 支援が必要なら `/ultrareview` 使用
- 最低 1 名 approve
- コメント対応

### 3.3 QA（必要に応じて）
- `/qa-testplan` — 仕様からテストプラン作成（通常は実装前）
- `/qa-regression` — 大型リリース前の回帰チェックリスト

---

## フェーズ 4: リリース

### 4.1 デプロイ `/ops-deploy`
**使用者**: DevOps / 開発者
**出力**: デプロイチェックリスト + CI 品質ゲート + ロールバックプラン
**注意**: 日本の顧客向けは JST タイムゾーン考慮

### 4.2 インシデント（発生時） `/ops-incident`
**トリガー**: 本番システム障害
**パターン**: トリアージ → 3 方向並列調査 → RCA テンプレート（なぜなぜ分析）

---

## フェーズ 5: 文書更新

### 5.1 ベースライン文書更新 `/docs-update`
**トリガー**: タスクのマージ + 検証完了後
**入力**: `verification.md` + 実コード
**出力**: `docs/screens/` または `docs/api/` のベースラインを更新、メタデータ: `Last updated`（JST）、`Updated by task`、`Commit`（short-sha）

### 5.2 プロジェクト文書 `/docs-project`
**トリガー**: 大規模変更時（新スキル、チーム変更、プロセス更新）
**出力**: README、CLAUDE.md、ワークフローガイドを同期

---

## フェーズ 6: レトロスペクティブ

### 6.1 スプリントレトロ `/sm-retro`
**トリガー**: スプリント末
**出力**: Went well / Didn't go well / Actions

### 6.2 スタンドアップ `/sm-standup`
**トリガー**: 毎日
**出力**: メンバー別 Yesterday / Today / Blockers

---

## グリーンフィールドプロジェクト立ち上げ

フェーズ 1 の前、新規プロジェクトを最初から始める場合:

```
/pm-kickoff → 技術スタック決定 + ADR → docs/ 構造 → Sprint 0 チェックリスト
    → JP クライアントの場合: /be-bridge で 基本設計書 作成 → JP 確認
    → Sprint 1: 通常の Discovery フェーズへ
```

---

## 変更依頼ワークフロー（スプリント途中）

サインオフ後に仕様変更:

```
JP から変更依頼 → /be-changerequest → 影響分析 + CR 文書
    → 承認（PM + JP 顧客） → requirements.md 更新（CR ref 記載）
    → 新規 Issue 作成または元 Issue 更新 → 通常の開発ワークフロー
```

**CR 承認前に実装しない。**

---

## 保守モードワークフロー

Go-live 後、プロジェクトがサスティン / サポートフェーズへ:

```
要望到着 → /pm-maintain トリアージ（P1/P2/P3/P4）
    → P1: 即時ホットフィックス + /ops-incident
    → P2/P3: 開発者修正（tiny または normal レーン）
    → P4: 月次バックログにバッチ
    → 月末: /pm-maintain → 月次保守報告書 → JP 送付
```

---

## 引き継ぎワークフロー

プロジェクト終了またはメンバー離任時:

```
/pm-handover → 引き継ぎ書 VN + JP
    → 引き継ぎミーティング + ウォークスルー
    → 後任が 1-2 スプリントシャドウイング
    → CLAUDE.md 内連絡先マトリクス更新
```

---

## 重要ゲートサマリ

| スキル | ゲート | 種別 |
|-------|------|-------|
| `/dev-analyze` | 案選択 | 判断 |
| `/dev-implement` | 各ファイル確認 | 安全 |
| `/dev-implement` | 検証 + ハーネスデルタ | 品質 |
| `/dev-review` | スコープ + 判定 | 品質 |
| `/dev-pr` | AC カバレッジ + レビュアー | プロセス |
| `/ops-deploy` | デプロイ前チェックリスト | 安全 |
| `/ba-spec` | スコープ + AC 確認 | 要件 |

---

## 出力フォーマット

各スキルは消費者に応じてフォーマットを選択:

| 成果物 | 消費者 | フォーマット |
|----------|----------|--------|
| `analysis.md`、`requirements.md` | Git、将来の開発者 | Markdown |
| スプリントステータス、回帰チェックリスト | 判断中の人間 | HTML |
| JP 成果物 | 日本の顧客 | HTML |
| エージェントへチェイン | LLM | JSON |

HTML 成果物: インタラクティブ、ソート可能、ワンショット判断用。Markdown より見やすい。

---

## クイックリファレンス: 誰がどのスキルを使うか?

`docs/workflows/role-guide.ja.md` を参照

---
taskId: [TASK-ID]
lang: ja
createdAt: [YYYY-MM-DD HH:mm JST]
---

# 監査ログ — [TASK-ID]

_追記専用ログ: ユーザー入力（原文）+ エージェントの意思決定を JST タイムスタンプ付きで記録。JP 顧客が数ヶ月後に「なぜこの設計？」と問い合わせた場合の根拠として使用。_

**`requirements.md` の Q&A 履歴との違い**:
- Q&A 履歴 — BA の仕様確認 Q&A のみ記録（1スキル分）
- 監査ログ — このタスクで実行した**すべてのスキル**を記録（BA, Dev, QA, Arch...） + ユーザーの生入力

**`hash` フィールド**（任意、改ざん検知が必要な場合に推奨）: diff + タイムスタンプ + エージェント名の SHA-256 ダイジェスト。`node bin/audit-hash.js --diff <file> --agent <name> --timestamp <iso>` で生成 — 記録後にエントリが改変されていないか検証する用途。

**`duration` フィールド**（任意、分単位で self-report、例: `12m`）: ユーザーがスキルを呼び出してから最終ゲート完了までの時間 — ダッシュボードがスキルごとの平均オーバーヘッドを計算する用途（「Skill Benchmark」パネル）。必須ではない。省略するとそのスキルはベンチマークに含まれない。

---

## [YYYY-MM-DD HH:mm JST] · skill=`/ba-spec` · round=1 · commit=`[short-sha]`

**ユーザー入力** (原文):
> [ユーザーが入力した正確なテキスト]

**スキルアクション**: [ステージ名 + 1行サマリー]
**決定事項**: [具体的な決定内容、またはファイルへの参照]
**成果物**: `docs/tasks/[TASK-ID]/requirements.md` — 更新されたセクション
**hash**: `[node bin/audit-hash.js の出力]`
**duration**: `12m`

---

## [YYYY-MM-DD HH:mm JST] · skill=`/dev-analyze` · agent=planner · commit=`[short-sha]`

**ユーザー入力** (原文):
> [...]

**スキルアクション**: サブエージェント 3つを起動 (task-reader, code-scout, planner)
**決定事項**: ユーザーはオプション A (in-memory) ではなく オプション B (Redis キャッシュ) を選択 — 理由: ポッド間でのスケール対応
**成果物**: `docs/tasks/[TASK-ID]/analysis.md`
**hash**: `[node bin/audit-hash.js の出力]`

---

<!-- 新しいエントリは末尾に追記。既存のエントリは編集不可。 -->

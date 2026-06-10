---
name: qa-it
description: >
  仕様と UT 結果から Integration/E2E テストプランを作成し、人手 E2E 実行と結果記録をサポート。
  /qa-ut 通過後にのみ実行。失敗時は dev-debug へのバグフィードバックループあり。
  トリガー: 「ITプラン作成」「統合テスト」「E2Eテストケース」「インテグレーションテスト」「エンドツーエンドテスト」、または /qa-it と入力時。
---

# Skill: /qa-it
**ロール**: QA Engineer  
**目的**: エンドツーエンドのビジネスフローをカバーする Integration/E2E テストプラン作成。UT 通過後にのみ実行。失敗時 → dev フェーズへの明示的なバグフィードバックループ。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー詳細は:
- 英語版: `it.en.md`
- ベトナム語版（正本）: `it.md`

---

## ワークフロー概要

**前提条件**: `ut-results.md` の verdict が `PASS` であること（未通過の場合は `/qa-ut` を先に実行）

1. `requirements.md` + `analysis.md` + `test-plan-ut.md` を読み込む
2. ゲート: IT スコープ確認（統合フロー、環境、テストデータ、外部依存）
3. `test-plan-it.md` 作成（TC-IT-xxx 形式）— Happy / Edge / Error / Performance
4. `test-plan-it.html` — go/no-go バッジ付きインタラクティブチェックリスト生成
5. ゲート: テストプラン検証
6. **ゲート: 実行結果（HUMAN ONLY — AI は実行しない）**
   - 全 TC PASS → `it-results.md` 記録 → 🎉 `/dev-pr` へ
   - 失敗あり → `bug-handoff.md` 作成（append）→ `/dev-debug` へ

---

## JP 特有の考慮事項

- **成果物**: `test-plan-it.md` は JP 顧客への 単体テスト仕様書（IT相当） として使用可能
- **JST タイムスタンプ**: 結果記録には JST を使用
- **HUMAN ONLY**: E2E テスト実行は必ず人手で行う — AI は実行しない
- **ut_prerequisite**: `it-results.md` に UT 合格リンクを明記（JP 顧客への説明責任）
- **用語**: `templates/jp-vn-en-glossary.md` 参照

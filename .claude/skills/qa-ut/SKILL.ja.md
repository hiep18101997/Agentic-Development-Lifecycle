---
name: qa-ut
description: >
  仕様/要件からユニットテストプランを作成し、人手実行と結果記録をサポート。IT（統合/E2E）とは完全に分離。
  失敗時は dev-debug へのバグフィードバックループあり。
  トリガー: 「ユニットテスト作成」「UTプラン」「機能テストケース」「単体テスト」「関数ごとにテスト」、または /qa-ut と入力時。
---

# Skill: /qa-ut
**ロール**: QA Engineer  
**目的**: 関数/コンポーネントごとのユニットテストプラン作成、実行サポート、結果記録。失敗時 → dev フェーズへの明示的なバグフィードバックループ。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー詳細は:
- 英語版: `ut.en.md`
- ベトナム語版（正本）: `ut.md`

---

## ワークフロー概要

1. `requirements.md` + `analysis.md` を読み込む
2. ゲート: UT スコープ確認（コンポーネント、フレームワーク、カバレッジ目標）
3. `test-plan-ut.md` 作成（TC-UT-xxx 形式）— Happy / Edge / Negative / Error
4. `test-plan-ut.html` インタラクティブチェックリスト生成
5. ゲート: テストプラン検証
6. （オプション）test-gen エージェントでテストコード自動生成
7. **ゲート: 実行結果（HUMAN ONLY — AI は実行しない）**
   - 全 TC PASS → `ut-results.md` 記録 → `/qa-it` へ
   - 失敗あり → `bug-handoff.md` 作成 → `/dev-debug` へ

---

## JP 特有の考慮事項

- **成果物**: 単体テスト仕様書 (`test-plan-ut.md`) は JP 顧客への 単体テスト仕様書 として使用可能
- **JST タイムスタンプ**: 結果記録には JST を使用
- **HUMAN ONLY**: テスト実行は必ず人手で行う — AI は実行しない
- **用語**: `templates/jp-vn-en-glossary.md` 参照

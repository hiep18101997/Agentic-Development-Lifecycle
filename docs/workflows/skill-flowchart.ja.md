# スキルフローチャート — Agentic Development Lifecycle

SDLC の流れに沿った 26 スキルの関係図。

---

## フル SDLC フロー

```mermaid
flowchart TD
    %% ── 入力 ──
    JP([🇯🇵 JP 顧客])
    IDEA([💡 アイデア / 課題])
    LEGACY([🏚️ ブラウンフィールドコードベース<br/>引き継ぎ / レガシー])

    %% ── Discovery ──
    subgraph DISC ["🔍 Discovery"]
        BRIDGE["/be-bridge 🌐\nBridge Engineer"]
        IDEATE["/pm-ideate\nPM · BA"]
        REVERSE["/ba-reverse\nBA · Tech Lead"]
        BASELINE[(docs/baseline/<br/>codebase-overview.md)]
    end

    %% ── Planning ──
    subgraph PLAN ["📋 Planning"]
        SPEC["/ba-spec\nBA"]
        STORY["/ba-user-story\nBA"]
        BREAKDOWN["/pm-breakdown\nPM"]
        ISSUES[(GitHub Issues)]
    end

    %% ── Architecture ──
    subgraph ARCH ["🏛️ Architecture（横断）"]
        ARCH_REV["/arch-review\nTech Lead"]
        ADR["/arch-adr\nTech Lead"]
    end

    %% ── Dev per Issue ──
    subgraph DEV ["💻 Dev サイクル — Issue ごと"]
        RISK["🔵 リスク分類器\ndocs/risk-classifier.ja.md"]
        ANALYZE["/dev-analyze 🌐\nDev"]
        IMPLEMENT["/dev-implement\nDev"]
        VERIFY["✅ 検証ゲート\nユーザーがテスト結果報告"]
        HARNESS["📝 ハーネスデルタ\ndocs/improvement-backlog.md"]
        DEBUG["/dev-debug\nDev"]
        DEVREVIEW["/dev-review\nDev · Tech Lead"]
        PR["/dev-pr\nDev"]
    end

    %% ── QA ──
    subgraph QA ["🧪 QA サイクル"]
        TESTPLAN["/qa-testplan 🌐\nQA"]
        BUGR["/qa-bug\nQA"]
        REGRESSION["/qa-regression 🌐\nQA"]
    end

    %% ── Sprint Ops ──
    subgraph SPRINT ["📊 スプリント運用（反復）"]
        STANDUP["/sm-standup\ndaily"]
        STATUS["/pm-status 🌐\nper sprint"]
        RETRO["/sm-retro\nsprint end"]
    end

    %% ── Release ──
    subgraph REL ["🚀 リリース"]
        DEPLOY["/ops-deploy\nDevOps"]
        INCIDENT["/ops-incident\nDevOps"]
    end

    %% ── マージ後 ──
    DOCS["/docs-update\nDev · QA"]

    %% Entry
    JP --> BRIDGE
    IDEA --> IDEATE
    LEGACY --> REVERSE

    %% Discovery → Planning
    BRIDGE -->|"spec VN + 設計書 JP"| SPEC
    IDEATE --> SPEC
    REVERSE --> BASELINE
    BASELINE -.->|"新機能のコンテキスト"| SPEC
    BASELINE -.->|"引き継ぎ時 JP レビュー"| BRIDGE
    SPEC --> STORY
    STORY --> BREAKDOWN
    BREAKDOWN --> ISSUES

    %% Planning → QA（Dev と並列）
    SPEC -.->|"Dev と並行"| TESTPLAN

    %% Planning → Architecture
    BREAKDOWN -.->|"複雑な設計"| ARCH_REV

    %% Issues → Dev
    ISSUES --> RISK
    RISK -->|"tiny: 直接パッチ"| PR
    RISK -->|"high-risk: 停止 + シニア確認"| ANALYZE
    RISK -->|"normal レーン"| ANALYZE
    ANALYZE -->|"analysis.md — ハードストップ"| IMPLEMENT

    %% Dev ループ
    IMPLEMENT -->|"バグ"| DEBUG
    DEBUG --> IMPLEMENT

    %% 検証
    IMPLEMENT -->|"差分 + セルフテスト手順"| VERIFY
    VERIFY -->|"verification.md"| HARNESS
    HARNESS -->|"ハードストップ"| DEVREVIEW

    %% マージ前
    DEVREVIEW -->|"ブロッキング Issue"| IMPLEMENT
    DEVREVIEW --> PR

    %% マージ後
    PR --> DOCS

    %% アーキテクチャ判断
    ARCH_REV --> ADR
    ADR -.->|"設計更新"| ARCH_REV
    IMPLEMENT -.->|"大きな判断"| ADR
    PR -.->|"破壊的変更"| ARCH_REV

    %% QA ループ
    TESTPLAN --> BUGR
    BUGR -->|"再現"| DEBUG
    BUGR -.->|"修正検証済"| TESTPLAN

    %% リリース前
    PR -->|"スプリント末"| REGRESSION
    REGRESSION --> DEPLOY
    DEPLOY -->|"インシデント"| INCIDENT

    %% スプリント運用（並列実行）
    STANDUP -.->|"スプリント末"| RETRO
    STANDUP -.->|"週次/オンデマンド"| STATUS
```

---

## ロール別主要フロー

### Bridge Engineer — JP 受託開始
```
JP 顧客 → /be-bridge → /ba-spec (VN) + 設計書 (JP)
```

### ブラウンフィールドオンボーディング — レガシーコードベース引き継ぎ
```
レガシーコードベース → /ba-reverse → docs/baseline/codebase-overview.md
                                  → [オプション /be-bridge JP レビュー]
                                  → /ba-spec（コンテキスト付き新機能向け）
```

### PM / BA — Discovery → Planning
```
/pm-ideate → /ba-spec → /ba-user-story → /pm-breakdown → Issues
```

### Dev — Issue ごと
```
Issue → リスク分類器（tiny/normal/high-risk）
    [normal] → /dev-analyze → [analysis.md レビュー]
                    → /dev-implement → [テスト結果報告 → verification.md]
                    → [ハーネスデルタチェック]
                    → /dev-review → /dev-pr → /docs-update
                         ↕（バグ）
                     /dev-debug
    [tiny]  → 直接パッチ
    [high-risk] → シニア確認 → /dev-analyze → ...
```

### QA — Dev と並列
```
/ba-spec ──→ /qa-testplan ──→ テスト
                                 ↓（バグ発見）
                             /qa-bug → /dev-debug → 再テスト
                                 ↓（リリース前）
                            /qa-regression → /ops-deploy
```

### Architecture — スプリント横断
```
/arch-review ←──→ /arch-adr
     ↑                 ↑
Planning          Dev 判断
```

### Sprint Ops — Scrum 儀式
```
/sm-standup（daily） ──→ /sm-retro（sprint end）
                    ──→ /pm-status（オンデマンド）
```

---

## ゲート依存関係

| スキル | 実行前要件 |
|-------|------------------------|
| `/ba-user-story` | `/ba-spec` 完了 |
| `/pm-breakdown` | `/ba-user-story` または既存ユーザーストーリー |
| `/dev-analyze` | リスク分類器実行済（`docs/risk-classifier.ja.md` 参照）+ Issue/タスク明確（AC 定義済） |
| `/dev-implement` | `docs/tasks/[ID]/analysis.md` 存在 |
| `/dev-review` | `/dev-implement` ステップ 5 完了 + `verification.md` 保存 + ハーネスデルタチェック完了 |
| `/dev-pr` | `/dev-review` Approve + ブロッキング Issue なし |
| `/docs-update` | PR マージ済 |
| `/qa-regression` | スプリント内全 PR マージ済 |
| `/ops-deploy` | `/qa-regression` サインオフ済 |

---

## 記号

| 記号 | 意味 |
|---------|-------|
| `→` | 必須フロー — 必ず通過 |
| `-.->` | オプション / 並列フロー |
| `↕` | ループ（戻ることができる） |
| 🌐 | Markdown 以外に **HTML コンパニオン** を生成 — インタラクティブレビュー成果物（ソート/フィルタ/チェックリストまたは JP↔VN バイリンガル）。ワンショット、コミットしない。`CLAUDE.md` の「Output Format Convention」セクション参照。 |

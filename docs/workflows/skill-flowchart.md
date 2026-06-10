# Skill Flowchart — Agentic Development Lifecycle

Sơ đồ quan hệ giữa 26 skills theo dòng chảy SDLC.

---

## Full SDLC Flow

```mermaid
flowchart TD
    %% ── Đầu vào ──
    JP([🇯🇵 Khách hàng JP])
    IDEA([💡 Ý tưởng / Vấn đề])
    LEGACY([🏚️ Codebase brownfield<br/>take-over / legacy])

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
    subgraph ARCH ["🏛️ Architecture (xuyên suốt)"]
        ARCH_REV["/arch-review\nTech Lead"]
        ADR["/arch-adr\nTech Lead"]
    end

    %% ── Dev per Issue ──
    subgraph DEV ["💻 Dev Cycle — per issue"]
        RISK["🔵 Risk Classifier\ndocs/risk-classifier.md"]
        ANALYZE["/dev-analyze 🌐\nDev"]
        IMPLEMENT["/dev-implement\nDev"]
        VERIFY["✅ Verification Gate\nUser reports test results"]
        HARNESS["📝 Harness Delta\ndocs/improvement-backlog.md"]
        DEBUG["/dev-debug\nDev"]
        DEVREVIEW["/dev-review\nDev · Tech Lead"]
        PR["/dev-pr\nDev"]
    end

    %% ── QA ──
    subgraph QA ["🧪 QA Cycle"]
        TESTPLAN["/qa-testplan 🌐\nQA"]
        BUGR["/qa-bug\nQA"]
        REGRESSION["/qa-regression 🌐\nQA"]
    end

    %% ── Sprint Ops ──
    subgraph SPRINT ["📊 Sprint Ops (lặp lại)"]
        STANDUP["/sm-standup\ndaily"]
        STATUS["/pm-status 🌐\nper sprint"]
        RETRO["/sm-retro\nsprint end"]
    end

    %% ── Release ──
    subgraph REL ["🚀 Release"]
        DEPLOY["/ops-deploy\nDevOps"]
        INCIDENT["/ops-incident\nDevOps"]
    end

    %% ── Post-merge ──
    DOCS["/docs-update\nDev · QA"]

    %% ════════════════════════════
    %% FLOWS
    %% ════════════════════════════

    %% Entry
    JP --> BRIDGE
    IDEA --> IDEATE
    LEGACY --> REVERSE

    %% Discovery → Planning
    BRIDGE -->|"spec VN + 設計書 JP"| SPEC
    IDEATE --> SPEC
    REVERSE --> BASELINE
    BASELINE -.->|"context cho feature mới"| SPEC
    BASELINE -.->|"review JP nếu khách take-over"| BRIDGE
    SPEC --> STORY
    STORY --> BREAKDOWN
    BREAKDOWN --> ISSUES

    %% Planning → QA (parallel với Dev)
    SPEC -.->|"song song với Dev"| TESTPLAN

    %% Planning → Architecture
    BREAKDOWN -.->|"design phức tạp"| ARCH_REV

    %% Issues → Dev
    ISSUES --> RISK
    RISK -->|"tiny: patch direct"| PR
    RISK -->|"high-risk: stop + senior confirm"| ANALYZE
    RISK -->|"normal lane"| ANALYZE
    ANALYZE -->|"analysis.md — hard stop"| IMPLEMENT

    %% Dev loop
    IMPLEMENT -->|"bug"| DEBUG
    DEBUG --> IMPLEMENT

    %% Verification
    IMPLEMENT -->|"diff + self-test steps"| VERIFY
    VERIFY -->|"verification.md"| HARNESS
    HARNESS -->|"hard stop"| DEVREVIEW

    %% Pre-merge
    DEVREVIEW -->|"blocking issues"| IMPLEMENT
    DEVREVIEW --> PR

    %% Post-merge
    PR --> DOCS

    %% Architecture decisions
    ARCH_REV --> ADR
    ADR -.->|"update design"| ARCH_REV
    IMPLEMENT -.->|"quyết định lớn"| ADR
    PR -.->|"breaking change"| ARCH_REV

    %% QA loop
    TESTPLAN --> BUGR
    BUGR -->|"reproduce"| DEBUG
    BUGR -.->|"verified fix"| TESTPLAN

    %% Pre-release
    PR -->|"end of sprint"| REGRESSION
    REGRESSION --> DEPLOY
    DEPLOY -->|"sự cố"| INCIDENT

    %% Sprint Ops (running parallel)
    STANDUP -.->|"sprint end"| RETRO
    STANDUP -.->|"weekly/on-demand"| STATUS
```

---

## Luồng chính theo role

### Bridge Engineer — JP Outsource Entry
```
JP Client → /be-bridge → /ba-spec (VN) + 設計書 (JP)
```

### Brownfield Onboarding — Take-over codebase legacy
```
Legacy codebase → /ba-reverse → docs/baseline/codebase-overview.md
                              → [optional /be-bridge review JP]
                              → /ba-spec (cho feature mới có context)
```

### PM / BA — Discovery → Planning
```
/pm-ideate → /ba-spec → /ba-user-story → /pm-breakdown → Issues
```

### Dev — Per Issue
```
Issue → Risk Classifier (tiny/normal/high-risk)
    [normal] → /dev-analyze → [review analysis.md]
                    → /dev-implement → [report test results → verification.md]
                    → [harness delta check]
                    → /dev-review → /dev-pr → /docs-update
                         ↕ (bug)
                     /dev-debug
    [tiny]  → patch direct
    [high-risk] → senior confirm → /dev-analyze → ...
```

### QA — Parallel với Dev
```
/ba-spec ──→ /qa-testplan ──→ testing
                                 ↓ (bug found)
                             /qa-bug → /dev-debug → retest
                                 ↓ (pre-release)
                            /qa-regression → /ops-deploy
```

### Architecture — Xuyên suốt sprint
```
/arch-review ←──→ /arch-adr
     ↑                 ↑
Planning          Dev decisions
```

### Sprint Ops — Scrum rituals
```
/sm-standup (daily) ──→ /sm-retro (sprint end)
                    ──→ /pm-status (on-demand)
```

---

## Gate dependencies

| Skill | Yêu cầu trước khi chạy |
|-------|------------------------|
| `/ba-user-story` | `/ba-spec` đã done |
| `/pm-breakdown` | `/ba-user-story` hoặc User Stories đã có |
| `/dev-analyze` | Risk Classifier đã chạy (xem `docs/risk-classifier.md`) + Issue/task rõ ràng (AC defined) |
| `/dev-implement` | `docs/tasks/[ID]/analysis.md` đã tồn tại |
| `/dev-review` | `/dev-implement` Bước 5 done + `verification.md` saved + Harness Delta check done |
| `/dev-pr` | `/dev-review` Approve + không có blocking issues |
| `/docs-update` | PR đã merge |
| `/qa-regression` | Tất cả PR của sprint đã merge |
| `/ops-deploy` | `/qa-regression` đã sign-off |

---

## Ký hiệu

| Ký hiệu | Nghĩa |
|---------|-------|
| `→` | Luồng bắt buộc — phải đi qua |
| `-.->` | Luồng tùy chọn / parallel |
| `↕` | Loop (có thể quay lại) |
| 🌐 | Skill có **HTML companion** ngoài Markdown — interactive review artifact (sort/filter/checklist hoặc song ngữ JP↔VN). One-shot, không commit. Xem `CLAUDE.md` section "Output Format Convention". |

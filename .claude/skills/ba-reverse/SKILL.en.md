---
name: ba-reverse
description: >
  Reverse engineer brownfield codebases (legacy/take-over from previous vendor) into baseline
  documentation: business overview, tech stack, package inventory, key APIs, technical debt.
  Trigger when: user says "reverse engineer codebase", "onboard codebase legacy", "phân tích codebase cũ",
  "take-over từ vendor", "tạo codemap", "brownfield analysis", or types /ba-reverse.
---

# Skill: /ba-reverse
**Role**: Business Analyst / Tech Lead  
**Purpose**: Onboard brownfield codebases (legacy or take-over from previous vendor) — generate baseline documentation so the VN team has context before taking on maintenance or new features.

**When to use**:
- JP client takes over a project from another vendor → need to understand the codebase before committing to estimates
- VN team inherits a legacy codebase with no docs
- Audit an old codebase before deciding to refactor / rebuild

**When NOT to use**: Greenfield projects (use `/ba-spec` from scratch).

---

## Execution Guide

### Step 1 — Gate: Determine reverse engineering scope

```
AskUserQuestion({
  questions: [
    {
      question: "What is the goal of the reverse engineering?",
      header: "Goal",
      multiSelect: false,
      options: [
        { label: "Full take-over", description: "Preparing to take on maintenance — need to understand everything" },
        { label: "Estimate new scope", description: "Only need an overview to estimate a new feature — no deep-dive" },
        { label: "Audit refactor", description: "Assess technical debt to decide on refactor/rebuild" }
      ]
    },
    {
      question: "Codebase scope?",
      header: "Scope",
      multiSelect: false,
      options: [
        { label: "Entire repo", description: "Scan all packages/modules" },
        { label: "Specific subset", description: "User specifies path/module" },
        { label: "Single service", description: "Only 1 service in a monorepo" }
      ]
    }
  ]
})
```

**Wait for confirmation.**

### Step 2 — Spawn subagent to scan (avoid bloating main context)

Use the **Explore subagent** (read-only, fast) to survey in parallel:

```
Agent({
  description: "Codebase scout for reverse engineering",
  subagent_type: "Explore",
  prompt: "Scan codebase at [scope]. Find and report in the following structure:
    1. Languages + frameworks (read package.json/pom.xml/requirements.txt/go.mod...)
    2. Top-level package structure (max 3 levels deep)
    3. Entry points (main, server start, CLI)
    4. Database schemas (migrations folder, ORM models)
    5. External integrations (API clients, SDK imports)
    6. Test coverage signals (test folder size, CI config)
    7. Code quality red flags (TODO/FIXME density, file size outliers)
  Report under 600 words, include file path:line for each important finding."
})
```

### Step 3 — Gate: Present findings + confirm deep-dive direction

```
## I have scanned the codebase. Initial findings:

**Tech stack**: [...]
**Architecture pattern**: [Monolith / Microservices / Modular monolith]
**Entry points**: [...]
**Red flags detected**: [Top 3 technical debt items — file:line]

## Before generating baseline documentation, I need to confirm:
```

```
AskUserQuestion({
  questions: [
    {
      question: "Detail level of the codemap?",
      header: "Depth",
      multiSelect: false,
      options: [
        { label: "Overview (1 page)", description: "Architecture diagram + tech stack — sufficient for estimation" },
        { label: "Standard (5-10 pages)", description: "+ package inventory + API list + DB schema — sufficient for take-over" },
        { label: "Deep (20+ pages)", description: "+ data flow + business rules inferred from code — sufficient for rebuild" }
      ]
    },
    {
      question: "Output language?",
      header: "Lang",
      multiSelect: false,
      options: [
        { label: "Vietnamese", description: "For the VN team" },
        { label: "Bilingual VN-JP", description: "JP client will review — needs `/be-bridge` review afterward" },
        { label: "English", description: "For a mixed team" }
      ]
    }
  ]
})
```

**Wait for confirmation.**

### Step 4 — Generate baseline docs

Before writing any files, grab the current baseline commit:

```bash
git log -1 --format="%h %s"   # short-sha + commit message
```

Use the result to fill in `generatedFrom` (short-sha) and `generatedAt` (JST timestamp at the time the skill runs).

Create the `docs/baseline/` folder (if it doesn't exist) and write:

**`docs/baseline/codebase-overview.md`** — always create:
```markdown
---
generatedAt: [YYYY-MM-DD HH:mm JST]
generatedFrom: [short-sha]
scope: [path scanned]
---

# Codebase Overview — [Project Name]

## 1. Business Context (inferred from code)
[Describe what the app does, based on route names + DB tables + UI labels]

## 2. Tech Stack
| Layer | Technology | Version | Notes |

## 3. Architecture
[ASCII/Mermaid diagram + 1 paragraph description]

## 4. Package Inventory
[Top 10 most important packages + 1-line description each]

## 5. Entry Points
[How the app starts — main file, server start, CLI commands]

## 6. External Integrations
[External APIs/SDKs/MQ the code calls]

## 7. Database
[Schema overview — main tables, relationships]

## 8. Code Quality Assessment
- **Test coverage signal**: [folder size ratio, CI badge if any]
- **Technical debt** (top 5 hotspots — file:line + reason)
- **Security red flags** (hardcoded secrets, outdated deps — only flag, do not fix)

## 9. Unknown / Needs clarification from client
- [Q1: Is there an original spec?]
- [Q2: What is the business purpose of Module X?]
```

**Optional** (if Standard/Deep depth):
- `docs/baseline/api-inventory.md` — list endpoints + origin in code
- `docs/baseline/db-schema.md` — tables + relationships

**Audit**: append an entry to `docs/baseline/audit.md` (template: `templates/audit.en.md`).

### Step 5 — Final Gate: Review + handoff

```
## Baseline docs created:
- docs/baseline/codebase-overview.md ([N] sections)
- [other files if any]

**Notable findings for client/PM awareness**:
1. [Top finding 1 — e.g., 30% of code has no tests]
2. [Top finding 2 — e.g., using a framework EOL since 2022]
3. [Top finding 3 — e.g., 15 undocumented endpoints]

## Next steps:
- If **Take-over**: use `/be-bridge` to review docs + format in JP before sending to client
- If **Estimate new scope**: use `/ba-spec` with context from codebase-overview.md
- If **Audit refactor**: use `/arch-adr` to document the refactor/rebuild decision
```

---

## Important Notes

- **Do not** infer business rules without evidence in the code → mark `[?]` and add to the "Unknown" section
- **Do not fix anything** in this skill — only document. Fixing is the job of `/dev-implement` or a separate refactor task
- **Do not expose secrets** even if found — only flag "hardcoded credential at file:line" without pasting content
- **Always use the Explore subagent** for scanning — do not scan in the main context to avoid token bloat
- **Output to `docs/baseline/`** — distinct from `docs/screens/` (screen baseline) and `docs/api/` (API baseline for new features)
- **Re-run after N months**: if the codebase changes significantly, append section `## Drift since [date] · commit=[short-sha]` instead of overwriting. Update frontmatter:
  ```yaml
  generatedAt: [original date]
  generatedFrom: [original short-sha]
  updatedAt: [YYYY-MM-DD HH:mm JST]
  updatedCommit: [new short-sha]
  ```

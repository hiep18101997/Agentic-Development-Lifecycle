# CLAUDE.md — Developer Lite

Minimal skill set for individual developers and small teams. Covers the full dev cycle without PM/BA/QA/Ops overhead.

---

## Skills

| Command | Purpose |
|---------|---------|
| `/dev:analyze` | Analyze task → 2-3 implementation options with trade-offs |
| `/dev:implement` | Implement code file-by-file with gates (TDD lane opt-in) |
| `/dev:review` | Review code: quality + architecture + performance + security (4 lenses) |
| `/dev:pr` | Generate PR description from diff + verification results |
| `/dev:debug` | Systematic debug: reproduce → localize → fix → guard |
| `/sec:review` | Security review before merge (OWASP Top 10, 3-tier checklist) |
| `/arch:adr` | Document architecture decisions (Architecture Decision Record) |
| `/docs:update` | Update baseline screen/API docs after task verified and merged |

---

## Workflow

```
Task → /dev:analyze → choose option → /dev:implement → /dev:review → /dev:pr → merge
```

For bugs: `/dev:debug` → fix → `/dev:review` → `/dev:pr`
For design decisions surfaced during review: `/arch:adr`
After merge: `/docs:update`

---

## Core Principles

1. **Human Gate**: Always present results → ask → wait for confirm. Never auto-proceed.
2. **Multiple Options**: Always offer 2-3 options with trade-offs. Never only one solution.
3. **File-by-file**: `/dev:implement` confirms each file before moving to the next.
4. **Review first**: `/dev:review` must pass before `/dev:pr`.

---

## Task Docs

Per-task files live in `docs/tasks/[TASK-ID]/`:
- `analysis.md` — chosen approach + rejected options
- `verification.md` — self-test results + AC coverage sign-off

---

## Gate Patterns

### AskUserQuestion Tool — required for multi-choice gates

Every gate with multiple options MUST use the `AskUserQuestion` tool — renders native TUI in Claude Code.

```
AskUserQuestion({
  questions: [{
    question: "...",
    header: "Label",      // max 12 chars
    multiSelect: false,
    options: [
      { label: "Option A", description: "Trade-off details" },
      { label: "Option B", description: "Trade-off details" },
    ]
  }]
})
```

### Ask First Gate (sensitive changes)
Stop and ask senior/team before proceeding:
- Changes to authentication / authorization
- Breaking changes in public API
- Database migrations affecting existing data
- New storage of sensitive/PII data

---

## Upgrade to full framework

Want PM/BA/QA/Ops skills, JP-VN bridge, templates, workflows?

```bash
npx agentic-development-lifecycle --update --yes
```

Full framework adds 24+ skills covering the whole SDLC for cross-functional teams.

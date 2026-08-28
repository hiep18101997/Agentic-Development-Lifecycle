---
taskId: [TASK-ID]
lang: en
createdAt: [YYYY-MM-DD HH:mm JST]
---

# Audit Log — [TASK-ID]

_Append-only log: all user inputs verbatim + agent decisions with JST timestamps. Used to defend design decisions when JP clients ask months later ("Why this design?")._

**Difference from Q&A History in `requirements.md`**:
- Q&A History — only records BA clarification Q&A (one skill)
- Audit log — records EVERY skill run in this task (BA, Dev, QA, Arch...) + raw user input

**`hash` field** (optional, recommended when tamper-evidence is needed): SHA-256 digest of the diff + timestamp + agent name, generated via `node bin/audit-hash.js --diff <file> --agent <name> --timestamp <iso>` — used to detect if an entry was altered after it was recorded.

**`duration` field** (optional, self-reported in minutes, e.g. `12m`): time from the user invoking the skill to completing the final gate — used by the dashboard to compute average overhead per skill (the "Skill Benchmark" panel). Not required; if omitted, that skill is excluded from the benchmark.

---

## [YYYY-MM-DD HH:mm JST] · skill=`/ba-spec` · round=1 · commit=`[short-sha]`

**User input** (verbatim):
> [Paste exact text user said]

**Skill action**: [Stage name + one-line summary]
**Decision**: [Specific decision made, or reference to file]
**Artifact**: `docs/tasks/[TASK-ID]/requirements.md` — sections updated
**hash**: `[sha256 from node bin/audit-hash.js]`
**duration**: `12m`

---

## [YYYY-MM-DD HH:mm JST] · skill=`/dev-analyze` · agent=planner · commit=`[short-sha]`

**User input** (verbatim):
> [...]

**Skill action**: Spawned 3 subagents (task-reader, code-scout, planner)
**Decision**: User selected Option B (Redis cache) over Option A (in-memory) — reason: scale across pods
**Artifact**: `docs/tasks/[TASK-ID]/analysis.md`
**hash**: `[sha256 from node bin/audit-hash.js]`

---

<!-- Append new entries at the bottom. DO NOT edit existing entries. -->

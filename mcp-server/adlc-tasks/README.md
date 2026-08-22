# adlc-task-mcp (PoC)

Minimal, dependency-free MCP server exposing two **read-only** tools over ADLC's own conventions,
confirming a genuine gap: no open-source MCP server found in an August 2026 research sweep exposes
this exact tool pair against `docs/tasks/` + `docs/risk-classifier.md`.

## Tools

- **`get_task_status(taskId)`** — which `docs/tasks/{taskId}/` artifacts exist (requirements, analysis,
  test-plan, verification, review, pr-description, agent-state, audit), `agent-state.md` frontmatter,
  `review.md`'s verdict/blockingFindings, and the last `audit.md` entry. Never modifies anything.
- **`get_risk_classification({ taskId?, lang? })`** — the machine-readable R-01..R-10 checklist / input
  types / hard-trigger list parsed from `docs/risk-classifier.md` (or `.ja.md`), plus — if `taskId` is
  given — that task's already-recorded lane if one exists in its docs. **Does not compute a new
  classification** — that judgment stays with the human/LLM per `docs/risk-classifier.md`, same gate as
  everywhere else in ADLC.

## Why hand-rolled JSON-RPC instead of `@modelcontextprotocol/sdk`

This is a PoC meant to prove the tool pair is useful before committing to a dependency. It speaks the
MCP stdio transport directly (newline-delimited JSON-RPC 2.0: `initialize`, `notifications/initialized`,
`tools/list`, `tools/call`) with zero npm dependencies. If this proves useful in real use, migrating to
the official SDK is a reasonable, low-risk follow-up — the tool logic (`getTaskStatus`,
`getRiskClassification`) is already isolated from the transport in `server.js` and would port over as-is.

## Try it

```bash
cd mcp-server/adlc-tasks
npm test   # pure-logic tests against a fabricated temp repo, tests/-style
```

Manual smoke test against a real ADLC checkout (or any repo with `docs/tasks/` + `docs/risk-classifier.md`):

```bash
ADLC_REPO_ROOT=/path/to/your/project node server.js <<'EOF'
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}
{"jsonrpc":"2.0","method":"notifications/initialized"}
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_risk_classification","arguments":{}}}
EOF
```

## Register with an MCP client (untested against a live client — see caveat below)

Project-scope `.mcp.json`:

```json
{
  "mcpServers": {
    "adlc-tasks": {
      "command": "node",
      "args": ["mcp-server/adlc-tasks/server.js"],
      "env": { "ADLC_REPO_ROOT": "${workspaceFolder}" }
    }
  }
}
```

## Caveats (honest, not smoke-tested)

- Only the pure logic functions (`test.js`) are covered by an automated test. The stdio transport has
  been smoke-tested manually (piped JSON-RPC lines, see repo `CLAUDE.md`) but **not against a live MCP
  client** (Claude Code, OpenCode, ...) — register it and file an issue if the handshake misbehaves.
- `parseRiskClassifier` assumes `docs/risk-classifier.md`'s current table shape (`## Input Types`,
  `## Risk Checklist`, `## Hard High-Risk Triggers` headings with GFM tables/bullets below them). If
  that document's structure changes, this parser needs updating alongside it — there is no schema
  contract between them yet.
- `verify`/`review`/`pr` phase tooling, write tools, and any actual risk *computation* are explicitly out
  of scope — see the roadmap for why (`get_risk_classification` returning a computed lane would blur the
  line between "reference lookup" and "the LLM/human's judgment call", which is exactly the ambiguity
  ADLC's human-gate-first design avoids elsewhere).

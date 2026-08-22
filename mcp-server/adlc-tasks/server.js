#!/usr/bin/env node
'use strict';
/**
 * PoC MCP server for ADLC task tracking + risk-classification reference.
 *
 * Confirmed gap from the August 2026 research sweep: no open-source MCP server exposes a
 * `get_task_status` + `get_risk_classification` tool pair that reads ADLC's own docs/tasks/ and
 * docs/risk-classifier.md conventions (the closest match found, tradesdontlie/task-manager-mcp, has
 * neither). This is a minimal, dependency-free implementation of that pair — hand-rolled JSON-RPC 2.0
 * over stdio rather than the @modelcontextprotocol/sdk package, so this PoC adds zero new dependencies
 * to the framework. If this proves useful, migrating to the official SDK is a reasonable follow-up.
 *
 * BOTH TOOLS ARE READ-ONLY. Neither writes to disk, classifies a task's risk itself, nor replaces a
 * human/LLM judgment call:
 *   - get_task_status        — reports which docs/tasks/{taskId}/ artifacts exist + agent-state.md
 *                               frontmatter + last audit.md entry. A status report, not a state mutation.
 *   - get_risk_classification — returns the machine-readable R-01..R-10 checklist/lane reference from
 *                               docs/risk-classifier.md, and (if taskId given) an already-recorded lane
 *                               if one exists in that task's docs. It does NOT compute a new
 *                               classification — see docs/risk-classifier.md, same gate everywhere else
 *                               in ADLC.
 *
 * NOT YET DONE / NOT SMOKE-TESTED: this has not been run against a live MCP client (Claude Code,
 * OpenCode, ...) — only the pure logic functions are covered by mcp-server/adlc-tasks/test.js. Wiring
 * this into a project's `.mcp.json` and confirming a real client can call these tools is a follow-up.
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

function readFileIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

function parseFrontmatter(content) {
  if (!content) return null;
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) frontmatter[kv[1]] = kv[2].trim();
  }
  return frontmatter;
}

// audit.md entries are separated by "## [timestamp] · skill=..." headers (templates/audit.md).
function lastAuditEntry(content) {
  if (!content) return null;
  const entries = content.split(/\r?\n## /).slice(1);
  if (!entries.length) return null;
  const last = `## ${entries[entries.length - 1]}`;
  return last.split(/\r?\n---\r?\n/)[0].trim();
}

const TASK_FILES = {
  requirements: 'requirements.md',
  analysis: 'analysis.md',
  testPlan: 'test-plan.md',
  verification: 'verification.md',
  review: 'review.md',
  prDescription: 'pr-description.md',
  agentState: 'agent-state.md',
  audit: 'audit.md',
};

function getTaskStatus(taskId, repoRoot) {
  if (!taskId) throw new Error('taskId is required');
  const taskDir = path.join(repoRoot, 'docs', 'tasks', taskId);
  if (!fs.existsSync(taskDir)) {
    return { taskId, exists: false, note: `No docs/tasks/${taskId}/ directory found.` };
  }

  const artifacts = {};
  for (const [key, filename] of Object.entries(TASK_FILES)) {
    artifacts[key] = fs.existsSync(path.join(taskDir, filename));
  }

  const agentState = parseFrontmatter(readFileIfExists(path.join(taskDir, 'agent-state.md')));
  const review = parseFrontmatter(readFileIfExists(path.join(taskDir, 'review.md')));

  return {
    taskId,
    exists: true,
    artifacts,
    agentState: agentState || null,
    reviewVerdict: review ? { verdict: review.verdict || null, blockingFindings: review.blockingFindings || null } : null,
    lastAuditEntry: lastAuditEntry(readFileIfExists(path.join(taskDir, 'audit.md'))),
  };
}

// Parses the GFM tables in docs/risk-classifier(.ja).md into structured data. Table shape is assumed
// stable (see docs/risk-classifier.md "Input Types" / "Risk Checklist" / "Hard High-Risk Triggers")
// — if that doc's headings or table shape change, this parser needs updating alongside it.
function parseRiskClassifier(repoRoot, lang) {
  const file = path.join(repoRoot, 'docs', lang === 'ja' ? 'risk-classifier.ja.md' : 'risk-classifier.md');
  const content = readFileIfExists(file);
  if (!content) return null;

  const inputTypes = [];
  const checklist = [];
  const hardTriggers = [];
  let section = null;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (/^## /.test(line)) {
      if (/Input Types/i.test(line)) section = 'inputTypes';
      else if (/Risk Checklist/i.test(line)) section = 'checklist';
      else if (/Hard High-Risk Triggers|Hard Trigger/i.test(line)) section = 'hardTriggers';
      else section = null;
      continue;
    }
    if (section === 'inputTypes' && /^\|/.test(line) && /\*\*/.test(line)) {
      const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 2) inputTypes.push({ code: cols[0].replace(/\*\*/g, ''), description: cols[1] });
    }
    if (section === 'checklist' && /^\|\s*R-\d\d/.test(line)) {
      const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 3) checklist.push({ id: cols[0], question: cols[1], effect: cols[2] });
    }
    if (section === 'hardTriggers' && /^[-*]\s+/.test(line)) {
      hardTriggers.push(line.replace(/^[-*]\s+/, ''));
    }
  }

  return { inputTypes, checklist, hardTriggers, sourceFile: path.relative(repoRoot, file) };
}

function getRiskClassification({ taskId, lang } = {}, repoRoot) {
  const referenceChecklist = parseRiskClassifier(repoRoot, lang);
  let recordedClassification = null;

  if (taskId) {
    const taskDir = path.join(repoRoot, 'docs', 'tasks', taskId);
    for (const filename of ['requirements.md', 'analysis.md', 'agent-state.md']) {
      const content = readFileIfExists(path.join(taskDir, filename));
      if (!content) continue;
      const laneMatch = content.match(/\*\*Lane\*\*:\s*(tiny|normal|high-risk)/i)
        || content.match(/riskLane:\s*(tiny|normal|high-risk)/i);
      if (laneMatch) { recordedClassification = { lane: laneMatch[1].toLowerCase(), source: filename }; break; }
    }
  }

  return {
    taskId: taskId || null,
    recordedClassification,
    referenceChecklist,
    note: "Read-only reference + lookup. This tool does NOT compute a new risk classification — that " +
      'judgment call belongs to the human/LLM applying docs/risk-classifier.md, same as every other ADLC gate.',
  };
}

const TOOLS = [
  {
    name: 'get_task_status',
    description: 'Read-only. Reports which docs/tasks/{taskId}/ artifacts exist (requirements, analysis, '
      + 'test-plan, verification, review, pr-description, agent-state, audit), agent-state.md frontmatter, '
      + "review.md's verdict/blockingFindings, and the last audit.md entry. Never modifies anything.",
    inputSchema: {
      type: 'object',
      properties: { taskId: { type: 'string', description: 'Task ID, e.g. TASK-042' } },
      required: ['taskId'],
    },
  },
  {
    name: 'get_risk_classification',
    description: 'Read-only. Returns the machine-readable R-01..R-10 risk checklist, input types, and lane '
      + "definitions from docs/risk-classifier.md, plus (if taskId is given) that task's already-recorded "
      + 'lane if one exists. Does NOT compute a new classification.',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'Optional — look up an already-recorded lane for this task.' },
        lang: { type: 'string', enum: ['vi', 'ja'], description: 'Which risk-classifier variant to read (default vi).' },
      },
    },
  },
];

function handleToolCall(name, args, repoRoot) {
  if (name === 'get_task_status') return getTaskStatus(args && args.taskId, repoRoot);
  if (name === 'get_risk_classification') return getRiskClassification(args || {}, repoRoot);
  throw new Error(`Unknown tool: ${name}`);
}

function main() {
  const repoRoot = process.env.ADLC_REPO_ROOT ? path.resolve(process.env.ADLC_REPO_ROOT) : process.cwd();
  const rl = readline.createInterface({ input: process.stdin });

  const send = (message) => process.stdout.write(`${JSON.stringify(message)}\n`);

  rl.on('line', (line) => {
    if (!line.trim()) return;
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      return; // malformed line — not a valid JSON-RPC message, nothing sane to respond with
    }
    const { id, method, params } = message;

    if (method === 'initialize') {
      send({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'adlc-task-mcp', version: '0.1.0-poc' },
        },
      });
      return;
    }
    if (method === 'notifications/initialized') return; // notification — no response expected
    if (method === 'tools/list') {
      send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
      return;
    }
    if (method === 'tools/call') {
      try {
        const result = handleToolCall(params.name, params.arguments, repoRoot);
        send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] } });
      } catch (error) {
        send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: `Error: ${error.message}` }], isError: true } });
      }
      return;
    }
    if (id !== undefined) {
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown method: ${method}` } });
    }
  });
}

if (require.main === module) main();

module.exports = {
  TOOLS,
  getTaskStatus,
  getRiskClassification,
  parseRiskClassifier,
  parseFrontmatter,
  lastAuditEntry,
};

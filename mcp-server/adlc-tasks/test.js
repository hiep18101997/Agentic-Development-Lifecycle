#!/usr/bin/env node
// Tests the pure logic functions directly (not the stdio JSON-RPC transport) against a temp repo
// root fabricated to look like a real ADLC checkout, so this fails loudly if docs/risk-classifier.md's
// table shape drifts from what the parser expects.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { getTaskStatus, getRiskClassification, parseRiskClassifier, lastAuditEntry, isValidTaskId } = require('./server');

const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'adlc-task-mcp-'));

// --- get_task_status: no task dir yet ---
let status = getTaskStatus('TASK-404', repoRoot);
assert.strictEqual(status.exists, false, 'a task with no docs/tasks/ dir must report exists: false');

// --- get_task_status: partial artifacts + agent-state frontmatter + audit entries ---
const taskId = 'TASK-MCP-POC';
const taskDir = path.join(repoRoot, 'docs', 'tasks', taskId);
fs.mkdirSync(taskDir, { recursive: true });
fs.writeFileSync(path.join(taskDir, 'requirements.md'), '# Requirements\n**Lane**: normal\n');
fs.writeFileSync(path.join(taskDir, 'agent-state.md'), [
  '---',
  `taskId: ${taskId}`,
  'status: implementing',
  'iteration: 2',
  'iterationBudget: 3',
  '---',
  '',
  '# state',
  '',
].join('\n'));
fs.writeFileSync(path.join(taskDir, 'audit.md'), [
  '# Audit Log',
  '',
  '---',
  '',
  '## 2026-08-01 10:00 JST · skill=`/ba:spec` · round=1',
  '**Decision**: Approved requirements.',
  '',
  '---',
  '',
  '## 2026-08-02 11:00 JST · skill=`/dev:analyze` · agent=planner',
  '**Decision**: Chose option B.',
  '',
].join('\n'));

status = getTaskStatus(taskId, repoRoot);
assert.strictEqual(status.exists, true);
assert.strictEqual(status.artifacts.requirements, true);
assert.strictEqual(status.artifacts.analysis, false, 'analysis.md was never created for this fixture');
assert.strictEqual(status.artifacts.review, false);
assert.deepStrictEqual(status.agentState, { taskId, status: 'implementing', iteration: '2', iterationBudget: '3' });
assert(status.lastAuditEntry.includes('dev:analyze'), 'must return the LAST audit entry, not the first');
assert(!status.lastAuditEntry.includes('ba:spec'), 'the earlier entry must not leak into "last entry"');

// --- get_risk_classification: reference-only (no docs/risk-classifier.md in this temp repo) ---
let risk = getRiskClassification({}, repoRoot);
assert.strictEqual(risk.referenceChecklist, null, 'no risk-classifier.md in this temp repo -> null reference, not a crash');
assert.strictEqual(risk.recordedClassification, null);

// --- get_risk_classification: parse a fabricated risk-classifier.md with the real table shape ---
fs.mkdirSync(path.join(repoRoot, 'docs'), { recursive: true });
fs.writeFileSync(path.join(repoRoot, 'docs', 'risk-classifier.md'), [
  '# Risk Classifier',
  '',
  '## Input Types',
  '',
  '| Loại | Mô tả | Ví dụ |',
  '|------|-------|-------|',
  '| **new-spec** | Spec mới | Requirement JP mới |',
  '',
  '## Risk Checklist (10 items)',
  '',
  '| # | Câu hỏi | Nếu YES → tăng risk |',
  '|---|---------|---------------------|',
  '| R-01 | Task thay đổi authentication? | +high |',
  '| R-06 | Task ảnh hưởng shared infrastructure? | +normal |',
  '',
  '## Hard High-Risk Triggers',
  '',
  '- Thay đổi authentication / authorization logic',
  '- Tích hợp external payment provider',
  '',
].join('\n'));

const reference = parseRiskClassifier(repoRoot, 'vi');
assert.strictEqual(reference.inputTypes.length, 1);
assert.strictEqual(reference.inputTypes[0].code, 'new-spec');
assert.strictEqual(reference.checklist.length, 2);
assert.strictEqual(reference.checklist[0].id, 'R-01');
assert.strictEqual(reference.checklist[0].effect, '+high');
assert.strictEqual(reference.hardTriggers.length, 2);

risk = getRiskClassification({ taskId }, repoRoot);
assert(risk.referenceChecklist, 'reference checklist must now be populated');
assert.deepStrictEqual(risk.recordedClassification, { lane: 'normal', source: 'requirements.md' },
  "must find the task's already-recorded '**Lane**: normal' from requirements.md");
assert(/does NOT compute/.test(risk.note), 'the honesty disclaimer must always be present');

// --- isValidTaskId: path-traversal / injection guard (regression for the fix landed this session) ---
// Non-empty malicious taskIds must be rejected by isValidTaskId() and by both call sites' guard.
const badTaskIds = [
  '../../../../etc/passwd',
  '..\\..\\windows\\win.ini',
  'TASK-001/../../secret',
  '/etc/passwd',
  'TASK-001\0',
  'TASK-001\nX-Injected: 1',
  'a'.repeat(101),
];
for (const bad of badTaskIds) {
  assert.strictEqual(isValidTaskId(bad), false, `isValidTaskId must reject ${JSON.stringify(bad)}`);
  assert.throws(() => getTaskStatus(bad, repoRoot), /Invalid taskId/, `getTaskStatus must reject ${JSON.stringify(bad)}`);
  assert.throws(() => getRiskClassification({ taskId: bad }, repoRoot), /Invalid taskId/, `getRiskClassification must reject ${JSON.stringify(bad)}`);
}
// Empty string is falsy: isValidTaskId('') is false, but both call sites treat a falsy taskId as
// "not provided" (pre-existing behavior, unrelated to this fix) rather than "invalid" — getTaskStatus
// throws its own separate "taskId is required" error, getRiskClassification silently omits the
// task-specific lookup. Verify both, distinctly from the malicious-input rejection above.
assert.strictEqual(isValidTaskId(''), false, 'isValidTaskId must reject empty string');
assert.throws(() => getTaskStatus('', repoRoot), /taskId is required/, 'getTaskStatus must reject empty taskId (pre-existing required-field check)');
assert.doesNotThrow(() => getRiskClassification({ taskId: '' }, repoRoot), 'getRiskClassification treats falsy taskId as "not provided", not an error');
const goodTaskIds = ['TASK-042', 'TASK-MCP-POC', 'a', 'A1-b2-C3'];
for (const good of goodTaskIds) {
  assert.strictEqual(isValidTaskId(good), true, `isValidTaskId must accept ${JSON.stringify(good)}`);
}

console.log('adlc-task-mcp tests: get_task_status (artifacts/agent-state/audit) and get_risk_classification (reference parse + recorded lookup) passed.');

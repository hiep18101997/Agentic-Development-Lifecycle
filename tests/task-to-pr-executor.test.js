#!/usr/bin/env node
// Exercises the task-to-pr-executor PoC across its declared scope: spec -> analyze -> implement.
// Simulates a real task folder in a temp dir rather than mocking the manifest, so this test fails
// loudly if the PoC and the real docs/workflows/task-to-pr.v1.json drift.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  SCOPE_PHASES,
  loadManifest,
  detectProducedArtifacts,
  computeStatus,
  writeCheckpoint,
} = require('../scripts/task-to-pr-executor');

const TASK_ID = 'TASK-EXEC-POC';
const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'adlc-task-to-pr-'));
const taskDir = path.join(repoRoot, 'docs', 'tasks', TASK_ID);
fs.mkdirSync(taskDir, { recursive: true });

const manifest = loadManifest(); // loads + schema-validates the real repo manifest
assert.deepStrictEqual(SCOPE_PHASES, ['spec', 'analyze', 'implement'], 'PoC scope must match its documented header');

function statusFor(producedIds, satisfiedGateIds) {
  return computeStatus(manifest, {
    producedArtifacts: new Set(producedIds),
    satisfiedGates: new Set(satisfiedGateIds),
  });
}

// --- Step 0: nothing exists yet -- spec is current, blocked on producing requirements.md ---
let status = statusFor(detectProducedArtifacts(manifest, repoRoot, TASK_ID, {}), []);
assert.strictEqual(status.currentPhaseId, 'spec', 'with nothing on disk, spec must be the current phase');
const specPhase = status.phases.find((p) => p.id === 'spec');
assert(specPhase.blockedOn.some((r) => r.includes('/ba-spec')), 'spec must be blocked on running /ba-spec');
assert.strictEqual(status.scopeComplete, false);

// --- Step 1: requirements.md exists but its gate isn't confirmed yet ---
fs.writeFileSync(path.join(taskDir, 'requirements.md'), '# Requirements\n');
let produced = detectProducedArtifacts(manifest, repoRoot, TASK_ID, {});
assert(produced.has('requirements'), 'requirements.md on disk must be auto-detected as the requirements artifact');
status = statusFor(produced, []);
assert.strictEqual(status.currentPhaseId, 'spec', 'spec is not complete until its gate is confirmed');
assert(
  status.phases.find((p) => p.id === 'spec').blockedOn.some((r) => r.includes('confirm-gate') && r.includes('requirements_confirmed')),
  'spec must now be blocked specifically on confirming requirements_confirmed, not on producing the artifact again'
);

// --- Step 2: gate confirmed -- spec complete, analyze becomes current ---
status = statusFor(produced, ['requirements_confirmed']);
const specNow = status.phases.find((p) => p.id === 'spec');
assert.strictEqual(specNow.complete, true, 'spec must be complete once its output exists and its gate is confirmed');
assert.strictEqual(status.currentPhaseId, 'analyze', 'analyze must become current once spec is complete');

// --- Step 3: analyze produced + gated; implement now needs BOTH code_changes (git-diff) AND
// verification.md (markdown) -- confirms the executor handles a phase with 2 heterogeneous outputs ---
fs.writeFileSync(path.join(taskDir, 'analysis.md'), '# Analysis\n');
produced = detectProducedArtifacts(manifest, repoRoot, TASK_ID, {});
status = statusFor(produced, ['requirements_confirmed', 'analysis_confirmed']);
assert.strictEqual(status.currentPhaseId, 'implement', 'implement must become current once analyze is complete');
const implementPhase = status.phases.find((p) => p.id === 'implement');
assert(
  implementPhase.blockedOn.some((r) => r.includes('mark-produced') && r.includes('code_changes')),
  'the git-diff output (code_changes) cannot be auto-detected -- the executor must say so explicitly'
);
assert(
  implementPhase.blockedOn.some((r) => r.includes('/dev-implement') && r.includes('verification.md')),
  'the markdown output (verification) must also be flagged as missing until the file exists'
);

// --- Step 4: verification.md written, code_changes marked produced, gate confirmed -> scope complete ---
fs.writeFileSync(path.join(taskDir, 'verification.md'), '---\nsignOffStatus: Pass\n---\n');
produced = detectProducedArtifacts(manifest, repoRoot, TASK_ID, { manuallyMarkedProduced: ['code_changes'] });
assert(produced.has('verification'), 'verification.md on disk must be auto-detected');
status = statusFor(produced, [
  'requirements_confirmed',
  'analysis_confirmed',
  'implementation_verified',
]);
assert.strictEqual(status.scopeComplete, true, 'spec -> analyze -> implement should be complete once all 3 phases satisfy outputs + gates');

// --- Checkpoint: written into a real agent-state.md, idempotently re-writable ---
const agentStatePath = path.join(taskDir, 'agent-state.md');
fs.writeFileSync(agentStatePath, [
  '---',
  `taskId: ${TASK_ID}`,
  'status: implementing',
  'iteration: 1',
  'iterationBudget: 3',
  'lastUpdated: 2026-08-22T00:00:00+09:00',
  '---',
  '',
  `# Agent state: ${TASK_ID}`,
  '',
  '## Objective và Acceptance Criteria',
  '- [ ] AC-001: ...',
  '',
].join('\n'));

const firstWrite = writeCheckpoint(repoRoot, TASK_ID, status);
assert.strictEqual(firstWrite, agentStatePath);
const afterFirst = fs.readFileSync(agentStatePath, 'utf8');
assert(afterFirst.includes('Workflow manifest state'), 'checkpoint block must be appended to agent-state.md');
assert(afterFirst.includes('## Objective và Acceptance Criteria'), 'checkpoint must not clobber the existing hand-written sections');

writeCheckpoint(repoRoot, TASK_ID, status); // re-run to prove idempotent in-place replace, not duplication
const afterSecond = fs.readFileSync(agentStatePath, 'utf8');
const occurrences = afterSecond.split('Workflow manifest state').length - 1;
assert.strictEqual(occurrences, 1, 'writing the checkpoint twice must replace the block in place, not append a second copy');

console.log('task-to-pr-executor tests: spec -> analyze -> implement PoC scope (incl. 2-output implement phase), gate/artifact detection, and checkpoint write/idempotency passed.');

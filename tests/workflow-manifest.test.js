#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { validateManifest } = require('../scripts/validate-workflow-manifest');

const fixtureFile = path.join(__dirname, 'fixtures', 'workflow-manifest', 'cases.json');
const fixture = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'));
const sourceFile = path.resolve(path.dirname(fixtureFile), fixture.valid.source);
const canonical = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

const validErrors = validateManifest(canonical);
assert.deepStrictEqual(validErrors, [], `canonical manifest should be valid:\n${validErrors.join('\n')}`);

function targetAt(object, dottedPath) {
  const parts = dottedPath.split('.');
  const key = parts.pop();
  let target = object;
  for (const part of parts) target = target[part];
  return { target, key };
}

for (const testCase of fixture.invalid) {
  const candidate = JSON.parse(JSON.stringify(canonical));
  if (testCase.operation === 'swapPhases') {
    const [left, right] = testCase.args;
    [candidate.phases[left], candidate.phases[right]] = [candidate.phases[right], candidate.phases[left]];
  } else if (testCase.operation === 'set') {
    const { target, key } = targetAt(candidate, testCase.path);
    target[key] = testCase.value;
  } else if (testCase.operation === 'delete') {
    const { target, key } = targetAt(candidate, testCase.path);
    delete target[key];
  } else {
    throw new Error(`Unknown fixture operation: ${testCase.operation}`);
  }

  const errors = validateManifest(candidate);
  assert(
    errors.some((error) => error.includes(testCase.expectedError)),
    `${testCase.name}: expected an error containing '${testCase.expectedError}', got:\n${errors.join('\n')}`
  );
}

console.log(`Workflow manifest tests: 1 valid and ${fixture.invalid.length} invalid fixtures passed.`);

// --- Fail + resume simulation ---
// No executor reads this manifest yet in production use beyond the PoC in scripts/task-to-pr-executor.js
// -- this simulation plays back a fail-then-pass sequence against phase.retry using a tiny in-memory
// stand-in for "an executor", to surface whether the schema's retry fields (strategy/preserveArtifacts/
// preserveAudit) actually carry enough information to implement retry correctly.
function simulateRetry(phase, attempts) {
  const state = { artifacts: [], audit: [], finalStatus: null };
  for (const attempt of attempts) {
    if (phase.retry.preserveArtifacts && attempt.artifact) state.artifacts.push(attempt.artifact);
    if (phase.retry.preserveAudit && attempt.auditEntry) state.audit.push(attempt.auditEntry);
    state.finalStatus = attempt.willFail ? 'retrying' : 'pass';
    if (!attempt.willFail) break;
  }
  return state;
}

const implementPhase = canonical.phases.find((phase) => phase.id === 'implement');
assert(implementPhase, 'canonical manifest must have an implement phase to simulate');
assert.strictEqual(
  implementPhase.retry.strategy,
  'new-attempt-same-phase',
  'implement phase must retry as a new attempt of the SAME phase, not restart the whole workflow'
);
assert.strictEqual(implementPhase.retry.preserveArtifacts, true, 'implement phase retry must preserve artifacts');
assert.strictEqual(implementPhase.retry.preserveAudit, true, 'implement phase retry must preserve audit');

const failThenPass = simulateRetry(implementPhase, [
  { willFail: true, artifact: 'attempt-1-diff', auditEntry: 'attempt 1: baseline check failed' },
  { willFail: false, artifact: 'attempt-2-diff', auditEntry: 'attempt 2: passed' },
]);
assert.strictEqual(failThenPass.finalStatus, 'pass', 'the second attempt should resolve the phase');
assert.deepStrictEqual(
  failThenPass.artifacts,
  ['attempt-1-diff', 'attempt-2-diff'],
  "preserveArtifacts=true means attempt 1's artifact must survive into attempt 2, not be discarded on retry"
);
assert.deepStrictEqual(
  failThenPass.audit,
  ['attempt 1: baseline check failed', 'attempt 2: passed'],
  "preserveAudit=true means attempt 1's audit entry must remain in history, not be overwritten by attempt 2"
);

// --- Review rounds are a DIFFERENT mechanism from retry: a fresh numbered file per round, not an
// overwrite-in-place retry of the same attempt. Simulate that a request-changes round accumulates
// review-log-R1.md, R2.md, ... rather than the retry-with-preserve semantics above.
function simulateReviewRounds(rounds) {
  const files = [];
  for (const round of rounds) {
    files.push({ path: `docs/tasks/T-1/review-log-R${round.number}.md`, verdict: round.verdict });
    if (round.verdict === 'approve' || round.verdict === 'approve-with-fixes') break;
  }
  return files;
}

const reviewPhase = canonical.phases.find((phase) => phase.id === 'review');
assert(reviewPhase.outputs[0].roundBased, 'review output must be roundBased');
const rounds = simulateReviewRounds([
  { number: 1, verdict: 'request-changes' },
  { number: 2, verdict: 'approve' },
]);
assert.strictEqual(rounds.length, 2, 'a request-changes round must not overwrite the prior round file');
assert.strictEqual(rounds[0].path, 'docs/tasks/T-1/review-log-R1.md');
assert.strictEqual(rounds[1].path, 'docs/tasks/T-1/review-log-R2.md');
assert.strictEqual(rounds[1].verdict, 'approve');

console.log('Workflow manifest tests: fail+resume retry simulation (implement) and review-round accumulation (review) passed.');

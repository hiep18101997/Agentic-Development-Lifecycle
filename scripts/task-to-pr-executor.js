#!/usr/bin/env node
/**
 * PoC executor for docs/workflows/task-to-pr.v1.json. Scope, deliberately: spec -> analyze -> implement
 * (the first 3 phases). review/pr are left to a follow-up once this PoC proves the approach -- review in
 * particular needs round-tracking (review-log-R{round}.md is roundBased, not a fixed filename) that this
 * PoC intentionally does not yet handle.
 *
 * WHAT THIS IS: a deterministic bookkeeping/state-machine tool. It reads the manifest, checks which
 * artifacts already exist on disk and which gates a human has explicitly confirmed, and reports the
 * current phase + exactly what's blocking the next one. It writes a checkpoint into
 * docs/tasks/{taskId}/agent-state.md so state survives across sessions.
 *
 * WHAT THIS IS NOT: an autonomous agent runner. It never invokes a skill, never calls an LLM, and never
 * marks a gate satisfied on its own -- a human (or a Claude/OpenCode/Codex session acting on a human's
 * behalf) must run `confirm-gate` explicitly after actually reviewing that gate's output. This is a
 * deliberate design choice to keep this human-gate-first while still giving the manifest's
 * phases/requires/outputs/gates/retry/transitions a real, testable runtime instead of only a validator.
 *
 * Gates and git-diff outputs cannot be detected by scanning the filesystem (a gate is a human decision;
 * a diff isn't a single file) -- those live in a small JSON sidecar, docs/tasks/{taskId}/.workflow-state.json.
 * Markdown artifacts ARE detected by file presence, so spec/analyze need no sidecar entry once their .md
 * file exists. implement's `verification` output is markdown (detected by presence); its `code_changes`
 * output is git-diff (needs `mark-produced`).
 *
 * CLI:
 *   node scripts/task-to-pr-executor.js status <taskId>
 *   node scripts/task-to-pr-executor.js confirm-gate <taskId> <gateName>
 *   node scripts/task-to-pr-executor.js mark-produced <taskId> <outputId>
 *   node scripts/task-to-pr-executor.js checkpoint <taskId>
 */
const fs = require('fs');
const path = require('path');
const { DEFAULT_MANIFEST, validateManifest } = require('./validate-workflow-manifest');

const SCOPE_PHASES = ['spec', 'analyze', 'implement']; // PoC scope -- see file header.

function resolvePath(template, taskId) {
  return template.replace('{taskId}', taskId);
}

function loadManifest(manifestFile = DEFAULT_MANIFEST) {
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8').replace(/^﻿/, ''));
  const errors = validateManifest(manifest);
  if (errors.length) {
    throw new Error(`Refusing to execute an invalid manifest:\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  }
  return manifest;
}

function workflowStatePath(repoRoot, taskId) {
  return path.join(repoRoot, 'docs', 'tasks', taskId, '.workflow-state.json');
}

function loadWorkflowState(repoRoot, taskId) {
  const file = workflowStatePath(repoRoot, taskId);
  if (!fs.existsSync(file)) return { satisfiedGates: [], manuallyMarkedProduced: [] };
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveWorkflowState(repoRoot, taskId, state) {
  const file = workflowStatePath(repoRoot, taskId);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`);
}

// Markdown outputs are detected by file presence. git-diff outputs (and any output a caller has
// explicitly recorded via `mark-produced`) come from workflowState.manuallyMarkedProduced. roundBased
// outputs are out of scope for this PoC (review isn't in SCOPE_PHASES) and are skipped rather than
// mis-detected against a literal "{round}" path.
function detectProducedArtifacts(manifest, repoRoot, taskId, workflowState) {
  const produced = new Set(workflowState.manuallyMarkedProduced || []);
  for (const phase of manifest.phases) {
    if (!SCOPE_PHASES.includes(phase.id)) continue;
    for (const output of phase.outputs) {
      if (output.kind === 'markdown' && !output.roundBased) {
        const file = path.join(repoRoot, resolvePath(output.path, taskId));
        if (fs.existsSync(file)) produced.add(output.id);
      }
    }
  }
  return produced;
}

// Pure function -- the state machine core, kept separate from filesystem/CLI concerns so it's cheap to
// unit test with fabricated producedArtifacts/satisfiedGates sets (see tests/task-to-pr-executor.test.js).
function computeStatus(manifest, { producedArtifacts, satisfiedGates }, scopePhases = SCOPE_PHASES) {
  const phases = manifest.phases.filter((phase) => scopePhases.includes(phase.id));
  const result = { phases: [], currentPhaseId: null, scopeComplete: false };

  for (const phase of phases) {
    const outputsProduced = phase.outputs.every((output) => producedArtifacts.has(output.id));
    const gatesSatisfied = phase.gates.after.every((gate) => satisfiedGates.has(gate));
    const complete = outputsProduced && gatesSatisfied;

    const blockedOn = [];
    if (!complete) {
      // Upstream prerequisites (this phase's `requires`) take priority -- no point telling someone to
      // run this phase's skill if a prior artifact/gate it depends on doesn't exist yet.
      for (const requirement of phase.requires) {
        if (requirement.startsWith('artifact:')) {
          const id = requirement.slice('artifact:'.length);
          if (!producedArtifacts.has(id)) blockedOn.push(`missing prerequisite artifact: ${id}`);
        } else if (requirement.startsWith('gate:')) {
          const id = requirement.slice('gate:'.length);
          if (!satisfiedGates.has(id)) blockedOn.push(`missing prerequisite gate: ${id}`);
        }
      }
      // Prerequisites are met (or this phase has none outstanding) -- show everything THIS phase still
      // needs to complete: missing output(s) and/or an unconfirmed gate, together, not one at a time.
      if (blockedOn.length === 0) {
        for (const output of phase.outputs) {
          if (!producedArtifacts.has(output.id)) {
            blockedOn.push(output.kind === 'markdown'
              ? `run /${phase.skill} to produce ${output.path.replace('{taskId}', '<taskId>')}`
              : `mark-produced <taskId> ${output.id} once it exists (git-diff output, not file-detectable)`);
          }
        }
        for (const gate of phase.gates.after) {
          if (!satisfiedGates.has(gate)) blockedOn.push(`confirm-gate <taskId> ${gate}`);
        }
      }
    }

    result.phases.push({ id: phase.id, skill: phase.skill, complete, blockedOn });
    if (!complete && result.currentPhaseId === null) result.currentPhaseId = phase.id;
  }

  result.scopeComplete = result.phases.every((p) => p.complete);
  return result;
}

function agentStateCheckpointBlock(taskId, status) {
  const lines = [
    '<!-- ADLC:TASK-TO-PR-EXECUTOR:START -->',
    '## Workflow manifest state (task-to-pr-executor PoC)',
    '',
    `- Manifest: docs/workflows/task-to-pr.v1.json (scope: ${SCOPE_PHASES.join(' -> ')})`,
    `- Current phase: ${status.currentPhaseId || '(scope complete)'}`,
    '',
    '| Phase | Complete | Blocked on |',
    '|---|---|---|',
    ...status.phases.map((p) => `| ${p.id} | ${p.complete ? '✅' : '⬜'} | ${p.blockedOn.join('; ') || '—'} |`),
    '',
    '_Written by `scripts/task-to-pr-executor.js checkpoint` -- a deterministic status snapshot, not a',
    'substitute for the Iteration log / Decisions / Next steps / Open questions sections above._',
    '<!-- ADLC:TASK-TO-PR-EXECUTOR:END -->',
  ];
  return lines.join('\n');
}

function writeCheckpoint(repoRoot, taskId, status) {
  const stateFile = path.join(repoRoot, 'docs', 'tasks', taskId, 'agent-state.md');
  const block = agentStateCheckpointBlock(taskId, status);
  if (!fs.existsSync(stateFile)) {
    throw new Error(`${stateFile} does not exist yet -- create it from docs/agent-harness.md first.`);
  }
  const existing = fs.readFileSync(stateFile, 'utf8');
  const startMarker = '<!-- ADLC:TASK-TO-PR-EXECUTOR:START -->';
  const endMarker = '<!-- ADLC:TASK-TO-PR-EXECUTOR:END -->';
  let updated;
  if (existing.includes(startMarker)) {
    const start = existing.indexOf(startMarker);
    const end = existing.indexOf(endMarker) + endMarker.length;
    updated = `${existing.slice(0, start)}${block}${existing.slice(end)}`;
  } else {
    updated = `${existing.trimEnd()}\n\n${block}\n`;
  }
  fs.writeFileSync(stateFile, updated);
  return stateFile;
}

function main() {
  const [, , command, taskId, extra] = process.argv;
  const repoRoot = path.resolve(__dirname, '..');
  if (!command || !taskId) {
    console.error('Usage: task-to-pr-executor.js <status|confirm-gate|mark-produced|checkpoint> <taskId> [extra]');
    process.exit(1);
  }

  const manifest = loadManifest();
  const workflowState = loadWorkflowState(repoRoot, taskId);

  if (command === 'confirm-gate') {
    if (!extra) { console.error('Usage: confirm-gate <taskId> <gateName>'); process.exit(1); }
    if (!workflowState.satisfiedGates.includes(extra)) workflowState.satisfiedGates.push(extra);
    saveWorkflowState(repoRoot, taskId, workflowState);
    console.log(`Gate '${extra}' confirmed for ${taskId}.`);
    return;
  }

  if (command === 'mark-produced') {
    if (!extra) { console.error('Usage: mark-produced <taskId> <outputId>'); process.exit(1); }
    workflowState.manuallyMarkedProduced = workflowState.manuallyMarkedProduced || [];
    if (!workflowState.manuallyMarkedProduced.includes(extra)) workflowState.manuallyMarkedProduced.push(extra);
    saveWorkflowState(repoRoot, taskId, workflowState);
    console.log(`Output '${extra}' marked produced for ${taskId}.`);
    return;
  }

  const producedArtifacts = detectProducedArtifacts(manifest, repoRoot, taskId, workflowState);
  const satisfiedGates = new Set(workflowState.satisfiedGates || []);
  const status = computeStatus(manifest, { producedArtifacts, satisfiedGates });

  if (command === 'status') {
    console.log(`Task ${taskId} — scope: ${SCOPE_PHASES.join(' -> ')}`);
    for (const phase of status.phases) {
      console.log(`  [${phase.complete ? 'x' : ' '}] ${phase.id} (${phase.skill})`);
      for (const reason of phase.blockedOn) console.log(`        - ${reason}`);
    }
    console.log(status.scopeComplete ? 'Scope complete.' : `Current phase: ${status.currentPhaseId}`);
    return;
  }

  if (command === 'checkpoint') {
    const file = writeCheckpoint(repoRoot, taskId, status);
    console.log(`Checkpoint written to ${file}`);
    return;
  }

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

if (require.main === module) main();

module.exports = {
  SCOPE_PHASES,
  loadManifest,
  detectProducedArtifacts,
  computeStatus,
  agentStateCheckpointBlock,
  writeCheckpoint,
  loadWorkflowState,
  saveWorkflowState,
};

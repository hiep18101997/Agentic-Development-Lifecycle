#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DEFAULT_MANIFEST = path.join(REPO_ROOT, 'docs', 'workflows', 'task-to-pr.v1.json');
const DEFAULT_SCHEMA = path.join(REPO_ROOT, 'docs', 'workflows', 'task-to-pr.schema.v1.json');
const PHASE_ORDER = ['spec', 'analyze', 'implement', 'review', 'pr'];
const RUNTIMES = ['claude-code', 'opencode', 'codex-cli'];
const SKILLS = {
  spec: 'ba-spec',
  analyze: 'dev-analyze',
  implement: 'dev-implement',
  review: 'dev-review',
  pr: 'dev-pr',
};
// Where each phase transitions to when its verdict is "request changes" / "changes required".
// review is the odd one out: fixing a blocking finding happens via dev-implement, not another
// dev-review attempt of the SAME round -- a rejected review loops back to implement, which then
// produces a fresh diff for the next review round. Every other phase loops back to itself.
const CHANGES_REQUESTED_TARGET = {
  spec: 'spec',
  analyze: 'analyze',
  implement: 'implement',
  review: 'implement',
  pr: 'pr',
};

function readJson(file, errors) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`);
    return null;
  }
}

function validateManifest(manifest) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    return ['manifest must be a JSON object'];
  }

  if (manifest.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (manifest.id !== 'task-to-pr') errors.push("id must be 'task-to-pr'");
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version || '')) {
    errors.push('version must use MAJOR.MINOR.PATCH');
  }
  if (manifest.artifactRoot !== 'docs/tasks/{taskId}') {
    errors.push("artifactRoot must be 'docs/tasks/{taskId}'");
  }

  if (!Array.isArray(manifest.runtimes)) {
    errors.push('runtimes must be an array');
  } else {
    for (const runtime of RUNTIMES) {
      if (!manifest.runtimes.includes(runtime)) errors.push(`runtimes must include ${runtime}`);
    }
    const unknown = manifest.runtimes.filter((runtime) => !RUNTIMES.includes(runtime));
    if (unknown.length) errors.push(`runtimes contains unsupported values: ${unknown.join(', ')}`);
  }

  if (!Array.isArray(manifest.phases)) {
    errors.push('phases must be an array');
    return errors;
  }

  const actualOrder = manifest.phases.map((phase) => phase && phase.id);
  if (JSON.stringify(actualOrder) !== JSON.stringify(PHASE_ORDER)) {
    errors.push(`phase order must be ${PHASE_ORDER.join(' -> ')}`);
  }

  const producedArtifacts = new Set();
  const completedGates = new Set();
  const outputIds = new Set();

  manifest.phases.forEach((phase, index) => {
    const location = `phases[${index}]`;
    if (!phase || typeof phase !== 'object' || Array.isArray(phase)) {
      errors.push(`${location} must be an object`);
      return;
    }

    if (SKILLS[phase.id] && phase.skill !== SKILLS[phase.id]) {
      errors.push(`${location}.skill must be ${SKILLS[phase.id]} for phase ${phase.id}`);
    }

    if (!Array.isArray(phase.requires)) {
      errors.push(`${location}.requires must be an array`);
    } else {
      for (const requirement of phase.requires) {
        if (requirement.startsWith('artifact:')) {
          const artifact = requirement.slice('artifact:'.length);
          if (!producedArtifacts.has(artifact)) {
            errors.push(`${location}: unresolved artifact prerequisite '${requirement}'`);
          }
        } else if (requirement.startsWith('gate:')) {
          const gate = requirement.slice('gate:'.length);
          if (!completedGates.has(gate)) {
            errors.push(`${location}: unresolved gate prerequisite '${requirement}'`);
          }
        } else if (!requirement.startsWith('input:')) {
          errors.push(`${location}: prerequisite '${requirement}' must use input:, artifact:, or gate:`);
        }
      }
    }

    if (!Array.isArray(phase.outputs) || phase.outputs.length === 0) {
      errors.push(`${location}.outputs must contain at least one output`);
    } else {
      for (const [outputIndex, output] of phase.outputs.entries()) {
        const outputLocation = `${location}.outputs[${outputIndex}]`;
        if (!output || typeof output !== 'object') {
          errors.push(`${outputLocation} must be an object`);
          continue;
        }
        if (!output.id || typeof output.id !== 'string') {
          errors.push(`${outputLocation}.id must be a non-empty string`);
        } else if (outputIds.has(output.id)) {
          errors.push(`${outputLocation}.id '${output.id}' is duplicated`);
        } else {
          outputIds.add(output.id);
          producedArtifacts.add(output.id);
        }
        if (!['markdown', 'git-diff'].includes(output.kind)) {
          errors.push(`${outputLocation}.kind must be markdown or git-diff`);
        }
        if (output.required !== true) errors.push(`${outputLocation}.required must be true`);
        if (output.versionControl !== 'task-branch') {
          errors.push(`${outputLocation}.versionControl must be task-branch`);
        }
        if (output.kind === 'markdown') {
          if (typeof output.path !== 'string' ||
              !output.path.startsWith('docs/tasks/{taskId}/') ||
              output.path.includes('..') ||
              path.posix.isAbsolute(output.path)) {
            errors.push(`${outputLocation}.path must stay under docs/tasks/{taskId}`);
          } else if (!output.path.endsWith('.md')) {
            errors.push(`${outputLocation}.path must be a Markdown file`);
          } else if (output.roundBased && !output.path.includes('{round}')) {
            errors.push(`${outputLocation}.path must include {round} when roundBased is true`);
          } else if (!output.roundBased && output.path.includes('{round}')) {
            errors.push(`${outputLocation}.path must not include {round} unless roundBased is true`);
          }
        } else if ('path' in output) {
          errors.push(`${outputLocation}.path must be omitted for git-diff outputs`);
        }
      }
    }

    if (!phase.gates || !Array.isArray(phase.gates.before) || !Array.isArray(phase.gates.after)) {
      errors.push(`${location}.gates must define before and after arrays`);
    } else {
      if (phase.gates.after.length === 0) errors.push(`${location}.gates.after must not be empty`);
      for (const gate of [...phase.gates.before, ...phase.gates.after]) {
        if (!gate || typeof gate !== 'string') errors.push(`${location}.gates contains an invalid gate`);
      }
      for (const gate of phase.gates.after) completedGates.add(gate);
    }

    if (!phase.runtimeSupport || typeof phase.runtimeSupport !== 'object') {
      errors.push(`${location}.runtimeSupport must be an object`);
    } else {
      for (const runtime of RUNTIMES) {
        if (phase.runtimeSupport[runtime] !== true) {
          errors.push(`${location}.runtimeSupport.${runtime} must be true`);
        }
      }
      const unknown = Object.keys(phase.runtimeSupport).filter((runtime) => !RUNTIMES.includes(runtime));
      if (unknown.length) errors.push(`${location}.runtimeSupport has unknown runtimes: ${unknown.join(', ')}`);
    }

    if (!phase.retry ||
        phase.retry.strategy !== 'new-attempt-same-phase' ||
        phase.retry.preserveArtifacts !== true ||
        phase.retry.preserveAudit !== true) {
      errors.push(`${location}.retry must preserve artifacts/audit in a new same-phase attempt`);
    }

    const expectedNext = index === PHASE_ORDER.length - 1 ? null : PHASE_ORDER[index + 1];
    const expectedChangesTarget = CHANGES_REQUESTED_TARGET[phase.id];
    if (!phase.transitions ||
        phase.transitions.onApprove !== expectedNext ||
        phase.transitions.onChangesRequested !== expectedChangesTarget ||
        phase.transitions.onBlocked !== 'blocked') {
      errors.push(`${location}.transitions must define approve -> ${expectedNext}, ` +
        `changes-requested -> ${expectedChangesTarget}, and blocked -> blocked`);
    }
  });

  const review = manifest.phases.find((phase) => phase && phase.id === 'review');
  const reviewOutput = review && Array.isArray(review.outputs)
    ? review.outputs.find((output) => output.id === 'review_log')
    : null;
  if (!reviewOutput || reviewOutput.path !== 'docs/tasks/{taskId}/review-log-R{round}.md') {
    errors.push('review phase must produce a round-numbered docs/tasks/{taskId}/review-log-R{round}.md');
  }
  if (!reviewOutput || reviewOutput.roundBased !== true) {
    errors.push("review phase's review_log output must set roundBased: true");
  }

  const readiness = manifest.prReadiness;
  if (!readiness || !Array.isArray(readiness.requires)) {
    errors.push('prReadiness.requires must be an array');
  } else {
    for (const requirement of readiness.requires) {
      const [kind, id] = requirement.split(':');
      if ((kind === 'artifact' && !producedArtifacts.has(id)) ||
          (kind === 'gate' && !completedGates.has(id)) ||
          !['artifact', 'gate'].includes(kind)) {
        errors.push(`prReadiness has unresolved requirement '${requirement}'`);
      }
    }
  }
  if (JSON.stringify(readiness && readiness.acceptedReviewVerdicts) !==
      JSON.stringify(['approve', 'approve-with-fixes'])) {
    errors.push('prReadiness.acceptedReviewVerdicts must contain approve and approve-with-fixes');
  }

  return errors;
}

function validateReviewContracts() {
  const errors = [];
  const reviewFiles = [
    '.claude/skills/dev-review/SKILL.md',
    '.claude/skills/dev-review/SKILL.en.md',
    '.opencode/skills/dev/review.md',
    '.opencode/skills/dev/review.en.md',
  ];
  for (const relativeFile of reviewFiles) {
    const file = path.join(REPO_ROOT, relativeFile);
    if (!fs.existsSync(file)) {
      errors.push(`${relativeFile}: missing review skill source`);
      continue;
    }
    const content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    if (!content.includes('review-log-R')) {
      errors.push(`${relativeFile}: must save docs/tasks/[TASK-ID]/review-log-R[N].md`);
    }
    if (!/approve-with-fixes|Approve with minor fixes/i.test(content) ||
        !/Request Changes|request-changes/i.test(content)) {
      errors.push(`${relativeFile}: must preserve the approve / approve-with-fixes / request-changes verdicts`);
    }
  }
  return errors;
}

function validatePrContracts() {
  const errors = [];
  const prFiles = [
    '.claude/skills/dev-pr/SKILL.md',
    '.claude/skills/dev-pr/SKILL.en.md',
    '.opencode/skills/dev/pr.md',
    '.opencode/skills/dev/pr.en.md',
  ];
  for (const relativeFile of prFiles) {
    const file = path.join(REPO_ROOT, relativeFile);
    if (!fs.existsSync(file)) {
      errors.push(`${relativeFile}: missing PR skill source`);
      continue;
    }
    const content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    if (!content.includes('review-log-R')) {
      errors.push(`${relativeFile}: must gate on docs/tasks/[TASK-ID]/review-log-R[N].md`);
    }
    if (!/approve-with-fixes/i.test(content)) {
      errors.push(`${relativeFile}: must accept the approve-with-fixes verdict`);
    }
  }
  return errors;
}

function validateFiles(manifestFile = DEFAULT_MANIFEST) {
  const errors = [];
  const schema = readJson(DEFAULT_SCHEMA, errors);
  const manifest = readJson(manifestFile, errors);
  if (schema && schema.$id !== 'https://agentic-development-lifecycle.dev/schemas/task-to-pr.v1.json') {
    errors.push('task-to-pr.schema.v1.json: unexpected or missing $id');
  }
  if (manifest) errors.push(...validateManifest(manifest));
  errors.push(...validateReviewContracts());
  errors.push(...validatePrContracts());
  return errors;
}

if (require.main === module) {
  const manifestFile = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_MANIFEST;
  const errors = validateFiles(manifestFile);
  if (errors.length) {
    console.error('WORKFLOW MANIFEST VALIDATION FAILED:');
    errors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
  }
  console.log('Workflow manifest: schema v1, 5 phases, runtime support, artifacts, gates, and review/PR contracts validated.');
}

module.exports = {
  DEFAULT_MANIFEST,
  validateManifest,
  validateFiles,
};

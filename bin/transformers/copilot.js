const codexTransformer = require('./codex');

const START_MARKER = '<!-- ADLC:START -->';
const END_MARKER = '<!-- ADLC:END -->';

function normalize(source) {
  return source.replace(/^﻿/, '').replace(/\r\n/g, '\n');
}

// GitHub Copilot CLI / Copilot coding agent reads the same Agent Skills open standard as Codex CLI --
// a folder per skill containing SKILL.md, discovered from `.github/skills/`. Codex's transform already
// rewrites Claude-Code-specific primitives (AskUserQuestion, Agent(), model hints) into host-neutral
// prose -- exactly what any non-Claude-Code SKILL.md consumer needs -- so reuse it as-is instead of
// re-implementing the same transform under a different name.
function copyAndTransform(srcDir, dstDir, opts = {}) {
  return codexTransformer.copyAndTransform(srcDir, dstDir, { contractLabel: 'Copilot CLI', ...opts });
}

function managedInstructionsSection() {
  return [
    START_MARKER,
    '# Agentic Development Lifecycle',
    '',
    'Use the ADLC workflows in `.github/skills/` when a request matches their description.',
    'Classify risk with `docs/risk-classifier.md` before changing code. Ask for confirmation at high-risk gates.',
    'Keep changes scoped, run relevant validation, and review the diff before proposing a push.',
    END_MARKER,
  ].join('\n');
}

function mergeManagedInstructions(existing) {
  const current = normalize(existing);
  const starts = current.split(START_MARKER).length - 1;
  const ends = current.split(END_MARKER).length - 1;
  if (starts !== ends || starts > 1) {
    throw new Error('copilot-instructions.md has malformed ADLC managed-section markers; repair them before running the installer.');
  }
  if (starts === 1) {
    const start = current.indexOf(START_MARKER);
    const endMarker = current.indexOf(END_MARKER, start);
    if (endMarker < start) {
      throw new Error('copilot-instructions.md has malformed ADLC managed-section markers; repair them before running the installer.');
    }
    const end = endMarker + END_MARKER.length;
    return `${current.slice(0, start)}${managedInstructionsSection()}${current.slice(end)}`;
  }
  return current.trimEnd() ? `${current.trimEnd()}\n\n${managedInstructionsSection()}\n` : `${managedInstructionsSection()}\n`;
}

module.exports = {
  copyAndTransform,
  mergeManagedInstructions,
};

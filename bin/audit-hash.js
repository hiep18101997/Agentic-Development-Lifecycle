#!/usr/bin/env node
'use strict';

// bin/audit-hash.js — minimal tamper-evidence helper for templates/audit.md entries.
//
// Purpose: produce a deterministic SHA-256 hex digest over an audit-log entry's
// diff content + timestamp + agent/model name, so a later reader can recompute the
// hash and detect whether the recorded entry (diff, timestamp, or agent) was
// altered after the fact. This is NOT PKI/signing — it's a plain hash, no keys,
// no external dependencies (uses Node's built-in `crypto` module only).
//
// Usage:
//   node bin/audit-hash.js --diff <file> --agent <name> --timestamp <iso> [--action <text>]
//   git diff | node bin/audit-hash.js --agent <name> --timestamp <iso>   (diff read from stdin)
//
// Flags:
//   --diff <file>       Path to a file containing the diff/content text.
//                        Omit to read the diff from stdin instead.
//   --agent <name>      Agent/model name that made the change (required).
//   --timestamp <iso>   ISO-8601 or "YYYY-MM-DD HH:mm JST" timestamp string (required).
//   --action <text>     Optional extra context (e.g. skill action / decision summary)
//                        folded into the hash for stronger tamper-evidence.
//   --help, -h          Print this usage and exit.
//
// Output: a single 64-character SHA-256 hex digest printed to stdout. Paste it
// into the `hash` field of the corresponding audit.md entry.
//
// How it works: the hash is computed over the UTF-8 bytes of
//   `${agent}\n${timestamp}\n${action}\n${diff}`
// joined with newline separators, in that fixed order, so the same inputs always
// reproduce the same digest — and changing any one of them changes the digest.

const fs = require('fs');
const crypto = require('crypto');

function printUsageAndExit(code) {
  const lines = [
    'Usage: node bin/audit-hash.js --diff <file> --agent <name> --timestamp <iso> [--action <text>]',
    '       <diff-source> | node bin/audit-hash.js --agent <name> --timestamp <iso>',
    '',
    'Flags:',
    '  --diff <file>      Path to file with diff/content text (omit to read stdin)',
    '  --agent <name>     Agent/model name that made the change (required)',
    '  --timestamp <iso>  Timestamp string, e.g. "2026-08-27 10:00 JST" (required)',
    '  --action <text>    Optional extra context folded into the hash',
    '  --help, -h         Show this help',
    '',
    'Prints a SHA-256 hex digest to stdout for the `hash` field in audit.md.',
  ];
  (code === 0 ? console.log : console.error)(lines.join('\n'));
  process.exit(code);
}

function readArgValue(argv, flag) {
  const i = argv.indexOf(flag);
  if (i === -1) return undefined;
  const v = argv[i + 1];
  if (v === undefined || v.startsWith('--')) {
    console.error(`Error: ${flag} requires a value`);
    process.exit(1);
  }
  return v;
}

function readStdinSync() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) printUsageAndExit(0);

  const diffFile = readArgValue(argv, '--diff');
  const agent = readArgValue(argv, '--agent');
  const timestamp = readArgValue(argv, '--timestamp');
  const action = readArgValue(argv, '--action') || '';

  if (!agent || !timestamp) {
    console.error('Error: --agent and --timestamp are required.\n');
    printUsageAndExit(1);
  }

  const diff = diffFile !== undefined
    ? fs.readFileSync(diffFile, 'utf8')
    : readStdinSync();

  const payload = [agent, timestamp, action, diff].join('\n');
  const hash = crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
  process.stdout.write(hash + '\n');
}

main();

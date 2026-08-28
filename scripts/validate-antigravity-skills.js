#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.argv[2];
const rest = process.argv.slice(3);
let expected = 105;
const expIdx = rest.indexOf('--expected');
if (expIdx !== -1 && rest[expIdx + 1]) expected = parseInt(rest[expIdx + 1], 10);

if (!root) {
  console.error('Usage: node scripts/validate-antigravity-skills.js <skills-directory> [--expected N]');
  process.exit(1);
}
if (!fs.existsSync(root)) {
  console.error(`Antigravity skills directory does not exist: ${root}`);
  process.exit(1);
}

function collectFiles(dir, relDir = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      out.push(...collectFiles(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.md')) {
      out.push(rel);
    }
  }
  return out;
}

const files = collectFiles(root);
const errors = [];
for (const rel of files) {
  const parts = rel.split('/');
  const role = parts.length > 1 ? parts[0] : null;
  const command = parts[parts.length - 1].replace(/\.(en|ja)\.md$/, '').replace(/\.md$/, '');
  const expectedName = role && role !== command ? `${role}:${command}` : command;

  const filePath = path.join(root, ...parts);
  const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const fm = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    errors.push(`missing frontmatter: ${rel}`);
    continue;
  }
  const name = fm[1].match(/^name:\s*(.+)$/m);
  const description = fm[1].match(/^description:\s*(\S[\s\S]*?)(?=\n[a-z][\w-]*:|$)/m);
  if (!name) errors.push(`missing name: ${rel}`);
  else if (name[1].trim() !== expectedName) errors.push(`name mismatch (expected "${expectedName}"): ${rel}`);
  if (!description) errors.push(`missing description: ${rel}`);
  if (/\bAskUserQuestion\b|\bAgent\s*\(|\bmodel:\s*(?:haiku|sonnet)\b/.test(content)) {
    errors.push(`contains stale Claude runtime syntax: ${rel}`);
  }
}

if (files.length !== expected) errors.push(`expected ${expected} skill files, found ${files.length}`);
if (errors.length) {
  console.error('ANTIGRAVITY SKILL VALIDATION FAILED:');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log(`${root}: ${files.length} skill files validated.`);

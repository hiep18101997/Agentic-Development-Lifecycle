#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.argv[2];
const rest = process.argv.slice(3);
let expected = 105;
const expIdx = rest.indexOf('--expected');
if (expIdx !== -1 && rest[expIdx + 1]) expected = parseInt(rest[expIdx + 1], 10);

if (!root) {
  console.error('Usage: node scripts/validate-cursor-skills.js <rules-directory> [--expected N]');
  process.exit(1);
}
if (!fs.existsSync(root)) {
  console.error(`Cursor rules directory does not exist: ${root}`);
  process.exit(1);
}

const files = fs.readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith('.mdc'));
const errors = [];
for (const entry of files) {
  if (!/^[a-z0-9-]+\.mdc$/.test(entry.name)) errors.push(`invalid rule filename: ${entry.name}`);
  const filePath = path.join(root, entry.name);
  const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const fm = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    errors.push(`missing frontmatter: ${entry.name}`);
    continue;
  }
  const description = fm[1].match(/^description:\s*(\S[\s\S]*?)(?=\n[a-z][\w-]*:|$)/m);
  if (!description) errors.push(`missing description: ${entry.name}`);
  if (!/^globs:/m.test(fm[1])) errors.push(`missing globs key: ${entry.name}`);
  if (!/^alwaysApply:/m.test(fm[1])) errors.push(`missing alwaysApply key: ${entry.name}`);
  if (/^name:/m.test(fm[1])) errors.push(`unexpected name field (Cursor frontmatter drops name): ${entry.name}`);
  if (/AskUserQuestion\(/.test(content)) {
    errors.push(`contains un-relabelled AskUserQuestion( call: ${entry.name}`);
  }
  if (/(?<!Sub-task )\bAgent\s*\(/.test(content)) {
    errors.push(`contains un-relabelled Agent( call (expected "Sub-task Agent("): ${entry.name}`);
  }
}

if (files.length !== expected) errors.push(`expected ${expected} rules, found ${files.length}`);
if (errors.length) {
  console.error('CURSOR RULE VALIDATION FAILED:');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log(`${root}: ${files.length} rules validated.`);

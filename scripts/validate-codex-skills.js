#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.argv[2];
if (!root) {
  console.error('Usage: node scripts/validate-codex-skills.js <skills-directory>');
  process.exit(1);
}
if (!fs.existsSync(root)) {
  console.error(`Codex skills directory does not exist: ${root}`);
  process.exit(1);
}

const skillDirs = fs.readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory());
const errors = [];
for (const entry of skillDirs) {
  if (!/^[a-z0-9-]+$/.test(entry.name)) errors.push(`invalid skill directory name: ${entry.name}`);
  const skillPath = path.join(root, entry.name, 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    errors.push(`missing SKILL.md: ${entry.name}`);
    continue;
  }
  const content = fs.readFileSync(skillPath, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const fm = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    errors.push(`missing frontmatter: ${entry.name}`);
    continue;
  }
  const name = fm[1].match(/^name:\s*(.+)$/m);
  const description = fm[1].match(/^description:\s*(\S[\s\S]*?)(?=\n[a-z][\w-]*:|$)/m);
  if (!name || name[1].trim() !== entry.name) errors.push(`name mismatch: ${entry.name}`);
  if (!description) errors.push(`missing description: ${entry.name}`);
  if (/\bAskUserQuestion\b|\bAgent\s*\(|\bmodel:\s*(?:haiku|sonnet)\b/.test(content)) {
    errors.push(`contains runtime-specific Claude syntax: ${entry.name}`);
  }
}

if (skillDirs.length !== 34) errors.push(`expected 34 skills, found ${skillDirs.length}`);
if (errors.length) {
  console.error('CODEX SKILL VALIDATION FAILED:');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log(`Codex: ${skillDirs.length} skills validated.`);

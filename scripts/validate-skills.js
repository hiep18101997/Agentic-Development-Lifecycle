#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const errors = [];

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function parseFrontmatter(content) {
  content = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const stripped = content.replace(/^﻿/, '');
  const m = stripped.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fields = {};
  const yaml = m[1];
  const nameMatch = yaml.match(/^name:\s*(.+?)$/m);
  if (nameMatch) fields.name = nameMatch[1].trim();
  const descMatch = yaml.match(/^description:\s*([\s\S]+?)(?=\n[a-z]+:|$)/m);
  if (descMatch) fields.description = descMatch[1].trim();
  return fields;
}

function checkFrontmatter(label, file, expectedName) {
  const fm = parseFrontmatter(fs.readFileSync(file, 'utf8'));
  if (!fm) { errors.push(`[${label}] missing frontmatter: ${file}`); return; }
  if (!fm.name) errors.push(`[${label}] missing 'name:' field: ${file}`);
  if (!fm.description) errors.push(`[${label}] missing 'description:' field: ${file}`);
  if (fm.name && expectedName && fm.name !== expectedName) {
    errors.push(`[${label}] name mismatch: ${file} declares '${fm.name}' but expected '${expectedName}'`);
  }
}

// Claude Code Agent Skills: flat folders `.claude/skills/<skill>/SKILL[.lang].md`.
// Each skill folder must hold SKILL.md + SKILL.en.md + SKILL.ja.md; `name:` == folder name.
function validateClaudeSkills(dir, label) {
  if (!fs.existsSync(dir)) { errors.push(`[${label}] directory not found: ${dir}`); return; }
  const folders = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
  if (folders.length === 0) { errors.push(`[${label}] no skill folders found in ${dir}`); return; }
  let fileCount = 0;
  for (const f of folders) {
    const skillDir = path.join(dir, f.name);
    for (const [variant, fname] of [['VN base', 'SKILL.md'], ['EN variant', 'SKILL.en.md'], ['JA variant', 'SKILL.ja.md']]) {
      const fp = path.join(skillDir, fname);
      if (!fs.existsSync(fp)) { errors.push(`[${label}] missing ${variant}: ${fp}`); continue; }
      fileCount++;
      checkFrontmatter(label, fp, f.name);
    }
  }
  console.log(`[${label}] ${fileCount} files, ${folders.length} skills validated`);
}

// OpenCode skills: nested `.opencode/skills/<role>/<name>[.lang].md`, `name:` == "role:command".
function expectedOpencodeName(rootDir, filePath) {
  const rel = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const stem = rel.replace(/\.(en|ja)\.md$/, '').replace(/\.md$/, '');
  if (!stem.includes('/')) return stem;
  const [parent, leaf] = stem.split('/');
  return parent === leaf ? leaf : `${parent}:${leaf}`;
}

function validateOpencode(dir, label) {
  const files = walk(dir);
  if (files.length === 0) { errors.push(`[${label}] no .md files found in ${dir}`); return; }
  const stems = new Set(files.map((f) => f.replace(/\.(en|ja)\.md$/, '.md')));
  for (const stem of stems) {
    const enFile = stem.replace(/\.md$/, '.en.md');
    const jaFile = stem.replace(/\.md$/, '.ja.md');
    if (!fs.existsSync(stem)) errors.push(`[${label}] missing VN base: ${stem}`);
    if (!fs.existsSync(enFile)) errors.push(`[${label}] missing EN variant: ${enFile}`);
    if (!fs.existsSync(jaFile)) errors.push(`[${label}] missing JA variant: ${jaFile}`);
  }
  for (const file of files) checkFrontmatter(label, file, expectedOpencodeName(dir, file));
  console.log(`[${label}] ${files.length} files, ${stems.size} skills validated`);
}

validateClaudeSkills('.claude/skills', 'Claude Code');
validateOpencode('.opencode/skills', 'OpenCode');

if (errors.length) {
  console.error('\nVALIDATION FAILED:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\nAll skill files valid.');

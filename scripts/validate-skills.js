#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOTS = [
  { dir: '.claude/commands', label: 'Claude Code' },
  { dir: '.opencode/skills', label: 'OpenCode' },
];

// Per-variant trigger phrase patterns. A description must contain at least one
// of the language-appropriate phrases so the skill auto-triggers correctly.
const TRIGGER_PATTERNS = {
  vi: [/Trigger khi:/i, /hoặc gõ \//i],
  en: [/Trigger(s)? when:/i, /or type[s]? \//i],
  ja: [/トリガー[:：]/, /または \/[^ ]+ と入力時/],
};

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
  const stripped = content.replace(/^﻿/, '');
  const m = stripped.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fields = {};
  const yaml = m[1];
  const lines = yaml.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) { i++; continue; }
    const key = kv[1];
    let value = kv[2];
    // If value starts with a YAML block scalar indicator (> or |) or is empty,
    // collect indented continuation lines until the next top-level key.
    if (value === '' || value === '>' || value === '|' || value === '>-' || value === '|-') {
      const collected = [];
      i++;
      while (i < lines.length && /^(\s+|$)/.test(lines[i])) {
        collected.push(lines[i].trim());
        i++;
      }
      value = collected.filter(Boolean).join(' ');
    } else {
      i++;
    }
    if (key === 'name' && !fields.name) fields.name = value.trim();
    if (key === 'description' && !fields.description) fields.description = value.trim();
  }
  return fields;
}

function expectedName(rootDir, filePath) {
  const rel = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const stem = rel.replace(/\.(en|ja)\.md$/, '').replace(/\.md$/, '');
  if (!stem.includes('/')) return stem;
  const [parent, leaf] = stem.split('/');
  if (parent === leaf) return leaf;
  return `${parent}:${leaf}`;
}

function baseStem(filePath) {
  return filePath.replace(/\.(en|ja)\.md$/, '.md');
}

function variantOf(filePath) {
  if (filePath.endsWith('.en.md')) return 'en';
  if (filePath.endsWith('.ja.md')) return 'ja';
  return 'vi';
}

for (const { dir, label } of ROOTS) {
  const files = walk(dir);
  if (files.length === 0) {
    errors.push(`[${label}] no .md files found in ${dir}`);
    continue;
  }

  const stems = new Set();
  for (const file of files) stems.add(baseStem(file));

  for (const stem of stems) {
    const enFile = stem.replace(/\.md$/, '.en.md');
    const jaFile = stem.replace(/\.md$/, '.ja.md');
    if (!fs.existsSync(stem)) errors.push(`[${label}] missing VN base: ${stem}`);
    if (!fs.existsSync(enFile)) errors.push(`[${label}] missing EN variant: ${enFile}`);
    if (!fs.existsSync(jaFile)) errors.push(`[${label}] missing JA variant: ${jaFile}`);
  }

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm) {
      errors.push(`[${label}] missing frontmatter: ${file}`);
      continue;
    }
    if (!fm.name) errors.push(`[${label}] missing 'name:' field: ${file}`);
    if (!fm.description) errors.push(`[${label}] missing 'description:' field: ${file}`);

    const expected = expectedName(dir, file);
    if (fm.name && fm.name !== expected) {
      errors.push(`[${label}] name mismatch: ${file} declares '${fm.name}' but path implies '${expected}'`);
    }

    // Trigger phrase check — skip skills whose description was intentionally
    // collapsed to '---' (a few EN/JA stub files use this as a placeholder).
    if (fm.description && fm.description !== '---') {
      const variant = variantOf(file);
      const patterns = TRIGGER_PATTERNS[variant] || [];
      const hasTrigger = patterns.some((re) => re.test(fm.description));
      if (!hasTrigger) {
        errors.push(`[${label}] description missing ${variant.toUpperCase()} trigger phrase: ${file}`);
      }
    }
  }

  console.log(`[${label}] ${files.length} files, ${stems.size} skills validated`);
}

if (errors.length) {
  console.error('\nVALIDATION FAILED:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\nAll skill files valid.');

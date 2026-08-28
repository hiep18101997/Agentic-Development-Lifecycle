const fs = require('fs');
const path = require('path');

function transformContent(source) {
  let body = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');

  body = transformFrontmatter(body);

  body = body.replace(/^# Skill: \/([\w-]+)/m, '# /$1');

  body = body.replace(/AskUserQuestion\(/g, 'Ask the user (');

  body = body.replace(/\bAgent\(/g, 'Sub-task Agent(');

  body = body.replace(/E:\\AI Bootcamp\\ClaudeSkill\\/g, '');

  return body;
}

function transformFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return source;

  const frontmatter = match[1];
  const rest = source.slice(match[0].length);

  const lines = frontmatter.split('\n');
  const out = [];
  let skippingName = false;

  for (const line of lines) {
    if (line.startsWith('name:')) {
      skippingName = false;
      continue;
    }
    if (skippingName && /^\s/.test(line)) continue;
    skippingName = false;

    if (line.startsWith('description:')) {
      out.push(line);
      continue;
    }
    out.push(line);
  }

  const hasGlobs = out.some((l) => l.startsWith('globs:'));
  const hasAlwaysApply = out.some((l) => l.startsWith('alwaysApply:'));
  if (!hasGlobs) out.push('globs: []');
  if (!hasAlwaysApply) out.push('alwaysApply: false');

  return `---\n${out.join('\n').replace(/\n+$/, '')}\n---\n${rest}`;
}

// Transform Claude Code Agent Skills (`.claude/skills/<skill>/SKILL[.lang].md`) into flat
// Cursor rules (`.cursor/rules/<skill>.mdc`). Per --lang:
//   vi/en/ja → one `<skill>.mdc`   |   all → `<skill>.mdc`, `<skill>-en.mdc`, `<skill>-ja.mdc`
function copyAndTransform(srcSkillsDir, dstDir, opts = {}) {
  const { lang = 'all', update } = opts;
  if (!fs.existsSync(srcSkillsDir)) return { copied: 0, skipped: 0, updated: 0, filtered: 0 };
  fs.mkdirSync(dstDir, { recursive: true });
  let copied = 0, skipped = 0, updated = 0, filtered = 0;

  for (const skill of fs.readdirSync(srcSkillsDir, { withFileTypes: true })) {
    if (!skill.isDirectory()) continue;
    const skillDir = path.join(srcSkillsDir, skill.name);
    const has = (n) => fs.existsSync(path.join(skillDir, n));
    const targets = [];
    if (lang === 'vi') {
      targets.push({ src: 'SKILL.md', out: skill.name });
    } else if (lang === 'en') {
      targets.push({ src: has('SKILL.en.md') ? 'SKILL.en.md' : 'SKILL.md', out: skill.name });
    } else if (lang === 'ja') {
      targets.push({ src: has('SKILL.ja.md') ? 'SKILL.ja.md' : 'SKILL.md', out: skill.name });
    } else { // all
      targets.push({ src: 'SKILL.md', out: skill.name });
      if (has('SKILL.en.md')) targets.push({ src: 'SKILL.en.md', out: `${skill.name}-en` });
      if (has('SKILL.ja.md')) targets.push({ src: 'SKILL.ja.md', out: `${skill.name}-ja` });
    }
    for (const t of targets) {
      const s = path.join(skillDir, t.src);
      if (!fs.existsSync(s)) continue;
      const d = path.join(dstDir, `${t.out}.mdc`);
      const exists = fs.existsSync(d);
      if (exists && !update) { skipped++; continue; }
      fs.writeFileSync(d, transformContent(fs.readFileSync(s, 'utf8')));
      if (exists) updated++; else copied++;
    }
  }

  return { copied, skipped, updated, filtered };
}

module.exports = { copyAndTransform, transformContent };

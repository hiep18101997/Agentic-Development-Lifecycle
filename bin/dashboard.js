#!/usr/bin/env node
'use strict';

const fs            = require('fs');
const path          = require('path');
const { execFileSync } = require('child_process');
const pc            = require('picocolors');

const ROOT     = path.resolve(__dirname, '..');
const OUT_ARG  = process.argv.indexOf('--out');
const OUT      = OUT_ARG !== -1 ? process.argv[OUT_ARG + 1] : path.join(ROOT, 'docs', 'dashboard.html');
const WATCH    = process.argv.includes('--watch') || process.argv.includes('-w');
const TEMPLATE = path.join(ROOT, 'templates', 'dashboard.html');

const PHASE_ORDER = ['empty', 'discovery', 'planning', 'dev', 'review', 'qa'];

// ── Task scanner ────────────────────────────────────────────

function derivePhase(files) {
  if (!files.includes('requirements.md')) return 'empty';
  if (!files.includes('analysis.md'))     return 'discovery';
  if (!files.includes('verification.md')) return 'planning';
  if (files.includes('test-plan.md'))     return 'qa';
  if (files.includes('pr.md'))            return 'review';
  return 'dev';
}

function parseTitle(fp) {
  try { const m = fs.readFileSync(fp, 'utf8').match(/^#\s+(.+)/m); return m ? m[1].trim() : null; }
  catch { return null; }
}

function parseRisk(fp) {
  try { const m = fs.readFileSync(fp, 'utf8').match(/Lane:\s*(tiny|normal|high-risk)/i); return m ? m[1].toLowerCase() : null; }
  catch { return null; }
}

function parseDependsOn(fp) {
  try {
    const content = fs.readFileSync(fp, 'utf8');
    const m = content.match(/\*\*Depends on\*\*:\s*(.+)/i);
    if (!m) return [];
    const raw = m[1].trim();
    if (!raw || raw.startsWith('[') || /^none$/i.test(raw)) return [];
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  } catch { return []; }
}

// A task is "done" once it reaches the qa phase (see PHASE_META.qa = 'QA / Done').
// Dependency status is display-only — no auto-dispatch reads or acts on it.
function computeDependencyStatus(tasks) {
  const byId = new Map(tasks.map(t => [t.id, t]));
  for (const t of tasks) {
    const blockers = [];
    for (const depId of t.dependsOn) {
      const dep = byId.get(depId);
      if (!dep) blockers.push({ id: depId, reason: 'unknown task (not found in docs/tasks)' });
      else if (dep.phase !== 'qa') blockers.push({ id: depId, reason: `phase=${dep.phase}` });
    }
    t.blocked  = blockers.length > 0;
    t.blockers = blockers;
  }
  return tasks;
}

function parseAudit(fp, taskId) {
  try {
    const content = fs.readFileSync(fp, 'utf8');
    const entries = [];
    // ## YYYY-MM-DD HH:mm JST · skill=`/xx:yy`
    const re = /^## (\d{4}-\d{2}-\d{2} \d{2}:\d{2})[^\n]*[·\-]\s*skill=`?([^\s`·\n]+)`?/gm;
    const heads = [];
    let m;
    while ((m = re.exec(content)) !== null) heads.push({ index: m.index, date: m[1], skill: m[2].trim() });
    for (let i = 0; i < heads.length; i++) {
      const start = heads[i].index;
      const end   = i + 1 < heads.length ? heads[i + 1].index : content.length;
      const body  = content.slice(start, end);
      // Optional self-reported "**duration**: <N>m" — see templates/audit.md field docs.
      const durMatch = body.match(/\*\*duration\*\*:\s*(\d+)\s*m/i);
      const duration = durMatch ? parseInt(durMatch[1], 10) : null;
      entries.push({ type: 'audit', date: heads[i].date, skill: heads[i].skill, taskId, duration });
    }
    return entries;
  } catch { return []; }
}

function scanTasks(tasksDir) {
  if (!fs.existsSync(tasksDir)) return { tasks: [], auditEntries: [] };
  const tasks = [], auditEntries = [];
  for (const entry of fs.readdirSync(tasksDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const taskDir = path.join(tasksDir, entry.name);
    const files   = fs.readdirSync(taskDir).filter(f => f.endsWith('.md'));
    const phase   = derivePhase(files);
    const title   = files.includes('requirements.md') ? parseTitle(path.join(taskDir, 'requirements.md')) : null;
    const risk    = files.includes('analysis.md')     ? parseRisk(path.join(taskDir, 'analysis.md'))     : null;
    const dependsOn = files.includes('requirements.md') ? parseDependsOn(path.join(taskDir, 'requirements.md')) : [];

    let lastMod = 0;
    for (const f of files) {
      try { const ms = fs.statSync(path.join(taskDir, f)).mtimeMs; if (ms > lastMod) lastMod = ms; } catch {}
    }
    if (files.includes('audit.md')) auditEntries.push(...parseAudit(path.join(taskDir, 'audit.md'), entry.name));

    tasks.push({ id: entry.name, title: title || entry.name, phase, risk, dependsOn, files, lastMod: lastMod ? new Date(lastMod).toISOString() : null });
  }
  computeDependencyStatus(tasks);
  return {
    tasks: tasks.sort((a, b) => PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase)),
    auditEntries,
  };
}

// ── Backlog parser ──────────────────────────────────────────

function parseBacklog(fp) {
  if (!fs.existsSync(fp)) return [];
  const rows = [];
  for (const line of fs.readFileSync(fp, 'utf8').split('\n')) {
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length >= 5 && /^IB-\d+$/.test(cells[0]))
      rows.push({ id: cells[0], source: cells[1], friction: cells[2], fix: cells[3], status: cells[4] });
  }
  return rows;
}

// ── Validation matrix parser ────────────────────────────────

function parseValidation(fp) {
  if (!fs.existsSync(fp)) return { pass: 0, fail: 0, partial: 0, untested: 0 };
  let pass = 0, fail = 0, partial = 0, untested = 0;
  for (const line of fs.readFileSync(fp, 'utf8').split('\n')) {
    if (!line.startsWith('|')) continue;
    if (line.includes('✅'))        pass++;
    else if (line.includes('❌'))   fail++;
    else if (line.includes('⚠️'))  partial++;
    else if (line.includes('🔲'))  untested++;
  }
  return { pass, fail, partial, untested };
}

// ── Git activity ────────────────────────────────────────────

function getGitActivity(root) {
  try {
    const raw = execFileSync(
      'git',
      ['log', '--since=14 days ago', '--pretty=format:%H|%ad|%s|%an', '--date=short'],
      { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    if (!raw) return [];
    return raw.split('\n').slice(0, 60).map(line => {
      const parts  = line.split('|');
      const hash   = parts[0].slice(0, 7);
      const date   = parts[1] || '';
      const author = parts[parts.length - 1] || '';
      const msg    = parts.slice(2, -1).join('|').slice(0, 80);
      const tm     = msg.match(/^(feat|fix|docs|chore|refactor|test|style|ci|build|perf)/);
      return { type: 'commit', hash, date, msg, author, commitType: tm ? tm[1] : 'other' };
    });
  } catch { return []; }
}

// ── Skill catalog ───────────────────────────────────────────

// Scan Claude Code Agent Skills: flat folders `.claude/skills/<role-command>/SKILL.md`.
// Skill name = folder name (e.g. "ba-spec"); role = prefix before the first hyphen.
function scanSkillCatalog(skillsDir) {
  if (!fs.existsSync(skillsDir)) return [];
  const skills = [];
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!fs.existsSync(path.join(skillsDir, entry.name, 'SKILL.md'))) continue;
    const name = entry.name;
    const role = name.split('-')[0];
    skills.push({ role, name, usageCount: 0 });
  }
  return skills;
}

function crossRefUsage(skills, auditEntries) {
  const usage = {};
  const durations = {};
  for (const e of auditEntries) {
    const k = e.skill.replace(/^\//, '');
    usage[k] = (usage[k] || 0) + 1;
    if (typeof e.duration === 'number' && !Number.isNaN(e.duration)) {
      (durations[k] = durations[k] || []).push(e.duration);
    }
  }
  return skills.map(s => {
    const ds = durations[s.name] || [];
    const avgDurationMin = ds.length ? Math.round(ds.reduce((a, b) => a + b, 0) / ds.length) : null;
    return { ...s, usageCount: usage[s.name] || 0, avgDurationMin, durationSamples: ds.length };
  });
}

function countDir(dirPath) {
  try { return fs.readdirSync(dirPath).filter(f => f !== '.gitkeep' && !f.startsWith('.')).length; }
  catch { return 0; }
}

function toJST(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(new Date(isoStr).getTime() + 9 * 3600 * 1000);
  return d.toISOString().replace('T', ' ').slice(0, 16) + ' JST';
}

// ── Build ───────────────────────────────────────────────────

function build() {
  const { tasks, auditEntries } = scanTasks(path.join(ROOT, 'docs', 'tasks'));
  const backlog    = parseBacklog(path.join(ROOT, 'docs', 'improvement-backlog.md'));
  const validation = parseValidation(path.join(ROOT, 'docs', 'validation-matrix.md'));
  const gitAct     = getGitActivity(ROOT);
  const skills     = crossRefUsage(scanSkillCatalog(path.join(ROOT, '.claude', 'skills')), auditEntries);
  const growth     = {
    decisions: countDir(path.join(ROOT, 'docs', 'decisions')),
    screens:   countDir(path.join(ROOT, 'docs', 'screens')),
    api:       countDir(path.join(ROOT, 'docs', 'api')),
  };

  // Merged activity timeline (audit + git), sorted desc.
  // Dates use Date-object comparison (not raw string compare) so
  // non-ISO/unparseable dates don't misorder; NaN dates sort last.
  const activity = [...auditEntries, ...gitAct]
    .sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      const va = Number.isNaN(ta) ? -Infinity : ta;
      const vb = Number.isNaN(tb) ? -Infinity : tb;
      return vb - va;
    })
    .slice(0, 60);

  const nowJST = toJST(new Date().toISOString());
  const data   = { generatedAt: nowJST, watchMode: WATCH, tasks, backlog, validation, activity, skills, growth };

  if (!fs.existsSync(TEMPLATE)) {
    console.error(pc.red(`Template not found: ${TEMPLATE}`));
    process.exit(1);
  }

  const html = fs.readFileSync(TEMPLATE, 'utf8').replace('{{EMBEDDED_JSON}}', () => JSON.stringify(data, null, 2).replace(/</g, '\\u003c'));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, html, 'utf8');

  return { tasks: tasks.length, backlog: backlog.length, commits: gitAct.length, skills: skills.length, nowJST };
}

// ── Main ────────────────────────────────────────────────────

function main() {
  console.log(pc.cyan('\n  Agentic Development Lifecycle — Dashboard\n'));

  const s = build();
  console.log(`  ${pc.green('◆')} ${pc.cyan(OUT)}`);
  console.log(`  ${pc.dim(`${s.tasks} tasks · ${s.backlog} backlog · ${s.commits} commits (14d) · ${s.skills} skills · ${s.nowJST}`)}`);

  if (!WATCH) { console.log(); return; }

  console.log(`\n  ${pc.yellow('◈')} Watch mode — auto-regenerating on file changes`);
  console.log(pc.dim('  Reload browser after changes. Ctrl+C to stop.\n'));

  let timer = null;
  const trigger = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { const r = build(); console.log(`  ${pc.green('↻')} ${r.nowJST} — ${r.tasks} tasks`); }
      catch (e) { console.error(pc.red(`  Error: ${e.message}`)); }
    }, 500);
  };

  for (const t of [
    path.join(ROOT, 'docs', 'tasks'),
    path.join(ROOT, 'docs', 'improvement-backlog.md'),
    path.join(ROOT, 'docs', 'validation-matrix.md'),
    path.join(ROOT, '.git', 'HEAD'),
    path.join(ROOT, '.git', 'index'),
  ]) {
    try {
      if (fs.existsSync(t)) fs.watch(t, { recursive: true }, trigger);
    } catch { /* not a git repo, or watch unsupported for this path */ }
  }
}

main();

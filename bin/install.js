#!/usr/bin/env node

const { intro, outro, confirm, spinner, log, cancel, isCancel, note } = require('@clack/prompts');
const pc = require('picocolors');
const fs = require('fs');
const path = require('path');
const cursorTransformer = require('./transformers/cursor');
const antigravityTransformer = require('./transformers/antigravity');
const codexTransformer = require('./transformers/codex');
const copilotTransformer = require('./transformers/copilot');

const BANNER_CC = [
  ' ██╗   ██╗████████╗██╗    █████╗ ██████╗ ██╗      ██████╗ ',
  ' ██║   ██║╚══██╔══╝██║   ██╔══██╗██╔══██╗██║     ██╔════╝ ',
  ' ██║   ██║   ██║   ██║   ███████║██║  ██║██║     ██║      ',
  ' ╚██╗ ██╔╝   ██║   ██║   ██╔══██║██║  ██║██║     ██║      ',
  '  ╚████╔╝    ██║   ██║   ██║  ██║██████╔╝███████╗╚██████╗ ',
  '   ╚═══╝     ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝',
  '',
  '  Agentic Development LifeCycle',
].join('\n');

const BANNER_OC = [
  ' ╔═══╗                   ╔═══╗',
  ' ║ ╔═╝                    ║ ╔═╝',
  ' ║ ║  ┌─┐┌─┐┌┐┌   ┌─┐    ║ ║  ┌─┐',
  ' ║ ║  ├┤ ├┤ │││   │     ║ ║  │ │',
  ' ║ ╚═╗└─┘└─┘┘└┘───└─┘    ║ ╚═╗└─┘',
  ' ╚═══╝                   ╚═══╝',
  '',
  '  Agentic Development Lifecycle — OpenCode Port',
].join('\n');

const BANNER_CURSOR = [
  '  ██████╗██╗   ██╗██████╗ ███████╗ ██████╗ ██████╗ ',
  ' ██╔════╝██║   ██║██╔══██╗██╔════╝██╔═══██╗██╔══██╗',
  ' ██║     ██║   ██║██████╔╝███████╗██║   ██║██████╔╝',
  ' ██║     ██║   ██║██╔══██╗╚════██║██║   ██║██╔══██╗',
  ' ╚██████╗╚██████╔╝██║  ██║███████║╚██████╔╝██║  ██║',
  '  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝',
  '',
  '  Agentic Development Lifecycle — Cursor Port',
].join('\n');

const BANNER_AG = [
  '  █████╗ ███╗   ██╗████████╗██╗ ██████╗ ',
  ' ██╔══██╗████╗  ██║╚══██╔══╝██║██╔════╝ ',
  ' ███████║██╔██╗ ██║   ██║   ██║██║  ███╗',
  ' ██╔══██║██║╚██╗██║   ██║   ██║██║   ██║',
  ' ██║  ██║██║ ╚████║   ██║   ██║╚██████╔╝',
  ' ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝ ╚═════╝ ',
  '',
  '  Agentic Development Lifecycle — Antigravity Port',
].join('\n');

const src = path.resolve(__dirname, '..');
const dst = process.cwd();
const YES = process.argv.includes('--yes') || process.argv.includes('-y');
const UPDATE = process.argv.includes('--update') || process.argv.includes('-u');
const LITE = process.argv.includes('--lite');

// Developer Lite: 8 skills only. Names match the skill folder under .claude/skills/.
const LITE_SKILLS = new Set([
  'dev-analyze', 'dev-implement', 'dev-review', 'dev-pr', 'dev-debug',
  'sec-review', 'arch-adr', 'docs-update',
]);

// Agents spawned by the lite skill set.
const LITE_AGENTS = new Set([
  'diff-reader.md', 'doc-updater.md', 'pr-resolver.md', 'review-reader.md',
]);

function parsePlatform() {
  const flags = process.argv;
  const set = [];
  if (flags.includes('--cursor') || flags.includes('-c')) set.push('cursor');
  if (flags.includes('--antigravity') || flags.includes('-a')) set.push('antigravity');
  if (flags.includes('--opencode') || flags.includes('-o')) set.push('opencode');
  if (flags.includes('--codex')) set.push('codex');
  if (flags.includes('--copilot')) set.push('copilot');
  if (set.length > 1) {
    console.error(pc.red(`Multiple platform flags set: ${set.join(', ')}. Pick only one.`));
    process.exit(1);
  }
  return set[0] || 'claude';
}
const PLATFORM_KEY = parsePlatform();

function parseLang() {
  const i = process.argv.findIndex((a) => a === '--lang' || a === '-l');
  if (i >= 0 && i + 1 < process.argv.length) {
    const v = process.argv[i + 1].toLowerCase();
    if ((PLATFORM_KEY === 'codex' || PLATFORM_KEY === 'copilot') && v === 'all') {
      console.error(pc.red(`${PLATFORM_KEY === 'codex' ? 'Codex' : 'Copilot CLI'} installs one language at a time. Use --lang vi, en, or ja.`));
      process.exit(1);
    }
    if (['ja', 'en', 'vi', 'all'].includes(v)) return v;
    console.error(pc.red(`Invalid --lang value: ${v}. Must be one of: ja, en, vi, all`));
    process.exit(1);
  }
  return (PLATFORM_KEY === 'codex' || PLATFORM_KEY === 'copilot') ? 'vi' : 'all';
}
const LANG = parseLang();

const PLATFORM_CONFIG = {
  claude:      { label: 'Claude Code',  banner: BANNER_CC,     commandsDir: '.claude/skills',     configFile: 'CLAUDE.md' },
  opencode:    { label: 'OpenCode',     banner: BANNER_OC,     commandsDir: '.opencode/skills',   configFile: 'AGENTS.md' },
  cursor:      { label: 'Cursor',       banner: BANNER_CURSOR, commandsDir: '.cursor/rules',      configFile: '.cursorrules' },
  antigravity: { label: 'Antigravity',  banner: BANNER_AG,     commandsDir: '.antigravity/skills', configFile: 'AGENTS.md' },
  codex:       { label: 'Codex CLI',    banner: BANNER_CC,     commandsDir: '.agents/skills',      configFile: 'AGENTS.md' },
  copilot:     { label: 'GitHub Copilot CLI', banner: BANNER_CC, commandsDir: '.github/skills',    configFile: '.github/copilot-instructions.md' },
};
const CFG = PLATFORM_CONFIG[PLATFORM_KEY];
const BANNER = CFG.banner;
const PLATFORM = CFG.label;
const COMMANDS_DIR = CFG.commandsDir;
const CONFIG_FILE = CFG.configFile;

// When installing a single language, strip the lang suffix from the destination filename.
// e.g. --lang en: "spec.en.md" → "spec.md"  |  --lang ja: "spec.ja.md" → "spec.md"
// --lang all / --lang vi: keep filename as-is.
function getLangDestName(filename) {
  if (LANG === 'en' && /\.en\.(md|txt)$/.test(filename)) {
    return filename.replace(/\.en\.(md|txt)$/, '.$1');
  }
  if (LANG === 'ja' && /\.ja\.(md|txt)$/.test(filename)) {
    return filename.replace(/\.ja\.(md|txt)$/, '.$1');
  }
  return filename;
}

// siblingNames: Set of all filenames in the same directory — used to decide whether
// a base .md file should fall through when the requested lang variant doesn't exist.
function langFilter(filename, siblingNames = new Set()) {
  if (LANG === 'all') return true;
  if (!filename.endsWith('.md') && !filename.endsWith('.txt')) return true;
  const isJa = /\.ja\.(md|txt)$/.test(filename);
  const isEn = /\.en\.(md|txt)$/.test(filename);
  const isBase = !isJa && !isEn;
  if (LANG === 'vi') return isBase;
  if (LANG === 'en') {
    if (isEn) return true;
    if (isJa) return false;
    // Base file: include only when no EN variant exists (fallback for non-translated files)
    return !siblingNames.has(filename.replace(/\.(md|txt)$/, '.en.$1'));
  }
  if (LANG === 'ja') {
    if (isJa) return true;
    if (isEn) return false;
    // Base file: include only when no JP variant exists
    return !siblingNames.has(filename.replace(/\.(md|txt)$/, '.ja.$1'));
  }
  return true;
}

// protectExisting: when true, an existing destination file is NEVER overwritten, even with --update.
// Used for templates/ — README documents these as user-customizable skeletons, so an --update run
// must not silently clobber a hand-edited template (matches the exists-guard already used for
// docs/improvement-backlog.md and docs/validation-matrix.md below).
function copyDir(srcDir, dstDir, filterEnabled = false, pathFilter = null, relRoot = '', protectExisting = false) {
  if (!fs.existsSync(srcDir)) return { copied: 0, skipped: 0, updated: 0, filtered: 0 };
  fs.mkdirSync(dstDir, { recursive: true });
  let copied = 0, skipped = 0, updated = 0, filtered = 0;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  const siblingNames = new Set(entries.filter((e) => !e.isDirectory()).map((e) => e.name));
  for (const entry of entries) {
    const s = path.join(srcDir, entry.name);
    const relPath = relRoot ? `${relRoot}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      const sub = copyDir(s, path.join(dstDir, entry.name), filterEnabled, pathFilter, relPath, protectExisting);
      copied += sub.copied;
      skipped += sub.skipped;
      updated += sub.updated;
      filtered += sub.filtered;
    } else {
      if (pathFilter && !pathFilter(relPath)) {
        filtered++;
        continue;
      }
      if (filterEnabled && !langFilter(entry.name, siblingNames)) {
        filtered++;
        continue;
      }
      const dstName = filterEnabled ? getLangDestName(entry.name) : entry.name;
      const d = path.join(dstDir, dstName);
      if (fs.existsSync(d)) {
        if (UPDATE && !protectExisting) {
          fs.copyFileSync(s, d);
          updated++;
        } else {
          skipped++;
        }
      } else {
        fs.copyFileSync(s, d);
        copied++;
      }
    }
  }
  return { copied, skipped, updated, filtered };
}

// Read-only file-count estimate (mirrors copyDir's own traversal + langFilter) used to warn the user
// how many files a given platform/lang combo will drop into their project, BEFORE they confirm.
function countFiles(srcDir, filterEnabled = false) {
  if (!fs.existsSync(srcDir)) return 0;
  let count = 0;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  const siblingNames = new Set(entries.filter((e) => !e.isDirectory()).map((e) => e.name));
  for (const entry of entries) {
    const s = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(s, filterEnabled);
    } else if (!filterEnabled || langFilter(entry.name, siblingNames)) {
      count++;
    }
  }
  return count;
}

// Same estimate logic as copyClaudeSkills' fan-out, without touching disk.
function countClaudeSkills(srcSkillsDir, skillFilter = null) {
  if (!fs.existsSync(srcSkillsDir)) return 0;
  let count = 0;
  for (const skill of fs.readdirSync(srcSkillsDir, { withFileTypes: true })) {
    if (!skill.isDirectory()) continue;
    if (skillFilter && !skillFilter(skill.name)) continue;
    const skillDir = path.join(srcSkillsDir, skill.name);
    const has = (n) => fs.existsSync(path.join(skillDir, n));
    if (LANG === 'all') {
      count += 1 + (has('SKILL.en.md') ? 1 : 0) + (has('SKILL.ja.md') ? 1 : 0);
    } else {
      count += 1;
    }
  }
  return count;
}

// Copy Claude Code Agent Skills from source `.claude/skills/<skill>/SKILL[.lang].md`.
// Source bundles SKILL.md (VN) + SKILL.en.md + SKILL.ja.md in one folder. Per --lang:
//   vi/en/ja  → write the chosen language as `<skill>/SKILL.md` (one folder per skill)
//   all       → fan out to `<skill>/`, `<skill>-en/`, `<skill>-ja/` (each `SKILL.md`)
// skillFilter (lite) matches the skill folder name (e.g. "dev-analyze").
function copyClaudeSkills(srcSkillsDir, dstSkillsDir, skillFilter = null) {
  if (!fs.existsSync(srcSkillsDir)) return { copied: 0, skipped: 0, updated: 0, filtered: 0 };
  let copied = 0, skipped = 0, updated = 0, filtered = 0;
  for (const skill of fs.readdirSync(srcSkillsDir, { withFileTypes: true })) {
    if (!skill.isDirectory()) continue;
    if (skillFilter && !skillFilter(skill.name)) { filtered++; continue; }
    const skillDir = path.join(srcSkillsDir, skill.name);
    const has = (n) => fs.existsSync(path.join(skillDir, n));
    const targets = [];
    if (LANG === 'vi') {
      targets.push({ src: 'SKILL.md', folder: skill.name });
    } else if (LANG === 'en') {
      targets.push({ src: has('SKILL.en.md') ? 'SKILL.en.md' : 'SKILL.md', folder: skill.name });
    } else if (LANG === 'ja') {
      targets.push({ src: has('SKILL.ja.md') ? 'SKILL.ja.md' : 'SKILL.md', folder: skill.name });
    } else { // all
      targets.push({ src: 'SKILL.md', folder: skill.name });
      if (has('SKILL.en.md')) targets.push({ src: 'SKILL.en.md', folder: `${skill.name}-en` });
      if (has('SKILL.ja.md')) targets.push({ src: 'SKILL.ja.md', folder: `${skill.name}-ja` });
    }
    for (const t of targets) {
      const s = path.join(skillDir, t.src);
      if (!fs.existsSync(s)) continue;
      const ddir = path.join(dstSkillsDir, t.folder);
      fs.mkdirSync(ddir, { recursive: true });
      const d = path.join(ddir, 'SKILL.md');
      if (fs.existsSync(d)) {
        if (UPDATE) { fs.copyFileSync(s, d); updated++; } else { skipped++; }
      } else {
        fs.copyFileSync(s, d); copied++;
      }
    }
  }
  return { copied, skipped, updated, filtered };
}

function resultMsg(label, { copied, skipped, updated, filtered = 0 }) {
  const parts = [];
  if (copied > 0) parts.push(`${copied} added`);
  if (updated > 0) parts.push(`${updated} updated`);
  if (skipped > 0) parts.push(`${skipped} skipped`);
  if (filtered > 0) parts.push(`${filtered} filtered`);
  const icon = (copied === 0 && updated === 0) ? pc.yellow('○') : pc.green('◆');
  return `${icon} ${label}${parts.length ? pc.dim(` — ${parts.join(', ')}`) : ''}`;
}

async function main() {
  console.log(pc.cyan(BANNER));
  console.log();

  const flavour = LITE ? `${PLATFORM} · Lite` : PLATFORM;
  const title = UPDATE ? ` Agentic Development Lifecycle — Update (${flavour}) ` : ` Agentic Development Lifecycle — Setup (${flavour}) `;
  intro(pc.bgCyan(pc.black(title)));

  if (LITE && PLATFORM_KEY !== 'claude') {
    cancel('--lite is only supported for Claude Code. Remove --opencode/--cursor/--antigravity to use --lite.');
    process.exit(1);
  }

  if (src === dst) {
    cancel('Source and target are the same directory.');
    process.exit(1);
  }

  log.info(`Target: ${pc.green(dst)}`);
  log.info(`Platform: ${pc.cyan(PLATFORM)} (use ${pc.dim('--opencode | --cursor | --antigravity | --codex | --copilot')} to switch)`);
  const langHelp = (PLATFORM_KEY === 'codex' || PLATFORM_KEY === 'copilot') ? '--lang ja|en|vi' : '--lang ja|en|vi|all';
  log.info(`Language: ${pc.cyan(LANG)} (use ${pc.dim(langHelp)} to filter)`);
  if (LITE) log.info(`Mode: ${pc.magenta('Developer Lite')} ${pc.dim('— 8 skills only')}`);

  // Approximate file count for this platform+lang(+lite) combo, shown BEFORE the user confirms — the
  // default (no --lang flag) installs all 3 languages and can be ~2-3x more files than a single
  // language. "~" because codex routes through a transformer whose output count can differ slightly.
  const skillFilter = LITE ? (name) => LITE_SKILLS.has(name) : null;
  const agentFilterForCount = LITE ? (relPath) => LITE_AGENTS.has(relPath) : null;
  let estFiles = (PLATFORM_KEY === 'opencode' || PLATFORM_KEY === 'antigravity')
    ? countFiles(path.join(src, '.opencode', 'skills'), true)
    : countClaudeSkills(path.join(src, '.claude', 'skills'), skillFilter);
  estFiles += countFiles(path.join(src, 'templates'), true);
  if (PLATFORM_KEY === 'claude') {
    // countFiles' filterEnabled path doesn't know about the LITE agent allow-list; approximate it
    // by counting only matching files directly when LITE, otherwise the full lang-filtered count.
    estFiles += LITE
      ? (fs.existsSync(path.join(src, 'agents')) ? fs.readdirSync(path.join(src, 'agents')).filter((f) => (agentFilterForCount ? agentFilterForCount(f) : true)).length : 0)
      : countFiles(path.join(src, 'agents'), true);
  }
  if (!LITE) {
    estFiles += countFiles(path.join(src, 'docs', 'workflows'), true) + 5; // docRootFiles + config file + a few gitkeeps
  } else {
    estFiles += 1; // config file only
  }
  if (LANG !== 'all') {
    log.info(`Estimated files: ${pc.cyan(`~${estFiles}`)}`);
  } else {
    log.info(`Estimated files: ${pc.cyan(`~${estFiles}`)} ${pc.dim('(add --lang vi|en|ja to install one language only — about a third of this)')}`);
  }

  if (!YES) {
    const action = UPDATE ? 'Update' : 'Install';
    const ok = await confirm({
      message: `${action} ${PLATFORM} framework (~${estFiles} files, lang: ${LANG}) into ${pc.bold(path.basename(dst))}?`,
    });
    if (isCancel(ok) || !ok) {
      cancel(`${action} cancelled.`);
      process.exit(0);
    }
  }

  console.log();

  const s = spinner();

  // 1. Commands directory (lang-aware)
  const cmdDstPath = path.join(dst, COMMANDS_DIR);
  fs.mkdirSync(path.dirname(cmdDstPath), { recursive: true });

  if (PLATFORM_KEY === 'codex') {
    s.start('Transforming Claude Code skills -> Codex skills...');
    const cmdResult = codexTransformer.copyAndTransform(
      path.join(src, '.claude', 'skills'),
      cmdDstPath,
      { lang: LANG, update: UPDATE, agentsDir: path.join(src, 'agents') }
    );
    s.stop(resultMsg(`${COMMANDS_DIR}/`, cmdResult));
  } else if (PLATFORM_KEY === 'copilot') {
    s.start('Transforming Claude Code skills -> Copilot CLI skills...');
    const cmdResult = copilotTransformer.copyAndTransform(
      path.join(src, '.claude', 'skills'),
      cmdDstPath,
      { lang: LANG, update: UPDATE, agentsDir: path.join(src, 'agents') }
    );
    s.stop(resultMsg(`${COMMANDS_DIR}/`, cmdResult));
  } else if (PLATFORM_KEY === 'opencode') {
    s.start('Copying OpenCode skill files...');
    const cmdResult = copyDir(path.join(src, '.opencode', 'skills'), cmdDstPath, true);
    s.stop(resultMsg(`${COMMANDS_DIR}/`, cmdResult));
  } else if (PLATFORM_KEY === 'antigravity') {
    s.start('Copying Antigravity skill files (from OpenCode source)...');
    const cmdResult = antigravityTransformer.copyAndTransform(
      path.join(src, '.opencode', 'skills'),
      cmdDstPath,
      { langFilter, getLangDestName, update: UPDATE }
    );
    s.stop(resultMsg(`${COMMANDS_DIR}/`, cmdResult));
  } else if (PLATFORM_KEY === 'cursor') {
    s.start('Transforming Claude Code skills → Cursor rules (.mdc)...');
    const cmdResult = cursorTransformer.copyAndTransform(
      path.join(src, '.claude', 'skills'),
      cmdDstPath,
      { lang: LANG, update: UPDATE }
    );
    s.stop(resultMsg(`${COMMANDS_DIR}/`, cmdResult));
  } else {
    s.start('Copying Claude Code skills...');
    const skillFilter = LITE ? (name) => LITE_SKILLS.has(name) : null;
    const cmdResult = copyClaudeSkills(path.join(src, '.claude', 'skills'), cmdDstPath, skillFilter);
    s.stop(resultMsg(`${COMMANDS_DIR}/`, cmdResult));
  }

  // 2. agents (Claude Code only — other platforms do not use agents/ directory) — lang-aware
  if (PLATFORM_KEY === 'claude') {
    s.start('Copying agent definitions...');
    const agentFilter = LITE ? (relPath) => LITE_AGENTS.has(relPath) : null;
    const agentsResult = copyDir(path.join(src, 'agents'), path.join(dst, 'agents'), true, agentFilter);
    s.stop(resultMsg('agents/', agentsResult));
  }

  // 3. templates — lang-aware (.html files always pass filter via langFilter).
  // protectExisting=true: README documents these as user-customizable skeletons — --update must not
  // clobber a template the user has already hand-edited. New templates (not yet on disk) still copy.
  s.start('Copying templates...');
  const templatesResult = copyDir(path.join(src, 'templates'), path.join(dst, 'templates'), true, null, '', true);
  s.stop(resultMsg('templates/', templatesResult));

  const docsDst = path.join(dst, 'docs');
  fs.mkdirSync(docsDst, { recursive: true });

  if (!LITE) {
    // 4. docs/workflows — lang-aware
    s.start('Copying workflow docs...');
    const workflowsResult = copyDir(path.join(src, 'docs', 'workflows'), path.join(docsDst, 'workflows'), true);
    s.stop(resultMsg('docs/workflows/', workflowsResult));

    // 4b. docs root framework files (always overwrite on --update — static reference docs, not
    // meant to be hand-edited, same category as skill files) — lang-aware
    s.start('Copying framework doc files...');
    const docRootFiles = ['risk-classifier.md', 'risk-classifier.ja.md'];
    const docRootSiblings = new Set(docRootFiles);
    let docRootCopied = 0, docRootUpdated = 0, docRootFiltered = 0;
    for (const file of docRootFiles) {
      const srcFile = path.join(src, 'docs', file);
      if (!fs.existsSync(srcFile)) continue;
      if (!langFilter(file, docRootSiblings)) { docRootFiltered++; continue; }
      const dstFileName = getLangDestName(file);
      const dstFile = path.join(docsDst, dstFileName);
      if (fs.existsSync(dstFile)) {
        if (UPDATE) { fs.copyFileSync(srcFile, dstFile); docRootUpdated++; }
      } else {
        fs.copyFileSync(srcFile, dstFile);
        docRootCopied++;
      }
    }
    s.stop(resultMsg('docs/ framework files', { copied: docRootCopied, skipped: docRootFiles.length - docRootCopied - docRootUpdated - docRootFiltered, updated: docRootUpdated, filtered: docRootFiltered }));

    // 4d. docs/analysis (framework content — skip-if-exists, overwrite on --update)
    s.start('Copying analysis docs...');
    const analysisResult = copyDir(path.join(src, 'docs', 'analysis'), path.join(docsDst, 'analysis'));
    s.stop(resultMsg('docs/analysis/', analysisResult));

    // 4c. improvement-backlog.md — only if missing (user-mutable, never overwrite)
    const backlogSrc = path.join(src, 'docs', 'improvement-backlog.md');
    const backlogDst = path.join(docsDst, 'improvement-backlog.md');
    if (fs.existsSync(backlogSrc) && !fs.existsSync(backlogDst)) {
      fs.copyFileSync(backlogSrc, backlogDst);
      log.info(`${pc.green('◆')} docs/improvement-backlog.md ${pc.dim('— created')}`);
    }

    // 4e. validation-matrix.md — LIVING doc (docs/improvement-backlog.md IB-002: agents/users populate
    // it during real use). Only if missing, never overwritten — same exists-guard as improvement-backlog
    // above, NOT the "always overwrite" docRootFiles treatment (it used to be miscategorized there).
    const vmSrc = path.join(src, 'docs', 'validation-matrix.md');
    const vmDst = path.join(docsDst, 'validation-matrix.md');
    if (fs.existsSync(vmSrc) && !fs.existsSync(vmDst)) {
      fs.copyFileSync(vmSrc, vmDst);
      log.info(`${pc.green('◆')} docs/validation-matrix.md ${pc.dim('— created')}`);
    }
  }

  // 5. empty doc dirs
  s.start('Creating doc directories...');
  const docDirs = ['api', 'screens', 'tasks', 'decisions'];
  let docCreated = 0;
  for (const dir of docDirs) {
    const dirPath = path.join(docsDst, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(path.join(dirPath, '.gitkeep'), '');
      docCreated++;
    }
  }
  s.stop(
    docCreated === 0
      ? `${pc.yellow('○')} docs/ subdirs ${pc.dim('— already exist')}`
      : `${pc.green('◆')} docs/ subdirs ${pc.dim(`— ${docCreated} created`)}`
  );

  // 6. Main config file — varies per platform:
  //    Claude Code → CLAUDE.md, OpenCode/Antigravity/Codex → AGENTS.md, Cursor → .cursorrules
  const configDst = path.join(dst, CONFIG_FILE);
  if (PLATFORM_KEY === 'codex') {
    s.start(fs.existsSync(configDst) ? 'Updating ADLC section in AGENTS.md...' : 'Creating AGENTS.md...');
    const existing = fs.existsSync(configDst) ? fs.readFileSync(configDst, 'utf8') : '';
    fs.writeFileSync(configDst, codexTransformer.mergeManagedAgentsSection(existing));
    s.stop(`${pc.green('◆')} AGENTS.md ${pc.dim('— ADLC managed section')}`);
  } else if (PLATFORM_KEY === 'copilot') {
    s.start(fs.existsSync(configDst) ? 'Updating ADLC section in copilot-instructions.md...' : 'Creating .github/copilot-instructions.md...');
    fs.mkdirSync(path.dirname(configDst), { recursive: true });
    const existing = fs.existsSync(configDst) ? fs.readFileSync(configDst, 'utf8') : '';
    fs.writeFileSync(configDst, copilotTransformer.mergeManagedInstructions(existing));
    s.stop(`${pc.green('◆')} .github/copilot-instructions.md ${pc.dim('— ADLC managed section')}`);
  } else if (fs.existsSync(configDst)) {
    // NOTE: this branch used to be gated on `&& !UPDATE`, which meant an explicit --update fell
    // through to the unconditional copy below and completely replaced the user's CLAUDE.md/AGENTS.md/
    // .cursorrules with the framework's own template — destroying any customization. This file is the
    // one users are explicitly told to edit ("Customization per project" in CLAUDE.md), so it must
    // never be silently overwritten, --update or not — matching the documented installer policy
    // ("Do not overwrite existing files — Skip and inform the user to merge manually"). codex/copilot are
    // unaffected — they merge into a marked section above.
    const referenceSrc = (PLATFORM_KEY === 'opencode' || PLATFORM_KEY === 'antigravity')
      && fs.existsSync(path.join(src, 'AGENTS.md'))
      ? path.join(src, 'AGENTS.md')
      : path.join(src, 'CLAUDE.md');
    if (UPDATE) {
      log.warn(`${CONFIG_FILE} already exists — skipped to protect your edits; framework doc changes were NOT merged`);
      log.info(`To update manually, compare against: ${pc.dim(referenceSrc)}`);
    } else {
      log.warn(`${CONFIG_FILE} already exists — merge manually`);
      log.info(`Reference: ${pc.dim(referenceSrc)}`);
    }
  } else {
    // Only reached when configDst does not exist yet — a genuine fresh install, including the very
    // first --update run before this file has ever been created.
    s.start(`Copying ${CONFIG_FILE}...`);
    if (PLATFORM_KEY === 'opencode' || PLATFORM_KEY === 'antigravity') {
      const ocConfigSrc = path.join(src, 'AGENTS.md');
      const ccConfigSrc = path.join(src, 'CLAUDE.md');
      const actualSrc = fs.existsSync(ocConfigSrc) ? ocConfigSrc : ccConfigSrc;
      fs.copyFileSync(actualSrc, configDst);
    } else {
      const claudeSrc = LITE
        ? path.join(__dirname, 'CLAUDE.lite.md')
        : path.join(src, 'CLAUDE.md');
      fs.copyFileSync(claudeSrc, configDst);
    }
    s.stop(`${pc.green('◆')} ${CONFIG_FILE}`);
  }

  console.log();

  if (PLATFORM_KEY === 'codex') {
    note(
      [
        `1. Review the ADLC managed section in ${pc.cyan('AGENTS.md')}.`,
        `   Your existing project instructions remain outside that section.`,
        ``,
        `2. Codex discovers 35 skills from ${pc.cyan('.agents/skills/')}.`,
        `   Installed language: ${pc.cyan(LANG)}.`,
        ``,
        `3. Start Codex in this project and make a natural request such as:`,
        `   ${pc.dim('"Phân tích task này và đề xuất phương án implement"')}`,
        ``,
        `4. Skills delegate bounded subtasks when supported, then fall back to inline execution.`,
      ].join('\n'),
      'Next steps'
    );
  } else if (PLATFORM_KEY === 'copilot') {
    note(
      [
        `1. Review the ADLC managed section in ${pc.cyan('.github/copilot-instructions.md')}.`,
        `   Your existing repository instructions remain outside that section.`,
        ``,
        `2. Copilot CLI / Copilot coding agent discovers 35 skills from ${pc.cyan('.github/skills/')}.`,
        `   Installed language: ${pc.cyan(LANG)}.`,
        ``,
        `3. Start Copilot in this repo and make a natural request such as:`,
        `   ${pc.dim('"Phân tích task này và đề xuất phương án implement"')}`,
        ``,
        `4. Caveat: this target is new (added ${pc.dim('bin/transformers/copilot.js')}) and has not been`,
        `   smoke-tested against a live Copilot CLI session — file an issue if skill discovery misbehaves.`,
      ].join('\n'),
      'Next steps'
    );
  } else if (PLATFORM_KEY === 'opencode') {
    note(
      [
        `1. Open ${pc.cyan(CONFIG_FILE)} → update Project Context section`,
        `   (project name, client, repo URL, tech stack)`,
        ``,
        `2. Skills are auto-loaded from ${pc.cyan('.opencode/skills/')}`,
        `   OpenCode auto-triggers skills based on description matching.`,
        ``,
        `3. Test a skill — type a natural request like:`,
        `   ${pc.dim('"Phân tích task này và đề xuất phương án implement"')}`,
        ``,
        `4. Available skills:`,
        `   /pm:ideate  /ba:spec  /dev:analyze  /qa:testplan ...`,
      ].join('\n'),
      'Next steps'
    );
  } else if (PLATFORM_KEY === 'cursor') {
    note(
      [
        `1. Open ${pc.cyan(CONFIG_FILE)} → update Project Context section`,
        `   (project name, client, repo URL, tech stack)`,
        ``,
        `2. Open project in Cursor → Cmd/Ctrl+Shift+P → ${pc.cyan('"Cursor: Reload Rules"')}`,
        `   Rules auto-attach to Agent based on ${pc.dim('description')} matching.`,
        ``,
        `3. Test a skill — open Cursor Agent and type:`,
        `   ${pc.dim('"phân tích task này và đề xuất phương án implement"')}`,
        ``,
        `4. Caveats:`,
        `   - Cursor Agent is single-agent; multi-agent skills (eg ${pc.dim('/dev:analyze')}) run inline.`,
        `   - User gates render as plain markdown prompts (no native TUI).`,
      ].join('\n'),
      'Next steps'
    );
  } else if (PLATFORM_KEY === 'antigravity') {
    note(
      [
        `1. Open ${pc.cyan(CONFIG_FILE)} → update Project Context section`,
        `   (project name, client, repo URL, tech stack)`,
        ``,
        `2. Open project in Antigravity → Agent Manager loads ${pc.cyan('.antigravity/skills/')}`,
        `   Skills are ported from the OpenCode source (task/question syntax).`,
        ``,
        `3. Test a skill — type a natural request like:`,
        `   ${pc.dim('"Phân tích task này và đề xuất phương án implement"')}`,
        ``,
        `4. Caveat: Antigravity skill convention is still stabilising — if Agent Manager`,
        `   misinterprets ${pc.dim('task()/question()')} syntax, file an issue.`,
      ].join('\n'),
      'Next steps'
    );
  } else if (LITE) {
    note(
      [
        `1. Open project in Claude Code:`,
        `   ${pc.cyan('claude .')}`,
        ``,
        `2. The 8 lite skills:`,
        `   ${pc.cyan('/dev-analyze  /dev-implement  /dev-review  /dev-pr')}`,
        `   ${pc.cyan('/dev-debug    /sec-review     /arch-adr     /docs-update')}`,
        ``,
        `3. Workflow: ${pc.dim('/dev-analyze → /dev-implement → /dev-review → /dev-pr → merge')}`,
        ``,
        `4. Want PM/BA/QA/Ops too? Upgrade later with:`,
        `   ${pc.cyan('npx agentic-development-lifecycle --update --yes')}`,
      ].join('\n'),
      'Next steps'
    );
  } else {
    note(
      [
        `1. Open ${pc.cyan(CONFIG_FILE)} → update Project Context section`,
        `   (project name, client, repo URL, tech stack)`,
        ``,
        `2. Open project in Claude Code:`,
        `   ${pc.cyan('claude .')}`,
        ``,
        `3. Skills auto-trigger from natural language (or type ${pc.cyan('/')} to invoke):`,
        `   /pm-ideate  /ba-spec  /dev-analyze  /qa-testplan ...`,
      ].join('\n'),
      'Next steps'
    );
  }

  outro(pc.green(UPDATE ? 'Framework updated successfully!' : 'Framework installed successfully!'));
}

main().catch((err) => {
  log.error(String(err));
  process.exit(1);
});

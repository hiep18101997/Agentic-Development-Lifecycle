#!/usr/bin/env node

const { intro, outro, confirm, spinner, log, cancel, isCancel, note } = require('@clack/prompts');
const pc = require('picocolors');
const fs = require('fs');
const path = require('path');
const cursorTransformer = require('./transformers/cursor');
const antigravityTransformer = require('./transformers/antigravity');

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

// Developer Lite: 8 skills only. Path is "<role>/<name>" (no extension, no lang suffix).
const LITE_SKILLS = new Set([
  'dev/analyze', 'dev/implement', 'dev/review', 'dev/pr', 'dev/debug',
  'sec/review', 'arch/adr', 'docs/update',
]);

// Agents spawned by the lite skill set.
const LITE_AGENTS = new Set([
  'diff-reader.md', 'doc-updater.md', 'pr-resolver.md', 'review-reader.md',
]);

function liteSkillPath(relPath) {
  // "dev/analyze.ja.md" -> "dev/analyze"; "arch/adr.md" -> "arch/adr"
  return relPath.replace(/\.(en|ja)\.(md|txt)$/, '').replace(/\.(md|txt)$/, '');
}

function parsePlatform() {
  const flags = process.argv;
  const set = [];
  if (flags.includes('--cursor') || flags.includes('-c')) set.push('cursor');
  if (flags.includes('--antigravity') || flags.includes('-a')) set.push('antigravity');
  if (flags.includes('--opencode') || flags.includes('-o')) set.push('opencode');
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
    if (['ja', 'en', 'vi', 'all'].includes(v)) return v;
    console.error(pc.red(`Invalid --lang value: ${v}. Must be one of: ja, en, vi, all`));
    process.exit(1);
  }
  return 'all';
}
const LANG = parseLang();

const PLATFORM_CONFIG = {
  claude:      { label: 'Claude Code',  banner: BANNER_CC,     commandsDir: '.claude/commands',   configFile: 'CLAUDE.md' },
  opencode:    { label: 'OpenCode',     banner: BANNER_OC,     commandsDir: '.opencode/skills',   configFile: 'AGENTS.md' },
  cursor:      { label: 'Cursor',       banner: BANNER_CURSOR, commandsDir: '.cursor/rules',      configFile: '.cursorrules' },
  antigravity: { label: 'Antigravity',  banner: BANNER_AG,     commandsDir: '.antigravity/skills', configFile: 'AGENTS.md' },
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

function copyDir(srcDir, dstDir, filterEnabled = false, pathFilter = null, relRoot = '') {
  if (!fs.existsSync(srcDir)) return { copied: 0, skipped: 0, updated: 0, filtered: 0 };
  fs.mkdirSync(dstDir, { recursive: true });
  let copied = 0, skipped = 0, updated = 0, filtered = 0;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  const siblingNames = new Set(entries.filter((e) => !e.isDirectory()).map((e) => e.name));
  for (const entry of entries) {
    const s = path.join(srcDir, entry.name);
    const relPath = relRoot ? `${relRoot}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      const sub = copyDir(s, path.join(dstDir, entry.name), filterEnabled, pathFilter, relPath);
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
        if (UPDATE) {
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
  log.info(`Platform: ${pc.cyan(PLATFORM)} (use ${pc.dim('--opencode | --cursor | --antigravity')} to switch)`);
  log.info(`Language: ${pc.cyan(LANG)} (use ${pc.dim('--lang ja|en|vi|all')} to filter)`);
  if (LITE) log.info(`Mode: ${pc.magenta('Developer Lite')} ${pc.dim('— 8 skills only')}`);

  if (!YES) {
    const action = UPDATE ? 'Update' : 'Install';
    const ok = await confirm({
      message: `${action} ${PLATFORM} framework into ${pc.bold(path.basename(dst))}?`,
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

  if (PLATFORM_KEY === 'opencode') {
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
    s.start('Transforming Claude Code commands → Cursor rules (.mdc)...');
    const cmdResult = cursorTransformer.copyAndTransform(
      path.join(src, '.claude', 'commands'),
      cmdDstPath,
      { langFilter, getLangDestName, update: UPDATE }
    );
    s.stop(resultMsg(`${COMMANDS_DIR}/`, cmdResult));
  } else {
    s.start('Copying skill commands...');
    const skillFilter = LITE ? (relPath) => LITE_SKILLS.has(liteSkillPath(relPath)) : null;
    const cmdResult = copyDir(path.join(src, '.claude', 'commands'), cmdDstPath, true, skillFilter);
    s.stop(resultMsg(`${COMMANDS_DIR}/`, cmdResult));
  }

  // 2. agents (Claude Code only — other platforms do not use agents/ directory) — lang-aware
  if (PLATFORM_KEY === 'claude') {
    s.start('Copying agent definitions...');
    const agentFilter = LITE ? (relPath) => LITE_AGENTS.has(relPath) : null;
    const agentsResult = copyDir(path.join(src, 'agents'), path.join(dst, 'agents'), true, agentFilter);
    s.stop(resultMsg('agents/', agentsResult));
  }

  // 3. templates — lang-aware (.html files always pass filter via langFilter)
  s.start('Copying templates...');
  const templatesResult = copyDir(path.join(src, 'templates'), path.join(dst, 'templates'), true);
  s.stop(resultMsg('templates/', templatesResult));

  const docsDst = path.join(dst, 'docs');
  fs.mkdirSync(docsDst, { recursive: true });

  if (!LITE) {
    // 4. docs/workflows — lang-aware
    s.start('Copying workflow docs...');
    const workflowsResult = copyDir(path.join(src, 'docs', 'workflows'), path.join(docsDst, 'workflows'), true);
    s.stop(resultMsg('docs/workflows/', workflowsResult));

    // 4b. docs root framework files (always overwrite on --update) — lang-aware
    s.start('Copying framework doc files...');
    const docRootFiles = ['risk-classifier.md', 'risk-classifier.ja.md', 'validation-matrix.md'];
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
  //    Claude Code → CLAUDE.md, OpenCode/Antigravity → AGENTS.md, Cursor → .cursorrules
  const configDst = path.join(dst, CONFIG_FILE);
  if (fs.existsSync(configDst) && !UPDATE) {
    log.warn(`${CONFIG_FILE} already exists — merge manually`);
    log.info(`Reference: ${pc.dim(path.join(src, 'CLAUDE.md'))}`);
  } else {
    s.start(UPDATE ? `Updating ${CONFIG_FILE}...` : `Copying ${CONFIG_FILE}...`);
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

  if (PLATFORM_KEY === 'opencode') {
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
        `   ${pc.cyan('/dev:analyze  /dev:implement  /dev:review  /dev:pr')}`,
        `   ${pc.cyan('/dev:debug    /sec:review     /arch:adr     /docs:update')}`,
        ``,
        `3. Workflow: ${pc.dim('/dev:analyze → /dev:implement → /dev:review → /dev:pr → merge')}`,
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
        `3. Type ${pc.cyan('/')} to see available commands:`,
        `   /pm:ideate  /ba:spec  /dev:analyze  /qa:testplan ...`,
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

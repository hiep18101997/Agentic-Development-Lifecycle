const fs = require('fs');
const path = require('path');

const START_MARKER = '<!-- ADLC:START -->';
const END_MARKER = '<!-- ADLC:END -->';

function normalize(source) {
  return source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
}

function extractFrontmatter(source) {
  const match = normalize(source).match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error('Skill source is missing YAML frontmatter.');
  const description = match[1].match(/^description:\s*([\s\S]*?)(?=\n[a-z][\w-]*:|$)/m);
  if (!description) throw new Error('Skill source is missing a description.');
  return { description: description[1].trimEnd(), body: normalize(source).slice(match[0].length) };
}

function transformBody(body, skillName) {
  return body
    .replace(/^# Skill:\s*\/[\w-]+(?:\:[\w-]+)?/m, `# ${skillName}`)
    .replace(/\bAskUserQuestion\b/g, 'structured user-input step')
    .replace(/\bAgent\s*\(/g, 'delegation step (use a subagent when available; otherwise run inline) (')
    .replace(/\bmodel:\s*"(?:haiku|sonnet)"/g, 'execution: "delegate when available"')
    .replace(/\bmodel:\s*(?:haiku|sonnet)\b/g, 'execution: delegate when available')
    .replace(/\b(?:haiku|sonnet)\b/gi, 'specialist');
}

function transformSkill(source, skillName) {
  const { description, body } = extractFrontmatter(source);
  return `---\nname: ${skillName}\ndescription: ${description}\n---\n\n${transformBody(body, skillName)}`;
}

function transformAgentContract(source, contractLabel = 'Codex') {
  let result = normalize(source).replace(/^---\n[\s\S]*?\n---\n/, '');
  result = result
    .replace(/\*\*Recommended model\*\*:\s*(?:haiku|sonnet)[^\n]*\n?/gi, '')
    .replace(/\bmodel:\s*(?:haiku|sonnet)\b/gi, 'execution: delegate when available')
    .replace(/\b(?:haiku|sonnet)\b/gi, 'specialist');
  return `# ${contractLabel} Delegation Contract\n\n${result}`;
}

function referencedAgents(source) {
  const matches = normalize(source).matchAll(/agents\/([a-z0-9-]+\.md)/g);
  return [...new Set([...matches].map((match) => match[1]))];
}

function copyAndTransform(srcDir, dstDir, opts = {}) {
  const { lang, update, agentsDir, contractLabel } = opts;
  if (!fs.existsSync(srcDir)) return { copied: 0, skipped: 0, updated: 0, filtered: 0 };
  fs.mkdirSync(dstDir, { recursive: true });
  let copied = 0;
  let skipped = 0;
  let updated = 0;
  let filtered = 0;

  for (const skill of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (!skill.isDirectory()) continue;
    const skillName = skill.name;
    const skillSourceDir = path.join(srcDir, skillName);
    const requested = lang === 'en' ? 'SKILL.en.md' : lang === 'ja' ? 'SKILL.ja.md' : 'SKILL.md';
    const sourcePath = path.join(skillSourceDir, fs.existsSync(path.join(skillSourceDir, requested)) ? requested : 'SKILL.md');
    if (!fs.existsSync(sourcePath)) { filtered++; continue; }

    const skillDir = path.join(dstDir, skillName);
    const destinationPath = path.join(skillDir, 'SKILL.md');
    const exists = fs.existsSync(destinationPath);
    if (exists && !update) { skipped++; continue; }

    fs.mkdirSync(skillDir, { recursive: true });
    const source = fs.readFileSync(sourcePath, 'utf8');
    fs.writeFileSync(destinationPath, transformSkill(source, skillName));
    for (const agentName of referencedAgents(source)) {
      const agentPath = path.join(agentsDir, agentName);
      if (!fs.existsSync(agentPath)) continue;
      const referenceDir = path.join(skillDir, 'references');
      fs.mkdirSync(referenceDir, { recursive: true });
      fs.writeFileSync(path.join(referenceDir, agentName), transformAgentContract(fs.readFileSync(agentPath, 'utf8'), contractLabel));
    }
    if (exists) updated++; else copied++;
  }
  return { copied, skipped, updated, filtered };
}

function managedAgentsSection() {
  return [
    START_MARKER,
    '# Agentic Development Lifecycle',
    '',
    'Use the ADLC workflows in `.agents/skills/` when a request matches their description.',
    'Classify risk with `docs/risk-classifier.md` before changing code. Ask for confirmation at high-risk gates.',
    'Keep changes scoped, run relevant validation, and review the diff before proposing a push.',
    END_MARKER,
  ].join('\n');
}

function mergeManagedAgentsSection(existing) {
  const current = normalize(existing);
  const starts = current.split(START_MARKER).length - 1;
  const ends = current.split(END_MARKER).length - 1;
  if (starts !== ends || starts > 1) {
    throw new Error('AGENTS.md has malformed ADLC managed-section markers; repair them before running the installer.');
  }
  if (starts === 1) {
    const start = current.indexOf(START_MARKER);
    const endMarker = current.indexOf(END_MARKER, start);
    if (endMarker < start) {
      throw new Error('AGENTS.md has malformed ADLC managed-section markers; repair them before running the installer.');
    }
    const end = endMarker + END_MARKER.length;
    return `${current.slice(0, start)}${managedAgentsSection()}${current.slice(end)}`;
  }
  return current.trimEnd() ? `${current.trimEnd()}\n\n${managedAgentsSection()}\n` : `${managedAgentsSection()}\n`;
}

module.exports = {
  copyAndTransform,
  mergeManagedAgentsSection,
  transformSkill,
};

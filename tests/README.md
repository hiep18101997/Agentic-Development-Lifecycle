# Skill-Triggering Tests

Verifies Claude Code auto-invokes the correct skill when given a naive natural-language prompt — no explicit `/role:command`, no framework jargon.

Mirrors the pattern from [obra/superpowers](https://github.com/obra/superpowers/tree/main/tests/skill-triggering).

## Prerequisites

- `claude` CLI authenticated (`claude --version`)
- `jq` installed (`jq --version`)

## Run all tests

```bash
bash tests/skill-triggering/run-all.sh
```

Flags:
- `--verbose` — print full output per test
- `--filter "ba-*"` — run subset matching glob

Exit code: `0` = all pass, `1` = any failure.

## Run a single test

```bash
bash tests/skill-triggering/run-test.sh tests/skill-triggering/prompts/ba-spec.txt
```

## How it works

1. Prompt file contains one naive sentence that should trigger the target skill.
2. Runner infers expected skill from filename: the basename maps directly to the skill folder name — `ba-spec.txt` → `/ba-spec`.
3. Calls `claude -p --output-format stream-json` with the prompt as stdin.
4. Passes if the stream-json log contains a `Skill` tool invocation with `input.skill == "ba-spec"`.

## Results

Raw logs: `tests/.results/<timestamp>/<skill>/log.json` — excluded from git.

## Adding a test

1. Add `tests/skill-triggering/prompts/<role>-<name>.txt` with one trigger sentence.
2. Ensure the corresponding skill exists at `.claude/skills/<role-command>/SKILL.md`.
3. Run the single-test command to verify.

## Debugging failures

If a test fails:
- Open the log: `tests/.results/<ts>/<skill>/log.json`
- Search for `"name":"Skill"` to see what skill (if any) Claude actually triggered
- Refine the trigger phrases in `.claude/skills/<role-command>/SKILL.md` `description` frontmatter, or adjust the prompt

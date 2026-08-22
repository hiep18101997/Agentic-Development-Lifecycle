# Changelog

All notable changes to this project will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [Unreleased]

### Added

- **`--lite` install flag** — `npx agentic-development-lifecycle --yes --lite` installs the 8-skill Developer Lite subset (`/dev-analyze` `/dev-implement` `/dev-review` `/dev-pr` `/dev-debug` `/sec-review` `/arch-adr` `/docs-update`) plus 4 supporting agents, using a slim `bin/CLAUDE.lite.md`. Combines with `--lang ja|en|vi`. Claude Code only — rejects combinations with `--opencode/--cursor/--antigravity`.

### Removed

- **`packages/developer-lite/`** — the standalone sub-package and its broken `npx github:hiepdnh/Agentic-Development-Lifecycle/packages/developer-lite --yes` install path (npm doesn't support subdirectories of GitHub repos via npx, so the command silently no-op'd). Use `--lite` on the main installer instead.

### Fixed

- **`bin/install.js --update` no longer destroys user customizations.** Confirmed by direct reproduction: an existing `CLAUDE.md`/`AGENTS.md`/`.cursorrules` (Claude Code/OpenCode/Antigravity/Cursor targets) was being **completely replaced** by the framework's own template on every `--update` run — any project-specific edits were silently lost. This contradicted the installer's own documented policy ("Do not overwrite existing files — Skip and inform the user to merge manually"). `--update` now treats an existing config file the same safe way a fresh install already does — skip + warn (with a message explaining *why*, pointing at the framework's version to diff manually) — instead of overwriting. Codex CLI was never affected (it already merges into a marked section).
- **`templates/*` no longer overwritten on `--update`.** Templates are documented as user-customizable skeletons; a hand-edited template now survives `--update` (new templates not yet present still get added).
- **`docs/validation-matrix.md` no longer overwritten on `--update`.** It's a living document populated by agents/users during real use (see `docs/improvement-backlog.md` IB-002) — it was miscategorized alongside static reference docs (`risk-classifier.md`, which correctly keeps always-overwriting) and is now protected the same way as `docs/improvement-backlog.md`.
- **Installer now shows an estimated file count before the confirm prompt** — a totally default install (no `--lang` flag) drops all 3 languages onto disk (~181 files for Claude Code) with no prior warning; the confirm message and a `log.info` line now show `~N files` for the actual platform/lang/`--lite` combination.
- Reference path in the "already exists — merge manually" warning for OpenCode/Antigravity now correctly points at `AGENTS.md` instead of always citing `CLAUDE.md`.

---

## [1.3.0] — 2026-05-15

### Added

- **Japanese language support** — 32 skills × JP variants across Claude Code + OpenCode (`.ja.md` files). Includes JP business terminology (変更依頼, 引き継ぎ, 月次保守報告書, リリースノート), formal 敬語 language, and client-facing fields (`顧客名`, `プロジェクト名`, `対象システム`).
- **Cursor platform** — `--cursor` install flag generates `.cursor/rules/<role>/<name>.mdc` + `.cursorrules`. Transformer rewrites frontmatter, strips `# Skill:` prefix, relabels `Agent(...)` as `Sub-task Agent(...)`.
- **Antigravity platform** — `--antigravity` install flag generates `.antigravity/skills/` + `AGENTS.md` (aliases OpenCode `task()`/`question()` syntax).
- **`--lang` filter** — `--lang ja|en|vi|all` installs single-language variant **without language suffix** (`spec.ja.md` → installed as `spec.md`). Sibling-aware fallback includes untranslated files automatically.
- **17 template types upgraded to industry standards** — all templates now have VN/EN/JP variants (55 files total):
  - `test-plan` — IEEE 829 with TC matrix, exit criteria, risk section
  - `bug-report` — Severity/Priority/Steps to Reproduce
  - `user-story` — Connextra format + INVEST checklist
  - `analysis` — implementation options + trade-offs
  - `verification` — IEEE 829 sign-off
  - `adr` — MADR (Markdown Architectural Decision Records)
  - `change-request` — 変更依頼書 with impact analysis + approval trail
  - `release-notes` — Keep a Changelog format
  - `handover` — 引き継ぎ書 with codebase map + contact matrix
  - `monthly-maintenance-report` — 月次保守報告書
  - `incident-report` — Google SRE / PagerDuty blameless postmortem
  - `baseline-screen` — IPA 基本設計書 conventions
  - `baseline-api` — IPA API定義書 conventions
  - `github-issue`, `pr-description`, `task-doc-requirements`, `audit` — EN/JP variants added
- **CI pipelines** — installer smoke matrix (4 platforms × ubuntu/windows) + skill file validator on every PR
- **`npm run validate`** — `node scripts/validate-skills.js` checks VN/EN/JP variant completeness + frontmatter `name:`/`description:` per skill
- **JP foundation docs** — `docs/risk-classifier.ja.md`, `assets/ask-first-gates.ja.md`, `templates/jp-vn-en-glossary.md` (70+ terms), `docs/workflows/role-guide.ja.md`, `docs/workflows/sprint-lifecycle.ja.md`

### Fixed

- Installer `docRootFiles` loop: applied sibling-aware `langFilter` + `getLangDestName` (previously VN base files could be installed alongside lang variant with suffix)
- OpenCode `ba:reverse.en.md` / `ba:reverse.ja.md`: template reference pointed to VN `audit.md` instead of lang-specific variant
- OpenCode `be:changerequest.ja.md`: Step 4a referenced VN `change-request.md` instead of `change-request.ja.md`
- `ops:incident` (Claude Code + OpenCode, VN + EN): RCA output path changed from `docs/decisions/` to `docs/reports/`

### Changed

- Removed VTI company branding for open-source release
- `templates/release-notes.ja.md`: added `顧客名` + `プロジェクト名` fields to frontmatter

---

## [1.1.3] — 2026-05-01

- Initial public release with VN + EN skill variants
- 32 skills for Claude Code + OpenCode
- `--opencode` install flag
- Interactive installer with `@clack/prompts`

---

[1.3.0]: https://github.com/hiepdnh/Agentic-Development-Lifecycle/compare/v1.1.3...v1.3.0
[1.1.3]: https://github.com/hiepdnh/Agentic-Development-Lifecycle/releases/tag/v1.1.3

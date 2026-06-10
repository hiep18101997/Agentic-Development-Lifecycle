#!/bin/bash
# Agentic Development Lifecycle — Setup Script (macOS / Linux)
# Usage: ./setup.sh [target-path] [--update|-u] [--yes|-y]
#   ./setup.sh                       Install to current directory
#   ./setup.sh /path/to/project      Install to target path
#   ./setup.sh --update              Update existing install (overwrites framework files)
#   ./setup.sh --yes                 Skip confirmation prompt

set -e

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse flags + positional target path
UPDATE=false
YES=false
LANG_FILTER="all"
ARGS=()
expect_lang=false
for arg in "$@"; do
    if $expect_lang; then
        LANG_FILTER="$arg"
        expect_lang=false
        continue
    fi
    case "$arg" in
        --update|-u)    UPDATE=true ;;
        --yes|-y)       YES=true ;;
        --lang|-l)      expect_lang=true ;;
        --lang=*)       LANG_FILTER="${arg#*=}" ;;
        *)              ARGS+=("$arg") ;;
    esac
done
TARGET_DIR="${ARGS[0]:-$(pwd)}"

case "$LANG_FILTER" in
    ja|en|vi|all) ;;
    *) echo "ERROR: --lang must be one of: ja, en, vi, all (got: $LANG_FILTER)"; exit 1 ;;
esac

# Returns 0 (true) if filename should be included for current LANG_FILTER.
lang_filter() {
    local fname="$1"
    [ "$LANG_FILTER" = "all" ] && return 0
    case "$fname" in
        *.md|*.txt) ;;
        *) return 0 ;;
    esac
    case "$fname" in
        *.ja.md|*.ja.txt) [ "$LANG_FILTER" = "ja" ] && return 0 || return 1 ;;
        *.en.md|*.en.txt) [ "$LANG_FILTER" = "en" ] && return 0 || return 1 ;;
        *) [ "$LANG_FILTER" = "vi" ] && return 0
           [ "$LANG_FILTER" = "ja" ] && return 0
           [ "$LANG_FILTER" = "en" ] && return 0
           return 1 ;;
    esac
}

echo ""
if $UPDATE; then
    echo "Agentic Development Lifecycle — Update"
else
    echo "Agentic Development Lifecycle — Setup"
fi
echo "================================="
echo "Source   : $SOURCE_DIR"
echo "Target   : $TARGET_DIR"
echo "Language : $LANG_FILTER  (--lang ja|en|vi|all)"
echo ""

# Validate
if [ ! -d "$TARGET_DIR" ]; then
    echo "ERROR: Target path does not exist: $TARGET_DIR"
    exit 1
fi

if [ "$SOURCE_DIR" = "$TARGET_DIR" ]; then
    echo "ERROR: Source and target are the same directory."
    exit 1
fi

if ! $YES; then
    verb=$($UPDATE && echo Update || echo Install)
    read -p "$verb framework into '$TARGET_DIR'? [y/N] " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi
fi

echo ""

copy_dir() {
    local src="$1"
    local dst="$2"
    local label="$3"
    local apply_filter="${4:-true}"
    [ ! -d "$src" ] && return
    mkdir -p "$dst"
    local copied=0 skipped=0 updated=0 filtered=0
    while IFS= read -r -d '' f; do
        local rel="${f#./}"
        local s_file="$src/$rel"
        local d_file="$dst/$rel"
        local base="$(basename "$rel")"
        if $apply_filter && ! lang_filter "$base"; then
            filtered=$((filtered+1))
            continue
        fi
        mkdir -p "$(dirname "$d_file")"
        if [ -e "$d_file" ]; then
            if $UPDATE; then
                cp "$s_file" "$d_file"
                updated=$((updated+1))
            else
                skipped=$((skipped+1))
            fi
        else
            cp "$s_file" "$d_file"
            copied=$((copied+1))
        fi
    done < <(cd "$src" && find . -type f -print0)
    local parts=""
    [ $copied -gt 0 ]   && parts+="$copied added, "
    [ $updated -gt 0 ]  && parts+="$updated updated, "
    [ $skipped -gt 0 ]  && parts+="$skipped skipped, "
    [ $filtered -gt 0 ] && parts+="$filtered filtered, "
    parts="${parts%, }"
    if [ $copied -eq 0 ] && [ $updated -eq 0 ]; then
        echo "  [SKIP] $label${parts:+ — $parts}"
    else
        echo "  [OK]   $label${parts:+ — $parts}"
    fi
}

# 1. .claude/skills (Agent Skills — copies each skill folder verbatim, incl. SKILL.en/ja.md)
echo "Copying Claude Code skills..."
mkdir -p "$TARGET_DIR/.claude"
copy_dir "$SOURCE_DIR/.claude/skills" "$TARGET_DIR/.claude/skills" ".claude/skills/"

# 2. agents
echo "Copying agent definitions..."
copy_dir "$SOURCE_DIR/agents" "$TARGET_DIR/agents" "agents/"

# 3. templates
echo "Copying templates..."
copy_dir "$SOURCE_DIR/templates" "$TARGET_DIR/templates" "templates/"

# 4. docs/workflows
echo "Copying workflow docs..."
mkdir -p "$TARGET_DIR/docs"
copy_dir "$SOURCE_DIR/docs/workflows" "$TARGET_DIR/docs/workflows" "docs/workflows/"

# 4b. docs root framework files (skip-if-exists, overwrite on --update)
echo "Copying framework doc files..."
for f in risk-classifier.md risk-classifier.ja.md validation-matrix.md; do
    s_file="$SOURCE_DIR/docs/$f"
    d_file="$TARGET_DIR/docs/$f"
    [ ! -f "$s_file" ] && continue
    if ! lang_filter "$f"; then
        echo "  [SKIP] docs/$f — filtered ($LANG_FILTER)"
        continue
    fi
    if [ -e "$d_file" ]; then
        if $UPDATE; then
            cp "$s_file" "$d_file"
            echo "  [OK]   docs/$f — updated"
        else
            echo "  [SKIP] docs/$f"
        fi
    else
        cp "$s_file" "$d_file"
        echo "  [OK]   docs/$f"
    fi
done

# 4c. improvement-backlog.md — only if missing (user-mutable, never overwrite)
backlog_src="$SOURCE_DIR/docs/improvement-backlog.md"
backlog_dst="$TARGET_DIR/docs/improvement-backlog.md"
if [ -f "$backlog_src" ] && [ ! -f "$backlog_dst" ]; then
    cp "$backlog_src" "$backlog_dst"
    echo "  [OK]   docs/improvement-backlog.md — created"
fi

# 4d. docs/analysis (framework content)
echo "Copying analysis docs..."
copy_dir "$SOURCE_DIR/docs/analysis" "$TARGET_DIR/docs/analysis" "docs/analysis/"

# 5. Create empty doc dirs
echo "Creating doc directories..."
for dir in api screens tasks decisions; do
    dir_path="$TARGET_DIR/docs/$dir"
    if [ ! -d "$dir_path" ]; then
        mkdir -p "$dir_path"
        touch "$dir_path/.gitkeep"
        echo "  [OK]   docs/$dir/"
    else
        echo "  [SKIP] docs/$dir/ already exists"
    fi
done

# 6. CLAUDE.md
echo "Copying CLAUDE.md..."
if [ -f "$TARGET_DIR/CLAUDE.md" ] && ! $UPDATE; then
    echo "  [SKIP] CLAUDE.md already exists — merge manually"
    echo "         Reference: $SOURCE_DIR/CLAUDE.md"
else
    cp "$SOURCE_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.md"
    echo "  [OK]   CLAUDE.md"
fi

echo ""
if $UPDATE; then
    echo "Framework updated successfully!"
else
    echo "Done!"
fi
echo ""
echo "Next steps:"
echo "  1. Open CLAUDE.md and update the Project Context section:"
echo "       - Company/project name, customer, repo URL, tech stack"
echo ""
echo "  2. Open your project in Claude Code:"
echo "       claude ."
echo ""
echo "  3. Type / to see available commands:"
echo "       /pm:ideate   /ba:spec   /dev:analyze   /qa:testplan ..."
echo ""
echo "  Docs: https://github.com/hiepdnh/Agentic-Development-Lifecycle"

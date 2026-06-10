#!/usr/bin/env bash
# Usage: run-test.sh <prompt-file> [max-turns=3]
set -euo pipefail

PROMPT_FILE="${1:-}"
MAX_TURNS="${2:-3}"

if [[ -z "$PROMPT_FILE" ]]; then
  echo "Usage: $0 <prompt-file> [max-turns]" >&2
  exit 1
fi

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "ERROR: prompt file not found: $PROMPT_FILE" >&2
  exit 1
fi

# Skill folder name == prompt basename (ba-spec.txt -> /ba-spec, ba-user-story.txt -> /ba-user-story)
BASENAME="$(basename "$PROMPT_FILE" .txt)"
EXPECTED_SKILL="$BASENAME"

# Output directory — sanitize skill name for filesystem (: invalid on Windows)
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SAFE_NAME="${EXPECTED_SKILL//:/-}"
RESULTS_DIR="$REPO_ROOT/tests/.results/$TIMESTAMP/$SAFE_NAME"
mkdir -p "$RESULTS_DIR"

LOG_FILE="$RESULTS_DIR/log.json"

echo "Testing: $EXPECTED_SKILL"
echo "  Prompt: $PROMPT_FILE"
echo "  Log:    $LOG_FILE"

# Run claude with stream-json output (--verbose required with stream-json)
timeout 300 claude \
  -p \
  --verbose \
  --output-format stream-json \
  --max-turns "$MAX_TURNS" \
  < "$PROMPT_FILE" > "$LOG_FILE" 2>&1 || true

# Check for Skill tool invocation matching expected skill
# Handles plain "ba:spec" and namespaced "plugin:ba:spec" forms
TRIGGERED_SKILLS="$(jq -r '
  select(.type == "assistant") |
  .message.content[]? |
  select(.type == "tool_use" and .name == "Skill") |
  .input.skill // empty
' "$LOG_FILE" 2>/dev/null | sort -u || echo "")"

# Check pass condition: expected skill appears in triggered skills
if echo "$TRIGGERED_SKILLS" | grep -qE "(^|:)${EXPECTED_SKILL}$"; then
  echo "  PASS — triggered: $EXPECTED_SKILL"
  exit 0
else
  echo "  FAIL — expected: $EXPECTED_SKILL"
  if [[ -n "$TRIGGERED_SKILLS" ]]; then
    echo "         triggered: $TRIGGERED_SKILLS"
  else
    echo "         triggered: (none)"
  fi
  echo "  See full log: $LOG_FILE"
  exit 1
fi

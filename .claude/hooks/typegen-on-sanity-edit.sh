#!/usr/bin/env bash
# PostToolUse hook: regenerate Sanity types when a file under sanity/ is edited,
# keeping sanity.types.ts in sync with schema/GROQ changes.
# Reads the hook payload (JSON) on stdin; runs `pnpm typegen` only for sanity/ edits.
set -euo pipefail

payload="$(cat)"
file_path="$(printf '%s' "$payload" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')"

# No path, or not under the sanity/ directory → nothing to do.
case "$file_path" in
  */sanity/*|sanity/*) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"
pnpm typegen >/dev/null 2>&1 || {
  echo '{"systemMessage":"Sanity typegen failed after schema edit — run `pnpm typegen` manually."}'
  exit 0
}
echo '{"systemMessage":"Regenerated sanity.types.ts"}'

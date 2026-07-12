#!/usr/bin/env bash
# Stop hook: gate turn completion on a clean typecheck + lint.
# On failure, feeds the output back to Claude so it fixes before finishing.
# Guards against a loop via stop_hook_active.
set -uo pipefail

payload="$(cat)"
if [ "$(printf '%s' "$payload" | jq -r '.stop_hook_active // false')" = "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"
output="$(pnpm typecheck 2>&1 && pnpm lint 2>&1)"
if [ $? -ne 0 ]; then
  reason="$(printf 'typecheck or lint failed — fix before finishing:\n%s' "$output" | tail -40)"
  jq -n --arg r "$reason" '{decision:"block", reason:$r}'
  exit 0
fi
exit 0

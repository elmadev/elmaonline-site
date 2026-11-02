#!/bin/sh
# Runs origin/dev's api on port 3004 in compare mode, as the baseline for
# `yarn compare --baseline http://localhost:3004 --sql`. The code lives in a
# git worktree next to this repo (override with COMPARE_BASELINE_DIR).
set -e

root=$(git rev-parse --show-toplevel)
dir=${COMPARE_BASELINE_DIR:-$root/../elmaonline-site-baseline}

git -C "$root" fetch origin dev
if [ -d "$dir" ]; then
  git -C "$dir" checkout --detach origin/dev
else
  git -C "$root" worktree add --detach "$dir" origin/dev
fi

cd "$dir/api"
corepack yarn install --immutable
echo "Baseline: $(git rev-parse --short HEAD) on http://localhost:3004"
COMPARE=1 TZ=UTC PORT=3004 NODE_ENV=development exec node src/index.js

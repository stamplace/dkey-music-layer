#!/usr/bin/env bash
set -euo pipefail

REPO="dkey-music-layer"
OWNER="${GITHUB_OWNER:-stamplace}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required" >&2
  exit 1
fi

git init
git add .
git commit -m "chore: bootstrap DKey Music Layer production foundation"

if command -v gh >/dev/null 2>&1; then
  gh repo create "$OWNER/$REPO" --private --source=. --remote=origin --push
else
  echo "GitHub CLI not found. Create https://github.com/new manually, then run:"
  echo "git branch -M main"
  echo "git remote add origin git@github.com:$OWNER/$REPO.git"
  echo "git push -u origin main"
fi

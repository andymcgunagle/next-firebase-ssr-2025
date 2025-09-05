#!/usr/bin/env sh

# Pull the latest changes from the remote 'origin' branch
git pull origin main

# Check if package.json or package-lock.json has changed, then run npm install
if git diff --name-only HEAD@{1} HEAD | grep -E '(^package\.json$|^package-lock\.json$)'; then
  echo "Changes detected in package.json or package-lock.json. Running npm install..."
  npm ci
fi

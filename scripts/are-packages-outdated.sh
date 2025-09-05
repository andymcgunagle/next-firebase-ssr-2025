#!/usr/bin/env sh

# Check if at least one package name was provided
if [ $# -eq 0 ]; then
  echo "Usage: $0 <package-name> [additional-package-names...]"
  exit 1
fi

for package in "$@"; do
  echo "🔍 Checking if '$package' is outdated..."
  npm outdated -g "$package" > /dev/null

  if [ $? -eq 1 ]; then
    echo "💾 '$package' needs to be updated."
    npm update -g "$package"
  else
    echo "👍 '$package' is up to date."
  fi
done

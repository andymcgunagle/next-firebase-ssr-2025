#!/usr/bin/env sh

# This script uses the zsh shell. If you are using a different shell, make sure to adjust the shebang above accordingly.

npm outdated -g firebase-tools

# $? is the exit status of the most recently executed command
# If the exit status is 1, then firebase-tools needs to be updated
if [ $? -eq 1 ]; then
  echo "💾 firebase-tools needs to be updated."
  npm update -g firebase-tools
else
  echo "👍 firebase-tools is up to date."
fi

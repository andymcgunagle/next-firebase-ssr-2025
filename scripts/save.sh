#!/usr/bin/env sh

# Display current git branch
git branch

# Run linting with next
eslint

# Add all changes to the staging area
git add .

# Check if the --default-message flag is provided
if [[ "$1" == "--default-message" ]]; then
  # Commit with the default message
  git commit -m "Adds minor changes"
else
  # Commit changes, allowing interactive message entry
  git commit
fi

# Push to the 'main' branch on the remote 'origin'
git push origin main

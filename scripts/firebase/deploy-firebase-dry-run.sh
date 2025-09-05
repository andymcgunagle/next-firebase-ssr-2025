#!/usr/bin/env sh

# This script uses the zsh shell. If you are using a different shell, make sure to adjust the shebang above accordingly.

# Set the email for Firebase login
FIREBASE_LOGIN_EMAIL="your-email-here@example.com"

# Source the environment options from an external file
source "$(dirname "$0")/environments.sh"

zsh "$(dirname "$0")/check-firebase-tools.sh"

# Loop through environments and do a dry run of the deployment
for env in "${ENVIRONMENTS[@]}"; do
  firebase use "$env"
  firebase deploy --dry-run
done

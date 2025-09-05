#!/usr/bin/env sh

# This script uses the zsh shell. If you are using a different shell, make sure to adjust the shebang above accordingly.

# Example: "$(stylize_text bold $'\nWhich project would you like to use?\n')"
function stylize_text() {
  local style=$1
  local text=$2
  local bold='\033[1m'
  local italic='\033[3m'
  local reset='\033[0m'

  case $style in
    "bold")
      echo "${bold}${text}${reset}"
      ;;
    "italic")
      echo "${italic}${text}${reset}"
      ;;
    "bold-italic")
      echo "${bold}${italic}${text}${reset}"
      ;;
    *)
      echo $text
      ;;
  esac
}

function deploy() {
  if [[ "$1" == "all" ]]; then
    firebase deploy --only firestore:rules,functions,storage
  elif [[ "$1" == "secret" ]]; then
    read -p "$(stylize_text bold $'\nEnter a name for your new secret: ')" secret_name
    firebase functions:secrets:set "$secret_name"
  else
    firebase deploy --only "$1"
  fi
}

function use_environment() {
  firebase use "$1"
}

function showInvalidOptionMessage() {
  echo "$(stylize_text bold-italic $'\nInvalid option, please choose again.')"
}

# Set the email for Firebase login
FIREBASE_LOGIN_EMAIL="your-email-here@example.com"

# Prevent select menus from wrapping
COLUMNS=1

# The select menu prompt
PS3="$(stylize_text italic $'\nInput a number, then press \'return\': ')"

# Define the deploymentOptions and environments arrays
deploymentOptions=(
  "Firestore rules"
  "Firestore indexes"
  "Storage rules"
  "All (firestore rules, firestore indexes, storage rules))"
)

# Source the environment options from an external file
source "$(dirname "$0")/environments.sh"

zsh "$(dirname "$0")/check-firebase-tools.sh"

# Prompt the user to select a deployment option
echo "$(stylize_text bold $'\nWhat would you like to deploy to Firebase?\n')"

select option in "${deploymentOptions[@]}"
do
  case $option in
    "Firestore rules")
      DEPLOY_OPTION="firestore:rules"
      break
      ;;
    "Firestore indexes")
      DEPLOY_OPTION="firestore:indexes"
      break
      ;;
    "Storage rules")
      DEPLOY_OPTION="storage"
      break
      ;;
    "All (firestore rules, firestore indexes, storage rules)")
      DEPLOY_OPTION="all"
      break
      ;;
    "Set a secret")
      DEPLOY_OPTION="secret"
      break
      ;;
    *)
      showInvalidOptionMessage
      ;;
  esac
done

# Function to deploy to a specific environment
deployEnvironment() {
  local selected_environment="$1"
  use_environment "$selected_environment"
  deploy "$DEPLOY_OPTION"
}

# Prompt the user to select an environment
echo "$(stylize_text bold $'\nWhich environment would you like to deploy to?\n')"

select environment in "${ENVIRONMENTS[@]}"; do
  case $environment in
    "All environments")
      for env in "${ENVIRONMENTS[@]::${#ENVIRONMENTS[@]}-1}"; do
        deployEnvironment "$env"
      done
      break
      ;;
    *)
      if [[ "${ENVIRONMENTS[*]}" =~ "$environment" ]]; then
        deployEnvironment "$environment"
        break
      else
        showInvalidOptionMessage
      fi
      ;;
  esac
done

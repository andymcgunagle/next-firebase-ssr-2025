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
  if [[ "$1" == "secret" ]]; then
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
  "Functions"
  "Set a secret"
)

functionsOptions=(
  "Deploy all functions"
  "Deploy functions group"
  "Deploy specific function"
)

# Source the environment options from an external file
source "$(dirname "$0")/environments.sh"

zsh "$(dirname "$0")/check-firebase-tools.sh"

# Prompt the user to select a deployment option
echo "$(stylize_text bold $'\nWhat would you like to deploy to Firebase?\n')"
select option in "${deploymentOptions[@]}"
do
  case $option in
    "Functions")
      echo "$(stylize_text bold $'\nDeploy all functions or specific functions?\n')"
      select functionOption in "${functionsOptions[@]}"
      do
        case $functionOption in
          "Deploy all functions")
            DEPLOY_OPTION="functions"
            break
            ;;
          "Deploy functions group")
            read -p "$(stylize_text bold $'\nWhich function group would you like to deploy?: ')" function_group_name
            DEPLOY_OPTION="functions:$function_group_name"
            break
            ;;
          "Deploy specific function")
            read -p "$(stylize_text bold $'\nWhich function - entered as groupName-functionName - would you like to deploy?: ')" function_name
            DEPLOY_OPTION="functions:$function_name"
            break
            ;;
          *)
            showInvalidOptionMessage
            ;;
        esac
      done
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

# Prompt the user to select an environment
echo "$(stylize_text bold $'\nWhich environment would you like to deploy to?\n')"
select environment in "${ENVIRONMENTS[@]}"; do
  case $environment in
    "All environments")
      for env in "${ENVIRONMENTS[@]::${#ENVIRONMENTS[@]}-1}"; do
        use_environment "$env"
        deploy "$DEPLOY_OPTION"
      done
      break
      ;;
    *)
      if [[ "${ENVIRONMENTS[*]}" =~ "$environment" ]]; then
        use_environment "$environment"
        deploy "$DEPLOY_OPTION"
        break
      else
        showInvalidOptionMessage
      fi
      ;;
  esac
done

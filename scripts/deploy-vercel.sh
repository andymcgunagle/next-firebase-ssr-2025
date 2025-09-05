#!/usr/bin/env sh

zsh "$(dirname "$0")/are-packages-outdated.sh" vercel

vercel --prod
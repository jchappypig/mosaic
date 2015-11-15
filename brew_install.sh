#!/usr/bin/env bash
set -eu

# Test if a Homebrew formula is installed
test_formula_installed() {
  brew ls --versions "$1" | grep -q "$1"
}

# Test if Homebrew is installed
test_homebrew_installed() {
  which brew >/dev/null 2>&1
}

main() {
  if [[ "$@" == --help ]]; then
    local prog=$(basename "$0")
    cat <<EOF
usage: ${prog} formula

Ensure that a Homebrew formula is installed
EOF
    exit
  fi

  if ! test_homebrew_installed; then
    echo "Homebrew isn't installed, see http://brew.sh" >&2
    exit 1
  fi

  local formula="$1"
  if test_formula_installed "${formula}"; then
    echo "${formula} is already installed"
  else
    brew install "${formula}"
  fi
}

main "$@"

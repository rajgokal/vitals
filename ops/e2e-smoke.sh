#!/bin/bash
set -e

# Source environment variables
if [ -f ~/.config/env/global.env ]; then
  source ~/.config/env/global.env
fi

# Also source local .env file if it exists
if [ -f .env.local ]; then
  source .env.local
fi

# Set required environment variables for Playwright tests
export VITALS_URL="${VITALS_URL:-https://vitals.rajgokal.com}"
export VITALS_PASSWORD="${NEROVIEW_PASSWORD}"
export VITALS_AGENT_KEY="${VITALS_AGENT_KEY}"

# Check that required variables are set
if [ -z "$VITALS_PASSWORD" ]; then
  echo "Error: VITALS_PASSWORD (from NEROVIEW_PASSWORD) is not set"
  exit 1
fi

if [ -z "$VITALS_AGENT_KEY" ]; then
  echo "Error: VITALS_AGENT_KEY is not set"
  exit 1
fi

echo "Running Playwright e2e tests for Vitals..."
echo "VITALS_URL: $VITALS_URL"

# Change to project directory
cd "$(dirname "$0")/.."

# Run Playwright tests
npx playwright test --reporter=list

# Exit with Playwright's exit code
exit $?
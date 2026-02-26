#!/bin/bash
# Run Playwright e2e tests against live Vitals dashboard
set -euo pipefail

source ~/.config/env/global.env 2>/dev/null || true

export VITALS_PASSWORD="${NEROVIEW_PASSWORD:-nero2026}"
export VITALS_AGENT_KEY="${VITALS_AGENT_KEY}"
export VITALS_URL="${VITALS_URL:-https://vitals.rajgokal.com}"

cd "$(dirname "$0")/.."
npx playwright test --reporter=list "$@"

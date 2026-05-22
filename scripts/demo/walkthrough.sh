#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "==> Demo: Prisma client"
npm run db:generate

echo "==> Demo: database migrations"
npm run db:migrate -- --skip-seed 2>/dev/null || npx prisma migrate deploy

echo "==> Demo: seed data"
npm run db:seed

echo "==> Demo: Playwright Chromium"
npm run test:e2e:install

echo "==> Demo: record walkthrough video"
npm run demo:walkthrough

VIDEO="$(find test-results/demo -name '*.webm' -type f 2>/dev/null | head -1)"
if [[ -n "${VIDEO}" ]]; then
  echo ""
  echo "Video saved: ${VIDEO}"
else
  echo ""
  echo "Run finished. Check test-results/demo/ for video.webm"
fi

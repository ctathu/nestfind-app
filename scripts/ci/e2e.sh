#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "==> E2E: generate Prisma client"
npm run db:generate

echo "==> E2E: apply migrations"
npm run db:migrate -- --skip-seed 2>/dev/null || npx prisma migrate deploy

echo "==> E2E: seed database"
npm run db:seed

echo "==> E2E: install Playwright browser"
npm run test:e2e:install

echo "==> E2E: run Playwright"
CI=true npm run test:e2e

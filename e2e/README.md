# NestFind E2E Tests

Production-grade Playwright suite for the NestFind property rental platform.

## Prerequisites

- Node.js 20+
- PostgreSQL running locally
- `DATABASE_URL` in `.env` (see `.env.example`)

## Setup

```bash
# Install dependencies
npm install

# Database
npm run db:migrate
npm run db:seed

# Playwright browser
npm run test:e2e:install
```

## Run tests

```bash
# Full suite (starts dev server automatically)
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Smoke only
npm run test:e2e:smoke

# API contract tests only (listings + AI search/metrics)
npm run test:e2e:api

# AI intent validation unit tests
npm run test:unit

# Mobile/responsive project
npm run test:e2e:mobile

# View HTML report
npm run test:e2e:report
```

## CI

```bash
chmod +x scripts/ci/e2e.sh
./scripts/ci/e2e.sh
```

GitHub Actions: `.github/workflows/e2e.yml`

## Architecture

| Path | Purpose |
|------|---------|
| `e2e/pages/` | Page Object Model (POM) |
| `e2e/fixtures/` | Custom Playwright fixtures |
| `e2e/utils/` | Selectors, API helpers, network mocks, a11y |
| `e2e/tests/smoke/` | Fast sanity checks |
| `e2e/tests/flows/` | Critical user journeys |
| `e2e/tests/responsive/` | Mobile viewport tests |
| `e2e/tests/api/` | REST API validation |
| `e2e/tests/states/` | Empty, loading, error UI |
| `e2e/tests/a11y/` | axe-core accessibility |
| `e2e/tests/demo/` | Product walkthrough (video recording) |

## Selector strategy

Use `data-testid` via `e2e/utils/selectors.ts`. ARIA labels remain as fallback for Radix components (e.g. guest select).

## Stale listing IDs

If you re-seed the database (`npm run db:seed`), delete `e2e/.artifacts/` or re-run tests — the suite refreshes fixture ids automatically on each run via `global-setup`.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PLAYWRIGHT_BASE_URL` | `http://127.0.0.1:3000` | App base URL |
| `CI` | — | Enables retries, GitHub reporter, production build |
| `DEMO_SLOW_MO` | `900` | Playwright launch slow motion (demo video) |
| `DEMO_PAUSE_MS` | `1400` | Pause between demo steps |
| `DEMO_MAP_OPEN_MS` | `1000` | Wait after opening map modal before next action |

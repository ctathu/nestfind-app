# NestFind Backend Architecture

Production-grade REST API for property discovery, built on Next.js App Router, Prisma, and PostgreSQL.

## Backend Architecture

```
nestfind-app/
├── prisma/
│   ├── schema.prisma      # PostgreSQL models
│   └── seed.ts            # Idempotent seed (deleteMany + create)
├── src/
│   ├── app/api/           # Thin HTTP handlers (routes only)
│   │   ├── health/
│   │   ├── stats/
│   │   └── listings/
│   │       ├── route.ts           # List + filter
│   │       ├── search/route.ts    # Full-text search
│   │       ├── filters/route.ts   # Filter metadata
│   │       └── [id]/route.ts      # Property detail
│   └── server/
│       ├── db/prisma.ts           # Singleton Prisma client
│       ├── dto/                     # Zod DTOs + parsers
│       ├── errors/                  # AppError + codes
│       ├── lib/api-response.ts      # Envelope + error handler
│       ├── mappers/                 # Prisma → domain types
│       ├── repositories/            # Data access (Prisma queries)
│       ├── services/                # Business logic
│       └── data/                    # Server-only helpers (SSR)
```

**Flow:** `Route → DTO validation → Service → Repository → Prisma → PostgreSQL`

Routes stay thin; business rules live in services; SQL/Prisma stays in repositories.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Liveness + DB connectivity |
| `GET` | `/api/stats` | Platform stats (listings, cities, avg price) |
| `GET` | `/api/listings` | Paginated list with filters |
| `GET` | `/api/listings/search` | Search by `q` (+ optional location/guests) |
| `GET` | `/api/listings/filters` | Available filter metadata |
| `GET` | `/api/listings/:id` | Single property detail |
| `POST` | `/api/ai/search` | Natural language → validated intent + listings |
| `GET` | `/api/ai/metrics` | AI agent monitoring aggregates |

### AI search (`POST /api/ai/search`)

Body:

```json
{ "prompt": "Studio in Hanoi for 2 under $45", "limit": 12, "provider": "RULES" }
```

Response `data` includes `intent`, `validation`, `listings`, and `provider` (`RULES` | `OPENAI`).

Intent is parsed by rules (default) or OpenAI when `OPENAI_API_KEY` is set, then validated in `src/server/ai/validation/intent-validator.ts` before querying listings.

### AI metrics (`GET /api/ai/metrics`)

Query: `windowHours` (default 24). Reads `ai_agent_events` for success rate, latency percentiles, validation/fallback rates, and per-provider breakdown.

### Response envelope

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Listing not found",
    "code": "NOT_FOUND"
  }
}
```

Client helper: `src/lib/api-client.ts` (`fetchApi` unwraps `data`).

## Prisma Schema

See `prisma/schema.prisma`. Core model: `Property` mapped to `properties` table.

- Enums: `ListingCategory`, `CardAccent`
- Indexes on `location`, `district`, `category`, `featured`, `pricePerNight`, `rating`, `maxGuests`

## Service Layer

| Service | Responsibility |
|---------|----------------|
| `PropertyService` | List, search, detail, filter metadata |
| `StatsService` | Aggregated stats with env baselines |

Repositories encapsulate `where` builders for location, category, price, rating, featured, and search `OR` clauses.

## Validation

Zod DTOs in `src/server/dto/`:

- `listings-query.dto.ts` — list/filter pagination
- `search-query.dto.ts` — required `q`, optional scoping
- `property-params.dto.ts` — `:id` path param

Invalid input → `400` with `VALIDATION_ERROR` and Zod `flatten()` details.

## Error Handling

- `AppError` — typed errors (`notFound`, `validation`, `internal`)
- `handleRouteError` — maps `AppError`, Prisma errors, and unknown errors to JSON + status
- `ErrorCodes` — `VALIDATION_ERROR`, `NOT_FOUND`, `INTERNAL_ERROR`, `DATABASE_ERROR`

## Seed Strategy

1. Copy `.env.example` → `.env` and set `DATABASE_URL`
2. `npm run db:push` (or `db:migrate` for migrations)
3. `npm run db:seed`

Seed deletes all properties and inserts 6 curated listings (same data as former mock). Safe to re-run in dev.

## API Examples

### List properties (Hanoi, featured)

```bash
curl "http://localhost:3000/api/listings?location=Hanoi&featured=true&limit=4"
```

### Filter by category and guests

```bash
curl "http://localhost:3000/api/listings?category=APARTMENT&guests=4&limit=20&offset=0"
```

### Search

```bash
curl "http://localhost:3000/api/listings/search?q=studio&location=Hanoi"
```

### Filter metadata

```bash
curl "http://localhost:3000/api/listings/filters"
```

### Property detail

```bash
curl "http://localhost:3000/api/listings/<property-id>"
```

### Stats

```bash
curl "http://localhost:3000/api/stats"
```

## Local setup

```bash
cp .env.example .env
# Start PostgreSQL, then:
npm run db:push
npm run db:seed
npm run dev
```

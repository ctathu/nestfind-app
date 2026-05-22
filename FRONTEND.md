# NestFind Frontend

Pixel-perfect implementation of `nestfind.png` using Next.js 15 App Router, TypeScript, and Tailwind CSS v4.

## Folder structure

```
src/
├── app/
│   ├── api/
│   │   ├── health/route.ts
│   │   ├── listings/route.ts
│   │   ├── listings/[id]/route.ts
│   │   └── stats/route.ts
│   ├── listings/
│   │   ├── page.tsx              # Search + filter results
│   │   ├── loading.tsx
│   │   └── [id]/
│   │       ├── page.tsx          # Property detail (Server Component)
│   │       ├── loading.tsx
│   │       └── not-found.tsx
│   ├── layout.tsx
│   ├── page.tsx                  # Homepage
│   ├── loading.tsx
│   └── globals.css
├── components/
│   ├── common/                   # Logo, EmptyState, ErrorState, LoadingGrid
│   ├── features/
│   │   ├── home/                 # Hero, Stats, Featured, Map CTA
│   │   ├── listings/             # PropertyCard, filters, detail
│   │   └── map/                  # MapModal
│   ├── layout/                   # Navbar, Footer, Container
│   └── ui/                       # Button, Input, Badge, Select, Dialog
├── hooks/
│   ├── use-debounced-value.ts
│   ├── use-listings.ts
│   └── use-stats.ts
├── lib/
│   ├── mock-data.ts
│   ├── listings-service.ts
│   ├── filters.ts
│   └── format-listing.ts
└── types/
    └── listing.ts
```

## Component breakdown

| Component | Type | Role |
|-----------|------|------|
| `Navbar` | Client | Sticky header, mobile menu, auth CTAs |
| `HeroSection` | Client | Headline, `SearchBar`, `CategoryChips` |
| `StatsSection` | Client | Fetches `/api/stats`, stat cards |
| `FeaturedListings` | Client | Grid with loading / empty / error |
| `PropertyCard` | Client | Pastel featured variant + photo listing variant |
| `MapCTA` | Client | Banner + `MapModal` |
| `ListingDetail` | Server | Detail page layout |
| `ListingsPageClient` | Client | Full search + filters |

## Mock API

- `GET /api/listings` — query: `location`, `category`, `topRated`, `budgetFriendly`, `featured`, `guests`, `limit`, `offset`
- `GET /api/listings/[id]`
- `GET /api/stats`
- `GET /api/health`

Data lives in `src/lib/mock-data.ts` and is filtered in `src/lib/listings-service.ts`.

## Reusable hooks

- **`useDebouncedValue`** — debounce location search input (350ms)
- **`useListings`** — fetch listings with loading / error / refetch
- **`useStats`** — platform stats for hero section cards

## Tailwind / design tokens

Defined in `globals.css`:

- `--nestfind-green: #2d9c75`
- `--nestfind-hero: #e1f5ee` (mint hero band)
- `--nestfind-mint` (map CTA banner)
- `--nestfind-heading: #1e4d3b`

Featured cards use pastel accents: `blue`, `green`, `yellow`, `pink` matching the mockup.

## Responsive notes

| Breakpoint | Behavior |
|------------|----------|
| `< md` | Navbar hamburger; search bar stacks; 1-col cards |
| `md` | 2-col listing grid |
| `lg` | Horizontal search pill; 4-col featured grid; nav links visible |

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

# Hoop Central 3.0

Full-stack basketball stats and directory app aligned with [Hoop Central production](https://hoop-central-production.up.railway.app): **Outfit** + **Teko** + **JetBrains Mono**, orange primary, leagues catalog, player directory, prospects, birth-year classes, rosters, and admin hooks for future scrapers.

## Monorepo layout

| Path        | Role                                      |
|------------|---------------------------------------------|
| `backend/` | Express + MongoDB API, seed, ingest        |
| `frontend/`| Vite + React + Tailwind + TanStack Query     |

## Quick start (local)

### 1. MongoDB

Run Mongo locally or use a Railway MongoDB plugin / Atlas URI.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Set MONGODB_URI in .env
npm install
npm run seed
npm run dev
```

API: `http://localhost:5000` — try `GET /api/health`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Optional: VITE_API_URL=http://localhost:5000  (empty uses same-origin + Vite proxy in dev)
npm install
npm run dev
```

App: `http://localhost:5173` — API requests to `/api/*` are proxied to the backend in development.

## Railway (two services, one GitHub repo)

1. **Backend service** — root `backend`, start `npm start`, set `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS` (your frontend URL), optional `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`, optional `INGEST_API_KEY`.
2. **Frontend service** — root `frontend`, build `npm run build`, start `npx serve -s dist -l 3000` (or similar), set **`VITE_API_URL`** to your backend public `https://…` URL at **build time** so the browser can call the API.

## Scraper integration (separate repo later)

- **Option A — HTTP ingest (recommended):** `POST /api/ingest/players` with header `X-API-Key: <INGEST_API_KEY>` and JSON body `{ "players": [ { … } ] }` (or a bare array). Upserts by `externalId` when present.
- **Option B — write Mongo directly:** use the same `MONGODB_URI` and match the `Player` / `Team` / `League` shapes in `backend/models/`.

## Default admin login (development)

If you do not set `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`, the API accepts password **`Hockey86`** for `POST /api/admin/login`. Set `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH` in production instead of relying on the default.

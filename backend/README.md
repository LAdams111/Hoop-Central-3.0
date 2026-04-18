# Hoop Central API

Express + Mongoose. See root `README.md` for environment variables and `npm run seed`.

## Key routes

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/health` | Liveness |
| GET | `/api/leagues/catalog` | Static league metadata (same as production list) |
| GET | `/api/leagues/:slugOrId` | DB league or catalog fallback |
| GET | `/api/leagues/:apiKey/teams` | Teams from `data/teamsCatalog.json` when present; else Mongo |
| GET | `/api/teams`, `/api/teams/:id` | Teams + roster population |
| GET | `/api/teams/by-name/:name/roster/:season` | Roster for SPA `/roster/...` |
| GET | `/api/players` | `?search=&position=&sortBy=views` |
| GET | `/api/players/prospects`, `/api/players/birth-year-counts`, `/api/players/birth-year/:year` | |
| POST | `/api/players/:id/view` | Increment profile views |
| POST | `/api/admin/login` | `{ "password": "…" }` → JWT |
| POST | `/api/ingest/players` | Scraper bulk upsert (`X-API-Key`) |

# Weather App (full stack)

**Repository:** [github.com/nigel-andati/fullstack-weather-app](https://github.com/nigel-andati/fullstack-weather-app)

Production-style weather dashboard with a React (Vite) frontend, Express API, database persistence (SQLite or PostgreSQL), OpenWeatherMap integration, optional YouTube search, exports (JSON/CSV), and client-side “smart insights”.

## PM Accelerator submission

- **Dependencies:** see **[REQUIREMENTS.md](./REQUIREMENTS.md)** (human-readable list of all npm packages). Install with **`npm install`** from this folder.
- **GitHub:** repo must be **public**, *or* **private** with collaborators **`community@pmaccelerator.io`** and **`hr@pmaccelerator.io`** (clone/download enabled).
- **Demo video:** record 1–2 minutes (voice + screen): run the app, show weather + forecast + insights + saved records/export, and briefly mention the stack. See **[SUBMISSION.md](./SUBMISSION.md)** for a checklist and form hints.
- **Your name on the app:** this submission defaults to **Nigel Andati** in the **Submission** footer; override with `VITE_APPLICANT_NAME` in `frontend/.env` if needed. The UI also includes **Product Manager Accelerator** context with LinkedIn / website links for assessors.

## Quick start (for anyone cloning the repo)

Run these commands **from the `weather-app` folder** (repository root of this project):

1. **Install dependencies** (one install for backend + frontend via npm workspaces):

   ```bash
   npm install
   ```

2. **Create `backend/.env`** from the template (safe to run every time; it skips if `.env` already exists):

   ```bash
   npm run setup
   ```

3. **Database — pick one:**
   - **Easiest (no Docker):** in `backend/.env` set `USE_SQLITE=true` (default in `.env.example`). Data is stored in `backend/data/weather.db`.
   - **PostgreSQL + Docker:** set `USE_SQLITE=false`, install/run Docker, then:

     ```bash
     npm run docker:install   # optional helper (winget / brew / opens docs)
     npm run db:up
     ```

     The first time the Postgres volume is created, `backend/db/schema.sql` runs automatically. Keep `DATABASE_URL` pointed at that instance.

4. **Add your OpenWeatherMap API key** to `backend/.env` (`OPENWEATHER_API_KEY=`). Optional: `YOUTUBE_API_KEY`.

5. **Run API + web UI together**:

   ```bash
   npm run dev
   ```

   - Frontend: [http://localhost:5173](http://localhost:5173)  
   - API: [http://localhost:3001/api](http://localhost:3001/api) · health: [http://localhost:3001/health](http://localhost:3001/health)

**Useful commands**

| Command | What it does |
| --------|--------------|
| `npm run docker:install` | Try OS installers for Docker (or open Docker docs) |
| `npm run db:down` | Stop Postgres container |
| `npm run db:reset` | Remove DB volume and start fresh (re-runs schema on next init) |
| `npm run build` | Production build of the frontend |

**Without Docker:** install PostgreSQL yourself, create a database, run `psql "$DATABASE_URL" -f backend/db/schema.sql`, then set `DATABASE_URL` in `backend/.env` and use `npm run dev` as above.

## Features

- **Location search**: city name, postal code, or `lat,lon` coordinates; optional **browser geolocation** fills coordinates automatically.
- **Current weather**: temperature, feels-like, condition + icon, humidity, wind (via `/api/weather/current`).
- **5-day outlook**: daily min/max derived from OpenWeather’s 3-hour forecast (`/api/weather/forecast`).
- **Smart weather insights**: rule-based tips (humidity, rain/snow in the window, wind, clear/hot, etc.).
- **YouTube integration**: server-side search (`/api/integrations/youtube`) keeps API keys off the client; embeds up to three videos when `YOUTUBE_API_KEY` is set.
- **CRUD + export**: `weather_records` table with JSON payload; `GET /api/export/json` and `GET /api/export/csv` (via `json2csv`).
- **Responsive UI**: Tailwind layout with grid/scroll patterns for small and large screens.

## Tech stack

| Layer    | Choice                          |
| -------- | ------------------------------- |
| Frontend | React (Vite), Tailwind CSS v4, Axios |
| Backend  | Node.js, Express.js             |
| Database | PostgreSQL (`pg`, JSONB column) |
| External | OpenWeatherMap; optional YouTube Data API v3 |

## Project structure

```
weather-app/
  frontend/
    src/
      components/     # UI sections (weather, insights, YouTube, CRUD)
      pages/          # Home page composition
      services/       # Axios API client
      utils/          # Forecast aggregation + insight rules
  backend/
    controllers/      # HTTP handlers
    routes/             # Express routers mounted under /api
    services/           # OpenWeather, YouTube, record logic
    models/             # PostgreSQL pool
    db/schema.sql       # Table definition
    server.js
  scripts/
    setup-env.cjs       # Copies .env.example → backend/.env on first run
  docker-compose.yml    # Local Postgres (optional but recommended)
  package.json          # Root scripts: dev, db:up, setup, build
  REQUIREMENTS.md       # All npm packages — for assessors / “requirements file”
  SUBMISSION.md         # PM Accelerator form checklist
  .env.example
  README.md
```

## Prerequisites

- **Node.js 18+**
- **Docker Desktop** (or Docker Engine + Compose) for the easiest database setup — or use your own PostgreSQL 14+
- **[OpenWeatherMap](https://openweathermap.org/api) API key** (free tier works for current + 5-day forecast)

## Manual setup (alternative to Quick start)

If you prefer separate terminals or no Docker:

### Database

With Docker Compose (from repo root): `npm run db:up` — or create a database and run:

```bash
psql "$DATABASE_URL" -f backend/db/schema.sql
```

### Backend

```bash
cd backend
cp ../.env.example .env
# Set DATABASE_URL, OPENWEATHER_API_KEY (and optionally YOUTUBE_API_KEY)
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` → `http://localhost:3001` (see `frontend/vite.config.js`).  
For a production build served separately, set `VITE_API_URL` to your deployed API’s `/api` base and run `npm run build` in `frontend` (or `npm run build` from the repo root).

## API endpoints

Base path: `/api`

### Weather

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/weather/current?location=...` | Current weather (JSON) |
| GET | `/weather/forecast?location=...` | 5-day / 3-hour forecast |

### Records (CRUD)

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/records` | Body: `{ location, startDate, endDate }` — validates location via OpenWeather, stores forecast slice |
| GET | `/records` | List all records |
| GET | `/records/:id` | Single record |
| PUT | `/records/:id` | Update location + range; re-fetches weather |
| DELETE | `/records/:id` | Delete |

Date rules: `YYYY-MM-DD`, inclusive range, must fall within the next **5 days** (OpenWeather free forecast horizon).

### Export

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/export/json` | All records as `{ count, records }` |
| GET | `/export/csv` | CSV (weather JSON in a column) |

### Integrations

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/integrations/youtube?location=...` | YouTube search results (requires `YOUTUBE_API_KEY`) |

### Errors

JSON error bodies: `{ "error": "message" }` with status **400**, **404**, or **500** as appropriate.

## Design decisions

- **Location validation** for saved records reuses the same OpenWeather calls as the read routes, so invalid places fail fast with consistent messages.
- **Forecast storage** keeps both the raw payload and entries filtered into `[startDate, endDate]` for traceability and smaller range views.
- **CSV export** stringifies `weather_data` to avoid wide dynamic columns while keeping imports simple.
- **YouTube** is proxied through Express so secrets never ship to the browser; the UI degrades gracefully if the key is missing.
- **Smart insights** are deterministic rules over live data (no extra LLM), keeping latency and cost predictable.

## Environment variables

See `.env.example` for `DATABASE_URL`, `OPENWEATHER_API_KEY`, optional `YOUTUBE_API_KEY`, `PORT`, `FRONTEND_ORIGIN`, and optional `VITE_API_URL`.

## License

MIT (sample project).

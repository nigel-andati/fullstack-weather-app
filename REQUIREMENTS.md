# Dependencies & runtime requirements

This project uses **Node.js** (recommended **18+**). Install packages with **`npm install`** from the **`weather-app`** repository root (npm workspaces install backend + frontend together).

## Runtime

| Requirement | Notes |
|-------------|--------|
| **Node.js** | v18 or newer |
| **npm** | v9+ (comes with Node) |
| **OpenWeatherMap API key** | Free tier works; set `OPENWEATHER_API_KEY` in `backend/.env` |

**Database (pick one):**

| Mode | Packages / tools |
|------|------------------|
| **SQLite (default for local dev)** | `better-sqlite3` — set `USE_SQLITE=true` in `backend/.env` |
| **PostgreSQL** | Docker + `pg` driver — set `USE_SQLITE=false`, run `npm run db:up`, or use your own Postgres |

## Root workspace (`package.json`)

Script helpers only; installed in the root `node_modules` when you run `npm install` at the repo root.

| Package | Version (approx.) | Purpose |
|---------|-------------------|---------|
| `concurrently` | ^9.1.x | Run API + frontend dev servers together |
| `open` | ^10.1.x | Optional: open URLs in browser (`npm run docker:install`) |

## Backend (`backend/package.json`)

| Package | Version (approx.) | Purpose |
|---------|-------------------|---------|
| `express` | ^4.21.x | HTTP API |
| `cors` | ^2.8.x | Cross-origin requests from Vite dev server |
| `dotenv` | ^16.4.x | Load `backend/.env` |
| `axios` | ^1.7.x | Calls to OpenWeatherMap and YouTube APIs |
| `pg` | ^8.13.x | PostgreSQL client |
| `better-sqlite3` | ^11.8.x | Embedded SQLite when `USE_SQLITE=true` |
| `json2csv` | ^6.x (alpha) | CSV export |

## Frontend (`frontend/package.json`)

### Dependencies

| Package | Version (approx.) | Purpose |
|---------|-------------------|---------|
| `react` | ^19.2.x | UI |
| `react-dom` | ^19.2.x | DOM rendering |
| `axios` | ^1.13.x | API client |

### DevDependencies (build / lint)

| Package | Purpose |
|---------|---------|
| `vite` | Dev server & production build |
| `@vitejs/plugin-react` | React + Fast Refresh |
| `tailwindcss` | Utility-first CSS |
| `@tailwindcss/vite` | Tailwind Vite plugin |
| `eslint` + plugins | Linting |

## Install command (authoritative)

```bash
cd weather-app
npm install
```

Lockfiles: `package-lock.json` at the repo root locks resolved versions for all workspaces.

## Environment files (not installed via npm)

Copy from `.env.example`:

- **`npm run setup`** → creates `backend/.env`
- For **submitter name** on the UI: create **`frontend/.env`** with `VITE_APPLICANT_NAME=Your Name` (see `.env.example`)

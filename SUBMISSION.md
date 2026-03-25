# PM Accelerator — submission checklist

Use this file alongside the Google Form. The **authoritative install list** is **[REQUIREMENTS.md](./REQUIREMENTS.md)** (and the `package.json` / `package-lock.json` files).

## GitHub repository

1. Push the **`weather-app`** folder (or make it the repo root) so reviewers see `package.json`, `backend/`, `frontend/`, `README.md`, and `REQUIREMENTS.md`.
2. **Either** set the repo to **Public**, **or** keep it **Private** and add these accounts with **read** access (clone/download allowed):
   - `community@pmaccelerator.io`
   - `hr@pmaccelerator.io`
3. Confirm **Clone** or **Download ZIP** works for those accounts.

## Google Form — typical fields

- **Repo URL** — `https://github.com/<you>/<repo>`
- **README** — already in repo; explains how to run and what was built.
- **Requirements / dependencies** — point to **[REQUIREMENTS.md](./REQUIREMENTS.md)** and `npm install`.
- **Demo video URL** — 1–2 min, screen + voice: show running app (search weather, forecast, insights, CRUD/export if possible) and briefly walk through stack (React/Vite, Express, DB). Host on **Google Drive** (anyone with link can view), **YouTube** (unlisted is fine), **Vimeo**, etc.

## Before you record the demo

1. `npm install` → `npm run setup` → fill `backend/.env` (`OPENWEATHER_API_KEY`, `USE_SQLITE=true` or Docker Postgres).
2. Create **`frontend/.env`** with `VITE_APPLICANT_NAME=Your Full Name` (see `frontend/.env.example`).
3. `npm run dev` — scroll to the bottom to show **Submission** + **PM Accelerator** blurb.

## If you need more time

Reply to the assessment email or use the form’s instructions to request an extension (e.g. dual-role **10-day** window).

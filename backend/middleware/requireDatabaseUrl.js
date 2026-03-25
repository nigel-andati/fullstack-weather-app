/**
 * Fails fast when DATABASE_URL was never configured (clearer than a generic driver error).
 * SQLite mode (USE_SQLITE=true) does not require DATABASE_URL.
 */
export function requireDatabaseUrl(_req, res, next) {
  const sqlite = process.env.USE_SQLITE === 'true' || process.env.USE_SQLITE === '1';
  if (sqlite) {
    return next();
  }
  if (!process.env.DATABASE_URL?.trim()) {
    return res.status(503).json({
      error:
        'DATABASE_URL is not set. Copy .env.example to backend/.env and set a PostgreSQL connection string (after starting Postgres, e.g. `npm run db:up`).',
    });
  }
  next();
}

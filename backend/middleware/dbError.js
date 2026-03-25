/**
 * Maps low-level PostgreSQL / Node network errors into HTTP status + a clear client message.
 * Avoids opaque "Internal server error" when the DB simply is not running.
 */
export function getHttpForDbError(err) {
  if (!err) return null;

  const codes = new Set();
  if (err.code) codes.add(err.code);
  if (err.cause?.code) codes.add(err.cause.code);
  if (Array.isArray(err.errors)) {
    for (const e of err.errors) {
      if (e?.code) codes.add(e.code);
    }
  }

  const msg = String(err.message || '');

  if (
    codes.has('ECONNREFUSED') ||
    codes.has('ETIMEDOUT') ||
    codes.has('ENOTFOUND') ||
    /connect econnrefused/i.test(msg) ||
    /connection refused/i.test(msg)
  ) {
    return {
      status: 503,
      message:
        'Database is not reachable. Start PostgreSQL and confirm DATABASE_URL in backend/.env (for example run `npm run db:up` from the project root if you use Docker).',
    };
  }

  // PostgreSQL server error class — 5-char SQLSTATE
  const sqlState = typeof err.code === 'string' && /^[0-9A-Z]{5}$/.test(err.code) ? err.code : null;
  if (sqlState === '42P01') {
    return {
      status: 503,
      message:
        'The weather_records table is missing. Apply backend/db/schema.sql to your database, then try again.',
    };
  }
  if (sqlState === '3D000') {
    return {
      status: 503,
      message: 'The database in DATABASE_URL does not exist. Create it or fix the connection string.',
    };
  }
  if (sqlState === '28P01') {
    return {
      status: 503,
      message: 'Database login failed. Check the username and password in DATABASE_URL.',
    };
  }

  if (/database .* does not exist/i.test(msg)) {
    return {
      status: 503,
      message: 'The configured database does not exist. Create it or update DATABASE_URL.',
    };
  }

  return null;
}

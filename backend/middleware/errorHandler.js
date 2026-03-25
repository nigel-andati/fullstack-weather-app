import { getHttpForDbError } from './dbError.js';

export function errorHandler(err, _req, res, _next) {
  const db = getHttpForDbError(err);
  if (db) {
    console.error(err);
    return res.status(db.status).json({ error: db.message });
  }

  const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message =
    status === 500 && process.env.NODE_ENV !== 'development'
      ? 'Internal server error'
      : err.message || 'Internal server error';
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ error: message });
}

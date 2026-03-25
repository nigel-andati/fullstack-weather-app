import pg from 'pg';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

/** When true, uses a local SQLite file so Docker / PostgreSQL are not required for development. */
export const isSqlite = process.env.USE_SQLITE === 'true' || process.env.USE_SQLITE === '1';

let pool = null;
let sqliteDb = null;

function initSqlite() {
  if (sqliteDb) return sqliteDb;
  const dataDir = join(__dirname, '..', 'data');
  mkdirSync(dataDir, { recursive: true });
  const path = process.env.SQLITE_PATH || join(dataDir, 'weather.db');
  const db = new Database(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS weather_records (
      id TEXT PRIMARY KEY NOT NULL,
      location TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      weather_data TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_weather_records_location ON weather_records (location);
    CREATE INDEX IF NOT EXISTS idx_weather_records_created_at ON weather_records (created_at DESC);
  `);
  sqliteDb = db;
  return sqliteDb;
}

function getPool() {
  if (!pool) {
    const { Pool } = pg;
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
    });
    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL pool error', err);
    });
  }
  return pool;
}

/**
 * Single entry point for record queries. PostgreSQL uses $1-style parameters; SQLite uses ?.
 */
export async function query(text, params = []) {
  if (isSqlite) {
    const db = initSqlite();
    const sql = text.trim();
    const upper = sql.slice(0, 10).toUpperCase();

    if (upper.startsWith('SELECT')) {
      const rows = db.prepare(text).all(...params);
      return { rows };
    }
    if (upper.startsWith('INSERT') || upper.startsWith('UPDATE')) {
      const rows = db.prepare(text).all(...params);
      return { rows };
    }
    if (upper.startsWith('DELETE')) {
      const info = db.prepare(text).run(...params);
      return { rowCount: info.changes };
    }
    const rows = db.prepare(text).all(...params);
    return { rows };
  }

  return getPool().query(text, params);
}

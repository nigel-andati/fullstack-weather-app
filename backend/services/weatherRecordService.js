import { randomUUID } from 'crypto';
import { isSqlite, query } from '../models/db.js';
import {
  fetchForecast,
  parseLocationInput,
  filterForecastByDateRange,
} from './openWeatherService.js';

const MAX_FORECAST_DAYS = 5;

function parseRow(row) {
  if (!row) return row;
  if (typeof row.weather_data === 'string') {
    try {
      return { ...row, weather_data: JSON.parse(row.weather_data) };
    } catch {
      return row;
    }
  }
  return row;
}

function parseRows(rows) {
  return (rows ?? []).map(parseRow);
}

function parseISODateOnly(s) {
  if (!s || typeof s !== 'string') return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Validates date range for stored records: inclusive range, max span aligned with OpenWeather 5-day forecast.
 */
export function validateDateRange(startDateStr, endDateStr) {
  const start = parseISODateOnly(startDateStr);
  const end = parseISODateOnly(endDateStr);
  if (!start || !end) {
    return { error: 'startDate and endDate must be valid YYYY-MM-DD values' };
  }
  if (start > end) {
    return { error: 'startDate must be on or before endDate' };
  }
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const maxEnd = new Date(todayUtc);
  maxEnd.setUTCDate(maxEnd.getUTCDate() + MAX_FORECAST_DAYS - 1);
  if (end > maxEnd) {
    return {
      error: `endDate cannot be more than ${MAX_FORECAST_DAYS} days from today (OpenWeather forecast limit)`,
    };
  }
  if (start < todayUtc) {
    return { error: 'startDate cannot be in the past' };
  }
  const spanDays = Math.ceil((end - start) / (24 * 60 * 60 * 1000)) + 1;
  if (spanDays > MAX_FORECAST_DAYS) {
    return { error: `Date range cannot span more than ${MAX_FORECAST_DAYS} days` };
  }
  return { start, end };
}

/**
 * Creates a row after validating the place name/coordinates against OpenWeather and
 * trimming the forecast list to the inclusive [startDate, endDate] window.
 */
export async function createRecord({ location, startDate, endDate }) {
  const loc = parseLocationInput(location);
  if (loc.error) {
    const err = new Error(loc.error);
    err.statusCode = 400;
    throw err;
  }
  const range = validateDateRange(startDate, endDate);
  if (range.error) {
    const err = new Error(range.error);
    err.statusCode = 400;
    throw err;
  }

  const forecast = await fetchForecast(loc);
  const filtered = filterForecastByDateRange(forecast, startDate, endDate);
  if (filtered.length === 0) {
    const err = new Error('No forecast data for the selected date range. Try dates within the next 5 days.');
    err.statusCode = 400;
    throw err;
  }

  const weather_data = {
    source: 'OpenWeatherMap',
    city: forecast.city,
    rawForecast: forecast,
    entriesInRange: filtered,
    range: { startDate, endDate },
  };

  const name = forecast.city?.name || String(location).trim();
  const id = randomUUID();
  const payload = isSqlite ? JSON.stringify(weather_data) : weather_data;

  const sql = isSqlite
    ? `INSERT INTO weather_records (id, location, start_date, end_date, weather_data)
       VALUES (?, ?, ?, ?, ?)
       RETURNING *`
    : `INSERT INTO weather_records (id, location, start_date, end_date, weather_data)
       VALUES ($1, $2::date, $3::date, $4::date, $5::jsonb)
       RETURNING *`;

  const { rows } = await query(sql, [id, name, startDate, endDate, payload]);
  return parseRow(rows[0]);
}

export async function listRecords() {
  const sql = isSqlite
    ? `SELECT id, location, start_date, end_date, weather_data, created_at
       FROM weather_records
       ORDER BY datetime(created_at) DESC`
    : `SELECT id, location, start_date, end_date, weather_data, created_at
       FROM weather_records
       ORDER BY created_at DESC`;
  const { rows } = await query(sql);
  return parseRows(rows);
}

export async function getRecordById(id) {
  const sql = isSqlite
    ? `SELECT id, location, start_date, end_date, weather_data, created_at
       FROM weather_records WHERE id = ?`
    : `SELECT id, location, start_date, end_date, weather_data, created_at
       FROM weather_records WHERE id = $1`;
  const { rows } = await query(sql, [id]);
  return parseRow(rows[0] ?? null);
}

export async function updateRecord(id, { location, startDate, endDate }) {
  const existing = await getRecordById(id);
  if (!existing) return null;

  const loc = parseLocationInput(location);
  if (loc.error) {
    const err = new Error(loc.error);
    err.statusCode = 400;
    throw err;
  }
  const range = validateDateRange(startDate, endDate);
  if (range.error) {
    const err = new Error(range.error);
    err.statusCode = 400;
    throw err;
  }

  const forecast = await fetchForecast(loc);
  const filtered = filterForecastByDateRange(forecast, startDate, endDate);
  if (filtered.length === 0) {
    const err = new Error('No forecast data for the selected date range. Try dates within the next 5 days.');
    err.statusCode = 400;
    throw err;
  }

  const weather_data = {
    source: 'OpenWeatherMap',
    city: forecast.city,
    rawForecast: forecast,
    entriesInRange: filtered,
    range: { startDate, endDate },
  };

  const name = forecast.city?.name || String(location).trim();
  const payload = isSqlite ? JSON.stringify(weather_data) : weather_data;

  const sql = isSqlite
    ? `UPDATE weather_records
       SET location = ?, start_date = ?, end_date = ?, weather_data = ?
       WHERE id = ?
       RETURNING *`
    : `UPDATE weather_records
       SET location = $1, start_date = $2::date, end_date = $3::date, weather_data = $4::jsonb
       WHERE id = $5
       RETURNING *`;

  const params = isSqlite ? [name, startDate, endDate, payload, id] : [name, startDate, endDate, payload, id];
  const { rows } = await query(sql, params);
  return parseRow(rows[0] ?? null);
}

export async function deleteRecord(id) {
  const sql = isSqlite ? `DELETE FROM weather_records WHERE id = ?` : `DELETE FROM weather_records WHERE id = $1`;
  const { rowCount } = await query(sql, [id]);
  return rowCount > 0;
}

export async function getAllForExport() {
  return listRecords();
}

import axios from 'axios';

const BASE = 'https://api.openweathermap.org/data/2.5';

function getApiKey() {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    const err = new Error('OPENWEATHER_API_KEY is not configured');
    err.statusCode = 500;
    throw err;
  }
  return key;
}

/**
 * Detects "lat,lon" coordinate pairs vs free-text location (city, zip, etc.).
 */
export function parseLocationInput(raw) {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) {
    return { error: 'Location is required' };
  }
  const coordMatch = /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/.exec(trimmed);
  if (coordMatch) {
    const lat = Number(coordMatch[1]);
    const lon = Number(coordMatch[2]);
    if (Number.isNaN(lat) || Number.isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return { error: 'Invalid coordinates. Use lat,lon between valid ranges.' };
    }
    return { type: 'coords', lat, lon };
  }
  return { type: 'query', q: trimmed };
}

function buildParams(location) {
  const key = getApiKey();
  const base = { appid: key, units: 'metric' };
  if (location.type === 'coords') {
    return { ...base, lat: location.lat, lon: location.lon };
  }
  return { ...base, q: location.q };
}

/**
 * Validates location by calling OpenWeather current weather. Returns normalized location + payload.
 */
export async function fetchCurrentWeather(locationInput) {
  const location = typeof locationInput === 'string' ? parseLocationInput(locationInput) : locationInput;
  if (location.error) {
    const err = new Error(location.error);
    err.statusCode = 400;
    throw err;
  }
  try {
    const { data } = await axios.get(`${BASE}/weather`, {
      params: buildParams(location),
      timeout: 15_000,
    });
    return data;
  } catch (e) {
    const status = e.response?.status;
    const msg =
      status === 404
        ? 'Location not found. Try another city, zip, or coordinates.'
        : e.response?.data?.message || e.message || 'Weather API request failed';
    const err = new Error(msg);
    err.statusCode = status === 404 ? 404 : status >= 400 && status < 500 ? 400 : 500;
    throw err;
  }
}

/**
 * 5-day / 3-hour forecast from OpenWeather.
 */
export async function fetchForecast(locationInput) {
  const location = typeof locationInput === 'string' ? parseLocationInput(locationInput) : locationInput;
  if (location.error) {
    const err = new Error(location.error);
    err.statusCode = 400;
    throw err;
  }
  try {
    const { data } = await axios.get(`${BASE}/forecast`, {
      params: buildParams(location),
      timeout: 15_000,
    });
    return data;
  } catch (e) {
    const status = e.response?.status;
    const msg =
      status === 404
        ? 'Location not found. Try another city, zip, or coordinates.'
        : e.response?.data?.message || e.message || 'Forecast API request failed';
    const err = new Error(msg);
    err.statusCode = status === 404 ? 404 : status >= 400 && status < 500 ? 400 : 500;
    throw err;
  }
}

/**
 * Filters forecast list items to those whose UTC date falls within [start, end] (inclusive).
 */
export function filterForecastByDateRange(forecastPayload, startDateStr, endDateStr) {
  const start = new Date(`${startDateStr}T00:00:00.000Z`);
  const end = new Date(`${endDateStr}T23:59:59.999Z`);
  const list = forecastPayload?.list ?? [];
  return list.filter((item) => {
    const t = new Date(item.dt * 1000);
    return t >= start && t <= end;
  });
}

import { fetchCurrentWeather, fetchForecast } from '../services/openWeatherService.js';

export async function getCurrent(req, res, next) {
  try {
    const location = req.query.location;
    if (!location || !String(location).trim()) {
      return res.status(400).json({ error: 'Query parameter "location" is required' });
    }
    const data = await fetchCurrentWeather(location);
    res.json({
      location: data.name,
      country: data.sys?.country,
      coord: data.coord,
      dt: data.dt,
      timezone: data.timezone,
      main: data.main,
      weather: data.weather,
      wind: data.wind,
      visibility: data.visibility,
      clouds: data.clouds,
    });
  } catch (e) {
    next(e);
  }
}

export async function getForecast(req, res, next) {
  try {
    const location = req.query.location;
    if (!location || !String(location).trim()) {
      return res.status(400).json({ error: 'Query parameter "location" is required' });
    }
    const data = await fetchForecast(location);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

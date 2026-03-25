import { searchWeatherVideos } from '../services/youtubeService.js';

export async function getYoutubeVideos(req, res, next) {
  try {
    const location = req.query.location;
    if (!location || !String(location).trim()) {
      return res.status(400).json({ error: 'Query parameter "location" is required' });
    }
    const result = await searchWeatherVideos(location);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

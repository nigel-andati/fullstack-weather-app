import axios from 'axios';

/**
 * Server-side YouTube Data API search so the API key stays off the client.
 * Returns up to `maxResults` video metadata objects for "weather" + location.
 */
export async function searchWeatherVideos(location, maxResults = 3) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return { configured: false, items: [], message: 'YOUTUBE_API_KEY not set' };
  }
  const q = `weather ${String(location).trim()}`;
  let data;
  try {
    const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q,
        type: 'video',
        maxResults,
        key,
      },
      timeout: 12_000,
    });
    data = res.data;
  } catch (e) {
    const msg = e.response?.data?.error?.message || e.message || 'YouTube API request failed';
    const err = new Error(msg);
    err.statusCode = 502;
    throw err;
  }
  const items = (data.items ?? []).map((it) => ({
    id: it.id?.videoId,
    title: it.snippet?.title,
    channelTitle: it.snippet?.channelTitle,
    description: it.snippet?.description,
    publishedAt: it.snippet?.publishedAt,
    thumbnails: it.snippet?.thumbnails,
  }));
  return { configured: true, items };
}

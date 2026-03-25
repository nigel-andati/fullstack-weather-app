import { useCallback, useMemo, useState } from 'react'
import LocationInput from '../components/LocationInput.jsx'
import CurrentWeather from '../components/CurrentWeather.jsx'
import ForecastGrid from '../components/ForecastGrid.jsx'
import SmartInsights from '../components/SmartInsights.jsx'
import YouTubeWeather from '../components/YouTubeWeather.jsx'
import RecordsPanel from '../components/RecordsPanel.jsx'
import SubmissionAbout from '../components/SubmissionAbout.jsx'
import { getCurrentWeather, getForecast, getYoutubeVideos } from '../services/api.js'
import { forecastToDaily } from '../utils/forecast.js'
import { buildSmartInsights } from '../utils/insights.js'

function extractErrorMessage(err) {
  if (err.response?.data?.error) return err.response.data.error
  if (err.response?.status === 404) return 'Location not found.'
  if (err.code === 'ECONNABORTED') return 'Request timed out. Try again.'
  if (err.message === 'Network Error') return 'Cannot reach the API. Is the backend running?'
  return err.message || 'Something went wrong.'
}

export default function Home() {
  const [locationInput, setLocationInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [youtube, setYoutube] = useState(null)

  const daily = useMemo(() => (forecast ? forecastToDaily(forecast) : []), [forecast])
  const insights = useMemo(
    () => (current && forecast ? buildSmartInsights(current, forecast) : []),
    [current, forecast]
  )

  const loadWeather = useCallback(async (loc) => {
    const trimmed = String(loc ?? '').trim()
    if (!trimmed) {
      setError('Enter a city, postal code, or coordinates.')
      return
    }
    setError('')
    setLoading(true)
    setCurrent(null)
    setForecast(null)
    setYoutube(null)
    try {
      const [curRes, foreRes] = await Promise.all([
        getCurrentWeather(trimmed),
        getForecast(trimmed),
      ])
      setCurrent(curRes.data)
      setForecast(foreRes.data)
      try {
        const yt = await getYoutubeVideos(trimmed)
        setYoutube(yt.data)
      } catch {
        setYoutube({ configured: false, items: [] })
      }
    } catch (e) {
      setError(extractErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  function onUseMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.')
      return
    }
    setLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const q = `${latitude.toFixed(4)},${longitude.toFixed(4)}`
        setLocationInput(q)
        setLocating(false)
        loadWeather(q)
      },
      () => {
        setLocating(false)
        setError('Unable to read your location. Check browser permissions.')
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 }
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
      <header className="text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300/90">
          Full-stack weather
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">Live conditions &amp; outlook</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Search by city, postal code, or coordinates. Data comes from OpenWeatherMap via the Express API;
          save forecast ranges to the database (SQLite locally or PostgreSQL with Docker) and export JSON or
          CSV.
        </p>
      </header>

      <div className="mt-8">
        <LocationInput
          value={locationInput}
          onChange={setLocationInput}
          onSubmit={() => loadWeather(locationInput)}
          onUseMyLocation={onUseMyLocation}
          loading={loading}
          locating={locating}
        />
      </div>

      {error ? (
        <div
          className="mt-6 rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-left text-sm text-rose-100"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-8">
        {current ? <CurrentWeather data={current} /> : null}
        {forecast ? <ForecastGrid days={daily} /> : null}
        {current && forecast ? <SmartInsights items={insights} /> : null}
        {youtube ? <YouTubeWeather data={youtube} locationLabel={locationInput} /> : null}
        <RecordsPanel defaultLocation={locationInput} />
        <SubmissionAbout />
      </div>
    </div>
  )
}

function iconUrl(code) {
  if (!code) return null
  return `https://openweathermap.org/img/wn/${code}@2x.png`
}

export default function CurrentWeather({ data }) {
  if (!data) return null
  const w = data.weather?.[0]
  const main = data.main
  const wind = data.wind

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-6 shadow-xl shadow-black/20 backdrop-blur">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="text-left">
          <p className="text-sm uppercase tracking-wide text-slate-400">Current conditions</p>
          <h2 className="mt-1 text-3xl font-semibold text-white md:text-4xl">
            {data.location}
            {data.country ? (
              <span className="text-lg font-normal text-slate-400">, {data.country}</span>
            ) : null}
          </h2>
          <p className="mt-2 text-lg capitalize text-slate-300">{w?.description}</p>
        </div>
        {w?.icon ? (
          <img
            src={iconUrl(w.icon)}
            alt=""
            className="h-28 w-28 self-start md:self-center"
          />
        ) : null}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl bg-slate-800/60 p-4">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Temperature</dt>
          <dd className="mt-1 text-2xl font-semibold text-white">
            {main?.temp != null ? `${Math.round(main.temp)}°C` : '—'}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-4">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Feels like</dt>
          <dd className="mt-1 text-2xl font-semibold text-white">
            {main?.feels_like != null ? `${Math.round(main.feels_like)}°C` : '—'}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-4">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Humidity</dt>
          <dd className="mt-1 text-2xl font-semibold text-white">
            {main?.humidity != null ? `${main.humidity}%` : '—'}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-4">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Wind</dt>
          <dd className="mt-1 text-2xl font-semibold text-white">
            {wind?.speed != null ? `${wind.speed} m/s` : '—'}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-4">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Condition</dt>
          <dd className="mt-1 text-lg font-semibold capitalize text-white">{w?.main || '—'}</dd>
        </div>
      </dl>
    </section>
  )
}

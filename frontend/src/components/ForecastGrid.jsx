function iconUrl(code) {
  if (!code) return null
  return `https://openweathermap.org/img/wn/${code}@2x.png`
}

function formatDate(dateKey) {
  const d = new Date(`${dateKey}T12:00:00Z`)
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function ForecastGrid({ days }) {
  if (!days?.length) return null

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-900/40 p-6">
      <h3 className="text-left text-xl font-semibold text-white">5-day outlook</h3>
      <p className="mt-1 text-left text-sm text-slate-400">
        Daily ranges from OpenWeather&apos;s 3-hour forecast (grouped by local calendar day).
      </p>
      <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
        {days.map((d) => (
          <div
            key={d.dateKey}
            className="min-w-[140px] flex-shrink-0 snap-start rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-center shadow-inner"
          >
            <p className="text-sm font-medium text-slate-200">{formatDate(d.dateKey)}</p>
            {d.icon ? (
              <img src={iconUrl(d.icon)} alt="" className="mx-auto h-16 w-16" />
            ) : (
              <div className="h-16" />
            )}
            <p className="text-xs capitalize text-slate-400">{d.description}</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {d.min != null && d.max != null ? (
                <>
                  {Math.round(d.min)}° / {Math.round(d.max)}°
                </>
              ) : (
                '—'
              )}
            </p>
            <p className="text-xs text-slate-500">Low / High</p>
          </div>
        ))}
      </div>
    </section>
  )
}

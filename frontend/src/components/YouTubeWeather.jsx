export default function YouTubeWeather({ data, locationLabel }) {
  if (!data) return null
  if (!data.configured) {
    return (
      <section className="rounded-2xl border border-slate-700 bg-slate-900/40 p-6 text-left">
        <h3 className="text-xl font-semibold text-white">Location videos (YouTube)</h3>
        <p className="mt-2 text-sm text-slate-400">
          Set <code className="rounded bg-slate-800 px-1 py-0.5 text-slate-200">YOUTUBE_API_KEY</code> on the
          server to load related clips for your search.
        </p>
      </section>
    )
  }

  const items = data.items ?? []
  if (!items.length) {
    return (
      <section className="rounded-2xl border border-slate-700 bg-slate-900/40 p-6 text-left">
        <h3 className="text-xl font-semibold text-white">Location videos (YouTube)</h3>
        <p className="mt-2 text-sm text-slate-400">No videos found for “{locationLabel}”.</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/40 p-6">
      <h3 className="text-left text-xl font-semibold text-white">Location videos (YouTube)</h3>
      <p className="mt-1 text-left text-sm text-slate-400">
        Top results for weather-related content near your query.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {items.map((v) =>
          v.id ? (
            <div key={v.id} className="overflow-hidden rounded-xl border border-slate-700 bg-black/40">
              <div className="aspect-video w-full">
                <iframe
                  title={v.title || 'YouTube video'}
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${v.id}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-3 text-left">
                <p className="line-clamp-2 text-sm font-medium text-slate-100">{v.title}</p>
                <p className="mt-1 text-xs text-slate-500">{v.channelTitle}</p>
              </div>
            </div>
          ) : null
        )}
      </div>
    </section>
  )
}

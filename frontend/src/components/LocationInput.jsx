export default function LocationInput({
  value,
  onChange,
  onSubmit,
  onUseMyLocation,
  loading,
  locating,
}) {
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div className="flex-1 text-left">
        <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-300">
          Location (city, postal code, or lat,lon)
        </label>
        <input
          id="location"
          type="text"
          autoComplete="off"
          placeholder="e.g. London, 90210, or 48.85,2.35"
          className="w-full rounded-xl border border-slate-600 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Loading…' : 'Get weather'}
        </button>
        <button
          type="button"
          onClick={onUseMyLocation}
          disabled={locating}
          className="rounded-xl border border-slate-600 bg-slate-800/80 px-5 py-3 font-semibold text-slate-100 transition hover:border-sky-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locating ? 'Locating…' : 'Use my location'}
        </button>
      </div>
    </form>
  )
}

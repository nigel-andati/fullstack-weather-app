/**
 * Aggregates OpenWeather 3-hour forecast steps into daily min/max for display.
 */
export function forecastToDaily(forecastPayload) {
  const list = forecastPayload?.list ?? []
  const byDay = new Map()

  for (const item of list) {
    const date = new Date(item.dt * 1000)
    const key = date.toISOString().slice(0, 10)
    const temp = item.main?.temp
    if (!byDay.has(key)) {
      byDay.set(key, {
        dateKey: key,
        temps: [],
        icons: [],
        descriptions: [],
      })
    }
    const bucket = byDay.get(key)
    if (typeof temp === 'number') bucket.temps.push(temp)
    const w = item.weather?.[0]
    if (w?.icon) bucket.icons.push(w.icon)
    if (w?.description) bucket.descriptions.push(w.description)
  }

  return [...byDay.values()]
    .map((d) => {
      const min = d.temps.length ? Math.min(...d.temps) : null
      const max = d.temps.length ? Math.max(...d.temps) : null
      const icon = d.icons[Math.floor(d.icons.length / 2)] || d.icons[0]
      const desc = d.descriptions[0] || ''
      return { dateKey: d.dateKey, min, max, icon, description: desc }
    })
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(0, 5)
}

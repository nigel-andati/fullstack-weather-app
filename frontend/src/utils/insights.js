/**
 * Smart Weather Insights: short, actionable tips derived from live OpenWeather fields.
 */
export function buildSmartInsights(current, forecastPayload) {
  const insights = []
  const main = current?.main
  const wind = current?.wind
  const weather = current?.weather?.[0]
  const list = forecastPayload?.list ?? []

  const rainSoon = list.slice(0, 8).some((x) => /rain|drizzle|thunder/i.test(x.weather?.[0]?.main || ''))
  const snowSoon = list.slice(0, 8).some((x) => /snow/i.test(x.weather?.[0]?.main || ''))

  if (main?.humidity != null && main.humidity >= 65 && main?.temp != null && main.temp >= 18) {
    insights.push('High humidity can make it feel warmer and stickier than the air temperature alone suggests.')
  }

  if (main?.humidity != null && main.humidity >= 75 && main?.temp != null && main.temp < 10) {
    insights.push('Damp cold air can feel biting — layers help more than a single heavy coat.')
  }

  if (rainSoon) {
    insights.push('Rain is in the forecast — pack a compact umbrella or a waterproof layer.')
  }

  if (snowSoon) {
    insights.push('Snow or wintry mix may appear soon — plan for slower travel and traction.')
  }

  if (wind?.speed != null && wind.speed >= 8) {
    insights.push('Windy conditions — outdoor workouts and cycling will feel tougher than usual.')
  } else if (wind?.speed != null && wind.speed >= 5) {
    insights.push('Breezy conditions — a light jacket can make a big difference in perceived chill.')
  }

  if (weather?.main === 'Clear' && main?.temp != null && main.temp >= 24) {
    insights.push('Clear skies and warm air — UV can be strong; sunscreen and shade breaks help.')
  }

  if (insights.length === 0) {
    insights.push('Conditions look fairly typical for the period ahead — check hourly details before outdoor plans.')
  }

  return insights.slice(0, 5)
}

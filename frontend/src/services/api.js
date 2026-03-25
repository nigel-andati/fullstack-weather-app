import axios from 'axios'

/**
 * Axios instance pointed at the Express `/api` base. In dev, Vite proxy forwards `/api` to the backend.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 25_000,
})

export function getCurrentWeather(location) {
  return api.get('/weather/current', { params: { location } })
}

export function getForecast(location) {
  return api.get('/weather/forecast', { params: { location } })
}

export function listRecords() {
  return api.get('/records')
}

export function getRecord(id) {
  return api.get(`/records/${id}`)
}

export function createRecord(body) {
  return api.post('/records', body)
}

export function updateRecord(id, body) {
  return api.put(`/records/${id}`, body)
}

export function deleteRecord(id) {
  return api.delete(`/records/${id}`)
}

export function getYoutubeVideos(location) {
  return api.get('/integrations/youtube', { params: { location } })
}

/** Full URLs for opening export endpoints in a new tab (uses same origin in dev via proxy). */
export function exportJsonUrl() {
  const base = import.meta.env.VITE_API_URL || '/api'
  return `${base.replace(/\/$/, '')}/export/json`
}

export function exportCsvUrl() {
  const base = import.meta.env.VITE_API_URL || '/api'
  return `${base.replace(/\/$/, '')}/export/csv`
}

export default api

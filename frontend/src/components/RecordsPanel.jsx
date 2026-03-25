import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createRecord,
  deleteRecord,
  listRecords,
  updateRecord,
  exportJsonUrl,
  exportCsvUrl,
} from '../services/api.js'

function todayISODate() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function addDaysISODate(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export default function RecordsPanel({ defaultLocation }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    location: defaultLocation || '',
    startDate: todayISODate(),
    endDate: addDaysISODate(2),
  })
  const [editingId, setEditingId] = useState(null)

  const canSubmit = useMemo(() => form.location.trim().length > 0, [form.location])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await listRecords()
      setRecords(data)
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to load records')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Keep the save form aligned with the last successful search (unless editing).
  useEffect(() => {
    if (defaultLocation?.trim() && !editingId) {
      setForm((f) => ({ ...f, location: defaultLocation.trim() }))
    }
  }, [defaultLocation, editingId])

  async function handleCreate(e) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      await createRecord({
        location: form.location.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
      })
      setEditingId(null)
      await refresh()
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(id) {
    setLoading(true)
    setError('')
    try {
      await updateRecord(id, {
        location: form.location.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
      })
      setEditingId(null)
      await refresh()
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this saved record?')) return
    setLoading(true)
    setError('')
    try {
      await deleteRecord(id)
      if (editingId === id) setEditingId(null)
      await refresh()
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(r) {
    setEditingId(r.id)
    setForm({
      location: r.location,
      startDate: r.start_date?.slice?.(0, 10) || r.start_date,
      endDate: r.end_date?.slice?.(0, 10) || r.end_date,
    })
  }

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-left">
          <h3 className="text-xl font-semibold text-white">Saved forecast records (CRUD)</h3>
          <p className="mt-1 text-sm text-slate-400">
            Validates the location with OpenWeather, stores JSON for the selected inclusive date range.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={refresh}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-sky-400"
          >
            Refresh list
          </button>
          <a
            href={exportJsonUrl()}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
          >
            Export JSON
          </a>
          <a
            href={exportCsvUrl()}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
          >
            Export CSV
          </a>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-left text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId) } : handleCreate}
        className="mt-6 grid gap-4 md:grid-cols-4"
      >
        <label className="block text-left text-sm md:col-span-2">
          <span className="text-slate-400">Location</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2 text-slate-100"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            required
          />
        </label>
        <label className="block text-left text-sm">
          <span className="text-slate-400">Start date</span>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2 text-slate-100"
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            required
          />
        </label>
        <label className="block text-left text-sm">
          <span className="text-slate-400">End date</span>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2 text-slate-100"
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            required
          />
        </label>
        <div className="flex flex-wrap gap-2 md:col-span-4">
          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {editingId ? 'Update record' : 'Create record'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="py-2 pr-4">Location</th>
              <th className="py-2 pr-4">Range</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-slate-800 text-slate-200">
                <td className="py-3 pr-4 font-medium">{r.location}</td>
                <td className="py-3 pr-4 text-slate-300">
                  {String(r.start_date).slice(0, 10)} → {String(r.end_date).slice(0, 10)}
                </td>
                <td className="py-3 pr-4 text-slate-400">
                  {r.created_at ? new Date(r.created_at).toLocaleString() : '—'}
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    className="mr-2 text-sky-300 hover:underline"
                    onClick={() => startEdit(r)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-rose-300 hover:underline"
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!records.length && !loading ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-500">
                  No records yet — create one above (requires PostgreSQL + running API).
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

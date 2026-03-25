import { Parser } from 'json2csv';
import { getAllForExport } from '../services/weatherRecordService.js';

function rowToFlat(r) {
  return {
    id: r.id,
    location: r.location,
    start_date: r.start_date,
    end_date: r.end_date,
    created_at: r.created_at,
    weather_data: JSON.stringify(r.weather_data ?? {}),
  };
}

export async function exportJson(_req, res, next) {
  try {
    const rows = await getAllForExport();
    res.json({ count: rows.length, records: rows });
  } catch (e) {
    next(e);
  }
}

export async function exportCsv(_req, res, next) {
  try {
    const rows = await getAllForExport();
    if (rows.length === 0) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="weather_records.csv"');
      return res.send('id,location,start_date,end_date,created_at,weather_data\n');
    }
    const flat = rows.map(rowToFlat);
    const parser = new Parser();
    const csv = parser.parse(flat);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="weather_records.csv"');
    res.send(csv);
  } catch (e) {
    next(e);
  }
}

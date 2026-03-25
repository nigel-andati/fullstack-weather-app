import {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from '../services/weatherRecordService.js';

export async function postRecord(req, res, next) {
  try {
    const { location, startDate, endDate } = req.body ?? {};
    if (!location || !startDate || !endDate) {
      return res.status(400).json({ error: 'location, startDate, and endDate are required' });
    }
    const row = await createRecord({ location, startDate, endDate });
    res.status(201).json(row);
  } catch (e) {
    next(e);
  }
}

export async function getRecords(_req, res, next) {
  try {
    const rows = await listRecords();
    res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function getRecord(req, res, next) {
  try {
    const row = await getRecordById(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(row);
  } catch (e) {
    next(e);
  }
}

export async function putRecord(req, res, next) {
  try {
    const { location, startDate, endDate } = req.body ?? {};
    if (!location || !startDate || !endDate) {
      return res.status(400).json({ error: 'location, startDate, and endDate are required' });
    }
    const row = await updateRecord(req.params.id, { location, startDate, endDate });
    if (!row) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(row);
  } catch (e) {
    next(e);
  }
}

export async function removeRecord(req, res, next) {
  try {
    const ok = await deleteRecord(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

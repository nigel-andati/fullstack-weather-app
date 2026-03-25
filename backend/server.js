/**
 * Express entrypoint: mounts versioned JSON APIs under `/api` and centralizes error handling.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import weatherRoutes from './routes/weather.routes.js';
import recordsRoutes from './routes/records.routes.js';
import exportRoutes from './routes/export.routes.js';
import integrationsRoutes from './routes/integrations.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'weather-app-backend' });
});

// Assessment contract: all REST handlers live under `/api`.
app.use('/api/weather', weatherRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/integrations', integrationsRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Weather API listening on http://localhost:${PORT}`);
});

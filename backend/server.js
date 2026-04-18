import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';

import leaguesRouter from './routes/leagues.js';
import teamsRouter from './routes/teams.js';
import playersRouter from './routes/players.js';
import adminRouter from './routes/admin.js';
import ingestRouter from './routes/ingest.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(morgan('dev'));
app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'hoop-central-api' });
});

app.use('/api/admin', adminRouter);
app.use('/api/ingest', ingestRouter);
app.use('/api/leagues', leaguesRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/players', playersRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  const isProdLike =
    process.env.NODE_ENV === 'production' || Boolean(process.env.RAILWAY_ENVIRONMENT);

  if (!uri && isProdLike) {
    console.error(
      '[hoop-central-api] MONGODB_URI is not set. In Railway: add Variables → MONGODB_URI with your MongoDB connection string (Railway Mongo template, MongoDB Atlas, etc.).'
    );
    process.exit(1);
  }

  const mongoUri = uri || 'mongodb://127.0.0.1:27017/hoopcentral';
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  if (!process.env.MONGODB_URI?.trim()) {
    console.error(
      '\n[hoop-central-api] Connection failed and MONGODB_URI is unset — the app defaulted to localhost (127.0.0.1:27017). Set MONGODB_URI to your real database URL.\n'
    );
  }
  process.exit(1);
});

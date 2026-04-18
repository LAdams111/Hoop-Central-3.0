import { Router } from 'express';
import { z } from 'zod';
import Player from '../models/Player.js';

const router = Router();

const playerIngestSchema = z.object({
  externalId: z.string().optional(),
  name: z.string(),
  headshotUrl: z.string().optional(),
  jerseyNumber: z.number().optional(),
  position: z.string().optional(),
  team: z.string(),
  birthDate: z.string().optional(),
  hometown: z.string().optional(),
  bio: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  profileViews: z.number().optional(),
  stats: z.record(z.any()).optional(),
  seasonHistory: z.array(z.any()).optional(),
  seasonTrends: z
    .object({
      points: z.array(z.number()).optional(),
      assists: z.array(z.number()).optional(),
      rebounds: z.array(z.number()).optional(),
    })
    .optional(),
});

function ingestAuth(req, res, next) {
  const key = process.env.INGEST_API_KEY;
  if (!key) return res.status(503).json({ message: 'Ingest API not configured' });
  if (req.headers['x-api-key'] !== key) {
    return res.status(401).json({ message: 'Invalid API key' });
  }
  next();
}

/** Bulk upsert for scrapers — send X-API-Key: INGEST_API_KEY */
router.post('/players', ingestAuth, async (req, res) => {
  try {
    const arr = z.array(playerIngestSchema).max(500).parse(req.body.players ?? req.body);
    const results = [];
    for (const row of arr) {
      const doc = { ...row };
      if (doc.birthDate) doc.birthDate = new Date(doc.birthDate);
      let p;
      if (row.externalId) {
        p = await Player.findOneAndUpdate(
          { externalId: row.externalId },
          { $set: doc },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } else {
        p = await Player.create(doc);
      }
      results.push(p._id.toString());
    }
    res.status(201).json({ insertedOrUpdated: results.length, ids: results });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors });
    res.status(500).json({ message: e.message });
  }
});

export default router;

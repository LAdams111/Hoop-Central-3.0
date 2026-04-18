import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import Player from '../models/Player.js';
import AppSettings from '../models/AppSettings.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

function ageFromBirthDate(d) {
  if (!d) return null;
  const b = new Date(d);
  if (Number.isNaN(b.getTime())) return null;
  const diff = Date.now() - b.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

router.get('/count', async (_req, res) => {
  try {
    res.json({ count: await Player.countDocuments() });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/featured-players', async (_req, res) => {
  try {
    let doc = await AppSettings.findOne({ key: 'global' });
    if (!doc) {
      doc = await AppSettings.create({ key: 'global', featuredPlayerIds: [] });
    }
    const players = await Player.find({ _id: { $in: doc.featuredPlayerIds || [] } });
    const order = (doc.featuredPlayerIds || []).map((id) => id.toString());
    players.sort(
      (a, b) => order.indexOf(a._id.toString()) - order.indexOf(b._id.toString())
    );
    res.json(players.map((p) => p.toJSON()));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/featured-players', requireAdmin, async (req, res) => {
  try {
    const schema = z.object({
      players: z.array(z.object({ id: z.string() })).max(10),
    });
    const { players } = schema.parse(req.body);
    let doc = await AppSettings.findOne({ key: 'global' });
    if (!doc) doc = await AppSettings.create({ key: 'global', featuredPlayerIds: [] });
    doc.featuredPlayerIds = players
      .map((p) => new mongoose.Types.ObjectId(p.id))
      .slice(0, 5);
    await doc.save();
    res.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors });
    res.status(500).json({ message: e.message });
  }
});

router.get('/prospects', async (_req, res) => {
  try {
    const all = await Player.find({ birthDate: { $exists: true, $ne: null } }).lean();
    const under20 = all.filter((p) => {
      const a = ageFromBirthDate(p.birthDate);
      return a != null && a < 20;
    });
    under20.sort((a, b) => (b.profileViews || 0) - (a.profileViews || 0));
    const top = under20.slice(0, 50);
    const out = await Player.find({ _id: { $in: top.map((p) => p._id) } });
    out.sort((a, b) => (b.profileViews || 0) - (a.profileViews || 0));
    res.json(out.map((p) => p.toJSON()));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/birth-year-counts', async (_req, res) => {
  try {
    const players = await Player.find({ birthDate: { $exists: true, $ne: null } }).select(
      'birthDate'
    );
    const map = new Map();
    for (const p of players) {
      const y = new Date(p.birthDate).getFullYear();
      if (!Number.isNaN(y)) map.set(y, (map.get(y) || 0) + 1);
    }
    const years = [...map.keys()].sort((a, b) => b - a);
    res.json({ years, counts: Object.fromEntries(map) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/birth-year/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10);
    if (Number.isNaN(year)) return res.status(400).json({ message: 'Invalid year' });
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const players = await Player.find({
      birthDate: { $gte: start, $lt: end },
    })
      .sort({ profileViews: -1 })
      .limit(100)
      .lean();
    res.json(
      players.map((p) => ({
        ...p,
        id: p._id.toString(),
        player_id: p._id.toString(),
        _id: undefined,
      }))
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, position, sortBy } = req.query;
    const q = {};
    if (search && String(search).trim()) {
      const rx = new RegExp(escapeRegex(String(search).trim()), 'i');
      q.$or = [{ name: rx }, { team: rx }];
    }
    if (position && String(position).trim()) {
      q.position = String(position).trim();
    }
    let sort = { name: 1 };
    if (sortBy === 'views') sort = { profileViews: -1, name: 1 };
    const players = await Player.find(q).sort(sort).lean();
    res.json(
      players.map((p) => ({
        ...p,
        id: p._id.toString(),
        player_id: p._id.toString(),
        _id: undefined,
      }))
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player.toJSON());
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/:id/view', async (req, res) => {
  try {
    await Player.findByIdAndUpdate(req.params.id, { $inc: { profileViews: 1 } });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch('/:id/profile-views', requireAdmin, async (req, res) => {
  try {
    const { profileViews } = z
      .object({ profileViews: z.number().int().min(0) })
      .parse(req.body);
    const p = await Player.findByIdAndUpdate(
      req.params.id,
      { profileViews },
      { new: true }
    );
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p.toJSON());
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors });
    res.status(500).json({ message: e.message });
  }
});

router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const allowed = z
      .object({
        name: z.string().optional(),
        headshotUrl: z.string().optional(),
        jerseyNumber: z.number().optional(),
        position: z.string().optional(),
        team: z.string().optional(),
        birthDate: z.string().optional(),
        hometown: z.string().optional(),
        bio: z.string().optional(),
        height: z.string().optional(),
        weight: z.string().optional(),
        stats: z.any().optional(),
        seasonHistory: z.array(z.any()).optional(),
      })
      .strict()
      .partial();
    const body = allowed.parse(req.body);
    if (body.birthDate) {
      const d = new Date(body.birthDate);
      body.birthDate = Number.isNaN(d.getTime()) ? undefined : d;
    }
    const p = await Player.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p.toJSON());
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors });
    res.status(500).json({ message: e.message });
  }
});

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default router;

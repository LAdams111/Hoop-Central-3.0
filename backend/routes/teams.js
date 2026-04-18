import { Router } from 'express';
import League from '../models/League.js';
import Team from '../models/Team.js';

const router = Router();

router.get('/count', async (_req, res) => {
  try {
    const count = await Team.countDocuments();
    res.json({ count });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/all', async (_req, res) => {
  try {
    const teams = await Team.find().populate('league').lean();
    res.json(
      teams.map((t) => ({
        id: t._id.toString(),
        name: t.name,
        league: t.league?.name || '',
        season: t.currentSeason,
      }))
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.leagueSlug) {
      const lg = await League.findOne({ slug: req.query.leagueSlug });
      if (!lg) return res.json([]);
      query.league = lg._id;
    } else if (req.query.league) {
      query.league = req.query.league;
    }
    const teams = await Team.find(query).populate('league').lean();
    res.json(
      teams.map((t) => ({
        ...t,
        id: t._id.toString(),
        _id: undefined,
      }))
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/by-name/:teamName/roster/:season', async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.teamName);
    const season = decodeURIComponent(req.params.season);
    const team = await Team.findOne({
      name: new RegExp(`^${escapeRegex(name)}$`, 'i'),
    }).populate({
      path: 'seasons.roster',
      model: 'Player',
    });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    const seasonDoc = team.seasons?.find((s) => s.year === season);
    const roster = seasonDoc?.roster || [];
    res.json(
      roster.map((p) => (typeof p.toJSON === 'function' ? p.toJSON() : p))
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('league').populate({
      path: 'seasons.roster',
      model: 'Player',
    });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default router;

import { Router } from 'express';
import League from '../models/League.js';
import Team from '../models/Team.js';
import { getLeaguesCatalog, findCatalogLeagueBySlug } from '../lib/catalog.js';

const router = Router();

router.get('/catalog', (_req, res) => {
  res.json(getLeaguesCatalog());
});

/** Must be registered before /:slugOrId */
router.get('/:apiKey/teams', async (req, res) => {
  try {
    const { apiKey } = req.params;
    const league =
      (await League.findOne({ apiKey })) || (await League.findOne({ slug: apiKey }));
    if (!league) return res.json([]);
    const teams = await Team.find({ league: league._id }).lean();
    const out = teams.map((t) => {
      const season = t.seasons?.find((s) => s.year === t.currentSeason) || t.seasons?.[0];
      return {
        id: t._id.toString(),
        name: t.name,
        season: season?.year || t.currentSeason || '2025-26',
        logoUrl: t.logoUrl || null,
        league: league.name,
      };
    });
    res.json(out);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:slugOrId', async (req, res) => {
  try {
    const param = req.params.slugOrId;
    const isOid = /^[a-fA-F0-9]{24}$/.test(param);
    let league = isOid
      ? await League.findById(param)
      : await League.findOne({ slug: param });
    if (!league) {
      const catalog = findCatalogLeagueBySlug(param);
      if (!catalog) return res.status(404).json({ message: 'League not found' });
      return res.json({ ...catalog, _fromCatalog: true });
    }
    return res.json(league);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;

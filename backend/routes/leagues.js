import { Router } from 'express';
import League from '../models/League.js';
import Team from '../models/Team.js';
import { getLeaguesCatalog, findCatalogLeagueBySlug, findCatalogLeagueByApiKey } from '../lib/catalog.js';
import { getTeamsForLeague } from '../lib/teamsCatalog.js';

const router = Router();

router.get('/catalog', (_req, res) => {
  res.json(getLeaguesCatalog());
});

/** Must be registered before /:slugOrId */
router.get('/:apiKey/teams', async (req, res) => {
  try {
    const { apiKey } = req.params;
    const catalogMeta = findCatalogLeagueByApiKey(apiKey);
    const staticTeams = getTeamsForLeague(apiKey);

    const dbLeague =
      (await League.findOne({ apiKey })) || (await League.findOne({ slug: apiKey }));
    const leagueName = dbLeague?.name || catalogMeta?.name || apiKey;

    if (staticTeams.length > 0) {
      const out = staticTeams.map((t, i) => ({
        id: `catalog:${apiKey}:${i}`,
        name: t.name,
        season: t.season || '2025-26',
        logoUrl: t.logoUrl ?? null,
        league: leagueName,
      }));
      return res.json(out);
    }

    if (!dbLeague) return res.json([]);
    const teams = await Team.find({ league: dbLeague._id }).lean();
    const out = teams.map((t) => {
      const season = t.seasons?.find((s) => s.year === t.currentSeason) || t.seasons?.[0];
      return {
        id: t._id.toString(),
        name: t.name,
        season: season?.year || t.currentSeason || '2025-26',
        logoUrl: t.logoUrl || null,
        league: leagueName,
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

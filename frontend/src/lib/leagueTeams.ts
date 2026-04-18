import { api } from '@/lib/api';
import type { TeamListItem } from '@/types';
import fallbackTeams from '@/data/teamsCatalog.json';

type CatalogRow = { name: string; season?: string; logoUrl?: string | null };
type TeamsCatalogFile = Record<string, CatalogRow[]>;

/**
 * Loads teams from the API when reachable; otherwise uses bundled JSON (same as backend
 * `data/teamsCatalog.json`). Keeps league pages working on static Railway hosting.
 * Regenerate: `cd backend && npm run generate:teams` then copy `backend/data/teamsCatalog.json`
 * to `frontend/src/data/teamsCatalog.json`.
 */
export async function fetchLeagueTeams(apiKey: string, leagueName: string): Promise<TeamListItem[]> {
  try {
    const data = await api<TeamListItem[]>(`/api/leagues/${encodeURIComponent(apiKey)}/teams`);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    /* bundled fallback */
  }
  const raw = fallbackTeams as TeamsCatalogFile;
  const list = raw[apiKey];
  if (!Array.isArray(list) || list.length === 0) return [];
  return list.map((t, i) => ({
    id: `catalog:${apiKey}:${i}`,
    name: t.name,
    season: t.season || '2025-26',
    logoUrl: t.logoUrl ?? null,
    league: leagueName,
  }));
}

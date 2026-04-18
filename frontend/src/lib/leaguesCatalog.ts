import type { LeagueCatalogEntry } from '@/types';
import { api } from '@/lib/api';
import fallbackCatalog from '@/data/leaguesCatalog.json';

export type LeaguesCatalog = {
  domestic: LeagueCatalogEntry[];
  international: LeagueCatalogEntry[];
};

function isValidCatalog(x: unknown): x is LeaguesCatalog {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return Array.isArray(o.domestic) && Array.isArray(o.international);
}

/**
 * Loads league catalog from the API when available; otherwise uses bundled JSON
 * (static hosting has no /api proxy, so the live catalog must not be required for the list UI).
 * Keep `frontend/src/data/leaguesCatalog.json` in sync with `backend/data/leaguesCatalog.json`.
 */
export async function fetchLeaguesCatalog(): Promise<LeaguesCatalog> {
  try {
    const data = await api<LeaguesCatalog>('/api/leagues/catalog');
    if (isValidCatalog(data) && (data.domestic.length > 0 || data.international.length > 0)) {
      return data;
    }
  } catch {
    /* bundled fallback */
  }
  return fallbackCatalog as LeaguesCatalog;
}

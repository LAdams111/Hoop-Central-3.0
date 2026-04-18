import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let cached = null;

export function getLeaguesCatalog() {
  if (cached) return cached;
  const raw = readFileSync(join(__dirname, '../data/leaguesCatalog.json'), 'utf8');
  cached = JSON.parse(raw);
  return cached;
}

export function findCatalogLeagueBySlug(slug) {
  const { domestic, international } = getLeaguesCatalog();
  return [...domestic, ...international].find((l) => l.slug === slug) || null;
}

export function findCatalogLeagueByApiKey(apiKey) {
  if (!apiKey) return null;
  const { domestic, international } = getLeaguesCatalog();
  return (
    [...domestic, ...international].find(
      (l) => l.apiKey === apiKey || l.slug === apiKey
    ) || null
  );
}

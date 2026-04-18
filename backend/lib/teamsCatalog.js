import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let cached = null;

function load() {
  if (!cached) {
    cached = JSON.parse(readFileSync(join(__dirname, '../data/teamsCatalog.json'), 'utf8'));
  }
  return cached;
}

/** @returns {{ name: string, season?: string, logoUrl?: string | null }[]} */
export function getTeamsForLeague(apiKey) {
  if (!apiKey) return [];
  const raw = load();
  const list = raw[apiKey];
  return Array.isArray(list) ? list : [];
}

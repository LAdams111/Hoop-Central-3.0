import 'dotenv/config';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

import League from '../models/League.js';
import Team from '../models/Team.js';
import Player from '../models/Player.js';
import AppSettings from '../models/AppSettings.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadCatalog() {
  const p = join(__dirname, '../data/leaguesCatalog.json');
  return JSON.parse(readFileSync(p, 'utf8'));
}

function samplePlayers(teamName) {
  const base = (i, name, pos, num) => ({
    name,
    team: teamName,
    position: pos,
    jerseyNumber: num,
    height: `6'${6 + (i % 4)}"`,
    weight: `${210 + i * 3} lbs`,
    birthDate: new Date(2008 + (i % 3), 2, 10 + i),
    hometown: `${['Akron', 'Oakland', 'Chicago', 'Miami', 'Dallas'][i % 5]}, USA`,
    profileViews: 50000 - i * 1200,
    headshotUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    stats: {
      season: '2025-26',
      gamesPlayed: 72 - i,
      pointsPerGame: 28.5 - i * 0.8,
      reboundsPerGame: 8.2 - i * 0.2,
      assistsPerGame: 8.0 - i * 0.3,
      fieldGoalPercentage: 52.1 - i * 0.5,
      stealsPerGame: 1.2,
      blocksPerGame: 0.6,
    },
    seasonTrends: {
      points: [24, 26, 28, 27, 30, 29, 31].map((v) => v + i),
      assists: [7, 8, 9, 8, 9, 10, 9].map((v) => v + (i % 3)),
      rebounds: [7, 8, 8, 9, 8, 9, 10].map((v) => v + (i % 2)),
    },
    seasonHistory: [
      {
        season: '2024-25',
        league: 'NBA',
        team: teamName,
        gamesPlayed: 70,
        points: 26.4,
        rebounds: 7.8,
        assists: 8.1,
        blocks: 0.5,
        steals: 1.1,
        fieldGoalPercentage: 51.2,
      },
    ],
    bio: `${name} is a professional basketball player.`,
  });

  return [
    base(0, 'Alex Johnson', 'PG', 1),
    base(1, 'Jordan Williams', 'SG', 2),
    base(2, 'Casey Brown', 'SF', 3),
    base(3, 'Taylor Davis', 'PF', 4),
    base(4, 'Morgan Lee', 'C', 5),
  ];
}

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hoopcentral';
  await mongoose.connect(uri);
  console.log('Connected. Clearing collections…');
  await Promise.all([
    Player.deleteMany({}),
    Team.deleteMany({}),
    League.deleteMany({}),
    AppSettings.deleteMany({}),
  ]);

  const catalog = loadCatalog();
  const leagues = [];
  for (const L of [...catalog.domestic, ...catalog.international]) {
    leagues.push(
      await League.create({
        name: L.name,
        slug: L.slug,
        tier: L.tier,
        regions: L.regions || [],
        description: L.description,
        logoUrl: L.logoUrl,
        apiKey: L.apiKey || L.slug,
      })
    );
  }

  const nba = leagues.find((l) => l.slug === 'NBA');
  const lakers = await Team.create({
    name: 'Los Angeles Lakers',
    league: nba._id,
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg',
    currentSeason: '2025-26',
    seasons: [
      {
        year: '2025-26',
        wins: 42,
        losses: 28,
        roster: [],
      },
    ],
  });

  const players = [];
  for (const p of samplePlayers('Los Angeles Lakers')) {
    players.push(await Player.create({ ...p, externalId: `seed-${p.name.replace(/\s/g, '-')}` }));
  }

  lakers.seasons[0].roster = players.map((p) => p._id);
  await lakers.save();

  const featured = await AppSettings.create({
    key: 'global',
    featuredPlayerIds: players.slice(0, 3).map((p) => p._id),
  });

  if (process.env.ADMIN_PASSWORD_HASH) {
    console.log('ADMIN_PASSWORD_HASH already set in env');
  } else if (process.env.SEED_ADMIN_PASSWORD) {
    const hash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 10);
    console.log('\nSet this in Railway as ADMIN_PASSWORD_HASH:\n', hash, '\n');
  } else {
    const hash = await bcrypt.hash('changeme', 10);
    console.log('\nDefault admin password: changeme');
    console.log('Set ADMIN_PASSWORD_HASH in production:\n', hash, '\n');
  }

  console.log('Seed complete:', {
    leagues: leagues.length,
    teams: 1,
    players: players.length,
    featured: featured.featuredPlayerIds.length,
  });
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

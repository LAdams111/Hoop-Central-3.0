export type TeamListItem = {
  id: string;
  name: string;
  season: string;
  logoUrl?: string | null;
  league?: string;
};

export type LeagueCatalogEntry = {
  name: string;
  slug: string;
  tier: string;
  description: string;
  logoUrl?: string;
  regions: string[];
  apiKey?: string;
};

export type Player = {
  id: string;
  player_id?: string;
  name: string;
  headshotUrl?: string;
  jerseyNumber?: number;
  position?: string;
  team?: string;
  birthDate?: string;
  hometown?: string;
  bio?: string;
  height?: string;
  weight?: string;
  profileViews?: number;
  stats?: {
    season?: string;
    gamesPlayed?: number;
    pointsPerGame?: number;
    reboundsPerGame?: number;
    assistsPerGame?: number;
    fieldGoalPercentage?: number;
    stealsPerGame?: number;
    blocksPerGame?: number;
  };
  seasonTrends?: { points?: number[]; assists?: number[]; rebounds?: number[] };
  seasonHistory?: Array<{
    season: string;
    league: string;
    team: string;
    gamesPlayed?: number;
    points?: number;
    rebounds?: number;
    assists?: number;
    blocks?: number;
    steals?: number;
    fieldGoalPercentage?: number;
  }>;
};

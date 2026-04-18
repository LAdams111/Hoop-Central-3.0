import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronRight, Users } from 'lucide-react';
import type { Player } from '@/types';
import { NBA_TEAM_LOGO_IDS, DEFAULT_FAVORITE_TEAMS } from '@/data/nbaTeams';

const logoUrl = (team: string) =>
  `https://cdn.nba.com/logos/nba/${NBA_TEAM_LOGO_IDS[team] || '1610612737'}/global/L/logo.svg`;

export function FavoritesStrip({ players }: { players: Player[] }) {
  const [favTeams, setFavTeams] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('team_favorites');
      setFavTeams(raw ? JSON.parse(raw) : DEFAULT_FAVORITE_TEAMS);
    } catch {
      setFavTeams(DEFAULT_FAVORITE_TEAMS);
    }
  }, []);

  return (
    <section className="overflow-hidden border-y border-border bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="no-scrollbar flex items-center gap-6 overflow-x-auto pb-2">
          <div className="flex flex-shrink-0 items-center gap-2 border-r border-border pr-6">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="font-display text-sm font-bold uppercase tracking-tight md:text-xl">
              Your Favorites
            </span>
          </div>
          <div className="flex items-center gap-4">
            {favTeams.map((team) => (
              <Link
                key={team}
                to={`/players?team=${encodeURIComponent(team)}`}
                className="group relative"
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-white p-1.5 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-primary">
                  <img src={logoUrl(team)} alt={team} className="h-full w-full object-contain" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
            {players.length > 0 || favTeams.length > 0 ? (
              players.slice(0, 6).map((p) => (
                <Link key={p.id} to={`/players/${p.id}`} className="group relative">
                  <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-border shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-primary">
                    <img
                      src={p.headshotUrl}
                      alt={p.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))
            ) : (
              <div className="-space-x-4 flex items-center opacity-40">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-muted/50"
                  >
                    <Users className="h-4 w-4" />
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/players"
              className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-border transition-all hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

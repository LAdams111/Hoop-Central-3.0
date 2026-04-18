import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Player } from '@/types';
import { PlayerCard } from '@/components/PlayerCard';

export function RosterPage() {
  const { team, season } = useParams<{ team: string; season: string }>();
  const teamName = team ? decodeURIComponent(team) : '';
  const seasonYear = season ? decodeURIComponent(season) : '';

  const { data = [], isLoading } = useQuery({
    queryKey: ['roster', teamName, seasonYear],
    queryFn: () =>
      api<Player[]>(
        `/api/teams/by-name/${encodeURIComponent(teamName)}/roster/${encodeURIComponent(seasonYear)}`
      ),
    enabled: !!teamName && !!seasonYear,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/leagues/NBA" className="text-sm text-primary hover:underline">
        ← Back to league
      </Link>
      <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">{teamName}</h1>
      <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
        {seasonYear} roster
      </p>
      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>
      )}
      {!isLoading && data.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No roster data for this team/season.</p>
      ) : null}
    </div>
  );
}

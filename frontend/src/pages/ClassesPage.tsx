import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import type { Player } from '@/types';

type CountsResp = { years: number[]; counts: Record<string, number> };

export function ClassesPage() {
  const [year, setYear] = useState<number | null>(null);

  const { data: meta } = useQuery({
    queryKey: ['birth-year-counts'],
    queryFn: () => api<CountsResp>('/api/players/birth-year-counts'),
  });

  const { data: players = [], isLoading } = useQuery({
    queryKey: ['birth-year', year],
    queryFn: () => api<Player[]>(`/api/players/birth-year/${year}`),
    enabled: year != null,
  });

  const counts = meta?.counts ?? {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="mb-4 font-display text-5xl font-bold">Birth Year</h1>
        <p className="text-lg text-muted-foreground">
          Browse players by the year they were born, ranked by profile views.
        </p>
      </div>

      {year != null ? (
        <div className="animate-in space-y-8 fade-in">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
              onClick={() => setYear(null)}
            >
              ← All Years
            </button>
            <h2 className="font-display text-3xl">Born in {year}</h2>
            <span className="ml-auto font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Max 100 results
            </span>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : players.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {players.map((c, f) => (
                <Link key={c.id} to={`/players/${c.id}`}>
                  <article className="h-full cursor-pointer overflow-hidden rounded-lg border border-border transition-all hover:border-primary/50">
                    <div className="flex items-center gap-4 p-4">
                      <div className="flex w-8 justify-center font-display text-lg font-bold text-muted-foreground">
                        {f + 1}
                      </div>
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted">
                        <img
                          src={c.headshotUrl}
                          alt=""
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                          {c.team}
                        </div>
                        <h3 className="truncate font-display text-xl font-bold leading-none">{c.name}</h3>
                        <div className="mt-1 font-mono text-xs text-muted-foreground">
                          {c.position} · #{c.jerseyNumber}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="font-mono font-bold">{c.profileViews}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border py-20 text-center">
              <p className="font-display text-2xl uppercase text-muted-foreground">
                No players found for {year}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {(meta?.years ?? []).map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className="group rounded-lg border-2 border-border bg-card text-center transition-all hover:border-primary"
            >
              <div className="border-b border-border pb-2 pt-4">
                <Calendar className="mx-auto mb-2 h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                <div className="font-display text-3xl">{y}</div>
              </div>
              <div className="flex items-center justify-center gap-2 py-3 font-mono text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {counts[String(y)] ?? 0} PLAYER{(counts[String(y)] ?? 0) !== 1 ? 'S' : ''}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

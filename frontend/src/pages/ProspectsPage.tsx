import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, Eye } from 'lucide-react';
import { api } from '@/lib/api';
import type { Player } from '@/types';

function ageFromBirth(d?: string) {
  if (!d) return null;
  const b = new Date(d);
  if (Number.isNaN(b.getTime())) return null;
  return Math.floor((Date.now() - b.getTime()) / (365.25 * 24 * 3600 * 1000));
}

export function ProspectsPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: () => api<Player[]>('/api/players/prospects'),
  });

  return (
    <div className="min-h-screen bg-background pb-24 pt-8">
      <div className="container mx-auto px-4">
        <Link to="/" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          ← Back to Home
        </Link>
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-4xl uppercase tracking-tighter text-foreground md:text-6xl">
              Hottest <span className="text-primary">Prospects</span>
            </h1>
            <p className="font-mono text-sm text-muted-foreground">
              Top 50 most viewed players under 20
            </p>
          </div>
        </div>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : data.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/30 py-24 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="font-display text-2xl text-muted-foreground">No prospects found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No players under 20 in the database yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((n, i) => {
              const age = ageFromBirth(n.birthDate);
              return (
                <Link
                  key={n.id}
                  to={`/players/${n.id}`}
                  className="block rounded-xl border border-border bg-card transition-colors hover:border-primary/40 hover:bg-card/80"
                >
                  <div className="flex cursor-pointer items-center gap-3 px-3 py-3 md:gap-4 md:px-5 md:py-4">
                    <div className="w-7 flex-shrink-0 text-center font-mono text-sm text-muted-foreground">
                      {i + 1}
                    </div>
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-border md:h-12 md:w-12">
                      <img
                        src={n.headshotUrl}
                        alt=""
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-sm font-bold text-foreground transition-colors group-hover:text-primary md:text-base">
                        {n.name}
                      </div>
                      <div className="truncate font-mono text-[10px] uppercase text-muted-foreground md:text-xs">
                        {n.team} {n.position ? `• ${n.position}` : ''}
                      </div>
                    </div>
                    {age != null ? (
                      <span className="flex-shrink-0 rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs">
                        Age {age}
                      </span>
                    ) : null}
                    <div className="flex flex-shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {n.profileViews ?? 0}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

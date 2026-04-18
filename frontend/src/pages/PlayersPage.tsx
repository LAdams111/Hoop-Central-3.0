import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import type { Player } from '@/types';
import { PlayerCard } from '@/components/PlayerCard';

export function PlayersPage() {
  const [params] = useSearchParams();
  const teamQ = params.get('team') || '';
  const qParam = params.get('q') || '';
  const [search, setSearch] = useState(qParam);
  const [position, setPosition] = useState('');

  useEffect(() => {
    setSearch(qParam);
  }, [qParam]);

  const { data: raw = [], isLoading } = useQuery({
    queryKey: ['players-directory'],
    queryFn: () => api<Player[]>('/api/players'),
  });

  const positions = useMemo(() => {
    const s = new Set<string>();
    raw.forEach((p) => p.position && s.add(p.position));
    return ['', ...[...s].sort()];
  }, [raw]);

  const filtered = useMemo(() => {
    let list = raw;
    if (teamQ) {
      list = list.filter((p) => p.team?.toLowerCase().includes(teamQ.toLowerCase()));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.team && p.team.toLowerCase().includes(q))
      );
    }
    if (position) {
      list = list.filter((p) => p.position === position);
    }
    return list;
  }, [raw, teamQ, search, position]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 font-display text-4xl font-bold md:text-5xl">Player Directory</h1>
      <p className="mb-8 text-muted-foreground">
        Search and filter every athlete in the database{teamQ ? ` — ${teamQ}` : ''}.
      </p>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none ring-primary focus:ring-2"
            placeholder="Search by name or team…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm md:w-48"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          <option value="">All positions</option>
          {positions
            .filter(Boolean)
            .map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
        </select>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>
      )}
      {!isLoading && filtered.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">No players match your filters.</p>
      ) : null}
    </div>
  );
}

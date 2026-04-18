import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings2, X, Save, Search } from 'lucide-react';
import type { Player } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const MAX = 5;

function avatarUrl(p: Player) {
  return (
    p.headshotUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.name)}`
  );
}

export function FeaturedEditor({
  featured,
  allPlayers,
}: {
  featured: Player[];
  allPlayers: Player[];
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Player[]>([]);
  const [q, setQ] = useState('');

  const searchResults = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return allPlayers
      .filter((p) => p.name.toLowerCase().includes(term))
      .filter((p) => !selected.some((s) => s.id === p.id))
      .slice(0, 12);
  }, [q, allPlayers, selected]);

  const save = useMutation({
    mutationFn: async (players: Player[]) => {
      await api('/api/players/featured-players', {
        method: 'POST',
        body: JSON.stringify({ players: players.slice(0, MAX).map((p) => ({ id: p.id })) }),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['featured'] });
      setOpen(false);
      setSelected([]);
      setQ('');
    },
  });

  function startEdit() {
    setSelected(featured.slice(0, MAX));
    setOpen(true);
  }

  function addPlayer(p: Player) {
    setSelected((prev) => {
      if (prev.some((x) => x.id === p.id) || prev.length >= MAX) return prev;
      return [...prev, p];
    });
    setQ('');
  }

  function removePlayer(id: string) {
    setSelected((prev) => prev.filter((p) => p.id !== id));
  }

  if (!open) {
    return (
      <Button variant="outline" className="gap-2 text-xs" onClick={startEdit}>
        <Settings2 className="h-4 w-4" />
        Edit featured
      </Button>
    );
  }

  return (
    <div className="mb-8 w-full rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-display text-sm uppercase tracking-wider text-primary">
          Admin: pick {MAX} featured players
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {selected.length}/{MAX}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            disabled={save.isPending || selected.length === 0}
            onClick={() => save.mutate(selected)}
          >
            <Save className="h-3 w-3" />
            {save.isPending ? 'Saving…' : 'Save'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {selected.map((p) => (
          <span
            key={p.id}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-1 text-xs"
          >
            <img src={avatarUrl(p)} alt="" className="h-5 w-5 rounded-full object-cover" />
            {p.name}
            <button
              type="button"
              className="ml-1 text-muted-foreground hover:text-destructive"
              onClick={() => removePlayer(p.id)}
              aria-label={`Remove ${p.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className="w-full rounded-md border border-border bg-muted py-2 pl-9 pr-3 text-sm outline-none ring-primary focus:ring-2"
          placeholder="Search players to add…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {q.trim() ? (
        <ul className="mt-2 max-h-48 overflow-y-auto rounded-md border border-border">
          {searchResults.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted',
                  selected.length >= MAX && 'opacity-50'
                )}
                disabled={selected.length >= MAX}
                onClick={() => addPlayer(p)}
              >
                <img src={avatarUrl(p)} alt="" className="h-8 w-8 rounded-full object-cover" />
                <span className="font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.team}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

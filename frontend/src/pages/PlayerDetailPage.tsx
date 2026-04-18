import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Save, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Player } from '@/types';
import { PlayerTrendCharts } from '@/components/PlayerTrendCharts';
import { Button } from '@/components/ui/Button';

function ageFromBirth(d?: string) {
  if (!d) return null;
  const b = new Date(d);
  if (Number.isNaN(b.getTime())) return null;
  return Math.floor((Date.now() - b.getTime()) / (365.25 * 24 * 3600 * 1000));
}

function toDateInputValue(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const admin = !!localStorage.getItem('admin_token');
  const [editing, setEditing] = useState(false);
  const [viewsDraft, setViewsDraft] = useState('');
  const [draft, setDraft] = useState<Partial<Player>>({});

  const { data: player, isLoading } = useQuery({
    queryKey: ['player', id],
    queryFn: () => api<Player>(`/api/players/${id}`),
    enabled: !!id,
  });

  useEffect(() => {
    if (!id) return;
    api('/api/players/' + id + '/view', { method: 'POST' }).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (player) {
      setDraft({
        name: player.name,
        position: player.position,
        team: player.team,
        height: player.height,
        weight: player.weight,
        jerseyNumber: player.jerseyNumber,
        birthDate: player.birthDate,
        hometown: player.hometown,
        bio: player.bio,
      });
      setViewsDraft(String(player.profileViews ?? 0));
    }
  }, [player]);

  const savePlayer = useMutation({
    mutationFn: async () => {
      const body: Record<string, unknown> = { ...draft };
      if (draft.birthDate) body.birthDate = new Date(String(draft.birthDate)).toISOString();
      await api(`/api/players/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['player', id] });
      setEditing(false);
    },
  });

  const saveViews = useMutation({
    mutationFn: async () => {
      const n = parseInt(viewsDraft, 10);
      if (Number.isNaN(n) || n < 0) throw new Error('Invalid');
      await api(`/api/players/${id}/profile-views`, {
        method: 'PATCH',
        body: JSON.stringify({ profileViews: n }),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['player', id] });
    },
  });

  if (isLoading || !player) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  const st = player.stats;
  const trendPts =
    player.seasonTrends?.points?.map((y, i) => ({ g: i + 1, v: y })) ?? [];
  const trendKey =
    player.position === 'C' || player.position === 'PF' ? 'reboundsPerGame' : 'assistsPerGame';
  const trendArr =
    trendKey === 'reboundsPerGame'
      ? player.seasonTrends?.rebounds
      : player.seasonTrends?.assists;
  const trend2 = trendArr?.map((y, i) => ({ g: i + 1, v: y })) ?? [];
  const trendLabel = trendKey === 'reboundsPerGame' ? 'Rebounds' : 'Assists';

  const display = editing ? draft : player;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div
        className="relative h-64 w-full bg-muted md:h-80"
        style={{
          backgroundImage: player.headshotUrl ? `url(${player.headshotUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
      </div>
      <div className="container relative z-10 mx-auto -mt-32 px-4">
        <Link to="/players" className="text-sm font-medium text-primary hover:underline">
          ← Directory
        </Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
              <img
                src={
                  player.headshotUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(player.name)}`
                }
                alt=""
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
          </div>
          <div className="lg:col-span-8">
            <p className="font-mono text-sm uppercase tracking-widest text-primary">
              {display.team}
            </p>
            <h1 className="font-display text-5xl font-bold leading-none tracking-tighter md:text-8xl">
              {display.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-foreground/60 md:text-sm">
              <span className="rounded-full border border-border px-4 py-1">{display.position}</span>
              <span className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1">
                <span className="font-bold text-primary">HT</span> {display.height ?? '—'}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1">
                <span className="font-bold text-primary">WT</span> {display.weight ?? '—'}
              </span>
              {display.birthDate ? (
                <>
                  <span className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1">
                    <span className="font-bold text-primary">AGE</span>{' '}
                    {ageFromBirth(String(display.birthDate))}
                  </span>
                  <span className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1">
                    <span className="font-bold text-primary">DOB</span>{' '}
                    {new Date(String(display.birthDate)).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </>
              ) : null}
            </div>
            {display.hometown ? (
              <div className="mt-4 w-fit rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
                  Hometown
                </span>
                <span className="font-mono text-lg font-bold">{display.hometown}</span>
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-3 shadow-sm">
                <span className="text-primary">◎</span>
                <span className="font-display text-2xl font-bold uppercase tracking-wider">
                  <span className="text-foreground">{player.profileViews ?? 0}</span>
                  <span className="ml-3 text-muted-foreground">Profile Views</span>
                </span>
              </div>
              {admin ? (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Set views
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-24 rounded-md border border-border bg-muted px-2 py-1.5 font-mono text-sm outline-none ring-primary focus:ring-2"
                    value={viewsDraft}
                    onChange={(e) => setViewsDraft(e.target.value)}
                  />
                  <Button size="sm" variant="secondary" disabled={saveViews.isPending} onClick={() => saveViews.mutate()}>
                    {saveViews.isPending ? '…' : 'Save'}
                  </Button>
                </div>
              ) : null}
            </div>
            {admin ? (
              <div className="mt-4 flex gap-2">
                {!editing ? (
                  <Button variant="outline" className="gap-2" onClick={() => setEditing(true)}>
                    <Pencil className="h-4 w-4" />
                    Edit player
                  </Button>
                ) : (
                  <>
                    <Button className="gap-2" disabled={savePlayer.isPending} onClick={() => savePlayer.mutate()}>
                      <Save className="h-4 w-4" />
                      {savePlayer.isPending ? 'Saving…' : 'Save changes'}
                    </Button>
                    <Button variant="ghost" className="gap-2" onClick={() => setEditing(false)}>
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {editing ? (
          <section className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h3 className="mb-4 font-display text-2xl">Edit player</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <label className="flex flex-col gap-1 text-xs font-bold uppercase text-muted-foreground">
                Name
                <input
                  className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground"
                  value={draft.name ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold uppercase text-muted-foreground">
                Position
                <select
                  className="rounded-md border border-border bg-muted px-3 py-2 text-sm"
                  value={draft.position ?? 'PG'}
                  onChange={(e) => setDraft((d) => ({ ...d, position: e.target.value }))}
                >
                  {['PG', 'SG', 'SF', 'PF', 'C'].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold uppercase text-muted-foreground">
                Team
                <input
                  className="rounded-md border border-border bg-muted px-3 py-2 text-sm"
                  value={draft.team ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, team: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold uppercase text-muted-foreground">
                Height
                <input
                  className="rounded-md border border-border bg-muted px-3 py-2 text-sm"
                  value={draft.height ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, height: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold uppercase text-muted-foreground">
                Weight
                <input
                  className="rounded-md border border-border bg-muted px-3 py-2 text-sm"
                  value={draft.weight ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, weight: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold uppercase text-muted-foreground">
                Jersey #
                <input
                  type="number"
                  className="rounded-md border border-border bg-muted px-3 py-2 text-sm"
                  value={draft.jerseyNumber ?? 0}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, jerseyNumber: parseInt(e.target.value, 10) || 0 }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold uppercase text-muted-foreground">
                Date of birth
                <input
                  type="date"
                  className="rounded-md border border-border bg-muted px-3 py-2 text-sm"
                  value={toDateInputValue(draft.birthDate ? String(draft.birthDate) : undefined)}
                  onChange={(e) => setDraft((d) => ({ ...d, birthDate: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold uppercase text-muted-foreground">
                Hometown
                <input
                  className="rounded-md border border-border bg-muted px-3 py-2 text-sm"
                  value={draft.hometown ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, hometown: e.target.value }))}
                />
              </label>
              <label className="col-span-full flex flex-col gap-1 text-xs font-bold uppercase text-muted-foreground">
                Bio
                <textarea
                  rows={3}
                  className="resize-none rounded-md border border-border bg-muted px-3 py-2 text-sm"
                  value={draft.bio ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                />
              </label>
            </div>
          </section>
        ) : null}

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-xl lg:col-span-1">
            <h3 className="mb-4 border-b border-border pb-2 font-display text-2xl">
              Current Season ({st?.season ?? '2025-26'})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-background p-4 text-center">
                <div className="font-display text-4xl">{st?.pointsPerGame?.toFixed(1) ?? '—'}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">PPG</div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 text-center">
                <div className="font-display text-4xl">{st?.assistsPerGame?.toFixed(1) ?? '—'}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">APG</div>
              </div>
              <div className="col-span-2 rounded-xl border border-border bg-background p-4 text-center">
                <div className="font-display text-4xl">{st?.reboundsPerGame?.toFixed(1) ?? '—'}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">RPG</div>
              </div>
            </div>
          </section>
          <PlayerTrendCharts trendPts={trendPts} trend2={trend2} trendLabel={trendLabel} />
        </div>

        {player.seasonHistory && player.seasonHistory.length > 0 ? (
          <section className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="border-b border-border p-6">
              <h3 className="font-display text-2xl">Season History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted font-mono text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Season</th>
                    <th className="px-6 py-4">League</th>
                    <th className="px-6 py-4">Team</th>
                    <th className="px-6 py-4">GP</th>
                    <th className="px-6 py-4 text-primary">PTS</th>
                    <th className="px-6 py-4">REB</th>
                    <th className="px-6 py-4 text-accent">AST</th>
                    <th className="px-6 py-4">BLK</th>
                    <th className="px-6 py-4">STL</th>
                    <th className="px-6 py-4 text-yellow-600">FG%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...player.seasonHistory]
                    .sort((a, b) => b.season.localeCompare(a.season))
                    .map((row, i) => (
                      <tr key={i}>
                        <td className="px-6 py-3">{row.season}</td>
                        <td className="px-6 py-3">{row.league}</td>
                        <td className="px-6 py-3 text-primary">{row.team}</td>
                        <td className="px-6 py-3">{row.gamesPlayed ?? '—'}</td>
                        <td className="px-6 py-3 font-bold text-primary">
                          {typeof row.points === 'number' ? row.points.toFixed(1) : row.points}
                        </td>
                        <td className="px-6 py-3">
                          {typeof row.rebounds === 'number' ? row.rebounds.toFixed(1) : row.rebounds}
                        </td>
                        <td className="px-6 py-3 font-bold text-accent">
                          {typeof row.assists === 'number' ? row.assists.toFixed(1) : row.assists}
                        </td>
                        <td className="px-6 py-3">
                          {typeof row.blocks === 'number' ? row.blocks.toFixed(1) : row.blocks}
                        </td>
                        <td className="px-6 py-3">
                          {typeof row.steals === 'number' ? row.steals.toFixed(1) : row.steals}
                        </td>
                        <td className="px-6 py-3 text-yellow-600">
                          {row.fieldGoalPercentage != null
                            ? `${Number(row.fieldGoalPercentage).toFixed(1)}%`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {player.bio && !editing ? (
          <section className="mt-12 rounded-2xl border border-border bg-card/50 p-6">
            <h3 className="mb-2 font-display text-xl">Bio</h3>
            <p className="text-muted-foreground">{player.bio}</p>
          </section>
        ) : null}
      </div>
    </div>
  );
}

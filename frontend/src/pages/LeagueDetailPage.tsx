import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { fetchLeagueTeams } from '@/lib/leagueTeams';
import { fetchLeaguesCatalog } from '@/lib/leaguesCatalog';

const flag = (code: string) =>
  `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;

export function LeagueDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [q, setQ] = useState('');

  const { data: catalog, isPending: catalogPending } = useQuery({
    queryKey: ['leagues-catalog'],
    queryFn: fetchLeaguesCatalog,
  });

  const meta = useMemo(() => {
    if (!catalog || !slug) return null;
    return [...catalog.domestic, ...catalog.international].find((l) => l.slug === slug) ?? null;
  }, [catalog, slug]);

  const apiKey = meta?.apiKey ?? slug;

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['league-teams', apiKey, meta?.name],
    queryFn: () => fetchLeagueTeams(apiKey!, meta!.name),
    enabled: !!apiKey && !!meta,
  });

  const filtered = teams.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()));

  if (!slug) return null;

  if (catalogPending && !catalog) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link to="/leagues" className="text-primary hover:underline">
          ← Leagues
        </Link>
        <p className="mt-4 text-muted-foreground">Loading league…</p>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link to="/leagues" className="text-primary hover:underline">
          ← Leagues
        </Link>
        <p className="mt-4 text-muted-foreground">League not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/leagues" className="text-sm font-medium text-primary hover:underline">
        ← Leagues
      </Link>
      <header className="mt-6 flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-center">
        <div className="flex h-24 w-24 items-center justify-center md:h-32 md:w-32">
          {meta.logoUrl ? (
            <img src={meta.logoUrl} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 font-display text-3xl text-primary">
              {meta.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">{meta.tier}</p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">{meta.name}</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">{meta.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {meta.regions.map((r) => (
              <img key={r} src={flag(r)} alt={r} className="h-5 w-7 rounded-sm border border-border" />
            ))}
          </div>
        </div>
      </header>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-2xl">Teams</h2>
          <span className="text-sm text-muted-foreground">
            {filtered.length} of {teams.length}
          </span>
        </div>
        <input
          className="mb-6 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          placeholder="Search teams…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border py-20 text-center">
            <p className="font-display text-2xl uppercase text-muted-foreground">
              No teams found in this league yet
            </p>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Add teams in the catalog or connect the API with a seeded database
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">No teams match your search.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <Link
                key={t.id}
                to={`/roster/${encodeURIComponent(t.name)}/${encodeURIComponent(t.season)}`}
                className="block rounded-lg border border-border bg-card/50 p-3 backdrop-blur-sm transition-colors hover:border-primary/40"
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 truncate font-mono text-[10px] uppercase tracking-widest text-primary">
                      {meta.name}
                    </div>
                    <div className="truncate text-sm font-bold">{t.name}</div>
                    <div className="mt-2 flex items-center justify-between gap-1">
                      <span className="font-mono text-[9px] text-muted-foreground">{t.season}</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  {t.logoUrl ? (
                    <img src={t.logoUrl} alt="" className="h-8 w-8 flex-shrink-0 object-contain" />
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

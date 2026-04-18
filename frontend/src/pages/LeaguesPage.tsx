import { useQuery } from '@tanstack/react-query';
import { LeagueCard, LeagueCardSkeleton } from '@/components/LeagueCard';
import { api } from '@/lib/api';
import type { LeagueCatalogEntry } from '@/types';

type Catalog = { domestic: LeagueCatalogEntry[]; international: LeagueCatalogEntry[] };

export function LeaguesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['leagues-catalog'],
    queryFn: () => api<Catalog>('/api/leagues/catalog'),
  });

  if (isLoading || !data) {
    return (
      <div className="container mx-auto space-y-4 px-4 py-8">
        {[1, 2, 3, 4].map((i) => (
          <LeagueCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 md:mb-12">
        <h1 className="mb-2 font-display text-3xl font-bold md:mb-4 md:text-5xl">Leagues</h1>
        <p className="text-sm text-muted-foreground md:text-lg">
          Browse leagues and explore team rosters.
        </p>
      </div>
      <div className="space-y-3 md:space-y-6">
        {data.domestic.map((l) => (
          <LeagueCard key={l.slug} league={l} />
        ))}
      </div>
      <div className="mb-6 mt-10 md:mb-12 md:mt-16">
        <h2 className="mb-2 font-display text-2xl font-bold md:mb-4 md:text-4xl">International</h2>
        <p className="text-sm text-muted-foreground md:text-lg">
          Professional basketball leagues from around the globe.
        </p>
      </div>
      <div className="space-y-3 md:space-y-6">
        {data.international.map((l) => (
          <LeagueCard key={l.slug} league={l} />
        ))}
      </div>
    </div>
  );
}

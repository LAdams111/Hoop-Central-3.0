import { lazy, Suspense } from 'react';
import type { TrendPoint } from './PlayerTrendChartsInner';

const Inner = lazy(() => import('./PlayerTrendChartsInner'));

function ChartFallback() {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-6 lg:col-span-2">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex h-56 animate-pulse items-center justify-center rounded-2xl border border-border bg-muted/40 text-xs text-muted-foreground"
        >
          Loading chart…
        </div>
      ))}
    </div>
  );
}

export function PlayerTrendCharts({
  trendPts,
  trend2,
  trendLabel,
}: {
  trendPts: TrendPoint[];
  trend2: TrendPoint[];
  trendLabel: string;
}) {
  return (
    <Suspense fallback={<ChartFallback />}>
      <Inner trendPts={trendPts} trend2={trend2} trendLabel={trendLabel} />
    </Suspense>
  );
}

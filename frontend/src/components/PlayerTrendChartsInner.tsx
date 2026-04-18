import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export type TrendPoint = { g: number; v: number };

export default function PlayerTrendChartsInner({
  trendPts,
  trend2,
  trendLabel,
}: {
  trendPts: TrendPoint[];
  trend2: TrendPoint[];
  trendLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-6 lg:col-span-2">
      <div className="h-56 rounded-2xl border border-border bg-card p-4">
        <p className="mb-2 font-mono text-xs uppercase text-muted-foreground">Points</p>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={trendPts}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="g" tick={{ fontSize: 10 }} />
            <YAxis width={28} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="v" stroke="hsl(24 95% 53%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-56 rounded-2xl border border-border bg-card p-4">
        <p className="mb-2 font-mono text-xs uppercase text-muted-foreground">{trendLabel}</p>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={trend2}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="g" tick={{ fontSize: 10 }} />
            <YAxis width={28} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="v" stroke="hsl(172 66% 50%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

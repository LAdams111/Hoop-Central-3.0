import { Link } from 'react-router-dom';
import type { Player } from '@/types';

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="100" viewBox="0 0 80 100"><rect fill="#e5e7eb" width="80" height="100"/><text x="40" y="55" text-anchor="middle" fill="#9ca3af" font-size="12">Photo</text></svg>`
  );

export function PlayerCard({ player, href }: { player: Player; href?: string }) {
  const id = player.id || player.player_id || '';
  const to = href ?? `/players/${id}`;
  return (
    <Link to={to} className="group block h-full">
      <article className="relative flex min-h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[4/5] flex-shrink-0 overflow-hidden bg-muted">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          <img
            src={player.headshotUrl || PLACEHOLDER}
            alt=""
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER;
            }}
          />
          <div className="absolute right-2 top-2 z-20 font-display text-xl font-bold text-foreground/5 transition-colors group-hover:text-primary/10 md:right-4 md:top-4 md:text-4xl">
            #{player.jerseyNumber ?? '—'}
          </div>
          <div className="absolute bottom-2 left-2 z-20 md:bottom-4 md:left-4">
            <span className="rounded-sm bg-primary px-1.5 py-0 text-[10px] font-bold uppercase tracking-wider text-white md:px-2.5 md:text-xs">
              {player.position || '—'}
            </span>
          </div>
        </div>
        <div className="relative z-20 flex flex-1 flex-col justify-between gap-1 p-2 md:gap-3 md:p-5">
          <div className="min-h-0">
            <div className="mb-0.5 truncate font-mono text-[8px] uppercase tracking-widest text-primary md:mb-1 md:text-[10px]">
              {player.team}
            </div>
            <h3 className="line-clamp-2 font-display text-sm leading-tight text-foreground transition-colors group-hover:text-primary md:text-2xl">
              {player.name}
            </h3>
          </div>
        </div>
      </article>
    </Link>
  );
}

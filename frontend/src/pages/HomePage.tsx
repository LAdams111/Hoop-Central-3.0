import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Lock, LogOut, Search, Trophy, Users } from 'lucide-react';
import { api } from '@/lib/api';
import type { Player } from '@/types';
import { FavoritesStrip } from '@/components/FavoritesStrip';
import { FeaturedEditor } from '@/components/FeaturedEditor';
import { PlayerCard } from '@/components/PlayerCard';
import { Button } from '@/components/ui/Button';
import { useState, type FormEvent } from 'react';

export function HomePage() {
  const navigate = useNavigate();
  const [heroQ, setHeroQ] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const admin = !!localStorage.getItem('admin_token');

  function submitHeroSearch(e?: FormEvent) {
    e?.preventDefault();
    const q = heroQ.trim();
    if (q) navigate(`/players?q=${encodeURIComponent(q)}`);
    else navigate('/players');
  }

  const { data: pCount } = useQuery({
    queryKey: ['players-count'],
    queryFn: () => api<{ count: number }>('/api/players/count'),
  });
  const { data: tCount } = useQuery({
    queryKey: ['teams-count'],
    queryFn: () => api<{ count: number }>('/api/teams/count'),
  });
  const { data: allPlayers = [] } = useQuery({
    queryKey: ['players-all'],
    queryFn: () => api<Player[]>('/api/players'),
  });
  const { data: trending = [] } = useQuery({
    queryKey: ['players-trending'],
    queryFn: () => api<Player[]>('/api/players?sortBy=views'),
  });
  const { data: featured = [] } = useQuery({
    queryKey: ['featured'],
    queryFn: () => api<Player[]>('/api/players/featured-players'),
  });

  async function login() {
    setErr('');
    try {
      const res = await api<{ token: string }>('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password: pw }),
      });
      localStorage.setItem('admin_token', res.token);
      setAdminOpen(false);
      setPw('');
      window.location.reload();
    } catch {
      setErr('Invalid password');
    }
  }

  function logout() {
    localStorage.removeItem('admin_token');
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Hero: brand + search (matches production-style home) */}
      <section className="relative overflow-hidden px-4 pb-16 pt-10 md:pb-20 md:pt-14">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex items-center justify-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <Activity className="h-4 w-4" aria-hidden />
            Real-time stats
          </p>
          <h1 className="font-display text-6xl font-bold leading-[0.9] tracking-tight text-foreground md:text-8xl lg:text-9xl">
            HOOP
            <span className="text-primary text-glow">CENTRAL</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            The ultimate database for modern basketball stats. Track performance of the biggest stars
            and hottest prospects.
          </p>
          <form
            onSubmit={submitHeroSearch}
            className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-5 pr-1.5 shadow-lg shadow-primary/5"
          >
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            <input
              type="search"
              className="min-w-0 flex-1 border-0 bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Search players or teams…"
              value={heroQ}
              onChange={(e) => setHeroQ(e.target.value)}
              aria-label="Search players or teams"
            />
            <button
              type="submit"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
              aria-label="Search"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </section>

      <section className="border-b border-border/40 bg-card/30 py-8 backdrop-blur-sm">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {[
            { label: 'Active Players', value: `${pCount?.count ?? allPlayers.length}+`, icon: Users },
            { label: 'Active Scouts', value: '1.2k', icon: Search },
            { label: 'Seasons Tracked', value: '75', icon: Trophy },
            { label: 'Teams', value: `${tCount?.count ?? 0}+`, icon: Users },
          ].map((s, i) => (
            <div key={i} className="group flex items-center justify-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-3xl font-bold">{s.value}</div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="mb-2 text-4xl text-foreground md:text-5xl">
                Most <span className="text-primary text-glow">Viewed</span>
              </h2>
              <p className="text-muted-foreground">Trending athletes this week</p>
            </div>
            <Link to="/players" className="hidden md:inline-flex">
              <Button variant="ghost" className="gap-2">
                Explore Trends
                <span aria-hidden>→</span>
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-6 md:hidden">
            {trending.slice(0, 6).map((p) => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </div>
          <div className="hidden gap-6 md:grid md:grid-cols-5 md:gap-8">
            {trending.slice(0, 5).map((p) => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border bg-muted py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="mb-2 text-4xl md:text-5xl">
                Featured <span className="text-primary">Athletes</span>
              </h2>
              <p className="text-muted-foreground">Top performers from the current season</p>
            </div>
            <div className="hidden flex-wrap items-center gap-2 md:flex">
              {admin ? <FeaturedEditor featured={featured} allPlayers={allPlayers} /> : null}
              <Link to="/players">
                <Button variant="outline" className="gap-2">
                  View All Players
                  <span aria-hidden>→</span>
                </Button>
              </Link>
            </div>
          </div>
          {admin ? (
            <div className="mb-6 md:hidden">
              <FeaturedEditor featured={featured} allPlayers={allPlayers} />
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {(featured.length ? featured : trending.slice(0, 5)).map((p) => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </div>
          <div className="mt-12 text-center md:hidden">
            <Link to="/players">
              <Button variant="outline" className="w-full">
                View Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FavoritesStrip players={featured} />

      <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6">
        {!admin && !adminOpen && (
          <Button
            variant="outline"
            className="h-10 w-10 rounded-full p-0 opacity-40 hover:opacity-100"
            onClick={() => setAdminOpen(true)}
            aria-label="Admin"
          >
            <Lock className="h-4 w-4" />
          </Button>
        )}
        {adminOpen && (
          <div className="w-72 rounded-md border border-border bg-card p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-sm uppercase tracking-wider">Admin Login</span>
              <button type="button" className="text-muted-foreground" onClick={() => setAdminOpen(false)}>
                ×
              </button>
            </div>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              className="mb-2 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
              placeholder="Password"
            />
            {err ? <p className="mb-2 text-xs text-destructive">{err}</p> : null}
            <Button className="w-full" onClick={login}>
              Login
            </Button>
          </div>
        )}
        {admin && (
          <Button variant="outline" className="gap-1 text-xs" onClick={logout}>
            <LogOut className="h-3 w-3" />
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}

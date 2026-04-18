import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  Home,
  LayoutGrid,
  Users,
  GraduationCap,
  Search,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Leagues', to: '/leagues', icon: Trophy },
  { label: 'Prospects', to: '/prospects', icon: Users },
  { label: 'Birth Year', to: '/classes', icon: GraduationCap },
  { label: 'Directory', to: '/players', icon: LayoutGrid },
];

export function Layout() {
  const admin = !!localStorage.getItem('admin_token');

  return (
    <div className="min-h-screen bg-background pb-16 font-body text-foreground md:pb-0">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="group flex cursor-pointer items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary transition-transform duration-300 group-hover:rotate-12">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-widest text-foreground transition-colors group-hover:text-primary">
              HOOP<span className="text-primary">CENTRAL</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'border-b-2 border-transparent py-1 text-sm font-medium uppercase tracking-wide transition-colors',
                    isActive
                      ? 'border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {admin ? (
              <span className="rounded border border-primary/30 bg-card px-2 py-0.5 text-xs text-primary">
                Admin
              </span>
            ) : null}
            <Link
              to="/players"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
        <div className="flex h-14 items-center justify-around">
          {nav.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium tracking-wide',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

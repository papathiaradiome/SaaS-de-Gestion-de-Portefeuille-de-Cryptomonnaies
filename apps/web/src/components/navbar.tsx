'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/watchlist', label: 'Watchlist' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-base-800/60 bg-base-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          🪙 Crypto<span className="text-accent-400">Folio</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-slate-300">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition hover:text-white ${
                pathname?.startsWith(l.href) ? 'text-white' : ''
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-slate-400 sm:inline">
                {user.displayName ?? user.email}
              </span>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="rounded-lg border border-base-700 px-4 py-2 font-medium transition hover:border-red-500/60 hover:text-red-300"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-accent-500 px-4 py-2 font-medium text-base-950 transition hover:bg-accent-400"
            >
              Connexion
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

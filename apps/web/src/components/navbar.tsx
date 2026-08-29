import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/watchlist', label: 'Watchlist' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-base-800/60 bg-base-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          🪙 Crypto<span className="text-accent-400">Folio</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-slate-300">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-lg bg-accent-500 px-4 py-2 font-medium text-base-950 transition hover:bg-accent-400"
          >
            Connexion
          </Link>
        </div>
      </nav>
    </header>
  );
}

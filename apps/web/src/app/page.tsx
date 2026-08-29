export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="border-b border-base-800/60">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">
            🪙 Crypto<span className="text-accent-400">Folio</span>
          </span>
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <span className="hidden sm:inline">Dashboard</span>
            <span className="hidden sm:inline">Transactions</span>
            <span className="hidden sm:inline">Watchlist</span>
            <span className="rounded-lg bg-accent-500 px-4 py-2 font-medium text-base-950 transition hover:bg-accent-400">
              Connexion
            </span>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-6 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-sm text-accent-400">
          🚀 En cours de construction — Phase 0 terminée
        </span>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Gérez votre portefeuille crypto{' '}
          <span className="bg-gradient-to-r from-accent-400 to-emerald-300 bg-clip-text text-transparent">
            en temps réel
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Suivi des transactions, valorisation live via CoinGecko, calcul automatique des gains et
          pertes, et graphiques de performance — le tout dans un tableau de bord élégant.
        </p>
        <div className="mt-10 flex gap-4">
          <span className="rounded-xl bg-accent-500 px-6 py-3 font-semibold text-base-950">
            Créer un compte
          </span>
          <span className="rounded-xl border border-base-700 px-6 py-3 font-semibold text-slate-200">
            Voir la démo
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-base-800/60 py-6 text-center text-sm text-slate-500">
        CryptoFolio — Next.js · NestJS · Drizzle ORM · TailwindCSS
      </footer>
    </main>
  );
}

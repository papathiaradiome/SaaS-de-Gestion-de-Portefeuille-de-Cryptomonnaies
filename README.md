# 🪙 CryptoFolio — SaaS de Gestion de Portefeuille de Cryptomonnaies

> Plateforme SaaS fullstack pour suivre son portefeuille crypto : transactions, valorisation live via CoinGecko, PnL réalisé/latent et graphiques de performance.

![Status](https://img.shields.io/badge/status-v1%20termin%C3%A9-brightgreen)
![CI](https://img.shields.io/badge/tests-23%20passing-brightgreen)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20NestJS%20%7C%20Drizzle-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Fonctionnalités

| Domaine | Détails |
|---|---|
| 🔐 Authentification | Inscription, connexion, **JWT access + refresh tokens** avec rotation (hashés en base, usage unique), déconnexion |
| 💸 Transactions | Achats / ventes / transferts, validation DTO, pagination + filtres, édition & suppression avec vérification d'ownership |
| 💼 Portefeuille | Positions agrégées (méthode du **coût moyen pondéré**), PnL réalisé & latent, pondérations par actif |
| 📈 Données de marché | API **CoinGecko** + cache mémoire 60 s + **repli hors-ligne** (dégradation gracieuse de la valorisation) |
| 📊 Dashboard | Cartes KPI, camembert de répartition, courbe de performance (Recharts) |
| ⭐ Watchlist | Suivi de cryptos favorites avec prix en direct |
| 🛡️ Sécurité | bcrypt, Helmet, CORS configurable, **rate limiting** (5 req/min sur l'auth), routes protégées par défaut (`@Public()` pour exempter) |
| 📚 Qualité | **23 tests** (12 unitaires + 11 e2e Supertest), ESLint, CI GitHub Actions, Swagger |
| 🐳 Livraison | Dockerfiles multi-stage (dont Next.js standalone), docker-compose, migrations SQL versionnées |

## 🛠️ Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS, Recharts, react-hook-form + zod |
| Backend | NestJS 11, TypeScript, Drizzle ORM, better-sqlite3 |
| Base de données | SQLite (WAL) — migrations drizzle-kit versionnées dans `apps/api/drizzle` |
| Auth | JWT (@nestjs/jwt), bcryptjs, refresh tokens opaques hashés SHA-256 |
| Données de marché | API CoinGecko (cache 60 s, fallback offline) |
| Tests | Jest, ts-jest, Supertest (e2e) |
| Outils | ESLint, Prettier, Docker, GitHub Actions |

## 🏗️ Architecture (monorepo npm workspaces)

```
├── apps/
│   ├── web/                    # Frontend Next.js (port 3000)
│   │   └── src/
│   │       ├── app/            # Pages (App Router) : /, /login, /register,
│   │       │                   #   /dashboard, /transactions, /watchlist
│   │       ├── components/     # Navbar, charts, modal, skeletons…
│   │       ├── context/        # AuthContext + garde de routes protégées
│   │       └── lib/            # Wrapper apiFetch (refresh auto), formats
│   └── api/                    # API NestJS (port 3001)
│       ├── drizzle/            # Migrations SQL versionnées
│       ├── scripts/            # Seed CoinGecko + fallback
│       ├── test/               # Suite e2e Supertest
│       └── src/
│           ├── auth/           # JWT, guards, DTOs, rotation refresh
│           ├── users/          # Profil (/users/me)
│           ├── transactions/   # CRUD paginé + filtres
│           ├── portfolio/      # Positions, PnL, historique
│           ├── coins/          # Service CoinGecko + cache
│           ├── watchlist/      # Favoris + prix en direct
│           └── database/       # Module DB + schéma Drizzle
├── docs/ROADMAP.md             # 40 tâches suivies (1 tâche = 1 commit)
├── docker-compose.yml
└── package.json                # Workspaces + scripts racine
```

Le frontend appelle l'API **en même origine** : Next.js proxifie `/api/*` vers NestJS (rewrite) — zéro problème de CORS en local comme en production.

## 🚀 Démarrage rapide

```bash
# 1. Dépendances
npm install

# 2. Variables d'environnement
cp apps/api/.env.example apps/api/.env

# 3. Base de données : migrations + seed (52 actifs, repli offline inclus)
npm run db:migrate -w @cryptofolio/api
npm run db:seed -w @cryptofolio/api

# 4. Lancer (API sur :3001, web sur :3000)
npm run dev
```

- Application : http://localhost:3000
- Documentation API (Swagger) : http://localhost:3001/api/docs
- Health check : http://localhost:3001/api/health

### Compte de démonstration

```
email    : demo@cryptofolio.dev
password : demopass123
```

## 🐳 Docker

```bash
docker compose up --build
```

L'API applique ses migrations et son seed au démarrage ; les données SQLite persistent dans le volume `api_data`.

## 🧪 Tests & qualité

```bash
npm run test -w @cryptofolio/api        # 12 tests unitaires (auth, PnL, positions)
npm run test:e2e -w @cryptofolio/api    # 11 tests e2e (auth, transactions, portfolio)
npm run lint -w @cryptofolio/api        # ESLint
npm run build                           # Build API + Web
```

> Couverture métier : coût moyen pondéré, PnL réalisé sur vente partielle, clôture de
> position, rotation des refresh tokens (réutilisation impossible), ownership 404.

## 🔒 Sécurité — choix assumés

- Refresh tokens **opaques** (256 bits aléatoires) stockés **hashés SHA-256**, rotation à chaque usage.
- Mots de passe bcrypt (10 rounds) — jamais renvoyés par l'API.
- Rate limiting : 5 req/min/IP sur login & register, 100 req/min ailleurs.
- Helmet (CSP, HSTS, nosniff…) sur toutes les réponses.
- Messages d'erreur génériques sur l'auth (pas de divulgation de l'existence d'un compte).
- ⚠️ Limite connue (v1) : les tokens sont stockés côté client (localStorage) —
  httpOnly cookies = prochaine étape durcie. Contributions bienvenues !

## 📈 Limites connues & évolutions prévues

- Historique de performance **approximé aux prix courants** (l'API CoinGecko gratuite ne
  fournit pas l'historique par actif en masse) — brancher une source historique ou stocker
  les snapshots de prix.
- PostgreSQL : le schéma Drizzle est écrit pour SQLite ; la migration vers `pg-core` est
  simple et documentée dans les issues.
- Roadmap complète : alertes de prix, multi-devises, PWA.

## 🗺️ Roadmap

Le projet a été construit **tâche par tâche (40 tâches = 40+ commits atomiques)** —
voir [docs/ROADMAP.md](docs/ROADMAP.md) et l'historique git.

## 🤝 Contribuer

1. Forkez le projet
2. Créez votre branche (`git checkout -b feat/ma-fonctionnalite`)
3. Committez en Conventional Commits (`feat: …`, `fix: …`)
4. Ouvrez une Pull Request

## 📄 Licence

Distribué sous licence MIT — voir [LICENSE](LICENSE).

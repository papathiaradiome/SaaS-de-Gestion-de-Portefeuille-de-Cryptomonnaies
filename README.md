# 🪙 CryptoFolio — SaaS de Gestion de Portefeuille de Cryptomonnaies

> Plateforme SaaS fullstack permettant de suivre son portefeuille crypto en temps réel : transactions, valorisation live via CoinGecko, PnL (gains/pertes réalisés et latents) et graphiques de performance.

![Status](https://img.shields.io/badge/status-en%20d%C3%A9veloppement-orange)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20NestJS%20%7C%20Prisma-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Fonctionnalités

- 🔐 **Authentification JWT** — inscription, connexion, refresh tokens
- 💸 **Suivi des transactions** — achats, ventes et transferts, avec historique paginé
- 📈 **Prix en temps réel** — intégration de l'API [CoinGecko](https://www.coingecko.com/) avec cache
- 💼 **Calcul automatique des positions** — quantité détenue, prix moyen, PnL réalisé et non réalisé
- 📊 **Dashboard analytique** — valeur totale, évolution 24h, répartition par actif (pie chart), courbe de performance (line chart)
- ⭐ **Watchlist** — suivi de cryptos favorites
- 🐳 **Docker Ready** — docker-compose fourni pour PostgreSQL + API + Web

## 🛠️ Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS, Recharts |
| Backend | NestJS, TypeScript, Prisma ORM |
| Base de données | PostgreSQL (SQLite en développement local) |
| Auth | JWT (access + refresh tokens), bcrypt |
| Données de marché | API CoinGecko |
| Qualité | Jest (unit + e2e), ESLint, Prettier, GitHub Actions |

## 🏗️ Architecture (monorepo npm workspaces)

```
├── apps/
│   ├── web/        # Frontend Next.js (port 3000)
│   └── api/        # API NestJS (port 3001)
├── docs/
│   └── ROADMAP.md  # Suivi détaillé des tâches
├── docker-compose.yml
└── package.json    # Workspaces + scripts racine
```

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp apps/api/.env.example apps/api/.env

# 3. Appliquer les migrations Prisma + seed
npm run db:setup

# 4. Lancer l'API et le frontend en parallèle
npm run dev
```

- Frontend : http://localhost:3000
- API : http://localhost:3001/api

## 🗺️ Roadmap

Le développement est suivi tâche par tâche dans [docs/ROADMAP.md](docs/ROADMAP.md) — chaque tâche correspond à un commit atomique.

## 📄 Licence

Distribué sous licence MIT. Voir [LICENSE](LICENSE).

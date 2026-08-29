# 🗺️ Roadmap — CryptoFolio SaaS

> Règle d'or du projet : **une tâche = un commit = un push**. Chaque case cochée correspond à un commit atomique dans l'historique git.

## Phase 0 — Setup & Scaffolding

- [x] T1. README v1, LICENSE MIT, .gitignore, ROADMAP
- [x] T2. Monorepo racine : npm workspaces, tsconfig base, Prettier, .editorconfig
- [x] T3. Scaffold app `web` : Next.js 14 (App Router) + TypeScript + TailwindCSS
- [x] T4. Scaffold app `api` : NestJS + endpoint `GET /api/health`
- [x] T5. Scripts racine (dev / build) avec exécution parallèle

## Phase 1 — Base de données (Drizzle ORM)

- [x] T6. Couche base de données : Drizzle ORM + better-sqlite3 + module NestJS global
- [x] T7. Table `users` + première migration drizzle-kit
- [x] T8. Tables `assets` et `transactions` + migration
- [x] T9. Table `watchlist_items` + clés étrangères + migration
- [x] T10. Seed : top 50 cryptomonnaies depuis CoinGecko

## Phase 2 — Authentification (NestJS)

- [x] T11. Module `Auth` : structure + DTOs avec class-validator
- [x] T12. `POST /auth/register` : hash bcrypt + tests unitaires
- [x] T13. `POST /auth/login` : JWT access token + tests
- [x] T14. Refresh tokens : émission, stockage hashé, rotation
- [ ] T15. `JwtAuthGuard` + strategy Passport + protection globale
- [ ] T16. `GET /auth/me` + module `Users`
- [ ] T17. Rate limiting sur les endpoints d'authentification
- [ ] T18. Headers de sécurité (Helmet) + CORS configuré

## Phase 3 — Transactions & Portefeuille

- [ ] T19. Module `Transactions` : `POST` création avec validation DTO
- [ ] T20. `GET /transactions` : pagination + filtres par type/actif
- [ ] T21. `PATCH` / `DELETE /transactions/:id` avec vérification d'ownership
- [ ] T22. Module `Portfolio` : calcul des positions agrégées
- [ ] T23. Service PnL : gains réalisés / non réalisés + **tests unitaires**
- [ ] T24. `GET /portfolio/summary` : valorisation totale, PnL, exposition
- [ ] T25. Module `Coins` : service CoinGecko + cache mémoire + fallback
- [ ] T26. `GET /coins/markets` : prix en direct + variations 24h

## Phase 4 — Frontend (Next.js)

- [ ] T27. Layout racine : navbar, footer, dark mode, polices
- [ ] T28. Pages `/login` et `/register` : formulaires validés (react-hook-form + zod)
- [ ] T29. Contexte auth côté client + routes protégées (middleware)
- [ ] T30. Dashboard : cartes KPI (valeur totale, PnL, variation 24h)
- [ ] T31. Dashboard : pie chart de répartition par actif (Recharts)
- [ ] T32. Dashboard : line chart de performance du portefeuille
- [ ] T33. Page `/transactions` : tableau paginé + modal d'ajout/édition
- [ ] T34. Page `/watchlist` : ajout/retrait + prix en direct
- [ ] T35. États de chargement, error boundaries + toasts

## Phase 5 — Qualité & Livraison

- [ ] T36. Tests e2e API (Jest + Supertest) : auth + transactions
- [ ] T37. CI GitHub Actions : lint + tests + build sur chaque push
- [ ] T38. Dockerfile (multi-stage) + docker-compose (api + postgres + web)
- [ ] T39. Documentation API : Swagger auto-généré
- [ ] T40. README final : captures d'écran, architecture, guide de déploiement

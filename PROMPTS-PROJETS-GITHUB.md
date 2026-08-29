# 🚀 6 Projets GitHub pour impressionner les recruteurs — Prompts prêts à l'emploi

> **Mode d'emploi** : copiez-collez le prompt du projet choisi dans votre agent IA (Cursor, Claude Code, Windsurf, ChatGPT…).
> La **Règle d'Or** (commit + push après chaque tâche) est déjà intégrée dans chaque prompt.
> Conseil : espacez le développement sur plusieurs jours/semaines pour un historique de contributions crédible et naturel.

---

## 📊 Vue d'ensemble

| # | Projet | Stack | Difficulté | Durée | Compétences montrées |
|---|--------|-------|-----------|-------|---------------------|
| 1 | SaaS Portfolio Crypto | Next.js + NestJS + PostgreSQL | ⭐⭐⭐ | 2-3 semaines | Fullstack, APIs externes, temps réel, sécurité |
| 2 | API SaaS TaskFlow | NestJS + Prisma + JWT + Docker | ⭐⭐⭐ | 2 semaines | Backend solide, tests, CI/CD, architecture |
| 3 | E-commerce ShopFront | Next.js + Stripe + Prisma | ⭐⭐⭐ | 2-3 semaines | Paiements, e-commerce, SEO, fullstack |
| 4 | Chat temps réel RealChat | Next.js + Socket.io | ⭐⭐ | 1-2 semaines | WebSockets, temps réel, optimisme UI |
| 5 | App mobile HabitudeMoi | React Native + Expo | ⭐⭐ | 1-2 semaines | Mobile, SQLite, notifications |
| 6 | CLI git-standup | TypeScript + Node.js | ⭐⭐ | 1 semaine | CLI, parsing, npm, tests |

---

## ✅ Ce que regardent VRAIMENT les recruteurs (checklist par repo)

- [ ] **README soigné** : logo/titre, description, captures d'écran, badges CI, instructions d'installation, stack
- [ ] **Commits conventionnels réguliers** (`feat:`, `fix:`, `docs:`, `test:`, `chore:`) → historique lisible
- [ ] **Tests** (même seulement les critiques) + **badge CI GitHub Actions vert**
- [ ] **Démo live** quand c'est possible (Vercel, Railway, Render — gratuits)
- [ ] **Pas de secrets commités** (`.env` dans `.gitignore`, variables d'environnement documentées dans le README)
- [ ] Une **LICENSE** (MIT) et un `.gitignore` propre dès le premier commit

---

# 🔑 LA RÈGLE D'OR (intégrée dans chaque prompt ci-dessous)

```text
RÈGLE D'OR ABSOLUE ET ESSENTIELLE :
Nous travaillons étape par étape, de manière très granulaire (UNE SEULE petite tâche à la fois).
Après CHAQUE tâche validée et fonctionnelle, tu dois OBLIGATOIREMENT :
1. Vérifier que le code compile et que rien n'est cassé
2. Exécuter `git add .`
3. Créer un commit avec un message en Conventional Commits
   (préfixes : feat:, fix:, docs:, test:, chore:, refactor:, perf:)
4. Exécuter `git push origin main`
Ne passe JAMAIS à la tâche suivante sans avoir push la précédente.
Tu répètes ce cycle (tâche → commit → push) jusqu'à la fin TOTALE du projet.
C'est la règle la plus importante de notre collaboration : un push par tâche, sans exception, jusqu'à terminaison.
```

---
---

# 🪙 PROJET 1 — SaaS de Gestion de Portefeuille de Cryptomonnaies

**Repo à créer** : `SaaS-Crypto-Portfolio` · **Stack** : Next.js 14, TypeScript, TailwindCSS, NestJS, PostgreSQL, Prisma, Recharts, CoinGecko API

```text
Agis en tant que développeur fullstack senior. Nous allons créer ensemble, étape par étape, une application SaaS complète de gestion de portefeuille de cryptomonnaies.

OBJECTIF :
Une app web où l'utilisateur crée un compte, ajoute ses transactions crypto (achat/vente/transfert), suit la valeur de son portefeuille en temps réel via l'API CoinGecko, et visualise ses performances avec des graphiques.

STACK IMPOSÉE :
- Frontend : Next.js 14 (App Router) + TypeScript + TailwindCSS + Recharts
- Backend : NestJS + Prisma + PostgreSQL
- Auth : JWT (access + refresh tokens)
- Prix : API CoinGecko (gratuite)

FONCTIONNALITÉS À DÉVELOPPER (roadmap) :
1. Initialisation du monorepo (front + back), .gitignore, README, LICENSE
2. Modèle de données Prisma : User, Transaction, Asset, Watchlist
3. Auth complète : register, login, refresh, middleware de protection
4. CRUD des transactions (achat, vente, transfert) avec validation
5. Calcul automatique des positions et du PnL (gain/perte réalisé et non réalisé)
6. Intégration CoinGecko : prix en direct, polling toutes les 60s
7. Dashboard : valeur totale, évolution 24h, répartition par asset (pie chart)
8. Graphique de performance historique du portefeuille (line chart)
9. Watchlist : suivi de cryptos favorites avec alertes de prix
10. Page profil + gestion du compte
11. Tests (Jest/Vitest) sur les calculs de PnL et l'auth
12. Docker Compose + CI GitHub Actions
13. Déploiement (Vercel pour le front, Railway pour le back)
14. README final : captures d'écran, architecture, guide d'installation

RÈGLE D'OR ABSOLUE ET ESSENTIELLE :
Nous travaillons étape par étape, de manière très granulaire (UNE SEULE petite tâche à la fois).
Après CHAQUE tâche validée et fonctionnelle, tu dois OBLIGATOIREMENT :
1. Vérifier que le code compile et que rien n'est cassé
2. Exécuter `git add .`
3. Créer un commit avec un message en Conventional Commits
   (préfixes : feat:, fix:, docs:, test:, chore:, refactor:, perf:)
4. Exécuter `git push origin main`
Ne passe JAMAIS à la tâche suivante sans avoir push la précédente.
Tu répètes ce cycle (tâche → commit → push) jusqu'à la fin TOTALE du projet.
C'est la règle la plus importante de notre collaboration : un push par tâche, sans exception, jusqu'à terminaison.

DÉMARRAGE :
Avant la première tâche, présente-moi la liste numérotée complète des tâches du projet
(découpées finement, environ 40-60 tâches) pour validation. Puis commence par la tâche 1 :
l'initialisation du projet, du .gitignore, du README et de la LICENSE, suivie du premier commit et push.
```

---
---

# 📋 PROJET 2 — API SaaS de Gestion de Tâches « TaskFlow » (Backend)

**Repo à créer** : `taskflow-api` · **Stack** : NestJS, Prisma, PostgreSQL, JWT, RBAC, Docker, GitHub Actions
**Pourquoi ça impressionne** : un backend avec tests, RBAC et CI montre que vous savez produire du code **de qualité production**, pas juste des maquettes.

```text
Agis en tant que développeur backend senior (Node.js/NestJS). Nous allons créer ensemble, étape par étape, une API SaaS complète de gestion de tâches et de projets, de qualité production.

OBJECTIF :
Une API REST documentée, sécurisée et testée pour un outil type Trello/Asana simplifié : workspaces, projets, tâches, assignation, commentaires et journal d'activité.

STACK IMPOSÉE :
- NestJS + TypeScript + Prisma + PostgreSQL
- Auth : JWT avec refresh tokens + RBAC (rôles ADMIN / MEMBER / VIEWER par workspace)
- Documentation : Swagger auto-générée
- Tests : Jest (unitaires + e2e sur les endpoints critiques)
- Infra : Docker Compose, CI GitHub Actions (lint + test à chaque push)

FONCTIONNALITÉS À DÉVELOPPER (roadmap) :
1. Init projet NestJS + ESLint + Prettier + .gitignore + README + structure modulaire
2. Schéma Prisma : User, Workspace, Membership, Project, Task, Comment, ActivityLog
3. Module auth : register, login, refresh token, hash bcrypt, guards
4. RBAC : décorateurs de rôles + guards par workspace
5. CRUD workspaces + invitation de membres par email
6. CRUD projets (uniquement pour membres du workspace)
7. CRUD tâches : statuts (todo/in_progress/done), priorités, labels, dates limite, assignation
8. Pagination, filtrage et tri sur la liste des tâches
9. Commentaires sur les tâches
10. ActivityLog : chaque action importante est journalisée
11. Rate limiting + validation globale des DTOs (class-validator)
12. Seed de données de démonstration
13. Tests unitaires (services) + e2e (auth, tâches)
14. Docker Compose (app + PostgreSQL) + CI GitHub Actions
15. README final avec exemples de requêtes curl/Postman

RÈGLE D'OR ABSOLUE ET ESSENTIELLE :
Nous travaillons étape par étape, de manière très granulaire (UNE SEULE petite tâche à la fois).
Après CHAQUE tâche validée et fonctionnelle, tu dois OBLIGATOIREMENT :
1. Vérifier que le code compile et que les tests passent
2. Exécuter `git add .`
3. Créer un commit avec un message en Conventional Commits
   (préfixes : feat:, fix:, docs:, test:, chore:, refactor:, perf:)
4. Exécuter `git push origin main`
Ne passe JAMAIS à la tâche suivante sans avoir push la précédente.
Tu répètes ce cycle (tâche → commit → push) jusqu'à la fin TOTALE du projet.
C'est la règle la plus importante de notre collaboration : un push par tâche, sans exception, jusqu'à terminaison.

DÉMARRAGE :
Avant la première tâche, présente-moi la liste numérotée complète des tâches (30-50 tâches fines)
pour validation. Puis commence par la tâche 1 : initialisation du projet NestJS, suivie du premier commit et push.
```

---
---

# 🛒 PROJET 3 — Boutique E-commerce « ShopFront » (Fullstack)

**Repo à créer** : `shopfront-ecommerce` · **Stack** : Next.js 14, Tailwind, Prisma, Stripe (mode test), NextAuth
**Pourquoi ça impressionne** : l'e-commerce touche à tout — paiement, webhooks, SEO, gestion d'état, admin.

```text
Agis en tant que développeur fullstack senior e-commerce. Nous allons créer ensemble, étape par étape, une boutique en ligne complète et moderne.

OBJECTIF :
Une boutique avec catalogue, recherche, panier, tunnel de paiement Stripe (mode test), gestion des commandes et un dashboard administrateur.

STACK IMPOSÉE :
- Next.js 14 (App Router) + TypeScript + TailwindCSS
- Base de données : PostgreSQL + Prisma
- Auth : NextAuth (client + administrateur)
- Paiement : Stripe en mode test (checkout + webhooks)
- Déploiement : Vercel

FONCTIONNALITÉS À DÉVELOPPER (roadmap) :
1. Init Next.js + Tailwind + .gitignore + README + structure des dossiers
2. Schéma Prisma : Product, Category, User, Order, OrderItem
3. Seed : 20 produits avec images (Unsplash) et catégories
4. Page d'accueil : hero, produits vedettes, grilles par catégorie
5. Page catalogue avec filtres (catégorie, prix) et recherche
6. Fiche produit détaillée + produits similaires
7. Panier persistent (Zustand + localStorage) avec drawer latéral
8. Auth client (NextAuth) : inscription, connexion, profil
9. Checkout Stripe (mode test) : session, succès, échec
10. Webhook Stripe : confirmation de commande en base
11. Historique des commandes côté client
12. Dashboard admin protégé : CRUD produits, gestion des commandes (statuts)
13. SEO : métadonnées dynamiques, sitemap, Open Graph
14. Responsive mobile complet + dark mode
15. Tests sur le calcul du panier et le webhook + README final avec captures

RÈGLE D'OR ABSOLUE ET ESSENTIELLE :
Nous travaillons étape par étape, de manière très granulaire (UNE SEULE petite tâche à la fois).
Après CHAQUE tâche validée et fonctionnelle, tu dois OBLIGATOIREMENT :
1. Vérifier que le code compile et que rien n'est cassé
2. Exécuter `git add .`
3. Créer un commit avec un message en Conventional Commits
   (préfixes : feat:, fix:, docs:, test:, chore:, refactor:, perf:)
4. Exécuter `git push origin main`
Ne passe JAMAIS à la tâche suivante sans avoir push la précédente.
Tu répètes ce cycle (tâche → commit → push) jusqu'à la fin TOTALE du projet.
C'est la règle la plus importante de notre collaboration : un push par tâche, sans exception, jusqu'à terminaison.

DÉMARRAGE :
Avant la première tâche, présente-moi la liste numérotée complète des tâches (40-60 tâches fines)
pour validation. Puis commence par la tâche 1 : initialisation du projet, suivie du premier commit et push.
```

---
---

# 💬 PROJET 4 — Messagerie Temps Réel « RealChat »

**Repo à créer** : `realchat` · **Stack** : Next.js, Socket.io, PostgreSQL, Prisma, Tailwind
**Pourquoi ça impressionne** : les WebSockets et le temps réel sont une compétence très recherchée et rarement montrée dans les portfolios juniors.

```text
Agis en tant que développeur fullstack senior spécialisé temps réel. Nous allons créer ensemble, étape par étape, une application de messagerie temps réel type Slack simplifié.

OBJECTIF :
Une app de chat avec salons publics/privés, présence en ligne, indicateurs « en train d'écrire », messages persistés et notifications de messages non lus.

STACK IMPOSÉE :
- Frontend : Next.js + TypeScript + TailwindCSS
- Backend : Node.js + Express + Socket.io
- Base de données : PostgreSQL + Prisma (messages, salons, membres)
- Auth : JWT

FONCTIONNALITÉS À DÉVELOPPER (roadmap) :
1. Init monorepo (client + serveur) + .gitignore + README
2. Serveur Express + Socket.io : connexion, rooms, heartbeat
3. Schéma Prisma : User, Room, Message, RoomMember
4. Auth JWT (register/login) côté serveur et client
5. Liste des salons + création de salon
6. Envoi/réception de messages en temps réel (avec persistance en base)
7. Historique des messages au chargement d'un salon (pagination)
8. Présence en ligne/hors ligne des utilisateurs
9. Indicateur « X est en train d'écrire… »
10. Compteur de messages non lus par salon
11. Avatars (upload ouDiceBear auto) + formatage des dates relatives
12. Salons privés : accès sur invitation uniquement
13. Responsive mobile + notifications navigateur (Notification API)
14. Tests (serveur : rooms/auth) + Docker Compose + README final avec captures/GIF

RÈGLE D'OR ABSOLUE ET ESSENTIELLE :
Nous travaillons étape par étape, de manière très granulaire (UNE SEULE petite tâche à la fois).
Après CHAQUE tâche validée et fonctionnelle, tu dois OBLIGATOIREMENT :
1. Vérifier que le code compile et que rien n'est cassé
2. Exécuter `git add .`
3. Créer un commit avec un message en Conventional Commits
   (préfixes : feat:, fix:, docs:, test:, chore:, refactor:, perf:)
4. Exécuter `git push origin main`
Ne passe JAMAIS à la tâche suivante sans avoir push la précédente.
Tu répètes ce cycle (tâche → commit → push) jusqu'à la fin TOTALE du projet.
C'est la règle la plus importante de notre collaboration : un push par tâche, sans exception, jusqu'à terminaison.

DÉMARRAGE :
Avant la première tâche, présente-moi la liste numérotée complète des tâches (30-50 tâches fines)
pour validation. Puis commence par la tâche 1 : initialisation du monorepo, suivie du premier commit et push.
```

---
---

# 📱 PROJET 5 — Application Mobile « HabitudeMoi » (suivi d'habitudes)

**Repo à créer** : `habitudemoi` · **Stack** : React Native + Expo, SQLite, Recharts, notifications locales
**Pourquoi ça impressionne** : avoir du mobile en plus du web élargit votre profil ; Expo rend le déploiement de démo simple (Expo Go).

```text
Agis en tant que développeur mobile senior React Native. Nous allons créer ensemble, étape par étape, une application mobile de suivi d'habitudes (type Streaks/Habitica simplifié).

OBJECTIF :
L'utilisateur crée des habitudes quotidiennes (boire de l'eau, sport, lecture…), les coche chaque jour, construit des séries (streaks) et suit ses statistiques.

STACK IMPOSÉE :
- React Native + Expo (SDK récent) + TypeScript
- Stockage local : SQLite (expo-sqlite)
- Graphiques : react-native-chart-kit ou victory-native
- Notifications : expo-notifications (rappels locaux)
- Navigation : expo-router

FONCTIONNALITÉS À DÉVELOPPER (roadmap) :
1. Init Expo + TypeScript + structure des dossiers + README
2. Navigation : onboarding (3 écrans) + écrans principaux (tabs)
3. Schéma SQLite : habits, habit_completions
4. Écran d'accueil : liste des habitudes du jour avec coche
5. CRUD des habitudes : nom, icône, couleur, fréquence
6. Logique de streak : série en cours, meilleure série, calcul des dates
7. Écran statistiques : taux de complétion, heatmap du mois, graphique hebdo
8. Notifications locales : rappel quotidien configurable
9. Mode sombre + animations (ReLU animated / moti)
10. Export des données en JSON/CSV
11. Tests de la logique streak + README final avec captures

RÈGLE D'OR ABSOLUE ET ESSENTIELLE :
Nous travaillons étape par étape, de manière très granulaire (UNE SEULE petite tâche à la fois).
Après CHAQUE tâche validée et fonctionnelle, tu dois OBLIGATOIREMENT :
1. Vérifier que le code compile (npx tsc --noEmit)
2. Exécuter `git add .`
3. Créer un commit avec un message en Conventional Commits
   (préfixes : feat:, fix:, docs:, test:, chore:, refactor:, perf:)
4. Exécuter `git push origin main`
Ne passe JAMAIS à la tâche suivante sans avoir push la précédente.
Tu répètes ce cycle (tâche → commit → push) jusqu'à la fin TOTALE du projet.
C'est la règle la plus importante de notre collaboration : un push par tâche, sans exception, jusqu'à terminaison.

DÉMARRAGE :
Avant la première tâche, présente-moi la liste numérotée complète des tâches (25-40 tâches fines)
pour validation. Puis commence par la tâche 1 : initialisation du projet Expo, suivie du premier commit et push.
```

---
---

# ⌨️ PROJET 6 — CLI « git-standup » en TypeScript

**Repo à créer** : `git-standup` · **Stack** : Node.js, TypeScript, Commander, Vitest — publiable sur npm
**Pourquoi ça impressionne** : un outil CLI utile que d'autres devs peuvent installer (`npx`) montre la maîtrise de l'écosystème Node au-delà des simples pages web. C'est un excellent différenciateur.

```text
Agis en tant que développeur TypeScript senior, expert en outillage développeur (CLI). Nous allons créer ensemble, étape par étape, un outil en ligne de commande open source.

OBJECTIF :
`git-standup` : un CLI qui analyse l'historique git d'un dépôt et génère un rapport de standup
(ce que j'ai fait hier / aujourd'hui) ou un rapport hebdomadaire en Markdown, filtrable par auteur.

STACK IMPOSÉE :
- Node.js + TypeScript
- CLI : Commander + Chalk (couleurs) + Ora (spinners)
- Parsing : child_process sur `git log` (pas de dépendance lourde)
- Tests : Vitest
- Build : tsup, exécutable via npx

FONCTIONNALITÉS À DÉVELOPPER (roadmap) :
1. Init projet TypeScript + ESLint + Prettier + README + LICENSE MIT
2. Squelette CLI avec Commander : commande `report` + options
3. Exécution et parsing de `git log` (auteur, date, message, repo multiple)
4. Filtres : `--author`, `--since`, `--until`, `--repo <path>`
5. Regroupement par jour + formatage Markdown lisible
6. Commande `week` : rapport hebdomadaire groupé par jour
7. Statistiques : nombre de commits, fichiers modifiés, insertions/délétions
8. Sortie `--json` pour intégration dans d'autres outils
9. Mode multi-dépôts (scan d'un dossier parent)
10. Fichier de config `.standuprc.json`
11. Tests unitaires complets sur le parsing + CI GitHub Actions
12. README final : GIF de démo, installation npx, exemples
13. (Bonus) Publication sur npm

RÈGLE D'OR ABSOLUE ET ESSENTIELLE :
Nous travaillons étape par étape, de manière très granulaire (UNE SEULE petite tâche à la fois).
Après CHAQUE tâche validée et fonctionnelle, tu dois OBLIGATOIREMENT :
1. Vérifier que le build et les tests passent
2. Exécuter `git add .`
3. Créer un commit avec un message en Conventional Commits
   (préfixes : feat:, fix:, docs:, test:, chore:, refactor:, perf:)
4. Exécuter `git push origin main`
Ne passe JAMAIS à la tâche suivante sans avoir push la précédente.
Tu répètes ce cycle (tâche → commit → push) jusqu'à la fin TOTALE du projet.
C'est la règle la plus importante de notre collaboration : un push par tâche, sans exception, jusqu'à terminaison.

DÉMARRAGE :
Avant la première tâche, présente-moi la liste numérotée complète des tâches (25-35 tâches fines)
pour validation. Puis commence par la tâche 1 : initialisation du projet, suivie du premier commit et push.
```

---
---

# 🎁 BONUS — Quick wins d'un week-end (pour compléter le profil)

1. **Portfolio personnel** (Next.js/Astro + Tailwind) : votre CV en ligne, déployé sur Vercel, avec vos projets ci-dessus. Le prompt suit le même modèle (règle d'or incluse).
2. **GitHub Profile README** (`papathiaradiome/papathiaradiome`) : présentation, stack, statistiques GitHub (github-readme-stats), liens vers vos projets.
3. **Bot Discord de modération** (Node.js + discord.js) : anti-spam, commandes slash, logs — petit projet fun qui montre l'usage d'APIs tierces.

---

# 💡 Conseils finaux pour maximiser l'effet « recruteur »

1. **Un repo public par projet**, avec le README comme vitrine (captures d'écran obligatoires).
2. **La règle d'or produit 30-60 commits par projet** → votre graphe de contributions devient vert naturellement, SANS artifice. Évitez les scripts de faux commits : les recruteurs ouvrent parfois les diffs, et un historique de vraies tâches atomiques est bien plus crédible.
3. **Ouvrez quelques Issues** sur vos repos (bugs trouvés, idées d'évolution) puis fermez-les via des commits (`fix: close #3`) → ça montre une vraie méthode de travail.
4. **Déployez** tout ce qui est déployable et mettez le lien démo en haut du README.
5. **Écrivez le README final à la main** (pas seulement par l'IA) avec vos mots : les recruteurs sentent la différence.

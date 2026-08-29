# ---- Build ----
FROM node:22-alpine AS build
WORKDIR /app

# Dépendances du monorepo (workspaces)
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
RUN npm ci --workspace @cryptofolio/api --include-workspace-root --no-audit --no-fund

# Code + build
COPY apps/api ./apps/api
COPY tsconfig.base.json ./
RUN cd apps/api && npx tsc --noEmit && npm run build

# ---- Runtime ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./apps/api/
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/drizzle ./apps/api/drizzle
COPY --from=build /app/apps/api/scripts ./apps/api/scripts

WORKDIR /app/apps/api
# Au démarrage : migrations + seed (idempotents) puis lancement de l'API.
CMD ["sh", "-c", "npx drizzle-kit migrate && node scripts/seed.mjs && node dist/main.js"]

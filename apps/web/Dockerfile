# ---- Build ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
RUN npm ci --workspace @cryptofolio/web --include-workspace-root --no-audit --no-fund

COPY apps/web ./apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd apps/web && npm run build

# ---- Runtime ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

# Sortie standalone Next.js : serveur minimal sans node_modules complet.
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public

WORKDIR /app/apps/web
EXPOSE 3000
CMD ["node", "server.js"]

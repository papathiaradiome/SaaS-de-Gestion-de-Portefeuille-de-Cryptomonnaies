import { defineConfig } from 'drizzle-kit';

/**
 * Configuration drizzle-kit — génération et application des migrations.
 * Dev : SQLite (fichier local) — les migrations SQL sont versionnées dans ./drizzle.
 */
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/database/schema/*.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'data/dev.db',
  },
  verbose: true,
  strict: true,
});

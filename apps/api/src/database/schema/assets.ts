import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Table `assets` — catalogue des cryptomonnaies suivies (synchronisé avec CoinGecko).
 */
export const assets = sqliteTable('assets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  coingeckoId: text('coingecko_id').notNull().unique(),
  symbol: text('symbol').notNull().unique(),
  name: text('name').notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { assets } from './assets';
import { users } from './users';

/**
 * Table `watchlist_items` — cryptos suivies par l'utilisateur.
 * Contrainte d'unicité (user, asset) : impossible de suivre deux fois la même crypto.
 */
export const watchlistItems = sqliteTable(
  'watchlist_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    assetId: integer('asset_id')
      .notNull()
      .references(() => assets.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    note: text('note'),
  },
  (table) => [uniqueIndex('watchlist_user_asset_unique').on(table.userId, table.assetId)],
);

export type WatchlistItem = typeof watchlistItems.$inferSelect;
export type NewWatchlistItem = typeof watchlistItems.$inferInsert;

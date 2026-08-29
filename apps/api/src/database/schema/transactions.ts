import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { assets } from './assets';
import { users } from './users';

export const TRANSACTION_TYPES = ['buy', 'sell', 'transfer'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

/**
 * Table `transactions` — historique des opérations de l'utilisateur.
 * Montants stockés en REAL (double précision, ~15 chiffres significatifs).
 */
export const transactions = sqliteTable(
  'transactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    assetId: integer('asset_id')
      .notNull()
      .references(() => assets.id, { onDelete: 'restrict' }),
    type: text('type', { enum: TRANSACTION_TYPES }).notNull(),
    quantity: real('quantity').notNull(),
    pricePerUnit: real('price_per_unit').notNull(),
    fees: real('fees').notNull().default(0),
    currency: text('currency').notNull().default('usd'),
    executedAt: integer('executed_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('transactions_user_idx').on(table.userId),
    index('transactions_user_asset_idx').on(table.userId, table.assetId),
  ],
);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

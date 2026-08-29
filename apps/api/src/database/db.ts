import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

/**
 * Crée une instance Drizzle branchée sur SQLite.
 * Active WAL (performance) et les clés étrangères (intégrité).
 */
export function createDb(url: string) {
  const filePath = url.replace(/^file:/, '');
  const sqlite = new Database(filePath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  return drizzle(sqlite, { schema });
}

export type Db = ReturnType<typeof createDb>;

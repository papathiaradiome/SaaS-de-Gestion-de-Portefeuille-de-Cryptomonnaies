/**
 * Seed de la table `assets`.
 * 1. Tente l'API CoinGecko (top 50 par capitalisation).
 * 2. En cas d'échec (hors-ligne, rate-limit), repli sur un snapshot local
 *    (`scripts/top-cryptos-fallback.json`) — garantit un seed fonctionnel partout.
 *
 * Usage : npm run db:seed
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Database from 'better-sqlite3';

const here = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_URL?.replace(/^file:/, '').replace(/^\.\//, '') ?? 'data/dev.db';
const db = new Database(join(here, '..', dbPath));

async function fetchFromCoinGecko() {
  const url =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
    const coins = await res.json();
    return coins.map((c) => ({
      coingeckoId: c.id,
      symbol: String(c.symbol).toLowerCase(),
      name: c.name,
      image: c.image ?? null,
    }));
  } finally {
    clearTimeout(timeout);
  }
}

function loadFallback() {
  const raw = readFileSync(join(here, 'top-cryptos-fallback.json'), 'utf8');
  return JSON.parse(raw).map((c) => ({ ...c, image: null }));
}

let sourceName = 'CoinGecko (live)';
const source = await fetchFromCoinGecko().catch((err) => {
  console.warn(`⚠️  CoinGecko indisponible (${err.message}) — repli sur le snapshot local.`);
  sourceName = 'snapshot local';
  return loadFallback();
});

const insert = db.prepare(
  'INSERT OR IGNORE INTO assets (coingecko_id, symbol, name, image, created_at) VALUES (?, ?, ?, ?, ?)',
);
const now = Date.now();
const run = db.transaction((rows) => {
  for (const r of rows) insert.run(r.coingeckoId, r.symbol, r.name, r.image, now);
});
run(source);

const total = db.prepare('SELECT COUNT(*) AS n FROM assets').get().n;
console.log(
  `✅ Seed terminé : ${source.length} actifs traités, ${total} actifs en base (source : ${sourceName}).`,
);

import { Injectable, Logger } from '@nestjs/common';

export interface CoinMarketData {
  id: number; // asset id interne (résolu plus tard) — ici coingecko
  coingeckoId: string;
  symbol: string;
  name: string;
  image: string | null;
  currentPrice: number | null;
  marketCap: number | null;
  change24h: number | null;
}

interface CacheEntry {
  data: CoinMarketData[];
  fetchedAt: number;
}

const CACHE_TTL_MS = 60_000; // 1 minute
const API_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1';

/**
 * Service CoinGecko avec cache mémoire (60 s) et repli hors-ligne :
 * si l'API est injoignable, les actifs sont renvoyés sans données de marché
 * (la valorisation retombe alors sur le coût de revient).
 */
@Injectable()
export class CoingeckoService {
  private readonly logger = new Logger(CoingeckoService.name);
  private cache: CacheEntry | null = null;

  async getMarkets(): Promise<{ data: CoinMarketData[]; source: 'live' | 'cache' | 'unavailable' }> {
    if (this.cache && Date.now() - this.cache.fetchedAt < CACHE_TTL_MS) {
      return { data: this.cache.data, source: 'cache' };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(API_URL, {
        signal: controller.signal,
        headers: { accept: 'application/json' },
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const coins = (await res.json()) as Array<{
        id: string;
        symbol: string;
        name: string;
        image: string;
        current_price: number;
        market_cap: number;
        price_change_percentage_24h: number | null;
      }>;

      const data: CoinMarketData[] = coins.map((c) => ({
        id: 0,
        coingeckoId: c.id,
        symbol: String(c.symbol).toLowerCase(),
        name: c.name,
        image: c.image ?? null,
        currentPrice: c.current_price ?? null,
        marketCap: c.market_cap ?? null,
        change24h: c.price_change_percentage_24h ?? null,
      }));

      this.cache = { data, fetchedAt: Date.now() };
      return { data, source: 'live' };
    } catch (err) {
      this.logger.warn(`CoinGecko indisponible : ${(err as Error).message}`);
      return { data: [], source: 'unavailable' };
    }
  }
}

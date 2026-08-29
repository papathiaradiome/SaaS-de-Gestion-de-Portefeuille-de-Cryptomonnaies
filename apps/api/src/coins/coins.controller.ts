import { Controller, Get, Query } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { assets } from '../database/schema';
import { CoingeckoService } from './coingecko.service';
import { Public } from '../auth/public.decorator';

@Controller('coins')
export class CoinsController {
  constructor(
    private readonly database: DatabaseService,
    private readonly coingecko: CoingeckoService,
  ) {}
  /**
   * Catalogue des actifs suivis, enrichi des prix en direct quand CoinGecko
   * est joignable (`source: "live" | "cache" | "unavailable"`).
   */
  @Public()
  @Get('markets')
  async markets(@Query('search') search?: string) {
    const all = this.database.db.select().from(assets).all();
    const markets = await this.coingecko.getMarkets();
    const byCoingeckoId = new Map(markets.data.map((c) => [c.coingeckoId, c]));

    const term = search?.toLowerCase().trim();
    const coins = all
      .map((a) => {
        const market = byCoingeckoId.get(a.coingeckoId);
        return {
          id: a.id,
          coingeckoId: a.coingeckoId,
          symbol: a.symbol,
          name: a.name,
          image: market?.image ?? a.image,
          currentPrice: market?.currentPrice ?? null,
          change24h: market?.change24h ?? null,
        };
      })
      .filter(
        (c) =>
          !term ||
          c.symbol.includes(term) ||
          c.name.toLowerCase().includes(term) ||
          c.coingeckoId.includes(term),
      );

    return { source: markets.source, count: coins.length, coins };
  }
}

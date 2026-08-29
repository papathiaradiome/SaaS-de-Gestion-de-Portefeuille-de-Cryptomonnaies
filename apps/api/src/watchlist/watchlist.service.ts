import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { assets, watchlistItems } from '../database/schema';
import { CoingeckoService } from '../coins/coingecko.service';

@Injectable()
export class WatchlistService {
  constructor(
    private readonly database: DatabaseService,
    private readonly coingecko: CoingeckoService,
  ) {}

  /** Liste la watchlist de l'utilisateur, enrichie des prix en direct. */
  async list(userId: number) {
    const { db } = this.database;
    const rows = db
      .select({
        id: watchlistItems.id,
        note: watchlistItems.note,
        createdAt: watchlistItems.createdAt,
        assetId: assets.id,
        symbol: assets.symbol,
        name: assets.name,
        coingeckoId: assets.coingeckoId,
      })
      .from(watchlistItems)
      .innerJoin(assets, eq(assets.id, watchlistItems.assetId))
      .where(eq(watchlistItems.userId, userId))
      .all();

    const markets = await this.coingecko.getMarkets();
    const byId = new Map(markets.data.map((c) => [c.coingeckoId, c]));

    return {
      source: markets.source,
      items: rows.map((r) => ({
        ...r,
        currentPrice: byId.get(r.coingeckoId)?.currentPrice ?? null,
        change24h: byId.get(r.coingeckoId)?.change24h ?? null,
      })),
    };
  }

  /** Ajoute un actif à la watchlist (unicité par utilisateur). */
  add(userId: number, assetId: number) {
    const { db } = this.database;
    const asset = db.select().from(assets).where(eq(assets.id, assetId)).get();
    if (!asset) throw new NotFoundException('Actif introuvable');

    const existing = db
      .select()
      .from(watchlistItems)
      .where(and(eq(watchlistItems.userId, userId), eq(watchlistItems.assetId, assetId)))
      .get();
    if (existing) throw new ConflictException('Actif déjà suivi');

    return db.insert(watchlistItems).values({ userId, assetId }).returning().get();
  }

  /** Retire un actif de la watchlist. */
  remove(userId: number, assetId: number): void {
    const { db } = this.database;
    db.delete(watchlistItems)
      .where(and(eq(watchlistItems.userId, userId), eq(watchlistItems.assetId, assetId)))
      .run();
  }
}

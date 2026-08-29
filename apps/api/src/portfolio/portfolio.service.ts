import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { assets, transactions } from '../database/schema';
import { CoingeckoService } from '../coins/coingecko.service';
import { computePortfolioSnapshot, type PortfolioSnapshot } from './position-calculator';
import { PnlService, type PnlBreakdown } from './pnl.service';

export interface PositionWithAsset {
  asset: { id: number; coingeckoId: string; symbol: string; name: string; image: string | null };
  quantity: number;
  costBasis: number;
  averageCost: number;
  realizedPnl: number;
  currentPrice?: number | null;
}

export interface PortfolioSummary {
  pnl: PnlBreakdown;
  positions: PositionWithAsset[];
  pricesAvailable: boolean;
}

@Injectable()
export class PortfolioService {
  constructor(
    private readonly database: DatabaseService,
    private readonly coingecko: CoingeckoService,
    private readonly pnl: PnlService,
  ) {}

  /** Positions agrégées de l'utilisateur, enrichies des données d'actif. */
  getPositions(userId: number): { snapshot: PortfolioSnapshot; positions: PositionWithAsset[] } {
    const { db } = this.database;

    const rows = db.select().from(transactions).where(eq(transactions.userId, userId)).all();
    const snapshot = computePortfolioSnapshot(rows);
    const allAssets = db.select().from(assets).all();
    const assetById = new Map(allAssets.map((a) => [a.id, a]));

    const positions: PositionWithAsset[] = snapshot.positions
      .filter((p) => p.quantity > 0 || p.realizedPnl !== 0)
      .map((p) => {
        const asset = assetById.get(p.assetId);
        return {
          asset: {
            id: p.assetId,
            coingeckoId: asset?.coingeckoId ?? '',
            symbol: asset?.symbol ?? '?',
            name: asset?.name ?? 'Actif inconnu',
            image: asset?.image ?? null,
          },
          quantity: p.quantity,
          costBasis: p.costBasis,
          averageCost: p.averageCost,
          realizedPnl: p.realizedPnl,
        };
      });

    return { snapshot, positions };
  }

  /** Résumé complet : positions valorisées aux prix courants + PnL + pondérations. */
  async getSummary(userId: number): Promise<PortfolioSummary> {
    const { snapshot, positions } = this.getPositions(userId);
    const markets = await this.coingecko.getMarkets();
    const priceByCoingeckoId = new Map(
      markets.data.filter((c) => c.currentPrice !== null).map((c) => [c.coingeckoId, c.currentPrice!]),
    );

    const currentPrices = new Map<number, number>();
    const enrichedPositions = positions.map((p) => {
      const price = priceByCoingeckoId.get(p.asset.coingeckoId);
      if (price !== undefined) currentPrices.set(p.asset.id, price);
      return { ...p, currentPrice: price ?? null };
    });

    const pnl = this.pnl.compute(enrichedPositions, currentPrices, snapshot.totalRealizedPnl);
    return { pnl, positions: enrichedPositions, pricesAvailable: markets.source !== 'unavailable' };
  }
}

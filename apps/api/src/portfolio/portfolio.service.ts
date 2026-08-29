import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { assets, transactions } from '../database/schema';
import { computePortfolioSnapshot, type PortfolioSnapshot } from './position-calculator';

export interface PositionWithAsset {
  asset: { id: number; coingeckoId: string; symbol: string; name: string; image: string | null };
  quantity: number;
  costBasis: number;
  averageCost: number;
  realizedPnl: number;
}

@Injectable()
export class PortfolioService {
  constructor(private readonly database: DatabaseService) {}

  /** Positions agrégées de l'utilisateur, enrichies des données d'actif. */
  getPositions(userId: number): { snapshot: PortfolioSnapshot; positions: PositionWithAsset[] } {
    const { db } = this.database;

    const rows = db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .all();

    const snapshot = computePortfolioSnapshot(rows);

    const positions: PositionWithAsset[] = snapshot.positions
      .filter((p) => p.quantity > 0 || p.realizedPnl !== 0)
      .map((p) => {
        const asset = db.select().from(assets).where(eq(assets.id, p.assetId)).get();
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
}

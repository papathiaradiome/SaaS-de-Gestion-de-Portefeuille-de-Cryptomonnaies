import { Injectable } from '@nestjs/common';
import type { PositionWithAsset } from './portfolio.service';

export interface PnlBreakdown {
  totalValue: number;
  totalCost: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  realizedPnl: number;
  totalPnl: number;
  allocation: Array<{
    assetId: number;
    symbol: string;
    value: number;
    weight: number; // part du portefeuille, entre 0 et 1
  }>;
}

/**
 * Valorise les positions à partir de prix courants et calcule les PnL.
 * Un actif sans prix courant est valorisé à son coût de revient (fallback neutre).
 */
@Injectable()
export class PnlService {
  compute(
    positions: PositionWithAsset[],
    currentPrices: Map<number, number>,
    realizedPnl: number,
  ): PnlBreakdown {
    let totalValue = 0;
    let totalCost = 0;
    const allocation: PnlBreakdown['allocation'] = [];

    for (const p of positions) {
      const price = currentPrices.get(p.asset.id);
      const value = price !== undefined && p.quantity > 0 ? price * p.quantity : p.costBasis;
      totalValue += value;
      totalCost += p.costBasis;
      allocation.push({
        assetId: p.asset.id,
        symbol: p.asset.symbol,
        value,
        weight: 0,
      });
    }

    for (const a of allocation) {
      a.weight = totalValue > 0 ? a.value / totalValue : 0;
    }

    const unrealizedPnl = totalValue - totalCost;
    return {
      totalValue,
      totalCost,
      unrealizedPnl,
      unrealizedPnlPercent: totalCost > 0 ? (unrealizedPnl / totalCost) * 100 : 0,
      realizedPnl,
      totalPnl: unrealizedPnl + realizedPnl,
      allocation: allocation.sort((x, y) => y.value - x.value),
    };
  }
}

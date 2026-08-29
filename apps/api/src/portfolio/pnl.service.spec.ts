import { PnlService } from './pnl.service';
import type { PositionWithAsset } from './portfolio.service';

function position(
  assetId: number,
  symbol: string,
  quantity: number,
  costBasis: number,
): PositionWithAsset {
  return {
    asset: { id: assetId, coingeckoId: symbol, symbol, name: symbol, image: null },
    quantity,
    costBasis,
    averageCost: quantity > 0 ? costBasis / quantity : 0,
    realizedPnl: 0,
  };
}

describe('PnlService.compute', () => {
  const service = new PnlService();

  it('calcule valeur, PnL latent et pondérations', () => {
    const positions = [position(1, 'btc', 0.5, 30_000), position(2, 'eth', 4, 12_000)];
    const prices = new Map([
      [1, 70_000], // valeur 35 000
      [2, 4_000], // valeur 16 000
    ]);

    const result = service.compute(positions, prices, /* realizedPnl */ 500);

    expect(result.totalValue).toBe(51_000);
    expect(result.totalCost).toBe(42_000);
    expect(result.unrealizedPnl).toBe(9_000);
    expect(result.unrealizedPnlPercent).toBeCloseTo(21.43, 2);
    expect(result.totalPnl).toBe(9_500);
    expect(result.allocation[0]).toMatchObject({ symbol: 'btc', weight: 35_000 / 51_000 });
    expect(result.allocation[1]).toMatchObject({ symbol: 'eth', weight: 16_000 / 51_000 });
  });

  it('retombe sur le coût de revient quand aucun prix courant n\'est disponible', () => {
    const positions = [position(1, 'btc', 0.5, 30_000)];
    const result = service.compute(positions, new Map(), 0);

    expect(result.totalValue).toBe(30_000);
    expect(result.unrealizedPnl).toBe(0);
  });

  it('gère un portefeuille vide sans division par zéro', () => {
    const result = service.compute([], new Map(), 0);
    expect(result.totalValue).toBe(0);
    expect(result.unrealizedPnlPercent).toBe(0);
    expect(result.allocation).toEqual([]);
  });
});

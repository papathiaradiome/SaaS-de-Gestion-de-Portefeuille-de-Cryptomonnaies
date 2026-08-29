import { computePortfolioSnapshot } from './position-calculator';
import type { Transaction } from '../database/schema';

function tx(partial: Partial<Transaction>): Transaction {
  return {
    id: 1,
    userId: 1,
    assetId: 1,
    type: 'buy',
    quantity: 1,
    pricePerUnit: 100,
    fees: 0,
    currency: 'usd',
    executedAt: new Date('2026-01-01'),
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partial,
  } as Transaction;
}

describe('computePortfolioSnapshot (coût moyen pondéré)', () => {
  it('agrège plusieurs achats du même actif', () => {
    const snap = computePortfolioSnapshot([
      tx({ assetId: 1, quantity: 1, pricePerUnit: 100 }),
      tx({ assetId: 1, quantity: 1, pricePerUnit: 200 }),
    ]);

    expect(snap.positions).toHaveLength(1);
    const p = snap.positions[0];
    expect(p.quantity).toBe(2);
    expect(p.costBasis).toBe(300);
    expect(p.averageCost).toBe(150);
  });

  it('calcule le PnL réalisé sur une vente partielle (frais inclus)', () => {
    const snap = computePortfolioSnapshot([
      tx({ type: 'buy', quantity: 2, pricePerUnit: 100, fees: 10 }),
      tx({ type: 'sell', quantity: 1, pricePerUnit: 160, fees: 6, executedAt: new Date('2026-02-01') }),
    ]);

    const p = snap.positions[0];
    // coût moyen = (2×100 + 10)/2 = 105 ; vente : 160 − 6 − 105 = +49
    expect(p.realizedPnl).toBe(49);
    expect(p.quantity).toBe(1);
    expect(p.costBasis).toBe(105); // 105 × 1 restant
    expect(snap.totalRealizedPnl).toBe(49);
  });

  it('clôture la position quand tout est vendu', () => {
    const snap = computePortfolioSnapshot([
      tx({ type: 'buy', quantity: 1, pricePerUnit: 50 }),
      tx({ type: 'sell', quantity: 1, pricePerUnit: 80, executedAt: new Date('2026-02-01') }),
    ]);

    const p = snap.positions[0];
    expect(p.quantity).toBe(0);
    expect(p.costBasis).toBe(0);
    expect(p.realizedPnl).toBe(30);
  });

  it('traite les ordres dans l\'ordre chronologique indépendamment de l\'entrée', () => {
    const snap = computePortfolioSnapshot([
      tx({ type: 'sell', quantity: 1, pricePerUnit: 200, executedAt: new Date('2026-03-01') }),
      tx({ type: 'buy', quantity: 1, pricePerUnit: 100, executedAt: new Date('2026-01-01') }),
    ]);

    expect(snap.positions[0].realizedPnl).toBe(100);
  });

  it('sépare les positions par actif', () => {
    const snap = computePortfolioSnapshot([
      tx({ assetId: 1, quantity: 1, pricePerUnit: 100 }),
      tx({ assetId: 2, quantity: 5, pricePerUnit: 10 }),
    ]);

    expect(snap.positions).toHaveLength(2);
  });
});

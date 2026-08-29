import type { Transaction, TransactionType } from '../database/schema';

export interface PositionSnapshot {
  assetId: number;
  quantity: number;
  /** Coût total des unités encore détenues (frais d'achat inclus). */
  costBasis: number;
  /** Prix moyen d'acquisition (= costBasis / quantity). */
  averageCost: number;
  realizedPnl: number;
}

export interface PortfolioSnapshot {
  positions: PositionSnapshot[];
  totalRealizedPnl: number;
}

/**
 * Calcule les positions d'un portefeuille à partir de l'historique des
 * transactions (méthode du coût moyen pondéré — weighted average cost).
 *
 * Règles :
 * - `buy`    : augmente la quantité et le coût (qty × prix + frais).
 * - `sell`   : diminue la quantité ; le PnL réalisé vaut
 *              (prix de vente − coût moyen) × qty − frais.
 * - `transfer`: ajuste la quantité sans impact sur le PnL
 *              (prix unitaire = base de coût apportée, typiquement 0 en entrée).
 */
export function computePortfolioSnapshot(
  transactions: Array<Pick<Transaction, 'assetId' | 'type' | 'quantity' | 'pricePerUnit' | 'fees' | 'executedAt'>>,
): PortfolioSnapshot {
  const positions = new Map<number, PositionSnapshot>();

  const sorted = [...transactions].sort(
    (a, b) => a.executedAt.getTime() - b.executedAt.getTime(),
  );

  for (const tx of sorted) {
    const position = positions.get(tx.assetId) ?? {
      assetId: tx.assetId,
      quantity: 0,
      costBasis: 0,
      averageCost: 0,
      realizedPnl: 0,
    };

    applyTransaction(position, tx.type, tx.quantity, tx.pricePerUnit, tx.fees);
    positions.set(tx.assetId, position);
  }

  const list = [...positions.values()];
  return {
    positions: list,
    totalRealizedPnl: list.reduce((sum, p) => sum + p.realizedPnl, 0),
  };
}

function applyTransaction(
  position: PositionSnapshot,
  type: TransactionType,
  quantity: number,
  pricePerUnit: number,
  fees: number,
): void {
  switch (type) {
    case 'buy': {
      position.quantity += quantity;
      position.costBasis += quantity * pricePerUnit + fees;
      break;
    }
    case 'sell': {
      const sellQty = Math.min(quantity, position.quantity); // impossible de vendre plus que détenu
      const proceeds = sellQty * pricePerUnit - fees;
      const costRemoved = position.quantity > 0 ? position.averageCost * sellQty : 0;
      position.realizedPnl += proceeds - costRemoved;
      position.quantity -= sellQty;
      position.costBasis -= costRemoved;
      if (position.quantity <= 1e-12) {
        position.quantity = 0;
        position.costBasis = 0;
      }
      break;
    }
    case 'transfer': {
      // Entrée d'actif hors achat/vente (wallet externe, fork…).
      // La quantité reçue intègre la base de coût (qty × prix unitaire + frais),
      // sans impact sur le PnL réalisé.
      position.quantity += quantity;
      position.costBasis += quantity * pricePerUnit + fees;
      break;
    }
  }

  position.averageCost = position.quantity > 0 ? position.costBasis / position.quantity : 0;
}

export interface Position {
  asset: { id: number; coingeckoId: string; symbol: string; name: string; image: string | null };
  quantity: number;
  costBasis: number;
  averageCost: number;
  realizedPnl: number;
  currentPrice: number | null;
}

export interface PortfolioSummary {
  pnl: {
    totalValue: number;
    totalCost: number;
    unrealizedPnl: number;
    unrealizedPnlPercent: number;
    realizedPnl: number;
    totalPnl: number;
    allocation: Array<{ assetId: number; symbol: string; value: number; weight: number }>;
  };
  positions: Position[];
  pricesAvailable: boolean;
}

export function formatUsd(value: number, digits = 2): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 8 }).format(value);
}

'use client';

import { formatPercent, formatUsd } from '@/lib/portfolio-types';
import type { PortfolioSummary } from '@/lib/portfolio-types';

function Delta({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span className={positive ? 'text-accent-400' : 'text-red-400'}>
      {positive ? '▲' : '▼'} {formatPercent(Math.abs(value))}
    </span>
  );
}

export function KpiCards({ summary }: { summary: PortfolioSummary }) {
  const { pnl } = summary;
  const cards = [
    {
      label: 'Valeur totale',
      value: formatUsd(pnl.totalValue),
      hint: summary.pricesAvailable ? 'Prix en direct' : 'Prix indisponibles — au coût de revient',
    },
    {
      label: 'PnL latent',
      value: formatUsd(pnl.unrealizedPnl),
      extra: <Delta value={pnl.unrealizedPnlPercent} />,
    },
    { label: 'PnL réalisé', value: formatUsd(pnl.realizedPnl) },
    { label: 'PnL total', value: formatUsd(pnl.totalPnl) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-base-800 bg-base-900/70 p-5 shadow-lg"
        >
          <p className="text-sm text-slate-400">{c.label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{c.value}</p>
          <div className="mt-1 text-sm">
            {c.extra ?? (c.hint ? <span className="text-xs text-slate-500">{c.hint}</span> : null)}
          </div>
        </div>
      ))}
    </div>
  );
}

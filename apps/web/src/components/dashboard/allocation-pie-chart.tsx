'use client';

import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { PortfolioSummary } from '@/lib/portfolio-types';
import { formatUsd } from '@/lib/portfolio-types';

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

export function AllocationPieChart({ summary }: { summary: PortfolioSummary }) {
  const data = useMemo(
    () =>
      summary.pnl.allocation
        .filter((a) => a.value > 0)
        .map((a) => ({ name: a.symbol.toUpperCase(), value: a.value })),
    [summary],
  );

  if (data.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-slate-500">
        Aucune position ouverte — ajoutez une transaction pour voir la répartition.
      </p>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatUsd(value)}
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
          />
          <Legend formatter={(value: string) => <span className="text-slate-300">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

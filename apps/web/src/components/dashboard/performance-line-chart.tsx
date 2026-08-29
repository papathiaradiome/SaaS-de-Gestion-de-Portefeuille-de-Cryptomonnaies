'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatUsd } from '@/lib/portfolio-types';

export interface HistoryPoint {
  date: string;
  value: number;
  invested: number;
}

export function PerformanceLineChart({ history }: { history: HistoryPoint[] }) {
  const data = useMemo(
    () =>
      history.map((p) => ({
        date: new Date(p.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        value: p.value,
        invested: p.invested,
      })),
    [history],
  );

  if (data.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-slate-500">
        Aucune donnée historique — enregistrez des transactions.
      </p>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(v: number) => `${Math.round(v / 1000)}k$`}
          />
          <Tooltip
            formatter={(value, name) =>
              name === 'value'
                ? [formatUsd(Number(value ?? 0)), 'Valeur']
                : [formatUsd(Number(value ?? 0)), 'Investi']
            }
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
          />
          <Area
            type="monotone"
            dataKey="invested"
            stroke="#64748b"
            strokeDasharray="5 5"
            fill="none"
            name="invested"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#valueGradient)"
            name="value"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

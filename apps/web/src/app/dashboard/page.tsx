'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/context/auth-context';
import { apiFetch } from '@/lib/api';
import type { PortfolioSummary } from '@/lib/portfolio-types';
import { CardsSkeleton, ChartSkeleton } from '@/components/skeletons';
import { KpiCards } from '@/components/dashboard/kpi-cards';
import { AllocationPieChart } from '@/components/dashboard/allocation-pie-chart';
import {
  PerformanceLineChart,
  type HistoryPoint,
} from '@/components/dashboard/performance-line-chart';

function DashboardContent() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [history, setHistory] = useState<HistoryPoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<PortfolioSummary>('/api/portfolio/summary')
      .then(setSummary)
      .catch((err: Error) => setError(err.message));
    apiFetch<HistoryPoint[]>('/api/portfolio/history')
      .then(setHistory)
      .catch(() => setHistory([]));
  }, []);

  if (error) {
    return (
      <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
        {error}
      </p>
    );
  }
  if (!summary) {
    return <CardsSkeleton />;
  }

  return (
    <div className="space-y-8">
      <KpiCards summary={summary} />
      <section className="rounded-2xl border border-base-800 bg-base-900/70 p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Répartition du portefeuille</h2>
        <AllocationPieChart summary={summary} />
      </section>
      <section className="rounded-2xl border border-base-800 bg-base-900/70 p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Performance du portefeuille</h2>
        {history ? (
          <PerformanceLineChart history={history} />
        ) : (
          <ChartSkeleton />
        )}
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <DashboardContent />
      </div>
    </RequireAuth>
  );
}

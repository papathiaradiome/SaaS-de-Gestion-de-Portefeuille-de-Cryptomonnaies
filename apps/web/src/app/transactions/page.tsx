'use client';

import { useCallback, useEffect, useState } from 'react';
import { RequireAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/api';
import { formatQuantity, formatUsd } from '@/lib/portfolio-types';
import { TransactionFormModal } from '@/components/transactions/transaction-form-modal';

interface TransactionRow {
  id: number;
  type: 'buy' | 'sell' | 'transfer';
  quantity: number;
  pricePerUnit: number;
  fees: number;
  executedAt: string;
  notes: string | null;
  asset: { id: number; symbol: string; name: string };
}

interface ListResponse {
  data: TransactionRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const TYPE_LABELS: Record<TransactionRow['type'], { label: string; className: string }> = {
  buy: { label: 'Achat', className: 'bg-accent-500/15 text-accent-400' },
  sell: { label: 'Vente', className: 'bg-red-500/15 text-red-400' },
  transfer: { label: 'Transfert', className: 'bg-sky-500/15 text-sky-400' },
};

function TransactionsContent() {
  const [list, setList] = useState<ListResponse | null>(null);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: '10' });
    if (typeFilter) params.set('type', typeFilter);
    apiFetch<ListResponse>(`/api/transactions?${params}`)
      .then(setList)
      .catch((err: Error) => setError(err.message));
  }, [page, typeFilter]);

  useEffect(load, [load]);

  const remove = async (id: number) => {
    try {
      await apiFetch(`/api/transactions/${id}`, { method: 'DELETE' });
      toast.success('Transaction supprimée');
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => {
              setPage(1);
              setTypeFilter(e.target.value);
            }}
            className="rounded-lg border border-base-700 bg-base-950 px-3 py-2 text-sm"
          >
            <option value="">Tous les types</option>
            <option value="buy">Achats</option>
            <option value="sell">Ventes</option>
            <option value="transfer">Transferts</option>
          </select>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-base-950 transition hover:bg-accent-400"
          >
            + Nouvelle
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-base-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-base-900 text-slate-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actif</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Quantité</th>
              <th className="px-4 py-3 text-right">Prix unitaire</th>
              <th className="px-4 py-3 text-right">Frais</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list?.data.map((tx) => {
              const type = TYPE_LABELS[tx.type];
              return (
                <tr key={tx.id} className="border-t border-base-800/60 hover:bg-base-900/40">
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(tx.executedAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {tx.asset.name}{' '}
                    <span className="text-slate-500">{tx.asset.symbol.toUpperCase()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${type.className}`}>
                      {type.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{formatQuantity(tx.quantity)}</td>
                  <td className="px-4 py-3 text-right">{formatUsd(tx.pricePerUnit)}</td>
                  <td className="px-4 py-3 text-right text-slate-400">
                    {tx.fees ? formatUsd(tx.fees) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatUsd(tx.quantity * tx.pricePerUnit)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(tx.id)}
                      className="text-slate-500 transition hover:text-red-400"
                      title="Supprimer"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              );
            })}
            {list && list.data.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  Aucune transaction — commencez par en ajouter une.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {list && list.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border border-base-700 px-3 py-1.5 transition hover:border-accent-500 disabled:opacity-40"
          >
            ← Précédent
          </button>
          <span className="text-slate-400">
            Page {list.page} / {list.totalPages}
          </span>
          <button
            disabled={page >= list.totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-base-700 px-3 py-1.5 transition hover:border-accent-500 disabled:opacity-40"
          >
            Suivant →
          </button>
        </div>
      )}

      <TransactionFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={load} />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <TransactionsContent />
      </div>
    </RequireAuth>
  );
}

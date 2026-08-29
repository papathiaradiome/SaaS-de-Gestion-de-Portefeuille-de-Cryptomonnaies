'use client';

import { useCallback, useEffect, useState } from 'react';
import { RequireAuth } from '@/context/auth-context';
import { apiFetch } from '@/lib/api';
import { formatUsd } from '@/lib/portfolio-types';

interface WatchItem {
  id: number;
  assetId: number;
  symbol: string;
  name: string;
  currentPrice: number | null;
  change24h: number | null;
}

interface Coin {
  id: number;
  symbol: string;
  name: string;
}

function WatchlistContent() {
  const [items, setItems] = useState<WatchItem[] | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    apiFetch<{ items: WatchItem[] }>('/api/watchlist')
      .then((res) => setItems(res.items))
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    load();
    apiFetch<{ coins: Coin[] }>('/api/coins/markets')
      .then((res) => setCoins(res.coins))
      .catch(() => setCoins([]));
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await apiFetch('/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({ assetId: Number(selected) }),
      });
      setSelected('');
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const remove = async (assetId: number) => {
    await apiFetch(`/api/watchlist/${assetId}`, { method: 'DELETE' }).catch((err: Error) =>
      setError(err.message),
    );
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Watchlist</h1>

      <form onSubmit={add} className="flex max-w-xl gap-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 rounded-lg border border-base-700 bg-base-950 px-3 py-2 text-sm"
        >
          <option value="">— Ajouter une crypto —</option>
          {coins.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.symbol.toUpperCase()})
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!selected}
          className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-base-950 transition hover:bg-accent-400 disabled:opacity-50"
        >
          Suivre
        </button>
      </form>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((item) => {
          const change = item.change24h;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-base-800 bg-base-900/70 p-5 shadow-lg"
            >
              <div>
                <p className="font-semibold">
                  {item.name}{' '}
                  <span className="text-slate-500">{item.symbol.toUpperCase()}</span>
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {item.currentPrice != null ? formatUsd(item.currentPrice) : 'Prix indisponible'}
                </p>
                {change != null && (
                  <p className={`text-xs ${change >= 0 ? 'text-accent-400' : 'text-red-400'}`}>
                    24h : {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)} %
                  </p>
                )}
              </div>
              <button
                onClick={() => remove(item.assetId)}
                className="text-slate-500 transition hover:text-red-400"
                title="Retirer de la watchlist"
              >
                ✕
              </button>
            </div>
          );
        })}
        {items && items.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-base-700 py-12 text-center text-slate-500">
            Votre watchlist est vide — suivez vos premières cryptos ci-dessus.
          </p>
        )}
      </div>
    </div>
  );
}

export default function WatchlistPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <WatchlistContent />
      </div>
    </RequireAuth>
  );
}

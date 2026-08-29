'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/api';
import { formatUsd } from '@/lib/portfolio-types';

interface Coin {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

/** Modal d'ajout de transaction : actif, type, quantité, prix unitaire, frais, note. */
export function TransactionFormModal({ open, onClose, onSaved }: Props) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    assetId: '',
    type: 'buy',
    quantity: '',
    pricePerUnit: '',
    fees: '',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      apiFetch<{ coins: Coin[] }>('/api/coins/markets')
        .then((res) => setCoins(res.coins))
        .catch((err: Error) => setError(err.message));
    }
  }, [open]);

  if (!open) return null;

  const selected = coins.find((c) => String(c.id) === form.assetId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiFetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          assetId: Number(form.assetId),
          type: form.type,
          quantity: Number(form.quantity),
          pricePerUnit: Number(form.pricePerUnit),
          ...(form.fees ? { fees: Number(form.fees) } : {}),
          ...(form.notes ? { notes: form.notes } : {}),
        }),
      });
      toast.success('Transaction enregistrée ✅');
      onSaved();
      onClose();
      setForm({ assetId: '', type: 'buy', quantity: '', pricePerUnit: '', fees: '', notes: '' });
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const input =
    'w-full rounded-lg border border-base-700 bg-base-950 px-3 py-2 outline-none transition focus:border-accent-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-base-800 bg-base-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Nouvelle transaction</h2>
          <button onClick={onClose} className="text-slate-400 transition hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-sm text-slate-300">Actif</label>
              <select
                required
                value={form.assetId}
                onChange={(e) => setForm({ ...form, assetId: e.target.value })}
                className={input}
              >
                <option value="">— Choisir —</option>
                {coins.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={input}
              >
                <option value="buy">Achat</option>
                <option value="sell">Vente</option>
                <option value="transfer">Transfert</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Quantité</label>
              <input
                required
                type="number"
                step="any"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className={input}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Prix unitaire (USD)</label>
              <input
                required
                type="number"
                step="any"
                min="0"
                value={form.pricePerUnit}
                onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
                className={input}
              />
              {selected?.currentPrice != null && (
                <p className="mt-1 text-xs text-slate-500">
                  Prix actuel : {formatUsd(selected.currentPrice)}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Frais (USD)</label>
              <input
                type="number"
                step="any"
                min="0"
                value={form.fees}
                onChange={(e) => setForm({ ...form, fees: e.target.value })}
                className={input}
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm text-slate-300">Note (optionnel)</label>
              <input
                maxLength={280}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className={input}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-accent-500 py-2.5 font-semibold text-base-950 transition hover:bg-accent-400 disabled:opacity-50"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
}

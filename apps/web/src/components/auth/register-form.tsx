'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiFetch } from '@/lib/api';
import type { AuthResponse } from '@/lib/auth-types';
import { useAuth } from '@/context/auth-context';

const registerSchema = z.object({
  displayName: z.string().max(50, '50 caractères maximum').optional(),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Au moins 8 caractères'),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '' },
  });

  const onSubmit = async (values: RegisterValues) => {
    setServerError(null);
    try {
      const res = await apiFetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(values),
        auth: false,
      });
      localStorage.setItem('cf_access', res.accessToken);
      localStorage.setItem('cf_refresh', res.refreshToken);
      await login();
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setServerError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {serverError}
        </p>
      )}
      <div>
        <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-slate-300">
          Nom d&apos;affichage <span className="text-slate-500">(optionnel)</span>
        </label>
        <input
          id="displayName"
          className="w-full rounded-lg border border-base-700 bg-base-950 px-3 py-2 outline-none transition focus:border-accent-500"
          {...register('displayName')}
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-base-700 bg-base-950 px-3 py-2 outline-none transition focus:border-accent-500"
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-300">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-base-700 bg-base-950 px-3 py-2 outline-none transition focus:border-accent-500"
          {...register('password')}
        />
        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-accent-500 py-2.5 font-semibold text-base-950 transition hover:bg-accent-400 disabled:opacity-50"
      >
        {isSubmitting ? 'Création…' : 'Créer mon compte'}
      </button>
    </form>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { apiFetch } from '@/lib/api';
import type { SafeUser } from '@/lib/auth-types';

interface AuthState {
  user: SafeUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Au montage : si un token existe, charge le profil ; sinon reste déconnecté.
  useEffect(() => {
    const token = localStorage.getItem('cf_access');
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch<SafeUser>('/api/users/me')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('cf_access');
        localStorage.removeItem('cf_refresh');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async () => {
    const me = await apiFetch<SafeUser>('/api/users/me');
    setUser(me);
  }, []);

  const logout = useCallback(() => {
    const refresh = localStorage.getItem('cf_refresh');
    localStorage.removeItem('cf_access');
    localStorage.removeItem('cf_refresh');
    setUser(null);
    if (refresh) {
      void fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}

/** Garde client : redirige vers /login si non authentifié. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-base-700 border-t-accent-400" />
      </div>
    );
  }
  if (!user) return null;
  return <>{children}</>;
}

'use client';

/**
 * Wrapper fetch vers l'API (via le proxy Next, même origine — pas de CORS).
 * - Injecte le Bearer token depuis localStorage.
 * - Tente UN refresh token automatique en cas de 401, puis rejoue la requête.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, ...init } = options;

  const doFetch = () =>
    fetch(path, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? authHeaders() : {}),
        ...init.headers,
      },
    });

  let res = await doFetch();

  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh();
    if (refreshed) res = await doFetch();
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `Erreur ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function authHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('cf_access') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function tryRefresh(): Promise<boolean> {
  const refresh = localStorage.getItem('cf_refresh');
  if (!refresh) return false;

  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refresh }),
  });
  if (!res.ok) {
    localStorage.removeItem('cf_access');
    localStorage.removeItem('cf_refresh');
    return false;
  }
  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  localStorage.setItem('cf_access', data.accessToken);
  localStorage.setItem('cf_refresh', data.refreshToken);
  return true;
}

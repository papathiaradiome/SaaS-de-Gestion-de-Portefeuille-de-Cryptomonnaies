import { createHash, randomBytes } from 'node:crypto';

/** Hash SHA-256 utilisé pour stocker les refresh tokens (jamais en clair). */
export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/** Génère un refresh token aléatoire (opaque, 256 bits). */
export function generateRefreshToken(): string {
  return randomBytes(32).toString('hex');
}

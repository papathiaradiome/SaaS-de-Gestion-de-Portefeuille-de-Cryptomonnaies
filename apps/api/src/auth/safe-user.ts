import type { User } from '../database/schema';

/** Retire les champs sensibles avant de renvoyer un utilisateur. */
export function toSafeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
  };
}

import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { AuthService } from './auth.service';

/**
 * Tests unitaires du register — base SQLite en mémoire.
 */
describe('AuthService.register', () => {
  let service: AuthService;

  beforeEach(() => {
    process.env.DATABASE_URL = 'file::memory:';
    const databaseService = new DatabaseService();
    databaseService.db.run(sql`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`);
    const jwtService = new JwtService({ secret: 'test-secret' });
    service = new AuthService(databaseService, jwtService);
  });

  it('crée un utilisateur avec un mot de passe hashé', async () => {
    const user = await service.register({
      email: 'Test@Example.com ',
      password: 'supersecret1',
      displayName: 'Test',
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com'); // normalisé (minuscules + trim)
    expect(user.passwordHash).not.toBe('supersecret1');
    expect(await bcrypt.compare('supersecret1', user.passwordHash)).toBe(true);
  });

  it('refuse un email déjà utilisé (409)', async () => {
    await service.register({ email: 'a@b.co', password: 'supersecret1' });
    await expect(
      service.register({ email: 'a@b.co', password: 'anotherpass1' }),
    ).rejects.toThrow(ConflictException);
  });
});

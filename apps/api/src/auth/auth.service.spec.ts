import { ConflictException, UnauthorizedException } from '@nestjs/common';
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
    databaseService.db.run(sql`CREATE TABLE refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
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

describe('AuthService.refresh (rotation)', () => {
  let service: AuthService;

  beforeEach(async () => {
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
    databaseService.db.run(sql`CREATE TABLE refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )`);
    const jwtService = new JwtService({ secret: 'test-secret' });
    service = new AuthService(databaseService, jwtService);
    await service.register({ email: 'rot@b.co', password: 'supersecret1' });
  });

  it('émet une nouvelle paire et révoque l\'ancien refresh token', async () => {
    const login = await service.login({ email: 'rot@b.co', password: 'supersecret1' });
    expect(login.refreshToken).toBeDefined();

    const rotated = await service.refresh(login.refreshToken);
    expect(rotated.refreshToken).not.toBe(login.refreshToken);
    expect(rotated.accessToken).toBeDefined();

    // L'ancien token ne doit plus fonctionner (rotation → usage unique).
    await expect(service.refresh(login.refreshToken)).rejects.toThrow(UnauthorizedException);
  });

  it('refuse un refresh token inconnu', async () => {
    await expect(service.refresh('deadbeef')).rejects.toThrow(UnauthorizedException);
  });
});

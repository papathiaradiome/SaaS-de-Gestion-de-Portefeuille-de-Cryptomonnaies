import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import type { INestApplication } from '@nestjs/common';
import { createTestApp, request } from './setup.e2e';

describe('CryptoFolio API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health est public', async () => {
    const res = await request(app.getHttpServer()).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/users/me sans token → 401', async () => {
    const res = await request(app.getHttpServer()).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/register crée un compte et renvoie les tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'e2e@test.dev', password: 'password123', displayName: 'E2E' });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user.email).toBe('e2e@test.dev');
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('POST /api/auth/register avec un email dupliqué → 409', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'e2e@test.dev', password: 'password123' });
    expect(res.status).toBe(409);
  });

  it('POST /api/auth/login avec de mauvais identifiants → 401', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'e2e@test.dev', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/login puis GET /api/users/me avec le token', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'e2e@test.dev', password: 'password123' });
    expect(login.status).toBe(200);

    accessToken = login.body.accessToken;
    refreshToken = login.body.refreshToken;

    const me = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe('e2e@test.dev');
  });

  it('POST /api/auth/refresh opère une rotation du refresh token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.refreshToken).not.toBe(refreshToken);

    // L'ancien token est révoqué → réutilisation impossible.
    const replay = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(replay.status).toBe(401);

    refreshToken = res.body.refreshToken;
  });

  it('POST /api/transactions crée un achat puis le liste', async () => {
    const create = await request(app.getHttpServer())
      .post('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ assetId: 1, type: 'buy', quantity: 0.5, pricePerUnit: 60000, fees: 2.5 });
    expect(create.status).toBe(201);

    const list = await request(app.getHttpServer())
      .get('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ type: 'buy' });
    expect(list.status).toBe(200);
    expect(list.body.total).toBe(1);
    expect(list.body.data[0].asset.symbol).toBe('btc');
  });

  it('POST /api/transactions avec un actif inconnu → 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ assetId: 999, type: 'buy', quantity: 1, pricePerUnit: 100 });
    expect(res.status).toBe(400);
  });

  it('PATCH /api/transactions/:id met à jour, DELETE supprime (204)', async () => {
    const patch = await request(app.getHttpServer())
      .patch('/api/transactions/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ quantity: 0.25 });
    expect(patch.status).toBe(200);
    expect(patch.body.quantity).toBe(0.25);

    const del = await request(app.getHttpServer())
      .delete('/api/transactions/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(del.status).toBe(204);
  });

  it('GET /api/portfolio/summary renvoie un résumé cohérent', async () => {
    await request(app.getHttpServer())
      .post('/api/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ assetId: 2, type: 'buy', quantity: 10, pricePerUnit: 3000 });

    const res = await request(app.getHttpServer())
      .get('/api/portfolio/summary')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.pnl.totalCost).toBe(30000);
    expect(res.body.positions).toHaveLength(1);
  });
});

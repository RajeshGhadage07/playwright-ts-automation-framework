import { test, expect } from '@playwright/test';

test.describe('Auth API', () => {
  test('valid credentials return a token', { tag: '@smoke' }, async ({ request }) => {
    const response = await request.post('/auth', {
      data: {
        username: process.env.API_USERNAME ?? 'admin',
        password: process.env.API_PASSWORD ?? 'password123',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeTruthy();
  });

  test('invalid credentials do not return a token', { tag: '@regression' }, async ({ request }) => {
    const response = await request.post('/auth', { data: { username: 'admin', password: 'wrong-password' } });
    const body = await response.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});

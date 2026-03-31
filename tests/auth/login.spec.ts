// ============================================================
import { test, expect } from '@playwright/test';
import { UsuariosClient } from '../../src/clients/UsuariosClient';
import { AuthClient } from '../../src/clients/AuthClient';
import { adminUser } from '../../fixtures/data';

test.describe('POST /login', () => {
  let userId: string;

  test.beforeAll(async ({ request }) => {
    const usuarios = new UsuariosClient(request);
    const res = await usuarios.criar(adminUser);
    const body = await res.json();
    userId = body._id;
  });

  test.afterAll(async ({ request }) => {
    const usuarios = new UsuariosClient(request);
    await usuarios.deletar(userId);
  });

  test('Deve autenticar com credenciais válidas e retornar token', async ({ request }) => {
    const auth = new AuthClient(request);
    const token = await auth.login(adminUser.email, adminUser.password);

    expect(typeof token).toBe('string');
    expect(token).toContain('Bearer');
  });

  test('Deve rejeitar login com senha inválida', async ({ request }) => {
    const res = await request.post('/login', {
      data: { email: adminUser.email, password: 'senhaerrada' },
    });
    const body = await res.json();

    expect(res.status()).toBe(401);
    expect(body.message).toBe('Email e/ou senha inválidos');
  });

  test('Deve rejeitar login com e-mail não cadastrado', async ({ request }) => {
    const res = await request.post('/login', {
      data: { email: 'naoexiste@qa.com', password: 'qualquer' },
    });

    expect(res.status()).toBe(401);
  });
});
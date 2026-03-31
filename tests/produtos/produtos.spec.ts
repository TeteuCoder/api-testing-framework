// ============================================================
import { test, expect } from '@playwright/test';
import { AuthClient } from '../../src/clients/AuthClient';
import { UsuariosClient } from '../../src/clients/UsuariosClient';
import { ProdutosClient } from '../../src/clients/ProdutosClient';
import { adminUser, produto } from '../../fixtures/data';

test.describe('CRUD /produtos (autenticado)', () => {
  let token: string;
  let produtoId: string;
  let userId: string;

  test.beforeAll(async ({ request }) => {
    // Cria usuário admin e obtém token
    const usuarios = new UsuariosClient(request);
    const res = await usuarios.criar(adminUser);
    const body = await res.json();
    userId = body._id;

    const auth = new AuthClient(request);
    token = await auth.login(adminUser.email, adminUser.password);
  });

  test.afterAll(async ({ request }) => {
    const usuarios = new UsuariosClient(request);
    await usuarios.deletar(userId);
  });

  test('POST — Deve criar produto com token válido', async ({ request }) => {
    const produtos = new ProdutosClient(request);
    const res = await produtos.criar(produto, token);
    const body = await res.json();

    expect(res.status()).toBe(201);
    expect(body).toHaveProperty('_id');
    expect(body.message).toBe('Cadastro realizado com sucesso');
    produtoId = body._id;
  });

  test('GET — Deve listar produtos', async ({ request }) => {
    const produtos = new ProdutosClient(request);
    const res = await produtos.listar();
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body).toHaveProperty('produtos');
    expect(Array.isArray(body.produtos)).toBeTruthy();
  });

  test('GET /:id — Deve buscar produto pelo ID', async ({ request }) => {
    const produtos = new ProdutosClient(request);
    const res = await produtos.buscarPorId(produtoId);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body._id).toBe(produtoId);
    expect(body.nome).toBe(produto.nome);
  });

  test('POST — Deve rejeitar criação sem token', async ({ request }) => {
    const res = await request.post('/produtos', { data: produto });

    expect(res.status()).toBe(401);
  });

  test('DELETE /:id — Deve deletar produto', async ({ request }) => {
    const produtos = new ProdutosClient(request);
    const res = await produtos.deletar(produtoId, token);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.message).toBe('Registro excluído com sucesso');
  });
});
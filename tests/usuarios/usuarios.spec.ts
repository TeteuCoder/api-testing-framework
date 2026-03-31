import { test, expect, request as playwrightRequest } from '@playwright/test';
import { UsuariosClient } from '../../src/clients/UsuariosClient';
import { adminUser } from '../../fixtures/data';

test.describe('CRUD /usuarios', () => {
  let userId: string;
  let client: UsuariosClient;

  // ✅ Cria um APIRequestContext manual — pode ser reutilizado em todos os testes
  test.beforeAll(async () => {
    const ctx = await playwrightRequest.newContext({
      baseURL: 'https://serverest.dev',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    client = new UsuariosClient(ctx);
  });

  test('POST — Deve cadastrar usuário e retornar _id', async () => {
    const res = await client.criar(adminUser);
    const body = await res.json();

    expect(res.status()).toBe(201);
    expect(body).toHaveProperty('_id');
    expect(body.message).toBe('Cadastro realizado com sucesso');
    userId = body._id;
  });

  test('GET — Deve listar usuários com estrutura correta', async () => {
    const res = await client.listar();
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body).toHaveProperty('quantidade');
    expect(body).toHaveProperty('usuarios');
    expect(Array.isArray(body.usuarios)).toBeTruthy();
    expect(body.quantidade).toBeGreaterThan(0);
  });

  test('GET /:id — Deve buscar usuário pelo ID', async () => {
    const res = await client.buscarPorId(userId);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body._id).toBe(userId);
    expect(body.nome).toBe(adminUser.nome);
    expect(body.email).toBe(adminUser.email);
  });

  test('PUT /:id — Deve atualizar nome do usuário', async () => {
    const res = await client.atualizar(userId, { ...adminUser, nome: 'QA Admin Atualizado' });
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.message).toBe('Registro alterado com sucesso');
  });

  test('DELETE /:id — Deve deletar usuário cadastrado', async () => {
    const res = await client.deletar(userId);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.message).toBe('Registro excluído com sucesso');
  });


// ✅ Teste 1: ID com formato correto mas inexistente → 400 "não encontrado"
  test('GET /:id — Deve retornar 400 para ID inexistente', async () => {
    const res = await client.buscarPorId('000000000000000a'); // 16 chars alfanuméricos
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.message).toBe('Usuário não encontrado');
  });

  // ✅ Teste 2 (bônus): ID com formato inválido → validação da API
  test('GET /:id — Deve retornar 400 para ID com formato inválido', async () => {
    const res = await client.buscarPorId('idcurto');
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.id).toBe('id deve ter exatamente 16 caracteres alfanuméricos');
  });

  test('POST — Deve rejeitar e-mail duplicado', async () => {
    await client.criar(adminUser);
    const res = await client.criar(adminUser);
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.message).toBe('Este email já está sendo usado');

    // limpeza
    const lista = await (await client.listar()).json();
    const user = lista.usuarios.find((u: any) => u.email === adminUser.email);
    if (user) await client.deletar(user._id);
  });
});
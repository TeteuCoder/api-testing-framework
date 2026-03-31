import { APIRequestContext } from '@playwright/test';

export class ProdutosClient {
  constructor(private request: APIRequestContext) {}

  async criar(data: object, token: string) {
    return this.request.post('/produtos', {
      data,
      headers: { Authorization: token },
    });
  }

  async listar() {
    return this.request.get('/produtos');
  }

  async buscarPorId(id: string) {
    return this.request.get(`/produtos/${id}`);
  }

  async deletar(id: string, token: string) {
    return this.request.delete(`/produtos/${id}`, {
      headers: { Authorization: token },
    });
  }
}
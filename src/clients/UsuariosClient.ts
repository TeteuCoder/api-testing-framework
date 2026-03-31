import { APIRequestContext } from '@playwright/test';

export class UsuariosClient {
  constructor(private request: APIRequestContext) {}

  async criar(data: object) {
    return this.request.post('/usuarios', { data });
  }

  async listar() {
    return this.request.get('/usuarios');
  }

  async buscarPorId(id: string) {
    return this.request.get(`/usuarios/${id}`);
  }

  async atualizar(id: string, data: object) {
    return this.request.put(`/usuarios/${id}`, { data });
  }

  async deletar(id: string) {
    return this.request.delete(`/usuarios/${id}`);
  }
}
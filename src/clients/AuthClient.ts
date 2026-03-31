
import { APIRequestContext } from '@playwright/test';

export class AuthClient {
  constructor(private request: APIRequestContext) {}

  async login(email: string, password: string): Promise<string> {
    const res = await this.request.post('/login', {
      data: { email, password },
    });
    const body = await res.json();
    return body.authorization; // "Bearer <token>"
  }
}
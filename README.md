# 🔌 API Testing Framework — ServeRest

![CI](https://github.com/TeteuCoder/api-testing-framework/actions/workflows/playwright.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-1.x-45ba4b?logo=playwright)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-blue)

Framework de testes de API desenvolvido com **Playwright + TypeScript** contra a [ServeRest](https://serverest.dev/) — API REST de referência no ecossistema brasileiro de QA. O projeto cobre autenticação com token, CRUD completo e cenários negativos, com execução automatizada via **CI/CD no GitHub Actions**.

---

## 🎯 Objetivo

Demonstrar domínio em testes de API com foco em:
- Arquitetura orientada a clientes (equivalente ao POM para APIs)
- Cobertura de fluxos autenticados e não autenticados
- Validação de contrato: status code, estrutura e mensagens de resposta
- Organização de dados de teste com fixtures centralizadas
- Pipeline CI/CD sem dependência de browsers

---

## 🗂️ Estrutura do Projeto

```
├── .github/
│   └── workflows/
│       └── playwright.yml        # Pipeline CI/CD
├── fixtures/
│   └── data.ts                   # Dados de teste centralizados
├── src/
│   └── clients/
│       ├── AuthClient.ts         # Login e obtenção de token
│       ├── UsuariosClient.ts     # CRUD /usuarios
│       └── ProdutosClient.ts     # CRUD /produtos (autenticado)
├── tests/
│   ├── auth/
│   │   └── login.spec.ts         # Testes de autenticação
│   ├── usuarios/
│   │   └── usuarios.spec.ts      # CRUD completo de usuários
│   └── produtos/
│       └── produtos.spec.ts      # CRUD de produtos com token
├── playwright.config.ts
└── README.md
```

---

## 🧪 Cobertura de Testes

### Auth — `POST /login`
| Cenário | Status |
|---|---|
| Login com credenciais válidas retorna token Bearer | ✅ |
| Login com senha inválida retorna 401 | ✅ |
| Login com e-mail não cadastrado retorna 401 | ✅ |

### Usuários — `CRUD /usuarios`
| Cenário | Status |
|---|---|
| POST — Cadastrar usuário e retornar `_id` | ✅ |
| GET — Listar usuários com estrutura correta | ✅ |
| GET `/:id` — Buscar usuário pelo ID | ✅ |
| PUT `/:id` — Atualizar dados do usuário | ✅ |
| DELETE `/:id` — Deletar usuário cadastrado | ✅ |
| GET `/:id` — Retornar 400 para ID inexistente | ✅ |
| GET `/:id` — Retornar 400 para ID com formato inválido | ✅ |
| POST — Rejeitar e-mail duplicado | ✅ |

### Produtos — `CRUD /produtos`
| Cenário | Status |
|---|---|
| POST — Criar produto com token válido | ✅ |
| GET — Listar produtos | ✅ |
| GET `/:id` — Buscar produto pelo ID | ✅ |
| POST — Rejeitar criação sem token (401) | ✅ |
| DELETE `/:id` — Deletar produto | ✅ |

> **16 testes passando** · Tempo médio: ~15s

---

## ⚙️ Decisões Técnicas

**Por que API Clients ao invés de requests diretos nos testes?**
Cada client encapsula as chamadas HTTP de um recurso — o mesmo princípio do Page Object Model aplicado à camada de API. Se a URL ou um header mudar, a correção acontece em um único lugar.

**Por que `request.newContext()` no `beforeAll`?**
A fixture `request` do Playwright tem escopo de teste individual e não pode ser reutilizada entre testes. Criar um contexto manual no `beforeAll` permite compartilhar o client e o estado (ex: `userId`) entre todos os testes do `describe`.

**Por que `Date.now()` no e-mail dos fixtures?**
Garante e-mails únicos a cada execução, evitando falsos negativos por conflito de dados entre runs do CI.

**Por que `fullyParallel: false` e `workers: 1`?**
Testes de API que compartilham estado (criar → buscar → deletar o mesmo recurso) precisam rodar em sequência para evitar condições de corrida.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+
- npm

### Instalação

```bash
git clone https://github.com/TeteuCoder/api-testing-framework.git
cd api-testing-framework
npm install
```

### Executar todos os testes

```bash
npx playwright test
```

### Executar com relatório visual

```bash
npx playwright test --reporter=html
npx playwright show-report
```

### Executar uma suíte específica

```bash
npx playwright test tests/auth
npx playwright test tests/usuarios
npx playwright test tests/produtos
```

---

## 📊 Relatório de Execução

👉 **[Ver último relatório publicado](https://TeteuCoder.github.io/api-testing-framework/)** _(via GitHub Pages)_

---

## 🔄 Pipeline CI/CD

```
push → install deps → run API tests → upload report → deploy GitHub Pages
```

Sem instalação de browsers — o pipeline roda em ~1 minuto.

---

## 🛠️ Stack

| Ferramenta | Uso |
|---|---|
| [Playwright](https://playwright.dev/) | Framework de testes de API |
| TypeScript | Tipagem estática |
| [ServeRest](https://serverest.dev/) | API REST de referência para QA |
| GitHub Actions | Pipeline CI/CD |
| GitHub Pages | Publicação do HTML Report |

---

## 👨‍💻 Autor

**Matheus Martins Silva** — QA Analyst · QA Automation Engineer

[![GitHub](https://img.shields.io/badge/GitHub-TeteuCoder-181717?logo=github)](https://github.com/TeteuCoder)

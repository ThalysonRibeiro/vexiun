# Testing Guide

Este projeto possui configuração completa para testes unitários (Jest) e testes end-to-end (Playwright).

## Estrutura de Testes

```
src/
├── __tests__/                    # Testes unitários
│   ├── components/              # Testes de componentes
│   ├── utils/                   # Testes de utilitários
│   └── hooks/                   # Testes de hooks
tests/                           # Testes E2E (Playwright)
├── auth.spec.ts                 # Testes de autenticação
├── dashboard.spec.ts            # Testes do dashboard
└── example.spec.ts              # Exemplo de teste
```

## Testes Unitários (Jest)

### Executar Testes

```bash
# Executar todos os testes unitários
npm run test:unit

# Executar em modo watch
npm run test:unit:watch

# Executar com cobertura
npm run test:unit:coverage
```

### Convenções de Nomenclatura

- Arquivos de teste: `*.test.ts` ou `*.test.tsx`
- Localização: `src/__tests__/` ou junto ao arquivo testado
- Exemplo: `src/components/ui/__tests__/button.test.tsx`

### Exemplo de Teste

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })
})
```

## Testes E2E (Playwright)

### Executar Testes

```bash
# Executar todos os testes E2E
npm run test:e2e

# Executar com interface gráfica
npm run test:e2e:ui

# Executar em modo headed (com navegador visível)
npm run test:e2e:headed
```

### Configuração

- Base URL: `http://localhost:3000`
- Navegador: Chromium (configurável)
- Timeout: 120 segundos para servidor de desenvolvimento

### Exemplo de Teste

```typescript
import { test, expect } from "@playwright/test";

test("should show login page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
});
```

## Configuração de Ambiente

### Variáveis de Ambiente

Crie um arquivo `.env.test` baseado no `.env.test.example`:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dev_tasks_test"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-test-secret-key"

# Email
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT=1025
EMAIL_FROM="test@example.com"
```

### Banco de Dados de Teste

```bash
# Executar migrações no banco de teste
npm run db:test:migrate
```

## Executar Todos os Testes

```bash
# Executar testes unitários e E2E
npm run test:all
```

## Relatórios

### Jest (Testes Unitários)

- Cobertura: `coverage/` (gerado automaticamente)
- Relatório HTML: `coverage/lcov-report/index.html`

### Playwright (Testes E2E)

- Relatório HTML: `playwright-report/`
- Screenshots: `test-results/` (apenas em falhas)
- Vídeos: `test-results/` (apenas em falhas)
- Traces: `test-results/` (apenas em falhas)

## Dicas

1. **Testes Unitários**: Foque em testar lógica de negócio, utilitários e componentes isolados
2. **Testes E2E**: Teste fluxos completos do usuário e integração entre componentes
3. **Mocks**: Use mocks para APIs externas e banco de dados em testes unitários
4. **Setup**: Configure dados de teste no `beforeEach` para testes E2E
5. **Seletores**: Prefira seletores baseados em roles e texto em vez de classes CSS

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**: Verifique se o banco de teste está rodando
2. **Timeout em testes E2E**: Aumente o timeout no `playwright.config.ts`
3. **Falha em testes unitários**: Verifique se todas as dependências estão instaladas
4. **Problemas de autenticação**: Configure corretamente as variáveis de ambiente de teste

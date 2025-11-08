## Guia de Regras para IA (Gemini) — Padrões do Projeto

Este guia define como gerar e atualizar código neste repositório. Siga-o rigorosamente para manter consistência.

### Stack e Convenções Gerais

- **Framework**: Next.js 15 (App Router) com `src/` e rotas em `src/app/*`.
- **Linguagem**: TypeScript estrito (`strict: true`). Evite `any`. Tipar props e retornos públicos.
- **Alias**: Use `@/` para importar de `src/*` (conforme `tsconfig.json`).
- **Estilo**: Tailwind CSS v4. Use utilitárias e `cn` de `@/lib/utils` para mesclar classes.
- **UI**: Preferir componentes `ui/*` com `class-variance-authority (cva)` e padrões Radix UI.
- **Exports**: Usar exports nomeados (ex.: `export function ...`, `export { Button }`).
- **Pastas**: `components/`, `lib/`, `utils/`, `services/`, `hooks/`, `app/(panel)` etc. Respeite a organização existente.
- **Acessibilidade**: Usar `aria-*`, `role`, `aria-label`, e foco visível. Não remover outlines; use classes já padronizadas.

### Regras para Componentes React

- Coloque `"use client"` no topo somente quando necessário (interatividade, hooks de cliente, eventos). Caso contrário, mantenha server components.
- Nome de arquivos: `kebab-case.tsx` dentro de pastas alinhadas ao domínio.
- Estilização: classes Tailwind; variáveis com `cva` para variantes (veja `src/components/ui/button.tsx`).
- Classes: use `cn(...)` para combinar condicionais. Não construir strings de classe manualmente.
- Props: tipar com `React.ComponentProps<...>` e `VariantProps<typeof ...>` quando usar `cva`.
- Atributos de teste: adicionar `data-testid` somente quando necessário (ex.: `Background` usa `data-testid="background"`).
- Acessibilidade: rotular botões/menus com textos claros (ex.: `name: /Toggle theme/i` em testes).

### Regras para Páginas/Rotas Next.js

- Arquivos padrão do App Router: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`. Não coletar cobertura neles (já configurado no Jest).
- Endpoints em `src/app/api/*` em TypeScript. Respeitar `Response`/`NextRequest` do Next 15.
- Imagens: respeitar `next.config.ts` `images.remotePatterns` para domínios permitidos.

### Utilitários e Libs

- `src/lib/utils.ts`: usar `cn` para tailwind-merge + clsx.
- Centralizar integrações em `services/*` (ex.: email) e dados em `lib/*` quando fizer sentido.

### Padrões de Testes (Jest + RTL)

- Framework: Jest 30 com ambiente `jsdom` e `@testing-library/react`/`user-event`.
- Locais: `__tests__` ou `*.test.ts(x)`/`*.spec.ts(x)` dentro de `src/**`.
- Cobertura: `collectCoverageFrom` já definido. Não testar arquivos excluídos (páginas/layouts/globals.css).
- Seletores: priorize queries por papel/nome (`getByRole`, `getByText`). Use `data-testid` apenas quando necessário.
- Mocks: usar `jest.mock(...)`. Exemplos:
  - `next-themes` (veja `src/components/__tests__/modeToggle.test.tsx`).
  - Dependências externas com `transformIgnorePatterns` já ajustado para `next-auth/@auth/core/jose`.
- User interactions: `await userEvent.click(...)` com `async/await`.
- Expectativas: usar `toBeInTheDocument()`, valores de texto/aria, e outputs puros de funções utilitárias.

### ESLint e Formatação

- Base: `next/core-web-vitals` + `next/typescript` (Flat config). Regra `@typescript-eslint/no-unused-vars` está desligada; ainda assim, prefira prefixar variáveis intencionalmente não usadas com `_`.
- Rodar `npm run lint` e `npm run type-check` antes de commitar (especialmente em CI `test:ci`).

### Prisma e Banco

- Gere tipos com `prisma generate` antes de build. Scripts já tratam disso (`build`, `vercel-build`).
- Migrations por `prisma migrate deploy` em deploy (ver scripts e `docker-compose.yml` para local).

### Scripts essenciais

- Desenvolvimento: `npm run dev`.
- Lint: `npm run lint` | Correções: `npm run lint:fix`.
- Tipos: `npm run type-check`.
- Testes: `npm run test`, cobertura `npm run test:coverage`, E2E `npm run test:e2e`.

### Diretrizes de Código (IA)

- Evite quebra de estilo e mantenha o padrão de imports agrupados: libs externas, alias `@/`, relativos.
- Não introduza dependências sem necessidade. Se incluir, adicione em `package.json` e justifique.
- Não alterar regras de coverage/transform sem necessidade. Siga as exceções já configuradas.
- Não criar snapshots estáticos por padrão. Prefira asserts sem snapshots.
- Garantir que novos componentes tenham testes básicos de renderização e interação quando aplicável.

### Exemplos de Padrões

- Componente `Button` com `cva` e `cn` (referência: `src/components/ui/button.tsx`).
- Utilitário `cn` (referência: `src/lib/utils.ts`).
- Teste de componente com mock e interação (referência: `src/components/__tests__/modeToggle.test.tsx`).

### PR/Commits

- Mensagens curtas e descritivas. Inclua escopo (ex.: `ui:`, `feat:`, `fix:`, `test:`).
- Execute `npm run test:ci` localmente quando possível antes do PR.

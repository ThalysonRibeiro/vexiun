# Dev Tasks

Clone parcial do Monday.com - Sistema de gestão de projetos e metas

## 🚀 Tecnologias

- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[shadcn](https://ui.shadcn.com/examples/dashboard)** - Compoents utilitário
- **[Geist Font](https://vercel.com/font)** - Fonte otimizada da Vercel

## 📋 Funcionalidades

- ✅ Interface moderna e responsiva
- 📱 Design mobile-first
- ⚡ Performance otimizada com Next.js
- 🎨 Estilização com Tailwind CSS
- 📝 Gerenciamento eficiente de tarefas
- 🔄 Hot reload durante desenvolvimento

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm, yarn, pnpm ou bun

### Passos para instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/ThalysonRibeiro/dev-tasks.git
   cd dev-tasks
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   # ou
   bun install
   ```

3. **Execute o servidor de desenvolvimento**

   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   # ou
   bun dev
   ```

4. **Acesse a aplicação**

   Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 📁 Estrutura do Projeto

```
dev-tasks/
├── app/                    # App Router do Next.js 14
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── public/                # Arquivos estáticos
├── components/            # Componentes reutilizáveis
├── lib/                   # Utilitários e configurações
├── next.config.js         # Configuração do Next.js
├── tailwind.config.ts     # Configuração do Tailwind
├── tsconfig.json          # Configuração do TypeScript
└── package.json           # Dependências do projeto
```

## 🎯 Como usar

1. **Desenvolvimento**: Edite `app/page.tsx` para modificar a página principal
2. **Componentes**: Adicione novos componentes na pasta `components/`
3. **Estilos**: Utilize classes do Tailwind CSS para estilização
4. **Rotas**: Crie novas páginas na pasta `app/` seguindo a estrutura do App Router

## 🚀 Quick Start

### Setup Automático

```bash
npm run setup
```

### Setup Manual

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar bancos de dados
npm run db:up

# 3. Executar migrações
npm run db:migrate

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

## 📚 Scripts Disponíveis

### 🛠️ Desenvolvimento

```bash
npm run dev              # Servidor de desenvolvimento
npm run dev:test         # Servidor com ambiente de teste
npm run build            # Build de produção
npm run start            # Servidor de produção
npm run lint             # Executar ESLint
npm run lint:fix         # Executar ESLint com auto-fix
npm run type-check       # Verificar tipos TypeScript
```

### 🗄️ Banco de Dados

```bash
npm run db:up            # Iniciar bancos de dados
npm run db:down          # Parar bancos de dados
npm run db:reset         # Resetar bancos de dados
npm run db:migrate       # Executar migrações
npm run db:test:migrate  # Executar migrações de teste
npm run db:studio        # Abrir Prisma Studio
npm run db:studio:test   # Abrir Prisma Studio (teste)
```

### 🧪 Testes

```bash
npm run test:unit        # Testes unitários (Jest)
npm run test:e2e         # Testes E2E (Playwright)
npm run test:all         # Todos os testes
npm run test:ci          # Testes para CI/CD
npm run test:coverage    # Cobertura de testes
```

### 🚀 Deploy

```bash
npm run build            # Build para produção
vercel                   # Deploy para Vercel (preview)
vercel --prod           # Deploy para produção
```

### 🧹 Utilitários

```bash
npm run clean            # Limpar arquivos temporários
npm run setup            # Setup completo do ambiente
```

## 🧪 Testes

Este projeto possui uma suite completa de testes:

### Testes Unitários (Jest)

- **Componentes**: Testes de componentes React isolados
- **Utilitários**: Testes de funções e lógica de negócio
- **Cobertura**: Relatórios detalhados de cobertura

### Testes E2E (Playwright)

- **Fluxos de usuário**: Testes de autenticação e dashboard
- **Integração**: Testes de componentes conectados
- **Relatórios**: Screenshots, vídeos e traces em falhas

### Estrutura de Testes

```
src/
├── __tests__/                    # Testes unitários
│   ├── components/              # Testes de componentes
│   └── utils/                   # Testes de utilitários
tests/                           # Testes E2E
├── auth.spec.ts                 # Testes de autenticação
└── dashboard.spec.ts            # Testes do dashboard
```

## 🚀 Deploy

Este projeto está configurado para deploy automático na **Vercel** com **pre-deploy checks**:

### Fluxo de Deploy

1. **Push para `main`** → GitHub Actions roda testes
2. **Testes passam** → Vercel faz deploy automático
3. **Testes falham** → Deploy é bloqueado

### Pre-Deploy Checks

- ✅ **Lint & Type Check** - Verifica qualidade do código
- ✅ **Testes Unitários** - Valida componentes e lógica
- ✅ **Build Test** - Garante que a aplicação compila
- ✅ **Testes E2E** - Valida fluxos completos
- ✅ **Database Migrations** - Verifica migrações

### Configuração

- **Framework**: Next.js 15
- **Build Command**: `npm run build`
- **Environment**: Production otimizada
- **CDN**: Global edge network
- **Pre-Deploy**: GitHub Actions

### Links

- **Produção**: [https://dev-tasks.vercel.app](https://dev-tasks.vercel.app)
- **Documentação**: [DEPLOY.md](./DEPLOY.md)

## 📋 Pull Requests

Templates disponíveis para diferentes tipos de PR:

- **[Template Geral](./.github/pull_request_template.md)** - Para mudanças gerais
- **[Bug Fix](./.github/pull_request_template_bugfix.md)** - Para correções
- **[Feature](./.github/pull_request_template_feature.md)** - Para novas funcionalidades
- **[Refactor](./.github/pull_request_template_refactor.md)** - Para refatorações

### Ambiente de Teste

Os testes E2E rodam em um ambiente isolado utilizando Docker, com um banco de dados PostgreSQL dedicado para não interferir com os dados de desenvolvimento.

### Como Executar os Testes

Siga os passos abaixo para executar os testes E2E localmente:

1. **Inicie os contêineres do Docker**

   Certifique-se de que o Docker está em execução e rode o comando abaixo para iniciar os bancos de dados de desenvolvimento e de teste.

   ```bash
   docker-compose up -d
   ```

2. **Prepare o Banco de Dados de Teste (Primeira Execução)**

   Antes de rodar os testes pela primeira vez, você precisa aplicar as migrações do Prisma no banco de dados de teste.

   ```bash
   npm run db:test:migrate
   ```

3. **Execute os Testes E2E**

   Este comando irá iniciar o servidor de desenvolvimento (conectado ao banco de teste), rodar todos os testes do Playwright e, em seguida, desligar o servidor.

   ```bash
   npm run test:e2e
   ```

## 🚀 Deploy

### Vercel (Recomendado)

A maneira mais fácil de fazer deploy é usando a [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático a cada push na branch main

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 🧠 Guia para IAs (Gemini)

Para manter consistência no código gerado por IA, siga o documento: [AI_GUIDELINES.md](./AI_GUIDELINES.md).

## 📖 Recursos Úteis

Para saber mais sobre Next.js, confira os recursos abaixo:

- [Documentação do Next.js](https://nextjs.org/docs) - aprenda sobre as funcionalidades e API
- [Tutorial Interativo](https://nextjs.org/learn) - tutorial interativo do Next.js
- [Repositório do Next.js](https://github.com/vercel/next.js) - feedback e contribuições são bem-vindos!

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Thalyson Ribeiro**

- GitHub: [@ThalysonRibeiro](https://github.com/ThalysonRibeiro)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

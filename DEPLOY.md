# 🚀 Guia de Deploy - Vercel

Este guia explica como configurar e fazer deploy da aplicação Dev Tasks na Vercel.

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Projeto conectado ao GitHub
- Banco de dados PostgreSQL configurado
- Variáveis de ambiente configuradas

## 🔧 Configuração Inicial

### 1. Conectar Projeto na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório do GitHub
4. Configure as seguintes opções:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2. Configurar Pre-Deploy Checks

Na Vercel Dashboard, vá em **Settings > Git** e configure:

- **Deploy Protection**: Ative para `main` branch
- **Required Status Checks**: Adicione `pre-deploy-check`
- **Wait for Status Checks**: Ative para aguardar GitHub Actions

Isso garante que a Vercel só fará deploy após os testes passarem.

### 3. Configurar Variáveis de Ambiente

Na Vercel Dashboard, vá em **Settings > Environment Variables** e configure:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key

# Email
EMAIL_SERVER_HOST=your-email-host
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email-user
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=noreply@yourdomain.com

# Cloudinary (opcional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Configurar GitHub Secrets

No seu repositório GitHub, vá em **Settings > Secrets and variables > Actions** e adicione:

```bash
# Vercel
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
```

## 🔄 Fluxo de Deploy

### Deploy Automático com Pre-Checks

1. **Push para `main`** → GitHub Actions roda pre-deploy checks
2. **Testes passam** → Vercel faz deploy automático
3. **Testes falham** → Deploy é bloqueado até correção

### Pre-Deploy Checks (GitHub Actions)

O workflow `.github/workflows/pre-deploy-check.yml` executa:

1. **Lint & Type Check** - Verifica qualidade do código
2. **Database Migrations** - Executa migrações de teste
3. **Unit Tests** - Roda testes unitários com cobertura
4. **Build Test** - Testa se a aplicação compila
5. **E2E Tests** - Valida fluxos completos do usuário

### Status do Deploy

- ✅ **Success**: Todos os checks passaram, deploy liberado
- ❌ **Failure**: Algum check falhou, deploy bloqueado
- ⏳ **Pending**: Checks em execução

### Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

## 📊 Monitoramento

### Vercel Analytics

1. Ative o Vercel Analytics no dashboard
2. Configure eventos customizados
3. Monitore performance e erros

### Logs

- **Build Logs**: Dashboard da Vercel
- **Function Logs**: Vercel CLI ou dashboard
- **Edge Logs**: Dashboard da Vercel

## 🔍 Troubleshooting

### Problemas Comuns

#### Pre-Deploy Checks Failing

```bash
# Rodar checks localmente
npm run test:ci

# Verificar logs do GitHub Actions
# Vá em Actions tab do repositório

# Verificar testes específicos
npm run test:unit
npm run test:e2e
npm run lint
npm run type-check
```

#### Build Fails

```bash
# Verificar logs
vercel logs

# Build local
npm run build

# Verificar dependências
npm ci
```

#### Database Connection

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
npx prisma db push
```

#### Environment Variables

```bash
# Listar variáveis
vercel env ls

# Adicionar variável
vercel env add DATABASE_URL
```

### Performance

#### Otimizações

- ✅ Imagens otimizadas
- ✅ Bundle size reduzido
- ✅ Lazy loading implementado
- ✅ CDN configurado

#### Métricas

- **Core Web Vitals**: Monitorar no Vercel Analytics
- **Bundle Size**: Verificar no build logs
- **Function Duration**: Monitorar no dashboard

## 🚀 Deploy Checklist

### Antes do Deploy

- [ ] ✅ Testes passando (`npm run test:ci`)
- [ ] ✅ Build funcionando (`npm run build`)
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Banco de dados migrado
- [ ] ✅ Performance verificada

### Durante o Deploy

- [ ] ✅ Build sem erros
- [ ] ✅ Funções deployadas
- [ ] ✅ Assets otimizados
- [ ] ✅ CDN configurado

### Após o Deploy

- [ ] ✅ Aplicação funcionando
- [ ] ✅ Autenticação testada
- [ ] ✅ Banco de dados conectado
- [ ] ✅ Performance verificada
- [ ] ✅ Analytics funcionando

## 📈 Monitoramento Contínuo

### Métricas Importantes

- **Uptime**: 99.9%+
- **Response Time**: <200ms
- **Error Rate**: <1%
- **Build Time**: <5min

### Alertas Configurados

- Build failures
- Function timeouts
- Database connection errors
- Performance degradation

## 🔒 Segurança

### Headers de Segurança

```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block"
}
```

### Variáveis Sensíveis

- ✅ Nunca commitar secrets
- ✅ Usar Vercel Environment Variables
- ✅ Rotacionar tokens regularmente
- ✅ Monitorar acesso

## 📚 Recursos Úteis

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/environment-variables)

---

**🎯 Dica:** Configure webhooks para notificações de deploy no Slack/Discord!

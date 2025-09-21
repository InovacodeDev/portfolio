# Guia de Deploy - Inovacode Portfolio

## Visão Geral

Este documento fornece instruções detalhadas para fazer o deploy da aplicação Inovacode Portfolio em produção usando Vercel (frontend) e Fly.io (backend).

## Pré-requisitos

### Ferramentas Necessárias

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v8+)
- [Git](https://git-scm.com/)
- [Vercel CLI](https://vercel.com/cli) (para frontend)
- [Fly CLI](https://fly.io/docs/getting-started/installing-flyctl/) (para backend)

### Contas de Serviço

- Conta no [Vercel](https://vercel.com/)
- Conta no [Fly.io](https://fly.io/)
- Banco PostgreSQL (Supabase recomendado)
- Conta no [Resend](https://resend.com/) para emails

## Configuração de Produção

### 1. Variáveis de Ambiente

#### Frontend (Vercel)

```bash
VITE_API_URL=https://your-api-domain.fly.dev
```

#### Backend (Fly.io)

```bash
DATABASE_URL=postgresql://user:password@host:port/database
RESEND_API_KEY=re_your_resend_api_key
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### 2. Deploy do Frontend (Vercel)

#### Opção A: Deploy via Dashboard

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click em "New Project"
3. Conecte seu repositório GitHub
4. Configure:
    - **Framework Preset**: Vite
    - **Build Command**: `cd apps/web && pnpm build`
    - **Output Directory**: `apps/web/dist`
    - **Install Command**: `pnpm install`
5. Adicione as variáveis de ambiente
6. Click em "Deploy"

#### Opção B: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Na pasta do projeto
cd apps/web
vercel

# Para deploy em produção
vercel --prod
```

### 3. Deploy do Backend (Fly.io)

#### Configuração Inicial

```bash
# Instalar Fly CLI
# macOS: brew install flyctl
# Outros: https://fly.io/docs/getting-started/installing-flyctl/

# Login
flyctl auth login

# Criar aplicação (já configurado no fly.toml)
flyctl launch --no-deploy

# Configurar secrets
flyctl secrets set DATABASE_URL="your-database-url"
flyctl secrets set RESEND_API_KEY="your-resend-key"
flyctl secrets set ALLOWED_ORIGINS="https://your-vercel-domain.vercel.app"

# Deploy
flyctl deploy
```

### 4. GitHub Actions (CI/CD Automático)

#### Configurar Secrets no GitHub

1. Vá para Settings > Secrets and variables > Actions
2. Adicione os seguintes secrets:

**Para Vercel:**

- `VERCEL_TOKEN`: Token da API do Vercel
- `VERCEL_ORG_ID`: ID da organização
- `VERCEL_PROJECT_ID`: ID do projeto

**Para Fly.io:**

- `FLY_API_TOKEN`: Token da API do Fly.io

#### Workflow Automático

O workflow `.github/workflows/ci-cd.yml` está configurado para:

- ✅ Executar lint e testes
- ✅ Fazer build das aplicações
- ✅ Deploy automático na branch `main`

## Verificação de Deploy

### Checklist Pós-Deploy

#### Frontend (Vercel)

- [ ] Site carrega corretamente
- [ ] Meta tags SEO funcionando
- [ ] Animações Framer Motion funcionando
- [ ] Formulário de contato renderiza
- [ ] Navegação entre seções funciona
- [ ] Responsividade em mobile

#### Backend (Fly.io)

- [ ] Health check responde: `GET /health`
- [ ] Endpoint de contato funciona: `POST /api/v1/contact`
- [ ] CORS configurado corretamente
- [ ] Banco de dados conectado
- [ ] Logs estruturados funcionando

#### Integração End-to-End

- [ ] Formulário envia dados para API
- [ ] Emails são enviados via Resend
- [ ] Estados de loading/success/error funcionam
- [ ] Validação de formulário funciona

## Comandos Úteis

### Build Local

```bash
# Build completo
pnpm turbo build

# Build apenas frontend
pnpm --filter @inovacode/web build

# Build apenas backend
pnpm --filter @inovacode/api build
```

### Logs de Produção

```bash
# Logs do Vercel
vercel logs

# Logs do Fly.io
flyctl logs
```

### Rollback

```bash
# Vercel - usar dashboard ou
vercel --prod --local-config=path/to/previous/build

# Fly.io
flyctl releases
flyctl deploy --image previous-image-url
```

## Troubleshooting

### Problemas Comuns

#### Build Fails

- ✅ Verificar todas as dependências instaladas
- ✅ Confirmar versões Node.js compatíveis
- ✅ Verificar variáveis de ambiente

#### CORS Errors

- ✅ Verificar `ALLOWED_ORIGINS` no backend
- ✅ Confirmar URL da API no frontend
- ✅ Verificar configuração HTTPS

#### Database Connection

- ✅ Verificar `DATABASE_URL` válida
- ✅ Confirmar SSL habilitado
- ✅ Testar conexão local primeiro

## Scripts Automatizados

### Deploy Script

```bash
# Execute o script de deploy
./scripts/deploy.sh
```

Este script:

1. Verifica dependências
2. Instala packages
3. Executa lint e type-check
4. Faz build das aplicações
5. Deploy automático (se CLIs estão instaladas)

## Monitoramento

### URLs de Produção

- **Frontend**: `https://your-domain.vercel.app`
- **Backend**: `https://your-api.fly.dev`
- **Health Check**: `https://your-api.fly.dev/health`

### Métricas

- Vercel Analytics (automático)
- Fly.io Metrics (dashboard)
- Uptime monitoring (configurar externamente)

## Próximos Passos

1. 🔄 Configurar domínio personalizado
2. 🔄 SSL certificates (automático no Vercel/Fly.io)
3. 🔄 CDN configuração (automático no Vercel)
4. 🔄 Monitoring e alertas
5. 🔄 Backup de banco de dados
6. 🔄 Analytics detalhado

---

## Suporte

Para problemas de deploy:

1. Verificar logs das plataformas
2. Consultar documentação oficial
3. Usar os health checks para debug
4. Verificar este guia para troubleshooting

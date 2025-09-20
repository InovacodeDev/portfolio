# Configuração do Banco de Dados Supabase

Este documento descreve como configurar o banco de dados PostgreSQL no Supabase para o projeto Inovacode Portfolio.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com/)
- Node.js e pnpm instalados
- Acesso ao dashboard do Supabase

## 🚀 Passos para Configuração

### 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em "New Project"
3. Escolha sua organização
4. Preencha as informações do projeto:
    - **Name**: `inovacode-portfolio`
    - **Database Password**: Escolha uma senha forte (salve-a!)
    - **Region**: Escolha a região mais próxima (ex: `us-east-1`)
5. Clique em "Create new project"
6. Aguarde a criação do projeto (pode levar alguns minutos)

### 2. Obter Strings de Conexão

1. No dashboard do projeto, clique no botão **"Connect"** no topo da página
2. Selecione **"App Frameworks"** ou **"Postgres"**
3. Copie as seguintes informações:

#### Para Desenvolvimento (Session Mode - IPv4 compatível):

```
postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

#### Para Produção (Direct Connection - melhor performance):

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

#### Para Serverless (Transaction Mode):

```
postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### 3. Configurar Variáveis de Ambiente Localmente

1. Copie o arquivo `.env.example` para `.env.local`:

    ```bash
    cp .env.example .env.local
    ```

2. Edite o `.env.local` e substitua os valores de placeholder:

    ```env
    # Use a Session Mode connection string para desenvolvimento
    DATABASE_URL="postgres://postgres.abcdefghijklmnop:[SUA-SENHA]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

    # Configurações do projeto Supabase
    SUPABASE_URL="https://abcdefghijklmnop.supabase.co"
    SUPABASE_ANON_KEY="sua_anon_key_aqui"
    SUPABASE_SERVICE_ROLE_KEY="sua_service_role_key_aqui"

    # Senha do banco (a mesma usada na connection string)
    DB_PASSWORD="sua_senha_do_banco"
    ```

3. **Importante**: Nunca commite o arquivo `.env.local` no Git!

### 4. Obter as Chaves da API

1. No dashboard do Supabase, vá para **Settings > API**
2. Copie as seguintes chaves:
    - **URL**: Use como `SUPABASE_URL`
    - **anon public**: Use como `SUPABASE_ANON_KEY`
    - **service_role**: Use como `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Mantenha secreta!)

### 5. Testar a Configuração

Execute o teste de conexão:

```bash
cd apps/api
pnpm exec tsc src/test-db.ts --outDir dist --target ES2020 --module CommonJS --esModuleInterop
node dist/test-db.js
```

Se tudo estiver configurado corretamente, você verá:

```
✅ Database connection successful!
✅ Database query successful: { current_time: 2024-XX-XXTXX:XX:XX.XXX }
```

### 6. Iniciar o Servidor de Desenvolvimento

```bash
# Na raiz do projeto
pnpm dev
```

O health check em `http://localhost:3000/healthz` deve mostrar:

```json
{
    "status": "ok",
    "database": "configured",
    "timestamp": "2024-XX-XXTXX:XX:XX.XXX"
}
```

## 🔧 Tipos de Conexão

### Direct Connection

- **Melhor para**: Servidores persistentes (VMs, containers de longa duração)
- **Limitação**: Apenas IPv6
- **Porta**: 5432
- **Performance**: Melhor (sem proxy)

### Session Mode (Supavisor)

- **Melhor para**: Servidores persistentes que precisam de IPv4
- **Porta**: 5432
- **Performance**: Boa
- **Recomendado para**: Desenvolvimento local

### Transaction Mode (Supavisor)

- **Melhor para**: Funções serverless, conexões de curta duração
- **Porta**: 6543
- **Performance**: Boa para casos de uso específicos
- **Limitação**: Não suporta prepared statements

## 🔒 Segurança

### Variáveis de Ambiente de Produção

Para produção, configure as variáveis de ambiente no seu provedor de deploy:

**Vercel:**

```bash
vercel env add DATABASE_URL
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
# Não adicione SUPABASE_SERVICE_ROLE_KEY no frontend
```

**Fly.io (para API):**

```bash
flyctl secrets set DATABASE_URL="sua_connection_string"
flyctl secrets set SUPABASE_URL="https://seu-projeto.supabase.co"
flyctl secrets set SUPABASE_SERVICE_ROLE_KEY="sua_service_role_key"
```

### Boas Práticas de Segurança

1. **Nunca** exponha a `SUPABASE_SERVICE_ROLE_KEY` no frontend
2. Use a `SUPABASE_ANON_KEY` apenas no frontend
3. Configure Row Level Security (RLS) nas tabelas
4. Use conexões SSL em produção
5. Monitore o uso de conexões no dashboard do Supabase

## 🐛 Troubleshooting

### "Connection refused"

- Verifique se o projeto Supabase está ativo
- Confirme a connection string
- Verifique configurações de firewall

### "Password authentication failed"

- Verifique a senha no dashboard do Supabase
- Confirme se a senha na connection string está correta
- Considere resetar a senha se necessário

### "Too many connections"

- Use Transaction Mode para funções serverless
- Configure pool size adequado
- Monitore conexões ativas no dashboard

### IPv4/IPv6 Issues

- Use Session Mode se IPv6 não for suportado
- Considere o IPv4 add-on para conexões diretas
- Verifique configurações de rede

## 📚 Recursos Adicionais

- [Documentação Supabase Database](https://supabase.com/docs/guides/database)
- [Connection Strings Guide](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Drizzle ORM + Supabase](https://supabase.com/docs/guides/database/drizzle)

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do dashboard Supabase
2. Consulte a documentação oficial
3. Contate o suporte do Supabase se necessário

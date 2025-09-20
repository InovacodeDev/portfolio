# Technical Design Document: Inovacode Landing Page & Portfolio

**Status:** `v1.0 - Inception`
**Author:** O Engenheiro-Arquiteto Full-Stack
**Context:** This document outlines the complete technical architecture, development patterns, and operational procedures for the "Inovacode Landing Page & Portfólio" project, based on the initial [Blueprint de Projeto](blueprint.md). It serves as the single source of truth for the engineering team.

---

## SEÇÃO 1: ARQUITETURA DO SISTEMA E DECISÕES FUNDAMENTAIS

This section establishes the high-level architecture and the foundational decisions that will guide the project's development, ensuring scalability, maintainability, and a superior developer experience.

### 1.1. Modelo C4 de Arquitetura (Descrição Textual)

#### Nível 1 - Contexto do Sistema

The system, **"Plataforma Inovacode"**, exists to present the company's brand, solutions, and portfolio to the public.

* **Personas:**
    * `Visitante / Cliente Potencial`: Browses the site to learn about Inovacode and may submit an inquiry through the contact form.
* **Sistemas Externos:**
    * `Serviço de Email Transacional (Resend)`: Used by the Backend API to send notifications when the contact form is submitted.
    * `Provedor de DNS (e.g., Cloudflare)`: Manages the domain routing for the application.



#### Nível 2 - Contêineres

Zooming into the "Plataforma Inovacode," we see the following deployable units:

* **`Frontend App` (React SPA):**
    * **Responsabilidade:** Renders the user interface, handles all client-side interactions and animations, and communicates with the Backend API.
    * **Tecnologia:** React, Vite, Tanstack Router, Framer Motion, Tailwind CSS.
    * **Hospedagem:** Vercel.
* **`Backend API` (Node.js Service):**
    * **Responsabilidade:** Exposes a single endpoint to handle contact form submissions, validates the data, stores it in the database, and triggers an email notification.
    * **Tecnologia:** Node.js, Fastify, Drizzle ORM, Zod, Pino.
    * **Hospedagem:** Fly.io.
* **`Database` (PostgreSQL):**
    * **Responsabilidade:** Persists all contact form submissions for record-keeping and future use.
    * **Tecnologia:** PostgreSQL.
    * **Hospedagem:** Supabase.



---

### 1.2. Architecture Decision Records (ADRs)

#### ADR-001: Adoção de uma Arquitetura de Monorepo com Turborepo/pnpm

* **Status:** Aceito.
* **Contexto:** O projeto consiste em, no mínimo, dois pacotes distintos (`apps/web` e `apps/api`) e pacotes de configuração compartilhados (`packages/tsconfig`, `packages/eslint-config`). Precisamos de uma maneira eficiente para gerenciar dependências, executar scripts e compartilhar código.
* **Decisão:** Adotaremos uma estrutura de monorepo gerenciada por **pnpm workspaces** e orquestrada pelo **Turborepo**.
* **Consequências:**
    * **Positivas:**
        * **Configuração Centralizada:** ESLint, TypeScript e outras configurações são definidas uma vez e herdadas pelos pacotes.
        * **Compartilhamento de Código Type-Safe:** Esquemas de validação (Zod) e tipos podem ser definidos em um pacote `packages/schemas` e importados tanto pelo frontend quanto pelo backend, garantindo consistência.
        * **CI/CD Simplificado:** Um único pipeline pode construir, testar e versionar todo o projeto. O cache remoto do Turborepo acelerará drasticamente os builds.
        * **Experiência do Desenvolvedor (DX) Melhorada:** Um único comando (`pnpm dev`) pode iniciar todos os serviços.
    * **Negativas:**
        * A complexidade inicial da configuração do workspace é ligeiramente maior em comparação com repositórios separados.

#### ADR-002: Escolha do Fastify como Framework Backend

* **Status:** Aceito.
* **Contexto:** O backend tem um escopo limitado (um endpoint), mas deve ser performático, seguro e fácil de manter.
* **Decisão:** Utilizaremos o **Fastify** como nosso framework para a API Node.js.
* **Consequências:**
    * **Positivas:**
        * **Performance:** Fastify é um dos frameworks web mais rápidos para Node.js, com baixo overhead.
        * **Ecossistema Extensível:** Possui um sistema de plugins robusto para funcionalidades como CORS, rate limiting, etc.
        * **Validação por Schema:** A integração nativa com Zod (via `fastify-type-provider-zod`) permite a validação automática de requests e a serialização de responses, fortalecendo nossa estratégia de type safety.
        * **Logging Estruturado:** Utiliza Pino por padrão, o que se alinha com nossa estratégia de observabilidade.
    * **Negativas:**
        * Menos opinativo que frameworks como NestJS, exigindo uma definição de estrutura de projeto mais explícita.

#### ADR-003: Escolha do Drizzle ORM como Camada de Acesso a Dados

* **Status:** Aceito.
* **Contexto:** Precisamos de uma forma segura e eficiente para interagir com o banco de dados PostgreSQL a partir do nosso serviço Node.js. A segurança de tipos é um princípio fundamental.
* **Decisão:** Adotaremos o **Drizzle ORM** como nossa camada de acesso a dados.
* **Consequências:**
    * **Positivas:**
        * **Type Safety de Ponta a Ponta:** Os schemas do Drizzle são escritos em TypeScript e inferem tipos automaticamente, garantindo que as queries e seus resultados sejam totalmente type-safe.
        * **Sintaxe SQL-like:** Mantém a familiaridade e o poder do SQL, evitando a abstração excessiva de ORMs tradicionais.
        * **Performance:** É um "query builder", não um ORM tradicional, resultando em queries mais performáticas e sem sobrecarga de "mágica" em tempo de execução.
        * **Excelente DX:** A ferramenta `drizzle-kit` simplifica a geração e o gerenciamento de migrações.
    * **Negativas:**
        * É uma tecnologia mais nova em comparação com Prisma ou TypeORM, com uma comunidade em crescimento.

#### ADR-004: Estratégia de Autenticação baseada em JWT

* **Status:** Proposto (para futuras implementações).
* **Contexto:** O projeto atual é uma landing page pública. No entanto, antecipamos a necessidade futura de uma área administrativa ou portal do cliente.
* **Decisão:** Quando a autenticação for necessária, implementaremos um fluxo padrão baseado em **JSON Web Tokens (JWT)** com `access` e `refresh tokens` armazenados em cookies `httpOnly`.
* **Consequências:**
    * **Positivas:**
        * **Stateless:** A autenticação é stateless no lado do servidor, facilitando a escalabilidade horizontal.
        * **Padrão da Indústria:** É um padrão bem estabelecido e seguro para APIs.
    * **Negativas:**
        * Não será implementado na v1.0, mas a arquitetura deve estar ciente de sua eventual inclusão.

#### ADR-005: Escolha do PostgreSQL como Banco de Dados Primário

* **Status:** Aceito.
* **Contexto:** Precisamos de um banco de dados relacional robusto, confiável e com um ecossistema rico para persistir os dados da aplicação.
* **Decisão:** Utilizaremos o **PostgreSQL**.
* **Consequências:**
    * **Positivas:**
        * **Confiabilidade e Robustez:** É um sistema de banco de dados open-source testado em batalha por décadas.
        * **Rico em Funcionalidades:** Suporta tipos de dados avançados (JSONB), índices complexos e extensões poderosas.
        * **Ecossistema Amplo:** Excelente suporte de ferramentas (Drizzle, `node-postgres`) e provedores de nuvem (Supabase, AWS RDS).
    * **Negativas:**
        * Para o escopo atual de apenas armazenar contatos, pode ser considerado um exagero, mas é a escolha correta para qualquer crescimento futuro.

---

## SEÇÃO 2: STACK TECNOLÓGICA E CONFIGURAÇÕES DE WORKSPACE

Esta seção detalha as ferramentas específicas, bibliotecas e serviços que compõem a nossa stack.

### 2.1. Tooling do Workspace

* **Gerenciador de Pacotes:** `pnpm`
    * *pnpm-workspace.yaml*
        ```yaml
        packages:
          - 'apps/*'
          - 'packages/*'
        ```
* **Orquestrador:** `Turborepo`
    * *turbo.json*
        ```json
        {
          "$schema": "[https://turbo.build/schema.json](https://turbo.build/schema.json)",
          "globalDependencies": ["**/.env.*"],
          "pipeline": {
            "build": {
              "dependsOn": ["^build"],
              "outputs": [".next/**", "!.next/cache/**", "dist/**"]
            },
            "lint": {},
            "dev": {
              "cache": false,
              "persistent": true
            },
            "test": {
              "dependsOn": ["^build"],
              "outputs": ["coverage/**"]
            }
          }
        }
        ```
* **Configurações Compartilhadas:**
    * `packages/eslint-config`: Contém uma configuração base do ESLint com plugins para React, TypeScript e regras de importação. Todos os outros pacotes estendem essa configuração.
    * `packages/tsconfig`: Contém os arquivos `tsconfig.json` base (`base.json`, `react-library.json`, `node.json`) para garantir consistência nas configurações do TypeScript em todo o monorepo.

### 2.2. Stack do Backend (`apps/api`)

* **Framework:** Fastify
* **Validação:** Zod
* **ORM:** Drizzle ORM
* **Driver DB:** node-postgres (pg)
* **Logging:** Pino

### 2.3. Stack do Frontend (`apps/web`)

* **Framework:** React 18+
* **Build Tool:** Vite
* **Roteamento:** Tanstack Router
* **Gerenciamento de Estado de Servidor:** Tanstack Query
* **Estilização:** Tailwind CSS
* **Animação:** Framer Motion
* **Internacionalização (i18n):** i18next (preparado para futuras expansões)

### 2.4. Infraestrutura e Serviços de Nuvem

* **Hospedagem Frontend:** Vercel
* **Hospedagem Backend:** Fly.io
* **Banco de Dados:** Supabase (PostgreSQL)
* **Email Transacional:** Resend

---

## SEÇÃO 3: ESTRUTURA DE CÓDIGO E PADRÕES DE DESENVOLVIMENTO

O esqueleto do projeto e as regras de codificação para garantir um código limpo, consistente e manutenível.

### 3.1. Blueprint Detalhado da Estrutura de Pastas

```bash
.
├── apps
│   ├── api         # Backend Fastify
│   │   ├── src
│   │   │   ├── config      # Configuração de ambiente
│   │   │   ├── modules     # Lógica de negócio por módulo (ex: 'contact')
│   │   │   ├── lib         # Clientes de serviços (db, email)
│   │   │   └── server.ts   # Ponto de entrada do servidor Fastify
│   │   ├── Dockerfile
│   │   └── package.json
│   └── web         # Frontend React/Vite
│       ├── src
│       │   ├── assets      # Imagens, fontes, etc.
│       │   ├── components  # Componentes de UI reutilizáveis (botões, cards)
│       │   ├── features    # Componentes de negócio (ex: ContactForm)
│       │   ├── hooks       # Hooks customizados
│       │   ├── lib         # Funções utilitárias, cliente de API
│       │   ├── pages       # Componentes de página/rota
│       │   └── main.tsx    # Ponto de entrada da aplicação React
│       └── package.json
├── packages
│   ├── db          # Esquema Drizzle e configurações de migração
│   │   ├── schema.ts
│   │   └── drizzle.config.ts
│   ├── eslint-config # Configuração compartilhada do ESLint
│   ├── tsconfig      # Configurações compartilhadas do TypeScript
│   └── ui            # (Opcional) Pacote de componentes React compartilhados
├── .eslintrc.js
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json
```

### 3.2. Guia de Estilo e Convenções de Código

* **Regras de Linting (ESLint):**
    1.  `@typescript-eslint/no-explicit-any`: Proíbe o uso do tipo `any`, forçando uma tipagem mais explícita.
    2.  `@typescript-eslint/consistent-type-imports`: Exige o uso de `import type` para importações de tipos.
    3.  `import/order`: Força uma ordenação consistente das importações.
    4.  `no-console`: Proíbe o uso de `console.log` em produção (permite `console.error` e `warn`).
* **Convenções de Nomenclatura:**
    * Componentes React: `PascalCase` (e.g., `PrimaryButton.tsx`).
    * Funções e variáveis: `camelCase` (e.g., `sendContactEmail`).
    * Tipos: `PascalCase` com sufixo `Type` (e.g., `ContactFormType`).
    * Interfaces: `PascalCase` com prefixo `I` (e.g., `IContactService`).
* **Padrão de Módulos:** Uso exclusivo de **ES Modules** (`import`/`export`) em todo o codebase, tanto no frontend quanto no backend.
* **Tratamento de Erros (Backend):**
    * Definiremos classes de erro customizadas que estendem a classe `Error` nativa.
    * Exemplo: `ApiError` terá propriedades como `statusCode` e `message`, que serão interceptadas por um "error handler" global do Fastify para formatar a resposta de erro JSON padronizada.

    ```typescript
    // Exemplo de erro customizado
    export class ApiError extends Error {
      public readonly statusCode: number;

      constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
      }
    }
    ```

---

## SEÇÃO 4: MODELAGEM DE DADOS E CONTRATO DA API

A definição formal dos dados, o contrato que une o frontend e o backend.

### 4.1. Esquema do Banco de Dados Relacional (Drizzle ORM)

O schema será definido no pacote `packages/db/schema.ts`.

```typescript
import { pgTable, serial, text, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';

// Enum para o status do contato
export const contactStatusEnum = pgEnum('contact_status', ['pending', 'read', 'archived']);

// Tabela para armazenar submissões do formulário de contato
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: contactStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 4.2. Estratégia de Migração

As migrações do banco de dados serão gerenciadas pelo `drizzle-kit`.
1.  **Modificar o Schema:** O desenvolvedor altera o arquivo `packages/db/schema.ts`.
2.  **Gerar Migração:** Executa o comando `pnpm --filter db generate`. Isso inspeciona as mudanças no schema e gera um arquivo de migração SQL.
3.  **Aplicar Migração:** As migrações são aplicadas automaticamente no deploy da API ou manualmente durante o desenvolvimento com um script (`pnpm --filter db migrate`).

### 4.3. Contrato da API (Especificação OpenAPI v3.0 em YAML)

```yaml
openapi: 3.0.3
info:
  title: Inovacode API
  version: 1.0.0
  description: API para a plataforma Inovacode, começando com o formulário de contato.
servers:
  - url: [https://api.inovacode.dev/v1](https://api.inovacode.dev/v1)
    description: Production server
  - url: http://localhost:3333/v1
    description: Development server
components:
  schemas:
    ContactSubmission:
      type: object
      properties:
        name:
          type: string
          example: 'John Doe'
        email:
          type: string
          format: email
          example: 'john.doe@example.com'
        message:
          type: string
          example: 'Gostaria de um orçamento.'
      required:
        - name
        - email
        - message
    ErrorResponse:
      type: object
      properties:
        statusCode:
          type: integer
          example: 400
        error:
          type: string
          example: 'Bad Request'
        message:
          type: string
          example: 'email must be a valid email'
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: [] # Aplicado globalmente, mas para o endpoint de contato, será público.

paths:
  /contact:
    post:
      summary: Submit a contact form
      operationId: submitContactForm
      tags:
        - Contact
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ContactSubmission'
      responses:
        '201':
          description: Contact submission received successfully.
        '400':
          description: Bad Request - Invalid input data.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

```

### 4.4. Padrões de Design de API

* **Versionamento:** Todas as rotas da API serão prefixadas com a versão, e.g., `/api/v1/`.
* **Paginação:** Não aplicável para a v1.0. Futuramente, será implementada paginação baseada em `offset` e `limit` para recursos de listagem (`?limit=20&offset=0`).
* **Formato de Erro:** Todas as respostas de erro seguirão o schema `ErrorResponse` definido na especificação OpenAPI.

    ```json
    {
      "statusCode": 400,
      "error": "Bad Request",
      "message": "body/email must be a valid email"
    }
    ```

---

## SEÇÃO 5: ARQUITETURA DE SEGURANÇA

Medidas para proteger a aplicação, os dados e os usuários contra ameaças.

### 5.1. Fluxo de Autenticação

* **v1.0 (Público):** Não há autenticação de usuário. O endpoint `/contact` é público.
* **Proteção do Endpoint Público:** Para prevenir spam e abuso, o endpoint `/contact` será protegido por:
    1.  **Rate Limiting:** Limitando o número de requisições por IP em um determinado período.
    2.  **CAPTCHA:** Integração com um serviço como [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) no frontend para verificar que a submissão é de um humano. O token gerado será enviado com a requisição e validado no backend.

### 5.2. Estratégia de Autorização

* Não aplicável na v1.0.
* **Plano Futuro (RBAC):** Se uma área administrativa for implementada, adotaremos um modelo de Role-Based Access Control (RBAC). Papéis como `admin` e `editor` serão definidos, com permissões associadas a cada rota da API.

### 5.3. Segurança de Dados

* **Criptografia:**
    * **Em Trânsito:** Todo o tráfego será forçado para HTTPS usando TLS 1.3, configurado na Vercel e no Fly.io.
    * **Em Repouso:** Os dados no banco de dados PostgreSQL serão criptografados pelo provedor de nuvem (Supabase).
* **Validação de Input:** **TODA** a entrada de dados na API deve ser rigorosamente validada usando esquemas **Zod**. Esta é nossa principal linha de defesa contra ataques de injeção (SQL Injection, XSS). O ORM Drizzle com queries parametrizadas também previne SQL Injection por padrão.

### 5.4. Gerenciamento de Segredos

* **Produção:** Segredos (chaves de API do Resend, URL do banco de dados) serão gerenciados como variáveis de ambiente injetadas de forma segura pelos painéis da Vercel e do Fly.io.
* **Desenvolvimento:** Os segredos locais serão armazenados em um arquivo `.env` na raiz do projeto. Este arquivo **NUNCA** deve ser commitado. Um arquivo `.env.example` será mantido no repositório para documentar as variáveis necessárias.

---

## SEÇÃO 6: DEVOPS, CI/CD E INFRAESTRUTURA COMO CÓDIGO (IaC)

A automação que transforma código em software funcional em produção de forma confiável.

### 6.1. Pipeline de CI/CD Completo (GitHub Actions)

* `.github/workflows/ci.yml`
    ```yaml
    name: CI Pipeline

    on:
      pull_request:
        branches:
          - main

    jobs:
      lint-and-test:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout code
            uses: actions/checkout@v3

          - name: Setup pnpm
            uses: pnpm/action-setup@v2
            with:
              version: 8

          - name: Setup Node.js
            uses: actions/setup-node@v3
            with:
              node-version: 20
              cache: 'pnpm'

          - name: Install dependencies
            run: pnpm install

          - name: Setup Turborepo Remote Cache
            uses: felixmosh/turborepo-gh-artifacts@v3
            with:
              repo-token: ${{ secrets.GITHUB_TOKEN }}

          - name: Lint
            run: pnpm turbo lint

          - name: Test
            run: pnpm turbo test

          - name: Build
            run: pnpm turbo build
    ```

### 6.2. Estratégia de Deploy

* **Ambientes:**
    * `Preview`: Cada Pull Request para a `main` branch gera um deploy de preview na Vercel para o frontend.
    * `Produção`: Um merge na `main` branch dispara o pipeline de deploy para produção.
* **Estratégia de Branching (Trunk-Based Simplificado):**
    1.  O desenvolvimento ocorre em branches curtas, criadas a partir da `main` (e.g., `feature/add-contact-form`).
    2.  Ao concluir, uma Pull Request é aberta para a `main`.
    3.  A PR deve passar por todas as verificações do CI (lint, tests, build) e ser revisada por pelo menos um outro membro da equipe.
    4.  Após a aprovação e o merge, a Vercel e o Fly.io (via um workflow de CD separado) automaticamente deployam as mudanças para produção.

### 6.3. Infraestrutura como Código (IaC)

* **Abordagem:** Utilizaremos **Terraform** para provisionar e gerenciar recursos de infraestrutura que não são gerenciados diretamente pelas plataformas PaaS (Vercel, Fly.io). O principal recurso será o banco de dados.
* **Exemplo (Provisionando um DB PostgreSQL na AWS RDS com Terraform):**
    ```hcl
    # main.tf

    terraform {
      required_providers {
        aws = {
          source  = "hashicorp/aws"
          version = "~> 5.0"
        }
      }
    }

    provider "aws" {
      region = "us-east-1"
    }

    resource "aws_db_instance" "inovacode_db" {
      allocated_storage    = 10
      engine               = "postgres"
      engine_version       = "15.3"
      instance_class       = "db.t3.micro"
      name                 = "inovacodedb"
      username             = var.db_user
      password             = var.db_password
      skip_final_snapshot  = true
      publicly_accessible = true # NOT recommended for production
    }
    ```

### 6.4. Estratégia de Observabilidade

* **Logging:** O backend usará **Pino** para gerar logs JSON estruturados. Esses logs serão agregados por um serviço como o Logtail (integrado à Fly.io) ou Datadog para análise e alertas.
* **Métricas:**
    * **Frontend:** Utilizaremos **Vercel Analytics** para métricas de performance (Web Vitals) e tráfego.
    * **Backend:** A Fly.io fornece métricas essenciais (CPU, memória, latência). Criaremos um endpoint `/healthz` que a plataforma pode usar para health checks.
* **Tracing:** Para a v1.0, tracing distribuído é um exagero. Se a arquitetura evoluir para múltiplos microsserviços, implementaremos **OpenTelemetry** para rastrear requisições através do sistema.

---

## SEÇÃO 7: GUIA DE ONBOARDING DO DESENVOLVEDOR

Um guia rápido para um novo engenheiro se tornar produtivo no primeiro dia.

### 7.1. Configuração do Ambiente Local (Passo a Passo)

1.  **Clone o repositório:**
    `git clone <URL_DO_REPOSITORIO>`
2.  **Instale as ferramentas necessárias:**
    * Node.js v20+
    * pnpm (`npm install -g pnpm`)
3.  **Instale as dependências:**
    * Na raiz do projeto, execute: `pnpm install`
4.  **Configure as variáveis de ambiente:**
    * Copie o arquivo de exemplo: `cp .env.example .env`
    * Preencha o arquivo `.env` com os valores corretos para o banco de dados local, chaves de API, etc.
5.  **Inicie os serviços de desenvolvimento:**
    * Execute: `pnpm dev`
    * Isso iniciará o frontend (`apps/web`) e o backend (`apps/api`) simultaneamente.
    * O site estará disponível em `http://localhost:5173` (ou outra porta definida pelo Vite).
    * A API estará disponível em `http://localhost:3333`.

### 7.2. Guia do "Primeiro Commit"

1.  **Crie uma nova branch:**
    `git checkout -b feature/meu-primeiro-ticket`
2.  **Faça sua alteração:**
    * Por exemplo, modifique um estilo em `apps/web/src/components/Button.tsx`.
3.  **Verifique seu código:**
    * Execute o linter para garantir a qualidade do código: `pnpm turbo lint`
4.  **Faça o commit:**
    * Use a convenção de Commits Semânticos: `git commit -m "feat(ui): update primary button hover effect"`
5.  **Envie sua branch:**
    `git push origin feature/meu-primeiro-ticket`
6.  **Abra um Pull Request:**
    * Vá para o repositório no GitHub e abra uma PR da sua branch para a `main`. Preencha o template da PR, explicando suas mudanças.

### 7.3. Visão Geral do Fluxo de Trabalho

* **Revisão de Código:** Toda PR precisa de pelo menos uma aprovação de outro engenheiro. O revisor deve focar na correção, manutenibilidade e alinhamento com a arquitetura.
* **Critérios de Merge:** A PR deve ter todas as verificações do CI passando (verde) e as aprovações necessárias.
* **Ciclo de Deploy:** Uma vez que a PR é mergeada na `main`, o deploy para produção é automático. Monitore o status do deploy na Vercel e no Fly.io. Em caso de falha, reverta a PR e investigue.

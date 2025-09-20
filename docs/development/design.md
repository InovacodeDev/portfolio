# Documento de Design Técnico (DDT): Plataforma Inovacode

## 1. Introdução e Filosofia de Design

Este documento é o blueprint técnico para a construção da Plataforma Inovacode. Ele traduz os requisitos em uma arquitetura e um design de implementação concretos. Nossa filosofia de engenharia se baseia em três pilares:

1.  **Type Safety de Ponta a Ponta:** Do banco de dados ao componente React, os tipos são nosso contrato. Usamos TypeScript, Zod e Drizzle para garantir que erros de dados sejam capturados em tempo de compilação, não em produção.
2.  **Developer Experience (DX) Superior:** Um desenvolvedor produtivo é um desenvolvedor feliz. A estrutura de monorepo com Turborepo, configurações compartilhadas e um fluxo de trabalho simplificado são projetados para minimizar o atrito.
3.  **Arquitetura Evolutiva:** Começamos com uma base simples, mas robusta (Fastify, PostgreSQL), que pode escalar sem a necessidade de reescritas massivas.

---

## 2. Arquitetura do Sistema (Modelo C4)

### Nível 1: Diagrama de Contexto

O diagrama abaixo mostra a Plataforma Inovacode em seu ecossistema, interagindo com usuários e sistemas externos.

#```mermaid
graph TD
    subgraph "Plataforma Inovacode"
        A[Frontend App\n(React SPA on Vercel)]
        B[Backend API\n(Fastify on Fly.io)]
        C[Database\n(PostgreSQL on Supabase)]
    end

    User[Visitante / Cliente Potencial\n(Persona)] -- "Usa o site via Browser" --> A
    A -- "Submete formulário de contato\n(JSON/HTTPS)" --> B
    B -- "Persiste dados da submissão\n(SQL)" --> C
    B -- "Envia notificação por email\n(API Call)" --> D[Serviço de Email\n(Resend)]

    style User fill:#08427b,stroke:#000,color:#fff
    style D fill:#999,stroke:#000,color:#fff
#```

### Nível 2: Diagrama de Contêineres

Este diagrama detalha as unidades implantáveis que compõem a "Plataforma Inovacode".

#```mermaid
graph TD
    subgraph "Internet"
        User[Visitante]
    end

    subgraph "Nuvem (Vercel, Fly.io, Supabase)"
        Frontend[Frontend App\n(React / Vite)\n---_Renderiza a UI, animações, captura de formulário._]
        Backend[Backend API\n(Node.js / Fastify)\n---_Valida e processa submissões, envia emails._]
        Database[Database\n(PostgreSQL)\n---_Armazena submissões de contato._]
    end

    User -- "HTTPS" --> Frontend
    Frontend -- "API Call (HTTPS/JSON)\n/api/v1/contact" --> Backend
    Backend -- "TCP/IP" --> Database
    Backend -- "API Call (HTTPS)" --> EmailService[Email Service\n(Resend)]

    style Frontend fill:#52a9d8,stroke:#000,color:#fff
    style Backend fill:#2d3b4e,stroke:#000,color:#fff
    style Database fill:#8d3f8f,stroke:#000,color:#fff
#```

---

## 3. Design Detalhado do Backend

### 3.1. Padrões de API

* **Versionamento:** A API é versionada via URL (`/api/v1`). Isso garante que futuras alterações que quebrem a compatibilidade possam ser introduzidas em uma nova versão (`/v2`) sem impactar os clientes existentes.
* **Formato de Erro JSON:** Respostas de erro são padronizadas para fornecer contexto claro ao cliente.
    * **Exemplo de Erro de Validação (`400 Bad Request`):**
#```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body/email must be a valid email"
}
#```
* **Filosofia:** A API é **stateless**. Cada requisição do cliente deve conter toda a informação necessária para ser processada, sem depender de estado de sessão no servidor.

### 3.2. Fluxo de Autenticação/Autorização (Proposta Futura)

Embora não esteja no escopo do MVP, a arquitetura está preparada para um fluxo de autenticação robusto baseado em JWT.

1.  **Login:** Usuário envia credenciais (`POST /api/v2/auth/login`).
2.  **Emissão de Tokens:** Se as credenciais forem válidas, a API gera um `accessToken` (curta duração, ~15 min) e um `refreshToken` (longa duração, ~7 dias).
3.  **Armazenamento:** Os tokens são enviados ao cliente como cookies `HttpOnly`, `Secure` e `SameSite=Strict`. O `accessToken` pode ser inspecionado pelo cliente, mas o `refreshToken` é inacessível via JavaScript, prevenindo ataques XSS.
4.  **Requisições Autenticadas:** O frontend anexa o `accessToken` a cada requisição no cabeçalho `Authorization: Bearer <token>`.
5.  **Expiração e Refresh:** Se a API retorna `401 Unauthorized`, o frontend faz uma chamada silenciosa para `/api/v2/auth/refresh` (que usa o `refreshToken` do cookie). Se bem-sucedido, novos tokens são emitidos e a requisição original é refeita automaticamente.

### 3.3. Modelo de Dados Completo (Drizzle Schema)

O schema está definido em `packages/db/schema.ts` para ser compartilhado entre a API e as ferramentas de migração.

#```typescript
import { pgTable, serial, text, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';

// Usamos um enum para garantir a integridade dos dados de status.
// Evita strings mágicas e garante que apenas valores permitidos sejam armazenados.
export const contactStatusEnum = pgEnum('contact_status', ['pending', 'read', 'archived']);

// Tabela principal para armazenar as submissões do formulário.
export const contacts = pgTable('contacts', {
  // `serial` é um atalho para um inteiro auto-increment, ideal para chaves primárias.
  id: serial('id').primaryKey(),
  
  // `varchar` com um limite razoável para nomes e emails previne entradas excessivamente longas.
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  
  // `text` é usado para a mensagem pois não tem um limite de tamanho prático, acomodando mensagens longas.
  message: text('message').notNull(),
  
  // O status default 'pending' simplifica a lógica de inserção. O backend não precisa especificar o status inicial.
  status: contactStatusEnum('status').default('pending').notNull(),
  
  // `defaultNow()` automaticamente insere o timestamp atual na criação, essencial para auditoria.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  
  // `updatedAt` é crucial para rastrear quando um registro foi modificado pela última vez.
  // A lógica para auto-atualizar este campo será implementada na camada de serviço.
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
#```

---

## 4. Design Detalhado do Frontend

### 4.1. Arquitetura de Componentes

A estrutura de pastas em `apps/web/src` é projetada para escalabilidade e clareza:

* `features/`: Contém componentes "inteligentes" que encapsulam uma lógica de negócio completa. Ex: `ContactForm/`, que inclui o componente do formulário, o hook de mutação para envio e os tipos de validação.
* `components/`: Contém componentes de UI "burros" e reutilizáveis. Ex: `Button.tsx`, `Card.tsx`, `Input.tsx`. Eles recebem props e não têm conhecimento do estado global da aplicação.
* `lib/`: Funções utilitárias e clientes. Ex: `api.ts` (uma instância do `axios` ou `fetch` pré-configurada com a URL base da API e interceptadores) e `utils.ts`.
* `hooks/`: Hooks React customizados e reutilizáveis que não estão atrelados a uma feature específica. Ex: `useMediaQuery.ts`.

### 4.2. Estratégia de Gerenciamento de Estado (Tanstack Query)

Nós evitamos gerenciadores de estado globais como Redux para o estado do servidor. O Tanstack Query será nossa fonte da verdade para dados que vêm da API.

* **Receita 1: Mutação para o Formulário de Contato**
    Este hook encapsula toda a lógica de submissão do formulário, incluindo estados de carregamento e erro.

#```typescript
// Em: apps/web/src/features/ContactForm/useSubmitContact.ts
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api'; // Cliente de API pré-configurado

// Tipos importados do pacote compartilhado `packages/schemas`
import type { ContactFormType } from 'packages/schemas';

const submitContactForm = async (data: ContactFormType) => {
  const response = await api.post('/contact', data);
  return response.data;
};

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      // Lógica a ser executada em caso de sucesso
      // Ex: exibir uma notificação (toast) de sucesso
      console.log('Formulário enviado com sucesso!');
    },
    onError: (error) => {
      // Lógica para tratar erros da API
      console.error('Falha ao enviar formulário:', error);
    },
  });
};
#```

* **Receita 2: Tratamento de Erros Global**
    No nosso cliente de API (`lib/api.ts`), configuramos um interceptador para tratar erros de forma centralizada.

#```typescript
// Em: apps/web/src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      // Ex: Exibir um toast global com error.response.data.message
    }
    return Promise.reject(error);
  }
);
#```

---

## 5. Diagramas de Sequência (Fluxos Críticos)

### 5.1. Fluxo de Submissão de Contato (Caminho Feliz)

#```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend App (React)
    participant Backend as Backend API (Fastify)
    participant DB as Database (PostgreSQL)
    participant Email as Email Service (Resend)

    User->>+Frontend: Preenche e submete o formulário
    Frontend->>+Backend: POST /api/v1/contact (JSON Payload)
    Backend->>Backend: Valida dados com Zod (sucesso)
    Backend->>+DB: INSERT INTO contacts (...)
    DB-->>-Backend: Confirmação de inserção
    Backend->>+Email: Envia email de notificação
    Email-->>-Backend: Confirmação de envio
    Backend-->>-Frontend: 201 Created
    Frontend->>User: Exibe mensagem de sucesso
#```

### 5.2. Fluxo de Submissão de Contato (Erro de Validação)

#```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend App (React)
    participant Backend as Backend API (Fastify)

    User->>+Frontend: Submete formulário com email inválido
    Frontend->>Frontend: Validação do lado do cliente falha
    Frontend->>User: Exibe mensagem de erro "Email inválido"
    
    Note right of Frontend: Requisição à API é prevenida.

    alt Validação do lado do servidor (defesa em profundidade)
        User->>+Frontend: (bypass da validação do cliente) Submete formulário
        Frontend->>+Backend: POST /api/v1/contact (Payload inválido)
        Backend->>Backend: Valida dados com Zod (falha)
        Backend-->>-Frontend: 400 Bad Request (JSON com detalhes do erro)
        Frontend->>User: Exibe mensagem de erro da API
    end
#```

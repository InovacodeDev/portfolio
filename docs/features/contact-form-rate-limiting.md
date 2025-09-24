# Contact Form Rate Limiting System

## Overview

Sistema de limitação de envio de emails implementado no formulário de contato do portfolio InovaCode. O sistema previne spam e envios duplicados limitando cada email único a 1 envio a cada 30 minutos.

## Core Functionality

### Rate Limiting Logic

-   **Limite**: 1 envio por email a cada 30 minutos
-   **Identificação**: Hash SHA256 dos primeiros 16 caracteres do email (case-insensitive)
-   **Armazenamento**: Cookie HTTP-only no navegador do cliente
-   **Limpeza**: Entradas antigas são automaticamente removidas do cookie

### Cookie Management

-   **Nome**: `contact_rate_limit`
-   **Formato**: JSON com hashes de email e timestamps
-   **Configuração**:
    -   `httpOnly: true` - Não acessível via JavaScript
    -   `secure: true` - Apenas HTTPS em produção
    -   `sameSite: 'strict'` - Proteção CSRF
    -   `maxAge: 30 minutos` - Expiração automática
    -   `path: '/'` - Disponível em todo o site

## Technical Implementation

### Backend (API Route)

**File**: `/app/api/contact/route.ts`

#### Functions Implemented:

1. **`createEmailHash(email: string)`**: Gera hash único do email
2. **`checkRateLimit(request: NextRequest, email: string)`**: Verifica se email está rate-limited
3. **`updateRateLimit(email: string, existingCookieValue?: string)`**: Atualiza dados do rate limit

#### Key Features:

-   Validação de entrada com Zod
-   Hash seguro do email (SHA256)
-   Limpeza automática de dados expirados
-   Response HTTP 429 para rate limiting
-   Mensagens de erro informativas

### Frontend (React Component)

**File**: `/src/components/sections/ContactSection.tsx`

#### Updates Made:

-   Tratamento específico para erro HTTP 429
-   Mensagens de feedback para rate limiting
-   Integração com sistema de validação existente

### Type Definitions

**File**: `/src/types/index.ts`

#### Schema Updates:

```typescript
export const contactResponseSchema = z.object({
    success: z.boolean(),
    id: z.number().optional(),
    message: z.string(),
    timestamp: z.string(),
    rateLimited: z.boolean().optional(), // Nova propriedade
});
```

## Security Considerations

### Privacy Protection

-   Emails são hasheados, nunca armazenados em texto claro
-   Cookie é HTTP-only, inacessível via JavaScript
-   Dados expiram automaticamente em 30 minutos

### Rate Limiting Benefits

-   Prevenção de spam automatizado
-   Proteção contra ataques de força bruta
-   Redução de carga no servidor
-   Economia de recursos de email (Resend API)

### Potential Bypasses

-   Usuários podem limpar cookies manualmente
-   VPN/Proxy podem contornar por IP diferente
-   Múltiplos emails podem ser usados

## Error Handling

### Rate Limited Response

```json
{
    "success": false,
    "message": "Você já enviou uma mensagem recentemente. Tente novamente em X hora(s).",
    "rateLimited": true,
    "timestamp": "2025-09-23T10:30:00.000Z"
}
```

### Error Recovery

-   Cookie parsing errors são ignorados (fallback para allow)
-   Timestamps inválidos são tratados gracefully
-   Limpeza automática de dados corrompidos

## Testing Strategy

### Manual Testing Steps

1. **Primeiro Envio**: Deve funcionar normalmente
2. **Segundo Envio Imediato**: Deve retornar erro 429
3. **Após 30 Minutos**: Deve permitir novo envio
4. **Cookie Clearing**: Deve resetar rate limit

### Edge Cases Covered

-   Cookie não existe (primeiro uso)
-   Cookie corrompido ou inválido
-   Timestamps no futuro
-   Múltiplos emails no mesmo cookie
-   Limpeza de dados expirados

## Configuration

### Rate Limit Settings

```typescript
const RATE_LIMIT_MINUTES = 30;
const RATE_LIMIT_MS = RATE_LIMIT_MINUTES * 60 * 1000;
const COOKIE_NAME = "contact_rate_limit";
```

### Customization Options

-   **RATE_LIMIT_MINUTES**: Alterar período de bloqueio
-   **COOKIE_NAME**: Personalizar nome do cookie
-   Hash length: Modificar substring do hash (atualmente 16 chars)

## Dependencies

### Required Packages

-   `crypto` (Node.js built-in)
-   `next` (NextRequest/NextResponse)
-   `zod` (Schema validation)

### No Additional Dependencies

O sistema utiliza apenas recursos nativos do Node.js e Next.js, sem bibliotecas externas para rate limiting.

## Future Considerations

### Potential Improvements

-   Rate limiting por IP address como backup
-   Integração com Redis para aplicações multi-instância
-   Rate limiting progressivo (tempo aumenta com tentativas)
-   Dashboard administrativo para monitoramento

### Monitoring Suggestions

-   Log de tentativas rate-limited
-   Métricas de uso do formulário
-   Alertas para picos de spam

### Scalability Notes

-   Atual implementação é stateless (baseada em cookies)
-   Para alta escala, considerar Redis ou banco de dados
-   Rate limiting por IP pode ser necessário para APIs públicas

---

**Implementado em**: September 23, 2025  
**Versão**: 1.0  
**Status**: Ativo e funcional

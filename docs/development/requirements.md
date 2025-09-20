# Documento de Requisitos do Sistema (DRS): Plataforma Inovacode

## 1. Introdução

Este documento é a fonte única e definitiva da verdade para o comportamento do sistema da Plataforma Inovacode (MVP - Landing Page & Portfólio). Ele detalha todos os Requisitos Funcionais (RFs) e Não-Funcionais (RNFs) derivados do Guia de Design e do Documento de Design Técnico.

Para garantir clareza inequívoca, testabilidade e rastreabilidade, todos os requisitos funcionais são especificados usando a notação **EARS (Easy Approach to Requirements Syntax)**. Cada requisito é um contrato atômico que o software implementado deve cumprir.

---

## 2. Requisitos Funcionais (RFs)

### Épico: Apresentação Visual e de Conteúdo

Este conjunto de requisitos governa a renderização visual, o layout e a apresentação estática do conteúdo da plataforma.

| ID | Declaração EARS | Justificativa/Fonte | Critérios de Aceitação (Gherkin) |
| :--- | :--- | :--- | :--- |
| **REQ-F-001** | O sistema **deverá** renderizar todas as páginas com um fundo em gradiente, iniciando em `#1E1E1E` no topo e terminando em `#282828` na base. | `blueprint.md`, Seção B | `Dado que` um usuário abre qualquer página do site<br>`Quando` a página é renderizada<br>`Então` o fundo do corpo (`<body>`) da página deve possuir o CSS `background-image: linear-gradient(to bottom, #1E1E1E, #282828);`. |
| **REQ-F-002** | O sistema **deverá** exibir todo o texto principal (parágrafos) com a cor `#F5F5F5`, a fonte `Inter Regular`, tamanho `18px` e `line-height` de `1.6`. | `blueprint.md`, Seção C | `Dado que` um parágrafo de texto é exibido na tela<br>`Quando` ele é inspecionado<br>`Então` suas propriedades de CSS devem corresponder exatamente às especificadas. |
| **REQ-F-003** | O sistema **deverá** estruturar o conteúdo de todas as páginas principais em um grid de 12 colunas para garantir alinhamento consistente. | `blueprint.md`, Seção D | `Dado que` a largura da tela é superior a 1024px<br>`Quando` a estrutura de layout principal é inspecionada<br>`Então` ela deve usar um sistema de grid (ex: `display: grid; grid-template-columns: repeat(12, 1fr);`). |
| **REQ-F-004** | **Enquanto** um usuário rola a página para baixo, **se** um elemento de seção entra no viewport, o sistema **deverá** animá-lo com um efeito de `Fade-in` e `Slide-in-up` com duração de `0.8s`. | `blueprint.md`, Seção F | `Dado que` uma seção está fora do viewport inicial<br>`Quando` o usuário rola a página e a seção se torna visível<br>`Então` a seção deve transicionar de `opacity: 0; transform: translateY(20px);` para `opacity: 1; transform: translateY(0);` ao longo de `0.8s`. |
| **REQ-F-005** | **Quando** um usuário passa o mouse sobre um "Card de Solução", o sistema **deverá** aumentar sua escala para `1.03` e aplicar uma sombra `box-shadow: 0 10px 30px rgba(0,0,0,0.2);` com uma transição de `0.4s`. | `blueprint.md`, Seção E | `Dado que` um Card de Solução é exibido<br>`Quando` o ponteiro do mouse entra na área do card<br>`Então` o CSS `transform: scale(1.03);` e a `box-shadow` especificada devem ser aplicados via uma transição de `0.4s`.<br>`E quando` o ponteiro sai, o card deve retornar ao seu estado original. |
| **REQ-F-006** | **Quando** um usuário passa o mouse sobre um botão de CTA (Call to Action), o sistema **deverá** alterar a cor de fundo para `#B9CDDE` e transladar o botão `2px` para cima. | `blueprint.md`, Seção E | `Dado que` um botão CTA é exibido<br>`Quando` o ponteiro do mouse entra na área do botão<br>`Então` o CSS `background-color: #B9CDDE;` e `transform: translateY(-2px);` devem ser aplicados. |

### Épico: Submissão de Formulário de Contato

Este conjunto de requisitos governa a funcionalidade de captura de contato do cliente.

| ID | Declaração EARS | Justificativa/Fonte | Critérios de Aceitação (Gherkin) |
| :--- | :--- | :--- | :--- |
| **REQ-F-007** | O sistema **deverá** fornecer um formulário de contato contendo campos para "Nome", "Email" e "Mensagem". | `technical_design.md`, Seção 4.3 | `Dado que` o usuário navega para a seção de contato<br>`Quando` a seção é renderizada<br>`Então` devem existir três campos de entrada (`<input>` para nome, `<input type="email">` para email e `<textarea>` para mensagem). |
| **REQ-F-008** | **Quando** o usuário foca em um campo de formulário, o sistema **deverá** exibir uma linha na base do campo com a cor de acento (`#A2B9D1`). | `blueprint.md`, Seção E | `Dado que` o formulário de contato é exibido<br>`Quando` o usuário clica ou navega via teclado para um campo<br>`Então` o estado `:focus` do campo deve aplicar um `border-bottom: 2px solid #A2B9D1;` (ou estilo similar). |
| **REQ-F-009** | **Se** o usuário tentar submeter o formulário com o campo "Email" vazio ou inválido, o sistema **deverá** exibir uma mensagem de erro de validação e **não deverá** enviar a requisição à API. | `technical_design.md`, Seção 4.3 | `Dado que` o usuário está no formulário de contato<br>`Quando` ele preenche o nome, a mensagem, mas deixa o email como "texto-invalido" e clica em "Enviar"<br>`Então` uma mensagem de erro visível (ex: "Por favor, insira um email válido.") deve aparecer perto do campo de email<br>`E` nenhuma chamada de rede para o endpoint `/api/v1/contact` deve ser disparada. |
| **REQ-F-010** | **Quando** um usuário submete o formulário de contato com dados válidos, o sistema **deverá** enviar uma requisição `POST` para o endpoint `/api/v1/contact` com um payload JSON contendo o nome, email e mensagem. | `technical_design.md`, Seção 4.3 | `Dado que` o usuário preencheu o formulário com dados válidos<br>`Quando` ele clica em "Enviar"<br>`Então` uma requisição de rede do tipo `POST` deve ser feita para `/api/v1/contact`<br>`E` o corpo da requisição deve ser um JSON `{"name": "...", "email": "...", "message": "..."}`. |
| **REQ-F-011** | **Após** uma submissão bem-sucedida do formulário (resposta `201 Created` da API), o sistema **deverá** ocultar o formulário e exibir uma mensagem de sucesso para o usuário. | Derivado da UX implícita | `Dado que` o usuário submeteu o formulário e a API retornou um status `201`<br>`Quando` a resposta da API é recebida pelo frontend<br>`Então` o formulário deve ser substituído por um texto como "Obrigado! Sua mensagem foi enviada com sucesso.". |

---

## 3. Requisitos Não-Funcionais (RNFs)

### Seção: Performance

| ID | Requisito | Justificativa/Fonte |
| :--- | :--- | :--- |
| **REQ-NF-001** | O sistema **deverá** atingir uma pontuação de "Good" nas métricas de Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1) em 75% das visitas de usuários. | Prática padrão da indústria para experiência do usuário. |
| **REQ-NF-002** | O tempo de resposta da API para a submissão do formulário de contato (`POST /api/v1/contact`) **deverá** ser menor que 250ms no 95º percentil (p95) sob carga normal. | `technical_design.md`, ADR-002 (Escolha do Fastify por performance). |
| **REQ-NF-003** | O tamanho total dos ativos (JS, CSS, imagens) para o carregamento inicial da landing page **não deverá** exceder 1MB. | Prática padrão para performance em dispositivos móveis. |

### Seção: Segurança

| ID | Requisito | Justificativa/Fonte |
| :--- | :--- | :--- |
| **REQ-NF-004** | O sistema **deverá** forçar todo o tráfego a usar HTTPS (TLS 1.3) para criptografar os dados em trânsito. | `technical_design.md`, Seção 5.3. |
| **REQ-NF-005** | O endpoint da API de contato (`/api/v1/contact`) **deverá** implementar um rate limiting de no máximo 10 requisições por minuto por endereço IP para mitigar ataques de força bruta e spam. | `technical_design.md`, Seção 5.1. |
| **REQ-NF-006** | A aplicação backend **deverá** validar rigorosamente todos os dados de entrada contra um schema definido (Zod) para prevenir ataques de injeção (OWASP A03:2021 - Injection). | `technical_design.md`, Seção 5.3. |
| **REQ-NF-007** | A aplicação frontend **deverá** implementar um sistema de CAPTCHA invisível (ex: Cloudflare Turnstile) para verificar que as submissões do formulário são de humanos. | `technical_design.md`, Seção 5.1. |
| **REQ-NF-008** | O sistema **deverá** incluir cabeçalhos de segurança HTTP, incluindo `Content-Security-Policy` (CSP), `Strict-Transport-Security` (HSTS) e `X-Content-Type-Options`. | Prática padrão da indústria para mitigar XSS e outros ataques. |

### Seção: Acessibilidade (A11y)

| ID | Requisito | Justificativa/Fonte |
| :--- | :--- | :--- |
| **REQ-NF-009** | O sistema **deverá** estar em conformidade com as diretrizes WCAG 2.1 nível AA. | Padrão global de acessibilidade na web. |
| **REQ-NF-010** | Todos os elementos interativos (links, botões, campos de formulário) **deverão** ser navegáveis e operáveis utilizando apenas o teclado, com uma ordem de foco lógica e um indicador de foco visível. | `blueprint.md`, Seção E (Componentes Interativos). |
| **REQ-NF-011** | O sistema **deverá** garantir que a combinação de cores do texto e do fundo (ex: `#F5F5F5` sobre `#2A2A2A`) atinja uma taxa de contraste mínima de 4.5:1. | `blueprint.md`, Seção B (Sistema de Cores). |
| **REQ-NF-012** | O formulário de contato **deverá** usar atributos ARIA apropriados (`aria-labelledby`, `aria-describedby`) para associar labels e mensagens de erro aos seus respectivos campos de entrada. | Prática padrão para acessibilidade de formulários. |

### Seção: Observabilidade

| ID | Requisito | Justificativa/Fonte |
| :--- | :--- | :--- |
| **REQ-NF-013** | O backend **deverá** gerar logs no formato JSON estruturado para todas as requisições recebidas e eventos críticos. | `technical_design.md`, Seção 6.4 (Logging com Pino). |
| **REQ-NF-014** | Cada log JSON **deverá** conter, no mínimo, os seguintes campos: `timestamp`, `level` (ex: info, error), `message`, `requestId`, `sourceIp`, `httpMethod`, e `url`. | Prática padrão para logs estruturados e pesquisáveis. |
| **REQ-NF-015** | O backend **deverá** expor um endpoint de health check (`/healthz`) que retorne um status `200 OK` se a aplicação estiver saudável e conectada ao banco de dados. | `technical_design.md`, Seção 6.4 (Métricas). |

### Seção: Confiabilidade

| ID | Requisito | Justificativa/Fonte |
| :--- | :--- | :--- |
| **REQ-NF-016** | A aplicação **deverá** ter um Service Level Agreement (SLA) de uptime de 99.9%. | Padrão da indústria para aplicações web de produção. |
| **REQ-NF-017** | O banco de dados **deverá** ter uma política de backup diário automatizado com um RPO (Recovery Point Objective) de 24 horas e um RTO (Recovery Time Objective) de 4 horas. | `technical_design.md`, Seção 1.2 (ADR-005, uso de PostgreSQL robusto). |

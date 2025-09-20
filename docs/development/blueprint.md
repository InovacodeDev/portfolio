# Blueprint de Projeto: Landing Page & Portfólio Inovacode

## Parte 1: Guia de Design & UX

Este guia estabelece as regras visuais e interativas para a construção do projeto, garantindo consistência, elegância e uma experiência de usuário de alto padrão.

#### A. Filosofia de Design

* **Clareza Minimalista:** Cada elemento na tela deve ter um propósito. Se não adiciona valor ou clareza, é removido. O espaço em branco (ou escuro) é nossa principal ferramenta.
* **Foco no Conteúdo:** O design serve para elevar a mensagem, não para competir com ela. A tipografia e as imagens são os protagonistas.
* **Movimento com Intenção:** As animações devem guiar o usuário, revelar informações de forma hierárquica e criar uma sensação de fluidez, nunca distrair.

#### B. Sistema de Cores

* **Fundo Principal (Background):** Gradiente sutil.
    * Início: `Dark Grey (#1E1E1E)`
    * Fim: `Slightly Lighter Grey (#282828)`
* **Texto Principal (Text):** Off-White para conforto visual.
    * Cor: `#F5F5F5`
* **Componentes (Cards/Containers):** Tom intermediário para criar profundidade.
    * Cor de Fundo do Card: `#2A2A2A`
* **Acento (Accent):** Cor pastel para todos os elementos clicáveis (botões, links).
    * **Sugestão Primária:** `Pastel Blue (#A2B9D1)`
    * Hover do Acento (mais claro): `#B9CDDE`

#### C. Tipografia (Hierarquia Visual)

* **Fonte:** `Inter` (Google Fonts)
* **H1 (Headline Principal):** `Inter Bold`, 56px
* **H2 (Títulos de Seção):** `Inter Bold`, 40px
* **H3 (Títulos de Card/Item):** `Inter SemiBold`, 24px
* **Corpo de Texto (Body):** `Inter Regular`, 18px (line-height: 1.6)
* **Microcopy/Links:** `Inter Regular`, 16px

#### D. Layout e Espaçamento

* **Grid:** **Grid de 12 colunas** para garantir alinhamento e consistência.
* **Princípio de Espaçamento:** Usar múltiplos de **8px** para todas as margens e paddings (8, 16, 24, 32, 48, 64px...).
* **Respiro:** Seções devem ter um padding vertical generoso (mínimo de 96px).

#### E. Componentes Interativos (UI Kit)

* **Botões (CTAs):**
    * **Estilo:** Fundo sólido na cor de **Acento**, texto em `Dark Grey`.
    * **Padding:** 16px (vertical), 32px (horizontal).
    * **Bordas:** Arredondadas (`border-radius: 8px`).
    * **Hover:** O fundo do botão clareia (cor de Hover do Acento) e o botão sobe 2px (`transform: translateY(-2px)`), com uma sombra sutil.
* **Cards de Solução:**
    * **Estilo:** Fundo na cor de **Componentes**.
    * **Bordas:** Arredondadas (`border-radius: 16px`).
    * **Padding Interno:** 32px.
    * **Hover:** Transição suave (`transition: all 0.4s ease-in-out;`), aumenta de tamanho (`transform: scale(1.03);`), e uma sombra difusa aparece (`box-shadow: 0 10px 30px rgba(0,0,0,0.2);`).
* **Formulários:**
    * **Inputs:** Sem borda, apenas uma linha na base que fica na cor de **Acento** quando o campo está em foco. Fundo transparente.
    * **Labels:** Texto pequeno acima do campo.

#### F. Animação e Microinterações

* **Scroll-Triggered Animations:** Biblioteca recomendada: `GSAP` ou `Framer Motion`.
    * **Efeito:** `Fade-in` + `Slide-in-up`.
    * **Duração:** `0.8s`.
    * **Atraso:** Atraso (`delay`) de `0.2s` entre elementos em sequência.
* **Transição de Página:** `Fade-out` suave da página atual antes do carregamento da nova.

---

## Parte 2: Cronograma de Execução (4 Semanas)

Um plano de ação para guiar o desenvolvimento do projeto da concepção ao lançamento.

#### Semana 1: Fundação e Design de Alta Fidelidade

* **Objetivo:** Transformar o Guia de Design em um mockup visualmente perfeito.
* **Tarefas:**
    * `[ ]` **[Stakeholder]** Escrever a primeira versão dos textos para preencher os placeholders.
    * `[ ]` **[Designer]** Criar o design de alta fidelidade da Landing Page e Portfólio no Figma.
    * `[ ]` **[Designer]** Definir e criar os ícones minimalistas.
    * `[ ]` **[Designer]** Preparar e exportar todos os ativos visuais.
* **Entregável:** **Design completo e aprovado (Desktop e Mobile).**

#### Semana 2: Desenvolvimento Front-End - Estrutura e Estilo (HTML/CSS)

* **Objetivo:** Construir a "casca" do site, garantindo que seja visualmente idêntico ao design e responsivo.
* **Tarefas:**
    * `[ ]` **[Desenvolvedor]** Configurar o ambiente de desenvolvimento.
    * `[ ]` **[Desenvolvedor]** Escrever o HTML semântico para todas as seções.
    * `[ ]` **[Desenvolvedor]** Implementar o CSS seguindo o Guia de Design.
    * `[ ]` **[Desenvolvedor]** Garantir responsividade (Mobile-First).
* **Entregável:** **Versão estática e responsiva do site em um link de preview.**

#### Semana 3: Interatividade e Animações (JavaScript)

* **Objetivo:** Dar vida ao site com animações e interações.
* **Tarefas:**
    * `[ ]` **[Desenvolvedor]** Implementar as animações de scroll-triggered.
    * `[ ]` **[Desenvolvedor]** Implementar os efeitos de hover em cards e botões.
    * `[ ]` **[Desenvolvedor]** Implementar a validação e o envio do formulário de contato.
* **Entregável:** **Site totalmente interativo e funcional.**

#### Semana 4: Otimização Final e Lançamento (Go-Live)

* **Objetivo:** Garantir que o site seja rápido, livre de bugs e pronto para o público.
* **Tarefas:**
    * `[ ]` **[Desenvolvedor]** Otimização de performance (imagens, código).
    * `[ ]` **[Stakeholder & Dev]** Inserir textos finais e revisar todo o conteúdo.
    * `[ ]` **[Desenvolvedor]** Configurar SEO On-Page básico (Títulos, Metas, Alt tags).
    * `[ ]` **[Desenvolvedor]** Realizar testes cross-browser e em múltiplos dispositivos.
    * `[ ]` **[Desenvolvedor]** Fazer o deploy do site.
* **Entregável:** **Landing Page e Portfólio da Inovacode no ar.**

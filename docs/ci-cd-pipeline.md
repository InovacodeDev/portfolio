# CI/CD Pipeline Documentation

Este documento descreve o pipeline de Integração Contínua (CI) configurado para o projeto Inovacode Portfolio.

## 📋 Visão Geral

O pipeline de CI é executado automaticamente em:

- **Pull Requests** para a branch `main`
- **Pushes** diretos para a branch `main`

## 🔧 Configuração do Workflow

### Localização

- Arquivo: `.github/workflows/ci.yml`
- Trigger: PRs e pushes para `main`
- Runner: `ubuntu-latest`
- Timeout: 10 minutos

### Steps do Pipeline

#### 1. **Setup do Ambiente**

- **Checkout**: Busca o código do repositório
- **Node.js 20**: Configuração do ambiente Node.js
- **pnpm v9**: Configuração do gerenciador de pacotes

#### 2. **Cache e Dependências**

- **Cache pnpm**: Cache inteligente das dependências
- **Cache Turborepo**: Cache dos outputs do build system
- **Install**: Instalação das dependências com `--frozen-lockfile`

#### 3. **Verificações de Qualidade**

- **Lint**: Verificação de padrões de código (ESLint)
- **Type Check**: Verificação de tipos TypeScript
- **Test**: Execução dos testes unitários
- **Build**: Build de produção de todos os packages

## ⚡ Otimizações de Performance

### Cache Estratégico

- **pnpm store**: Cache das dependências baseado no `pnpm-lock.yaml`
- **Turborepo**: Cache dos outputs de build para acelerar execuções subsequentes
- **Restore keys**: Fallback para caches parciais

### Concorrência

- **cancel-in-progress**: Cancela execuções anteriores quando nova PR é atualizada
- **Turborepo**: Execução paralela de tasks quando possível

## 🛠️ Comandos Executados

### Lint

```bash
pnpm turbo lint
```

- Executa ESLint em todos os packages
- Configuração compartilhada em `packages/eslint-config`

### Type Check

```bash
pnpm turbo type-check
```

- Executa `tsc --noEmit` em todos os packages
- Configuração compartilhada em `packages/tsconfig`

### Test

```bash
pnpm turbo test
```

- Executa testes unitários (atualmente placeholder)
- Preparado para integração com frameworks de teste

### Build

```bash
pnpm turbo build
```

- **API**: Compila TypeScript para JavaScript
- **Web**: Build de produção com Vite
- **Packages**: Build de dependências compartilhadas

## 📊 Critérios de Sucesso

O pipeline **FALHA** se qualquer uma das verificações falhar:

- ❌ Erros de linting (ESLint)
- ❌ Erros de tipos (TypeScript)
- ❌ Testes falhando
- ❌ Erro no build de produção

O pipeline **PASSA** quando:

- ✅ Código passa no lint
- ✅ Tipos estão corretos
- ✅ Todos os testes passam
- ✅ Build é bem-sucedido

## 🔍 Monitoramento

### Logs e Debugging

- Cada step tem logs detalhados
- Outputs do Turborepo mostram quais packages foram afetados
- Cache hits/misses são reportados

### Tempo de Execução Típico

- **Cold run** (sem cache): ~2-4 minutos
- **Hot run** (com cache): ~30-60 segundos
- **Timeout**: 10 minutos máximo

## 🚀 Próximos Passos

### Melhorias Planejadas

1. **Tests reais**: Substituir placeholders por testes unitários
2. **Security scanning**: Adicionar verificação de vulnerabilidades
3. **Coverage reports**: Relatórios de cobertura de testes
4. **Deploy automático**: CD pipeline para staging/produção

### Configurações Adicionais

- **Branch protection**: Requerer que CI passe antes de merge
- **Status checks**: Configurar GitHub para mostrar status do CI
- **Notifications**: Configurar notificações para falhas

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Turborepo CI/CD](https://turbo.build/repo/docs/ci)
- [pnpm in CI](https://pnpm.io/continuous-integration)

## 🐛 Troubleshooting

### Problemas Comuns

#### "pnpm install failed"

- Verificar se `pnpm-lock.yaml` está commitado
- Verificar compatibilidade de versões no `package.json`

#### "Build failed"

- Verificar erros de TypeScript
- Confirmar que todas as dependências estão instaladas
- Verificar configurações de build (Vite, TSConfig)

#### "Cache issues"

- Limpar cache: Delete e recrie a PR
- Verificar chaves de cache no workflow

#### "Timeout"

- Verificar se há loops infinitos no código
- Otimizar dependências pesadas
- Considerar dividir em jobs menores

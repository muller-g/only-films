# Regras Globais de Desenvolvimento

Estas regras se aplicam a TODOS os projetos, independente da stack.

---

## Princípios Fundamentais

### 1. Clareza acima de esperteza
Código claro é melhor que código inteligente. Um desenvolvedor novo deve entender o que o código faz sem precisar de explicação.

### 2. Explicitidade acima de implicitidade
Prefira código explícito. Configurações mágicas e comportamentos implícitos são fontes de bugs difíceis de rastrear.

### 3. Consistência acima de preferência pessoal
Siga os padrões do projeto, mesmo que prefira uma abordagem diferente. Consistência é mais valiosa que perfeição individual.

---

## Regras de Nomenclatura

```
INGLÊS obrigatório para:
- Nomes de arquivos e pastas
- Nomes de variáveis, funções, classes
- Nomes de endpoints
- Nomes de tabelas e colunas de banco
- Commits e branches
- Chaves de configuração

PORTUGUÊS BRASILEIRO para:
- Documentação e comentários
- Mensagens de erro para o usuário
- Mensagens de log
- Conteúdo de emails e notificações
```

---

## Regras de Código

### Funções e Métodos
```
- Uma responsabilidade por função
- Máximo 30 linhas por função (regra geral)
- Parâmetros: máximo 3-4 (usar objeto se precisar de mais)
- Nomes descritivos que explicam o que faz (verbo + substantivo)
- Evitar booleanos como parâmetro — usar enum ou objeto
```

### Arquivos
```
- Máximo 300 linhas por arquivo (regra geral)
- Um propósito por arquivo
- Nome do arquivo reflete o conteúdo
- Sem arquivos vazios ou placeholders
```

### Variáveis
```
- Nomes que revelam intenção
- Sem abreviações ambíguas (usr → user, cfg → config)
- Constantes em SCREAMING_SNAKE_CASE
- Booleans com prefixo is/has/can/should
- Evitar variáveis de uma letra (exceto loops simples)
```

---

## Regras de Commits

```
Formato: <tipo>(<escopo>): <descrição em inglês>

Tipos:
feat:     nova funcionalidade
fix:      correção de bug
docs:     documentação
style:    formatação (sem mudança de lógica)
refactor: refatoração sem feature ou fix
test:     adição ou correção de testes
chore:    manutenção (deps, build, ci)
perf:     melhoria de performance
security: correção de segurança

Exemplos:
feat(auth): add JWT refresh token rotation
fix(users): prevent N+1 query in UserController
docs(api): update endpoint documentation for /users
test(orders): add integration tests for order creation
```

---

## Regras de Segurança Universal

```
NUNCA:
- Hardcodar credenciais, tokens ou chaves
- Commitar arquivo .env com valores reais
- Usar MD5 ou SHA1 para senhas
- Logar dados sensíveis (senha, token, CPF, cartão)
- Executar input de usuário sem sanitização
- Desabilitar SSL/TLS sem documentação

SEMPRE:
- Variáveis de ambiente para configuração sensível
- HTTPS em produção
- Validar e sanitizar inputs externos
- Princípio do menor privilégio
```

---

## Regras de Versionamento

```
Branches:
main/master    → código de produção (protegida)
develop        → integração de features
feature/*      → novas features
fix/*          → correções
hotfix/*       → correções urgentes em produção
release/*      → preparação de release
docs/*         → apenas documentação

Pull Requests:
- Sempre via PR, nunca direto em main
- Revisão por pelo menos 1 pessoa
- CI deve passar antes do merge
- Branch deve estar atualizada com main/develop
```

---

## Regras de Documentação

```
OBRIGATÓRIO documentar:
- Decisões arquiteturais (ADR)
- Comportamentos não óbvios do código
- Workarounds e suas justificativas
- APIs e contratos
- Variáveis de ambiente necessárias (.env.example)

NÃO documentar:
- O que o código obviamente faz
- Comentários que repetem o nome da variável/função
- TODO sem contexto e sem responsável
```

---

## Regras de Testes

```
- Testes antes de declarar qualquer feature completa
- Happy path + casos de erro cobertos
- Testes independentes (não dependem de outros testes)
- Factories para dados de teste
- Mock apenas para dependências externas (HTTP, email, S3)
```

---

*Versão: 1.0.0 — 2026-05*

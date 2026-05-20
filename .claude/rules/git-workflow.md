# Regras de Git Workflow

Padrões de versionamento, branches, commits e pull requests.

---

## Estratégia de Branches

### GitFlow Simplificado
```
main          → produção (protegida)
develop       → integração (protegida)
feature/*     → novas features
fix/*         → correção de bugs
hotfix/*      → correção urgente em produção
release/*     → preparação de release
docs/*        → apenas documentação
chore/*       → tarefas de manutenção
```

### Nomenclatura de Branches
```
Formato: <tipo>/<escopo>-<descrição-curta>

Exemplos:
feature/auth-jwt-refresh-token
fix/users-n1-query-in-index
hotfix/orders-payment-null-pointer
docs/api-update-users-endpoints
chore/update-dependencies-q1
release/v2.1.0
```

## Commits (Conventional Commits)

### Formato
```
<tipo>(<escopo>): <descrição em inglês>

[corpo opcional — explicar o POR QUÊ]

[rodapé opcional — refs, breaking changes]
```

### Tipos
```
feat:     nova funcionalidade
fix:      correção de bug
docs:     documentação apenas
style:    formatação (sem mudança de lógica)
refactor: refatoração (sem feature e sem fix)
test:     testes (adicionar ou corrigir)
chore:    manutenção, build, dependências
perf:     melhoria de performance
security: correção de segurança
ci:       mudanças em CI/CD
```

### Exemplos Corretos
```
feat(auth): add JWT refresh token rotation
fix(users): prevent N+1 query on user listing
docs(api): document POST /orders endpoint
test(orders): add integration tests for order creation
refactor(products): extract ProductService from controller
chore(deps): update Laravel to 11.x
security(auth): increase bcrypt cost factor to 12
perf(products): add index on category_id column
```

### Regras de Commit
```
- Descrição no imperativo ("add" não "added")
- Máximo 72 caracteres na primeira linha
- Sem ponto final na primeira linha
- Corpo explica o porquê (não o quê)
- Um propósito por commit (atômico)
- Nunca commitar código que não compila
- Nunca commitar .env com valores reais
- Nunca commitar arquivos gerados (dist, vendor, node_modules)
```

## Pull Requests

```
OBRIGATÓRIO:
- Usar template de PR
- Descrição clara do que foi feito e por quê
- Screenshots para mudanças visuais
- Checklist de review preenchido
- CI passando antes de solicitar review
- Branch atualizada com develop/main antes de merge

PROCESSO:
1. Criar PR com template preenchido
2. Auto-review antes de solicitar
3. CI deve passar
4. Mínimo 1 review aprovado
5. Resolver todos os comentários
6. Merge com squash (features) ou rebase (hotfix)
```

## Proteção de Branches

```
main/develop:
- Require pull request reviews (min 1)
- Require status checks (CI)
- No force pushes
- No direct pushes
- Require linear history
```

---

*Versão: 1.0.0 — 2026-05*

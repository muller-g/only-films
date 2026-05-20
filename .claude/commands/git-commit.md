# /git-commit

## Objetivo
Executar o fluxo completo de git add, commit e push seguindo Conventional Commits, com mensagem gerada automaticamente com base nas alterações detectadas.

## Quando Usar
- Ao finalizar uma tarefa e querer commitar as alterações
- Ao querer um commit com mensagem padronizada sem precisar escrever manualmente
- Ao querer garantir que o commit segue as convenções do projeto

## Entrada Esperada
```
/git-commit

Escopo (opcional): [auth | users | orders | api | etc.]
Contexto extra (opcional): [qualquer detalhe relevante que não fica claro pelo diff]
```

Se nenhuma entrada for fornecida, o agente detecta tudo automaticamente pelo diff.

## Processo Detalhado

### Fase 1: Análise das Alterações
1. Executar `git status` para ver arquivos modificados, adicionados e deletados
2. Executar `git diff` para entender o conteúdo das alterações
3. Executar `git diff --cached` para verificar o que já está staged
4. Executar `git log --oneline -5` para entender o padrão de commits do projeto
5. Identificar o escopo das alterações (qual módulo, feature ou área foi afetada)

### Fase 2: Classificação do Tipo de Commit
Com base no diff, determinar o tipo:

```
feat     → nova funcionalidade adicionada
fix      → correção de bug
docs     → alteração apenas em documentação
style    → formatação, espaçamento (sem mudança de lógica)
refactor → refatoração sem feature nova e sem correção de bug
test     → adição ou correção de testes
chore    → manutenção, dependências, configuração, build
perf     → melhoria de performance
security → correção de vulnerabilidade ou melhoria de segurança
ci       → mudanças em pipelines de CI/CD
```

Regras de decisão:
- Se adicionou código novo que entrega funcionalidade → `feat`
- Se corrigiu comportamento errado → `fix`
- Se só mexeu em `.md`, `docs/`, comentários → `docs`
- Se mexeu em `Dockerfile`, `docker-compose`, `.github/`, scripts → `chore`
- Se mexeu em testes → `test`
- Se reorganizou código sem mudar comportamento → `refactor`

### Fase 3: Determinação do Escopo
O escopo é opcional mas recomendado. Deve refletir o módulo ou área afetada:

```
feat(auth): ...
fix(users): ...
chore(docker): ...
docs(readme): ...
refactor(orders): ...
```

Se as alterações afetam múltiplas áreas sem um escopo claro, omitir o escopo:
```
feat: add pagination to all list endpoints
```

### Fase 4: Construção da Mensagem
Formato obrigatório:
```
<tipo>(<escopo>): <descrição no imperativo, em inglês, máx 72 chars>
```

Regras da mensagem:
- Verbo no imperativo ("add", "fix", "update", "remove" — nunca "added", "fixed")
- Sem ponto final
- Máximo 72 caracteres na primeira linha
- Minúsculas após os dois pontos
- Descrever O QUÊ e não O COMO

Exemplos corretos:
```
feat(auth): add JWT refresh token rotation
fix(users): prevent N+1 query on user listing
docs(readme): add guide for existing project setup
chore(docker): update base image to node 22-alpine
refactor(orders): extract order validation to service layer
test(products): add integration tests for create endpoint
security(auth): increase bcrypt cost factor to 12
perf(products): add index on category_id column
```

### Fase 5: Execução do Commit
1. Executar `git add .` para todos os arquivos (ou arquivos específicos se indicado)
2. Exibir a mensagem de commit gerada e aguardar confirmação do usuário
3. Após confirmação, executar o commit
4. Executar `git push` para o remote atual

Se o push falhar por divergência de histórico:
- Informar o usuário
- Sugerir `git pull --rebase` antes de tentar novamente
- Nunca executar `--force` sem confirmação explícita do usuário

## Checklist
- [ ] `git status` analisado
- [ ] `git diff` analisado
- [ ] Tipo de commit determinado corretamente
- [ ] Escopo identificado
- [ ] Mensagem no formato Conventional Commits
- [ ] Mensagem no imperativo e em inglês
- [ ] Máximo 72 caracteres na primeira linha
- [ ] Confirmação do usuário antes do commit
- [ ] Push executado com sucesso

## Formato Esperado da Resposta

```
## Git Commit

### Alterações detectadas:
- [arquivo] — [o que mudou]
- [arquivo] — [o que mudou]

### Commit gerado:
[tipo]([escopo]): [mensagem]

### Comando que será executado:
git add .
git commit -m "[mensagem completa]"
git push origin [branch]

Confirma? (sim/não)
```

Após confirmação:
```
## Commit realizado

**Mensagem:** [mensagem]
**Branch:** [branch]
**Push:** [sucesso | falhou — motivo]
```

## Boas Práticas
- Sempre mostrar a mensagem gerada antes de commitar — o usuário pode querer ajustar
- Nunca misturar alterações de propósitos diferentes em um único commit
- Se houver alterações em múltiplos domínios sem relação, sugerir commits separados
- Não commitar arquivos de ambiente (`.env`) ou gerados (`dist/`, `vendor/`, `node_modules/`)
- Verificar se há arquivos sensíveis no diff antes de commitar

## Erros Comuns
- Usar passado na mensagem ("added feature") ao invés de imperativo ("add feature")
- Colocar ponto final na mensagem
- Escopo muito genérico ("app", "code", "misc") — ser específico
- Commitar arquivos desnecessários por usar `git add .` sem revisar o status
- Fazer push sem verificar se a branch está atualizada

## Validações Finais
- [ ] A mensagem descreve claramente o que foi alterado?
- [ ] O tipo está correto para o conteúdo do commit?
- [ ] Nenhum arquivo sensível ou desnecessário foi incluído?
- [ ] O push foi para a branch correta?

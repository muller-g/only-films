# /review-code

## Objetivo
Realizar uma revisão técnica completa de código, identificando problemas de qualidade, segurança, performance, arquitetura e legibilidade, com feedback acionável.

## Quando Usar
- Antes de mergear um Pull Request
- Ao revisar código de terceiros ou legado
- Ao auditar a qualidade do código de uma feature
- Ao verificar se padrões do projeto estão sendo seguidos

## Entrada Esperada
```
/review-code

Arquivo(s) ou PR: [caminho ou link do PR]
Contexto: [o que o código faz]
Foco: [qualidade geral | segurança | performance | arquitetura]
Stack: [stack do código]
```

## Processo Detalhado

### Fase 1: Entendimento do Contexto
1. Ler o objetivo do código antes de revisar
2. Entender o requisito que o código implementa
3. Identificar a stack e padrões esperados
4. Verificar o escopo do que está sendo revisado

### Fase 2: Revisão de Corretude
1. O código faz o que deveria fazer?
2. Há edge cases não tratados?
3. O comportamento com dados vazios/nulos está correto?
4. Os tipos de dados estão corretos?
5. A lógica condicional está correta?

### Fase 3: Revisão de Segurança
```
Verificar:
[ ] Validação de todos os inputs externos
[ ] Ausência de SQL injection
[ ] Ausência de XSS em outputs HTML
[ ] Autenticação verificada nos endpoints protegidos
[ ] Autorização verificada (usuário tem permissão para o recurso?)
[ ] Dados sensíveis não expostos em logs ou respostas
[ ] Secrets não hardcoded
[ ] Rate limiting em endpoints públicos
[ ] CSRF protection ativa
[ ] File uploads com validação de tipo e tamanho
```

### Fase 4: Revisão de Arquitetura
```
Verificar:
[ ] Responsabilidades bem separadas (controllers, services, repositories)
[ ] Sem lógica de negócio em controllers ou views
[ ] Sem acesso direto ao banco em controllers
[ ] Dependências injetadas, não instanciadas internamente
[ ] Sem dependências circulares
[ ] Módulos coesos com baixo acoplamento
[ ] Interfaces/contratos bem definidos
[ ] Padrões do projeto sendo seguidos
```

### Fase 5: Revisão de Qualidade de Código
```
Verificar:
[ ] Nomes descritivos para variáveis, funções e classes
[ ] Funções com responsabilidade única
[ ] Sem código duplicado (DRY)
[ ] Sem código morto ou comentado
[ ] Comentários explicam o "porquê", não o "o quê"
[ ] Complexidade ciclomática razoável (máximo 10 por função)
[ ] Arquivos não muito grandes (máximo 300 linhas)
[ ] Uso consistente do estilo do projeto
```

### Fase 6: Revisão de Performance
```
Verificar:
[ ] Sem queries N+1
[ ] Índices de banco utilizados adequadamente
[ ] Sem operações custosas em loops
[ ] Cache utilizado onde faz sentido
[ ] Listagens paginadas
[ ] Assets otimizados (imagens, bundles)
[ ] Sem chamadas síncronas desnecessárias onde async resolve
```

### Fase 7: Revisão de Testes
```
Verificar:
[ ] Testes existem para a nova funcionalidade
[ ] Happy path coberto
[ ] Principais casos de erro cobertos
[ ] Testes são independentes entre si
[ ] Sem testes frágeis que dependem de ordem de execução
[ ] Mocks usados apropriadamente
[ ] Testes têm nomes descritivos
```

## Checklist Completo

### Crítico (bloqueia merge)
- [ ] Vulnerabilidade de segurança identificada
- [ ] Bug lógico que causaria comportamento incorreto
- [ ] Dados sensíveis expostos
- [ ] Falta de autenticação/autorização
- [ ] Quebra de API existente sem versionamento

### Importante (deve ser corrigido)
- [ ] Código duplicado significativo
- [ ] Violação grave de arquitetura
- [ ] Query N+1 em endpoint de alta frequência
- [ ] Ausência de tratamento de erro
- [ ] Testes ausentes para lógica crítica

### Sugestão (pode ser melhorado)
- [ ] Nomenclatura pode ser mais clara
- [ ] Função pode ser extraída para melhor leitura
- [ ] Cache pode melhorar performance
- [ ] Comentário seria útil

## Formato Esperado da Resposta

```
## Code Review: [contexto do código]

### Resumo
[Visão geral do código — qualidade geral, pontos positivos]

---

### Crítico 🔴
**[arquivo:linha]** — [descrição do problema]
**Por quê é crítico:** [impacto]
**Sugestão:**
```[linguagem]
// código sugerido
```

---

### Importante 🟡
**[arquivo:linha]** — [descrição]
**Sugestão:** [o que fazer]

---

### Sugestão 🟢
**[arquivo:linha]** — [descrição]
**Sugestão:** [o que poderia ser melhor]

---

### Aprovado ✅
[O que está bom e deve ser mantido]

---

### Resultado: [APROVADO | APROVADO COM RESSALVAS | REPROVADO]
```

## Boas Práticas
- Separar críticos de sugestões — nem tudo merece o mesmo nível de urgência
- Fornecer exemplos concretos de como corrigir
- Reconhecer o que está bom — não apenas criticar
- Revisar com o contexto do requisito — não apenas a forma
- Ser construtivo, não punitivo

## Erros Comuns
- Revisar estilo sem revisar lógica: perde o ponto mais importante
- Dar feedback vago ("isso está errado"): não ajuda a corrigir
- Bloquear merge por questões de preferência pessoal: não é objetivo
- Não categorizar por severidade: tudo parece igualmente urgente

## Validações Finais
- [ ] Todos os críticos foram identificados?
- [ ] O feedback é acionável (sabe-se o que fazer)?
- [ ] Há exemplos de código para correções não óbvias?
- [ ] O resultado final (aprovado/reprovado) está claro?

# /create-adr

## Objetivo
Criar um Architecture Decision Record (ADR) documentando uma decisão arquitetural importante, com contexto, alternativas consideradas, decisão tomada e consequências.

## Quando Usar
- Ao escolher uma tecnologia, framework ou biblioteca
- Ao definir um padrão arquitetural
- Ao tomar uma decisão com trade-offs significativos
- Ao decidir como resolver um problema técnico complexo
- Ao documentar por que uma abordagem foi descartada

## Entrada Esperada
```
/create-adr

Título: [decisão sendo documentada]
Contexto: [problema que levou à decisão]
Decisão: [o que foi decidido]
Alternativas: [outras opções consideradas]
```

## Estrutura do ADR

```markdown
# ADR-[número]: [título da decisão]

**Data:** [YYYY-MM]
**Status:** [proposed | accepted | deprecated | superseded]
**Decisores:** [quem tomou a decisão]

## Contexto

[Descrever o problema ou situação que exigiu uma decisão.
Qual é a força/pressão que leva a tomar alguma decisão aqui?]

## Decisão

[Descrever a decisão tomada em forma ativa:
"Vamos usar X porque..."]

## Justificativa

[Por que esta opção foi escolhida?
Quais são os benefícios específicos?]

## Alternativas Consideradas

### Opção A: [nome] — ❌ Descartada
**Por quê descartada:** [motivo específico]

### Opção B: [nome] — ❌ Descartada
**Por quê descartada:** [motivo específico]

### Opção C: [nome] — ✅ Escolhida
**Por quê escolhida:** [motivo específico]

## Consequências

### Positivas
- [benefício 1]
- [benefício 2]

### Negativas / Trade-offs
- [desvantagem 1]
- [desvantagem 2]

### Neutras
- [implicação que não é nem boa nem ruim]

## Revisão

**Revisar se:** [condição que tornaria esta decisão obsoleta]
**Próximo review:** [data ou evento]
```

## Numbering dos ADRs
- ADR-001: Primeira decisão do projeto
- ADR-002: Segunda decisão
- Sequencial, nunca reutilizar números
- Listar todos em `docs/adr/README.md`

## Exemplos de Títulos de ADR
- "ADR-001: Uso de NestJS como framework backend"
- "ADR-002: PostgreSQL como banco de dados principal"
- "ADR-003: JWT para autenticação sem estado"
- "ADR-004: Adoção de Conventional Commits"
- "ADR-005: Estratégia de cache com Redis"

## Checklist
- [ ] Número sequencial único atribuído
- [ ] Contexto explica o problema que gerou a decisão
- [ ] Alternativas foram genuinamente consideradas
- [ ] Justificativa explica o motivo real da escolha
- [ ] Consequências negativas são honestamente listadas
- [ ] Status correto definido
- [ ] ADR adicionado ao índice em docs/adr/README.md

## Formato Esperado da Resposta
```
## ADR criado: ADR-[número]

**Arquivo:** docs/adr/[número]-[slug].md
**Status:** accepted
**Decisão:** [resumo em uma linha]

### Principais trade-offs:
+ [benefício principal]
- [desvantagem principal]

### Quando revisar:
[condição de revisão]
```

## Boas Práticas
- ADRs são imutáveis — não edite um ADR aceito, crie um novo que o supersede
- Seja honesto sobre desvantagens — ADRs são para ajudar futuros devs, não para justificar decisões
- Documente decisões descartadas — "por que não X" é tão útil quanto "por que Y"
- ADRs devem ser curtos e diretos — não são ensaios acadêmicos

## Validações Finais
- [ ] O ADR tem número sequencial único?
- [ ] O contexto explica o problema sem pressupor conhecimento prévio?
- [ ] As alternativas foram genuinamente consideradas?
- [ ] As consequências negativas estão documentadas?
- [ ] O ADR está listado no índice?

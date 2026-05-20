# /refactor

## Objetivo
Executar uma refatoração estruturada e segura de código existente, melhorando qualidade, legibilidade e manutenibilidade sem alterar o comportamento externo.

## Quando Usar
- Ao identificar código duplicado que pode ser extraído
- Ao simplificar funções ou classes com responsabilidades demais
- Ao aplicar padrões de design a código que cresceu organicamente
- Ao melhorar nomenclatura de variáveis, funções e classes

## Entrada Esperada
```
/refactor

Arquivo/Módulo: [o que precisa ser refatorado]
Motivo: [por que precisa de refatoração]
Tipo: [extract-method | extract-class | rename | simplify | dry | pattern]
Risco: [baixo | médio | alto]
```

## Regras Fundamentais de Refatoração

### Regra 1: Testes antes de refatorar
**Nunca refatore código sem testes.** Se não há testes, crie-os primeiro.
A refatoração só é segura se você pode verificar que o comportamento não mudou.

### Regra 2: Um passo de cada vez
Cada passo de refatoração deve ser pequeno, verificável e revertível.
Não misture múltiplos tipos de refatoração no mesmo commit.

### Regra 3: Não misture com features
Refatoração vai em commit separado de implementação de feature.
Isso facilita o code review e o rollback.

## Processo Detalhado

### Fase 1: Análise
1. Entender completamente o que o código faz
2. Identificar o problema específico (duplicação, complexidade, etc.)
3. Verificar que existem testes cobrindo o comportamento atual
4. Se não há testes, criar antes de refatorar
5. Definir o objetivo claro da refatoração

### Fase 2: Planejamento
1. Definir a sequência de passos pequenos
2. Verificar o impacto em outros módulos
3. Identificar riscos de regressão
4. Comunicar ao time se impacto for amplo

### Fase 3: Execução por Tipo

**Extract Method:**
```
1. Identificar o bloco de código a extrair
2. Criar novo método com nome descritivo
3. Mover o bloco para o novo método
4. Chamar o novo método no lugar original
5. Executar testes
6. Verificar se o método pode ser mais genérico/reutilizável
```

**Extract Class:**
```
1. Identificar grupo de responsabilidades a extrair
2. Criar nova classe com nome descritivo
3. Mover campos e métodos para a nova classe
4. Criar referência à nova classe no original
5. Atualizar todos os chamadores
6. Executar testes
```

**DRY (Don't Repeat Yourself):**
```
1. Identificar os 2+ locais com código duplicado
2. Analisar diferenças entre as duplicações
3. Criar função/método/trait parametrizado
4. Substituir cada duplicação pela chamada ao novo código
5. Executar testes em todos os locais afetados
```

**Simplificação de Condicionais:**
```javascript
// Antes
if (user.role === 'admin' || user.role === 'manager' || user.role === 'supervisor') {
    // ...
}

// Depois
const canManageUsers = (user) => ['admin', 'manager', 'supervisor'].includes(user.role);
if (canManageUsers(user)) {
    // ...
}
```

### Fase 4: Validação
1. Executar todos os testes existentes
2. Verificar que o comportamento externo não mudou
3. Verificar que não há regressão em módulos relacionados
4. Fazer code review antes de mergear

## Checklist
- [ ] Testes existem e passam ANTES da refatoração
- [ ] Objetivo da refatoração está claro
- [ ] Refatoração é em passos pequenos e verificáveis
- [ ] Não há mudança de comportamento (apenas de estrutura)
- [ ] Não há features novas sendo adicionadas junto
- [ ] Todos os testes passam APÓS a refatoração
- [ ] Code review feito em commit separado
- [ ] Sem impacto em módulos externos não mapeados

## Formato Esperado da Resposta

```
## Refatoração: [descrição]

**Tipo:** [extract-method | extract-class | dry | simplify]
**Motivo:** [por que era necessário]
**Risco:** [baixo | médio | alto]

### Antes:
```código original com problema```

### Depois:
```código refatorado```

### O que mudou:
- [mudança 1 — antes → depois]
- [mudança 2 — antes → depois]

### Comportamento: INALTERADO
### Testes: PASSANDO (X testes)

### Próximos passos de refatoração (se houver):
1. [próximo passo]
```

## Boas Práticas
- Refatorar é mudar a estrutura sem mudar o comportamento
- Pequenos passos são mais seguros que grandes redesigns
- Documentar o MOTIVO da refatoração no commit ou ADR
- Preferir refatorações com ROI claro (facilita manutenção futura)

## Erros Comuns
- Refatorar e adicionar feature no mesmo commit
- Refatorar sem testes: não sabe se quebrou algo
- Refatoração prematura: melhorar código que ninguém vai tocar
- Redesign completo chamado de "refatoração": é uma reescrita

## Validações Finais
- [ ] O comportamento externo é idêntico ao antes?
- [ ] Todos os testes passam?
- [ ] O código ficou mais legível ou mais simples?
- [ ] O commit message explica o motivo da refatoração?

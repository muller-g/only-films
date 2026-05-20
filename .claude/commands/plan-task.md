# /plan-task

## Objetivo
Criar um plano de execução detalhado para qualquer tarefa antes de iniciar a implementação, garantindo clareza, alinhamento e identificação antecipada de riscos.

## Quando Usar
- Antes de qualquer tarefa com mais de 3 passos
- Ao receber um requisito ambíguo
- Ao planejar uma tarefa com múltiplos arquivos afetados
- Ao estimar esforço de uma feature ou refatoração

## Entrada Esperada
```
/plan-task

Tarefa: [descrição da tarefa]
Contexto: [informação adicional relevante]
Prazo: [se houver restrição de tempo]
Restrições: [limitações técnicas ou de negócio]
```

## Processo Detalhado

### Fase 1: Entendimento
1. Reformular a tarefa com próprias palavras
2. Identificar perguntas em aberto
3. Fazer perguntas de clarificação se necessário
4. Confirmar escopo — o que está e o que não está incluso

### Fase 2: Mapeamento de Impacto
1. Identificar todos os arquivos que serão criados/alterados
2. Identificar funcionalidades que podem ser afetadas
3. Identificar dependências externas
4. Identificar riscos

### Fase 3: Decomposição em Passos
1. Dividir em passos atômicos e verificáveis
2. Ordenar por dependência técnica
3. Identificar pontos de checkpoint (onde validar antes de continuar)
4. Estimar esforço por passo

### Fase 4: Definição de Critérios de Conclusão
1. Como saberemos que cada passo está concluído?
2. Como saberemos que a tarefa inteira está concluída?
3. Quais são os critérios de aceite?

## Formato do Plano

```markdown
## Plano: [título da tarefa]

**Tipo:** [feature | bug | refactor | infra | docs]
**Estimativa:** [X horas]
**Risco:** [baixo | médio | alto]

### Entendimento
[Reformulação da tarefa com próprias palavras]

### Perguntas em aberto
- [pergunta 1] → [aguarda resposta | assumindo X]
- [pergunta 2] → [aguarda resposta | assumindo Y]

### Impacto
**Arquivos a criar:**
- [arquivo 1] — [propósito]

**Arquivos a alterar:**
- [arquivo 2] — [o que muda]

**Funcionalidades afetadas:**
- [funcionalidade X] — [como será afetada]

### Passos de execução

**[1] [Nome do passo]** (~X min)
- [sub-passo a]
- [sub-passo b]
- ✅ Verificação: [como validar que este passo está concluído]

**[2] [Nome do passo]** (~X min)
- ...
- ✅ Verificação: [...]

### Riscos identificados
| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| [risco] | alta/média/baixa | alto/médio/baixo | [como mitigar] |

### Critérios de aceite
- [ ] [critério 1]
- [ ] [critério 2]
- [ ] [critério 3]

### Aprovação
Iniciar implementação? [aguardando confirmação]
```

## Boas Práticas
- Plano deve ser criado ANTES de qualquer implementação
- Plano é um acordo — mudanças devem ser comunicadas
- Seja honesto sobre estimativas — buffers são aceitáveis
- Identifique dependências de outras pessoas ou sistemas

## Validações Finais
- [ ] O escopo está claramente definido?
- [ ] Os critérios de aceite são verificáveis?
- [ ] Os riscos foram identificados?
- [ ] O plano foi aprovado antes de iniciar?

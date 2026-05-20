# SKILL: ai-agent-orchestration

**Name:** ai-agent-orchestration
**Description:** Orquestração de agentes de IA para tarefas de desenvolvimento, incluindo delegação de subtarefas, coordenação de múltiplos agentes, verificação de resultados e integração com fluxos de trabalho de engenharia.
**Quando usar:** Ao coordenar múltiplos agentes de IA em um projeto, ao definir como agentes devem colaborar, ou ao otimizar o uso de IA no fluxo de desenvolvimento.

---

## Modelo de Operação

### Hierarquia de Agentes
```
Agente Orquestrador (Arquiteto)
  ├── Agente de Análise (lê, entende, mapeia)
  ├── Agente de Implementação (cria, modifica código)
  ├── Agente de Revisão (verifica qualidade e segurança)
  └── Agente de Documentação (atualiza docs)
```

### Protocolo de Handoff entre Agentes
Cada agente deve entregar ao próximo:
```markdown
## Contexto para o próximo agente

**O que foi feito:** [descrição]
**Arquivos alterados:** [lista]
**Decisões tomadas:** [lista com justificativas]
**Pendências:** [o que o próximo agente deve fazer]
**Riscos identificados:** [alertas]
**Não alterar:** [arquivos críticos identificados]
```

### Divisão de Responsabilidades

| Agente | Responsabilidade | Não fazer |
|---|---|---|
| Análise | Ler, mapear, documentar | Alterar código |
| Implementação | Criar/modificar código | Tomar decisões arquiteturais sozinho |
| Revisão | Verificar qualidade e segurança | Implementar |
| Documentação | Atualizar docs e ADRs | Implementar |

### Validação de Resultado de Agente
Antes de aceitar output de um agente:
```
[ ] O agente entendeu o contexto correto?
[ ] O output está no formato esperado?
[ ] O código compila/funciona?
[ ] Os testes passam?
[ ] Não há alterações fora do escopo?
[ ] Documentação atualizada?
```

---

## Padrões para Prompts Eficazes

### Prompt de Análise
```
Analise o arquivo [X] e responda:
1. O que este código faz?
2. Quais são suas dependências?
3. Quais partes são críticas?
4. O que pode ser melhorado?

Não altere nenhum arquivo. Apenas analise e documente.
```

### Prompt de Implementação
```
Contexto: [resumo do projeto e stack]
Tarefa: [o que precisa ser feito]
Arquivos relevantes: [lista]
Padrões obrigatórios: [referência às rules]
Restrições: [o que não pode ser feito]

Antes de implementar, apresente um plano de 3-5 passos.
```

### Prompt de Revisão
```
Revise o código em [arquivo] com foco em [segurança | qualidade | performance].
Classifique os problemas por: CRÍTICO | IMPORTANTE | SUGESTÃO
Para cada problema, forneça um exemplo de como corrigir.
```

---

## Checklist de Qualidade na Orquestração
```
[ ] Contexto completo fornecido a cada agente
[ ] Escopo bem delimitado (o que fazer e o que não fazer)
[ ] Resultado verificado antes de prosseguir
[ ] Conflitos entre agentes resolvidos explicitamente
[ ] Decisões importantes documentadas
```

---

## Erros Comuns
- Dar contexto insuficiente ao agente
- Não verificar o resultado antes de aceitar
- Escopo indefinido (agente faz mais do que deveria)
- Não documentar decisões do agente para o próximo

---

## Validações Finais
- [ ] Cada agente recebeu contexto suficiente?
- [ ] Resultados foram verificados?
- [ ] Handoffs documentados?
- [ ] ADRs criados para decisões do agente?

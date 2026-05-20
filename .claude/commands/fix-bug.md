# /fix-bug

## Objetivo
Corrigir um bug de forma estruturada, garantindo que a causa raiz seja identificada, a correção seja segura e um teste seja criado para prevenir regressão.

## Quando Usar
- Ao receber um reporte de comportamento inesperado
- Ao identificar um erro em produção, staging ou desenvolvimento
- Ao corrigir um comportamento que diverge do requisito

## Entrada Esperada
```
/fix-bug

Descrição do bug: [o que está acontecendo]
Comportamento esperado: [o que deveria acontecer]
Comportamento atual: [o que está acontecendo de fato]
Ambiente: [produção | staging | desenvolvimento]
Stack trace / Logs: [se disponível]
Como reproduzir: [passos para reproduzir]
```

## Processo Detalhado

### Fase 1: Reprodução do Bug
1. Tentar reproduzir o bug localmente com os passos fornecidos
2. Confirmar que o bug existe na versão atual do código
3. Identificar se o bug é consistente ou intermitente
4. Coletar logs e stack traces relevantes
5. Verificar em quais ambientes o bug ocorre

### Fase 2: Análise da Causa Raiz
1. Ler os logs e stack traces cuidadosamente
2. Identificar o arquivo e linha onde o erro ocorre
3. Rastrear o fluxo de execução que leva ao erro
4. Identificar a causa raiz (não apenas o sintoma)
5. Verificar se o bug existe em outros lugares similares no código

Perguntas para análise:
```
- O bug foi introduzido por um commit recente? (git blame, git log)
- O bug está em um código de terceiros ou nosso?
- O bug ocorre em todos os cenários ou apenas em casos específicos?
- Existem condições de corrida envolvidas?
- O bug está relacionado a dados específicos ou ao código em si?
```

### Fase 3: Criar Teste que Falha
Antes de corrigir, criar um teste que:
1. Reproduz o bug
2. Falha com o código atual
3. Passará após a correção

Isso garante que o bug não vai regredir.

### Fase 4: Implementar a Correção
1. Corrigir a causa raiz, não o sintoma
2. A correção deve ser mínima e focada
3. Não misturar refatoração com a correção
4. Verificar se a correção não quebra outros comportamentos
5. Executar todos os testes para garantir ausência de regressão

### Fase 5: Validação
1. Verificar que o teste criado agora passa
2. Verificar que os testes existentes continuam passando
3. Testar manualmente o cenário do bug
4. Testar casos adjacentes que poderiam ser afetados
5. Verificar em staging antes de produção

### Fase 6: Documentação
1. Documentar o bug e a correção no commit message
2. Se o bug revelar um problema de arquitetura, criar ADR
3. Atualizar documentação se o comportamento descrito estava incorreto

## Checklist
- [ ] Bug reproduzido localmente
- [ ] Causa raiz identificada (não apenas sintoma)
- [ ] Teste criado que falha antes da correção
- [ ] Correção implementada focada na causa raiz
- [ ] Teste criado agora passa
- [ ] Todos os outros testes continuam passando
- [ ] Correção testada manualmente
- [ ] Casos adjacentes verificados
- [ ] Commit com mensagem descritiva do bug e da correção
- [ ] Deploy em staging antes de produção (se bug em produção)

## Formato Esperado da Resposta

```
## Bug Fix: [título descritivo]

**Ambiente reportado:** [produção | staging | dev]
**Causa raiz:** [descrição técnica da causa]

### Análise:
[Explicação de como chegou à causa raiz]

### Correção:
[Descrição do que foi alterado e por quê]

### Arquivos alterados:
- [arquivo] — [o que foi alterado]

### Teste criado:
- [describe/it que cobre o bug]

### Como verificar:
1. [passo 1]
2. [passo 2]

### Branch sugerida: fix/[scope]-[description]

### Riscos de regressão:
- [funcionalidade X pode ser afetada — verificar]
```

## Boas Práticas
- Nunca corrigir sem entender a causa raiz — o bug vai voltar
- Criar o teste antes da correção (TDD para bugs)
- Manter a correção focada — não aproveitar para refatorar
- Verificar se o bug existe em locais similares no código
- Em produção, priorizar estabilidade — correção simples e segura

## Erros Comuns
- Corrigir o sintoma sem entender a causa: o bug retorna em outra forma
- Misturar refatoração na correção: dificulta o code review e aumenta risco
- Não criar teste: sem garantia de que não vai regredir
- Fazer deploy direto em produção sem staging: risco alto
- Não comunicar o impacto: outros devs podem ser afetados

## Validações Finais
- [ ] O bug original está corrigido?
- [ ] Novos bugs foram introduzidos?
- [ ] O teste garante que o bug não voltará?
- [ ] A correção foi testada no ambiente correto?
- [ ] O commit message descreve claramente o que foi corrigido?

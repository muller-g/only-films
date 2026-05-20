# SKILL: legacy-code-analysis

**Name:** legacy-code-analysis
**Description:** Análise estruturada de código legado para entender comportamentos, documentar regras de negócio implícitas, identificar riscos e criar planos de modernização seguros.
**Quando usar:** Ao herdar código sem documentação, antes de refatorar código legado, ou ao investigar um sistema existente.

---

## Processo de Análise

### Fase 1: Arqueologia (sem alterar nada)
1. Listar estrutura de arquivos
2. Identificar ponto de entrada
3. Mapear fluxo de execução principal
4. Identificar dependências e integrações
5. Verificar histórico de git

### Fase 2: Mapeamento de Comportamento
Criar testes de caracterização:
```php
// Testes que documentam o comportamento atual (não o correto)
public function test_current_behavior_of_calculate_discount(): void
{
    // Não estou testando se está certo, estou documentando o que faz
    $result = calculateDiscount(100, 'premium');
    $this->assertEquals(85, $result); // 15% de desconto para premium
}
```

### Fase 3: Identificação de Riscos
```
CRÍTICO:
- Credenciais hardcoded
- SQL injection possível
- Sem autenticação em áreas sensíveis
- Lógica de negócio crítica sem testes

ALTO:
- Dependências com CVEs
- God classes/functions (1000+ linhas)
- Lógica duplicada em múltiplos lugares
- Código sem tratamento de erro

MÉDIO:
- TODO/FIXME não resolvidos
- Código comentado
- Nomenclatura confusa
- Ausência de logs
```

### Fase 4: Documentação das Regras Implícitas
```markdown
## Regras de Negócio Identificadas no Código

### Desconto de Clientes
- Cliente premium: 15% de desconto
- Cliente gold: 20% de desconto
- Desconto máximo: 30%
- Desconto não se aplica a produtos em promoção
**Fonte:** OrderService.php:145-167
```

### Fase 5: Plano de Modernização
```
Prioridade 1 — Bloqueante (fazer agora):
- Corrigir vulnerabilidades críticas

Prioridade 2 — Próximo sprint:
- Criar testes para código crítico sem cobertura

Prioridade 3 — Backlog técnico:
- Extrair classes god
- Modernizar stack

Estratégia: Strangler Fig Pattern
- Construir novo módulo ao lado do legado
- Migrar rotas gradualmente
- Remover código legado após validação
```

---

## Checklist de Análise
```
[ ] Estrutura de arquivos mapeada
[ ] Dependências identificadas
[ ] Regras de negócio documentadas
[ ] Riscos identificados e priorizados
[ ] Testes de caracterização criados para código crítico
[ ] Plano de modernização definido
[ ] ADR criado se decisão arquitetural necessária
```

---

## Erros Comuns
- Alterar código durante a análise
- Assumir que o código está "errado" — pode ter motivo histórico
- Refatorar sem testes de caracterização primeiro
- Modernizar tudo de uma vez (big bang rewrite)

---

## Validações Finais
- [ ] Comportamento atual documentado antes de qualquer mudança?
- [ ] Riscos priorizados por impacto no negócio?
- [ ] Plano de modernização incremental?
- [ ] Testes de caracterização criados?

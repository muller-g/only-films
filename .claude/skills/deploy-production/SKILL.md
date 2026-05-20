# SKILL: deploy-production

**Name:** deploy-production
**Description:** Estratégia e execução de deploy em produção com zero downtime, incluindo CI/CD, rollback, monitoramento pós-deploy e comunicação com o time.
**Quando usar:** Ao planejar ou executar qualquer deploy em produção ou staging.

---

## Regras Invioláveis
```
1. NUNCA deploy sem backup do banco de dados
2. NUNCA deploy sem teste em staging primeiro
3. NUNCA deploy sem plano de rollback definido
4. SEMPRE comunicar o time antes de deploys de risco
5. SEMPRE monitorar ativamente nas primeiras horas
```

## Estratégias de Deploy

### Blue-Green Deploy
```
Ambiente Blue (atual) → Ambiente Green (novo)
- Provisionar novo ambiente idêntico
- Fazer deploy no Green
- Testar no Green
- Fazer switch do load balancer Blue → Green
- Manter Blue disponível para rollback
- Remover Blue após 24h de estabilidade
```

### Rolling Deploy (containers)
```yaml
# docker-compose com update gradual
services:
  app:
    deploy:
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      rollback_config:
        parallelism: 1
```

### Deploy com Migration Segura
```
Passo 1: Deploy do código compatível com schema ATUAL e NOVO
Passo 2: Executar migration (adicionar coluna nullable)
Passo 3: Deploy do código que usa a nova coluna
Passo 4: Migration de dados (preencher nova coluna)
Passo 5: Tornar coluna NOT NULL (se necessário)

Princípio: código sempre compatível com ambos os schemas durante transição
```

## Checklist de Deploy
```
PRÉ-DEPLOY:
[ ] Testes passando no CI
[ ] Code review aprovado
[ ] Deploy em staging realizado e testado
[ ] Backup do banco realizado
[ ] Migrations revisadas e testadas em staging
[ ] Rollback planejado e documentado
[ ] Time notificado

DEPLOY:
[ ] Deploy executado no horário planejado
[ ] Migrations executadas
[ ] Cache invalidado
[ ] Workers reiniciados

PÓS-DEPLOY (primeiros 30 min):
[ ] Health check responde
[ ] Taxa de erro normal
[ ] Tempo de resposta normal
[ ] Funcionalidade principal testada manualmente
```

---

## Erros Comuns
- Deploy sem staging
- Migration sem rollback testado
- Sem monitoramento pós-deploy
- Deploy em horário de pico

---

## Validações Finais
- [ ] Checklist completo executado?
- [ ] Monitoramento ativo?
- [ ] Rollback testado e disponível?
- [ ] Time informado sobre o resultado?

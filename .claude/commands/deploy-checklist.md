# /deploy-checklist

## Objetivo
Executar o checklist completo de deploy em produção, garantindo que todas as verificações de segurança, qualidade e reversibilidade sejam feitas antes e depois do deploy.

## Quando Usar
- Antes de qualquer deploy em produção
- Antes de deploy em staging
- Ao planejar uma janela de manutenção
- Ao coordenar um deploy de alta criticidade

## Entrada Esperada
```
/deploy-checklist

Versão: [número da versão ou tag]
Ambiente: [produção | staging | homologação]
Tipo: [hotfix | release | feature | migration]
Mudanças: [resumo do que será deployado]
Janela: [horário planejado]
Responsável: [nome do responsável]
```

## Checklist Completo

### PRÉ-DEPLOY — 24h antes

#### Código e Qualidade
- [ ] Todos os testes passando no CI
- [ ] Code review aprovado por ao menos um dev
- [ ] Branch mergeada e sem conflitos
- [ ] Sem alertas críticos no lint
- [ ] Type check passando (TypeScript)
- [ ] Build de produção testado localmente

#### Banco de Dados
- [ ] Migrations revisadas e testadas em staging
- [ ] Rollback das migrations testado
- [ ] Migrations são compatíveis com a versão atual do código (forward compatibility)
- [ ] Backup do banco de dados realizado
- [ ] Tamanho das migrations estimado (pode travar tabelas grandes?)

#### Segurança
- [ ] Audit de dependências executado (`npm audit` / `composer audit`)
- [ ] Sem secrets em código ou variáveis comitadas
- [ ] .env de produção revisado
- [ ] Certificados SSL válidos

#### Staging
- [ ] Deploy realizado em staging
- [ ] Testes manuais em staging concluídos
- [ ] Smoke tests passando em staging
- [ ] Performance não degradada em staging

#### Comunicação
- [ ] Time notificado sobre o deploy
- [ ] Stakeholders informados sobre janela de manutenção (se necessário)
- [ ] Plano de rollback documentado e compartilhado

---

### PRÉ-DEPLOY — 1h antes

#### Ambiente
- [ ] Acesso à infraestrutura confirmado
- [ ] Monitoramento ativo e alertas configurados
- [ ] Ferramentas de log abertas (Sentry, CloudWatch, etc.)
- [ ] Contato do time de plantão disponível

#### Rollback
- [ ] Versão anterior identificada e acessível
- [ ] Script de rollback pronto ou procedimento documentado
- [ ] Tempo estimado de rollback definido

---

### DURANTE O DEPLOY

#### Execução
- [ ] Deploy iniciado no horário planejado
- [ ] Logs sendo monitorados em tempo real
- [ ] Migrations executadas (se houver)
- [ ] Cache invalidado (se necessário)
- [ ] Workers/queues reiniciados (se necessário)

#### Verificação Imediata (primeiros 5 minutos)
- [ ] Aplicação respondendo (health check endpoint)
- [ ] Sem erros 500 no log
- [ ] Login funcionando
- [ ] Funcionalidade principal testada

---

### PÓS-DEPLOY — 30 minutos

#### Monitoramento
- [ ] Taxa de erro normal (comparar com baseline)
- [ ] Tempo de resposta normal
- [ ] Uso de CPU/memória normal
- [ ] Filas processando normalmente
- [ ] Nenhum alerta disparado

#### Smoke Tests
- [ ] Fluxo principal da aplicação funciona
- [ ] Autenticação funciona
- [ ] Funcionalidade deployada funciona
- [ ] Integrações externas funcionam

---

### PÓS-DEPLOY — 24h

#### Estabilização
- [ ] Métricas estáveis após 24h
- [ ] Nenhum incidente relacionado ao deploy
- [ ] Feedback dos usuários coletado (se aplicável)
- [ ] Documentação atualizada

#### Cleanup
- [ ] Branch de deploy deletada (se não mais necessária)
- [ ] Imagens Docker antigas limpas
- [ ] Tags de versão criadas no repositório
- [ ] Release notes publicadas

---

## Plano de Rollback

### Gatilhos para Rollback
- Taxa de erro acima de X% (definir threshold)
- Tempo de resposta acima de Xms (definir threshold)
- Funcionalidade crítica quebrada
- Perda de dados identificada
- Incidente de segurança detectado

### Procedimento de Rollback

**Deploy simples (sem migration):**
```bash
# Reverter para versão anterior
git checkout v[versão-anterior]
# ou
docker pull image:versão-anterior
docker-compose up -d
```

**Deploy com migration:**
```bash
# 1. Reverter código
git checkout v[versão-anterior]

# 2. Reverter migration
php artisan migrate:rollback  # Laravel
npm run typeorm migration:revert  # TypeORM

# 3. Verificar integridade do banco
# 4. Reiniciar serviços
```

**Em caso de dúvida:** comunicar o time imediatamente antes de reverter.

---

## Formato Esperado da Resposta

```
## Deploy Checklist — v[versão] — [ambiente]

**Responsável:** [nome]
**Data:** [data]
**Janela:** [horário]
**Status:** [PRONTO | BLOQUEADO | EM ANDAMENTO | CONCLUÍDO]

### Itens pendentes antes de iniciar:
- [ ] [item bloqueante]

### Resumo das mudanças:
[o que será deployado]

### Risco estimado: [BAIXO | MÉDIO | ALTO]
[justificativa do risco]

### Plano de rollback:
[procedimento específico para este deploy]

### Contatos de emergência:
- Responsável: [contato]
- Infraestrutura: [contato]
```

## Boas Práticas
- Deploy em produção deve ter staging como prerequisito
- Sempre ter rollback definido antes de deployar
- Monitorar ativamente nas primeiras horas pós-deploy
- Preferir deploys em horários de baixo tráfego
- Comunicar o time com antecedência

## Erros Comuns
- Deploy sem backup do banco: sem caminho de volta em caso de migration errada
- Deploy sem teste em staging: descobrir o bug em produção
- Sem monitoramento ativo: problema detectado pelos usuários, não pelo time
- Rollback não testado: descobrir que não funciona na hora da crise

## Validações Finais
- [ ] Todos os items críticos do checklist estão marcados?
- [ ] O plano de rollback está documentado e testado?
- [ ] O time está disponível durante o deploy?
- [ ] O monitoramento está ativo?

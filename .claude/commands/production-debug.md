# /production-debug

## Objetivo
Executar debugging estruturado em problemas de produção de forma segura, sistemática e sem causar impacto adicional no sistema.

## Quando Usar
- Ao investigar erro reportado em produção
- Ao analisar degradação de performance
- Ao investigar comportamento inesperado em produção
- Ao conduzir post-mortem de incidente

## REGRAS DE OURO DO DEBUG EM PRODUÇÃO
```
1. NUNCA execute código não testado diretamente em produção
2. NUNCA altere banco de dados sem backup prévio
3. NUNCA ative debug mode em produção (expõe dados sensíveis)
4. SEMPRE comunique o time antes de ações que possam impactar usuários
5. SEMPRE documente o que foi feito durante o debug
6. Prefira leitura a escrita — entenda antes de modificar
7. Rollback deve estar planejado antes de qualquer mudança
```

## Processo Detalhado

### Fase 1: Triagem (5 minutos)
1. Qual é o impacto atual? (X usuários afetados, X% de erros)
2. Quando começou? (correlacionar com deploys recentes)
3. É um erro novo ou intermitente?
4. Existe um deploy recente que pode ter causado?

### Fase 2: Coleta de Evidências
```bash
# Verificar logs de erro recentes
tail -100 /var/log/nginx/error.log
tail -100 storage/logs/laravel.log

# Verificar processos em execução
pm2 status  # Node.js
php-fpm status  # PHP

# Verificar uso de recursos
htop
df -h  # Espaço em disco
free -h  # Memória

# Verificar conexões de banco
SHOW PROCESSLIST;  # MySQL — queries lentas/travadas
SELECT * FROM pg_stat_activity WHERE state = 'active';  # PostgreSQL

# Verificar filas
redis-cli llen queue:default
redis-cli info stats
```

### Fase 3: Análise dos Logs
```
Padrões a procurar:
- Stack traces repetidos (indica bug em código)
- "Connection refused" (serviço externo fora)
- "Too many connections" (pool de conexões esgotado)
- "Memory exhausted" / OOM (leak de memória)
- "Timeout" (operação lenta ou deadlock)
- 502/503 no nginx (aplicação não respondendo)
```

### Fase 4: Isolamento do Problema
```
Perguntas de isolamento:
- Afeta todos os usuários ou apenas alguns?
- Afeta todas as funcionalidades ou apenas uma?
- Afeta apenas requests de um endpoint específico?
- O problema é constante ou intermitente?
- Correlaciona com horário de pico?
- Correlaciona com dados específicos?
```

### Fase 5: Ações de Mitigação Imediata
```
Possíveis ações (comunicar antes de executar):
- Reiniciar serviço (php-fpm, node, nginx)
- Limpar cache (redis flush, config:clear)
- Aumentar workers temporariamente
- Desabilitar feature flag do funcionalidade afetada
- Ativar modo de manutenção
- Iniciar rollback se o problema veio de deploy recente
```

### Fase 6: Documentação do Incidente
Registrar durante o debug:
```
Hora de início: [HH:MM]
Impacto: [descrição]
Causa raiz: [quando encontrada]
Ações tomadas: [log cronológico]
Hora de resolução: [HH:MM]
Duração total: [X minutos]
```

## Checklist de Diagnóstico

### Infraestrutura
- [ ] Disco com espaço suficiente?
- [ ] Memória RAM disponível?
- [ ] CPU em estado normal?
- [ ] Rede sem latência anômala?

### Aplicação
- [ ] Processo da aplicação está rodando?
- [ ] Logs mostram errors repetidos?
- [ ] Health check responde?
- [ ] Variáveis de ambiente corretas?

### Banco de Dados
- [ ] Banco acessível?
- [ ] Sem queries travadas (deadlock)?
- [ ] Pool de conexões não esgotado?
- [ ] Espaço em disco do banco?

### Serviços Externos
- [ ] APIs externas respondendo?
- [ ] Redis/cache acessível?
- [ ] Filas processando?
- [ ] Serviço de email funcionando?

## Formato Esperado da Resposta

```
## Diagnóstico de Produção — [data/hora]

**Problema reportado:** [descrição]
**Status atual:** [investigando | mitigado | resolvido]

### Timeline
- [HH:MM] Problema reportado
- [HH:MM] Investigação iniciada
- [HH:MM] [ação tomada]
- [HH:MM] [descoberta]

### Causa raiz identificada:
[descrição técnica da causa]

### Ações tomadas:
1. [ação 1]
2. [ação 2]

### Status dos serviços:
- App: [OK | DEGRADADO | DOWN]
- DB: [OK | DEGRADADO | DOWN]
- Redis: [OK | DEGRADADO | DOWN]

### Próximos passos:
1. [correção permanente]
2. [prevenção]

### ADR/Post-mortem necessário: [sim | não]
```

## Boas Práticas
- Manter canal de comunicação aberto durante o debug
- Documentar cada ação tomada com timestamp
- Preferir leitura passiva (logs) antes de ações ativas
- Ter rollback planejado antes de qualquer mudança

## Validações Finais
- [ ] O problema foi identificado e resolvido?
- [ ] A causa raiz foi documentada?
- [ ] Prevenção para o futuro foi definida?
- [ ] Post-mortem foi agendado (se incidente grave)?

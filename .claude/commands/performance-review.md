# /performance-review

## Objetivo
Revisar a performance de um endpoint, página ou sistema, identificando gargalos, propondo melhorias baseadas em dados e criando um baseline para monitoramento.

## Quando Usar
- Ao investigar lentidão reportada por usuários
- Ao preparar uma feature para alto tráfego
- Ao revisar performance antes de um lançamento
- Periodicamente para identificar degradações

## Entrada Esperada
```
/performance-review

Alvo: [endpoint | página | módulo | sistema]
Sintoma: [lento | timeout | alto CPU | alto RAM | etc.]
Baseline: [tempo atual | tempo esperado]
Stack: [stack da aplicação]
```

## Processo Detalhado

### Fase 1: Medição Antes de Otimizar
**Regra de ouro: nunca otimize sem medir primeiro.**

```bash
# Testar tempo de resposta de endpoint
curl -w "@curl-format.txt" -o /dev/null -s "https://api.dominio.com/v1/products"

# curl-format.txt:
#     time_namelookup:  %{time_namelookup}\n
#        time_connect:  %{time_connect}\n
#     time_appconnect:  %{time_appconnect}\n
#    time_pretransfer:  %{time_pretransfer}\n
#       time_redirect:  %{time_redirect}\n
#  time_starttransfer:  %{time_starttransfer}\n
#                     ----------\n
#          time_total:  %{time_total}\n

# Load test simples
ab -n 100 -c 10 https://api.dominio.com/v1/products
```

### Fase 2: Análise de Queries de Banco

**Laravel — Identificar N+1:**
```php
// Ativar query log temporariamente (desenvolvimento apenas)
DB::enableQueryLog();
// ... código
$queries = DB::getQueryLog();
dump(count($queries)); // quantas queries foram executadas?
```

**Queries lentas (MySQL):**
```sql
-- Ativar slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;

-- Ver queries lentas em execução
SHOW PROCESSLIST;

-- EXPLAIN para análise de query
EXPLAIN SELECT * FROM orders
    JOIN users ON orders.user_id = users.id
    WHERE orders.status = 'pending'
    ORDER BY orders.created_at DESC
    LIMIT 20;
```

**Sinais de alerta no EXPLAIN:**
```
type = ALL → Full table scan (índice ausente)
rows = grande número → muitas linhas escaneadas
Extra = "Using filesort" → ordenação sem índice
Extra = "Using temporary" → tabela temporária criada
```

### Fase 3: Análise de Cache

```
Verificar:
[ ] Dados que raramente mudam estão cacheados?
[ ] Cache hit rate está acima de 80%?
[ ] TTL apropriado para cada tipo de dado?
[ ] Cache invalidado corretamente ao atualizar?
[ ] Cache de queries de banco habilitado?
[ ] Cache de views/templates habilitado?
```

### Fase 4: Análise Frontend

**Core Web Vitals:**
```
LCP (Largest Contentful Paint): < 2.5s ✅ | < 4s ⚠️ | > 4s ❌
FID (First Input Delay): < 100ms ✅ | < 300ms ⚠️ | > 300ms ❌
CLS (Cumulative Layout Shift): < 0.1 ✅ | < 0.25 ⚠️ | > 0.25 ❌
TTFB (Time to First Byte): < 800ms ✅ | < 1800ms ⚠️ | > 1800ms ❌
```

**Verificações Frontend:**
```
[ ] Imagens otimizadas (WebP, lazy loading, dimensões corretas)
[ ] Bundle JS com code splitting
[ ] CSS crítico inline (above the fold)
[ ] Fonts otimizadas (font-display: swap)
[ ] CDN para assets estáticos
[ ] HTTP/2 habilitado
[ ] Gzip/Brotli habilitado
[ ] Service Worker para cache offline (se PWA)
```

### Fase 5: Análise de Memória e CPU

```bash
# Node.js — Memory profiling
node --inspect app.js
# Conectar Chrome DevTools → chrome://inspect

# PHP — Xdebug profiling
# xdebug.mode=profile
# xdebug.output_dir=/tmp/xdebug

# Verificar processos PHP
ps aux | grep php-fpm
```

### Problemas Comuns e Soluções

| Problema | Diagnóstico | Solução |
|---|---|---|
| N+1 Queries | Query log mostra N queries em loop | Eager loading (with(), include()) |
| Full table scan | EXPLAIN mostra type=ALL | Criar índice no campo de busca |
| Sem cache | Cache hit rate < 50% | Implementar Redis cache |
| Bundle grande | Lighthouse > 1MB JS | Code splitting, tree shaking |
| Imagens grandes | Lighthouse mostra imagens lentas | WebP, lazy loading, CDN |
| Memory leak | RAM crescendo sem cair | Profiling, verificar event listeners |

## Checklist
- [ ] Baseline de performance medido antes
- [ ] Queries lentas identificadas
- [ ] N+1 queries eliminadas
- [ ] Índices necessários criados
- [ ] Cache implementado onde faz sentido
- [ ] Assets frontend otimizados
- [ ] Performance medida após otimizações
- [ ] Melhoria documentada com números

## Formato Esperado da Resposta

```
## Relatório de Performance: [alvo]

**Antes:** [tempo/métrica]
**Depois:** [tempo/métrica após otimização]
**Melhoria:** [X%]

### Problemas encontrados:
1. [problema] — impacto [alto | médio | baixo]
   - Diagnóstico: [evidência]
   - Solução: [o que foi feito]

### Queries otimizadas:
- [query antes → depois] — [X% mais rápida]

### Cache implementado:
- [dado cacheado] — TTL: [X minutos]

### Próximas otimizações sugeridas:
1. [otimização sugerida com ROI estimado]
```

## Boas Práticas
- Medir antes e depois de qualquer otimização
- Otimizar o gargalo principal primeiro (Lei de Amdahl)
- Cache não resolve problema de lógica — corrija a lógica
- Documentar otimizações para não otimizar duas vezes

## Validações Finais
- [ ] A performance melhorou de forma mensurável?
- [ ] As métricas estão documentadas?
- [ ] Não foram introduzidos novos problemas?
- [ ] O monitoramento está configurado para detectar regressão?

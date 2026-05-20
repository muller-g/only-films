# SKILL: performance-optimization

**Name:** performance-optimization
**Description:** Identificação e resolução de gargalos de performance em aplicações web, cobrindo banco de dados, cache, queries N+1, otimização de frontend e monitoramento.
**Quando usar:** Ao investigar lentidão, preparar para alto tráfego, ou revisar performance antes de lançamento.

---

## Regra de Ouro
**Nunca otimize sem medir primeiro.** Identifique o gargalo real antes de otimizar.

## Checklist de Diagnóstico

### Backend
```
[ ] Queries N+1 identificadas e eliminadas
[ ] EXPLAIN em queries lentas executado
[ ] Índices em campos de busca/ordenação/join criados
[ ] Listagens paginadas (nunca SELECT * sem LIMIT)
[ ] Cache em dados que raramente mudam
[ ] Operações pesadas em filas (async)
[ ] Pool de conexões configurado adequadamente
```

### Frontend
```
[ ] Core Web Vitals medidos (LCP < 2.5s, CLS < 0.1)
[ ] Bundle JS analisado (< 200KB gzipped por rota)
[ ] Imagens otimizadas (WebP, lazy loading, dimensões)
[ ] Code splitting em rotas
[ ] CSS crítico inline
[ ] Font loading otimizado (font-display: swap)
[ ] CDN para assets estáticos
```

## Métricas de Referência
```
API endpoint: < 200ms (p95)
Página web (LCP): < 2.5s
Time to First Byte: < 800ms
Cache hit rate: > 80%
Error rate: < 0.1%
Query mais lenta: < 100ms
```

## Soluções por Problema

| Problema | Solução |
|---|---|
| N+1 queries | Eager loading (with/include) |
| Full table scan | Criar índice no campo |
| Dados lentos sem mudança | Implementar cache Redis |
| Operação lenta no request | Mover para queue |
| Bundle JS grande | Code splitting, tree shaking |
| Imagens lentas | WebP, lazy loading, CDN |
| Alta latência em API | Verificar queries, adicionar cache |

---

## Erros Comuns
- Otimizar sem medir (pode piorar ou não fazer diferença)
- Cache para dados que mudam frequentemente
- Índices em colunas de baixa seletividade
- Memoização prematura no frontend

---

## Validações Finais
- [ ] Gargalo medido antes de otimizar?
- [ ] Melhoria verificada com métricas?
- [ ] Monitoramento configurado para detectar regressão?

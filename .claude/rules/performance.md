# Regras de Performance

Padrões para garantir performance adequada em aplicações web.

---

## Backend

```
OBRIGATÓRIO:
- Toda listagem paginada (nunca retornar todos os registros)
- Eager loading para relacionamentos (prevenir N+1)
- Índices em campos de busca, ordenação e JOIN
- Cache para dados que raramente mudam (TTL definido)
- Operações pesadas em filas (email, PDF, notificações, exports)
- Timeout configurado para chamadas externas
- Pool de conexões configurado (não criar conexão por request)

PROIBIDO:
- SELECT * sem LIMIT em produção
- Queries N+1 em endpoints de alta frequência
- Operações de I/O bloqueante em threads críticas
- Cache sem TTL (pode crescer indefinidamente)
```

## Métricas de Referência

```
Endpoint de API (p95):    < 200ms
Página web (LCP):         < 2.5s
Time to First Byte:       < 800ms
Queries de banco:         < 100ms (p95)
Cache hit rate:           > 80%
```

## Frontend

```
OBRIGATÓRIO:
- Lazy loading para rotas e componentes pesados
- Code splitting por rota
- Imagens otimizadas (WebP, dimensões corretas)
- Lazy loading em imagens below the fold
- CDN para assets estáticos
- Gzip/Brotli habilitado no servidor

Core Web Vitals alvo:
- LCP < 2.5s
- CLS < 0.1
- FID < 100ms
```

## Banco de Dados

```
- Verificar EXPLAIN em queries lentas (> 100ms)
- Índices compostos para queries compostas frequentes
- Connection pooling (não uma conexão por request)
- Queries lentas logadas automaticamente (slow query log)
- VACUUM/ANALYZE periódico (PostgreSQL)
```

## Regra de Ouro

```
Medir antes de otimizar.
Identificar o gargalo real com dados.
Documentar o baseline antes e depois da otimização.
```

---

*Versão: 1.0.0 — 2026-05*

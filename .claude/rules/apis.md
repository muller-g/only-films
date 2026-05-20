# Regras para APIs REST

Padrões obrigatórios para design e implementação de APIs REST.

---

## Nomenclatura de Endpoints

```
OBRIGATÓRIO:
- Substantivos, plural, snake_case
- Versionamento: /api/v1/
- Sem verbos na URL

✅ GET  /api/v1/users
✅ POST /api/v1/users
✅ GET  /api/v1/users/:id
✅ PUT  /api/v1/users/:id
✅ DELETE /api/v1/users/:id

❌ GET /api/v1/getUsers
❌ POST /api/v1/createUser
❌ GET /api/v1/user (singular)
```

## HTTP Methods

```
GET    → leitura, sem side effects, cacheável
POST   → criar recurso, retorna 201
PUT    → atualizar completamente (todos os campos)
PATCH  → atualizar parcialmente (apenas campos enviados)
DELETE → remover, retorna 204 (sem body)
```

## Status Codes

```
200 OK             → GET, PUT, PATCH com sucesso
201 Created        → POST com criação
204 No Content     → DELETE, ou PUT/PATCH sem retorno
400 Bad Request    → request malformada
401 Unauthorized   → não autenticado (sem token)
403 Forbidden      → autenticado mas sem permissão
404 Not Found      → recurso não existe
409 Conflict       → estado conflitante (email duplicado)
422 Unprocessable  → validação semântica falhou
429 Too Many Reqs  → rate limit excedido
500 Internal Error → erro não esperado
```

## Formato de Resposta (padrão)

```json
// Sucesso com dados
{ "success": true, "data": { ... } }

// Lista paginada
{
  "success": true,
  "data": [ ... ],
  "meta": { "current_page": 1, "per_page": 15, "total": 100, "last_page": 7 }
}

// Erro
{ "success": false, "message": "Descrição do erro", "errors": { "field": ["msg"] } }
```

## Paginação

```
GET /api/v1/products?page=2&per_page=20
GET /api/v1/orders?status=pending&sort=created_at&order=desc&search=texto

OBRIGATÓRIO:
- Toda listagem deve ser paginada
- per_page padrão: 15, máximo: 100
- Retornar meta com total e last_page
```

## Segurança de API

```
- Rate limiting em TODOS os endpoints públicos
- CORS com lista branca explícita (nunca *)
- Autenticação: Bearer token no header Authorization
- Documentação de API não exposta em produção
- IDs não previsíveis para recursos sensíveis
```

---

*Versão: 1.0.0 — 2026-05*

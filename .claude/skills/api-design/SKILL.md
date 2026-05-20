# SKILL: api-design

**Name:** api-design
**Description:** Design de APIs REST seguindo boas práticas, contratos claros, versionamento, documentação e padrões de resposta consistentes.
**Quando usar:** Ao criar ou revisar endpoints de API, definir contratos, versionar APIs ou documentar com OpenAPI/Swagger.

---

## Padrões REST Obrigatórios

### Nomenclatura de Recursos
```
Substantivos, plural, snake_case:
GET    /api/v1/users                  → listar
POST   /api/v1/users                  → criar
GET    /api/v1/users/:id              → buscar por ID
PUT    /api/v1/users/:id              → atualizar (completo)
PATCH  /api/v1/users/:id              → atualizar (parcial)
DELETE /api/v1/users/:id              → deletar

Sub-recursos:
GET    /api/v1/users/:id/orders       → pedidos do usuário
POST   /api/v1/orders/:id/cancel      → ação em recurso
```

### Versionamento
```
URL path (recomendado para breaking changes):
  /api/v1/users  →  /api/v2/users

Header (para versões menores):
  API-Version: 2024-01-01
```

### Padrão de Resposta
```json
// Sucesso com dados
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}

// Lista paginada
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7,
    "from": 1,
    "to": 15
  }
}

// Erro de validação
{
  "success": false,
  "message": "Os dados fornecidos são inválidos",
  "errors": {
    "email": ["O campo email é obrigatório", "Formato inválido"],
    "name": ["O campo nome é obrigatório"]
  }
}

// Erro genérico
{
  "success": false,
  "message": "Mensagem descritiva para o usuário",
  "code": "RESOURCE_NOT_FOUND"
}
```

### HTTP Status Codes
```
200 OK              → sucesso em GET, PUT, PATCH
201 Created         → sucesso em POST com criação
204 No Content      → sucesso sem body (DELETE)
400 Bad Request     → request malformada
401 Unauthorized    → não autenticado
403 Forbidden       → autenticado mas sem permissão
404 Not Found       → recurso não existe
409 Conflict        → conflito de estado (email já existe)
422 Unprocessable   → validação semântica falhou
429 Too Many Reqs   → rate limit excedido
500 Internal Error  → erro não esperado no servidor
```

### Filtros e Paginação
```
GET /api/v1/users?page=2&per_page=20
GET /api/v1/orders?status=pending&sort=created_at&order=desc
GET /api/v1/products?search=teclado&category_id=5&min_price=100
```

### Segurança de API
```
[ ] Autenticação via Bearer token em endpoints protegidos
[ ] Rate limiting em todos endpoints públicos
[ ] CORS com lista branca
[ ] HTTPS obrigatório
[ ] Inputs sanitizados e validados
[ ] IDs não previsíveis para recursos sensíveis (UUID)
[ ] Sem exposição de campos sensíveis na resposta
[ ] Documentação não exposta em produção
```

---

## Checklist de Quality Gate
```
[ ] Recursos com substantivos plural
[ ] Método HTTP correto para cada operação
[ ] Versionamento na URL (/api/v1/)
[ ] Response no padrão definido
[ ] Status codes corretos
[ ] Paginação em todas as listagens
[ ] Autenticação e autorização implementadas
[ ] Rate limiting configurado
[ ] OpenAPI/Swagger atualizado
[ ] Erros com mensagens úteis
```

---

## Erros Comuns
- Verbos na URL (`/api/getUsers` em vez de `GET /api/users`)
- Sem paginação em listagens
- Status 200 para erros
- Expor stack trace em erros 500
- API sem versionamento desde o início

---

## Validações Finais
- [ ] Endpoints seguem convenção REST?
- [ ] Respostas no formato padrão?
- [ ] Status codes corretos?
- [ ] Documentação OpenAPI atualizada?

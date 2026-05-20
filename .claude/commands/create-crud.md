# /create-crud

## Objetivo
Criar um CRUD (Create, Read, Update, Delete) completo para um recurso, incluindo migration, model, controller, service, validação, testes e documentação de API.

## Quando Usar
- Ao criar um módulo CRUD padrão para um recurso
- Ao iniciar o desenvolvimento de um novo módulo
- Como base para recursos que depois terão lógica mais complexa

## Entrada Esperada
```
/create-crud

Recurso: [nome do recurso — ex: Product, Customer, Order]
Stack: [Laravel | NestJS]
Campos: [lista de campos com tipo]
Auth: [público | autenticado | admin]
Soft delete: [sim | não]
Paginação: [sim | não]
```

## Processo Detalhado

O comando gera todos os arquivos necessários para um CRUD completo:

### Arquivos Gerados (Laravel)
```
database/migrations/TIMESTAMP_create_RESOURCES_table.php
app/Models/Resource.php
app/Http/Controllers/Api/ResourceController.php
app/Http/Requests/StoreResourceRequest.php
app/Http/Requests/UpdateResourceRequest.php
app/Services/ResourceService.php
app/Repositories/ResourceRepository.php
tests/Feature/ResourceTest.php
routes/api.php (rotas adicionadas)
```

### Arquivos Gerados (NestJS)
```
src/resources/resource.module.ts
src/resources/resource.controller.ts
src/resources/resource.service.ts
src/resources/resource.repository.ts (ou via TypeORM)
src/resources/dto/create-resource.dto.ts
src/resources/dto/update-resource.dto.ts
src/resources/entities/resource.entity.ts
src/resources/resource.controller.spec.ts
src/resources/resource.service.spec.ts
migrations/TIMESTAMP-CreateResourceTable.ts
```

### Endpoints Criados
```
GET    /api/v1/resources         → index  (listagem paginada)
POST   /api/v1/resources         → store  (criar novo)
GET    /api/v1/resources/:id     → show   (buscar por ID)
PUT    /api/v1/resources/:id     → update (atualizar)
DELETE /api/v1/resources/:id     → destroy (deletar/soft-delete)
```

### Response Padrão

**Index (listagem):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "...", "created_at": "..." }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7
  }
}
```

**Show / Store / Update:**
```json
{
  "success": true,
  "data": { "id": 1, "name": "...", "created_at": "..." },
  "message": "Recurso criado com sucesso"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Os dados fornecidos são inválidos",
  "errors": {
    "name": ["O campo nome é obrigatório"],
    "email": ["O email já está em uso"]
  }
}
```

### Exemplo Laravel Controller
```php
<?php

namespace App\Http\Controllers\Api;

class ProductController extends Controller
{
    public function __construct(private readonly ProductService $service) {}

    public function index(Request $request): JsonResponse
    {
        $products = $this->service->paginate($request->validated());
        return response()->json(['success' => true, 'data' => $products]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->service->create($request->validated());
        return response()->json(['success' => true, 'data' => $product], 201);
    }

    public function show(Product $product): JsonResponse
    {
        $this->authorize('view', $product);
        return response()->json(['success' => true, 'data' => $product]);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $this->authorize('update', $product);
        $product = $this->service->update($product, $request->validated());
        return response()->json(['success' => true, 'data' => $product]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->authorize('delete', $product);
        $this->service->delete($product);
        return response()->json(['success' => true], 204);
    }
}
```

## Checklist
- [ ] Migration criada com todos os campos
- [ ] Model criado com fillable e casts corretos
- [ ] Controller thin (sem lógica de negócio)
- [ ] Service com lógica de negócio
- [ ] Repository com queries de banco
- [ ] FormRequests/DTOs com validação completa
- [ ] Autorização implementada em show/update/destroy
- [ ] Paginação em index
- [ ] Response no formato padrão
- [ ] Testes cobrindo todos os endpoints
- [ ] Rotas adicionadas com middleware correto
- [ ] Documentação de API atualizada

## Formato Esperado da Resposta
```
## CRUD criado: [Resource]

**Stack:** [Laravel | NestJS]
**Endpoints:** 5 (index, store, show, update, destroy)
**Auth:** [autenticado]

### Arquivos criados:
- [lista de arquivos]

### Rotas:
- GET /api/v1/resources
- POST /api/v1/resources
- GET /api/v1/resources/:id
- PUT /api/v1/resources/:id
- DELETE /api/v1/resources/:id

### Testes criados:
- [teste 1]
- [teste 2]
```

## Boas Práticas
- CRUD é ponto de partida, não destino — adicionar regras de negócio conforme necessário
- Sempre implementar paginação desde o início
- Soft delete padrão para entidades de negócio

## Validações Finais
- [ ] Todos os 5 endpoints funcionam?
- [ ] Autorização está correta?
- [ ] Paginação funciona na listagem?
- [ ] Testes cobrem happy path e erros?

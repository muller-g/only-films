# Regras para Laravel

Regras específicas para projetos Laravel/PHP.

---

## Arquitetura

```
OBRIGATÓRIO:
- Controllers thin: sem lógica de negócio
- Services: toda lógica de negócio
- Repositories: todo acesso ao banco
- FormRequests: toda validação de input
- API Resources: toda transformação de resposta
- Policies: toda autorização de recursos

PROIBIDO:
- DB::select/insert/update no controller
- Lógica de negócio no model
- Validação manual em vez de FormRequest
- Retornar $model diretamente (usar Resource)
```

## Eloquent

```
OBRIGATÓRIO:
- Eager loading para todos os relacionamentos (prevenir N+1)
- Scopes para queries reutilizáveis
- Casts para tipos de dados ($casts)
- Fillable explícito (sem $guarded = [])
- Soft deletes para entidades de negócio

PROIBIDO:
- User::all() — sempre paginar
- $model->where('user_id', $request->user()->id)  — usar policy
- DB::raw() com interpolação de string
- Relacionamentos sem with() em listagens
```

## Autenticação e Autorização

```
- Sanctum para SPAs e mobile
- Passport para OAuth (terceiros)
- Always use $this->authorize() em show/update/destroy
- Gates para permissões simples
- Policies para permissões em recursos
```

## Validação

```php
// Sempre FormRequest, nunca $request->validate() inline para APIs
// Regras de validação em array sempre (não string)

// ✅ Correto
'email' => ['required', 'email', 'unique:users,email']

// ❌ Evitar (dificulta herança e testes)
'email' => 'required|email|unique:users,email'
```

## Response Padrão

```php
// Sucesso
return response()->json(['success' => true, 'data' => $resource], 200);

// Criação
return response()->json(['success' => true, 'data' => $resource], 201);

// Sem conteúdo
return response()->noContent();

// Paginação
return response()->json([
    'success' => true,
    'data' => $paginator->items(),
    'meta' => [
        'current_page' => $paginator->currentPage(),
        'per_page' => $paginator->perPage(),
        'total' => $paginator->total(),
        'last_page' => $paginator->lastPage(),
    ],
]);
```

## Migrations

```
- Sempre implementar down() reversível
- Colunas nullable ou com default ao adicionar em tabela existente
- Índices em todas as FKs
- DECIMAL(10,2) para valores monetários
- Soft deletes (deleted_at) para entidades de negócio
```

## Testes

```php
// Feature tests com RefreshDatabase
use RefreshDatabase;

// Factories para dados
User::factory()->create(['email' => 'test@test.com']);
User::factory()->count(10)->create();

// Autenticação em testes
$this->actingAs($user);
$this->actingAs($admin, 'api');

// Assertions comuns
->assertStatus(200)
->assertJsonPath('success', true)
->assertJsonCount(15, 'data')
->assertDatabaseHas('users', ['email' => 'x'])
->assertSoftDeleted('users', ['id' => 1])
```

## Configuração

```
- Sempre usar env() com fallback
- Config files para agrupar configurações
- Cache de config em produção (config:cache)
- .env.example sempre atualizado
```

---

*Versão: 1.0.0 — 2026-05*

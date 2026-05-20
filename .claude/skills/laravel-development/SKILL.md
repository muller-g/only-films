# SKILL: laravel-development

**Name:** laravel-development
**Description:** Desenvolvimento profissional com Laravel e PHP, seguindo boas práticas de arquitetura limpa, padrões de design e convenções do ecossistema Laravel.
**Quando usar:** Ao trabalhar em qualquer projeto Laravel — criação de features, APIs, autenticação, migrations, testes ou refatorações.

---

## Processo Detalhado

Ao atuar como especialista em Laravel, seguir sempre esta sequência:

1. Verificar a versão do Laravel (`composer show laravel/framework`)
2. Identificar padrões de arquitetura existentes no projeto
3. Verificar se há Service Providers, Repositories ou Services customizados
4. Seguir os padrões identificados antes de criar código novo

---

## Padrões Obrigatórios

### Estrutura de Camadas
```
Routes → FormRequest (validação) → Controller (entrada/saída) → Service (negócio) → Repository (dados) → Model
```

### Controller (Thin)
```php
class UserController extends Controller
{
    public function __construct(private readonly UserService $service) {}

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->service->create($request->validated());
        return response()->json(['success' => true, 'data' => UserResource::make($user)], 201);
    }
}
```

### Service (Lógica de Negócio)
```php
class UserService
{
    public function __construct(
        private readonly UserRepository $repository,
        private readonly PasswordHashService $hasher,
    ) {}

    public function create(array $data): User
    {
        $data['password'] = $this->hasher->hash($data['password']);
        return $this->repository->create($data);
    }
}
```

### Repository (Acesso a Dados)
```php
class UserRepository
{
    public function create(array $data): User
    {
        return User::create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return User::latest()->paginate($perPage);
    }
}
```

### FormRequest (Validação)
```php
class StoreUserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
}
```

### API Resource (Transformação)
```php
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
```

### Eloquent — Boas Práticas
```php
// Eager loading para prevenir N+1
$orders = Order::with(['user', 'items.product'])->paginate(15);

// Scopes reutilizáveis
public function scopePending(Builder $query): Builder
{
    return $query->where('status', 'pending');
}

// Casts de tipos
protected $casts = [
    'metadata' => 'array',
    'is_active' => 'boolean',
    'price' => 'decimal:2',
    'published_at' => 'datetime',
];
```

---

## Checklist de Quality Gate
```
[ ] Controller sem lógica de negócio
[ ] Service sem queries diretas ao banco
[ ] FormRequest para validação de todos os inputs
[ ] Policy para autorização de recursos
[ ] API Resource para transformação de dados
[ ] Eager loading para prevenir N+1
[ ] Migrations com down() implementado
[ ] Factories para dados de teste
[ ] Testes com RefreshDatabase trait
[ ] .env.example atualizado com novas variáveis
```

---

## Erros Comuns
- Lógica de negócio no controller
- `User::all()` sem paginação
- Relacionamentos carregados sem `with()` (N+1)
- `DB::raw()` sem binding de parâmetros
- `$request->all()` em vez de `$request->validated()`

---

## Práticas Proibidas
- SQL raw com interpolação de string (injection)
- `dd()` ou `dump()` em código de produção
- `.env` com valores de produção commitados
- Sem Policy para operações em recursos de usuário
- `User::find($id)` sem verificar autorização

---

## Validações Finais
- [ ] Sem lógica de negócio no controller?
- [ ] Autorização usando Policy?
- [ ] Eager loading nos relacionamentos?
- [ ] FormRequest para validação?
- [ ] API Resource para resposta?
- [ ] Testes cobrindo o fluxo principal?

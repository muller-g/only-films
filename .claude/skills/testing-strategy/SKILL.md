# SKILL: testing-strategy

**Name:** testing-strategy
**Description:** Estratégia completa de testes para aplicações fullstack, cobrindo testes unitários, de integração e e2e com as ferramentas adequadas para cada stack.
**Quando usar:** Ao definir estratégia de testes para um projeto, criar testes para features existentes ou debugar testes que não passam.

---

## Pirâmide de Testes

```
        /\
       /E2E\          10% — Cypress, Playwright
      /------\
     /Integração\     20% — Supertest, PHPUnit Feature
    /------------\
   /   Unitários  \   70% — Jest, PHPUnit Unit, Vitest
  /-----------------\
```

## Por Stack

### Laravel (PHPUnit)

**Unitário:**
```php
class UserServiceTest extends TestCase
{
    public function test_creates_user_with_hashed_password(): void
    {
        $service = new UserService(
            new UserRepository(),
            new PasswordHashService()
        );
        $user = $service->create(['name' => 'John', 'email' => 'j@test.com', 'password' => 'secret']);

        $this->assertTrue(Hash::check('secret', $user->password));
    }
}
```

**Feature/Integração:**
```php
class UserApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_user_via_api(): void
    {
        $this->postJson('/api/v1/users', [
            'name' => 'John Doe',
            'email' => 'john@test.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertStatus(201)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.email', 'john@test.com');

        $this->assertDatabaseHas('users', ['email' => 'john@test.com']);
    }

    public function test_returns_validation_error_without_email(): void
    {
        $this->postJson('/api/v1/users', ['name' => 'John'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
}
```

### NestJS (Jest)

**Unitário com Mock:**
```typescript
describe('UserService', () => {
    let service: UserService;
    let repository: jest.Mocked<UserRepository>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepository,
                    useValue: {
                        findByEmail: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get(UserService);
        repository = module.get(UserRepository);
    });

    describe('create', () => {
        it('should create user when email is unique', async () => {
            repository.findByEmail.mockResolvedValue(null);
            repository.save.mockResolvedValue({ id: 1, name: 'John', email: 'john@test.com' } as User);

            const result = await service.create({ name: 'John', email: 'john@test.com', password: '123456' });

            expect(result.email).toBe('john@test.com');
            expect(repository.save).toHaveBeenCalledTimes(1);
        });

        it('should throw ConflictException when email already exists', async () => {
            repository.findByEmail.mockResolvedValue({ id: 1 } as User);

            await expect(service.create({ email: 'existing@test.com', name: 'X', password: '123' }))
                .rejects.toThrow(ConflictException);
        });
    });
});
```

---

## Padrões de Nomeação
```
describe('ClassName ou ModuleName')
  describe('methodName')
    it('should [comportamento] when [condição]')

Exemplos:
  it('should return null when user does not exist')
  it('should throw NotFoundException when id is invalid')
  it('should hash password before saving to database')
```

## Dados de Teste
```
- Usar Factories/Seeders, nunca dados hardcoded
- Banco em memória (SQLite) ou com RefreshDatabase
- Mock apenas dependências externas (HTTP, email, S3)
- Não mock o código sendo testado
```

---

## Checklist de Quality Gate
```
[ ] Happy path coberto
[ ] Casos de erro principais cobertos
[ ] Validação de input coberta
[ ] Teste independente da ordem de execução
[ ] Factory/Fixture em vez de dados hardcoded
[ ] Mock apenas para dependências externas
[ ] Nome descritivo que documenta comportamento
[ ] Sem side effects entre testes (limpar estado)
```

---

## Erros Comuns
- Testar implementação em vez de comportamento
- Dependência de ordem de execução
- Mock excessivo (testa apenas o mock)
- Nomes genéricos ("test1", "should work")

---

## Validações Finais
- [ ] Testes passam de forma isolada?
- [ ] Happy path e erros cobertos?
- [ ] Factories usadas em vez de dados hardcoded?
- [ ] Nomes descrevem o comportamento esperado?

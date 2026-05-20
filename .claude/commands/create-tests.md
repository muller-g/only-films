# /create-tests

## Objetivo
Criar uma suite de testes completa para um módulo, feature ou funcionalidade, cobrindo testes unitários, de integração e end-to-end conforme necessário.

## Quando Usar
- Ao implementar uma nova feature e precisar de cobertura
- Ao adicionar testes a código legado sem cobertura
- Ao criar testes de regressão para um bug corrigido
- Ao criar testes para um endpoint crítico

## Entrada Esperada
```
/create-tests

Módulo/Arquivo: [o que precisa de testes]
Tipo: [unitário | integração | e2e | todos]
Stack: [Laravel PHPUnit | NestJS Jest | Vitest | Cypress | Playwright]
Contexto: [o que o código faz]
```

## Processo Detalhado

### Tipos de Teste por Camada

**Unitários (70% da pirâmide):**
- Services / Use Cases
- Helpers e utilitários
- Regras de negócio isoladas
- Transformações de dados

**Integração (20% da pirâmide):**
- Endpoints de API
- Integração com banco de dados
- Integração entre módulos

**E2E (10% da pirâmide):**
- Fluxos críticos do usuário
- Jornadas de compra, cadastro, login

### Estrutura de Testes

**Laravel (PHPUnit):**
```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\UserService;
use App\Models\User;

class UserServiceTest extends TestCase
{
    private UserService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(UserService::class);
    }

    public function test_creates_user_successfully(): void
    {
        $data = ['name' => 'John', 'email' => 'john@example.com', 'password' => 'secret'];

        $user = $this->service->create($data);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John', $user->name);
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_throws_exception_when_email_already_exists(): void
    {
        User::factory()->create(['email' => 'john@example.com']);

        $this->expectException(\App\Exceptions\EmailAlreadyExistsException::class);
        $this->service->create(['email' => 'john@example.com', ...]);
    }
}
```

**NestJS (Jest):**
```typescript
describe('UserService', () => {
    let service: UserService;
    let repository: jest.Mocked<UserRepository>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: UserRepository, useValue: { findByEmail: jest.fn(), save: jest.fn() } },
            ],
        }).compile();

        service = module.get(UserService);
        repository = module.get(UserRepository);
    });

    it('should create user successfully', async () => {
        repository.findByEmail.mockResolvedValue(null);
        repository.save.mockResolvedValue({ id: 1, name: 'John', email: 'john@test.com' });

        const result = await service.create({ name: 'John', email: 'john@test.com', password: '123456' });

        expect(result).toBeDefined();
        expect(result.email).toBe('john@test.com');
    });
});
```

### Padrões de Nomenclatura
```
Describe: nome da classe/função sendo testada
  It/Test: should [comportamento esperado] when [condição]

Exemplo:
  describe('UserService.create')
    it('should return user when data is valid')
    it('should throw EmailAlreadyExistsException when email is taken')
    it('should hash password before saving')
```

### Categorias de Teste por Feature
Para cada feature, cobrir:
1. Happy path — cenário de sucesso
2. Validação inválida — campos faltando ou mal formatados
3. Não encontrado — recurso inexistente
4. Não autorizado — sem permissão
5. Conflito — duplicidade ou estado inconsistente
6. Edge cases — valores limite, null, vazio

## Checklist
- [ ] Happy path coberto
- [ ] Casos de erro principais cobertos
- [ ] Testes independentes entre si (sem dependência de ordem)
- [ ] Sem acesso a recursos externos não mockados (em unitários)
- [ ] Banco de dados em memória ou factory/fixture (em integração)
- [ ] Nomes descritivos que documentam o comportamento
- [ ] Testes passando no CI
- [ ] Cobertura de código verificada

## Formato Esperado da Resposta
```
## Testes criados: [módulo/feature]

**Tipo:** [unitário | integração | e2e]
**Framework:** [PHPUnit | Jest | Vitest]
**Cobertura estimada:** [X%]

### Casos cobertos:
- ✅ [caso 1]
- ✅ [caso 2]
- ⚠️ [caso não coberto — por quê]

### Arquivos criados:
- [arquivo de teste 1]
- [arquivo de teste 2]

### Como executar:
```bash
# Laravel
php artisan test tests/Unit/Services/UserServiceTest.php

# NestJS/Jest
npm test -- user.service.spec.ts
```
```

## Boas Práticas
- Teste comportamento, não implementação — se mudar a implementação, o teste não deve quebrar
- Um assert por teste (idealmente)
- Factories/Fixtures para dados de teste, não dados hardcoded
- Mocks apenas para dependências externas, não para o código sendo testado

## Erros Comuns
- Testar a implementação em vez do comportamento: teste quebra ao refatorar
- Testes com dependências entre si: falham em ordem diferente
- Mocks em excesso: teste passa mas código real falha
- Dados de teste hardcoded: testes frágeis

## Validações Finais
- [ ] Todos os testes passam?
- [ ] Os testes cobrem os casos de erro mais importantes?
- [ ] Os testes podem ser executados de forma isolada?
- [ ] O nome de cada teste descreve o comportamento esperado?

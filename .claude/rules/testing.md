# Regras para Testes

Padrões obrigatórios para escrita e organização de testes.

---

## Pirâmide de Testes

```
70% — Unitários: Services, Use Cases, Utils
20% — Integração: Endpoints, DB, módulos
10% — E2E: Fluxos críticos do usuário
```

## Regras Gerais

```
OBRIGATÓRIO:
- Testes antes de qualquer feature ser declarada completa
- Happy path coberto
- Principais casos de erro cobertos
- Testes independentes entre si
- Factories/Fixtures em vez de dados hardcoded
- Mock apenas para dependências externas (HTTP, email, S3)
- Nomes descritivos: "should [comportamento] when [condição]"

PROIBIDO:
- Testes com dependência de ordem de execução
- Dados hardcoded em vez de factories
- Mock do código sendo testado
- Testes que passam sempre (sem assert significativo)
- Console.log em testes
```

## Nomenclatura

```
describe('NomeDoModulo') {
  describe('nomeDoMetodo') {
    it('should return user when email is valid')
    it('should throw NotFoundException when user does not exist')
    it('should hash password before saving to database')
  }
}
```

## O Que Testar

### Unitários (Services)
```
- Lógica de negócio
- Transformações de dados
- Validações de domínio
- Casos extremos (null, vazio, limite)
```

### Integração (Endpoints)
```
- Status code correto
- Estrutura da resposta
- Validação de input (422)
- Autenticação (401)
- Autorização (403)
- Not found (404)
- Persistência no banco
```

### E2E (Cypress/Playwright)
```
- Login → acesso ao dashboard
- Fluxo completo de compra
- Registro de usuário
- Recuperação de senha
```

## Dados de Teste

```php
// Laravel — Factories
User::factory()->create(['email' => 'test@test.com']);
User::factory()->admin()->create();
Order::factory()->for($user)->count(5)->create();
```

```typescript
// NestJS — Factories com @faker-js/faker
const createUser = (override = {}) => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    ...override,
});
```

---

*Versão: 1.0.0 — 2026-05*

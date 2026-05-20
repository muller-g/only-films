# /create-endpoint

## Objetivo
Criar um endpoint REST completo seguindo todos os padrões do projeto, incluindo validação, autorização, testes e documentação.

## Quando Usar
- Ao criar uma nova rota de API
- Ao adicionar um endpoint a um módulo existente
- Ao criar endpoints de integração com sistemas externos

## Entrada Esperada
```
/create-endpoint

Método: [GET | POST | PUT | PATCH | DELETE]
Path: /api/v1/[resource]/[sub-resource]
Descrição: [o que o endpoint faz]
Auth: [público | autenticado | admin | custom]
Stack: [Laravel | NestJS | Express]
Payload: [estrutura do body — se POST/PUT/PATCH]
Resposta: [estrutura da resposta esperada]
```

## Processo Detalhado

### Fase 1: Design do Endpoint
1. Definir o nome do recurso seguindo convenções REST
2. Escolher o método HTTP correto
3. Definir o path seguindo o padrão `/api/v{n}/{resource}`
4. Definir o status code de sucesso
5. Definir os status codes de erro
6. Definir o payload de entrada
7. Definir o payload de saída (response)

### Fase 2: Validação de Input
Para POST/PUT/PATCH, criar validação completa:

**Laravel (FormRequest):**
```php
class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8', 'confirmed'],
        ];
    }
}
```

**NestJS (DTO + class-validator):**
```typescript
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}
```

### Fase 3: Autorização
1. Definir policy/guard para o endpoint
2. Verificar se o usuário tem permissão para o recurso específico
3. Implementar owner-check quando necessário (não apenas autenticação)

### Fase 4: Implementação

**Laravel:**
```
Route → FormRequest (validação) → Policy (autorização) → Controller → Service → Repository → Response
```

**NestJS:**
```
Route → Guards (autenticação) → Pipes (validação DTO) → Controller → Service → Repository → Response
```

### Fase 5: Response Padronizado
Sempre retornar no padrão:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso",
  "meta": {
    "page": 1,
    "per_page": 15,
    "total": 100
  }
}
```

Em caso de erro:
```json
{
  "success": false,
  "message": "Mensagem descritiva do erro",
  "errors": {
    "field": ["validação que falhou"]
  },
  "code": "ERROR_CODE"
}
```

### Fase 6: Tratamento de Erros
- 400 Bad Request — validação de input falhou
- 401 Unauthorized — não autenticado
- 403 Forbidden — autenticado mas sem permissão
- 404 Not Found — recurso não encontrado
- 409 Conflict — conflito de estado (ex: email já existe)
- 422 Unprocessable Entity — dados semanticamente inválidos
- 429 Too Many Requests — rate limit excedido
- 500 Internal Server Error — erro inesperado

### Fase 7: Testes
1. Teste de sucesso (happy path)
2. Teste de validação de input (campos obrigatórios, formatos)
3. Teste de autorização (acesso negado)
4. Teste de recurso não encontrado
5. Teste de conflito (se aplicável)

### Fase 8: Documentação
Atualizar `docs/api/` com:
- Método e path
- Autenticação necessária
- Parâmetros de entrada
- Estrutura de resposta
- Exemplos de request/response
- Códigos de erro possíveis

## Checklist
- [ ] Path seguindo convenção REST
- [ ] Método HTTP correto para a operação
- [ ] Validação de input implementada
- [ ] Autorização implementada (não apenas autenticação)
- [ ] Response no padrão do projeto
- [ ] Tratamento de todos os erros possíveis
- [ ] Paginação implementada (para listagens)
- [ ] Rate limiting configurado (para endpoints públicos)
- [ ] Testes criados (happy path + erros)
- [ ] Documentação de API atualizada
- [ ] Sem dados sensíveis na resposta

## Formato Esperado da Resposta

```
## Endpoint criado: [MÉTODO] [path]

**Auth:** [público | autenticado | admin]
**Status de sucesso:** [200 | 201 | 204]

### Arquivos criados/alterados:
- routes/api.php — rota adicionada
- app/Http/Controllers/[Resource]Controller.php — controller
- app/Http/Requests/[Action][Resource]Request.php — validação
- app/Services/[Resource]Service.php — lógica de negócio
- tests/Feature/[Resource]Test.php — testes

### Contrato da API:
Request:
```json
{
  "field": "value"
}
```

Response (201):
```json
{
  "success": true,
  "data": { ... }
}
```

### Testes criados:
- [test 1]
- [test 2]
```

## Boas Práticas
- GET nunca deve ter body — use query params
- IDs em path params (/:id), filtros em query params (?filter=value)
- Versionar a API desde o início (/api/v1/)
- Sempre validar e sanitizar inputs antes de usar
- Retornar apenas os campos necessários (não o objeto inteiro do banco)

## Erros Comuns
- Verificar autenticação mas não autorização: usuário acessa dados de outro usuário
- Sem paginação em listagens: crash em produção
- Expor todos os campos do model: dados sensíveis na resposta
- Sem tratamento de 404: stack trace para o cliente
- Usar GET com body: não funciona em vários clientes HTTP

## Validações Finais
- [ ] Endpoint funciona com dados válidos?
- [ ] Retorna erro correto com dados inválidos?
- [ ] Autorização bloqueia acesso indevido?
- [ ] Resposta está no formato padrão do projeto?
- [ ] Documentação está atualizada?

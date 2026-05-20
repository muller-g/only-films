# Regras para NestJS

Regras específicas para projetos NestJS/TypeScript.

---

## Arquitetura de Módulos

```
OBRIGATÓRIO:
- Um módulo por domínio (users, orders, products)
- Controller: apenas HTTP handling, sem lógica de negócio
- Service: toda lógica de negócio
- Repository: todo acesso a dados
- DTO: toda validação de input
- Interface/Entity: tipos de domínio

ESTRUTURA DE MÓDULO:
src/[domain]/
  [domain].module.ts
  [domain].controller.ts
  [domain].service.ts
  [domain].repository.ts
  dto/create-[domain].dto.ts
  dto/update-[domain].dto.ts
  entities/[domain].entity.ts
  [domain].controller.spec.ts
  [domain].service.spec.ts
```

## TypeScript

```
OBRIGATÓRIO:
- TypeScript strict mode habilitado
- Interfaces para todos os contratos
- Sem 'any' sem comentário explicando
- Return types explícitos em funções públicas
- Enums para conjuntos de valores fixos
```

## DTOs e Validação

```typescript
// ValidationPipe global com whitelist e transform
app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // remove campos extras
    forbidNonWhitelisted: true, // erro se campo extra
    transform: true,           // converte tipos
}));

// DTO com class-validator
export class CreateUserDto {
    @IsString() @IsNotEmpty() @MaxLength(255) name: string;
    @IsEmail() email: string;
    @IsString() @MinLength(8) password: string;
}
```

## Guards e Segurança

```
- JwtAuthGuard em todos endpoints autenticados
- RolesGuard + @Roles() para controle de acesso
- ThrottlerGuard para rate limiting global
- Helmet para headers de segurança
- CORS configurado com origins explícitas
```

## Tratamento de Erros

```typescript
// Usar exceções HTTP do NestJS
throw new NotFoundException('Usuário não encontrado');
throw new ConflictException('Email já está em uso');
throw new BadRequestException('Dados inválidos');

// Exception filter global para resposta padronizada
@Catch()
export class AllExceptionsFilter implements ExceptionFilter { ... }
```

## Testes

```typescript
// Sempre usar Test.createTestingModule
// Mock de dependências com jest.fn()
// Não testar Controller sem Service mockado
const module = await Test.createTestingModule({
    providers: [
        UsersService,
        { provide: UsersRepository, useValue: { findByEmail: jest.fn() } },
    ],
}).compile();
```

## Swagger/OpenAPI

```
OBRIGATÓRIO em todos os controllers:
@ApiTags('users')          // agrupa no Swagger
@ApiOperation({ summary }) // descreve o endpoint
@ApiResponse({ status, description }) // documenta respostas
@ApiBearerAuth()           // indica auth necessária
```

---

*Versão: 1.0.0 — 2026-05*

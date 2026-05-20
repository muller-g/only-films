# SKILL: nestjs-development

**Name:** nestjs-development
**Description:** Desenvolvimento profissional com NestJS e TypeScript, seguindo arquitetura modular, injeção de dependência, decorators e padrões do ecossistema NestJS.
**Quando usar:** Ao trabalhar em qualquer projeto NestJS — APIs REST, GraphQL, microserviços, autenticação, CQRS ou workers.

---

## Processo Detalhado

1. Verificar a versão do NestJS (`cat package.json | grep @nestjs/core`)
2. Identificar a estrutura de módulos existente
3. Verificar o ORM em uso (TypeORM, Prisma, MikroORM)
4. Verificar a estratégia de autenticação (JWT, Passport)
5. Seguir a estrutura modular existente antes de criar novos módulos

---

## Padrões Obrigatórios

### Estrutura de Módulo
```
src/
  users/
    users.module.ts       # Módulo (registro de dependências)
    users.controller.ts   # Controller (entrada HTTP)
    users.service.ts      # Service (lógica de negócio)
    users.repository.ts   # Repository (acesso a dados)
    dto/
      create-user.dto.ts
      update-user.dto.ts
    entities/
      user.entity.ts
    users.controller.spec.ts
    users.service.spec.ts
```

### Module
```typescript
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService], // exportar apenas o que outros módulos precisam
})
export class UsersModule {}
```

### Controller
```typescript
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOperation({ summary: 'Listar usuários' })
    findAll(@Query() query: PaginationDto): Promise<PaginatedResult<User>> {
        return this.usersService.findAll(query);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }
}
```

### Service
```typescript
@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const exists = await this.usersRepository.findByEmail(createUserDto.email);
        if (exists) {
            throw new ConflictException('Email já está em uso');
        }
        return this.usersRepository.save(createUserDto);
    }

    async findAll(query: PaginationDto): Promise<PaginatedResult<User>> {
        return this.usersRepository.paginate(query);
    }
}
```

### DTO com Validação
```typescript
export class CreateUserDto {
    @ApiProperty({ example: 'João Silva' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({ example: 'joao@exemplo.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;
}
```

### Guards e Decorators
```typescript
// Guard de autenticação JWT
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        return super.canActivate(context);
    }
}

// Guard de roles
@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) return true;
        const { user } = context.switchToHttp().getRequest();
        return roles.includes(user.role);
    }
}

// Decorator de roles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

### Tratamento de Exceções
```typescript
// Usar exceções HTTP do NestJS
throw new NotFoundException('Usuário não encontrado');
throw new ConflictException('Email já está em uso');
throw new BadRequestException('Dados inválidos');
throw new UnauthorizedException('Não autenticado');
throw new ForbiddenException('Sem permissão');

// Exception Filter global
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        const status = exception.getStatus();
        response.status(status).json({
            success: false,
            statusCode: status,
            message: exception.message,
        });
    }
}
```

---

## Checklist de Quality Gate
```
[ ] Cada funcionalidade em seu próprio módulo
[ ] DTOs com class-validator para toda entrada
[ ] Guards em todos endpoints protegidos
[ ] Exception filter global configurado
[ ] Swagger/OpenAPI decorators nos controllers
[ ] Injeção de dependência (não instanciar diretamente)
[ ] Testes unitários com mocks para cada service
[ ] Pipes de validação global configurados
[ ] CORS configurado
[ ] Rate limiting em endpoints públicos
```

---

## Configuração Global (main.ts)
```typescript
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,        // remove campos não declarados no DTO
        forbidNonWhitelisted: true,
        transform: true,        // transforma tipos automaticamente
    }));

    app.useGlobalFilters(new HttpExceptionFilter());

    app.enableCors({ origin: process.env.ALLOWED_ORIGINS?.split(',') });

    const config = new DocumentBuilder()
        .setTitle('API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

    await app.listen(3000);
}
```

---

## Erros Comuns
- Não usar `ValidationPipe` global: DTOs sem validação
- Criar serviços sem `@Injectable()`: DI não funciona
- Importar módulos desnecessários: aumenta o bundle
- Não usar `whitelist: true` no ValidationPipe: campos extras entram

---

## Práticas Proibidas
- `any` em TypeScript sem justificativa documentada
- Lógica de negócio no controller
- Instanciar classes com `new` em vez de injeção de dependência
- Queries diretas ao banco no controller ou service sem repository

---

## Validações Finais
- [ ] `ValidationPipe` global configurado?
- [ ] Todos os DTOs com decorators de validação?
- [ ] Guards em endpoints protegidos?
- [ ] Exception filter tratando erros corretamente?
- [ ] Swagger documentando os endpoints?

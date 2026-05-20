# /create-auth-flow

## Objetivo
Criar um fluxo completo de autenticação e autorização, incluindo login, registro, refresh tokens, recuperação de senha, e controle de acesso por roles/permissões.

## Quando Usar
- Ao implementar autenticação em um novo projeto
- Ao adicionar autenticação a um projeto existente
- Ao revisar e melhorar um sistema de auth existente

## Entrada Esperada
```
/create-auth-flow

Stack: [Laravel Sanctum | Laravel Passport | NestJS JWT | Next.js Auth.js]
Tipo: [jwt | session | oauth | sanctum]
Roles: [sim | não — quais roles]
Permissões: [sim | não]
Social Login: [Google | GitHub | não]
2FA: [sim | não]
```

## Fluxos Implementados

### 1. Registro
```
POST /api/v1/auth/register
Body: { name, email, password, password_confirmation }
→ Validar dados
→ Verificar email único
→ Hash da senha (bcrypt/argon2)
→ Criar usuário
→ Enviar email de verificação
→ Retornar token (ou redirecionar para login)
```

### 2. Login
```
POST /api/v1/auth/login
Body: { email, password }
→ Validar credenciais
→ Verificar rate limiting (máx 5 tentativas por 15min)
→ Verificar email verificado (se obrigatório)
→ Gerar access token (expiração curta: 15min-1h)
→ Gerar refresh token (expiração longa: 7-30 dias)
→ Retornar { access_token, refresh_token, expires_in }
```

### 3. Refresh Token
```
POST /api/v1/auth/refresh
Body: { refresh_token }
→ Validar refresh token
→ Verificar se não foi revogado
→ Gerar novo access token
→ Rotacionar refresh token (opcional, mais seguro)
→ Retornar { access_token, expires_in }
```

### 4. Logout
```
POST /api/v1/auth/logout
Header: Authorization: Bearer {token}
→ Revogar token/sessão atual
→ Revogar refresh tokens associados
→ Retornar 204 No Content
```

### 5. Recuperação de Senha
```
POST /api/v1/auth/forgot-password
Body: { email }
→ Verificar se email existe (não revelar se não existe)
→ Gerar token de reset único com expiração (1h)
→ Enviar email com link
→ Retornar 200 independente do resultado

POST /api/v1/auth/reset-password
Body: { token, email, password, password_confirmation }
→ Validar token e expiração
→ Verificar email correspondente ao token
→ Atualizar senha
→ Revogar todos os tokens existentes
→ Enviar email de confirmação
```

### Implementação Laravel Sanctum

```php
// routes/api.php
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,15');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
});
```

```php
// app/Http/Controllers/AuthController.php
public function login(LoginRequest $request): JsonResponse
{
    if (!Auth::attempt($request->only('email', 'password'))) {
        throw new AuthenticationException('Credenciais inválidas');
    }

    $user = Auth::user();
    $token = $user->createToken('auth-token', ['*'], now()->addHours(1));

    return response()->json([
        'success' => true,
        'data' => [
            'access_token' => $token->plainTextToken,
            'token_type' => 'Bearer',
            'expires_at' => $token->accessToken->expires_at,
            'user' => UserResource::make($user),
        ],
    ]);
}
```

### Implementação NestJS JWT

```typescript
// auth.service.ts
async login(loginDto: LoginDto): Promise<AuthTokensDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = { sub: user.id, email: user.email, roles: user.roles };

    return {
        access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
        refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
        expires_in: 3600,
    };
}
```

### Controle de Acesso por Roles

```php
// Laravel — Gate/Policy
Gate::define('manage-users', function (User $user) {
    return in_array($user->role, ['admin', 'manager']);
});

// Em controller
$this->authorize('manage-users');
```

```typescript
// NestJS — Guards + Decorator
@Roles('admin', 'manager')
@UseGuards(JwtAuthGuard, RolesGuard)
@Delete(':id')
remove(@Param('id') id: string) { ... }
```

## Checklist
- [ ] Registro com validação e email de verificação
- [ ] Login com rate limiting (5 tentativas por 15min)
- [ ] Tokens com expiração curta (access) e longa (refresh)
- [ ] Logout revoga todos os tokens
- [ ] Recuperação de senha com token de expiração
- [ ] Não revelar se email existe em forgot-password
- [ ] Senhas hasheadas com bcrypt (fator 12+)
- [ ] HTTPS obrigatório
- [ ] Roles/permissões se necessário
- [ ] Testes de autenticação criados

## Validações Finais
- [ ] Login funciona com credenciais corretas?
- [ ] Login falha com credenciais incorretas?
- [ ] Rate limiting funciona após 5 tentativas?
- [ ] Logout invalida o token?
- [ ] Recuperação de senha funciona?
- [ ] Endpoints protegidos rejeita sem token?

# /security-audit

## Objetivo
Realizar auditoria de segurança completa baseada no OWASP Top 10 e nas melhores práticas de segurança para aplicações web, identificando vulnerabilidades e fornecendo recomendações de correção.

## Quando Usar
- Antes de lançar uma versão em produção
- Ao revisar código que lida com autenticação/autorização
- Ao auditar endpoints que recebem input de usuário
- Periodicamente como rotina de segurança
- Após integração com serviços externos

## Entrada Esperada
```
/security-audit

Escopo: [módulo | arquivo | feature | toda a aplicação]
Stack: [Laravel | NestJS | Next.js | etc.]
Foco: [autenticação | autorização | inputs | geral]
Arquivo(s): [lista de arquivos se auditoria focada]
```

## Processo Detalhado

### OWASP Top 10 — Checklist de Verificação

#### A01: Broken Access Control
```
[ ] Controle de acesso implementado em todos os endpoints protegidos
[ ] Verificação de ownership — usuário só acessa seus próprios dados
[ ] Roles e permissões granulares implementadas
[ ] Tokens JWT validados corretamente
[ ] IDOR (Insecure Direct Object Reference) prevenido
[ ] Endpoints administrativos protegidos
[ ] CORS configurado com lista branca de origens
[ ] Método HTTP restrito por endpoint
```

#### A02: Cryptographic Failures
```
[ ] Senhas hasheadas com bcrypt/argon2 (NUNCA MD5/SHA1)
[ ] HTTPS obrigatório em produção
[ ] Dados sensíveis em repouso criptografados
[ ] Certificados SSL/TLS válidos
[ ] Sem transmissão de dados sensíveis em GET (query params visíveis em logs)
[ ] Tokens de sessão com entropia suficiente
[ ] Secrets não armazenados em código ou variáveis de ambiente visíveis
```

#### A03: Injection
```
[ ] Prepared statements / ORM usado para queries SQL
[ ] Sem concatenação de input em SQL
[ ] Sem eval() ou exec() com input de usuário
[ ] Comandos shell sanitizados (escapeshellarg)
[ ] LDAP injection prevenido
[ ] XML injection / XXE prevenido
[ ] Template injection prevenido
```

#### A04: Insecure Design
```
[ ] Autenticação multi-fator para áreas críticas
[ ] Rate limiting em endpoints de login/registro
[ ] Bloqueio após tentativas falhas
[ ] Senha forte exigida
[ ] Expiração de tokens configurada
[ ] Invalidação de sessão no logout
[ ] Princípio do menor privilégio aplicado
```

#### A05: Security Misconfiguration
```
[ ] Debug mode DESABILITADO em produção
[ ] Stack traces não expostos para o usuário
[ ] Headers de segurança configurados (CSP, HSTS, X-Frame-Options)
[ ] Versões de software/framework atualizadas
[ ] Serviços desnecessários desabilitados
[ ] Senhas padrão alteradas
[ ] Listagem de diretórios desabilitada
[ ] Configuração de CORS restritiva
```

#### A06: Vulnerable and Outdated Components
```
[ ] Dependências auditadas (npm audit, composer audit)
[ ] Dependências atualizadas
[ ] CVEs conhecidas verificadas
[ ] Dependências desnecessárias removidas
[ ] Versões fixadas (não usar *)
```

#### A07: Identification and Authentication Failures
```
[ ] Brute force protection em login
[ ] Lockout após tentativas falhas
[ ] Recuperação de senha segura (token com expiração)
[ ] Não revelar se email existe ou não em "esqueci minha senha"
[ ] Tokens de sessão aleatórios e únicos
[ ] Invalidação de sessões antigas no login
[ ] Logout efetivo (invalidar token/sessão)
```

#### A08: Software and Data Integrity Failures
```
[ ] Integridade de pacotes verificada (checksums)
[ ] CI/CD pipeline com verificações de segurança
[ ] Deserialização segura
[ ] Assinaturas verificadas em webhooks externos
```

#### A09: Security Logging and Monitoring Failures
```
[ ] Tentativas de login falhas logadas
[ ] Acessos a recursos sensíveis logados
[ ] Erros de autorização logados
[ ] Logs centralizados e monitorados
[ ] Alertas para atividade suspeita
[ ] Logs com contexto suficiente (IP, user_id, timestamp)
[ ] Logs sem dados sensíveis (senha, token)
```

#### A10: Server-Side Request Forgery (SSRF)
```
[ ] URLs externas validadas antes de requisição
[ ] Lista branca de domínios permitidos
[ ] Metadados de cloud (169.254.x.x) bloqueados
[ ] Timeouts configurados para requisições externas
```

### Verificações Adicionais para APIs REST
```
[ ] Rate limiting implementado
[ ] Autenticação em endpoints que precisam
[ ] Paginação obrigatória em listagens
[ ] Filtros não permitem exposição de dados de outros usuários
[ ] IDs não previsíveis (UUID vs inteiro sequencial)
[ ] Versioning de API implementado
[ ] Documentação de API não exposta em produção
```

### Verificações Específicas para Upload de Arquivos
```
[ ] Tipo de arquivo validado (não apenas extensão)
[ ] Tamanho máximo definido
[ ] Arquivos armazenados fora da pasta pública
[ ] Nome do arquivo sanitizado (não usar nome original)
[ ] Virus scan configurado (se crítico)
[ ] Content-Type verificado
```

## Checklist de Verificação de Código

### PHP/Laravel
```php
// ❌ Vulnerável — SQL injection
DB::select("SELECT * FROM users WHERE email = '" . $email . "'");

// ✅ Seguro
DB::select("SELECT * FROM users WHERE email = ?", [$email]);
User::where('email', $email)->first(); // ORM

// ❌ Sem autorização
public function show($id) {
    return Post::find($id);
}

// ✅ Com autorização
public function show(Post $post) {
    $this->authorize('view', $post); // verifica se usuário pode ver ESTE post
    return $post;
}
```

### TypeScript/NestJS
```typescript
// ❌ Sem guard
@Get(':id')
findOne(@Param('id') id: string) { ... }

// ✅ Com guard e ownership check
@UseGuards(JwtAuthGuard, OwnershipGuard)
@Get(':id')
findOne(@Param('id') id: string, @CurrentUser() user: User) { ... }
```

## Formato Esperado da Resposta

```
## Relatório de Segurança — [escopo]

**Data:** [data]
**Risco geral:** [CRÍTICO | ALTO | MÉDIO | BAIXO]

---

### Vulnerabilidades Críticas 🔴
[Devem ser corrigidas IMEDIATAMENTE]

**[VULN-001] SQL Injection em UserController.php:45**
- Risco: CRÍTICO
- Vetor: Input direto em query SQL
- Impacto: Exposição total do banco de dados
- Correção:
```php
// código corrigido
```

---

### Vulnerabilidades Altas 🟠
[Devem ser corrigidas antes do próximo deploy]

**[VULN-002] Ausência de rate limiting no endpoint de login**
- Risco: ALTO
- Impacto: Brute force attack possível
- Correção: Implementar throttle middleware

---

### Vulnerabilidades Médias 🟡
[Devem ser corrigidas no próximo sprint]

---

### Observações Positivas ✅
[O que está bem implementado]

---

### Recomendações Gerais
1. [recomendação 1]
2. [recomendação 2]
```

## Boas Práticas
- Segurança deve ser revisada em cada PR, não apenas em auditorias periódicas
- Vulnerabilidades críticas bloqueiam deploy
- Manter dependências atualizadas é segurança básica
- Logs de segurança devem ser monitorados ativamente

## Erros Comuns
- Verificar autenticação mas não autorização: "estou logado mas acesso dados de outro"
- Rate limiting apenas em login: não protege registro e recuperação de senha
- Logs sem IP/user_id: impossível investigar incidentes
- Debug mode em produção: stack trace exposto para atacantes

## Validações Finais
- [ ] Todas as vulnerabilidades críticas foram corrigidas?
- [ ] O relatório está documentado e rastreável?
- [ ] As correções foram testadas?
- [ ] Um ADR foi criado para mudanças de segurança significativas?

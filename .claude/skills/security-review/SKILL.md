# SKILL: security-review

**Name:** security-review
**Description:** Revisão de segurança de aplicações web baseada no OWASP Top 10, análise de autenticação, autorização, inputs, dependências e configurações de segurança.
**Quando usar:** Ao auditar segurança de uma aplicação, revisar código com potencial de vulnerabilidade ou preparar para um pentest.

---

## Framework de Análise

Seguir o OWASP Top 10 2021 como base de análise:

### A01 — Broken Access Control
```
Verificar:
- Usuário acessa dados de outro usuário (IDOR)
- Endpoints sem verificação de autorização
- Roles não verificadas antes de operações privilegiadas
- JWT não validado ou com algoritmo fraco
- CORS muito permissivo (*)
```

### A02 — Cryptographic Failures
```
Verificar:
- Senhas com bcrypt/argon2 (mínimo custo 12)
- HTTPS em todos os ambientes
- Dados sensíveis criptografados em repouso
- Tokens com entropia adequada
- Sem transmissão de dados sensíveis em GET
```

### A03 — Injection
```
Verificar:
- SQL: prepared statements em todas as queries
- Sem concatenação de input em SQL
- Sem eval/exec com input de usuário
- Comandos shell com escapeshellarg
- Output HTML escapado (XSS)
```

### A07 — Authentication Failures
```
Verificar:
- Rate limiting em login (máx 5 tentativas/15min)
- Lockout após tentativas excessivas
- Tokens com expiração adequada
- Invalidação no logout
- Recuperação de senha com token único e expiração
- Não revelar se email existe em forgot-password
```

---

## Padrões de Código Seguros

### PHP/Laravel
```php
// ✅ Seguro
$user = User::where('email', $email)->first(); // ORM
DB::select('SELECT * FROM users WHERE id = ?', [$id]); // Prepared

// ❌ Vulnerável
$user = DB::select("SELECT * FROM users WHERE email = '" . $email . "'");
```

### TypeScript/Node.js
```typescript
// ✅ Seguro
const user = await userRepo.findOne({ where: { email } }); // TypeORM

// ❌ Vulnerável
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## Checklist Completo
```
CRÍTICO (bloqueia deploy):
[ ] Sem SQL injection
[ ] Senhas hasheadas com bcrypt/argon2
[ ] Todos endpoints protegidos com auth e autorização
[ ] HTTPS em produção
[ ] Sem secrets no código

ALTO (corrigir antes do release):
[ ] Rate limiting em endpoints sensíveis
[ ] Headers de segurança configurados (CSP, HSTS)
[ ] Inputs validados e sanitizados
[ ] File upload com validação de tipo e tamanho
[ ] Sem debug mode em produção

MÉDIO (planejar correção):
[ ] Dependências sem CVEs críticos
[ ] Logs sem dados sensíveis
[ ] IDs não sequenciais para recursos sensíveis
```

---

## Erros Comuns
- Verificar autenticação mas não autorização
- Rate limiting apenas no login (esquecer register, forgot-password)
- Aceitar qualquer content-type em upload
- Debug mode ativo em produção

---

## Validações Finais
- [ ] OWASP Top 10 verificado?
- [ ] Todas vulnerabilidades críticas corrigidas?
- [ ] Dependências auditadas?
- [ ] Relatório documentado?

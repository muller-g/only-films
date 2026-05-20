# Regras de Segurança

Regras de segurança obrigatórias para todos os projetos.
Baseadas no OWASP Top 10 2021.

---

## Regras Invioláveis

```
1. Nunca hardcodar credenciais, tokens ou chaves em código
2. Nunca commitar arquivo .env com valores reais
3. Nunca usar eval()/exec() com input de usuário
4. Nunca concatenar input em queries SQL
5. Nunca logar dados sensíveis (senha, token, CPF, cartão)
6. Nunca expor stack traces para o usuário final
7. Nunca desabilitar SSL/TLS sem documentação e aprovação
8. Nunca usar MD5 ou SHA1 para hashing de senhas
```

---

## A01 — Controle de Acesso

```
OBRIGATÓRIO:
- Verificar autenticação E autorização em endpoints protegidos
- Owner-check: usuário só acessa seus próprios recursos
- Roles e permissões granulares implementadas
- IDOR prevenido (não expor IDs previsíveis para recursos sensíveis)
- CORS com lista branca explícita

VERIFICAR:
- Todo endpoint com dados de usuário tem owner-check?
- Admins têm acesso restrito ao necessário?
- Logs de acesso negado implementados?
```

## A02 — Falhas Criptográficas

```
OBRIGATÓRIO:
- Senhas com bcrypt (fator ≥ 12) ou argon2id
- HTTPS em staging e produção
- Certificados SSL válidos
- Dados sensíveis em repouso criptografados
- Tokens com entropia ≥ 128 bits

PROIBIDO:
- MD5, SHA1, SHA256 para senhas
- HTTP em qualquer ambiente
- Dados sensíveis em GET (aparecem em logs)
- Tokens previsíveis ou de baixa entropia
```

## A03 — Injection

```
PHP/Laravel:
✅ User::where('email', $email)->first()          // ORM
✅ DB::select('SELECT * FROM users WHERE id = ?', [$id])  // Prepared
❌ DB::select("SELECT * FROM users WHERE id = $id")       // Vulnerável

TypeScript/Node:
✅ repo.findOne({ where: { email } })              // TypeORM
✅ db.query('SELECT * FROM users WHERE id = $1', [id])    // Prepared
❌ db.query(`SELECT * FROM users WHERE id = ${id}`)       // Vulnerável
```

## A04 — Design Inseguro

```
- Rate limiting em login (máx 5 tentativas/15min)
- Bloqueio de conta após tentativas excessivas
- Token de recuperação de senha com expiração (≤ 1h)
- 2FA disponível para áreas críticas
- Logs de tentativas de acesso suspeitas
```

## A05 — Configuração Incorreta

```
PRODUÇÃO:
- APP_DEBUG=false
- APP_ENV=production
- Stack traces não expostos
- Headers de segurança configurados:
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security: max-age=63072000
  - Content-Security-Policy: configurada
  - X-XSS-Protection: 1; mode=block
```

## A06 — Componentes Vulneráveis

```
OBRIGATÓRIO:
- Executar `npm audit` e `composer audit` regularmente
- CVEs críticos corrigidos antes do deploy
- Dependências com versão fixada (não usar *)
- Remover dependências não utilizadas
```

## A07 — Falhas de Autenticação

```
- Rate limiting: máx 5 tentativas de login por 15 minutos
- Não revelar se email existe ou não no forgot-password
- Tokens JWT com expiração curta (access: 1h, refresh: 30d)
- Invalidar todos os tokens no logout
- Rotação de refresh tokens (recomendado)
```

## A09 — Logging e Monitoramento

```
LOGAR (com contexto: IP, user_id, timestamp):
- Tentativas de login (sucesso e falha)
- Acesso a recursos sensíveis
- Erros de autorização
- Erros de validação suspeitos

NÃO LOGAR:
- Senhas (mesmo erradas)
- Tokens completos
- Dados de cartão
- CPF ou documentos sensíveis
- Dados pessoais de saúde
```

---

## Upload de Arquivos

```
OBRIGATÓRIO:
- Validar tipo MIME (não apenas extensão)
- Limitar tamanho máximo
- Armazenar fora da pasta pública
- Renomear arquivo (não usar nome original)
- Scan de vírus para arquivos críticos

PROIBIDO:
- Executar arquivos enviados pelo usuário
- Servir arquivos com Content-Type original não confiável
```

---

## Checklist de Segurança por Feature

```
[ ] Input validado e sanitizado
[ ] SQL injection prevenido (ORM ou prepared statements)
[ ] XSS prevenido (escapar output HTML)
[ ] Autenticação verificada
[ ] Autorização verificada (não apenas autenticação)
[ ] Dados sensíveis não expostos na resposta
[ ] Rate limiting em endpoints públicos
[ ] Logs sem dados sensíveis
[ ] Testes de segurança criados
```

---

*Versão: 1.0.0 — 2026-05*

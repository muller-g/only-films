# Regras para Node.js

Regras específicas para projetos Node.js (sem NestJS).

---

## TypeScript

```
OBRIGATÓRIO:
- TypeScript em modo strict
- Interfaces para tipos de domínio
- Zod para validação de runtime
- Return types explícitos em funções públicas
- Sem any sem justificativa documentada
```

## Async/Await

```
OBRIGATÓRIO:
- async/await em vez de callbacks
- Wrapper asyncHandler para Express
- try/catch apenas em funções de domínio
- Error handler global no Express/Fastify

PROIBIDO:
- Callbacks aninhados (callback hell)
- Promise.then().catch() aninhados
- Esquecer await em operações assíncronas
```

## Variáveis de Ambiente

```typescript
// Validar com Zod no startup
const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'staging', 'production']),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
});

export const env = EnvSchema.parse(process.env);
// Erro no startup se variável ausente — melhor que falha silenciosa
```

## Graceful Shutdown

```typescript
// OBRIGATÓRIO em produção
process.on('SIGTERM', async () => {
    await server.close();
    await db.end();
    process.exit(0);
});
```

## Segurança

```
- Helmet para headers de segurança
- express-rate-limit para rate limiting
- cors com lista branca
- Validação de input em toda rota
- Sem eval() ou Function() com input externo
```

## Logs

```
- pino (recomendado) ou winston
- Formato JSON em produção
- Sem console.log em produção
- request_id propagado
```

---

*Versão: 1.0.0 — 2026-05*

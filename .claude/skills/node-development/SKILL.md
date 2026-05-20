# SKILL: node-development

**Name:** node-development
**Description:** Desenvolvimento profissional com Node.js e TypeScript, cobrindo APIs Express/Fastify, gerenciamento de processos, streams, workers e boas práticas do ecossistema Node.
**Quando usar:** Ao trabalhar em projetos Node.js puros (sem NestJS) — APIs, scripts, workers, CLIs ou serviços de integração.

---

## Padrões Obrigatórios

### Estrutura de Projeto
```
src/
  routes/          # Definição de rotas
  controllers/     # Handlers de request/response
  services/        # Lógica de negócio
  repositories/    # Acesso a dados
  middleware/      # Middlewares Express/Fastify
  validators/      # Validação de input (Zod)
  types/           # TypeScript types/interfaces
  utils/           # Utilitários
  config/          # Configurações da aplicação
index.ts           # Entry point
```

### Express com TypeScript
```typescript
import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

// Schema de validação
const CreateUserSchema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().email(),
    password: z.string().min(8),
});

// Middleware de validação
const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({ success: false, errors: result.error.flatten() });
    }
    req.body = result.data;
    next();
};

// Route
app.post('/api/v1/users', validate(CreateUserSchema), async (req, res) => {
    const user = await usersService.create(req.body);
    res.status(201).json({ success: true, data: user });
});
```

### Tratamento de Erros Global
```typescript
// Middleware de erro global (deve ser o último)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error({ err, path: req.path, method: req.method });

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }

    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
});
```

### Async/Await com tratamento de erro
```typescript
// Wrapper para eliminar try/catch repetitivo
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/api/v1/users', asyncHandler(async (req, res) => {
    const users = await usersService.findAll();
    res.json({ success: true, data: users });
}));
```

### Graceful Shutdown
```typescript
process.on('SIGTERM', async () => {
    await server.close();
    await db.disconnect();
    process.exit(0);
});
```

---

## Checklist de Quality Gate
```
[ ] TypeScript em strict mode
[ ] Validação com Zod em todas as entradas
[ ] Error handler global configurado
[ ] Graceful shutdown implementado
[ ] Variáveis de ambiente com zod schema
[ ] Rate limiting configurado
[ ] Helmet para headers de segurança
[ ] CORS configurado
[ ] Logs estruturados (pino ou winston)
[ ] Testes com Jest ou Vitest
```

---

## Erros Comuns
- Callbacks em vez de async/await
- Sem error handler global (erros não capturados)
- `process.env.X` sem validação (undefined em runtime)
- Sem graceful shutdown (requests perdidas no deploy)

---

## Validações Finais
- [ ] Validação em todas as entradas?
- [ ] Error handling global?
- [ ] Graceful shutdown?
- [ ] TypeScript strict?

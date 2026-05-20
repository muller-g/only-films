# Débito Técnico

> Gerado em: 2026-05-19
> Última revisão: 2026-05-19

---

## Itens Identificados

| Severidade | Descrição | Localização | Impacto |
|---|---|---|---|
| ALTA | `POST /api/create-review` sem autenticação — qualquer usuário anônimo pode criar reviews | `api/src/infra/http/api/ReviewController.ts:18` | Usuários não registrados podem poluir o banco e explorar a API |
| ALTA | CORS aberto para qualquer origem (`origin: '*'`) | `api/src/infra/server.ts:12` | Qualquer domínio pode fazer requisições autenticadas via browser |
| ALTA | JWT secret com fallback para string vazia: `process.env.JWT_SECRET \|\| ''` | `api/src/infra/http/middleware/EnsureUserToken.ts:17` | Se `JWT_SECRET` não estiver no `.env`, tokens são assinados com secret vazio e qualquer token é válido |
| ALTA | Zero testes no backend — script de teste retorna erro imediatamente | `api/package.json` | Regressões passam despercebidas; sem CI confiável |
| ALTA | Endpoints de listagem sem paginação (`/all-reviews`, `/all-movies`, `/users`) | `ReviewController.ts`, `UserController.ts`, `MovieController.ts` | Com crescimento do banco, queries retornam todos os registros — risco de timeout e estouro de memória |
| MÉDIA | Sem validação de tipo MIME no upload de arquivos — Multer aceita qualquer extensão | `api/src/service/multer.ts` | Upload de scripts maliciosos ou arquivos inesperados |
| MÉDIA | `req: any` em vários controllers — perde type safety do Express | `ReviewController.ts:81`, `MovieController.ts:17` | Bugs de tipagem não detectados em compile time |
| MÉDIA | Controllers registram rotas via constructor com side effects | `api/src/main.ts` | Dificulta testes unitários e substituição de implementação |
| MÉDIA | `POST /api/create-review` cria filme E review num mesmo endpoint — viola Single Responsibility | `ReviewController.ts:19-74` | Lógica acoplada; difícil de testar, manter e evoluir separadamente |
| MÉDIA | Sem arquivo central de rotas — registros espalhados nos constructors de cada controller | `api/src/main.ts` | Dificulta auditoria de rotas, aplicação de middleware global e organização |
| MÉDIA | Páginas com 400+ linhas sem extração de componentes reutilizáveis | `front/src/pages/AddMovie.tsx` (426), `Profile.tsx` (423), `AddReview.tsx` (410) | Alta complexidade por arquivo; difícil de manter e testar |
| BAIXA | Typo no objeto de contexto JWT: campo `toke` em vez de `token` | `api/src/infra/http/middleware/EnsureUserToken.ts:23` | Acesso ao token via `req.context.token` retorna undefined em controllers |
| BAIXA | Script de build do frontend usa `sudo` e deploya diretamente em `/var/www/html` | `front/package.json` | Acoplamento entre desenvolvimento e ambiente de produção; risco de sobrescrever arquivos inesperados |
| BAIXA | Rota `/admin-dashboard` protegida apenas por `ProtectedRoute` sem verificação de role no frontend | `front/src/App.tsx:42` | Qualquer usuário autenticado pode acessar a URL do admin (o backend ainda valida, mas UX e segurança em profundidade falham) |
| BAIXA | Apenas 1 teste no frontend (padrão CRA boilerplate) — cobertura efetiva zero | `front/src/App.test.tsx` | Regressões visuais e de fluxo não detectadas |
| BAIXA | `README.md` contém apenas screenshots sem instruções de setup | `README.md` | Onboarding de novos desenvolvedores depende de conhecimento tácito |

---

## Recomendações Priorizadas

1. **Proteger `POST /api/create-review` com `EnsureUserToken.validate`** — endpoint público permite criação de reviews sem autenticação (risco imediato de abuso)
2. **Corrigir o fallback do JWT secret** — remover `|| ''` e garantir startup com erro explícito se `JWT_SECRET` não estiver configurado
3. **Restringir CORS** — substituir `origin: '*'` pela URL exata do frontend (`FRONTEND_URL` já está no `.env`)
4. **Adicionar paginação** nos endpoints de listagem (`/all-reviews`, `/all-movies`, `/users`) antes de crescer o volume
5. **Adicionar validação de tipo MIME no Multer** — aceitar apenas `image/jpeg`, `image/png`, `image/webp`
6. **Separar criação de filme e review** — mover lógica de criação de filmes para `MovieController`
7. **Criar testes de integração** para os endpoints críticos: auth, create-review, create-movie, delete
8. **Adicionar guard de role no frontend** para `/admin-dashboard`
9. **Corrigir typo** `toke` → `token` em `EnsureUserToken`
10. **Extrair componentes** das páginas grandes (`AddMovie`, `Profile`, `AddReview`) para melhorar manutenibilidade

---

*Este documento deve ser atualizado sempre que itens forem resolvidos ou novos débitos identificados.*

# Arquitetura do Sistema

## Visão Geral

- **Stack:** Node.js + Express + TypeScript + Prisma / React 19 + Tailwind CSS
- **Tipo:** Monólito fullstack — API REST separada de SPA React
- **Banco de dados:** PostgreSQL (porta 5434) via Prisma ORM
- **Tamanho estimado:** ~5.164 linhas (1.282 API + 3.882 frontend)
- **Maturidade:** Em desenvolvimento ativo — MVP funcional com débitos técnicos relevantes

---

## Arquitetura de Camadas

```
┌──────────────────────────────────┐
│         React 19 (SPA)           │
│  AuthContext · React Router 7    │
│  Tailwind CSS · SweetAlert2      │
└──────────────┬───────────────────┘
               │ HTTP / JWT Bearer
               ▼
┌──────────────────────────────────┐
│   Express API  (porta 3001)      │
│                                  │
│  Controller → Service → Prisma   │
│  EnsureUserToken (middleware)    │
│  Multer (upload) · Winston (log) │
└──────────────┬───────────────────┘
               │
       ┌───────┴──────────┐
       ▼                  ▼
 PostgreSQL           TMDB API
 (porta 5434)     (filmes/séries)
```

Organização interna da API em `src/infra/http/`:

| Subdiretório | Responsabilidade |
|---|---|
| `api/` | Controllers — entrada HTTP, sem lógica de negócio |
| `service/` | Services — lógica de domínio |
| `middleware/` | Autenticação JWT (`EnsureUserToken`) |
| `database/` | Cliente Prisma singleton |

---

## Módulos Principais

| Módulo | Responsabilidade | Localização |
|---|---|---|
| Auth | Login, JWT, reset de senha por email (Nodemailer/Brevo) | `api/src/infra/http/api/LoginController.ts` |
| Users | Registro, perfil, foto de perfil, listagem | `api/src/infra/http/api/UserController.ts` |
| Movies | CRUD de filmes/séries, upload de capa, busca | `api/src/infra/http/api/MovieController.ts` |
| Reviews | Criar, listar, deletar reviews com rating e season | `api/src/infra/http/api/ReviewController.ts` |
| Admin | Dashboard com dados agregados | `api/src/infra/http/api/AdminController.ts` |
| TMDB | Integração com The Movie Database API | `api/src/infra/http/api/TmdbApiController.ts` |
| Genres | Sincronização de gêneros de filmes e séries | `api/src/infra/http/api/MovieGenresController.ts` |
| AuthContext | Estado de autenticação global no frontend | `front/src/contexts/AuthContext.tsx` |
| Pages | 12 páginas React com Tailwind CSS | `front/src/pages/` |

---

## Fluxo de Dados

```
Usuário → React Page
  → axios (HTTP com Bearer token)
  → Express Controller
  → Service (lógica de negócio)
  → Prisma Client
  → PostgreSQL

Upload de arquivos:
  → Multer middleware
  → salvo em uploads/movies/ ou uploads/users/
  → referência salva em ImageFile (banco)
  → servido via express.static('/uploads')

Integração TMDB:
  → axios para api.themoviedb.org
  → retorna dados de filmes/séries/gêneros
  → gêneros sincronizados localmente no banco
```

---

## Integrações Externas

| Serviço | Propósito | Configuração |
|---|---|---|
| TMDB API | Busca de filmes, séries e gêneros | `TMDB_API_KEY` no `.env` |
| Brevo SMTP | Envio de email (reset de senha) | `NODEMAILER_MAIL` + `NODEMAILER_PASS` no `.env` |
| PostgreSQL | Banco de dados relacional | `DATABASE_URL` no `.env` |

---

## Pontos de Entrada

**API (porta 3001):**
- `POST /api/register` — cadastro de usuário
- `POST /api/login` — autenticação
- `POST /api/reset-password` — solicitar reset de senha
- `POST /api/reset-new-password` — confirmar nova senha
- `POST /api/create-review` — criar review (⚠️ sem auth)
- `POST /api/create-movie` — criar filme
- `GET /api/movie/:id` — detalhes do filme
- `GET /api/all-movies` — listar todos os filmes
- `GET /api/user-reviews/:userId` — reviews por usuário
- `GET /api/review/:movieId` — reviews por filme
- `GET /api/search-movies?title=` — busca de filmes
- `GET /api/profile/:id` — perfil do usuário
- `GET /api/admin-dashboard` — dados administrativos
- `DELETE /api/reviews/:id` — deletar review (admin)
- `DELETE /api/movies/:id` — deletar filme (admin)

**Frontend (porta 3000):**
- `/` — Home pública
- `/login` — Login
- `/register` — Registro
- `/reset-password` — Reset de senha
- `/dashboard` — Dashboard (autenticado)
- `/admin-dashboard` — Admin (autenticado, sem guard de role)
- `/add-review` — Criar review (autenticado)
- `/add-movie` — Adicionar filme (autenticado)
- `/profile` — Perfil do usuário (autenticado)
- `/my-reviews` — Reviews do usuário (autenticado)
- `/all-reviews` — Todos os filmes (autenticado)
- `/movie/:id` — Detalhes do filme (autenticado)

---

## Pontos Fortes

- Separação clara entre controllers (HTTP) e services (lógica) — controllers não contêm regras de negócio
- Prisma com migrations versionadas e schema explícito
- Winston configurado para logging estruturado
- Autenticação JWT funcional com middleware aplicado nas rotas protegidas
- `ProtectedRoute` no frontend cobrindo todas as rotas autenticadas
- TypeScript strict mode habilitado em ambas as aplicações
- Integração TMDB isolada em controller/service próprio
- Schema com UUIDs como PKs e soft-delete disponível no Prisma

---

## Mapa de Navegação

```
Autenticação         → api/src/infra/http/api/LoginController.ts
                       api/src/infra/http/service/LoginService.ts
                       api/src/infra/http/middleware/EnsureUserToken.ts

Lógica de filmes     → api/src/infra/http/service/MovieService.ts
Lógica de reviews    → api/src/infra/http/service/ReviewService.ts
Lógica de usuários   → api/src/infra/http/service/UserService.ts

Schema do banco      → api/prisma/schema.prisma
Migrations           → api/prisma/migrations/

Cliente Prisma       → api/src/infra/database/client.ts
Upload de arquivos   → api/src/service/multer.ts
Logging              → api/src/service/WinstonLogger.ts

Registro de rotas    → api/src/main.ts (via construtores dos controllers)
Config do servidor   → api/src/infra/server.ts

Estado de auth       → front/src/contexts/AuthContext.tsx
Roteamento frontend  → front/src/App.tsx
Componentes globais  → front/src/components/ (Navbar, Footer, ProtectedRoute)
Páginas principais   → front/src/pages/
Estilos globais      → front/src/index.css, front/src/css/
```

---

*Gerado em: 2026-05-19*
*Versão: 1.0.0*

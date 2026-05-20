# SKILL: docker-devops

**Name:** docker-devops
**Description:** Containerização com Docker, orquestração com Docker Compose, pipelines CI/CD, configuração de Nginx e práticas de DevOps para aplicações web.
**Quando usar:** Ao dockerizar um projeto, configurar CI/CD, configurar Nginx, fazer deploy ou gerenciar infraestrutura de containers.

---

## Padrões Obrigatórios

### Dockerfile — Boas Práticas
```dockerfile
# Multi-stage build para imagem menor
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner
WORKDIR /app
# Usuário não-root (segurança)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER appuser
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### .dockerignore
```
node_modules
.git
.env
*.log
dist
coverage
.DS_Store
README.md
```

### docker-compose.yml — Padrões
```yaml
version: '3.9'

services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
    env_file: .env
    depends_on:
      db:
        condition: service_healthy  # Aguarda healthcheck
    restart: unless-stopped
    networks: [app-network]

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks: [app-network]

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

### CI/CD com GitHub Actions
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
```

---

## Checklist de Quality Gate
```
[ ] Dockerfile com multi-stage build
[ ] .dockerignore criado
[ ] Usuário não-root nas imagens
[ ] Healthchecks em todos os serviços
[ ] Volumes para dados persistentes
[ ] Variáveis de ambiente via .env (não hardcoded)
[ ] Imagens com tags específicas (não latest em produção)
[ ] CI/CD com testes automáticos
[ ] Rollback planejado
[ ] Secrets no CI gerenciados com Secrets (não no código)
```

---

## Erros Comuns
- Rodar como root no container
- Sem .dockerignore (node_modules copiados)
- Usar :latest em produção (sem reprodutibilidade)
- Sem healthchecks (container "up" mas não funcional)
- Secrets no docker-compose.yml commitado

---

## Validações Finais
- [ ] Imagem com multi-stage build?
- [ ] Container roda como non-root?
- [ ] Healthchecks configurados?
- [ ] CI executa testes antes de deploy?

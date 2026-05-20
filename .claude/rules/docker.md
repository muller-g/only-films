# Regras para Docker

Padrões para containerização de aplicações.

---

## Dockerfile

```
OBRIGATÓRIO:
- Multi-stage build (menor imagem final)
- Usuário não-root para execução
- .dockerignore criado
- Dependências instaladas antes de copiar o código
- Imagens base com versão fixada (não :latest em produção)
- EXPOSE documenta a porta
- Healthcheck definido

PROIBIDO:
- Rodar como root
- Secrets no Dockerfile ou imagem
- :latest em produção
- node_modules ou vendor copiados sem .dockerignore
```

## docker-compose

```
OBRIGATÓRIO:
- Healthchecks em serviços com dependências
- depends_on com condition: service_healthy
- Volumes nomeados para dados persistentes
- Networks customizadas (não usar default)
- Variáveis de ambiente via env_file ou environment
- restart: unless-stopped em produção

PROIBIDO:
- Secrets hardcoded no docker-compose.yml
- Commitar docker-compose.prod.yml com secrets
- Portas desnecessárias expostas em produção
```

## Segurança

```
- Imagens verificadas (Docker Hub oficial ou trusted)
- Scan de vulnerabilidades nas imagens (trivy, snyk)
- Sem secrets em variáveis de ambiente de build (usam em runtime)
- Rede limitada entre serviços (não expor DB para fora)
```

## Performance de Build

```
# Copiar dependências antes do código (aproveita cache)
COPY package.json package-lock.json ./
RUN npm ci

COPY . .  # Apenas depois de instalar dependências
```

---

*Versão: 1.0.0 — 2026-05*

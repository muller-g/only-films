# Deploy: Migração de Produção para Docker

Guia para mover o ambiente de produção atual (bare-metal) para Docker sem perda de dados.

---

## Visão geral

A produção atual roda com:
- Node.js/Express diretamente no servidor
- PostgreSQL instalado nativamente
- Arquivos de upload em `api/uploads/`

O objetivo é migrar para o `docker-compose.yml` existente preservando todos os dados.

---

## Pré-requisitos no servidor de produção

```bash
# Verificar dependências necessárias
which pg_dump psql docker

# Instalar pg_dump se necessário (Debian/Ubuntu)
apt install postgresql-client

# Instalar Docker se necessário
curl -fsSL https://get.docker.com | bash
```

---

## Passo 1: Verificar segurança das migrations

Antes de qualquer coisa, verifique se as novas migrations locais são seguras para aplicar sobre o banco de produção existente.

```bash
# No servidor de produção, na raiz do projeto
./scripts/check-migration-safety.sh

# Ou para verificar contra o banco Docker local
./scripts/check-migration-safety.sh --local
```

**O que o script verifica:**
- Colunas adicionadas sem `DEFAULT` e sem `NULL` → perigoso (pode quebrar dados existentes)
- Colunas adicionadas como `NULL` ou com `DEFAULT` → seguro
- `DROP COLUMN` / `DROP TABLE` → requer confirmação manual
- `ALTER COLUMN TYPE` → requer confirmação manual
- `CREATE TABLE` → sempre seguro

**Estado atual das migrations pendentes (v2026-02):**
Todas as colunas novas são nullable ou têm default — seguras para aplicar.

---

## Passo 2: Fazer o deploy

```bash
# Na raiz do projeto no servidor de produção
./scripts/prod-to-docker.sh
```

O script executa automaticamente:

1. Verifica pré-requisitos
2. Lê `DATABASE_URL` do arquivo `api/.env`
3. Cria um dump do PostgreSQL nativo com `pg_dump`
4. Sobe o container `db` do Docker
5. Restaura o dump no banco Docker
6. Sobe todos os containers (`api`, `front`, `db`)
7. O container `api` executa `prisma migrate deploy` automaticamente via `entrypoint.sh`
8. Copia os uploads para o volume Docker

### Opções disponíveis

```bash
# Caminho customizado para uploads (se não estiver em api/uploads)
./scripts/prod-to-docker.sh --uploads-path /var/www/html/api/uploads

# Simular sem executar nada
./scripts/prod-to-docker.sh --dry-run

# Pular migração de uploads
./scripts/prod-to-docker.sh --skip-uploads

# Pular migração do banco (só sobe os containers, útil se já migrou o banco)
./scripts/prod-to-docker.sh --skip-db
```

---

## Passo 3: Verificar após o deploy

```bash
# Status dos containers
docker compose ps

# Logs da API (verificar se migrate deploy rodou sem erros)
docker logs cine-review-api --tail 50

# Testar conectividade
curl http://localhost:3001/health

# Verificar banco dentro do container
docker exec -it cine-review-db psql -U postgres -d cine-review -c "\dt"
```

---

## Passo 4: Atualizar Nginx

O Docker expõe as portas:
- `3001` → API
- `3000` → Frontend

Atualize o Nginx para proxy reverso:

```nginx
# Substituir o upstream que apontava para o processo nativo
upstream api {
    server 127.0.0.1:3001;
}

upstream front {
    server 127.0.0.1:3000;
}
```

---

## Passo 5: Parar o PostgreSQL nativo (após validar)

Após confirmar que tudo funciona no Docker:

```bash
# Parar o serviço nativo
systemctl stop postgresql
systemctl disable postgresql  # opcional: impede reinício automático
```

> **Atenção:** Só faça isso após validar completamente a aplicação no Docker.

---

## Por que as migrations não quebram dados existentes

O Prisma usa `prisma migrate deploy` (não `migrate dev`) em produção.

Cada migration nova no projeto adiciona apenas:
- Colunas **nullable** (ex: `season_number INTEGER`, `added_by_id TEXT`)
- Colunas com **DEFAULT** (ex: `type TEXT DEFAULT 'movie'`, `bio TEXT DEFAULT ''`)

Isso significa que linhas existentes recebem automaticamente `NULL` ou o valor padrão — sem erro, sem perda de dados.

Se uma migration futura precisar de `NOT NULL` sem `DEFAULT`, o fluxo correto é:
1. Migration A: adicionar a coluna como `NULL`
2. Script de backfill: preencher os registros existentes
3. Migration B: adicionar a constraint `NOT NULL`

---

## Rollback de emergência

Se algo der errado após o deploy:

```bash
# Parar os containers Docker
docker compose down

# Restaurar o serviço nativo
systemctl start postgresql

# Reiniciar a aplicação nativa
pm2 restart all  # ou o processo que estava em uso
```

O dump gerado pelo script fica em `/tmp/cine-review-prod-dump-*.sql` até ser removido na limpeza automática.

---

## Fluxo de deploy contínuo (pós-migração)

Após a migração inicial, o fluxo de deploy passa a ser:

```bash
# 1. Verificar segurança das novas migrations
./scripts/check-migration-safety.sh --local

# 2. Build e redeploy
docker compose build
docker compose up -d

# O entrypoint.sh aplica automaticamente as migrations pendentes
```

---

*Última atualização: 2026-05*

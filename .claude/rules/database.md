# Regras para Banco de Dados

Regras para modelagem, migrations e acesso a dados.

---

## Modelagem

```
OBRIGATÓRIO:
- Toda tabela com id (PK auto-increment), created_at, updated_at
- Soft delete (deleted_at) para entidades de negócio
- DECIMAL(10,2) para valores monetários (NUNCA float)
- VARCHAR(255) para strings de tamanho variável
- FKs declaradas explicitamente com ON DELETE
- Índice em toda FK
- UNIQUE constraint em campos únicos (email, cpf, slug)

PROIBIDO:
- FLOAT/DOUBLE para valores monetários
- Sem PK na tabela
- FK sem índice
- Dados sem tipo definido (evitar TEXT para campos com domínio)
```

## Tipos de Dados

```sql
Dinheiro:    DECIMAL(10, 2)  -- nunca float!
String curta: VARCHAR(255)
Texto longo:  TEXT
Boolean:     TINYINT(1) ou BOOLEAN
Enum:        ENUM('value1', 'value2') ou VARCHAR com check
ID externo:  VARCHAR(36) ou UUID nativo
Data:        DATE
Datetime:    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
JSON:        JSON (MySQL 5.7+ / PostgreSQL)
```

## Índices

```sql
-- Obrigatórios
INDEX em toda FK
UNIQUE em campos únicos (email, cpf, slug)

-- Recomendados (campos de busca frequente)
INDEX idx_users_email (email)
INDEX idx_orders_status_created_at (status, created_at)
INDEX idx_products_category_id_active (category_id, is_active)

-- Verificar com EXPLAIN se índice está sendo usado
EXPLAIN SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at;
```

## Foreign Keys

```sql
ON DELETE RESTRICT  -- padrão, protege integridade
ON DELETE CASCADE   -- filho sem sentido sem pai (ex: order_items → orders)
ON DELETE SET NULL  -- relação opcional (ex: post → category)
```

## Migrations

```
OBRIGATÓRIO:
- Sempre implementar down() (rollback)
- Testar down() antes de deploy
- Colunas NOT NULL novas em tabela com dados: usar nullable ou default
- Não renomear coluna diretamente (criar nova, migrar, remover)
- Índices em tabelas grandes: criar em horário de baixo tráfego
- Nunca alterar dados em migration (usar Seeder ou script separado)
```

## Queries

```
PROIBIDO:
- SELECT * em código de produção
- Queries sem paginação em listagens
- Concatenação de input em SQL (injection)
- Queries N+1 (usar eager loading)

OBRIGATÓRIO:
- Prepared statements ou ORM
- LIMIT em todas as queries de listagem
- Índices verificados para queries frequentes
- EXPLAIN para queries lentas
```

---

*Versão: 1.0.0 — 2026-05*

# SKILL: database-design

**Name:** database-design
**Description:** Design e modelagem de bancos de dados relacionais e NoSQL, incluindo normalização, índices, constraints, estratégias de performance e migração.
**Quando usar:** Ao modelar dados para um novo domínio, revisar esquema existente, criar índices estratégicos ou planejar migrations complexas.

---

## Padrões Obrigatórios

### Convenções de Nomenclatura
```
Tabelas: snake_case, plural → users, order_items, payment_methods
Colunas: snake_case → user_id, created_at, is_active
PKs: id (BIGINT UNSIGNED AUTO_INCREMENT)
FKs: {tabela_ref}_id → user_id, order_id
Índices: idx_{tabela}_{coluna} → idx_users_email
FKs nomeadas: fk_{tabela}_{ref} → fk_orders_users
```

### Campos Padrão por Tabela
```sql
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL  -- soft delete
```

### Tipos de Dados Corretos
```sql
DECIMAL(10,2)  -- valores monetários (NUNCA float)
VARCHAR(255)   -- strings curtas
TEXT           -- textos longos
TINYINT(1)     -- boolean
ENUM(...)      -- status com valores fixos
JSON           -- dados semiestruturados
BIGINT         -- IDs e contadores grandes
INT            -- inteiros menores
TIMESTAMP      -- datas com timezone
DATE           -- apenas data
```

### Foreign Keys Corretas
```sql
-- ON DELETE RESTRICT (padrão — protege integridade)
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT

-- ON DELETE CASCADE (filho sem sentido sem pai)
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE

-- ON DELETE SET NULL (relação opcional)
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
```

### Índices Estratégicos
```sql
-- Obrigatório: toda FK deve ter índice
INDEX idx_orders_user_id (user_id),

-- Busca frequente
INDEX idx_users_email (email),

-- Filtro + ordenação frequente
INDEX idx_orders_status_created (status, created_at),

-- Composite para query específica
INDEX idx_products_category_active (category_id, is_active, price)
```

### Verificar N+1 com EXPLAIN
```sql
EXPLAIN SELECT orders.*, users.name
FROM orders
JOIN users ON orders.user_id = users.id
WHERE orders.status = 'pending'
ORDER BY orders.created_at DESC
LIMIT 20;

-- Verificar:
-- type: ref ou eq_ref (bom) vs ALL (ruim — falta índice)
-- key: nome do índice usado
-- rows: estimativa de linhas escaneadas
```

---

## Checklist de Quality Gate
```
[ ] Todas as tabelas com id, created_at, updated_at
[ ] Soft delete (deleted_at) para entidades de negócio
[ ] Tipos corretos — DECIMAL para dinheiro
[ ] FKs declaradas com ON DELETE definido
[ ] Índice em toda FK
[ ] Índices em campos de busca e ordenação
[ ] UNIQUE constraints onde necessário
[ ] Migrations com down() implementado e testado
[ ] Normalização adequada (sem dados duplicados)
```

---

## Erros Comuns
- FLOAT para valores monetários (erros de arredondamento)
- FK sem índice (JOINs lentos)
- Tabela sem soft delete para entidades de negócio
- Coluna NOT NULL sem default em tabela com dados
- Falta de UNIQUE em campos únicos (email, cpf, slug)

---

## Validações Finais
- [ ] Tipos de dados adequados para os valores?
- [ ] FK com índices?
- [ ] EXPLAIN mostra queries eficientes?
- [ ] Migration com down() funcional?

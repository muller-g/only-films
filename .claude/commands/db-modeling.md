# /db-modeling

## Objetivo
Criar um modelo de banco de dados completo e bem estruturado, incluindo entidades, relacionamentos, índices, constraints e justificativas das decisões de modelagem.

## Quando Usar
- Ao iniciar um novo módulo que precisa de novas tabelas
- Ao revisar um modelo existente
- Ao modelar um domínio de negócio complexo
- Ao planejar a estrutura de dados de uma feature

## Entrada Esperada
```
/db-modeling

Domínio: [o que precisa ser modelado]
Banco: [MySQL | PostgreSQL | MongoDB]
Entidades: [lista de entidades identificadas]
Regras: [regras de negócio relevantes para o modelo]
```

## Processo Detalhado

### Fase 1: Levantamento de Entidades
1. Identificar todos os substantivos do domínio (são candidatos a entidades)
2. Identificar atributos de cada entidade
3. Identificar relacionamentos entre entidades
4. Identificar cardinalidade (1:1, 1:N, N:M)

### Fase 2: Normalização
1. 1ª Forma Normal: atributos atômicos, sem grupos repetidos
2. 2ª Forma Normal: sem dependências parciais da chave
3. 3ª Forma Normal: sem dependências transitivas
4. Avaliar desnormalização estratégica para performance

### Fase 3: Definição de Chaves
```
Chave primária: sempre um surrogate key (id auto-increment ou UUID)
Chave natural: usar como unique constraint, não como PK
Foreign keys: sempre explicitamente declaradas com ON DELETE definido

ON DELETE RESTRICT: default — protege integridade referencial
ON DELETE CASCADE: apenas quando filho não faz sentido sem pai
ON DELETE SET NULL: quando relação é opcional
```

### Fase 4: Índices Estratégicos
```
Obrigatórios:
- Toda foreign key deve ter índice
- Campos usados em WHERE, ORDER BY, GROUP BY frequentes
- Campos de busca (email, cpf, slug, code)

Compostos (para queries compostas frequentes):
- (user_id, created_at) para histórico por usuário
- (status, created_at) para filtragem + ordenação

Nunca indexar:
- Campos boolean de alta cardinalidade baixa
- Campos raramente consultados
```

### Fase 5: Exemplo de Modelagem

**Sistema de E-commerce (exemplo):**
```sql
-- Usuários
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_users_email (email)
);

-- Produtos
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('active', 'inactive', 'draft') NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_status (status),
    INDEX idx_products_slug (slug)
);

-- Pedidos
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_status (status)
);

-- Itens do pedido
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_items_order_id (order_id)
);
```

### Diagrama ER (ASCII)
```
users           orders          order_items     products
─────           ──────          ───────────     ────────
id PK           id PK           id PK           id PK
name            user_id FK──┐   order_id FK──┐  name
email UNIQUE    status      │   product_id FK─┐ price
password        total       │   quantity      │ stock
                            └──→users         │ status
                                              └──→products
```

## Checklist
- [ ] Todas as entidades identificadas
- [ ] Relacionamentos com cardinalidade definida
- [ ] Tipos de dados adequados (DECIMAL para dinheiro, não FLOAT)
- [ ] Chaves primárias em todas as tabelas
- [ ] Foreign keys declaradas com ON DELETE definido
- [ ] Índices em todas as foreign keys
- [ ] Índices em campos de busca/ordenação frequentes
- [ ] Constraints de unicidade onde necessário
- [ ] Soft delete considerado (deleted_at)
- [ ] Timestamps (created_at, updated_at) em todas as tabelas

## Formato Esperado da Resposta
```
## Modelo de Banco: [domínio]

**Banco:** [MySQL | PostgreSQL]
**Tabelas:** [N tabelas]

### Diagrama de entidades:
[diagrama ASCII ou mermaid]

### Tabelas:
#### users
| Campo | Tipo | Constraint | Índice |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK AUTO_INCREMENT | PK |

### Decisões de modelagem:
- [decisão 1] — [justificativa]
- [decisão 2] — [justificativa]

### Migrations a criar:
1. [migration 1]
2. [migration 2]
```

## Boas Práticas
- DECIMAL(10,2) para valores monetários, NUNCA float
- Surrogate keys (id auto-increment) sempre como PK
- Soft delete padrão para entidades importantes
- Índices planejados antes de criar a tabela, não depois

## Validações Finais
- [ ] O modelo reflete as regras de negócio?
- [ ] Os relacionamentos estão corretos?
- [ ] Os índices cobrem as queries principais?
- [ ] O modelo está normalizado apropriadamente?

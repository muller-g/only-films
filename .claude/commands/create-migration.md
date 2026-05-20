# /create-migration

## Objetivo
Criar migrations de banco de dados seguras, reversíveis e bem documentadas, seguindo as melhores práticas para cada ORM/framework.

## Quando Usar
- Ao criar uma nova tabela
- Ao adicionar, modificar ou remover colunas
- Ao criar índices ou constraints
- Ao adicionar relacionamentos entre tabelas

## Entrada Esperada
```
/create-migration

Operação: [create-table | add-column | modify-column | add-index | add-fk | rename | drop]
Tabela: [nome da tabela]
Contexto: [descrição do que a migration representa]
Stack: [Laravel | TypeORM | Prisma | Knex]
Campos: [lista de campos se criar tabela]
```

## Processo Detalhado

### Fase 1: Análise da Mudança
1. Entender o que precisa ser alterado no banco
2. Verificar se a mudança é retrocompatível
3. Verificar se há dados existentes que serão afetados
4. Planejar a migration e o rollback
5. Identificar se é necessária uma migration de dados (não apenas de schema)

### Fase 2: Planejamento de Segurança
Para cada tipo de operação, avaliar:

**Adicionar coluna:**
- Coluna nullable ou com valor default? (obrigatória em tabelas com dados)
- Vai quebrar código que depende de SELECT *?

**Remover coluna:**
- O código já foi atualizado para não usar esta coluna?
- Há dados importantes que precisam ser migrados?

**Modificar tipo de coluna:**
- A conversão de dados é segura?
- Pode haver perda de dados?

**Adicionar índice em tabela grande:**
- Em produção, use CREATE INDEX CONCURRENTLY (PostgreSQL) ou equivalente
- Pode travar a tabela durante a criação

### Fase 3: Estrutura da Migration

**Laravel:**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

**TypeORM:**
```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1234567890 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true },
                    { name: 'name', type: 'varchar', length: '255' },
                    { name: 'email', type: 'varchar', isUnique: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }
}
```

### Fase 4: Padrões de Nomenclatura

**Tabelas:** snake_case, plural → `user_profiles`, `order_items`
**Colunas:** snake_case → `created_at`, `user_id`, `is_active`
**Índices:** `idx_{tabela}_{coluna}` → `idx_users_email`
**Foreign keys:** `fk_{tabela}_{tabela_ref}` → `fk_orders_users`
**Migrations (Laravel):** `2026_01_01_000000_create_users_table`
**Migrations (TypeORM):** `CreateUsersTable{timestamp}`

### Fase 5: Campos Padrão
Toda tabela principal deve ter:
```
- id (bigint, primary key, auto increment)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable — soft delete)
```

### Fase 6: Tipos de Dados Recomendados
```
string curta (nome, email): VARCHAR(255)
texto longo (descrição): TEXT
número inteiro: INT / BIGINT
número decimal (dinheiro): DECIMAL(10,2) — NUNCA float
booleano: TINYINT(1) / BOOLEAN
data: DATE
datetime: TIMESTAMP / DATETIME
JSON: JSON / JSONB (PostgreSQL)
UUID: CHAR(36) ou UUID nativo
status enum: ENUM ou VARCHAR com constraint
```

### Fase 7: Índices Recomendados
```
- Chaves estrangeiras sempre devem ter índice
- Campos de busca frequente (email, slug, cpf)
- Campos de ordenação frequente (created_at, name)
- Campos de filtragem frequente (status, type)
- Índices compostos para queries compostas frequentes
```

## Checklist
- [ ] Operação de up() implementada
- [ ] Operação de down() implementada e testada
- [ ] Nome da migration descritivo
- [ ] Campos com tipos corretos
- [ ] Constraints adequadas (NOT NULL, UNIQUE, etc.)
- [ ] Índices para campos de busca/ordenação
- [ ] Foreign keys com ON DELETE definido
- [ ] Campos padrão presentes (id, timestamps)
- [ ] Migration testada localmente (migrate + rollback)
- [ ] Migration segura para tabelas com dados (nullable/default)

## Formato Esperado da Resposta

```
## Migration: [descrição do que faz]

**Arquivo:** [nome do arquivo de migration]
**Operação:** [create | alter | drop]
**Tabela:** [nome da tabela]
**Reversível:** [sim | sim com ressalvas | não]

### Schema criado/alterado:
[código da migration]

### Índices criados:
- [índice 1] — [motivo]
- [índice 2] — [motivo]

### Considerações de segurança:
[O que precisa ser verificado antes de rodar em produção]

### Como executar:
```bash
# Laravel
php artisan migrate

# Reverter
php artisan migrate:rollback

# TypeORM
npm run typeorm migration:run

# Reverter
npm run typeorm migration:revert
```
```

## Boas Práticas
- Sempre implementar o `down()` — migrations sem rollback são armadilhas
- Em tabelas com dados, novas colunas devem ser nullable ou ter default
- Nunca renomear coluna diretamente — criar nova, migrar dados, remover antiga
- Nunca usar `float` para valores monetários — usar DECIMAL(10,2)
- Índices em foreign keys são obrigatórios — sem eles as queries ficam lentas
- Testar o rollback antes de fazer deploy

## Erros Comuns
- Sem down(): impossível fazer rollback em emergência
- Coluna NOT NULL sem default em tabela com dados: migration falha em produção
- Sem índice em foreign key: JOIN lento em tabelas grandes
- Usar float para dinheiro: erros de arredondamento em cálculos financeiros
- Migration gigante com múltiplas alterações: difícil de debugar se falhar

## Validações Finais
- [ ] A migration foi testada com `migrate` e `migrate:rollback`?
- [ ] A migration é segura para rodar em tabelas com dados existentes?
- [ ] O `down()` desfaz completamente o `up()`?
- [ ] Os índices necessários foram criados?
- [ ] Os tipos de dados são adequados para os valores esperados?

#!/bin/bash
# =============================================================================
# check-migration-safety.sh
# =============================================================================
# Verifica se as migrations Prisma pendentes são seguras para aplicar em
# produção sem risco de quebra por dados faltantes.
#
# Uma migration é considerada SEGURA quando:
#   - Adiciona colunas com DEFAULT
#   - Adiciona colunas NULL/opcionais
#   - Cria novas tabelas (sem afetar existentes)
#   - Adiciona índices ou constraints em colunas que já existem
#
# Uma migration é POTENCIALMENTE PERIGOSA quando:
#   - Adiciona colunas NOT NULL sem DEFAULT em tabela com dados
#   - Remove colunas ou tabelas
#   - Muda tipo de coluna (ALTER COLUMN TYPE)
#   - Renomeia colunas ou tabelas
#
# Uso:
#   ./scripts/check-migration-safety.sh [--env-file PATH]
#   ./scripts/check-migration-safety.sh --local  (compara com DB local Docker)
# =============================================================================

set -euo pipefail

# ─── Cores ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/api/.env"
USE_LOCAL=false

# ─── Funções ──────────────────────────────────────────────────────────────────
info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[AVISO]${NC} $*"; }
error()   { echo -e "${RED}[ERRO]${NC}  $*" >&2; }
fatal()   { error "$*"; exit 1; }

while [[ $# -gt 0 ]]; do
    case "$1" in
        --env-file) ENV_FILE="$2"; shift 2 ;;
        --local)    USE_LOCAL=true; shift ;;
        -h|--help)
            echo "Uso: $0 [--env-file PATH] [--local]"
            echo "  --local    Usa o banco Docker local (porta 5434) para checar migrations pendentes"
            exit 0
            ;;
        *) fatal "Opção desconhecida: $1" ;;
    esac
done

# ─── Localiza o diretório de migrations ───────────────────────────────────────
MIGRATIONS_DIR="$PROJECT_ROOT/api/prisma/migrations"
[[ -d "$MIGRATIONS_DIR" ]] || fatal "Diretório de migrations não encontrado: $MIGRATIONS_DIR"

# ─── Identifica migrations pendentes via Prisma ───────────────────────────────
get_pending_migrations() {
    local db_url="$1"

    info "Consultando status das migrations via Prisma..."

    cd "$PROJECT_ROOT/api"

    # Roda prisma migrate status e captura quais estão "Not applied"
    local output
    output=$(DATABASE_URL="$db_url" npx prisma migrate status 2>&1 || true)

    echo "$output" | grep -E "Following migration.*not yet applied|not applied" -A 100 \
        | grep -oE "[0-9]{14}_[a-z_]+" \
        || true
}

# ─── Analisa o SQL de uma migration ───────────────────────────────────────────
analyze_migration_sql() {
    local migration_name="$1"
    local sql_file="$MIGRATIONS_DIR/$migration_name/migration.sql"

    [[ -f "$sql_file" ]] || { warn "SQL não encontrado: $sql_file"; return; }

    local has_danger=false
    local danger_reasons=()
    local safe_reasons=()

    # ── Verificações de PERIGO ────────────────────────────────────────────────

    # ADD COLUMN NOT NULL sem DEFAULT (perigoso em tabela com dados)
    if grep -qiP "ADD COLUMN\s+\".+\"\s+\w+(\(\d+\))?\s+NOT NULL" "$sql_file" 2>/dev/null; then
        # Verifica se tem DEFAULT junto
        local not_null_lines
        not_null_lines=$(grep -iP "ADD COLUMN.+NOT NULL" "$sql_file" || true)
        while IFS= read -r line; do
            if ! echo "$line" | grep -qi "DEFAULT"; then
                has_danger=true
                danger_reasons+=("ADD COLUMN NOT NULL sem DEFAULT: $line")
            fi
        done <<< "$not_null_lines"
    fi

    # DROP COLUMN ou DROP TABLE
    if grep -qiP "DROP\s+(COLUMN|TABLE)" "$sql_file" 2>/dev/null; then
        has_danger=true
        local drop_lines
        drop_lines=$(grep -iP "DROP\s+(COLUMN|TABLE)" "$sql_file" || true)
        while IFS= read -r line; do
            danger_reasons+=("Remoção de estrutura: $line")
        done <<< "$drop_lines"
    fi

    # ALTER COLUMN TYPE (mudança de tipo)
    if grep -qiP "ALTER COLUMN.+TYPE" "$sql_file" 2>/dev/null; then
        has_danger=true
        local alter_lines
        alter_lines=$(grep -iP "ALTER COLUMN.+TYPE" "$sql_file" || true)
        while IFS= read -r line; do
            danger_reasons+=("Mudança de tipo de coluna: $line")
        done <<< "$alter_lines"
    fi

    # RENAME (renomear tabela ou coluna)
    if grep -qiP "RENAME\s+(TO|COLUMN)" "$sql_file" 2>/dev/null; then
        has_danger=true
        local rename_lines
        rename_lines=$(grep -iP "RENAME\s+(TO|COLUMN)" "$sql_file" || true)
        while IFS= read -r line; do
            danger_reasons+=("Renomear estrutura: $line")
        done <<< "$rename_lines"
    fi

    # ── Verificações de SEGURANÇA ─────────────────────────────────────────────

    # CREATE TABLE
    grep -cqiP "CREATE TABLE" "$sql_file" 2>/dev/null \
        && safe_reasons+=("Cria nova(s) tabela(s) — sem impacto em dados existentes")

    # ADD COLUMN com NULL ou DEFAULT
    if grep -qiP "ADD COLUMN" "$sql_file" 2>/dev/null; then
        local nullable_cols
        nullable_cols=$(grep -iP "ADD COLUMN" "$sql_file" | grep -viP "NOT NULL" || true)
        [[ -n "$nullable_cols" ]] \
            && safe_reasons+=("Adiciona coluna(s) nullable — linhas existentes recebem NULL automaticamente")

        local default_cols
        default_cols=$(grep -iP "ADD COLUMN.+DEFAULT" "$sql_file" || true)
        [[ -n "$default_cols" ]] \
            && safe_reasons+=("Adiciona coluna(s) com DEFAULT — linhas existentes recebem o valor padrão")
    fi

    # CREATE INDEX
    grep -cqiP "CREATE INDEX" "$sql_file" 2>/dev/null \
        && safe_reasons+=("Cria índice(s) — apenas performance, sem impacto em dados")

    # ADD CONSTRAINT FOREIGN KEY
    grep -cqiP "ADD CONSTRAINT.+FOREIGN KEY" "$sql_file" 2>/dev/null \
        && safe_reasons+=("Adiciona FK — atenção: pode falhar se houver dados órfãos no banco de prod")

    # ── Imprime resultado ─────────────────────────────────────────────────────
    echo ""
    echo -e "  ${BOLD}Migration: $migration_name${NC}"

    if [[ "$has_danger" == true ]]; then
        echo -e "  ${RED}⚠ ATENÇÃO — Esta migration requer cuidado:${NC}"
        for reason in "${danger_reasons[@]}"; do
            echo -e "    ${RED}✗${NC} $reason"
        done
    else
        echo -e "  ${GREEN}✓ SEGURA para aplicar em produção${NC}"
    fi

    if [[ ${#safe_reasons[@]} -gt 0 ]]; then
        echo -e "  ${BLUE}Operações:${NC}"
        for reason in "${safe_reasons[@]}"; do
            echo -e "    ${BLUE}→${NC} $reason"
        done
    fi

    [[ "$has_danger" == true ]] && return 1 || return 0
}

# ─── Lê DATABASE_URL do env ───────────────────────────────────────────────────
read_env_var() {
    grep -E "^$1=" "$2" 2>/dev/null | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'"
}

# ─── Main ─────────────────────────────────────────────────────────────────────
main() {
    echo ""
    echo -e "${BOLD}╔═══════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}║  cine-review: Análise de Migration Safety  ║${NC}"
    echo -e "${BOLD}╚═══════════════════════════════════════════╝${NC}"
    echo ""

    # ── Determina a DATABASE_URL a usar ───────────────────────────────────────
    local db_url=""

    if [[ "$USE_LOCAL" == true ]]; then
        db_url="postgresql://postgres:postgres@localhost:5434/cine-review"
        info "Usando banco Docker local: $db_url"
    else
        [[ -f "$ENV_FILE" ]] || fatal "Arquivo .env não encontrado: $ENV_FILE"
        db_url="$(read_env_var DATABASE_URL "$ENV_FILE")"
        [[ -z "$db_url" ]] && fatal "DATABASE_URL não encontrada em $ENV_FILE"
        info "Usando banco: $db_url"
    fi

    # ── Verifica npx/prisma disponível ────────────────────────────────────────
    command -v npx &>/dev/null || fatal "npx não encontrado. Instale Node.js."
    [[ -f "$PROJECT_ROOT/api/node_modules/.bin/prisma" ]] \
        || fatal "Prisma não instalado. Rode: cd api && npm install"

    # ── Tenta obter migrations pendentes via Prisma ───────────────────────────
    local pending_migrations=()

    cd "$PROJECT_ROOT/api"
    local status_output
    status_output=$(DATABASE_URL="$db_url" npx prisma migrate status 2>&1 || true)

    # Extrai nomes de migrations não aplicadas
    mapfile -t pending_migrations < <(
        echo "$status_output" \
        | grep -oP "[0-9]{14}_\w+" \
        | grep -v "migration_lock" \
        || true
    )

    # Se Prisma não conectou, informa mas ainda analisa todos os SQL locais
    if echo "$status_output" | grep -qi "error\|connection refused\|ECONNREFUSED"; then
        warn "Não foi possível conectar ao banco para verificar o status."
        warn "Analisando TODOS os arquivos de migration locais como referência."
        echo ""

        mapfile -t pending_migrations < <(
            find "$MIGRATIONS_DIR" -name "migration.sql" -printf "%h\n" \
            | xargs -I{} basename {} \
            | sort
        )
    fi

    if [[ ${#pending_migrations[@]} -eq 0 ]]; then
        success "Nenhuma migration pendente encontrada."
        echo ""
        echo -e "  O banco está atualizado. ${GREEN}Seguro para deploy.${NC}"
        echo ""
        exit 0
    fi

    info "Migrations a verificar: ${#pending_migrations[@]}"

    # ── Analisa cada migration ─────────────────────────────────────────────────
    local has_any_danger=false

    for migration in "${pending_migrations[@]}"; do
        if ! analyze_migration_sql "$migration"; then
            has_any_danger=true
        fi
    done

    echo ""
    echo "─────────────────────────────────────────────────"

    if [[ "$has_any_danger" == true ]]; then
        echo ""
        echo -e "${RED}${BOLD}⚠  Resultado: REVISAR ANTES DE APLICAR${NC}"
        echo ""
        echo "Ações recomendadas:"
        echo "  1. Revise as migrations marcadas com ⚠"
        echo "  2. Para ADD COLUMN NOT NULL sem DEFAULT:"
        echo "     - Adicione um DEFAULT temporário na migration"
        echo "     - Ou adicione como NULL primeiro, depois aplique NOT NULL"
        echo "  3. Para DROP COLUMN/TABLE: confirme que nenhum código usa mais"
        echo "  4. Faça backup do banco antes de aplicar: pg_dump -f backup.sql"
        echo ""
        exit 1
    else
        echo ""
        echo -e "${GREEN}${BOLD}✓  Resultado: SEGURO PARA APLICAR EM PRODUÇÃO${NC}"
        echo ""
        echo "Todas as migrations pendentes são não-destrutivas."
        echo "O 'prisma migrate deploy' será executado automaticamente"
        echo "quando o container da API iniciar."
        echo ""
        exit 0
    fi
}

main "$@"

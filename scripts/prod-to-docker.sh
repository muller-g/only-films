#!/bin/bash
# =============================================================================
# prod-to-docker.sh
# =============================================================================
# Migra o banco de dados PostgreSQL existente em produção para o container
# Docker, preservando todos os registros. Também migra a pasta de uploads.
#
# Pré-requisitos no servidor de produção:
#   - pg_dump instalado (postgresql-client)
#   - docker e docker compose instalados
#   - Arquivo api/.env com DATABASE_URL da instalação atual
#
# Uso:
#   ./scripts/prod-to-docker.sh [OPÇÕES]
#
# Opções:
#   --uploads-path PATH   Caminho para a pasta uploads atual (padrão: api/uploads)
#   --env-file    PATH    Arquivo .env da API (padrão: api/.env)
#   --skip-uploads        Pula a migração de uploads
#   --skip-db             Pula a migração do banco (só sobe os containers)
#   --dry-run             Mostra o que seria feito sem executar
#   -h, --help            Exibe esta ajuda
#
# Exemplo:
#   ./scripts/prod-to-docker.sh
#   ./scripts/prod-to-docker.sh --uploads-path /var/www/html/api/uploads
# =============================================================================

set -euo pipefail

# ─── Cores ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Defaults ─────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
UPLOADS_PATH="$PROJECT_ROOT/api/uploads"
ENV_FILE="$PROJECT_ROOT/api/.env"
SKIP_UPLOADS=false
SKIP_DB=false
DRY_RUN=false
DUMP_FILE="/tmp/cine-review-prod-dump-$(date +%Y%m%d_%H%M%S).sql"

# ─── Funções de saída ─────────────────────────────────────────────────────────
info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERRO]${NC}  $*" >&2; }
fatal()   { error "$*"; exit 1; }
step()    { echo -e "\n${BOLD}── $* ──────────────────────────────────────${NC}"; }
run()     {
    if [[ "$DRY_RUN" == true ]]; then
        echo -e "${YELLOW}[DRY-RUN]${NC} $*"
    else
        eval "$@"
    fi
}

# ─── Parser de argumentos ─────────────────────────────────────────────────────
parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --uploads-path) UPLOADS_PATH="$2"; shift 2 ;;
            --env-file)     ENV_FILE="$2"; shift 2 ;;
            --skip-uploads) SKIP_UPLOADS=true; shift ;;
            --skip-db)      SKIP_DB=true; shift ;;
            --dry-run)      DRY_RUN=true; shift ;;
            -h|--help)      usage; exit 0 ;;
            *) fatal "Opção desconhecida: $1. Use --help para ver as opções." ;;
        esac
    done
}

usage() {
    sed -n '/^# Uso:/,/^# =====/p' "$0" | grep '^#' | sed 's/^# \{0,2\}//'
}

# ─── Leitura do .env ──────────────────────────────────────────────────────────
# Extrai variáveis sem executar o arquivo (seguro)
read_env_var() {
    local key="$1"
    local file="$2"
    grep -E "^${key}=" "$file" 2>/dev/null | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'"
}

# Parseia DATABASE_URL no formato postgresql://user:pass@host:port/dbname
parse_database_url() {
    local url="$1"
    # Remove o prefixo postgresql:// ou postgres://
    local rest="${url#postgresql://}"
    rest="${rest#postgres://}"

    DB_USER="${rest%%:*}"
    rest="${rest#*:}"
    DB_PASS="${rest%%@*}"
    rest="${rest#*@}"
    DB_HOST="${rest%%:*}"
    rest="${rest#*:}"
    DB_PORT="${rest%%/*}"
    DB_NAME="${rest#*/}"
    # Remove query string se houver
    DB_NAME="${DB_NAME%%\?*}"
}

# ─── Checks de pré-requisitos ─────────────────────────────────────────────────
check_prerequisites() {
    step "Verificando pré-requisitos"

    local missing=()

    command -v pg_dump  &>/dev/null || missing+=("pg_dump (instale: apt install postgresql-client)")
    command -v psql     &>/dev/null || missing+=("psql (instale: apt install postgresql-client)")
    command -v docker   &>/dev/null || missing+=("docker")

    # docker compose (plugin v2) ou docker-compose (v1)
    if ! docker compose version &>/dev/null 2>&1 && ! command -v docker-compose &>/dev/null; then
        missing+=("docker compose")
    fi

    if [[ ${#missing[@]} -gt 0 ]]; then
        error "Pré-requisitos não encontrados:"
        for m in "${missing[@]}"; do
            error "  - $m"
        done
        exit 1
    fi

    [[ -f "$ENV_FILE" ]] || fatal "Arquivo .env não encontrado em: $ENV_FILE"

    success "Todos os pré-requisitos satisfeitos"
}

# ─── Lê e valida a conexão com o banco atual ──────────────────────────────────
load_db_config() {
    step "Lendo configuração do banco de dados"

    local raw_url
    raw_url="$(read_env_var "DATABASE_URL" "$ENV_FILE")"
    [[ -z "$raw_url" ]] && fatal "DATABASE_URL não encontrada em $ENV_FILE"

    parse_database_url "$raw_url"

    info "Host:  $DB_HOST"
    info "Port:  $DB_PORT"
    info "User:  $DB_USER"
    info "DB:    $DB_NAME"

    # Testa a conexão
    info "Testando conexão com o banco atual..."
    if [[ "$DRY_RUN" == false ]]; then
        PGPASSWORD="$DB_PASS" psql \
            -h "$DB_HOST" -p "$DB_PORT" \
            -U "$DB_USER" -d "$DB_NAME" \
            -c "SELECT 1;" &>/dev/null \
            || fatal "Não foi possível conectar ao banco em $DB_HOST:$DB_PORT/$DB_NAME"
    fi

    success "Conexão com banco atual confirmada"
}

# ─── Dump do banco atual ───────────────────────────────────────────────────────
dump_database() {
    step "Criando dump do banco de dados atual"

    info "Destino: $DUMP_FILE"
    info "Isso pode levar alguns minutos dependendo do tamanho do banco..."

    run "PGPASSWORD='$DB_PASS' pg_dump \
        -h '$DB_HOST' \
        -p '$DB_PORT' \
        -U '$DB_USER' \
        -d '$DB_NAME' \
        --no-owner \
        --no-acl \
        --format=plain \
        --file='$DUMP_FILE'"

    if [[ "$DRY_RUN" == false ]]; then
        local size
        size=$(du -sh "$DUMP_FILE" 2>/dev/null | cut -f1)
        success "Dump criado: $DUMP_FILE ($size)"
    fi
}

# ─── Sobe apenas o serviço de banco Docker ────────────────────────────────────
start_docker_db() {
    step "Iniciando container do banco de dados Docker"

    local compose_cmd="docker compose"
    command -v docker-compose &>/dev/null && ! docker compose version &>/dev/null 2>&1 \
        && compose_cmd="docker-compose"

    info "Subindo serviço 'db'..."
    run "cd '$PROJECT_ROOT' && $compose_cmd up -d db"

    if [[ "$DRY_RUN" == false ]]; then
        info "Aguardando banco ficar saudável..."
        local attempts=0
        local max_attempts=30

        while [[ $attempts -lt $max_attempts ]]; do
            if docker exec cine-review-db pg_isready -U postgres -d "cine-review" &>/dev/null; then
                break
            fi
            attempts=$((attempts + 1))
            echo -n "."
            sleep 2
        done
        echo ""

        [[ $attempts -ge $max_attempts ]] && fatal "Banco Docker não ficou pronto após ${max_attempts} tentativas"
        success "Container 'db' está saudável"
    fi
}

# ─── Restaura o dump no container Docker ──────────────────────────────────────
restore_database() {
    step "Restaurando dados no banco Docker"

    # Credenciais do docker-compose.yml (hardcoded conforme o compose)
    local docker_db_user="postgres"
    local docker_db_name="cine-review"
    local docker_container="cine-review-db"

    warn "Isso irá substituir todos os dados do banco Docker por dados da produção atual."

    if [[ "$DRY_RUN" == false ]]; then
        read -r -p "Continuar? [s/N] " confirm
        [[ "${confirm,,}" != "s" ]] && fatal "Operação cancelada pelo usuário"
    fi

    info "Limpando banco Docker para restauração limpa..."
    run "docker exec -i '$docker_container' psql \
        -U '$docker_db_user' \
        -c 'DROP DATABASE IF EXISTS \"$docker_db_name\";' \
        -c 'CREATE DATABASE \"$docker_db_name\";'"

    info "Restaurando dump..."
    run "docker exec -i '$docker_container' psql \
        -U '$docker_db_user' \
        -d '$docker_db_name' \
        < '$DUMP_FILE'"

    if [[ "$DRY_RUN" == false ]]; then
        success "Dados restaurados com sucesso no banco Docker"
    fi
}

# ─── Sobe todos os serviços ───────────────────────────────────────────────────
start_all_services() {
    step "Subindo todos os serviços Docker"

    local compose_cmd="docker compose"
    command -v docker-compose &>/dev/null && ! docker compose version &>/dev/null 2>&1 \
        && compose_cmd="docker-compose"

    info "O container 'api' irá executar 'prisma migrate deploy' automaticamente."
    info "Migrations pendentes serão aplicadas com segurança (colunas nullable/com default)."

    run "cd '$PROJECT_ROOT' && $compose_cmd up -d"

    if [[ "$DRY_RUN" == false ]]; then
        info "Aguardando API iniciar..."
        sleep 5

        # Verifica se a api está rodando
        local api_status
        api_status=$(docker inspect --format='{{.State.Status}}' cine-review-api 2>/dev/null || echo "não encontrado")
        info "Status da API: $api_status"

        # Mostra os logs das migrations
        info "Logs de inicialização da API:"
        docker logs cine-review-api --tail 20 2>&1 || true

        success "Todos os serviços iniciados"
    fi
}

# ─── Migra os uploads ─────────────────────────────────────────────────────────
migrate_uploads() {
    step "Migrando arquivos de uploads"

    if [[ ! -d "$UPLOADS_PATH" ]]; then
        warn "Pasta de uploads não encontrada em: $UPLOADS_PATH"
        warn "Pule esta etapa com --skip-uploads se não houver uploads."
        return 0
    fi

    local upload_count
    upload_count=$(find "$UPLOADS_PATH" -type f 2>/dev/null | wc -l)
    info "Arquivos encontrados: $upload_count"

    if [[ "$upload_count" -eq 0 ]]; then
        info "Nenhum arquivo para migrar."
        return 0
    fi

    # O volume Docker 'uploads_data' é montado em /app/uploads dentro do container
    # Copiamos diretamente para o container via docker cp
    info "Copiando uploads para o container 'cine-review-api'..."

    if [[ "$DRY_RUN" == false ]]; then
        # Garante que o container está rodando
        docker inspect cine-review-api &>/dev/null \
            || fatal "Container 'cine-review-api' não está rodando. Suba os serviços primeiro."

        docker cp "$UPLOADS_PATH/." cine-review-api:/app/uploads/
        success "Uploads copiados: $upload_count arquivo(s)"
    else
        echo -e "${YELLOW}[DRY-RUN]${NC} docker cp $UPLOADS_PATH/. cine-review-api:/app/uploads/"
    fi
}

# ─── Limpeza ──────────────────────────────────────────────────────────────────
cleanup() {
    if [[ "$DRY_RUN" == false && -f "$DUMP_FILE" ]]; then
        info "Removendo arquivo de dump temporário..."
        rm -f "$DUMP_FILE"
    fi
}

# ─── Resumo final ─────────────────────────────────────────────────────────────
print_summary() {
    step "Migração concluída"

    echo ""
    echo -e "${GREEN}${BOLD}✓ Banco de dados migrado com sucesso!${NC}"
    echo ""
    echo "Próximos passos recomendados:"
    echo "  1. Verifique os logs da API:   docker logs cine-review-api -f"
    echo "  2. Teste o acesso à aplicação: curl http://localhost:3001/health"
    echo "  3. Configure o Nginx para apontar para as portas Docker"
    echo "  4. Após validar, pare o PostgreSQL nativo para liberar a porta 5432"
    echo ""

    if [[ "$DRY_RUN" == true ]]; then
        warn "Este foi um DRY-RUN — nenhuma alteração foi feita."
    fi
}

# ─── Main ─────────────────────────────────────────────────────────────────────
main() {
    parse_args "$@"

    echo ""
    echo -e "${BOLD}╔════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}║   cine-review: prod → Docker migrate   ║${NC}"
    echo -e "${BOLD}╚════════════════════════════════════════╝${NC}"
    [[ "$DRY_RUN" == true ]] && warn "Modo DRY-RUN ativado — nenhuma alteração será feita"
    echo ""

    trap cleanup EXIT

    check_prerequisites

    if [[ "$SKIP_DB" == false ]]; then
        load_db_config
        dump_database
        start_docker_db
        restore_database
    else
        warn "--skip-db ativo: pulando migração do banco"
    fi

    start_all_services

    if [[ "$SKIP_UPLOADS" == false ]]; then
        migrate_uploads
    else
        info "--skip-uploads ativo: pulando migração de uploads"
    fi

    print_summary
}

main "$@"

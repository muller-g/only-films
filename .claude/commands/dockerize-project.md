# /dockerize-project

## Objetivo
Criar toda a infraestrutura Docker para um projeto, incluindo Dockerfile otimizado, docker-compose para desenvolvimento e produção, e documentação de uso.

## Quando Usar
- Ao containerizar um projeto pela primeira vez
- Ao criar ambiente de desenvolvimento padronizado
- Ao preparar o projeto para deploy com containers

## Entrada Esperada
```
/dockerize-project

Stack: [Laravel | NestJS | Next.js | fullstack]
Banco: [MySQL | PostgreSQL | MongoDB | não]
Cache: [Redis | não]
Queue: [Redis | SQS | não]
Ambiente: [dev | prod | ambos]
```

## Estrutura Docker Gerada

```
docker/
  app/
    Dockerfile          # Produção
    Dockerfile.dev      # Desenvolvimento
  nginx/
    nginx.conf
  mysql/
    my.cnf
docker-compose.yml       # Desenvolvimento
docker-compose.prod.yml  # Produção
.dockerignore
```

## Dockerfile Laravel (Produção)

```dockerfile
FROM php:8.2-fpm-alpine AS base

# Dependências do sistema
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip

# Extensões PHP
RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd

# Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Dependências primeiro (cache layer)
COPY composer.json composer.lock ./
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Código da aplicação
COPY . .

# Permissões
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Otimizações Laravel
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

EXPOSE 9000
CMD ["php-fpm"]
```

## docker-compose.yml (Desenvolvimento)

```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: docker/app/Dockerfile.dev
    volumes:
      - .:/var/www
      - /var/www/vendor
    environment:
      - APP_ENV=local
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - .:/var/www
      - ./docker/nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app
    networks:
      - app-network

  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - db-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

volumes:
  db-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

## Checklist
- [ ] Dockerfile com multi-stage build (menor imagem)
- [ ] .dockerignore criado
- [ ] Healthchecks configurados nos serviços
- [ ] Volumes para persistência de dados
- [ ] Variáveis de ambiente via .env
- [ ] Não expor portas desnecessárias em produção
- [ ] Usuário não-root na imagem
- [ ] Dependências instaladas antes de copiar o código (cache otimizado)

## Comandos de Uso
```bash
# Subir ambiente de desenvolvimento
docker-compose up -d

# Executar comandos na aplicação
docker-compose exec app php artisan migrate
docker-compose exec app composer install

# Logs
docker-compose logs -f app

# Parar tudo
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

## Validações Finais
- [ ] `docker-compose up` sobe sem erros?
- [ ] A aplicação responde em localhost?
- [ ] As migrations executam corretamente?
- [ ] Os volumes persistem dados entre restarts?

# /nginx-config

## Objetivo
Criar ou revisar configuração Nginx para o projeto, cobrindo proxy reverso, SSL/TLS, headers de segurança, cache de assets, rate limiting e configurações de performance.

## Quando Usar
- Ao configurar Nginx para um novo projeto
- Ao adicionar SSL/TLS a um servidor existente
- Ao otimizar configuração de performance
- Ao configurar múltiplos domínios/subdomínios

## Entrada Esperada
```
/nginx-config

Tipo: [frontend-only | api-only | fullstack | proxy]
Domínio: [dominio.com]
Stack: [Next.js | Laravel | NestJS | estático]
SSL: [letsencrypt | próprio | não]
Subdomínios: [www | api | admin | etc.]
```

## Configuração Base

```nginx
# /etc/nginx/sites-available/projeto.conf

server {
    listen 80;
    server_name dominio.com www.dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dominio.com www.dominio.com;

    # SSL
    ssl_certificate /etc/letsencrypt/live/dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Headers de Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Logs
    access_log /var/log/nginx/dominio-access.log;
    error_log /var/log/nginx/dominio-error.log warn;

    # Laravel / PHP-FPM
    root /var/www/projeto/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Assets estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Endpoint de login com rate limiting
    location /api/v1/auth/login {
        limit_req zone=login burst=5 nodelay;
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Bloquear acesso a arquivos sensíveis
    location ~ /\.(env|git|htaccess) {
        deny all;
        return 404;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt { access_log off; log_not_found off; }
}
```

## Para Next.js (Node.js Proxy)
```nginx
upstream nextjs {
    server 127.0.0.1:3000;
}

server {
    listen 443 ssl http2;
    server_name dominio.com;

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Checklist
- [ ] Redirecionamento HTTP → HTTPS
- [ ] SSL/TLS configurado corretamente
- [ ] Headers de segurança adicionados
- [ ] HSTS habilitado
- [ ] Gzip habilitado
- [ ] Rate limiting em endpoints sensíveis
- [ ] Cache de assets estáticos configurado
- [ ] Arquivos sensíveis bloqueados (.env, .git)
- [ ] Logs configurados

## Validações Finais
- [ ] `nginx -t` passa sem erros?
- [ ] SSL Labs Score A ou A+?
- [ ] Headers de segurança verificados?
- [ ] Rate limiting testado?

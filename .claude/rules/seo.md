# Regras de SEO

Padrões de SEO para projetos web com Next.js, Nuxt.js ou qualquer SSR.

---

## Meta Tags Obrigatórias

```html
<!-- Obrigatórios em toda página -->
<title>Título Único — Nome do Site</title>
<meta name="description" content="Descrição de 150-160 chars" />

<!-- Open Graph (compartilhamento social) -->
<meta property="og:title" content="Título" />
<meta property="og:description" content="Descrição" />
<meta property="og:image" content="https://..." />
<meta property="og:url" content="https://..." />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Título" />
```

## URLs

```
OBRIGATÓRIO:
- URLs descritivas e em lowercase
- Hífens como separadores (/minha-pagina, não /minha_pagina)
- Sem parâmetros desnecessários na URL principal
- Canonical tag para evitar conteúdo duplicado
- Redirecionamento 301 de URLs antigas

PROIBIDO:
- /page?id=123 para páginas indexáveis
- URLs com maiúsculas
- URLs com caracteres especiais não codificados
```

## Estrutura de Heading

```
H1: apenas um por página, o título principal
H2: seções principais
H3: subseções
H4-H6: raramente necessários

NUNCA pular níveis (h1 → h3 sem h2)
```

## Performance (Core Web Vitals)

```
LCP < 2.5s  → largest contentful paint
CLS < 0.1   → cumulative layout shift
FID < 100ms → first input delay
TTFB < 800ms → time to first byte

Para bom SEO: SSR ou SSG para páginas indexáveis
```

## Imagens

```
- alt text descritivo e único
- Dimensões declaradas (evitar CLS)
- Formato moderno (WebP)
- Lazy loading para imagens below the fold
- Arquivos com nomes descritivos (foto-produto-xyz.webp)
```

## Sitemap e Robots

```
OBRIGATÓRIO em produção:
- /sitemap.xml gerado e enviado ao Google
- /robots.txt configurado
- Noindex em páginas que não devem ser indexadas (admin, login)
- Canonical em páginas com conteúdo similar
```

## Dados Estruturados (Schema.org)

```
Quando aplicável:
- BreadcrumbList para navegação
- Product para páginas de produto
- Article para artigos/blog
- FAQ para perguntas frequentes
- Organization para página institucional
```

---

*Versão: 1.0.0 — 2026-05*

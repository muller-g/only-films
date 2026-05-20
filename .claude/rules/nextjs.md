# Regras para Next.js

Regras específicas para projetos Next.js (App Router).

---

## Server vs Client Components

```
PADRÃO: Server Component (sem 'use client')
USAR 'use client' APENAS quando:
- useState, useReducer, useEffect
- Event handlers (onClick, onChange)
- Browser APIs (window, localStorage)
- Context com estado

NUNCA em Server Component:
- useState, useEffect
- Event handlers
- Browser APIs
```

## Roteamento e Layout

```
- App Router (não Pages Router para projetos novos)
- Layouts aninhados para estrutura compartilhada
- Route Groups () para organização sem afetar URL
- Dynamic segments [id] com generateStaticParams quando possível
- loading.tsx em rotas com fetch assíncrono
- error.tsx para tratamento de erros
- not-found.tsx para 404
```

## Fetch e Cache

```typescript
// Definir estratégia de cache explicitamente

// Dados dinâmicos (sempre fresh)
fetch('/api/data', { cache: 'no-store' });

// Dados com revalidação periódica
fetch('/api/data', { next: { revalidate: 3600 } });

// Dados estáticos (cache permanente)
fetch('/api/data', { cache: 'force-cache' });

// Revalidação manual via tags
fetch('/api/data', { next: { tags: ['products'] } });
revalidateTag('products'); // invalidar via Server Action
```

## SEO e Metadata

```typescript
// OBRIGATÓRIO em cada página
export const metadata: Metadata = {
    title: 'Título Único da Página',
    description: 'Descrição única (150-160 chars)',
    openGraph: { title, description, images },
};

// Ou dinâmico
export async function generateMetadata({ params }): Promise<Metadata> {
    const data = await fetchData(params.id);
    return { title: data.name, description: data.description };
}
```

## Imagens

```typescript
// SEMPRE next/image, NUNCA <img>
import Image from 'next/image';

<Image
    src="/image.jpg"
    alt="Descrição obrigatória"
    width={800}
    height={600}
    priority    // para imagens acima da dobra
/>
```

## Server Actions

```typescript
'use server';
// Validar com Zod antes de qualquer operação
// revalidatePath/revalidateTag após mutations
// redirect() após operações bem-sucedidas
```

## Performance

```
- Server Components por padrão (reduz JS no cliente)
- Streaming com Suspense para partes lentas
- Prefetch automático de links (Link component)
- Static Generation onde possível (ISR)
- Image optimization com next/image
- Font optimization com next/font
```

---

*Versão: 1.0.0 — 2026-05*

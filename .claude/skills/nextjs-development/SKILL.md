# SKILL: nextjs-development

**Name:** nextjs-development
**Description:** Desenvolvimento profissional com Next.js e TypeScript, cobrindo App Router, Server Components, Server Actions, otimização de performance e SEO.
**Quando usar:** Ao trabalhar em projetos Next.js — páginas, layouts, rotas de API, Server Components, SSR/SSG ou otimizações de performance.

---

## Padrões Obrigatórios

### Estrutura App Router
```
src/
  app/
    layout.tsx              # Layout raiz
    page.tsx                # Página inicial
    (auth)/                 # Route group (sem URL)
      login/page.tsx
      register/page.tsx
    (dashboard)/
      layout.tsx            # Layout do dashboard
      dashboard/page.tsx
      users/
        page.tsx            # Lista
        [id]/page.tsx       # Detalhe
        [id]/edit/page.tsx  # Edição
    api/
      users/route.ts        # Route Handler
  components/
  lib/
  types/
```

### Server Component (padrão)
```typescript
// Server Component — executa no servidor, sem JavaScript no cliente
export default async function UsersPage() {
    const users = await db.user.findMany(); // direto ao banco, sem API

    return (
        <main>
            <h1>Usuários</h1>
            <UserList users={users} />
        </main>
    );
}
```

### Client Component (quando necessário)
```typescript
'use client'; // apenas quando precisa de interatividade

import { useState } from 'react';

export function UserSearch() {
    const [query, setQuery] = useState('');
    return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### Route Handler (API)
```typescript
// app/api/users/route.ts
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ?? '1';

    const users = await usersService.paginate(parseInt(page));
    return NextResponse.json({ success: true, data: users });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    // validar com Zod
    const parsed = CreateUserSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 422 });
    }
    const user = await usersService.create(parsed.data);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
}
```

### Server Actions
```typescript
'use server';

export async function createUser(formData: FormData) {
    const parsed = CreateUserSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
    });

    if (!parsed.success) {
        return { error: parsed.error.flatten() };
    }

    const user = await usersService.create(parsed.data);
    revalidatePath('/users');
    redirect('/users');
}
```

### Metadata para SEO
```typescript
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const product = await getProduct(params.id);
    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            images: [product.imageUrl],
        },
    };
}
```

### Otimização de Imagens
```typescript
import Image from 'next/image';

// Sempre usar next/image, nunca <img>
<Image
    src="/hero.jpg"
    alt="Descrição da imagem"
    width={800}
    height={600}
    priority // para imagens above the fold
    className="rounded-lg"
/>
```

### Estratégias de Cache
```typescript
// Revalidar a cada hora
const data = await fetch('/api/products', { next: { revalidate: 3600 } });

// Sem cache (dados sempre frescos)
const data = await fetch('/api/cart', { cache: 'no-store' });

// Cache permanente
const data = await fetch('/api/config', { cache: 'force-cache' });

// Revalidar manualmente
revalidatePath('/products');
revalidateTag('products');
```

---

## Checklist de Quality Gate
```
[ ] Server Components por padrão, Client Components apenas quando necessário
[ ] Metadata configurada em todas as páginas
[ ] Imagens com next/image
[ ] Loading.tsx em rotas com fetch assíncrono
[ ] Error.tsx para tratamento de erros
[ ] Not-found.tsx para rotas não encontradas
[ ] Layout aninhado corretamente
[ ] Cache strategy definida para cada fetch
[ ] Server Actions com validação Zod
[ ] TypeScript sem any
```

---

## Erros Comuns
- `'use client'` desnecessário em componentes sem estado/interatividade
- `useEffect` para fetch em vez de Server Components
- `<img>` em vez de `next/image`
- Sem metadata nas páginas (ruim para SEO)
- Fetch sem estratégia de cache definida

---

## Validações Finais
- [ ] Server Components onde possível?
- [ ] Metadata configurada?
- [ ] Loading e Error states implementados?
- [ ] Imagens otimizadas com next/image?
- [ ] Cache strategy definida?

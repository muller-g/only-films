# SKILL: frontend-architecture

**Name:** frontend-architecture
**Description:** Design e implementação de arquitetura de sistemas frontend, incluindo estrutura de componentes, gerenciamento de estado, roteamento, performance e escalabilidade.
**Quando usar:** Ao projetar a arquitetura de um frontend novo, revisar organização de código existente ou definir padrões de componentes.

---

## Arquiteturas de Referência

### Feature-based (recomendado para projetos médio-grandes)
```
src/
  features/
    auth/
      components/LoginForm.tsx
      hooks/useAuth.ts
      services/auth.service.ts
      stores/auth.store.ts
      types/auth.types.ts
    users/
      components/UserList.tsx
      hooks/useUsers.ts
      ...
  shared/
    components/ui/Button.tsx
    hooks/useLocalStorage.ts
    utils/format.ts
    types/api.types.ts
  app/
    router.tsx
    providers.tsx
    App.tsx
```

### Princípio de Composição de Componentes
```typescript
// Padrão: composição em vez de herança e props drilling
// Container (lógica) + Presentation (visual)

function UserListContainer() {
    const { users, isLoading, error } = useUsers();
    return <UserList users={users} isLoading={isLoading} error={error} />;
}

function UserList({ users, isLoading, error }: UserListProps) {
    // Componente puro — sem lógica de negócio
    if (isLoading) return <Skeleton />;
    if (error) return <ErrorMessage error={error} />;
    if (!users.length) return <EmptyState />;
    return <ul>{users.map(u => <UserItem key={u.id} user={u} />)}</ul>;
}
```

### Gerenciamento de Estado — Decisão
```
useState       → estado local simples (abrir/fechar modal)
useReducer     → estado local complexo (formulário multi-step)
Context API    → estado compartilhado de escopo limitado (tema, lang)
Zustand/Pinia  → estado global de UI (auth, cart, notifications)
React Query    → estado de servidor (fetch, cache, mutation)
```

### Padrão de Service (chamadas de API)
```typescript
// services/users.service.ts — centralizar chamadas de API
const usersService = {
    async findAll(params?: UserFilters): Promise<PaginatedResponse<User>> {
        const response = await api.get('/api/v1/users', { params });
        return response.data;
    },
    async create(data: CreateUserDto): Promise<User> {
        const response = await api.post('/api/v1/users', data);
        return response.data.data;
    },
};
```

---

## Checklist de Quality Gate
```
[ ] Estrutura organizada por feature ou domínio
[ ] Componentes com responsabilidade única
[ ] Estado de servidor com React Query / SWR
[ ] Estado global apenas para dados verdadeiramente globais
[ ] Services para chamadas de API centralizadas
[ ] Lazy loading em rotas e componentes pesados
[ ] Tratamento de todos os estados (loading, error, empty)
[ ] TypeScript com interfaces para props e API response
[ ] Testes de componentes críticos
```

---

## Erros Comuns
- Fetch em useEffect em vez de React Query
- Props drilling profundo (extrair Context ou store)
- Estado global para coisas que são locais
- Componentes com 500+ linhas

---

## Validações Finais
- [ ] Estrutura organizada e escalável?
- [ ] Estado em camada adequada?
- [ ] Componentes testáveis e com responsabilidade única?

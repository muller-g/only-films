# SKILL: react-development

**Name:** react-development
**Description:** Desenvolvimento profissional com React e TypeScript, seguindo padrões modernos de componentes funcionais, hooks, gerenciamento de estado e performance.
**Quando usar:** Ao trabalhar em qualquer projeto React — SPAs, componentes, hooks customizados, gerenciamento de estado ou integração com APIs.

---

## Padrões Obrigatórios

### Estrutura de Componentes
```
src/
  components/
    ui/              # Componentes primitivos reutilizáveis
    layout/          # Estrutura de página
    features/        # Componentes de domínio
  pages/             # Componentes de rota/página
  hooks/             # Hooks customizados
  services/          # Chamadas de API
  stores/            # Estado global
  types/             # Tipos TypeScript
  utils/             # Funções utilitárias
```

### Componente Funcional Tipado
```typescript
interface UserCardProps {
    user: User;
    onEdit?: (user: User) => void;
    isLoading?: boolean;
}

export function UserCard({ user, onEdit, isLoading = false }: UserCardProps) {
    if (isLoading) return <UserCardSkeleton />;

    return (
        <div className="rounded-lg border p-4">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            {onEdit && (
                <button onClick={() => onEdit(user)}>Editar</button>
            )}
        </div>
    );
}
```

### Hooks Customizados
```typescript
// Separar lógica de negócio da apresentação
function useUsers(filters?: UserFilters) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['users', filters],
        queryFn: () => usersService.findAll(filters),
    });

    return { users: data?.data ?? [], isLoading, error, refetch };
}

// Uso no componente
function UsersPage() {
    const { users, isLoading, error } = useUsers();
    // componente limpo, sem lógica de fetch
}
```

### Gerenciamento de Estado
```typescript
// Estado local: useState / useReducer para estado de UI
const [isOpen, setIsOpen] = useState(false);

// Estado de servidor: React Query / SWR
const { data } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

// Estado global (Zustand):
const useAuthStore = create<AuthState>((set) => ({
    user: null,
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
}));
```

### Tratamento de Estados
```typescript
// Sempre implementar loading, error e empty states
function ProductList() {
    const { products, isLoading, error } = useProducts();

    if (isLoading) return <ProductListSkeleton />;
    if (error) return <ErrorMessage message={error.message} />;
    if (!products.length) return <EmptyState message="Nenhum produto encontrado" />;

    return (
        <ul>
            {products.map((p) => <ProductItem key={p.id} product={p} />)}
        </ul>
    );
}
```

### Formulários com React Hook Form
```typescript
interface LoginFormValues {
    email: string;
    password: string;
}

export function LoginForm() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>();

    const onSubmit = async (data: LoginFormValues) => {
        await authService.login(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('email', { required: 'Email obrigatório' })} />
            {errors.email && <span>{errors.email.message}</span>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
        </form>
    );
}
```

---

## Checklist de Quality Gate
```
[ ] Componentes funcionais com TypeScript tipado
[ ] Props com interface definida
[ ] Estados de loading, error e empty implementados
[ ] Hooks customizados para lógica reutilizável
[ ] React Query para dados do servidor
[ ] Formulários com React Hook Form + Zod
[ ] Lazy loading para rotas e componentes pesados
[ ] Memoização (useMemo, useCallback, React.memo) apenas onde necessário
[ ] Acessibilidade: alt text, labels, ARIA
[ ] Responsivo com Tailwind ou CSS-in-JS
```

---

## Erros Comuns
- Fetch de dados no `useEffect` em vez de React Query
- `any` em TypeScript
- Ausência de estados de loading e error
- Props drilling profundo (usar Context ou Zustand)
- Memoização prematura sem profiling

---

## Práticas Proibidas
- `useEffect` para sincronizar estado derivado
- `console.log` em produção
- Mutação direta de estado
- Componentes com mais de 200 linhas sem extração

---

## Validações Finais
- [ ] Todos os estados possíveis (loading, error, empty, success) tratados?
- [ ] TypeScript sem `any`?
- [ ] Componentes menores que 150 linhas?
- [ ] Hooks customizados para lógica reutilizável?

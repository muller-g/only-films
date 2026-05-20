# SKILL: vue-development

**Name:** vue-development
**Description:** Desenvolvimento profissional com Vue.js 3 e TypeScript, usando Composition API, Pinia, Vue Router e padrões modernos do ecossistema Vue.
**Quando usar:** Ao trabalhar em projetos Vue.js — SPAs, componentes, gerenciamento de estado com Pinia, roteamento ou integrações de API.

---

## Padrões Obrigatórios

### Componente com Composition API
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUsersStore } from '@/stores/users';

interface Props {
    userId: number;
    showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showActions: true,
});

const emit = defineEmits<{
    edit: [user: User];
    delete: [id: number];
}>();

const store = useUsersStore();
const isLoading = ref(false);

const user = computed(() => store.findById(props.userId));

onMounted(async () => {
    isLoading.value = true;
    await store.fetchUser(props.userId);
    isLoading.value = false;
});
</script>

<template>
    <div v-if="isLoading">Carregando...</div>
    <div v-else-if="user" class="user-card">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <button v-if="showActions" @click="emit('edit', user)">Editar</button>
    </div>
    <div v-else>Usuário não encontrado</div>
</template>
```

### Pinia Store
```typescript
// stores/users.ts
export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const totalCount = computed(() => users.value.length);

    async function fetchUsers(filters?: UserFilters) {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await usersService.findAll(filters);
            users.value = response.data;
        } catch (e) {
            error.value = 'Erro ao carregar usuários';
        } finally {
            isLoading.value = false;
        }
    }

    function findById(id: number) {
        return users.value.find((u) => u.id === id);
    }

    return { users, isLoading, error, totalCount, fetchUsers, findById };
});
```

### Composables (Hooks Vue)
```typescript
// composables/useAsync.ts
export function useAsync<T>(fn: () => Promise<T>) {
    const data = ref<T | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function execute() {
        isLoading.value = true;
        error.value = null;
        try {
            data.value = await fn();
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Erro desconhecido';
        } finally {
            isLoading.value = false;
        }
    }

    return { data, isLoading, error, execute };
}
```

### Vue Router com Guards
```typescript
// router/index.ts
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomePage },
        {
            path: '/dashboard',
            component: DashboardLayout,
            meta: { requiresAuth: true },
            children: [
                { path: '', component: DashboardPage },
                { path: 'users', component: UsersPage },
            ],
        },
    ],
});

router.beforeEach((to) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return '/login';
    }
});
```

---

## Checklist de Quality Gate
```
[ ] Composition API (<script setup>) em todos os componentes
[ ] TypeScript com tipos nas props e emits
[ ] Pinia para estado global
[ ] Composables para lógica reutilizável
[ ] v-if/v-else para loading, error e empty states
[ ] Validação de formulários com Vee-Validate ou biblioteca customizada
[ ] Vue Router com guards de autenticação
[ ] Componentes menores que 150 linhas
[ ] Sem lógica de negócio no template
```

---

## Erros Comuns
- Options API em projetos novos (usar Composition API)
- Estado mutado fora do store
- `any` em TypeScript
- Lógica complexa no template

---

## Práticas Proibidas
- `Options API` em projetos novos sem motivo
- Mutação direta de props
- `console.log` em produção
- Componentes com mais de 200 linhas sem extração

---

## Validações Finais
- [ ] Composition API usada corretamente?
- [ ] Estado global no Pinia?
- [ ] Loading, error e empty states implementados?
- [ ] Composables para lógica reutilizável?

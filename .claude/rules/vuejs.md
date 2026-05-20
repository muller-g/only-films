# Regras para Vue.js

Regras específicas para projetos Vue.js 3 com TypeScript.

---

## Composition API

```
OBRIGATÓRIO:
- <script setup lang="ts"> em todos os componentes
- TypeScript com defineProps e defineEmits tipados
- Composition API (não Options API)
- Composables para lógica reutilizável
- Pinia para estado global

PROIBIDO:
- Options API em projetos novos
- Mutação direta de props
- this.$parent ou this.$root
- Estado global em data() compartilhado
```

## Pinia

```
OBRIGATÓRIO:
- Composition API style (não Options)
- Actions assíncronas com isLoading e error
- Estado do servidor separado do estado de UI
- Persistência configurada para dados críticos

PROIBIDO:
- Mutação de estado fora de actions
- Vuex em projetos novos
```

## Formulários

```
- Vee-Validate + Zod/Yup para validação
- v-model com debounce para buscas
- Desabilitar submit durante isLoading
- Feedback inline de erro (não apenas alert)
```

## Template

```
OBRIGATÓRIO:
- key em todos os v-for
- :key único e estável (não index)
- v-if separado do v-for (usar template)
- Evitar lógica complexa no template

PROIBIDO:
- v-if e v-for no mesmo elemento
- Mutação em template
- Computed com side effects
```

## Acessibilidade

```
- HTML semântico
- :aria-* attributes onde necessário
- Labels em todos os inputs
- Focus management em modals e drawers
```

---

*Versão: 1.0.0 — 2026-05*

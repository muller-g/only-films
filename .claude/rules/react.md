# Regras para React

Regras específicas para projetos React/TypeScript.

---

## Componentes

```
OBRIGATÓRIO:
- Componentes funcionais com TypeScript
- Interface para todas as props
- Valores default explícitos
- Componentes menores que 150 linhas
- Um componente por arquivo

PROIBIDO:
- Class components (usar hooks)
- any em TypeScript sem justificativa
- Props sem tipagem
- Lógica de negócio no componente de UI
```

## Hooks

```
OBRIGATÓRIO:
- Custom hooks para lógica reutilizável
- React Query para estado de servidor
- useState/useReducer para estado local de UI
- Zustand/Jotai para estado global

PROIBIDO:
- useEffect para fetch de dados (usar React Query)
- useEffect para sincronizar estado derivado
- Estado global para dados locais de componente
```

## Performance

```
- React.memo apenas quando profiling mostrar necessidade
- useMemo/useCallback apenas para cálculos caros ou referências estáveis
- Lazy loading em rotas e componentes pesados
- Virtualização para listas longas (> 100 itens)
- Evitar re-renders desnecessários (identificar com React DevTools)
```

## Formulários

```
- React Hook Form para formulários complexos
- Zod para schema de validação
- Feedback de erro inline (não apenas alert)
- Disable submit durante loading
- Reset após submissão bem-sucedida
```

## Acessibilidade

```
OBRIGATÓRIO:
- HTML semântico (button, nav, main, section, article)
- alt text em todas as imagens
- Labels associados a todos os inputs
- Focus visible em elementos interativos
- Navegação por teclado funcional
- Contraste mínimo 4.5:1
```

## Estrutura de Pastas

```
src/
  components/ui/       # Primitivos (Button, Input, Modal)
  components/layout/   # Estrutura (Header, Sidebar, Footer)
  components/features/ # Componentes de domínio
  pages/               # Componentes de rota
  hooks/               # Custom hooks
  services/            # Chamadas de API
  stores/              # Estado global
  types/               # TypeScript types
  utils/               # Funções utilitárias
```

---

*Versão: 1.0.0 — 2026-05*

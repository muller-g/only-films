# /create-page

## Objetivo
Criar uma tela/página frontend completa seguindo padrões de UX/UI, acessibilidade, responsividade e arquitetura do framework em uso.

## Quando Usar
- Ao criar uma nova tela em Next.js, React ou Vue.js
- Ao criar um fluxo de páginas interligadas
- Ao criar um layout ou componente de página base

## Entrada Esperada
```
/create-page

Nome da página: [nome descritivo]
Framework: [Next.js | React | Vue.js]
Tipo: [listagem | formulário | dashboard | detalhe | autenticação]
Dados: [quais dados a página exibe ou manipula]
Auth: [pública | autenticada | admin]
Design: [Tailwind | MUI | shadcn/ui | etc.]
```

## Processo Detalhado

### Fase 1: Design da Página
1. Definir o objetivo da página
2. Mapear os componentes necessários
3. Definir o fluxo de dados (fetch, estado, mutations)
4. Definir comportamento de loading e erro
5. Definir responsividade

### Fase 2: Estrutura de Componentes
Seguir a hierarquia:
```
Page (rota/view)
  └── Layout (estrutura geral)
       ├── Header/Nav
       ├── PageContent
       │    ├── PageHeader (título, breadcrumb, ações)
       │    ├── Filters (se listagem)
       │    ├── DataDisplay (tabela/cards/grid)
       │    └── Pagination (se listagem)
       └── Footer
```

### Fase 3: Gerenciamento de Estado
- Dados do servidor: React Query / SWR / useFetch
- Estado local da UI: useState / useReducer
- Estado global: Pinia (Vue) / Zustand / Redux (React)
- Formulários: React Hook Form / Vee-Validate

### Fase 4: Acessibilidade
```
[ ] HTML semântico (nav, main, section, article, h1-h6)
[ ] Alt text em todas as imagens
[ ] Labels em todos os inputs de formulário
[ ] Navegação por teclado funcional
[ ] ARIA attributes onde necessário
[ ] Contraste de cores adequado
[ ] Focus visible em elementos interativos
```

### Fase 5: Performance
```
[ ] Lazy loading para componentes pesados
[ ] Imagens com next/image ou lazy loading
[ ] Skeleton loading para melhor UX
[ ] Memoização de componentes caros (React.memo, useMemo)
[ ] Paginação ou virtualização para listas longas
```

## Checklist
- [ ] Estrutura de componentes bem definida
- [ ] Dados carregados com loading state
- [ ] Erros tratados com mensagens úteis
- [ ] Estado vazio (empty state) implementado
- [ ] Responsivo para mobile, tablet e desktop
- [ ] Acessibilidade básica implementada
- [ ] Navegação por teclado funcional
- [ ] Testes de componente criados

## Formato Esperado da Resposta
```
## Página criada: [Nome]

**Framework:** [framework]
**Rota:** [/path/da/pagina]
**Auth:** [pública | protegida]

### Componentes criados:
- [componente 1] — [propósito]
- [componente 2] — [propósito]

### Estado e dados:
- [hook/store utilizado]
- [endpoints consumidos]

### Arquivos criados:
- [arquivo] — [descrição]
```

## Boas Práticas
- Separar lógica de negócio da apresentação (hooks customizados)
- Componentes menores são mais testáveis e reutilizáveis
- Sempre implementar estados de loading, erro e vazio

## Validações Finais
- [ ] A página funciona em mobile e desktop?
- [ ] Os estados de loading e erro estão implementados?
- [ ] A navegação por teclado funciona?
- [ ] Os testes passam?

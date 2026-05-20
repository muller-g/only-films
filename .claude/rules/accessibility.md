# Regras de Acessibilidade

Padrões de acessibilidade para aplicações web (WCAG 2.1 AA).

---

## HTML Semântico

```
OBRIGATÓRIO:
- <main> para conteúdo principal
- <nav> para navegação
- <header>, <footer>, <section>, <article> onde adequado
- <h1> a <h6> em hierarquia correta (não pular níveis)
- <button> para ações, <a> para navegação
- <label> associado a todo <input>
- <table> com <thead>, <tbody>, <th scope>
- <ul>/<ol> para listas (não <div> com bullets)

PROIBIDO:
- <div> para botões (usar <button>)
- <span> clicável sem role e aria-label
- Heading fora de hierarquia (h1 → h3 sem h2)
```

## Imagens

```
OBRIGATÓRIO:
- alt="" em imagens decorativas
- alt="Descrição significativa" em imagens informativas
- aria-label em ícones sem texto

PROIBIDO:
- alt ausente
- alt="imagem" ou "foto" (sem significado)
- Texto em imagens sem alternativa textual
```

## Formulários

```
OBRIGATÓRIO:
- <label for="id"> ou <label> envolvendo o input
- aria-describedby para mensagens de erro
- required e aria-required="true"
- Mensagens de erro claras e associadas ao campo
- Feedback não apenas por cor
```

## Teclado

```
OBRIGATÓRIO:
- Toda funcionalidade acessível por teclado
- Ordem de foco lógica e visível
- Não armadilhas de foco (focus trap apenas em modals ativos)
- Skip to content link no topo
- ESC fecha modals e drawers

PROIBIDO:
- outline: none sem alternativa visual
- Conteúdo apenas acessível com mouse
```

## Contraste

```
Texto normal (< 18px): mínimo 4.5:1
Texto grande (≥ 18px ou 14px bold): mínimo 3:1
Elementos de UI (inputs, botões): mínimo 3:1
```

## ARIA (usar com parcimônia)

```
- ARIA apenas quando HTML nativo não resolve
- aria-label para elementos sem texto visível
- aria-expanded em dropdowns e accordions
- aria-live="polite" para atualizações de conteúdo dinâmico
- role="dialog" + aria-modal em modals
- aria-current="page" no item de nav ativo
```

---

*Versão: 1.0.0 — 2026-05*

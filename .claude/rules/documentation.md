# Regras de Documentação

Padrões para criação e manutenção de documentação técnica.

---

## O Que Documentar

```
OBRIGATÓRIO:
- Decisões arquiteturais (ADR em docs/adr/)
- APIs públicas (OpenAPI/Swagger)
- Variáveis de ambiente (.env.example atualizado)
- Como rodar o projeto localmente (README)
- Comportamentos não óbvios (comentários no código)
- Workarounds com justificativa

NÃO DOCUMENTAR:
- O que o código obviamente faz pelo nome
- Comentários que repetem o nome da variável
- TODO genérico sem responsável e contexto
```

## Comentários de Código

```
QUANDO COMENTAR:
- Workaround para bug externo (com link para issue)
- Decisão não óbvia com contexto importante
- Invariante ou constraint não evidente
- Comportamento que surpreenderia um dev experiente

COMO COMENTAR:
// Explica o PORQUÊ, não o O QUÊ
// Stripe requer amount em centavos (sem ponto flutuante)
const amountInCents = Math.round(price * 100);
```

## ADRs (Architecture Decision Records)

```
- Criar para toda decisão arquitetural importante
- Formato: contexto → decisão → alternativas → consequências
- Imutáveis: não editar, criar novo que supersede
- Listar em docs/adr/README.md
- Numeração sequencial: ADR-001, ADR-002
```

## README

```
OBRIGATÓRIO:
- O que o projeto faz (1-2 parágrafos)
- Como rodar localmente (passo a passo)
- Variáveis de ambiente necessárias
- Como executar os testes
- Como fazer deploy
- Links para documentação adicional
```

## Documentação de API

```
OBRIGATÓRIO para cada endpoint:
- Método e path
- Autenticação necessária
- Parâmetros de entrada (tipo, obrigatório, exemplo)
- Estrutura de resposta
- Exemplos de request e response
- Códigos de erro possíveis
```

---

*Versão: 1.0.0 — 2026-05*

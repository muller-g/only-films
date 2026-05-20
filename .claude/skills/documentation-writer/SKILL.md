# SKILL: documentation-writer

**Name:** documentation-writer
**Description:** Escrita de documentação técnica clara, útil e mantível para código, APIs, arquitetura e processos, no formato adequado para humanos e agentes de IA.
**Quando usar:** Ao criar ou atualizar qualquer tipo de documentação técnica — README, docs de API, ADRs, guias de onboarding ou documentação de arquitetura.

---

## Princípios da Boa Documentação

1. **Escrita para quem não conhece o código** — não pressupõe contexto
2. **Exemplos concretos** valem mais que descrições abstratas
3. **Mantível** — próxima ao código, atualizada no mesmo PR
4. **Acionável** — o leitor sabe o que fazer após ler
5. **Concisa** — sem informação repetida ou óbvia

---

## Templates por Tipo

### README de Módulo
```markdown
# [Nome do Módulo]

Breve descrição do que o módulo faz (1-2 frases).

## Quando usar
[Casos de uso onde este módulo é aplicável]

## Como usar
```[linguagem]
// Exemplo concreto e funcional
```

## API
| Método/Endpoint | Parâmetros | Retorno | Descrição |
|---|---|---|---|
| ... | ... | ... | ... |

## Dependências
- [dependência] — [para que é usada]

## Decisões de design
- [decisão] — [justificativa]
```

### Documentação de Endpoint
```markdown
### POST /api/v1/users

Cria um novo usuário no sistema.

**Auth:** Bearer Token (admin)

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "minhasenha"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "created_at": "2026-05-19T10:00:00Z"
  }
}
```

**Erros:**
- `422` — validação falhou
- `409` — email já existe
- `401` — não autenticado
- `403` — sem permissão de admin
```

### Comentário de Código (quando necessário)
```typescript
// Motivo não óbvio — o PORQUÊ, não o O QUÊ
// Stripe requer amount em centavos (sem ponto flutuante)
const amountInCents = Math.round(price * 100);

// Workaround para bug do TypeORM #1234 com UUID em SQLite
// Pode ser removido na versão 0.4 do TypeORM
const id = Buffer.from(rawId).toString('hex');
```

---

## Documentação para Agentes de IA

Para que agentes entendam rapidamente um módulo:

```markdown
## Contexto para IA

**Responsabilidade:** [o que este módulo faz]
**Stack:** [tecnologias usadas]
**Camada:** [controller | service | repository | util]
**Dependências:** [o que este módulo usa]
**Dependentes:** [quem usa este módulo]
**Regras de negócio importantes:** [regras não óbvias]
**Não alterar sem verificar:** [arquivos que têm dependência crítica]
```

---

## Checklist de Quality Gate
```
[ ] README com exemplos funcionais
[ ] API documentada com request/response e erros
[ ] Decisões não óbvias comentadas no código
[ ] ADR para decisões arquiteturais
[ ] .env.example atualizado
[ ] CHANGELOG atualizado (se projeto com versioning)
[ ] Onboarding: como rodar localmente
```

---

## Erros Comuns
- Documentar o "o quê" em vez do "por quê"
- Documentação desatualizada (pior que sem documentação)
- Comentários que repetem o nome da variável/função
- Exemplos que não funcionam

---

## Validações Finais
- [ ] Alguém novo entende sem ler o código?
- [ ] Os exemplos são funcionais e testados?
- [ ] A documentação está atualizada com o código atual?
- [ ] Decisões não óbvias têm justificativa?

# /generate-docs

## Objetivo
Gerar documentação técnica completa e útil para um módulo, endpoint, feature ou projeto inteiro, nos formatos adequados para humanos e agentes de IA.

## Quando Usar
- Ao documentar um módulo ou feature recém-implementada
- Ao criar documentação de API (OpenAPI/Swagger)
- Ao documentar arquitetura de um sistema
- Ao criar guias de onboarding técnico

## Entrada Esperada
```
/generate-docs

Alvo: [módulo | endpoint | feature | arquitetura | onboarding]
Formato: [markdown | openapi | jsdoc | phpdoc]
Arquivo(s): [código a documentar]
Público: [dev interno | agente de IA | cliente de API | novo dev]
```

## Processo Detalhado

### Tipos de Documentação

**1. Documentação de API (OpenAPI):**
```yaml
/api/v1/users:
  post:
    summary: Criar novo usuário
    tags: [Users]
    security: [bearerAuth: []]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [name, email, password]
            properties:
              name:
                type: string
                example: "João Silva"
              email:
                type: string
                format: email
                example: "joao@exemplo.com"
    responses:
      '201':
        description: Usuário criado com sucesso
      '422':
        description: Dados de entrada inválidos
```

**2. Documentação de Módulo (Markdown):**
```markdown
## Módulo: UserService

### Responsabilidade
Gerencia toda a lógica de negócio relacionada a usuários.

### Métodos públicos
| Método | Parâmetros | Retorno | Descrição |
|---|---|---|---|
| create(data) | CreateUserDto | User | Cria novo usuário |
| findById(id) | number | User \| null | Busca por ID |

### Dependências
- UserRepository
- PasswordHashService
- EmailService
```

**3. Documentação de Arquitetura:**
```markdown
## Arquitetura do Módulo de Pagamentos

### Fluxo de processamento
[Diagrama em ASCII ou mermaid]

### Decisões de design
- [decisão 1 com justificativa]

### Integrações externas
- Stripe: processamento de cartão
- PagSeguro: PIX e boleto
```

## Checklist
- [ ] Toda função/método pública está documentada
- [ ] Parâmetros e tipos de retorno descritos
- [ ] Casos de erro documentados
- [ ] Exemplos de uso incluídos
- [ ] Decisões não óbvias explicadas
- [ ] Links para recursos relacionados
- [ ] Documentação está atualizada com o código

## Formato Esperado da Resposta
```
## Documentação gerada: [alvo]

**Formato:** [markdown | openapi | etc.]
**Localização:** [docs/path/arquivo.md]

### Preview:
[prévia da documentação gerada]

### Arquivos criados:
- [arquivo 1]

### O que não foi documentado (e por quê):
- [item — motivo]
```

## Boas Práticas
- Documentação deve ser escrita para quem não conhece o código
- Exemplos concretos valem mais que descrições abstratas
- Manter documentação próxima ao código (não em wiki separada)
- Atualizar documentação no mesmo PR que o código

## Validações Finais
- [ ] A documentação está atualizada com o código atual?
- [ ] Os exemplos funcionam como documentado?
- [ ] Alguém novo entenderia sem precisar ler o código?

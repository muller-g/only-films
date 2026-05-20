# /create-feature

## Objetivo
Criar uma nova feature completa seguindo o workflow de desenvolvimento, desde o planejamento até a documentação, garantindo qualidade, testes e rastreabilidade.

## Quando Usar
- Ao implementar uma funcionalidade nova com requisito definido
- Ao criar um módulo ou subsistema novo
- Ao adicionar um fluxo de negócio ao sistema

## Entrada Esperada
```
/create-feature

Descrição: [descrição clara da feature]
Contexto: [qual problema resolve / qual necessidade atende]
Stack: [Laravel | NestJS | Next.js | Vue.js | etc.]
```

## Processo Detalhado

### Fase 1: Análise e Planejamento
1. Entender completamente o requisito — perguntar se houver ambiguidade
2. Identificar entidades de banco de dados envolvidas
3. Mapear endpoints de API necessários
4. Identificar telas/componentes de frontend necessários
5. Verificar se existe código reutilizável no projeto
6. Identificar dependências de outras features
7. Estimar impacto em funcionalidades existentes

### Fase 2: Design Técnico
Criar um plano com:
```
- Modelo de dados (tabelas, campos, relacionamentos)
- Endpoints de API (método, path, payload, resposta)
- Componentes de UI (telas, fluxo de navegação)
- Services e regras de negócio
- Testes necessários
```

### Fase 3: Implementação Backend
1. Criar migration de banco de dados (se necessário)
2. Criar ou atualizar Model/Entity
3. Criar Repository/Service com a lógica de negócio
4. Criar Controller/Resolver com validação de inputs
5. Criar testes unitários para o service
6. Criar testes de integração para os endpoints
7. Atualizar documentação de API

### Fase 4: Implementação Frontend (se aplicável)
1. Criar componentes de UI reutilizáveis
2. Criar página/tela conectada à API
3. Implementar gerenciamento de estado (Pinia, Redux, Context)
4. Implementar tratamento de erros e loading states
5. Garantir responsividade
6. Criar testes de componente

### Fase 5: Integração e Validação
1. Testar o fluxo completo end-to-end
2. Verificar edge cases e cenários de erro
3. Validar segurança dos endpoints
4. Verificar performance (sem N+1 queries)
5. Executar lint e type check

### Fase 6: Documentação
1. Atualizar `docs/api/` se endpoints foram criados
2. Criar ou atualizar documentação de features em `docs/product/`
3. Criar ADR se houve decisão arquitetural relevante

## Checklist
- [ ] Requisito entendido e sem ambiguidades
- [ ] Plano técnico criado e aprovado
- [ ] Migration criada e reversível
- [ ] Model/Entity criado com validações
- [ ] Service com lógica de negócio implementado
- [ ] Controller com validação de inputs criado
- [ ] Autorização verificada nos endpoints
- [ ] Testes unitários criados
- [ ] Testes de integração criados
- [ ] Frontend implementado (se aplicável)
- [ ] Tratamento de erros implementado
- [ ] Documentação de API atualizada
- [ ] Sem queries N+1
- [ ] Sem dados sensíveis expostos
- [ ] Lint e type check passando

## Formato Esperado da Resposta

```
## Feature: [nome da feature]

**Branch sugerida:** feature/[scope]-[description]
**Estimativa:** [x horas/dias]

### Plano de implementação:
1. [passo 1]
2. [passo 2]
...

### Arquivos que serão criados/alterados:
- [arquivo] — [propósito]

### Endpoints criados:
- POST /api/v1/[resource] — [descrição]
- GET /api/v1/[resource]/:id — [descrição]

### Banco de dados:
- Nova tabela: [nome] com campos [lista]
- Relacionamento: [descrição]

### Testes:
- [teste 1]
- [teste 2]
```

## Boas Práticas
- Sempre criar a migration antes de implementar o código
- Testes devem cobrir o happy path e os principais cenários de erro
- Controllers devem ser finos — lógica de negócio fica nos services
- Validação de input deve acontecer na camada de entrada (FormRequest, DTO, Zod)
- Autorização deve ser verificada antes de qualquer operação em dados

## Erros Comuns
- Implementar sem migration: banco de dados desincronizado
- Lógica de negócio no controller: impossível testar unitariamente
- Sem tratamento de erros: usuário vê stack trace em produção
- Sem paginação em listagens: crash em produção com dados reais
- Commit com a feature e a refatoração juntos: difícil de fazer code review

## Validações Finais
- [ ] A feature funciona no fluxo completo?
- [ ] Os casos de erro retornam mensagens úteis?
- [ ] A documentação de API está atualizada?
- [ ] Os testes passam?
- [ ] Não há dados sensíveis expostos?
- [ ] A branch está pronta para Pull Request?

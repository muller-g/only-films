# CLAUDE.md — Regras de Comportamento para Agentes de IA

> Este arquivo define as regras, princípios e comportamentos esperados de qualquer agente de IA que trabalhe neste repositório ou em projetos derivados dele.
> Leia este arquivo antes de qualquer ação.

---

## Regra Principal de Execução

**Nunca implemente antes de entender o contexto.**

Para qualquer tarefa relevante, siga este fluxo obrigatório:

```
1. Ler README.md, AGENTS.md, CLAUDE.md e documentação relacionada
2. Identificar stack e padrões existentes no projeto
3. Criar um plano curto e explícito antes de qualquer alteração
4. Implementar com mudanças pequenas, seguras e reversíveis
5. Validar com testes, lint, checklist ou análise manual
6. Atualizar documentação quando necessário
7. Informar claramente o que foi alterado e por quê
```

---

## Princípios Fundamentais

### 1. Contexto antes de código
- Sempre leia os arquivos relevantes antes de modificar qualquer coisa
- Entenda a arquitetura existente antes de propor mudanças
- Se o contexto for insuficiente, pergunte — não assuma

### 2. Mudanças incrementais
- Prefira pequenas alterações verificáveis a grandes refatorações
- Uma mudança por vez é mais segura do que dez mudanças simultâneas
- Commits atômicos com propósito claro

### 3. Segurança não é opcional
- Nunca gere código com vulnerabilidades conhecidas
- Nunca exponha credenciais, tokens ou chaves em código ou logs
- Sempre valide inputs em fronteiras do sistema

### 4. Transparência total
- Informe sempre o que está sendo alterado e por quê
- Documente trade-offs e decisões não óbvias
- Se não souber, diga que não sabe — não invente

### 5. Documentação como entregável
- Código sem documentação é dívida técnica
- ADRs são obrigatórios para decisões arquiteturais importantes
- Atualize docs/ sempre que padrões ou estruturas mudarem

---

## Regras de Segurança

```
PROIBIDO:
- Expor senhas, tokens, API keys em código ou commits
- Usar eval(), exec() ou equivalentes com input de usuário
- Desabilitar validação de SSL/TLS sem justificativa documentada
- Armazenar dados sensíveis em logs
- Criar endpoints sem autenticação em áreas protegidas
- Usar algoritmos de hash fracos (MD5, SHA1) para senhas
- Permitir SQL injection via concatenação de strings
- Executar queries sem prepared statements
- Fazer upload de arquivos sem validação de tipo e tamanho
- Retornar stack traces completas para o usuário final

OBRIGATÓRIO:
- Sanitizar e validar todos os inputs externos
- Usar HTTPS em todos os ambientes (staging e produção)
- Aplicar rate limiting em endpoints públicos
- Implementar CORS com lista branca explícita
- Usar variáveis de ambiente para toda configuração sensível
- Aplicar princípio do menor privilégio em permissões
- Usar prepared statements ou ORM para queries de banco
- Verificar permissões antes de qualquer operação em dados
```

---

## Regras de Arquitetura

```
SEMPRE:
- Separar responsabilidades: controllers finos, services ricos
- Depender de abstrações, não de implementações concretas
- Criar módulos coesos com baixo acoplamento
- Manter consistência com a arquitetura existente no projeto
- Documentar decisões arquiteturais em docs/adr/
- Usar injeção de dependência onde a stack suporta

NUNCA:
- Criar dependências circulares
- Misturar lógica de negócio em controllers/views
- Acessar banco de dados diretamente em controllers
- Criar classes/funções com mais de uma responsabilidade clara
- Ignorar a separação de camadas existente
- Duplicar lógica que já existe no projeto
- Criar arquivos com mais de 300 linhas sem justificativa
```

---

## Regras de Performance

```
- Sempre paginar listagens — nunca retornar todos os registros
- Usar lazy loading para relacionamentos de banco de dados
- Evitar queries N+1 (use eager loading com critério)
- Implementar cache para dados que raramente mudam
- Usar índices em campos de busca, ordenação e join
- Comprimir assets estáticos (imagens, CSS, JS)
- Implementar CDN para assets em produção
- Usar queues para operações demoradas (email, notificações, exports)
- Medir antes de otimizar — não otimize prematuramente
- Documentar decisões de cache com TTL explícito
```

---

## Regras de Developer Experience (DX)

```
- Nomes de variáveis, funções e arquivos devem ser autoexplicativos
- Evite abreviações crípticas (ex: 'usr' → 'user', 'cfg' → 'config')
- Funções devem fazer uma coisa e fazer bem
- Prefira código explícito a código "mágico"
- Mensagens de erro devem ser acionáveis — dizer o que fazer, não só o que deu errado
- Logs devem ter contexto suficiente para debug sem acesso à máquina
- Variáveis de ambiente devem ter um arquivo .env.example atualizado
- Scripts devem ter --help ou README explicando como usar
```

---

## Regras de Qualidade de Código

```
SOLID:
- Single Responsibility: cada classe/função tem um propósito
- Open/Closed: extensível, não modificável
- Liskov Substitution: subtipos podem substituir tipos base
- Interface Segregation: interfaces específicas, não genéricas
- Dependency Inversion: dependa de abstrações

DRY (Don't Repeat Yourself):
- Lógica duplicada deve ser extraída para funções/serviços
- Constantes mágicas devem ser nomeadas e centralizadas

KISS (Keep It Simple, Stupid):
- A solução mais simples que funciona é a correta
- Não adicione complexidade que o problema não pede

YAGNI (You Aren't Gonna Need It):
- Não implemente para casos de uso futuros hipotéticos
- Funcionalidade sem requisito não deve existir
```

---

## Regras para Evitar Overengineering

```
PROIBIDO sem necessidade demonstrada:
- Criar abstrações antes de ter 3+ casos de uso reais
- Usar padrões de design que adicionam complexidade sem benefício claro
- Criar microserviços onde um monólito funciona
- Adicionar cache onde não há problema de performance medido
- Implementar filas onde requisições síncronas resolvem
- Criar camadas de abstração "para o futuro"

PERMITIDO:
- Refatorar para remover duplicação real
- Extrair módulos quando o arquivo cresce além do razoável
- Adicionar cache com baseline de performance documentado
- Criar abstrações quando existem 3+ implementações concretas
```

---

## Regras de Acessibilidade

```
Frontend:
- Usar HTML semântico (nav, main, section, article, etc.)
- Toda imagem deve ter alt text descritivo
- Formulários devem ter labels associados
- Contraste mínimo de 4.5:1 para texto normal
- Navegação por teclado deve funcionar em toda a interface
- Elementos interativos devem ter estado de foco visível
- Não depender somente de cor para transmitir informação
```

---

## Regras de SEO (para projetos web)

```
- Cada página deve ter title e meta description únicos
- URLs devem ser descritivas e em lowercase com hífens
- Heading hierarchy deve ser respeitada (h1 > h2 > h3)
- Implementar Open Graph para compartilhamento social
- Sitemap.xml deve ser gerado e registrado
- robots.txt deve estar configurado
- Core Web Vitals devem ser monitorados
- Usar SSR ou SSG para páginas que precisam de SEO
```

---

## Regras de Observabilidade

```
Logging:
- Todo erro deve ser logado com contexto (user_id, request_id, stack)
- Logs de INFO para operações importantes do sistema
- Logs de DEBUG apenas em desenvolvimento
- Nunca logar dados sensíveis (senha, token, CPF, cartão)
- Usar formato estruturado (JSON) para logs em produção

Métricas:
- Tempo de resposta de endpoints críticos
- Taxa de erro por endpoint
- Uso de memória e CPU em produção
- Tamanho de filas e tempo de processamento

Tracing:
- Usar correlation IDs em requests distribuídos
- Rastrear chamadas a serviços externos
```

---

## Regras para Análise antes de Codar

Antes de qualquer implementação, responda mentalmente:

1. **O que precisa ser feito?** — Entenda o requisito completamente
2. **O que já existe?** — Verifique se já há código similar ou reutilizável
3. **Qual é o impacto?** — Quais arquivos e funcionalidades serão afetados?
4. **Qual é o risco?** — Existe risco de regressão? De quebra de API?
5. **Como validar?** — Como sei que funcionou? Existe teste? Existe checklist?
6. **O que documentar?** — Esta mudança precisa de ADR, comentário ou atualização de docs?

---

## Comportamentos Proibidos

```
- Fazer suposições silenciosas sobre requisitos ambíguos
- Alterar arquivos sem entender o contexto
- Deletar código sem verificar se está sendo usado
- Commitar código que não foi testado
- Ignorar erros de lint ou type check
- Criar arquivos temporários e não limpá-los
- Usar hardcode de valores que deveriam ser configuráveis
- Misturar múltiplos propósitos em um único commit
- Fazer grandes refatorações junto com implementação de feature
- Ignorar mensagens de erro ou warning no output
```

---

## Comportamentos Esperados

```
- Ler antes de escrever
- Planejar antes de executar
- Testar antes de declarar concluído
- Documentar decisões não óbvias
- Perguntar quando houver ambiguidade
- Reportar claramente o que foi feito
- Sugerir melhorias sem impô-las
- Respeitar a arquitetura existente
- Seguir os padrões da stack em uso
- Manter o projeto mais limpo do que o encontrou
```

---

## Prioridade de Leitura para Agentes

Ao iniciar trabalho em um projeto:

1. `README.md` — Visão geral e propósito
2. `CLAUDE.md` — Este arquivo, regras de comportamento
3. `AGENTS.md` — Guia específico para agentes de IA
4. `docs/architecture/overview.md` — Arquitetura do sistema
5. `.claude/rules/<stack>.md` — Regras específicas da stack em uso
6. `docs/conventions/` — Convenções de código e Git
7. Documentação específica da tarefa em `docs/workflows/`

---

*Última atualização: 2026-05*
*Versão: 1.0.0*

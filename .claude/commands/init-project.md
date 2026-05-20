# /init-project

## Objetivo
Inicializar um novo projeto profissional a partir deste template, configurando a estrutura base, documentação inicial e arquivos de configuração de acordo com a stack escolhida.

## Quando Usar
- Ao iniciar um projeto novo do zero
- Ao adaptar este template para um projeto específico
- Ao configurar um repositório existente com boa governança técnica

## Entrada Esperada
```
/init-project

Informações necessárias (perguntar ao usuário):
- Nome do projeto
- Tipo de projeto (web app, API, e-commerce, sistema interno, etc.)
- Stack principal (Laravel, NestJS, Next.js, Vue.js, etc.)
- Banco de dados (MySQL, PostgreSQL, MongoDB)
- Precisa de autenticação? (sim/não)
- Precisa de Docker? (sim/não)
- Ambiente de deploy (VPS, AWS, GCP, Railway, Vercel)
- Contexto do negócio (breve descrição do que o sistema vai fazer)
```

## Processo Detalhado

### Fase 1: Coleta de Informações
1. Perguntar as informações listadas acima ao usuário
2. Confirmar a stack e as necessidades antes de prosseguir
3. Verificar se o diretório atual é o projeto correto

### Fase 2: Personalização do Template
1. Atualizar `README.md` com o nome e contexto real do projeto
2. Criar `docs/product/vision.md` com a visão do produto
3. Criar `docs/product/scope.md` com o escopo definido
4. Atualizar `docs/architecture/overview.md` com a stack escolhida
5. Criar `.env.example` com as variáveis necessárias

### Fase 3: Configuração da Stack
Dependendo da stack escolhida:

**Laravel:**
- Criar `composer.json` base
- Configurar estrutura de pastas (app/Http, app/Services, app/Repositories)
- Criar seeder de usuário admin
- Criar migration inicial

**NestJS:**
- Criar `package.json` base
- Configurar estrutura de módulos
- Criar módulo de autenticação base
- Configurar TypeORM ou Prisma

**Next.js:**
- Criar `package.json` base
- Configurar App Router ou Pages Router
- Configurar Tailwind CSS
- Criar layout base

**Vue.js:**
- Criar `package.json` base
- Configurar Pinia para estado
- Configurar Vue Router
- Criar layout base

### Fase 4: Configuração de Qualidade
1. Criar `.gitignore` adequado para a stack
2. Criar `.editorconfig`
3. Criar configuração de ESLint/PHP CS Fixer
4. Criar configuração de Prettier (se aplicável)
5. Criar `Makefile` ou `package.json` scripts

### Fase 5: Docker (se solicitado)
1. Criar `docker-compose.yml` base
2. Criar `Dockerfile` para a aplicação
3. Criar `docker-compose.dev.yml` para desenvolvimento
4. Documentar os serviços em `docs/deployment/docker.md`

### Fase 6: Documentação Final
1. Criar `docs/adr/001-stack-selection.md` documentando a escolha da stack
2. Atualizar `AGENTS.md` com detalhes do projeto
3. Criar `docs/conventions/naming.md` com padrões do projeto

## Checklist
- [ ] Informações do projeto coletadas
- [ ] README.md atualizado com contexto real
- [ ] docs/product/ criado com visão e escopo
- [ ] docs/architecture/overview.md atualizado com a stack
- [ ] .env.example criado com todas as variáveis necessárias
- [ ] .gitignore configurado para a stack
- [ ] Configuração de qualidade (lint, format) criada
- [ ] Docker configurado (se solicitado)
- [ ] ADR de seleção de stack criado
- [ ] Estrutura de pastas da aplicação criada

## Formato Esperado da Resposta

```
## Projeto inicializado: [Nome do Projeto]

**Stack:** [stack]
**Banco:** [banco]
**Deploy:** [ambiente]

### Arquivos criados:
- README.md — atualizado com contexto do projeto
- docs/product/vision.md — visão do produto
- docs/product/scope.md — escopo definido
- docs/architecture/overview.md — arquitetura inicial
- .env.example — variáveis de ambiente
- [outros arquivos]

### Próximos passos:
1. [próximo passo 1]
2. [próximo passo 2]
3. [próximo passo 3]

### ADR criado:
- docs/adr/001-stack-selection.md
```

## Boas Práticas
- Nunca inicialize o projeto sem entender o contexto do negócio
- Sempre documente o motivo da escolha de tecnologias no ADR
- Prefira stacks que a equipe já conhece
- Configure testes desde o início — é muito mais difícil adicionar depois
- .env.example deve estar sempre atualizado e nunca deve ter valores reais

## Erros Comuns
- Inicializar sem perguntar a stack: resulta em template genérico inútil
- Não criar .env.example: desenvolvedores não saberão quais variáveis configurar
- Não criar ADR de stack: perde-se o histórico de por que aquela tecnologia foi escolhida
- Configurar lint mas não integrar com o editor: ninguém usa

## Validações Finais
- [ ] O README.md faz sentido para alguém novo no projeto?
- [ ] As variáveis de ambiente estão documentadas?
- [ ] A estrutura de pastas reflete a arquitetura escolhida?
- [ ] Existe pelo menos um ADR documentado?
- [ ] O .gitignore está adequado para a stack?

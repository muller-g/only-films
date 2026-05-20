# /legacy-analysis

## Objetivo
Analisar código legado de forma estruturada, documentando o que existe, identificando riscos e criando um plano seguro de modernização ou manutenção.

## Quando Usar
- Ao herdar um projeto sem documentação
- Antes de refatorar código antigo
- Ao planejar a migração de uma feature legada
- Ao avaliar débito técnico de um projeto existente

## Entrada Esperada
```
/legacy-analysis

Módulo/Projeto: [o que será analisado]
Objetivo: [entender | refatorar | migrar | documentar]
Contexto: [informações disponíveis sobre o sistema]
```

## Processo Detalhado

### Fase 1: Mapeamento Arqueológico
1. Listar todos os arquivos do módulo/projeto
2. Identificar o ponto de entrada (routes, main, index)
3. Mapear o fluxo de execução principal
4. Identificar dependências externas
5. Verificar o histórico de git (git log, git blame)

### Fase 2: Identificação de Riscos
```
Verificar:
[ ] Código sem testes (risco de regressão)
[ ] Dependências desatualizadas (segurança)
[ ] Lógica de negócio misturada com infraestrutura
[ ] God classes / God functions (uma classe/função faz tudo)
[ ] Lógica duplicada em múltiplos lugares
[ ] Variáveis globais ou estado compartilhado mágico
[ ] Queries SQL raw sem prepared statements
[ ] Credenciais ou config hardcoded
[ ] TODO/FIXME/HACK não resolvidos
[ ] Código comentado (pode ser importante ou pode ser lixo)
```

### Fase 3: Documentação do Que Existe
1. Criar mapa de funcionalidades
2. Documentar as regras de negócio implícitas no código
3. Identificar os pontos de entrada e saída de dados
4. Documentar integrações e dependências externas

### Fase 4: Plano de Ação
Classificar cada item encontrado:
- **Bloqueante:** precisa ser corrigido antes de qualquer mudança
- **Alto risco:** corrigir antes do próximo release
- **Débito técnico:** corrigir em sprints dedicadas
- **Cosmético:** melhorar oportunisticamente

## Formato Esperado da Resposta

```
## Análise de Código Legado: [módulo]

### Mapa de Funcionalidades
| Funcionalidade | Localização | Estado |
|---|---|---|
| [func] | [arquivo:linha] | [ok | risco | crítico] |

### Riscos Identificados
| Criticidade | Descrição | Localização | Recomendação |
|---|---|---|---|
| CRÍTICO | [problema] | [arquivo:linha] | [ação] |

### Regras de Negócio Implícitas
[Lógica de negócio encontrada no código que não estava documentada]

### Dependências Externas
- [serviço/lib] — [como é usado] — [versão] — [status]

### Plano de Modernização
**Fase 1 (Imediato — bloqueantes):**
1. [ação]

**Fase 2 (Próximas 2 semanas):**
1. [ação]

**Fase 3 (Próximas sprints):**
1. [ação]
```

## Boas Práticas
- Não altere nada durante a análise — entenda primeiro
- Documente comportamentos que não são óbvios
- Diferencie "está errado" de "está diferente do que eu faria"
- Crie testes de caracterização antes de refatorar código legado

## Validações Finais
- [ ] Toda funcionalidade principal foi mapeada?
- [ ] Os riscos críticos foram identificados?
- [ ] As regras de negócio implícitas foram documentadas?
- [ ] Existe um plano de ação claro?

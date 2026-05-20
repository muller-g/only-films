# /analyze-codebase

## Objetivo
Realizar uma análise completa e estruturada de uma base de código existente, documentando arquitetura, padrões, débitos técnicos, pontos de melhoria e gerando um mapa de navegação para agentes e desenvolvedores.

## Quando Usar
- Ao entrar em um projeto novo
- Ao analisar código legado antes de refatorar
- Ao preparar onboarding de novos desenvolvedores
- Ao planejar uma grande evolução arquitetural

## Entrada Esperada
```
/analyze-codebase

Diretório raiz: [path]
Foco: [arquitetura | qualidade | segurança | performance | geral]
Objetivo: [onboarding | refatoração | auditoria | documentação]
```

## Processo Detalhado

### Fase 1: Mapeamento da Estrutura
1. Listar estrutura de diretórios
2. Identificar tipo de projeto (monólito, microserviços, BFF, etc.)
3. Identificar stack (linguagem, framework, banco)
4. Identificar versões das dependências principais
5. Identificar padrões de arquitetura em uso

### Fase 2: Análise de Arquitetura
1. Como o código está organizado? (por feature, por camada, por domínio)
2. Quais são as camadas da aplicação?
3. Como o fluxo de dados acontece?
4. Quais são as integrações externas?
5. Quais são os pontos de entrada da aplicação?

### Fase 3: Análise de Qualidade
1. Verificar consistência de padrões
2. Identificar duplicação de código
3. Verificar cobertura de testes
4. Identificar arquivos muito grandes
5. Verificar complexidade ciclomática alta

### Fase 4: Mapeamento de Débito Técnico
1. Dependências desatualizadas ou com CVEs
2. TODO/FIXME/HACK comentados no código
3. Código morto (não utilizado)
4. Anti-patterns conhecidos
5. Falta de documentação

### Fase 5: Avaliação de Segurança
1. Verificar inputs sem validação
2. Verificar autenticação/autorização
3. Verificar uso de dependências vulneráveis
4. Verificar configurações de segurança

## Arquivos a Criar

Ao final da análise, **escrever obrigatoriamente** os seguintes arquivos. Não exibir apenas no chat.

### `docs/architecture/overview.md`
Documento principal de arquitetura. Conteúdo:

```markdown
# Arquitetura do Sistema

## Visão Geral
- **Stack:** [tecnologias identificadas]
- **Tipo:** [monólito | microserviços | BFF | etc.]
- **Banco de dados:** [banco(s) em uso]
- **Tamanho estimado:** [linhas de código]
- **Maturidade:** [início | desenvolvimento | maduro | legado]

## Arquitetura de Camadas
[Diagrama em texto mostrando as camadas e dependências]

## Módulos Principais
| Módulo | Responsabilidade | Localização |
|---|---|---|
| [módulo] | [o que faz] | [path] |

## Fluxo de Dados
[Descrição de como os dados fluem pela aplicação]

## Integrações Externas
- [serviço externo]: [propósito]

## Pontos de Entrada
- [endpoint / rota / comando de entrada]

## Pontos Fortes
- [o que está bem feito]

## Mapa de Navegação
[Guia de onde encontrar o quê — útil para agentes e devs novos]
```

### `docs/architecture/tech-debt.md`
Registro de débito técnico encontrado. Conteúdo:

```markdown
# Débito Técnico

> Gerado em: [data]
> Última revisão: [data]

## Itens Identificados

| Severidade | Descrição | Localização | Impacto |
|---|---|---|---|
| ALTA | [problema] | [arquivo:linha] | [impacto no negócio] |
| MÉDIA | [problema] | [arquivo:linha] | [impacto] |
| BAIXA | [problema] | [arquivo:linha] | [impacto] |

## Recomendações Priorizadas
1. [ação de maior impacto]
2. [próxima ação]
3. [ação de menor urgência]
```

## Formato da Resposta no Chat

Após criar os arquivos, exibir no chat apenas o resumo:

```
## Análise concluída

### Arquivos criados:
- docs/architecture/overview.md
- docs/architecture/tech-debt.md

### Resumo:
- **Stack:** [stack identificada]
- **Módulos:** [quantidade] módulos mapeados
- **Débito técnico:** [X] itens ([Y] alta severidade)

### Próximo passo sugerido:
[ação mais importante com base na análise]
```

## Boas Práticas
- Documentar o que foi encontrado antes de sugerir mudanças
- Separar observações de recomendações
- Priorizar débito técnico por impacto no negócio

## Validações Finais
- [ ] Todos os módulos principais foram identificados?
- [ ] Débito técnico foi priorizado?
- [ ] O mapa de navegação é útil para um dev novo?

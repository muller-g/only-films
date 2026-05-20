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

## Formato Esperado da Resposta

```
## Análise da Base de Código

### Visão Geral
- **Stack:** [tecnologias identificadas]
- **Tipo:** [monólito | microserviços | etc.]
- **Tamanho:** [linhas de código estimadas]
- **Maturidade:** [início | desenvolvimento | maduro | legado]

### Arquitetura Identificada
[Descrição da arquitetura com diagrama em texto]

### Módulos Principais
| Módulo | Responsabilidade | Localização |
|---|---|---|
| [módulo] | [o que faz] | [path] |

### Pontos Fortes
- [o que está bem feito]

### Débito Técnico
| Severidade | Descrição | Localização |
|---|---|---|
| ALTA | [problema] | [arquivo:linha] |

### Recomendações
1. [ação prioritária]
2. [ação secundária]

### Mapa de Navegação
[Guia de onde encontrar o quê no código]
```

## Boas Práticas
- Documentar o que foi encontrado antes de sugerir mudanças
- Separar observações de recomendações
- Priorizar débito técnico por impacto no negócio

## Validações Finais
- [ ] Todos os módulos principais foram identificados?
- [ ] Débito técnico foi priorizado?
- [ ] O mapa de navegação é útil para um dev novo?

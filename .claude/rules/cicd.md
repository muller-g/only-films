# Regras para CI/CD

Padrões para pipelines de integração e entrega contínua.

---

## Pipeline Obrigatória (CI)

```yaml
# Todo PR deve passar por estas etapas:
1. checkout do código
2. instalação de dependências (com cache)
3. lint
4. type check (TypeScript)
5. testes unitários
6. testes de integração
7. build de produção
8. security audit (npm audit / composer audit)
```

## Pipeline de Deploy (CD)

```yaml
# Deploy apenas quando:
- Branch: main ou develop (não feature/*)
- CI passou com sucesso
- Build de produção gerado

# Sequência:
1. Build da imagem Docker
2. Push para registry
3. Deploy em staging
4. Smoke tests em staging
5. Deploy em produção (manual gate ou automático)
6. Health check pós-deploy
7. Rollback automático se health check falhar
```

## Regras de Segurança

```
- Secrets gerenciados no CI (GitHub Secrets, etc.)
- Nunca logar valores de secrets
- Imagens Docker scaneadas antes do deploy
- Dependências auditadas no pipeline
- SAST (Static Application Security Testing) como gate
```

## Ambientes

```
development → local do desenvolvedor
staging     → deploy automático do develop
production  → deploy manual ou com aprovação

Cada ambiente tem:
- Variáveis de ambiente separadas
- Banco de dados separado
- Logs separados
- Monitoramento ativo
```

## Rollback

```
OBRIGATÓRIO em todo pipeline de produção:
- Versão anterior identificada
- Rollback automático se health check falhar
- Procedimento de rollback documentado e testado
- Máximo 5 minutos para rollback completo
```

---

*Versão: 1.0.0 — 2026-05*

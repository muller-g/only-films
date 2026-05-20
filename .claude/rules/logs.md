# Regras de Logs e Observabilidade

Padrões para logging, métricas e tracing.

---

## Logging

### Níveis de Log
```
ERROR   → erros que afetam o usuário ou o sistema
WARN    → situações inesperadas mas recuperáveis
INFO    → eventos importantes do sistema (login, criação, pagamento)
DEBUG   → informação de desenvolvimento (apenas em dev)
```

### O Que Logar
```
OBRIGATÓRIO:
- Erros com stack trace e contexto (user_id, request_id)
- Tentativas de login (sucesso e falha, com IP)
- Operações críticas (pagamento, cancelamento)
- Erros de autorização (403)
- Chamadas a serviços externos (tempo de resposta, status)

PROIBIDO:
- Senhas (mesmo erradas)
- Tokens de acesso completos
- Dados de cartão de crédito
- CPF, RG, dados sensíveis
- Query strings de auth (/?token=xxx)
```

### Formato Estruturado (JSON em produção)
```json
{
  "level": "error",
  "timestamp": "2026-05-19T10:00:00Z",
  "request_id": "uuid-aqui",
  "user_id": 123,
  "message": "Falha ao processar pagamento",
  "context": {
    "order_id": 456,
    "amount": 150.00,
    "gateway": "stripe"
  },
  "error": {
    "message": "Card declined",
    "code": "card_declined"
  }
}
```

## Observabilidade

### Métricas Obrigatórias
```
- Taxa de erros por endpoint (%)
- Tempo de resposta p50, p95, p99
- Requisições por segundo
- Uso de memória e CPU
- Tamanho de filas e tempo de processamento
- Conexões ativas ao banco
```

### Alertas
```
Crítico (acorda oncall):
- Taxa de erros 5xx > 1% por 5 minutos
- Endpoint crítico sem resposta
- Disco > 90%

Alerta (notifica time):
- Tempo de resposta p95 > 2x baseline
- Taxa de erros > 0.5%
- Memória > 80%
- Fila com > 1000 itens parados
```

### Correlation ID
```
Toda requisição deve ter um request_id único propagado em:
- Logs de todos os serviços
- Headers de resposta (X-Request-ID)
- Chamadas a serviços externos
```

---

*Versão: 1.0.0 — 2026-05*

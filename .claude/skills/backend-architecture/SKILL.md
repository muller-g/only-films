# SKILL: backend-architecture

**Name:** backend-architecture
**Description:** Design e implementação de arquitetura de sistemas backend, incluindo Clean Architecture, DDD, padrões de design, separação de camadas e decisões de escalabilidade.
**Quando usar:** Ao projetar a arquitetura de um novo sistema, revisar arquitetura existente ou planejar evolução de um monólito.

---

## Arquiteturas de Referência

### Clean Architecture em Camadas
```
┌─────────────────────────────────┐
│  Presentation Layer              │  Controllers, DTOs, Request/Response
├─────────────────────────────────┤
│  Application Layer               │  Services, Use Cases, Commands/Queries
├─────────────────────────────────┤
│  Domain Layer                    │  Entities, Value Objects, Domain Events
├─────────────────────────────────┤
│  Infrastructure Layer            │  Repositories, ORMs, External APIs, Cache
└─────────────────────────────────┘
```

**Regra de dependência:** camadas internas não conhecem camadas externas.

### Estrutura de Pastas (Orientada a Domínio)
```
src/
  users/                  # Domínio: Users
    domain/
      user.entity.ts
      user-created.event.ts
      user.repository.interface.ts
    application/
      create-user.service.ts
      find-user.service.ts
    infrastructure/
      user.repository.ts
      user.entity.orm.ts
    presentation/
      users.controller.ts
      dto/create-user.dto.ts
  shared/
    domain/value-objects/
    infrastructure/database/
```

### Padrões Obrigatórios
```
Controllers → thin, apenas orquestração
Services → lógica de negócio, sem dependência de framework
Repositories → acesso a dados, interface no domínio
Domain Events → para comunicação assíncrona entre domínios
```

### Estratégia de Cache
```
L1: In-memory (local, processo) — dados ultra-frequentes, TTL curto
L2: Redis — dados frequentes, TTL médio
L3: Database — fonte da verdade

Cache de queries: TTL 5-60 min, invalidar ao escrever
Cache de sessão: Redis, TTL = expiração do token
Cache de configuração: in-memory, recarregar no deploy
```

### Estratégia de Filas
```
Use queue quando:
- Operação pode ser assíncrona (email, notificação)
- Operação é demorada (PDF, export, relatório)
- Operação tem retry em caso de falha
- Pico de tráfego precisa ser suavizado

Filas por prioridade:
- high: pagamentos, webhooks críticos
- default: emails, notificações
- low: exports, relatórios, limpeza
```

---

## Checklist de Decisões Arquiteturais
```
[ ] Separação clara de camadas implementada
[ ] Dependências apontando na direção certa (de fora para dentro)
[ ] Interfaces/contratos definidos para repositórios
[ ] Domain Events para side effects
[ ] Cache strategy definida
[ ] Queue strategy para operações assíncronas
[ ] Observabilidade planejada (logs, métricas, traces)
[ ] Escalabilidade horizontal possível
[ ] ADR criado para decisões não óbvias
```

---

## Erros Comuns
- Lógica de negócio no controller
- Repositório acoplado ao ORM no domínio
- God service com 1000+ linhas
- Sem separação entre comando e query (CQRS quando necessário)

---

## Validações Finais
- [ ] Camadas claramente separadas?
- [ ] Domain não depende de infraestrutura?
- [ ] ADR documenta decisões arquiteturais?
- [ ] Escalabilidade horizontal possível?

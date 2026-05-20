# Regras de Arquitetura Limpa

Princípios de Clean Architecture e design de software.

---

## Princípios SOLID

### Single Responsibility (S)
```
Uma classe deve ter apenas uma razão para mudar.

✅ UserService: gerencia lógica de usuário
✅ EmailService: gerencia envio de emails
❌ UserService: cria usuário E envia email E gera PDF
```

### Open/Closed (O)
```
Aberto para extensão, fechado para modificação.

✅ Adicionar novo tipo de notificação implementando NotificationInterface
❌ Adicionar if/else no código existente para cada novo tipo
```

### Liskov Substitution (L)
```
Subtipos devem ser substituíveis por seus tipos base.

✅ Qualquer implementação de PaymentGateway pode ser usada onde PaymentGateway é esperado
❌ SubClass substitui método com comportamento incompatível
```

### Interface Segregation (I)
```
Muitas interfaces específicas são melhores que uma geral.

✅ UserReader, UserWriter (duas interfaces específicas)
❌ UserRepository com 20 métodos onde a maioria não é usada
```

### Dependency Inversion (D)
```
Dependa de abstrações, não de implementações.

✅ UserService depende de UserRepositoryInterface
❌ UserService depende de EloquentUserRepository diretamente
```

---

## Regras de Arquitetura em Camadas

### Dependências
```
Presentation → Application → Domain ← Infrastructure

Domain (núcleo) não conhece ninguém
Application conhece apenas Domain
Infrastructure conhece Application e Domain
Presentation conhece Application
```

### Proibições por Camada
```
Domain:
- Sem imports de ORM, HTTP, framework
- Sem I/O (banco, arquivo, rede)
- Apenas lógica de negócio pura

Application (Services/Use Cases):
- Sem imports de ORM direto
- Sem imports de framework HTTP
- Depende de interfaces, não implementações

Infrastructure (Repositories):
- Pode depender de ORM/framework
- Implementa interfaces definidas no Domain

Presentation (Controllers):
- Sem lógica de negócio
- Apenas orquestra: validar input → chamar service → formatar output
```

---

## Padrões de Design Recomendados

```
Repository: isola acesso a dados
Service/Use Case: encapsula operações de negócio
Factory: criação complexa de objetos
Observer/Event: side effects desacoplados
Strategy: comportamento intercambiável
Decorator: adicionar responsabilidades sem herança
```

## Regras de Complexidade

```
Função: máximo 30 linhas
Método: máximo 20 linhas
Classe: máximo 300 linhas
Parâmetros: máximo 3-4 (usar objeto se mais)
Complexidade ciclomática: máximo 10 por função
Aninhamento: máximo 3 níveis (usar early return)
```

## Early Return Pattern

```typescript
// ❌ Aninhamento profundo
function processOrder(order) {
    if (order.isPaid) {
        if (order.hasStock) {
            if (order.isValid) {
                // lógica principal
            }
        }
    }
}

// ✅ Early return
function processOrder(order) {
    if (!order.isPaid) return;
    if (!order.hasStock) return;
    if (!order.isValid) return;
    // lógica principal
}
```

---

*Versão: 1.0.0 — 2026-05*

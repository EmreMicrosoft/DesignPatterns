# Pattern catalogue scope

There is no universal, closed list of "all design patterns". Pattern languages
are independently curated and continue to evolve. “Complete” in this project
means complete with respect to the named source catalogues and the explicit
supplemental set, rather than a false claim about every pattern ever published.

## Implemented, executable set

`src/shared/pattern-catalog.tsv` contains 236 unique, independently authored
records. It covers all patterns and integration styles named in the GoF, PoEAA,
Enterprise Integration Patterns, Microservices.io and Azure Cloud catalogues,
after source aliases are consolidated. It also includes 19 frequently used DDD,
architecture and concurrency patterns: Aggregate, Entity, Bounded Context,
Hexagonal, Clean and Onion Architecture, Microkernel, Layered Architecture,
Event-Driven Architecture, Actor Model, Active Object, Reactor, Proactor,
Half-Sync/Half-Async, Leader-Followers, Monitor Object, Thread Pool,
Future/Promise and Read-Write Lock.

The catalogue is extended one pattern per published update beyond this initial
scope. The first addition is POSA Volume 1's Blackboard pattern, modelled as
independent knowledge sources that refine one shared fact set.

Every record identifies an executable concern contract (such as routing,
persistence, resilience or security). Python, JavaScript, TypeScript and C++
parse and exercise every record; the C# catalogue retains detailed
object-oriented examples for the foundational 38. Pattern names are shared
architectural vocabulary, not copied source text or implementations.

## Research catalogues

- [Patterns of Enterprise Application Architecture](https://martinfowler.com/eaaCatalog/)
  groups enterprise patterns across domain logic, data source, object-relational,
  presentation, distribution and session-state concerns.
- [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/)
  identifies 65 messaging patterns, including routing, transformation, endpoint,
  channel and management categories.
- [Microservices.io pattern language](https://microservices.io/patterns/index.html)
  covers service boundaries, distributed data, transactional messaging,
  deployment, discovery, reliability, security and observability.
- [Azure cloud design patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/)
  catalogs technology-agnostic distributed-system solutions and their tradeoffs.
- [Pattern-Oriented Software Architecture, Volume 1](https://uat.store.wiley.com/Pattern-Oriented%2BSoftware%2BArchitecture%2C%2BVolume%2B1%2C%2BA%2BSystem%2Bof%2BPatterns-p-x000029474)
  spans architectural patterns, design patterns and idioms. Its Blackboard
  pattern is covered by the independently authored `blackboard` contract.

## Extension rule

Before adding a pattern, record the source catalogue, the concrete problem, the
tradeoffs, and a self-contained executable verification. Patterns that depend on
distributed infrastructure should be modelled locally only when the model proves
the pattern's policy; an in-memory simulation must never be presented as a
production-ready replacement for transport, persistence or security controls.

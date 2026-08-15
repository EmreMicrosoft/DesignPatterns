# Comprehensive pattern universe

> [Türkçe](PATTERN_UNIVERSE_TR.md) | [Executable catalogue](../src/shared/pattern-catalog.tsv) | Reviewed 2026-08-16

This is the project's **master inventory**, not a marketing claim that one
finite document contains every term ever called a pattern. Software pattern
languages are independently authored, overlap, acquire aliases, and continue
to grow. The useful, testable definition of comprehensive is therefore:

1. track each named item from the selected primary catalogues;
2. preserve the source and synonyms instead of silently collapsing them;
3. say whether this repository has a distinct executable example; and
4. keep every unimplemented, non-duplicate item in a visible backlog.

The executable catalogue currently contains **262 independent records**. Its
complete, machine-readable list is
[`src/shared/pattern-catalog.tsv`](../src/shared/pattern-catalog.tsv), and the
web explorer exposes the same list in English and Turkish. This document adds
the research perimeter and the next candidates; it does not pretend that a
general `Proxy` example is automatically a full `Virtual Proxy` example.

## Status legend

| Status | Meaning |
| --- | --- |
| **Executable** | A separately named manifest record runs in Python, JavaScript, TypeScript and C++; foundational records also have detailed C# examples. |
| **Mapped** | The named source item is represented by a manifest record with the same problem or a documented synonym. It is not a new count. |
| **Candidate** | A named item merits its own independently authored, executable record before it can be called covered. |
| **Practice** | Important design vocabulary or an anti-pattern; it is deliberately not presented as a runnable software pattern. |

## Governed source registry

| Pattern language | Primary source | Inventory treatment |
| --- | --- | --- |
| GoF | [Design Patterns: Elements of Reusable Object-Oriented Software](https://www.oreilly.com/library/view/design-patterns-elements/0201633612/) | All 23 are executable. |
| PoEAA | [Martin Fowler's catalogue](https://martinfowler.com/eaaCatalog/) | Complete executable mapping. |
| EIP | [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/) | Complete executable mapping of its 65 messaging patterns. |
| Microservices.io | [Microservices pattern language](https://microservices.io/patterns/index.html) | Complete executable mapping; `Health Check API` is explicitly mapped to the existing health-check contract. |
| Azure | [Azure cloud design patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/) | Complete executable mapping of the current catalogue. |
| POSA 1–2 | [POSA Vol. 1](https://uat.store.wiley.com/Pattern-Oriented%2BSoftware%2BArchitecture%2C%2BVolume%2B1%2C%2BA%2BSystem%2Bof%2BPatterns-p-x000029474) and [POSA Vol. 2](https://www.oreilly.com/library/view/pattern-oriented-software-architecture/9781118725177/) | Complete executable mapping. |
| POSA 3 | [POSA Vol. 3](https://www.oreilly.com/library/view/pattern-oriented-software-architecture/9780470845257/) | Full ten-item resource-lifecycle language is tracked below. |
| POSA 4 | [POSA Vol. 4 table of contents](https://www.dre.vanderbilt.edu/~schmidt/POSA4-TOC.pdf) | Full named language is cross-walked below; duplicates are mapped and distinct items are candidates. |
| Security Patterns | [Security Pattern Catalogue](https://securitypatterns.distrinet-research.be/) | Full current software-security catalogue is tracked below. |
| Game Programming Patterns | [Table of contents](https://gameprogrammingpatterns.com/contents.html) | All 19 named patterns are cross-walked below. |
| DDD | [Fowler's DDD overview](https://martinfowler.com/bliki/DomainDrivenDesign.html) and [Bounded Context](https://martinfowler.com/bliki/BoundedContext.html) | Core tactical and strategic vocabulary is tracked; process techniques and anti-patterns stay marked as practices. |

## Already executable: the baseline 262

The manifest is the authoritative row-by-row listing. It includes every GoF,
PoEAA, EIP, Microservices.io, Azure, POSA 1 and POSA 2 item in the registry,
after exact duplicates are consolidated. It also includes executable DDD,
architecture and concurrency records such as Aggregate, Entity, Value Object,
Specification, Bounded Context, Hexagonal/Clean/Onion Architecture, Actor,
Reactor, Proactor and Read-Write Lock.

`Health Check API` is intentionally an alias of `health-check`: both express a
service health-observation endpoint. It is now explicitly attributed to
Microservices.io in the manifest, so source coverage is auditable.

## Cross-walk and independently executable backlog

The following is the **complete added research set** from the four scoped
pattern languages. A comma-separated group contains one named item per phrase;
each has the status shown. “Mapped” names point to a current manifest concept,
but candidates are deliberately not considered implemented merely because they
sound related.

### POSA Volume 3 — resource management (10)

| Source items | Status and relationship |
| --- | --- |
| Lookup | **Candidate** — resource lookup is more specific than the PoEAA Registry record. |
| Lazy Acquisition, Eager Acquisition, Partial Acquisition | **Candidate** — distinct lifetime-acquisition policies. |
| Caching, Pooling | **Candidate** — generic resource reuse; not equivalent to Cache-Aside or an application-specific object pool. |
| Coordinator, Resource Lifecycle Manager | **Candidate** — lifecycle coordination policies. |
| Leasing, Evictor | **Candidate** — time-bounded ownership and removal policies. |

### POSA Volume 4 — distributed computing language

| Area | Mapped to executable records | Distinct candidates |
| --- | --- | --- |
| From mud to structure | Domain Model, Layers, Model-View-Controller, Presentation-Abstraction-Control, Microkernel, Reflection, Pipes and Filters, Blackboard | Shared Repository, Domain Object |
| Distribution infrastructure | Messaging, Message Channel, Message Endpoint, Message Translator, Message Router, Publisher-Subscriber, Broker | Client Proxy, Requestor, Invoker, Client Request Handler, Server Request Handler |
| Event dispatching | Reactor, Proactor, Acceptor-Connector, Asynchronous Completion Token | — |
| Interface partitioning | Extension Interface, Proxy, Facade, Iterator | Explicit Interface, Introspective Interface, Dynamic Invocation Interface, Business Delegate, Combined Method, Enumeration Method, Batch Method |
| Component partitioning | Whole-Part, Composite, Master-Slave | Encapsulated Implementation, Half-Object plus Protocol, Replicated Component Group |
| Application control | Page Controller, Front Controller, Application Controller, Command Processor, Template View, Transform View | Firewall Proxy, Authorization |
| Concurrency and synchronization | Half-Sync/Half-Async, Leader/Followers, Active Object, Monitor Object, Future, Thread-Safe Interface, Double-Checked Locking, Strategized Locking, Scoped Locking, Thread-Specific Storage | Guarded Suspension, Copied Value, Immutable Value |
| Object interaction | Observer, Mediator, Command, Memento, Data Transfer Object, Message | Double Dispatch, Context Object |
| Adaptation and extension | Bridge, Adapter, Chain of Responsibility, Interpreter, Interceptor, Visitor, Decorator, Wrapper Facade, Template Method, Strategy | Object Adapter, Execute-Around Object, Null Object, Declarative Component Configuration |
| Modal behavior | State | Objects for States, Methods for States, Collections for States |
| Resource management | Component Configurator, Abstract Factory, Builder, Factory Method | Container, Object Manager, Virtual Proxy, Lifecycle Callback, Task Coordinator, Resource Pool, Resource Cache, Activator, Automated Garbage Collection, Counting Handle, Disposal Method; POSA 3 candidates above also apply |
| Database access | Data Mapper, Row Data Gateway, Table Data Gateway, Active Record | Database Access Layer |

### Security Pattern Catalogue — 23

All following names are **Candidates**. They remain a separate security
backlog because a locally simulated security contract must never be mistaken
for real authentication, cryptography or authorization infrastructure.

| Family | Named items |
| --- | --- |
| Authentication and access control | Authentication; Password-based Authentication; Verifiable Token-based Authentication; Opaque Token-based Authentication; Obscure Token-based Access Control; Session-based Access Control; Authorisation |
| Accountability and validation | Log Entity Actions; Limit Request Rate; Data Validation; Output Filter |
| Transmission and storage | Selective Encrypted Transmission; Encrypted Tunnel; Verifiable Transmission; Selective Encrypted Storage; Transparent Encrypted Storage |
| Cryptography | Cryptographic Action; Encryption; Digital Signature; MAC; Cryptographic Key Management; Cryptography as a Service; Self-managed Cryptography |

### Game Programming Patterns — 19

| Status | Named items |
| --- | --- |
| **Mapped** | Command, Flyweight, Observer, Prototype, Singleton, State |
| **Candidates** | Double Buffer; Game Loop; Update Method; Bytecode; Subclass Sandbox; Type Object; Component; Event Queue; Service Locator; Data Locality; Dirty Flag; Object Pool; Spatial Partition |

### Domain-Driven Design reference set

| Status | Named items |
| --- | --- |
| **Mapped** | Entity, Value Object, Aggregate, Repository, Specification, Domain Event, Bounded Context, Anti-Corruption Layer |
| **Candidates** | Domain Service, Module, DDD Factory, Context Map, Shared Kernel, Customer/Supplier, Conformist, Separate Ways, Open Host Service, Published Language |
| **Practices** | Ubiquitous Language, Core Domain, Supporting Subdomain, Generic Subdomain, Bubble Context |
| **Anti-pattern / diagnostic vocabulary** | Big Ball of Mud — tracked for teaching context, never advertised as a desirable pattern. |

## Addition protocol

A candidate moves to **Executable** only when one focused change does all of
the following:

1. adds an independently authored manifest record with source, family and a
   precise concern contract;
2. supplies an observable scenario in Python, JavaScript, TypeScript and C++
   (and a detailed C# example when it belongs to the foundational set);
3. exposes the scenario in the bilingual web explorer with input, result and
   data flow; and
4. runs the verification suite and publishes one focused update.

This makes “complete” measurable: a reader can see exactly what is executable,
what is merely related, and what still needs an original implementation.

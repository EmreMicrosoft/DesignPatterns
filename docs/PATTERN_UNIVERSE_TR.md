# Kapsamlı desen evreni

> [English](PATTERN_UNIVERSE.md) | [Çalıştırılabilir katalog](../src/shared/pattern-catalog.tsv) | İnceleme tarihi: 2026-08-16

Bu belge, “birinin bir gün pattern dediği her ifadeyi içerdiğini” iddia eden
kapalı bir liste değildir. Bunun yerine kaynakları, eş anlamlıları ve uygulama
durumunu açıkça izleyen **ana envanterdir**. Desen dilleri farklı yazarlar
tarafından bağımsız oluşturulur, çakışır ve gelişmeye devam eder. Bu nedenle
kapsamlılığın denetlenebilir anlamı şudur:

1. seçilen birincil kataloglardaki her adı takip etmek;
2. kaynak ve eş anlamlıyı gizlemeden kaydetmek;
3. ayrı bir çalıştırılabilir örneğin gerçekten bulunup bulunmadığını belirtmek;
4. uygulanmamış ve yinelenmeyen her kaydı görünür backlog'da tutmak.

Şu an **262 bağımsız çalıştırılabilir kayıt** vardır. Satır düzeyindeki kesin
liste [`src/shared/pattern-catalog.tsv`](../src/shared/pattern-catalog.tsv)
içindedir; web gezgini aynı listeyi Türkçe ve İngilizce gösterir. Bu belge,
kaynak sınırını ve sıradaki özgün uygulama adaylarını ekler. Örneğin genel bir
`Proxy` örneğinin otomatik olarak `Virtual Proxy` örneği sayılması doğru
değildir.

## Durum anahtarı

| Durum | Anlamı |
| --- | --- |
| **Çalıştırılabilir** | Ayrı isimli manifest kaydı Python, JavaScript, TypeScript ve C++ ile çalışır; temel kayıtların ayrıntılı C# örneği de vardır. |
| **Eşlenmiş** | Kaynak adı, aynı problemi çözen mevcut manifest kaydına veya belgelenmiş eş adına bağlanmıştır; yeni kayıt sayılmaz. |
| **Aday** | Kapsandı denebilmesi için özgün ve çalıştırılabilir ayrı kayıt gerektirir. |
| **Uygulama** | Değerli tasarım dili veya anti-pattern'dir; bilinçli olarak çalıştırılabilir yazılım deseni diye sunulmaz. |

## Kaynak kayıt defteri

| Desen dili | Birincil kaynak | Envanter yaklaşımı |
| --- | --- | --- |
| GoF | [Design Patterns: Elements of Reusable Object-Oriented Software](https://www.oreilly.com/library/view/design-patterns-elements/0201633612/) | 23 desenin tamamı çalıştırılabilir. |
| PoEAA | [Martin Fowler kataloğu](https://martinfowler.com/eaaCatalog/) | Tam çalıştırılabilir eşleme. |
| EIP | [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/) | 65 mesajlaşma deseninin tam eşlemesi. |
| Microservices.io | [Mikroservis desen dili](https://microservices.io/patterns/index.html) | Tam çalıştırılabilir eşleme; `Health Check API`, mevcut sağlık denetimi sözleşmesine bağlanır. |
| Azure | [Azure bulut desenleri](https://learn.microsoft.com/en-us/azure/architecture/patterns/) | Güncel kataloğun tam eşlemesi. |
| POSA 1–2 | [POSA 1](https://uat.store.wiley.com/Pattern-Oriented%2BSoftware%2BArchitecture%2C%2BVolume%2B1%2C%2BA%2BSystem%2Bof%2BPatterns-p-x000029474), [POSA 2](https://www.oreilly.com/library/view/pattern-oriented-software-architecture/9781118725177/) | Tam çalıştırılabilir eşleme. |
| POSA 3 | [POSA 3](https://www.oreilly.com/library/view/pattern-oriented-software-architecture/9780470845257/) | On maddelik kaynak-yaşam döngüsü dili aşağıda tamamen izlenir. |
| POSA 4 | [POSA 4 içindekiler](https://www.dre.vanderbilt.edu/~schmidt/POSA4-TOC.pdf) | Tam isimli dil çapraz eşlenir; yinelenenler eşlenir, farklı olanlar adaydır. |
| Security Patterns | [Security Pattern Catalogue](https://securitypatterns.distrinet-research.be/) | Güncel yazılım güvenliği kataloğunun tamamı aşağıda izlenir. |
| Game Programming Patterns | [İçindekiler](https://gameprogrammingpatterns.com/contents.html) | 19 adın tamamı aşağıda çapraz eşlenir. |
| DDD | [Fowler DDD](https://martinfowler.com/bliki/DomainDrivenDesign.html), [Bounded Context](https://martinfowler.com/bliki/BoundedContext.html) | Temel taktik ve stratejik dil takip edilir; süreç teknikleri ayrı tutulur. |

## Mevcut temel: 262 çalıştırılabilir kayıt

Manifest, kaynak kayıt defterindeki GoF, PoEAA, EIP, Microservices.io, Azure,
POSA 1 ve POSA 2 öğelerinin satır düzeyindeki otoritesidir. Ayrıca Aggregate,
Entity, Value Object, Specification, Bounded Context, Hexagonal/Clean/Onion
Architecture, Actor, Reactor, Proactor ve Read-Write Lock gibi DDD, mimari ve
eşzamanlılık kayıtlarını da içerir.

`Health Check API`, `health-check` kaydının eş adıdır: ikisi de servis
sağlığı gözlemleme sınırını ifade eder. Manifestte artık Microservices.io
kaynak atfı da açıkça yer alır.

## Çapraz eşleme ve özgün uygulama backlog'u

### POSA 3 — kaynak yönetimi (10)

| Kaynak öğeleri | Durum ve ilişki |
| --- | --- |
| Lookup | **Aday** — kaynak çözümleme, PoEAA Registry'den daha özeldir. |
| Lazy Acquisition, Eager Acquisition, Partial Acquisition | **Aday** — farklı edinim politikalarıdır. |
| Caching, Pooling | **Aday** — Cache-Aside veya uygulamaya özgü Object Pool ile aynı sayılmaz. |
| Coordinator, Resource Lifecycle Manager | **Aday** — yaşam döngüsü koordinasyon politikaları. |
| Leasing, Evictor | **Aday** — süreli sahiplik ve çıkarma politikaları. |

### POSA 4 — dağıtık hesaplama dili

| Alan | Çalıştırılabilir kayda eşlenenler | Ayrı adaylar |
| --- | --- | --- |
| Yapıya geçiş | Domain Model, Layers, Model-View-Controller, PAC, Microkernel, Reflection, Pipes and Filters, Blackboard | Shared Repository, Domain Object |
| Dağıtım altyapısı | Messaging, Message Channel, Message Endpoint, Message Translator, Message Router, Publisher-Subscriber, Broker | Client Proxy, Requestor, Invoker, Client Request Handler, Server Request Handler |
| Olay dağıtımı | Reactor, Proactor, Acceptor-Connector, Asynchronous Completion Token | — |
| Arayüz bölme | Extension Interface, Proxy, Facade, Iterator | Explicit Interface, Introspective Interface, Dynamic Invocation Interface, Business Delegate, Combined Method, Enumeration Method, Batch Method |
| Bileşen bölme | Whole-Part, Composite, Master-Slave | Encapsulated Implementation, Half-Object plus Protocol, Replicated Component Group |
| Uygulama kontrolü | Page/Front/Application Controller, Command Processor, Template/Transform View | Firewall Proxy, Authorization |
| Eşzamanlılık | Half-Sync/Half-Async, Leader/Followers, Active Object, Monitor Object, Future ve kilitleme desenleri | Guarded Suspension, Copied Value, Immutable Value |
| Nesne etkileşimi | Observer, Mediator, Command, Memento, DTO, Message | Double Dispatch, Context Object |
| Uyarlama/genişletme | Bridge, Adapter, Chain of Responsibility, Interpreter, Interceptor, Visitor, Decorator, Wrapper Facade, Template Method, Strategy | Object Adapter, Execute-Around Object, Null Object, Declarative Component Configuration |
| Mod davranışı | State | Objects for States, Methods for States, Collections for States |
| Kaynak yönetimi | Component Configurator, Abstract Factory, Builder, Factory Method | Container, Object Manager, Virtual Proxy, Lifecycle Callback, Task Coordinator, Resource Pool, Resource Cache, Activator, Automated Garbage Collection, Counting Handle, Disposal Method; POSA 3 adayları da geçerlidir |
| Veri tabanı erişimi | Data Mapper, Row/Table Data Gateway, Active Record | Database Access Layer |

### Security Pattern Catalogue — 23 aday

Yerel bir benzetimin gerçek kimlik doğrulama, kriptografi veya yetkilendirme
altyapısı sanılmaması için bu kayıtlar ayrı güvenlik backlog'udur.

| Aile | Adlar |
| --- | --- |
| Kimlik ve erişim | Authentication; Password-based Authentication; Verifiable/Opaque Token-based Authentication; Obscure Token-based Access Control; Session-based Access Control; Authorisation |
| Hesap verebilirlik ve doğrulama | Log Entity Actions; Limit Request Rate; Data Validation; Output Filter |
| Aktarım ve saklama | Selective Encrypted Transmission; Encrypted Tunnel; Verifiable Transmission; Selective/Transparent Encrypted Storage |
| Kriptografi | Cryptographic Action; Encryption; Digital Signature; MAC; Cryptographic Key Management; Cryptography as a Service; Self-managed Cryptography |

### Game Programming Patterns — 19

| Durum | Adlar |
| --- | --- |
| **Eşlenmiş** | Command, Flyweight, Observer, Prototype, Singleton, State |
| **Aday** | Double Buffer; Game Loop; Update Method; Bytecode; Subclass Sandbox; Type Object; Component; Event Queue; Service Locator; Data Locality; Dirty Flag; Object Pool; Spatial Partition |

### DDD referans kümesi

| Durum | Adlar |
| --- | --- |
| **Eşlenmiş** | Entity, Value Object, Aggregate, Repository, Specification, Domain Event, Bounded Context, Anti-Corruption Layer |
| **Aday** | Domain Service, Module, DDD Factory, Context Map, Shared Kernel, Customer/Supplier, Conformist, Separate Ways, Open Host Service, Published Language |
| **Uygulamalar** | Ubiquitous Language, Core Domain, Supporting Subdomain, Generic Subdomain, Bubble Context |
| **Anti-pattern** | Big Ball of Mud — öğretim bağlamında izlenir; arzu edilen desen olarak sunulmaz. |

## Ekleme protokolü

Bir aday ancak şu dört şart aynı odaklı değişiklikte sağlandığında
**Çalıştırılabilir** olur: manifestte kaynak/aile/sözleşme kaydı, desteklenen
dillerde gözlemlenebilir senaryo, iki dilli web gezgininde girdi-sonuç-veri
akışı ve doğrulama sonrası odaklı yayın. Böylece neyin gerçekten hazır, neyin
yalnızca ilişkili ve neyin özgün uygulama beklediği denetlenebilir kalır.

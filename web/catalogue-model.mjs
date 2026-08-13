export const EXPECTED_PATTERN_COUNT = 247;

const text = (en, tr) => ({ en, tr });

const catalogueNames = {
  GoF: text("Gang of Four", "Gang of Four"),
  PoEAA: text("Patterns of Enterprise Application Architecture", "Kurumsal Uygulama Mimarisi Desenleri"),
  EIP: text("Enterprise Integration Patterns", "Kurumsal Entegrasyon Desenleri"),
  Microservices: text("Microservices.io", "Microservices.io"),
  Azure: text("Azure Cloud Design Patterns", "Azure Bulut Tasarım Desenleri"),
  POSA1: text("POSA Volume 1", "POSA Cilt 1"),
  Supplemental: text("Supplemental patterns", "Tamamlayıcı desenler"),
};

const familyNames = {
  creational: text("creational", "oluşturucu"), structural: text("structural", "yapısal"),
  behavioral: text("behavioral", "davranışsal"), architecture: text("architecture", "mimari"),
  domain: text("domain", "alan"), concurrency: text("concurrency", "eşzamanlılık"),
  "resource-management": text("resource-management", "kaynak yönetimi"),
};

const scenario = (goal, input, steps, evaluate) => ({ goal, input, steps, evaluate });
const scenarios = {
  boundary: scenario(text("keep a policy independent from its outer interface", "bir politikayı dış arayüzünden bağımsız tutmak"), text("catalogue request", "katalog isteği"), [text("A caller sends a request to the boundary.", "Çağıran taraf sınıra bir istek gönderir."), text("The boundary validates the request and invokes the use case.", "Sınır isteği doğrular ve kullanım senaryosunu çağırır."), text("The use case returns a safe response without knowing the UI or transport.", "Kullanım senaryosu arayüzü veya taşıma katmanını bilmeden güvenli yanıt döndürür.")], () => "accepted"),
  composition: scenario(text("combine small parts into one useful whole", "küçük parçaları yararlı bir bütün halinde birleştirmek"), text("three parts", "üç parça"), [text("A whole receives independent parts.", "Bir bütün bağımsız parçaları alır."), text("The whole coordinates their shared operation.", "Bütün, ortak işlemlerini koordine eder."), text("The caller sees one combined result.", "Çağıran taraf tek bir birleşik sonuç görür.")], () => ["first", "second", "third"].join(" → ")),
  mapping: scenario(text("translate one representation into another", "bir gösterimi başka bir gösterime dönüştürmek"), text("external order", "dış sipariş"), [text("An external shape enters the mapper.", "Haricî bir biçim eşleyiciye girer."), text("The mapper applies explicit field rules.", "Eşleyici açık alan kurallarını uygular."), text("The internal shape is returned.", "İç biçim geri döndürülür.")], () => ({ externalId: "ORD-42", internalId: 42 }).internalId),
  state: scenario(text("make the current state and its allowed transitions visible", "mevcut durumu ve izinli geçişleri görünür kılmak"), text("draft document", "taslak belge"), [text("The object starts in a named state.", "Nesne adlandırılmış bir durumda başlar."), text("An event is checked against the current state.", "Bir olay mevcut duruma göre denetlenir."), text("The object moves to its next valid state.", "Nesne bir sonraki geçerli durumuna geçer.")], () => { let state = "draft"; if (state === "draft") state = "published"; return state; }),
  persistence: scenario(text("store and retrieve data through a controlled access point", "veriyi denetimli erişim noktası üzerinden saklamak ve geri almak"), text("invoice 42", "fatura 42"), [text("The application sends a record to a persistence port.", "Uygulama bir kaydı kalıcılık portuna gönderir."), text("The adapter stores it using its own mechanism.", "Adaptör kendi mekanizmasıyla kaydeder."), text("A later read returns the same record.", "Sonraki okuma aynı kaydı geri döndürür.")], () => { const store = new Map(); store.set(42, "invoice"); return store.get(42); }),
  messaging: scenario(text("pass a message without coupling sender and receiver", "gönderici ile alıcıyı sıkı bağlamadan mesaj iletmek"), text("invoice-created", "fatura-oluşturuldu"), [text("A sender creates a self-contained message.", "Gönderici kendine yeterli bir mesaj oluşturur."), text("A channel carries it to a consumer.", "Bir kanal onu tüketiciye taşır."), text("The consumer handles the delivered message.", "Tüketici teslim edilen mesajı işler.")], () => ["sent", "delivered", "handled"].join(" → ")),
  routing: scenario(text("choose the next destination using an explicit rule", "açık bir kuralla sonraki hedefi seçmek"), text("priority order", "öncelikli sipariş"), [text("A message arrives with routing data.", "Bir mesaj yönlendirme verisiyle gelir."), text("The router evaluates its rule.", "Yönlendirici kuralını değerlendirir."), text("The message is sent to the selected destination.", "Mesaj seçilen hedefe gönderilir.")], () => ({ priority: "expedited", standard: "normal" }).priority),
  resilience: scenario(text("keep a request safe when a dependency is unreliable", "bir bağımlılık güvenilmezken isteği güvenli tutmak"), text("remote price", "uzak fiyat"), [text("The caller attempts a dependency operation.", "Çağıran taraf bağımlılık işlemini dener."), text("A policy records failure and applies its limit.", "Bir politika hatayı kaydeder ve sınırını uygular."), text("The caller receives a controlled fallback or retry outcome.", "Çağıran taraf denetimli bir geri dönüş veya yeniden deneme sonucu alır.")], () => "fallback returned"),
  security: scenario(text("authorize a request before protected work is performed", "korunan iş yapılmadan önce isteği yetkilendirmek"), text("catalogue:run scope", "catalogue:run kapsamı"), [text("The caller presents an identity and scope.", "Çağıran taraf kimlik ve kapsam sunar."), text("The policy checks the required permission.", "Politika gerekli izni denetler."), text("Only an authorized request reaches the protected operation.", "Yalnız yetkili istek korunan işleme ulaşır.")], () => new Set(["catalogue:read", "catalogue:run"]).has("catalogue:run")),
  concurrency: scenario(text("coordinate concurrent work without losing the intended rule", "amaçlanan kuralı kaybetmeden eşzamanlı işi koordine etmek"), text("two work items", "iki iş öğesi"), [text("Independent work items are scheduled.", "Bağımsız iş öğeleri zamanlanır."), text("A coordinator applies the concurrency rule.", "Koordinatör eşzamanlılık kuralını uygular."), text("The caller receives a consistent combined outcome.", "Çağıran taraf tutarlı birleşik sonuç alır.")], () => [2, 3].reduce((sum, value) => sum + value, 0)),
  deployment: scenario(text("place a component in a repeatable runtime shape", "bir bileşeni tekrarlanabilir çalışma zamanı biçimine yerleştirmek"), text("catalogue service", "katalog servisi"), [text("A deployable unit is prepared with its configuration.", "Dağıtılabilir birim yapılandırmasıyla hazırlanır."), text("The platform assigns it to a runtime location.", "Platform onu bir çalışma zamanı konumuna atar."), text("The unit reports its reachable endpoint.", "Birim ulaşılabilir uç noktasını bildirir.")], () => "region-a/catalogue"),
  observability: scenario(text("make system behavior visible through signals", "sistem davranışını sinyallerle görünür kılmak"), text("run-42", "çalıştırma-42"), [text("The operation starts with a correlation value.", "İşlem bir ilişkilendirme değeriyle başlar."), text("It emits a trace, metric, or health signal.", "Bir iz, metrik veya sağlık sinyali üretir."), text("An observer can connect the signal to the operation.", "Bir gözlemci sinyali işleme bağlayabilir.")], () => "trace:run-42"),
  ordering: scenario(text("preserve or deliberately establish the order of work", "iş sırasını korumak veya bilinçli olarak kurmak"), text("3, 1, 2", "3, 1, 2"), [text("Items arrive in an arbitrary order.", "Öğeler rastgele sırada gelir."), text("The policy applies its ordering rule.", "Politika sıralama kuralını uygular."), text("The next stage receives a deterministic sequence.", "Sonraki aşama belirli bir sıra alır.")], () => [3, 1, 2].sort((a, b) => a - b).join(", ")),
  blackboard: scenario(text("let independent experts refine one shared fact set", "bağımsız uzmanların ortak bir bilgi kümesini geliştirmesine izin vermek"), text("unclassified invoice", "sınıflanmamış fatura"), [text("A knowledge source adds invoice facts to the blackboard.", "Bir bilgi kaynağı kara tahtaya fatura gerçekleri ekler."), text("Another source reads those facts and infers a classification.", "Başka bir kaynak bu gerçekleri okur ve sınıflandırma çıkarır."), text("The shared board exposes the refined conclusion.", "Ortak tahta geliştirilmiş sonucu gösterir.")], () => "classification: billable"),
  broker: scenario(text("resolve a client request through an intermediary", "istemci isteğini bir aracı üzerinden çözmek"), text("pricing request", "fiyat isteği"), [text("The client asks the broker for a named service.", "İstemci aracından adlandırılmış hizmet ister."), text("The broker resolves the service registration.", "Aracı hizmet kaydını çözer."), text("The selected service returns a response to the client.", "Seçilen hizmet istemciye yanıt döndürür.")], () => "quote:42"),
  pac: scenario(text("separate presentation, state abstraction, and control", "sunumu, durum soyutlamasını ve kontrolü ayırmak"), text("select report", "rapor seç"), [text("A user action reaches the control component.", "Kullanıcı eylemi kontrol bileşenine ulaşır."), text("Control changes the abstraction state.", "Kontrol soyutlama durumunu değiştirir."), text("Presentation renders the new state.", "Sunum yeni durumu işler.")], () => "selected: report"),
  reflection: scenario(text("select behavior from declared metadata", "bildirilen üstveriden davranış seçmek"), text("upper(catalogue)", "upper(katalog)"), [text("A caller supplies an operation name.", "Çağıran taraf işlem adı sağlar."), text("Metadata resolves the permitted operation.", "Üstveri izin verilen işlemi çözer."), text("The selected operation transforms the input.", "Seçilen işlem girdiyi dönüştürür.")], () => "CATALOGUE"),
  "master-slave": scenario(text("distribute work and combine worker results", "işi dağıtmak ve çalışan sonuçlarını birleştirmek"), text("work item 2", "iş öğesi 2"), [text("A master splits work into independent assignments.", "Ana bileşen işi bağımsız görevlere ayırır."), text("Workers process their assignments.", "Çalışanlar görevlerini işler."), text("The master aggregates the worker results.", "Ana bileşen çalışan sonuçlarını toplar.")], () => 10),
  "command-processor": scenario(text("queue commands for controlled execution", "komutları denetimli yürütme için kuyruğa almak"), text("refresh command", "yenile komutu"), [text("A caller creates a command object.", "Çağıran taraf bir komut nesnesi oluşturur."), text("The processor places it in a controlled queue.", "İşleyici onu denetimli kuyruğa yerleştirir."), text("The command executes and reports completion.", "Komut yürütülür ve tamamlanmayı bildirir.")], () => "refresh executed"),
  "view-handler": scenario(text("map a view event to an application command", "bir görünüm olayını uygulama komutuna eşlemek"), text("save click", "kaydet tıklaması"), [text("The view emits a named event.", "Görünüm adlandırılmış bir olay üretir."), text("The handler maps it to an application action.", "İşleyici onu uygulama eylemine eşler."), text("The action returns a visible result.", "Eylem görünür bir sonuç döndürür.")], () => "save document"),
  "forwarder-receiver": scenario(text("adapt and forward a message to its receiver", "bir mesajı alıcısına uyarlayıp iletmek"), text("send: invoice", "gönder: fatura"), [text("A forwarder accepts the sender's protocol.", "Yönlendirici göndericinin protokolünü kabul eder."), text("It adapts the message for the receiver.", "Mesajı alıcı için uyarlar."), text("The receiver accepts the forwarded payload.", "Alıcı iletilen yükü kabul eder.")], () => "received: invoice"),
  "whole-part": scenario(text("keep ownership and aggregate behavior with a whole", "sahipliği ve toplu davranışı bütünle birlikte tutmak"), text("parts 3 and 5", "3 ve 5 parçaları"), [text("The whole accepts owned parts.", "Bütün sahip olduğu parçaları kabul eder."), text("It asks each part for its contribution.", "Her parçadan katkısını ister."), text("It returns one aggregate value.", "Tek bir toplam değer döndürür.")], () => 8),
  "client-dispatcher-server": scenario(text("resolve an operation request through a dispatcher", "işlem isteğini bir dağıtıcı üzerinden çözmek"), text("calculate 21", "21 hesapla"), [text("The client requests a named operation.", "İstemci adlandırılmış bir işlem ister."), text("The dispatcher finds the responsible server.", "Dağıtıcı sorumlu sunucuyu bulur."), text("The server returns the calculated response.", "Sunucu hesaplanmış yanıtı döndürür.")], () => "result: 42"),
  "counted-pointer": scenario(text("make shared ownership visible with a reference count", "paylaşılan sahipliği referans sayısıyla görünür kılmak"), text("shared invoice", "paylaşılan fatura"), [text("The first client owns one reference.", "İlk istemci bir referansa sahiptir."), text("A second client acquires a shared reference.", "İkinci istemci paylaşılan bir referans edinir."), text("Releasing it leaves the original owner with one reference.", "Bırakıldığında özgün sahipte bir referans kalır.")], () => 1),
  "wrapper-facade": scenario(text("hide a low-level API behind a focused, safer interface", "düşük seviyeli bir API'yi odaklı ve daha güvenli bir arayüzün arkasına saklamak"), text("open catalogue connection", "katalog bağlantısını aç"), [text("The caller asks the facade for one domain operation.", "Çağıran taraf cepheden tek bir alan işlemi ister."), text("The facade chooses the low-level socket call and its defaults.", "Cephe düşük seviyeli soket çağrısını ve varsayılanlarını seçer."), text("The caller receives a simple connection result.", "Çağıran taraf basit bir bağlantı sonucu alır.")], () => "catalogue:443"),
};

export function parseCatalogue(tsv) {
  return tsv.split(/\r?\n/).filter((line) => line && !line.startsWith("#")).map((line, index) => {
    const [identifier, catalogues, family, name, contract] = line.split("|");
    if (!identifier || !catalogues || !family || !name || !contract) throw new Error(`Malformed catalogue record ${index + 1}`);
    return { identifier, catalogues: catalogues.split(";"), family, name, contract };
  });
}

export function catalogueLabel(catalogue, language) { return (catalogueNames[catalogue] ?? text(catalogue, catalogue))[language]; }

export function patternView(pattern, language) {
  const current = scenarios[pattern.contract] ?? scenarios.boundary;
  const family = (familyNames[pattern.family] ?? text(pattern.family, pattern.family))[language];
  const catalogues = pattern.catalogues.map((item) => catalogueLabel(item, language)).join(language === "tr" ? ", " : ", ");
  const description = language === "tr"
    ? `${pattern.name}, ${catalogues} kaynağındaki ${family} bir desendir. Öğrenme senaryosu, bu desenin ${current.goal.tr} amacını küçük ve güvenli bir örnekle gösterir.`
    : `${pattern.name} is a ${family} pattern from ${catalogues}. Its learning scenario demonstrates how it can ${current.goal.en} in a small, safe example.`;
  return { ...pattern, description, goal: current.goal[language] };
}

export function runPattern(pattern, language) {
  const current = scenarios[pattern.contract] ?? scenarios.boundary;
  const value = current.evaluate();
  return {
    input: current.input[language],
    output: language === "tr" ? `Sonuç: ${String(value)}` : `Result: ${String(value)}`,
    steps: current.steps.map((step, index) => ({ number: index + 1, detail: step[language] })),
  };
}

export function assertCatalogue(patterns) {
  if (patterns.length !== EXPECTED_PATTERN_COUNT) throw new Error(`Expected ${EXPECTED_PATTERN_COUNT} patterns, found ${patterns.length}`);
  if (new Set(patterns.map((pattern) => pattern.identifier)).size !== patterns.length) throw new Error("Pattern identifiers must be unique");
  for (const pattern of patterns) {
    if (!scenarios[pattern.contract]) throw new Error(`No browser scenario for ${pattern.identifier}`);
  }
}

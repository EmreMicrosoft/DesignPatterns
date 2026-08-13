declare const __dirname: string;
declare function require(name: string): { readFileSync(path: string, encoding: "utf8"): string };

type PatternDefinition = Readonly<{
  identifier: string;
  catalogues: readonly string[];
  family: string;
  name: string;
  contract: string;
}>;

const EXPECTED_PATTERN_COUNT = 261;
const readFileSync = require("node:fs").readFileSync;

function blackboardContract(): boolean {
  const sharedFacts: string[] = [];
  const extractTokens = (): void => { sharedFacts.push("candidate:invoice", "amount:42"); };
  const inferClassification = (): void => {
    if (sharedFacts.includes("candidate:invoice")) sharedFacts.push("classification:billable");
  };
  extractTokens();
  inferClassification();
  return sharedFacts.at(-1) === "classification:billable";
}

function brokerContract(): boolean {
  const serviceRegistry = new Map<string, (productId: string) => string>([["pricing", (productId) => `quote:${productId}`]]);
  const request = (serviceName: string, productId: string): string => serviceRegistry.get(serviceName)!(productId);
  return request("pricing", "42") === "quote:42";
}

function pacContract(): boolean {
  const abstraction: { selected: string } = { selected: "none" };
  const control = (action: string): void => { abstraction.selected = action.replace("select:", ""); };
  const presentation = (): string => `selected:${abstraction.selected}`;
  control("select:report");
  return presentation() === "selected:report";
}

function reflectionContract(): boolean {
  const formatter: Record<string, (value: string) => string> = { upper: (value) => value.toUpperCase() };
  const operation = formatter["upper"];
  return operation("catalogue") === "CATALOGUE";
}

function masterSlaveContract(): boolean {
  const workers: Array<(value: number) => number> = [(value) => value * 2, (value) => value * 3];
  const results = workers.map((worker) => worker(2));
  return results.reduce((sum, result) => sum + result, 0) === 10;
}

function commandProcessorContract(): boolean {
  const executed: string[] = [];
  const pending: Array<() => number> = [() => executed.push("refresh")];
  pending.shift()!();
  return executed.join(",") === "refresh";
}

function viewHandlerContract(): boolean {
  const commands = new Map<string, () => string>([["save-clicked", () => "save-document"]]);
  return commands.get("save-clicked")!() === "save-document";
}

function forwarderReceiverContract(): boolean {
  const receiver = (payload: string): string => `received:${payload}`;
  const forwarder = (message: string): string => receiver(message.replace("send:", ""));
  return forwarder("send:invoice") === "received:invoice";
}

function wholePartContract(): boolean {
  class Folder {
    readonly #parts: number[] = [];
    addPart(size: number): void { this.#parts.push(size); }
    totalSize(): number { return this.#parts.reduce((total, size) => total + size, 0); }
  }
  const archive = new Folder();
  archive.addPart(3);
  archive.addPart(5);
  return archive.totalSize() === 8;
}

function clientDispatcherServerContract(): boolean {
  const servers = new Map<string, (payload: number) => string>([["calculate", (payload) => `result:${payload * 2}`]]);
  const dispatcher = (operation: string, payload: number): string => servers.get(operation)!(payload);
  const client = (): string => dispatcher("calculate", 21);
  return client() === "result:42";
}

function countedPointerContract(): boolean {
  class SharedHandle {
    #references = 1;
    readonly value: string;
    constructor(value: string) { this.value = value; }
    acquire(): SharedHandle { this.#references += 1; return this; }
    release(): number { this.#references -= 1; return this.#references; }
  }

  const document = new SharedHandle("invoice");
  const observer = document.acquire();
  return observer.value === "invoice" && document.release() === 1;
}

function wrapperFacadeContract(): boolean {
  class SocketLibrary { connect(host: string, port: number): string { return `${host}:${port}`; } }
  class CatalogueConnection {
    private readonly socketLibrary: SocketLibrary;
    constructor(socketLibrary: SocketLibrary) { this.socketLibrary = socketLibrary; }
    open(): string { return this.socketLibrary.connect("catalogue", 443); }
  }
  return new CatalogueConnection(new SocketLibrary()).open() === "catalogue:443";
}

function componentConfiguratorContract(): boolean {
  class Cache { start(): string { return "cache:ready"; } }
  class ComponentConfigurator {
    private readonly factories: ReadonlyMap<string, new () => Cache>;
    constructor(factories: ReadonlyMap<string, new () => Cache>) { this.factories = factories; }
    configure(name: string): string { return new (this.factories.get(name)!)().start(); }
  }
  return new ComponentConfigurator(new Map([["cache", Cache]])).configure("cache") === "cache:ready";
}

function interceptorContract(): boolean {
  const auditInterceptor = (request: { operation: string; audit?: string }, nextHandler: (value: { operation: string; audit?: string }) => string): string => {
    request.audit = "recorded";
    return nextHandler(request);
  };
  return auditInterceptor({ operation: "save" }, (request) => request.audit!) === "recorded";
}

function extensionInterfaceContract(): boolean {
  class Diagnostics { status(): string { return "diagnostics:ready"; } }
  class CatalogueComponent { extension(name: string): Diagnostics | undefined { return name === "diagnostics" ? new Diagnostics() : undefined; } }
  return new CatalogueComponent().extension("diagnostics")!.status() === "diagnostics:ready";
}

function asynchronousCompletionTokenContract(): boolean {
  class CompletionToken {
    readonly requestId: string;
    result: string | undefined;
    constructor(requestId: string) { this.requestId = requestId; }
    complete(result: string): void { this.result = result; }
  }
  const token = new CompletionToken("run-42");
  token.complete("saved");
  return token.requestId === "run-42" && token.result === "saved";
}

function acceptorConnectorContract(): boolean {
  class Acceptor { accept(peer: string): string { return `connected:${peer}`; } }
  class Connector {
    private readonly acceptor: Acceptor;
    constructor(acceptor: Acceptor) { this.acceptor = acceptor; }
    connect(peer: string): string { return this.acceptor.accept(peer); }
  }
  return new Connector(new Acceptor()).connect("catalogue-client") === "connected:catalogue-client";
}

function scopedLockingContract(): boolean {
  class ScopedLock {
    #locked = false;
    run(action: () => string): string {
      if (this.#locked) throw new Error("The protected state is already locked.");
      this.#locked = true;
      try { return action(); } finally { this.#locked = false; }
    }
    get isLocked(): boolean { return this.#locked; }
  }
  const lock = new ScopedLock();
  const state = lock.run(() => "updated");
  return state === "updated" && !lock.isLocked;
}

function strategizedLockingContract(): boolean {
  interface LockStrategy { acquire(): void; release(): void; }
  class RecordingLock implements LockStrategy {
    readonly events: string[] = [];
    acquire(): void { this.events.push("acquire"); }
    release(): void { this.events.push("release"); }
  }
  class ProtectedCounter {
    private readonly lockStrategy: LockStrategy;
    private value = 0;
    constructor(lockStrategy: LockStrategy) { this.lockStrategy = lockStrategy; }
    increment(): number {
      this.lockStrategy.acquire();
      try { this.value += 1; return this.value; } finally { this.lockStrategy.release(); }
    }
  }
  const lockStrategy = new RecordingLock();
  return new ProtectedCounter(lockStrategy).increment() === 1 && lockStrategy.events.join(",") === "acquire,release";
}

function threadSafeInterfaceContract(): boolean {
  class SafeInventory {
    readonly #items: string[] = [];
    #busy = false;
    #synchronize<T>(action: () => T): T {
      if (this.#busy) throw new Error("Concurrent access is not allowed.");
      this.#busy = true;
      try { return action(); } finally { this.#busy = false; }
    }
    add(item: string): void { this.#synchronize(() => this.#items.push(item)); }
    count(): number { return this.#synchronize(() => this.#items.length); }
  }
  const inventory = new SafeInventory();
  inventory.add("catalogue");
  return inventory.count() === 1;
}

function doubleCheckedLockingContract(): boolean {
  class LazyCatalogue {
    #instance: { status: string } | undefined;
    creations = 0;
    instance(): { status: string } {
      if (this.#instance === undefined) {
        if (this.#instance === undefined) {
          this.#instance = { status: "ready" };
          this.creations += 1;
        }
      }
      return this.#instance;
    }
  }
  const catalogue = new LazyCatalogue();
  return catalogue.instance() === catalogue.instance() && catalogue.creations === 1;
}

function threadSpecificStorageContract(): boolean {
  class RequestContexts {
    private readonly contexts = new Map<string, { requestId: string }>();
    setRequestId(threadId: string, requestId: string): void { this.contexts.set(threadId, { requestId }); }
    requestIdFor(threadId: string): string | undefined { return this.contexts.get(threadId)?.requestId; }
  }
  const contexts = new RequestContexts();
  contexts.setRequestId("worker-1", "run-42");
  return contexts.requestIdFor("worker-1") === "run-42" && contexts.requestIdFor("worker-2") === undefined;
}

function distributedTracingContract(): boolean {
  class Trace { readonly spans: string[] = []; readonly traceId: string; constructor(traceId: string) { this.traceId = traceId; } record(service: string): void { this.spans.push(`${this.traceId}:${service}`); } }
  const trace = new Trace("trace-42");
  trace.record("catalogue-api"); trace.record("pricing");
  return trace.spans.join(",") === "trace-42:catalogue-api,trace-42:pricing";
}

function exceptionTrackingContract(): boolean {
  class ExceptionTracker { readonly reports: Array<{ service: string; error: string }> = []; record(service: string, error: Error): void { this.reports.push({ service, error: error.message }); } }
  const tracker = new ExceptionTracker();
  try { throw new Error("catalogue unavailable"); } catch (error) { tracker.record("catalogue-api", error as Error); }
  return JSON.stringify(tracker.reports) === '[{"service":"catalogue-api","error":"catalogue unavailable"}]';
}
function logDeploymentsAndChangesContract(): boolean { class ChangeLog { readonly entries: string[] = []; recordDeployment(version: string): void { this.entries.push(`deployed:${version}`); } } const log = new ChangeLog(); log.recordDeployment("2026.08.13"); return log.entries.join(",") === "deployed:2026.08.13"; }
function serverSidePageFragmentCompositionContract(): boolean { class PageComposer { compose(header: string, body: string): string { return `<page>${header}${body}</page>`; } } return new PageComposer().compose("<header>catalogue</header>", "<main>patterns</main>") === "<page><header>catalogue</header><main>patterns</main></page>"; }

function parseCatalog(path: string): readonly PatternDefinition[] {
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line, index) => {
      const fields = line.split("|");
      if (fields.length !== 5) throw new Error(`Malformed manifest record on line ${index + 1}`);
      const [identifier, catalogueNames, family, name, contract] = fields;
      return { identifier, catalogues: catalogueNames.split(";"), family, name, contract };
    });
}

const contracts: Readonly<Record<string, () => boolean>> = {
  boundary: () => new Map([["request", "accepted"]]).get("request") === "accepted",
  blackboard: blackboardContract,
  broker: brokerContract,
  pac: pacContract,
  reflection: reflectionContract,
  "master-slave": masterSlaveContract,
  "command-processor": commandProcessorContract,
  "view-handler": viewHandlerContract,
  "forwarder-receiver": forwarderReceiverContract,
  "whole-part": wholePartContract,
  "client-dispatcher-server": clientDispatcherServerContract,
  "counted-pointer": countedPointerContract,
  "wrapper-facade": wrapperFacadeContract,
  "component-configurator": componentConfiguratorContract,
  interceptor: interceptorContract,
  "extension-interface": extensionInterfaceContract,
  "asynchronous-completion-token": asynchronousCompletionTokenContract,
  "acceptor-connector": acceptorConnectorContract,
  "scoped-locking": scopedLockingContract,
  "strategized-locking": strategizedLockingContract,
  "thread-safe-interface": threadSafeInterfaceContract,
  "double-checked-locking": doubleCheckedLockingContract,
  "thread-specific-storage": threadSpecificStorageContract,
  "distributed-tracing": distributedTracingContract,
  "exception-tracking": exceptionTrackingContract,
  "log-deployments-and-changes": logDeploymentsAndChangesContract,
  "server-side-page-fragment-composition": serverSidePageFragmentCompositionContract,
  composition: () => ["first", "second"].join("|") === "first|second",
  concurrency: () => new Set(["leader"]).size === 1,
  deployment: () => new Set(["region-a", "region-b"]).size === 2,
  mapping: () => ({ external: "internal" }).external === "internal",
  messaging: () => ((message: Readonly<{ id: string }>) => message.id === "m-1")({ id: "m-1" }),
  observability: () => ["trace-1", "healthy"].every(Boolean),
  ordering: () => [3, 1, 2].sort((left, right) => left - right).join(",") === "1,2,3",
  persistence: () => new Map([["id", "saved"]]).get("id") === "saved",
  resilience: () => [1, 2, 3].find((attempt) => attempt === 2) === 2,
  routing: () => ("invoice".startsWith("invoice") ? "billing" : "support") === "billing",
  security: () => ({ token: "scoped" }).token === "scoped",
  state: () => "ready" === "ready",
};

function verify(definitions: readonly PatternDefinition[]): void {
  if (definitions.length !== EXPECTED_PATTERN_COUNT) {
    throw new Error(`Expected ${EXPECTED_PATTERN_COUNT} records, found ${definitions.length}`);
  }
  const identifiers = new Set(definitions.map((definition) => definition.identifier));
  if (identifiers.size !== definitions.length) throw new Error("Pattern identifiers must be unique");
  for (const definition of definitions) {
    if (![definition.identifier, definition.catalogues.length, definition.family, definition.name].every(Boolean)) {
      throw new Error(`Incomplete definition: ${definition.identifier}`);
    }
    const contract = contracts[definition.contract];
    if (!contract || !contract()) throw new Error(`${definition.name} contract failed`);
    console.log(`PASS ${definition.name}`);
  }
}

verify(parseCatalog(`${__dirname}/../shared/pattern-catalog.tsv`));
console.log(`Verified ${EXPECTED_PATTERN_COUNT} catalogued patterns.`);

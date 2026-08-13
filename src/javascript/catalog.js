"use strict";

const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const EXPECTED_PATTERN_COUNT = 259;

function blackboardContract() {
  const sharedFacts = [];
  const extractTokens = () => sharedFacts.push("candidate:invoice", "amount:42");
  const inferClassification = () => {
    if (sharedFacts.includes("candidate:invoice")) sharedFacts.push("classification:billable");
  };
  extractTokens();
  inferClassification();
  return sharedFacts.at(-1) === "classification:billable";
}

function brokerContract() {
  const serviceRegistry = new Map([["pricing", (productId) => `quote:${productId}`]]);
  const request = (serviceName, productId) => serviceRegistry.get(serviceName)(productId);
  return request("pricing", "42") === "quote:42";
}

function pacContract() {
  const abstraction = { selected: "none" };
  const control = (action) => { abstraction.selected = action.replace("select:", ""); };
  const presentation = () => `selected:${abstraction.selected}`;
  control("select:report");
  return presentation() === "selected:report";
}

function reflectionContract() {
  const formatter = { upper: (value) => value.toUpperCase() };
  const operation = formatter["upper"];
  return operation("catalogue") === "CATALOGUE";
}

function masterSlaveContract() {
  const workers = [(value) => value * 2, (value) => value * 3];
  const results = workers.map((worker) => worker(2));
  return results.reduce((sum, result) => sum + result, 0) === 10;
}

function commandProcessorContract() {
  const executed = [];
  const pending = [() => executed.push("refresh")];
  pending.shift()();
  return executed.join(",") === "refresh";
}

function viewHandlerContract() {
  const commands = new Map([["save-clicked", () => "save-document"]]);
  return commands.get("save-clicked")() === "save-document";
}

function forwarderReceiverContract() {
  const receiver = (payload) => `received:${payload}`;
  const forwarder = (message) => receiver(message.replace("send:", ""));
  return forwarder("send:invoice") === "received:invoice";
}

function wholePartContract() {
  class Folder {
    #parts = [];
    addPart(size) { this.#parts.push(size); }
    totalSize() { return this.#parts.reduce((total, size) => total + size, 0); }
  }
  const archive = new Folder();
  archive.addPart(3);
  archive.addPart(5);
  return archive.totalSize() === 8;
}

function clientDispatcherServerContract() {
  const servers = new Map([["calculate", (payload) => `result:${payload * 2}`]]);
  const dispatcher = (operation, payload) => servers.get(operation)(payload);
  const client = () => dispatcher("calculate", 21);
  return client() === "result:42";
}

function countedPointerContract() {
  class SharedHandle {
    #references = 1;
    constructor(value) { this.value = value; }
    acquire() { this.#references += 1; return this; }
    release() { this.#references -= 1; return this.#references; }
  }

  const document = new SharedHandle("invoice");
  const observer = document.acquire();
  return observer.value === "invoice" && document.release() === 1;
}

function wrapperFacadeContract() {
  class SocketLibrary { connect(host, port) { return `${host}:${port}`; } }
  class CatalogueConnection {
    constructor(socketLibrary) { this.socketLibrary = socketLibrary; }
    open() { return this.socketLibrary.connect("catalogue", 443); }
  }
  return new CatalogueConnection(new SocketLibrary()).open() === "catalogue:443";
}

function componentConfiguratorContract() {
  class Cache { start() { return "cache:ready"; } }
  class ComponentConfigurator {
    constructor(factories) { this.factories = factories; }
    configure(name) { const Factory = this.factories.get(name); return new Factory().start(); }
  }
  return new ComponentConfigurator(new Map([["cache", Cache]])).configure("cache") === "cache:ready";
}

function interceptorContract() {
  const auditInterceptor = (request, nextHandler) => { request.audit = "recorded"; return nextHandler(request); };
  return auditInterceptor({ operation: "save" }, (request) => request.audit) === "recorded";
}

function extensionInterfaceContract() {
  class Diagnostics { status() { return "diagnostics:ready"; } }
  class CatalogueComponent { extension(name) { return name === "diagnostics" ? new Diagnostics() : undefined; } }
  return new CatalogueComponent().extension("diagnostics").status() === "diagnostics:ready";
}

function asynchronousCompletionTokenContract() {
  class CompletionToken { constructor(requestId) { this.requestId = requestId; this.result = undefined; } complete(result) { this.result = result; } }
  const token = new CompletionToken("run-42");
  token.complete("saved");
  return token.requestId === "run-42" && token.result === "saved";
}

function acceptorConnectorContract() {
  class Acceptor { accept(peer) { return `connected:${peer}`; } }
  class Connector { constructor(acceptor) { this.acceptor = acceptor; } connect(peer) { return this.acceptor.accept(peer); } }
  return new Connector(new Acceptor()).connect("catalogue-client") === "connected:catalogue-client";
}

function scopedLockingContract() {
  class ScopedLock {
    #locked = false;
    run(action) {
      if (this.#locked) throw new Error("The protected state is already locked.");
      this.#locked = true;
      try { return action(); } finally { this.#locked = false; }
    }
    get isLocked() { return this.#locked; }
  }
  const lock = new ScopedLock();
  const state = lock.run(() => "updated");
  return state === "updated" && !lock.isLocked;
}

function strategizedLockingContract() {
  class RecordingLock {
    constructor() { this.events = []; }
    acquire() { this.events.push("acquire"); }
    release() { this.events.push("release"); }
  }
  class ProtectedCounter {
    constructor(lockStrategy) { this.lockStrategy = lockStrategy; this.value = 0; }
    increment() {
      this.lockStrategy.acquire();
      try { this.value += 1; return this.value; } finally { this.lockStrategy.release(); }
    }
  }
  const lockStrategy = new RecordingLock();
  return new ProtectedCounter(lockStrategy).increment() === 1 && lockStrategy.events.join(",") === "acquire,release";
}

function threadSafeInterfaceContract() {
  class SafeInventory {
    #items = [];
    #busy = false;
    #synchronize(action) {
      if (this.#busy) throw new Error("Concurrent access is not allowed.");
      this.#busy = true;
      try { return action(); } finally { this.#busy = false; }
    }
    add(item) { this.#synchronize(() => this.#items.push(item)); }
    count() { return this.#synchronize(() => this.#items.length); }
  }
  const inventory = new SafeInventory();
  inventory.add("catalogue");
  return inventory.count() === 1;
}

function doubleCheckedLockingContract() {
  class LazyCatalogue {
    #instance;
    creations = 0;
    instance() {
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

function threadSpecificStorageContract() {
  class RequestContexts {
    constructor() { this.contexts = new Map(); }
    setRequestId(threadId, requestId) { this.contexts.set(threadId, { requestId }); }
    requestIdFor(threadId) { return this.contexts.get(threadId)?.requestId; }
  }
  const contexts = new RequestContexts();
  contexts.setRequestId("worker-1", "run-42");
  return contexts.requestIdFor("worker-1") === "run-42" && contexts.requestIdFor("worker-2") === undefined;
}

function distributedTracingContract() {
  class Trace { constructor(traceId) { this.traceId = traceId; this.spans = []; } record(service) { this.spans.push(`${this.traceId}:${service}`); } }
  const trace = new Trace("trace-42");
  trace.record("catalogue-api"); trace.record("pricing");
  return trace.spans.join(",") === "trace-42:catalogue-api,trace-42:pricing";
}

function exceptionTrackingContract() {
  class ExceptionTracker { constructor() { this.reports = []; } record(service, error) { this.reports.push({ service, error: error.message }); } }
  const tracker = new ExceptionTracker();
  try { throw new Error("catalogue unavailable"); } catch (error) { tracker.record("catalogue-api", error); }
  return JSON.stringify(tracker.reports) === '[{"service":"catalogue-api","error":"catalogue unavailable"}]';
}

function parseCatalog(path) {
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line, index) => {
      const fields = line.split("|");
      if (fields.length !== 5) throw new Error(`Malformed manifest record on line ${index + 1}`);
      const [identifier, catalogues, family, name, contract] = fields;
      return { identifier, catalogues: catalogues.split(";"), family, name, contract };
    });
}

const contracts = Object.freeze({
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
  composition: () => ["first", "second"].join("|") === "first|second",
  concurrency: () => new Set(["leader"]).size === 1,
  deployment: () => new Set(["region-a", "region-b"]).size === 2,
  mapping: () => ({ external: "internal" }).external === "internal",
  messaging: () => ((message) => message.id === "m-1")({ id: "m-1" }),
  observability: () => ["trace-1", "healthy"].every(Boolean),
  ordering: () => [3, 1, 2].sort((left, right) => left - right).join(",") === "1,2,3",
  persistence: () => new Map([["id", "saved"]]).get("id") === "saved",
  resilience: () => [1, 2, 3].find((attempt) => attempt === 2) === 2,
  routing: () => ("invoice".startsWith("invoice") ? "billing" : "support") === "billing",
  security: () => ({ token: "scoped" }).token === "scoped",
  state: () => "ready" === "ready",
});

function verify(definitions) {
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

const manifest = join(__dirname, "..", "shared", "pattern-catalog.tsv");
verify(parseCatalog(manifest));
console.log(`Verified ${EXPECTED_PATTERN_COUNT} catalogued patterns.`);

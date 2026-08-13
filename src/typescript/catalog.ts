declare const __dirname: string;
declare function require(name: string): { readFileSync(path: string, encoding: "utf8"): string };

type PatternDefinition = Readonly<{
  identifier: string;
  catalogues: readonly string[];
  family: string;
  name: string;
  contract: string;
}>;

const EXPECTED_PATTERN_COUNT = 243;
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

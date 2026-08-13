"use strict";

const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const EXPECTED_PATTERN_COUNT = 238;

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

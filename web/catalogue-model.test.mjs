import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { EXPECTED_PATTERN_COUNT, assertCatalogue, parseCatalogue, patternView, runPattern } from "./catalogue-model.mjs";

const manifest = new URL("../src/shared/pattern-catalog.tsv", import.meta.url);

test("the browser model covers every manifest record in both languages", async () => {
  const patterns = parseCatalogue(await readFile(manifest, "utf8"));
  assertCatalogue(patterns);
  assert.equal(patterns.length, EXPECTED_PATTERN_COUNT);
  for (const pattern of patterns) {
    for (const language of ["en", "tr"]) {
      assert.ok(patternView(pattern, language).description.length > 40);
      const run = runPattern(pattern, language);
      assert.equal(run.steps.length, 3);
      assert.match(run.output, /.+/);
    }
  }
});

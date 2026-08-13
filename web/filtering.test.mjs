import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parseCatalogue, patternView } from "./catalogue-model.mjs";
import { compatibleCatalogues, compatibleFamilies, filterByFacets, resolveVisiblePatterns, searchPatterns } from "./filtering.mjs";

const manifest = new URL("../src/shared/pattern-catalog.tsv", import.meta.url);

test("every enabled catalogue and family combination produces a pattern", async () => {
  const patterns = parseCatalogue(await readFile(manifest, "utf8"));
  const catalogues = new Set(patterns.flatMap((pattern) => pattern.catalogues));
  for (const catalogue of catalogues) {
    for (const family of compatibleFamilies(patterns, catalogue)) {
      assert.ok(filterByFacets(patterns, { catalogue, family }).length > 0);
    }
  }
  for (const family of new Set(patterns.map((pattern) => pattern.family))) {
    for (const catalogue of compatibleCatalogues(patterns, family)) {
      assert.ok(filterByFacets(patterns, { catalogue, family }).length > 0);
    }
  }
});

test("an unmatched free-text search retains a non-empty filtered result set", async () => {
  const patterns = parseCatalogue(await readFile(manifest, "utf8"));
  const facets = filterByFacets(patterns, { catalogue: "GoF", family: "creational" });
  assert.ok(facets.length > 0);
  assert.equal(searchPatterns(facets, "this text cannot match a pattern", "en", patternView).length, 0);
  const visible = resolveVisiblePatterns(patterns, { catalogue: "GoF", family: "creational", query: "this text cannot match a pattern" }, "en", patternView);
  assert.deepEqual(visible.matches, facets);
  assert.equal(visible.searchMiss, true);
});

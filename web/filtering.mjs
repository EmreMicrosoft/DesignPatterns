export function filterByFacets(patterns, { catalogue = "", family = "" }) {
  return patterns.filter((pattern) =>
    (!catalogue || pattern.catalogues.includes(catalogue)) &&
    (!family || pattern.family === family));
}

export function searchPatterns(patterns, query, language, patternView) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return patterns;
  return patterns.filter((pattern) => {
    const view = patternView(pattern, language);
    return [pattern.name, pattern.identifier, pattern.family, pattern.catalogues.join(" "), view.description]
      .join(" ").toLocaleLowerCase().includes(normalizedQuery);
  });
}

export function resolveVisiblePatterns(patterns, filters, language, patternView) {
  const facets = filterByFacets(patterns, filters);
  const matches = searchPatterns(facets, filters.query, language, patternView);
  return { matches: matches.length ? matches : facets, searchMiss: Boolean(filters.query.trim() && !matches.length) };
}

export function compatibleCatalogues(patterns, family) {
  return new Set(filterByFacets(patterns, { family }).flatMap((pattern) => pattern.catalogues));
}

export function compatibleFamilies(patterns, catalogue) {
  return new Set(filterByFacets(patterns, { catalogue }).map((pattern) => pattern.family));
}

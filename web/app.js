import { assertCatalogue, catalogueLabel, parseCatalogue, patternView, runPattern } from "./catalogue-model.mjs";

const copy = {
  en: {
    eyebrow: "Interactive learning catalogue", title: "See a design pattern work.",
    summary: "Browse every pattern, run its small executable learning scenario, and follow the data flow step by step.",
    note: "These are short, independently authored teaching simulations. They explain a pattern’s concern; they are not production templates.",
    searchLabel: "Find a pattern", searchPlaceholder: "Search by name, family, or catalogue", catalogueLabel: "Catalogue", familyLabel: "Family",
    allCatalogues: "All catalogues", allFamilies: "All families", catalogueEyebrow: "Pattern library", catalogueTitle: "Choose a pattern to explore",
    legend: "Run opens a result and a three-step data-flow explanation.", run: "Run learning scenario", input: "Input", flow: "Data flow", results: (count) => `${count} patterns shown`, goal: "What it helps with",
    loading: "Loading the pattern catalogue…", failure: "The catalogue could not be loaded. Start the local web server from the project root and try again.",
  },
  tr: {
    eyebrow: "Etkileşimli öğrenme kataloğu", title: "Bir tasarım deseninin çalışmasını görün.",
    summary: "Tüm desenleri inceleyin, küçük çalıştırılabilir öğrenme senaryosunu başlatın ve veri akışını adım adım izleyin.",
    note: "Bunlar bağımsız yazılmış kısa öğretim simülasyonlarıdır. Desenin kaygısını açıklar; üretim şablonu değildir.",
    searchLabel: "Desen bul", searchPlaceholder: "Ad, aile veya katalog ile ara", catalogueLabel: "Katalog", familyLabel: "Aile",
    allCatalogues: "Tüm kataloglar", allFamilies: "Tüm aileler", catalogueEyebrow: "Desen kütüphanesi", catalogueTitle: "İncelemek için bir desen seçin",
    legend: "Çalıştır, sonuç ve üç adımlı veri akışı açıklamasını açar.", run: "Öğrenme senaryosunu çalıştır", input: "Girdi", flow: "Veri akışı", results: (count) => `${count} desen gösteriliyor`, goal: "Ne işe yarar",
    loading: "Desen kataloğu yükleniyor…", failure: "Katalog yüklenemedi. Proje kökünden yerel web sunucusunu başlatıp yeniden deneyin.",
  },
};

const state = { language: "en", patterns: [], query: "", catalogue: "", family: "" };
const grid = document.querySelector("#pattern-grid");
const search = document.querySelector("#search");
const catalogueFilter = document.querySelector("#catalogue-filter");
const familyFilter = document.querySelector("#family-filter");
const count = document.querySelector("#result-count");
const template = document.querySelector("#pattern-card-template");

function translate() { return copy[state.language]; }

function localizePage() {
  const words = translate();
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = words[element.dataset.i18n]; });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => { element.placeholder = words[element.dataset.i18nPlaceholder]; });
  document.querySelectorAll("[data-language]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.language === state.language)));
  populateFilters();
}

function addOptions(select, values, allLabel, labelFor) {
  const selected = select.value;
  select.replaceChildren(new Option(allLabel, ""), ...values.map((value) => new Option(labelFor(value), value)));
  select.value = [...select.options].some((option) => option.value === selected) ? selected : "";
}

function populateFilters() {
  const catalogues = [...new Set(state.patterns.flatMap((pattern) => pattern.catalogues))].sort();
  const families = [...new Set(state.patterns.map((pattern) => pattern.family))].sort();
  addOptions(catalogueFilter, catalogues, translate().allCatalogues, (value) => catalogueLabel(value, state.language));
  addOptions(familyFilter, families, translate().allFamilies, (value) => value.replaceAll("-", " "));
}

function selectedPatterns() {
  const query = state.query.trim().toLocaleLowerCase();
  return state.patterns.filter((pattern) => {
    const view = patternView(pattern, state.language);
    const searchable = [pattern.name, pattern.identifier, pattern.family, pattern.catalogues.join(" "), view.description].join(" ").toLocaleLowerCase();
    return (!query || searchable.includes(query)) && (!state.catalogue || pattern.catalogues.includes(state.catalogue)) && (!state.family || pattern.family === state.family);
  });
}

function renderRun(panel, pattern) {
  const words = translate();
  const execution = runPattern(pattern, state.language);
  panel.hidden = false;
  panel.querySelector(".run-result__input").textContent = `${words.input}: ${execution.input}`;
  panel.querySelector(".run-result__output").textContent = execution.output;
  const flow = panel.querySelector(".flow-list");
  flow.replaceChildren(...execution.steps.map((step) => {
    const item = document.createElement("li");
    item.textContent = step.detail;
    return item;
  }));
}

function renderPatterns() {
  const words = translate();
  const matches = selectedPatterns();
  count.textContent = words.results(matches.length);
  grid.replaceChildren(...matches.map((pattern) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const view = patternView(pattern, state.language);
    card.querySelector(".pattern-card__meta").replaceChildren(...pattern.catalogues.map((catalogue) => {
      const tag = document.createElement("span"); tag.textContent = catalogueLabel(catalogue, state.language); return tag;
    }));
    card.querySelector("h3").textContent = view.name;
    card.querySelector(".pattern-card__description").textContent = view.description;
    card.querySelector(".pattern-card__goal").textContent = `${words.goal}: ${view.goal}`;
    const button = card.querySelector(".run-button");
    button.textContent = words.run;
    button.addEventListener("click", () => renderRun(card.querySelector(".run-result"), pattern));
    return card;
  }));
}

function bindEvents() {
  search.addEventListener("input", () => { state.query = search.value; renderPatterns(); });
  catalogueFilter.addEventListener("change", () => { state.catalogue = catalogueFilter.value; renderPatterns(); });
  familyFilter.addEventListener("change", () => { state.family = familyFilter.value; renderPatterns(); });
  document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
    state.language = button.dataset.language;
    localizePage();
    renderPatterns();
  }));
}

async function start() {
  grid.textContent = translate().loading;
  try {
    const response = await fetch("../src/shared/pattern-catalog.tsv");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.patterns = parseCatalogue(await response.text());
    assertCatalogue(state.patterns);
    localizePage();
    bindEvents();
    renderPatterns();
  } catch (error) {
    console.error(error);
    grid.textContent = translate().failure;
  }
}

start();

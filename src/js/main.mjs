// src/js/main.mjs
import { initSearch } from "./search.mjs";
import { toggleThemeInit } from "./ui.mjs";

window.addEventListener("DOMContentLoaded", () => {
  toggleThemeInit();
  initSearch();
});

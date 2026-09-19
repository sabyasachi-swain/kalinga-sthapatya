// Glossary page enhancement: live search + A–Z filter over the server-rendered term list.
// Pure progressive enhancement — with this file absent, every term is a plain, fully readable
// <details> in the full A–Z list (the "no-JS fallback = full list" the page spec asks for).

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

function setupGlossary() {
  const input = document.getElementById("glossary-search-input");
  const list = document.getElementById("glossary-list");
  const count = document.getElementById("glossary-count");
  const buttons = Array.from(document.querySelectorAll(".glossary-alphabet__btn"));
  if (!list) return;

  const items = Array.from(list.children);
  let activeLetter = "";

  function applyFilters() {
    const query = normalize(input ? input.value : "");
    let visible = 0;
    items.forEach((li) => {
      const searchText = li.getAttribute("data-search") || "";
      const letter = li.getAttribute("data-letter") || "";
      const matchesQuery = !query || searchText.includes(query);
      const matchesLetter = !activeLetter || letter === activeLetter;
      const show = matchesQuery && matchesLetter;
      li.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} term${visible === 1 ? "" : "s"} shown`;
  }

  if (input) input.addEventListener("input", applyFilters);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeLetter = btn.getAttribute("data-letter") || "";
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      applyFilters();
    });
  });

  applyFilters();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupGlossary);
} else {
  setupGlossary();
}

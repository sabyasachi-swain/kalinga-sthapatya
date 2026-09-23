// Glossary page enhancement: client-side search + A–Z letter filtering.
// Progressive enhancement over pre-rendered markup. With JS disabled,
// the complete definition list is fully accessible and find-in-page-able.

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

export function initGlossary() {
  const input = document.getElementById("glossary-search-input");
  const list = document.getElementById("glossary-list");
  const count = document.getElementById("glossary-count");
  const noResults = document.getElementById("glossary-no-results");
  const resetBtn = document.getElementById("glossary-reset-btn");
  const alphabetBtns = Array.from(document.querySelectorAll(".glossary-alphabet__btn"));

  if (!list) return;

  const items = Array.from(list.querySelectorAll(".term-card"));
  let activeLetter = "";

  function applyFilters() {
    const query = normalize(input ? input.value : "");
    let visible = 0;

    items.forEach((item) => {
      const searchText = item.getAttribute("data-search") || "";
      const letter = item.getAttribute("data-letter") || "";

      const matchesQuery = !query || searchText.includes(query);
      const matchesLetter = !activeLetter || letter === activeLetter;
      const show = matchesQuery && matchesLetter;

      item.hidden = !show;
      if (show) visible += 1;
    });

    if (count) {
      if (visible === 0) {
        count.textContent = "No matching terms found";
      } else {
        count.textContent = `${visible} term${visible === 1 ? "" : "s"} shown`;
      }
    }

    if (noResults) {
      noResults.hidden = visible > 0;
    }
  }

  if (input) {
    input.addEventListener("input", applyFilters);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && input.value) {
        input.value = "";
        applyFilters();
      }
    });
  }

  alphabetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const letter = btn.getAttribute("data-letter") || "";
      if (activeLetter === letter && letter !== "") {
        activeLetter = "";
      } else {
        activeLetter = letter;
      }

      alphabetBtns.forEach((b) => {
        const bLetter = b.getAttribute("data-letter") || "";
        const isPressed = activeLetter === "" ? bLetter === "" : bLetter === activeLetter;
        b.setAttribute("aria-pressed", String(isPressed));
      });

      applyFilters();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (input) input.value = "";
      activeLetter = "";
      alphabetBtns.forEach((b) => {
        const bLetter = b.getAttribute("data-letter") || "";
        b.setAttribute("aria-pressed", String(bLetter === ""));
      });
      applyFilters();
      if (input) input.focus();
    });
  }

  applyFilters();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGlossary);
  } else {
    initGlossary();
  }
}

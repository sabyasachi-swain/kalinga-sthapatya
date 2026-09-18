// Kalinga Sthapatya — shared progressive enhancement.
// Every page is complete and readable with this file absent (decision D1); this only enhances:
// the hamburger menu, opening a <details> from the URL hash, evidence-badge tooltips, and info panels.

function setupNavToggle() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("primary-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  // Close the mobile menu after following a link.
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function openDetailsFromHash() {
  function open(hash) {
    if (!hash || hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target) return;
    const details = target.matches("details") ? target : target.closest("details");
    if (details) {
      details.open = true;
      details.scrollIntoView({ block: "start", behavior: "auto" });
    }
  }
  open(window.location.hash);
  window.addEventListener("hashchange", () => open(window.location.hash));
}

// Evidence badge tooltips: hover/focus already show them via CSS. This adds tap-to-toggle for
// touch devices (no hover) and Esc-to-close, per the design system's tooltip/term component.
function setupBadgeTooltips() {
  const badges = Array.from(document.querySelectorAll(".badge"));
  if (!badges.length) return;

  function closeAll(except) {
    badges.forEach((b) => {
      if (b === except) return;
      b.classList.remove("is-open");
      const trigger = b.querySelector(".badge__trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  badges.forEach((badge) => {
    const trigger = badge.querySelector(".badge__trigger");
    if (!trigger) return;
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = badge.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) closeAll(badge);
    });
  });

  document.addEventListener("click", () => closeAll(null));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll(null);
  });
}

// Info panels (Academy hotspots, map preview card): role="dialog" aria-modal="false" asides that
// slide in, move focus to their heading, and return focus to the trigger on close.
function setupInfoPanels() {
  const panels = new Map(); // panelId -> lastTrigger element
  const openTriggers = document.querySelectorAll("[data-panel-open]");
  const closeTriggers = document.querySelectorAll("[data-panel-close]");
  if (!openTriggers.length) return;

  function openPanel(id, trigger) {
    const panel = document.getElementById(id);
    if (!panel) return;
    panels.set(id, trigger);
    panel.hidden = false;
    const heading = panel.querySelector("h1, h2, h3, h4");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
    document.addEventListener("keydown", escHandler);
  }

  function closePanel(id) {
    const panel = document.getElementById(id);
    if (!panel) return;
    panel.hidden = true;
    const trigger = panels.get(id);
    if (trigger) trigger.focus();
    document.removeEventListener("keydown", escHandler);
  }

  function escHandler(e) {
    if (e.key !== "Escape") return;
    const openPanelEl = document.querySelector(".info-panel:not([hidden])");
    if (openPanelEl) closePanel(openPanelEl.id);
  }

  openTriggers.forEach((btn) => {
    btn.addEventListener("click", () => openPanel(btn.getAttribute("data-panel-open"), btn));
  });
  closeTriggers.forEach((btn) => {
    btn.addEventListener("click", () => closePanel(btn.getAttribute("data-panel-close")));
  });
}

function init() {
  setupNavToggle();
  openDetailsFromHash();
  setupBadgeTooltips();
  setupInfoPanels();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

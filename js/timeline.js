// Timeline page enhancement: Prev/Next buttons + arrow-key navigation for the horizontal
// scroll-snap track. Pure progressive enhancement — the <ol> is a fully readable, focusable list
// without this file; CSS alone gives the horizontal layout at >=1024px. Never listens for wheel/
// touch events on the page, so ordinary vertical scrolling is never hijacked.

function setupTimeline() {
  const track = document.getElementById("timeline-track");
  if (!track) return;
  const prev = document.querySelector("[data-timeline-prev]");
  const next = document.querySelector("[data-timeline-next]");
  const cards = Array.from(track.children);
  if (!cards.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = reduceMotion ? "auto" : "smooth";

  function cardStepPx() {
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function scrollByCards(count) {
    track.scrollBy({ left: cardStepPx() * count, behavior });
  }

  if (prev) prev.addEventListener("click", () => scrollByCards(-1));
  if (next) next.addEventListener("click", () => scrollByCards(1));

  // Arrow keys only act while the track itself has focus (it's a tabindex="0" list), so this
  // never competes with normal page-scroll arrow-key behaviour elsewhere.
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCards(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCards(-1);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupTimeline);
} else {
  setupTimeline();
}

// Temple page enhancement: "See how it's built" segmented control switches between build-sequence
// frames with a short crossfade (disabled globally under prefers-reduced-motion via style.css).
// Pure progressive enhancement — with this file absent, every frame from
// scripts/build/pages/temple.mjs is shown in a plain vertical stack and the switcher buttons are
// simply inert; the video below always works on its own regardless.

function setupBuildSequence() {
  const containers = document.querySelectorAll("[data-build-sequence-frames]");
  containers.forEach((frames) => {
    const card = frames.closest(".build-sequence__card");
    if (!card) return;
    const tabs = Array.from(card.querySelectorAll(".build-sequence__tab"));
    const frameEls = Array.from(frames.querySelectorAll(".build-sequence__frame"));
    if (tabs.length < 2 || frameEls.length < 2) return;

    frames.classList.add("is-enhanced");

    function activate(index) {
      frameEls.forEach((f, i) => f.classList.toggle("is-active", i === index));
      tabs.forEach((t, i) => t.setAttribute("aria-pressed", String(i === index)));
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(i));
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupBuildSequence);
} else {
  setupBuildSequence();
}

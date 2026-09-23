// d:\Personal\AI_Experiment\kalinga-sthapatya\js\templeJourney.js
(function () {
  const stops = Array.from(document.querySelectorAll('.journey-stop'));
  const railLinks = Array.from(document.querySelectorAll('.journey-rail__link'));
  
  const steps = Array.from(document.querySelectorAll('.tour-step'));
  const stage = document.querySelector('.parts-tour__stage');

  const facades = Array.from(document.querySelectorAll('.video-facade'));

  let stopObserver = null;
  let tourObserver = null;

  if ('IntersectionObserver' in window) {
    if (stops.length > 0 && railLinks.length > 0) {
      stopObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            railLinks.forEach((link) => {
              if (link.getAttribute('data-stop') === id) {
                link.setAttribute('aria-current', 'step');
              } else {
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });

      stops.forEach((stop) => stopObserver.observe(stop));
    }

    if (steps.length > 0 && stage) {
      tourObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const highlight = entry.target.getAttribute('data-highlight') || '';
            stage.setAttribute('data-focus', highlight);
            
            steps.forEach((step) => {
              if (step === entry.target) {
                step.classList.add('is-current');
              } else {
                step.classList.remove('is-current');
              }
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });

      steps.forEach((step) => tourObserver.observe(step));
    }

    window.addEventListener('pagehide', () => {
      if (stopObserver) stopObserver.disconnect();
      if (tourObserver) tourObserver.disconnect();
    });
  }

  facades.forEach((facade) => {
    const playBtn = facade.querySelector('.video-facade__play');
    if (!playBtn) return;

    playBtn.addEventListener('click', () => {
      const src = facade.getAttribute('data-video');
      const w = facade.getAttribute('data-w');
      const h = facade.getAttribute('data-h');
      
      if (!src) return;

      const video = document.createElement('video');
      video.setAttribute('controls', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('src', src);
      
      if (w) video.setAttribute('width', w);
      if (h) video.setAttribute('height', h);

      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        video.setAttribute('autoplay', '');
      }

      facade.innerHTML = '';
      facade.appendChild(video);
      video.focus();
    });
  });
})();


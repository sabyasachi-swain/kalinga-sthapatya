// js/templeJourney.js
(function () {
  const stops = Array.from(document.querySelectorAll('.journey-stop'));
  const railLinks = Array.from(document.querySelectorAll('.journey-rail__link'));
  
  const steps = Array.from(document.querySelectorAll('.tour-step'));
  const stage = document.querySelector('.parts-tour__stage');
  const partsTour = document.querySelector('.parts-tour');

  const facades = Array.from(document.querySelectorAll('.video-facade'));

  let stopObserver = null;
  let tourObserver = null;

  // Parts tour progressive enhancement
  if (partsTour && steps.length > 0) {
    partsTour.classList.add('is-enhanced');

    const prevBtn = partsTour.querySelector('.parts-tour__btn--prev');
    const nextBtn = partsTour.querySelector('.parts-tour__btn--next');
    const counter = partsTour.querySelector('.parts-tour__counter');
    const status = partsTour.querySelector('.parts-tour__status');

    let currentStepIndex = 0;
    let isProgrammaticScroll = false;
    let programmaticTimeout = null;

    function clearProgrammaticScroll() {
      isProgrammaticScroll = false;
      if (programmaticTimeout) {
        clearTimeout(programmaticTimeout);
        programmaticTimeout = null;
      }
    }

    function updateTourState(index, shouldScroll) {
      if (index < 0 || index >= steps.length) return;
      currentStepIndex = index;
      const targetStep = steps[index];
      const highlight = targetStep.getAttribute('data-highlight') || '';
      const totalSteps = steps.length;
      const stepNum = index + 1;

      if (stage) {
        stage.setAttribute('data-focus', highlight);
      }

      for (let i = 0; i < steps.length; i++) {
        if (i === index) {
          steps[i].classList.add('is-current');
        } else {
          steps[i].classList.remove('is-current');
        }
      }

      const kicker = 'Part ' + stepNum + ' of ' + totalSteps;
      if (counter) {
        counter.textContent = kicker;
      }
      if (status) {
        const headingEl = targetStep.querySelector('.tour-step__heading');
        const headingText = headingEl ? headingEl.textContent.trim() : '';
        status.textContent = kicker + ': ' + headingText;
      }

      if (prevBtn) {
        prevBtn.disabled = (index === 0);
        prevBtn.setAttribute('aria-controls', targetStep.id);
      }
      if (nextBtn) {
        nextBtn.disabled = (index === totalSteps - 1);
        nextBtn.setAttribute('aria-controls', targetStep.id);
      }

      if (shouldScroll) {
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        targetStep.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentStepIndex > 0) {
          isProgrammaticScroll = true;
          updateTourState(currentStepIndex - 1, true);
          if (programmaticTimeout) clearTimeout(programmaticTimeout);
          programmaticTimeout = setTimeout(clearProgrammaticScroll, 800);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (currentStepIndex < steps.length - 1) {
          isProgrammaticScroll = true;
          updateTourState(currentStepIndex + 1, true);
          if (programmaticTimeout) clearTimeout(programmaticTimeout);
          programmaticTimeout = setTimeout(clearProgrammaticScroll, 800);
        }
      });
    }

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', clearProgrammaticScroll, { passive: true });
    }

    if (window.location.hash) {
      const hashId = window.location.hash.slice(1);
      for (let i = 0; i < steps.length; i++) {
        if (steps[i].id === hashId) {
          updateTourState(i, false);
          break;
        }
      }
    }

    if ('IntersectionObserver' in window && stage) {
      tourObserver = new IntersectionObserver(function (entries) {
        if (isProgrammaticScroll) return;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const idx = steps.indexOf(entry.target);
            if (idx !== -1 && idx !== currentStepIndex) {
              updateTourState(idx, false);
            }
          }
        });
      }, { rootMargin: '-40% 0px -40% 0px' });

      steps.forEach(function (step) {
        tourObserver.observe(step);
      });
    }
  }

  // Journey rail scrollspy
  if ('IntersectionObserver' in window) {
    if (stops.length > 0 && railLinks.length > 0) {
      stopObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            railLinks.forEach(function (link) {
              if (link.getAttribute('data-stop') === id) {
                link.setAttribute('aria-current', 'step');
              } else {
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });

      stops.forEach(function (stop) {
        stopObserver.observe(stop);
      });
    }

    window.addEventListener('pagehide', function () {
      if (stopObserver) stopObserver.disconnect();
      if (tourObserver) tourObserver.disconnect();
    });
  }

  // Video facade click-to-play
  facades.forEach(function (facade) {
    const playBtn = facade.querySelector('.video-facade__play');
    if (!playBtn) return;

    playBtn.addEventListener('click', function () {
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

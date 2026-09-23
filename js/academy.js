// js/academy.js
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-enabled');

  // Hotspot Panel Logic
  const hotspots = document.querySelectorAll('.js-hotspot');
  const panel = document.querySelector('.js-anatomy-panel');
  const panelContent = document.querySelector('.anatomy-panel-content');
  const panelClose = document.querySelector('.anatomy-panel-close');
  
  let currentHotspot = null;

  function closePanel() {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    if (currentHotspot) {
      currentHotspot.focus();
      currentHotspot = null;
    }
  }

  if (panel && panelClose) {
    panelClose.addEventListener('click', closePanel);
  }

  hotspots.forEach(btn => {
    btn.addEventListener('click', () => {
      const elId = btn.getAttribute('data-element-id');
      const listItem = document.getElementById(`el-${elId}`);
      if (!listItem || !panel) return;
      
      panelContent.innerHTML = listItem.innerHTML;
      panel.hidden = false;
      currentHotspot = btn;
      panelClose.focus();
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel && !panel.hidden) {
      closePanel();
    }
  });

  // Builder Steps Walker
  const builderContainer = document.querySelector('.builder-steps-container');
  const nextBtn = document.getElementById('builderNextBtn');
  const progress = document.getElementById('builderProgress');
  
  if (builderContainer && nextBtn && progress) {
    const steps = builderContainer.querySelectorAll('.builder-step');
    let currentStep = 0;
    
    if (steps.length > 0) {
      nextBtn.addEventListener('click', () => {
        steps[currentStep].classList.remove('is-active');
        currentStep = (currentStep + 1) % steps.length;
        steps[currentStep].classList.add('is-active');
        
        progress.textContent = `${currentStep + 1} / ${steps.length}`;
        nextBtn.textContent = currentStep === steps.length - 1 ? 'Start over' : 'Next step';
      });
    }
  }

  // Scrollspy for in-page navigation
  const sections = document.querySelectorAll('.academy-content section');
  const navLinks = document.querySelectorAll('.in-page-nav-link');
  
  if (sections.length > 0 && navLinks.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      let visibleSectionId = null;
      
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleSectionId = entry.target.id;
          break;
        }
      }
      
      if (visibleSectionId) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${visibleSectionId}`) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }
    }, { rootMargin: '-20% 0px -70% 0px' });
    
    sections.forEach(sec => observer.observe(sec));
  }
});

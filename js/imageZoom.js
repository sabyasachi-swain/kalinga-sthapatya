// js/imageZoom.js
document.addEventListener('DOMContentLoaded', () => {
  const figures = document.querySelectorAll('figure[data-zoom="true"]');
  if (!figures.length) return;

  const d = document.createElement('dialog');
  d.className = 'zoom-dialog';
  d.innerHTML = `
    <div class="zoom-dialog-header">
      <div class="zoom-controls">
        <button type="button" class="zoom-btn" aria-label="Zoom out" id="zOut">−</button>
        <button type="button" class="zoom-btn" aria-label="Zoom in" id="zIn">+</button>
      </div>
      <button type="button" class="zoom-dialog-close" aria-label="Close" id="zClose">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
      </button>
    </div>
    <div class="zoom-scroll-area"><img class="zoom-image" alt=""></div>
    <div class="zoom-dialog-caption" id="zCap" aria-hidden="true"></div>`;
  document.body.appendChild(d);

  const imgEl = d.querySelector('.zoom-image'), scroll = d.querySelector('.zoom-scroll-area'), cap = d.querySelector('#zCap');
  let curBtn = null, zoom = 1, isDrag = false, hasDrag = false, sX, sY, sSL, sST, lastTap = 0;

  function update(cX = null, cY = null) {
    let rX = 0.5, rY = 0.5;
    if (zoom > 1) {
      const rect = imgEl.getBoundingClientRect();
      if (cX !== null && cY !== null) {
        rX = (cX - rect.left) / rect.width; rY = (cY - rect.top) / rect.height;
      } else {
        const aRect = scroll.getBoundingClientRect();
        rX = (aRect.left + aRect.width / 2 - rect.left) / rect.width;
        rY = (aRect.top + aRect.height / 2 - rect.top) / rect.height;
      }
      rX = Math.max(0, Math.min(1, rX)); rY = Math.max(0, Math.min(1, rY));
    }
    
    if (zoom === 1) {
      imgEl.style.cssText = ''; scroll.style.cursor = 'default';
    } else {
      const aW = scroll.clientWidth, aH = scroll.clientHeight;
      const iR = (imgEl.naturalWidth || 1) / (imgEl.naturalHeight || 1), aR = aW / aH;
      const bW = iR > aR ? aW : aH * iR, bH = iR > aR ? aW / iR : aH;
      imgEl.style.cssText = `max-width:none;max-height:none;width:${bW * zoom}px;height:${bH * zoom}px;`;
      scroll.style.cursor = 'grab';
    }
    
    if (zoom > 1) {
      imgEl.offsetHeight; // force layout
      let tL = (rX * imgEl.offsetWidth) - (scroll.clientWidth / 2);
      let tT = (rY * imgEl.offsetHeight) - (scroll.clientHeight / 2);
      if (cX !== null && cY !== null) {
        const aRect = scroll.getBoundingClientRect();
        tL = (rX * imgEl.offsetWidth) - (cX - aRect.left);
        tT = (rY * imgEl.offsetHeight) - (cY - aRect.top);
      }
      scroll.scrollLeft = tL; scroll.scrollTop = tT;
    }
  }

  function setZ(nZ, cX = null, cY = null) { zoom = Math.max(1, Math.min(3, nZ)); update(cX, cY); }
  function close() {
    d.close ? d.close() : (d.hidden = true);
    document.body.classList.remove('zoom-open');
    curBtn?.focus(); curBtn = null;
  }

  d.querySelector('#zIn').addEventListener('click', () => setZ(zoom + 1));
  d.querySelector('#zOut').addEventListener('click', () => setZ(zoom - 1));
  d.querySelector('#zClose').addEventListener('click', close);
  
  d.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !d.close) close();
    if (e.key === 'Tab' && !d.showModal) {
      const btns = d.querySelectorAll('button');
      if (e.shiftKey && document.activeElement === btns[0]) { btns[btns.length-1].focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === btns[btns.length-1]) { btns[0].focus(); e.preventDefault(); }
    }
  });

  imgEl.addEventListener('click', (e) => {
    if (hasDrag) return;
    const now = Date.now();
    if (now - lastTap < 300 && now - lastTap > 0) { setZ(zoom === 1 ? 3 : 1, e.clientX, e.clientY); lastTap = 0; }
    else lastTap = now;
  });

  scroll.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || zoom === 1) return;
    isDrag = true; hasDrag = false; sX = e.pageX; sY = e.pageY; sSL = scroll.scrollLeft; sST = scroll.scrollTop;
    scroll.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    if (!isDrag) return;
    isDrag = false; scroll.style.cursor = zoom > 1 ? 'grab' : 'default';
    setTimeout(() => { hasDrag = false; }, 50); // avoid firing click
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDrag) return;
    e.preventDefault();
    const wX = e.pageX - sX, wY = e.pageY - sY;
    if (Math.abs(wX) > 5 || Math.abs(wY) > 5) hasDrag = true;
    scroll.scrollLeft = sSL - wX; scroll.scrollTop = sST - wY;
  });

  figures.forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    const capTxt = fig.querySelector('figcaption')?.textContent.trim() || '';
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'zoom-activator'; btn.setAttribute('aria-label', 'Enlarge image');
    btn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z"/></svg>`;
    fig.appendChild(btn);
    btn.addEventListener('click', () => {
      curBtn = btn; imgEl.src = img.src; imgEl.alt = img.alt;
      if (capTxt) { cap.textContent = capTxt; cap.style.display = 'block'; d.setAttribute('aria-describedby', 'zCap'); }
      else { cap.textContent = ''; cap.style.display = 'none'; d.removeAttribute('aria-describedby'); }
      zoom = 1; update();
      d.showModal ? d.showModal() : (d.hidden = false, d.setAttribute('aria-modal', 'true'), d.setAttribute('role', 'dialog'));
      document.body.classList.add('zoom-open'); d.querySelector('#zClose').focus();
    });
  });
});

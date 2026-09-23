// js/map.js
document.addEventListener('DOMContentLoaded', () => {
  const mapDataEl = document.getElementById('mapData');
  if (!mapDataEl) return;
  const temples = JSON.parse(mapDataEl.textContent);

  const filterType = document.getElementById('filterType');
  const filterEra = document.getElementById('filterEra');
  const filterYear = document.getElementById('filterYear');
  const yearOutput = document.getElementById('yearOutput');
  const listItems = document.querySelectorAll('.map-list-item');

  document.documentElement.classList.add('js-enabled');

  let map = null;
  let markersGroup = null;
  let lastFocus = null;

  function applyFilters() {
    const typeVal = filterType.value;
    const eraVal = filterEra.value;
    const yearVal = parseInt(filterYear.value, 10);
    
    const visibleIds = new Set();
    
    temples.forEach(t => {
      const matchType = !typeVal || t.type === typeVal;
      const matchEra = !eraVal || t.eraId === eraVal;
      const matchYear = (t.year == null) || (t.year <= yearVal);
      
      if (matchType && matchEra && matchYear) {
        visibleIds.add(t.id);
      }
    });
    
    listItems.forEach(li => {
      const id = li.getAttribute('data-id');
      if (visibleIds.has(id)) {
        li.removeAttribute('hidden');
      } else {
        li.setAttribute('hidden', '');
      }
    });
    
    if (map && markersGroup) {
      markersGroup.clearLayers();
      const bounds = [];
      
      temples.forEach(t => {
        if (visibleIds.has(t.id)) {
          const marker = window.L.marker([t.lat, t.lng], { alt: t.name }).bindPopup(`
            <div class="temple-popup">
              ${t.silhouette ? `<img src="${t.silhouette}" alt="Silhouette of ${t.name}" loading="lazy">` : ''}
              <h4>${t.name}</h4>
              <p>${t.place}, ${t.district} &bull; ${t.eraLabel}</p>
              <a href="${t.url}" aria-label="Learn more about ${t.name}">Learn more</a>
            </div>
          `);
          marker.templeId = t.id;
          markersGroup.addLayer(marker);
          bounds.push([t.lat, t.lng]);
        }
      });
    }
  }

  filterType.addEventListener('change', applyFilters);
  filterEra.addEventListener('change', applyFilters);
  filterYear.addEventListener('input', (e) => {
    const val = e.target.value;
    yearOutput.textContent = `c. ${val} CE`;
    filterYear.setAttribute('aria-valuetext', `c. ${val} CE`);
    applyFilters();
  });
  
  filterYear.setAttribute('aria-valuetext', `c. ${filterYear.value} CE`);

  listItems.forEach(li => {
    const btn = li.querySelector('.map-list-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const id = li.getAttribute('data-id');
        if (map && markersGroup) {
          let targetMarker = null;
          markersGroup.eachLayer(m => {
            if (m.templeId === id) targetMarker = m;
          });
          if (targetMarker) {
            lastFocus = btn;
            map.setView(targetMarker.getLatLng(), 15);
            targetMarker.openPopup();
          }
        }
      });
    }
  });

  function loadLeaflet() {
    return new Promise((resolve, reject) => {
      if (window.L) return resolve(window.L);
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve(window.L);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function initMap() {
    try {
      const L = await loadLeaflet();
      const mapContainer = document.getElementById('mapContainer');
      if (!mapContainer) return;
      
      mapContainer.innerHTML = '';
      
      map = L.map('mapContainer', {
        zoomControl: true,
        scrollWheelZoom: false
      });
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      markersGroup = L.layerGroup().addTo(map);
      
      map.on('popupclose', () => {
        if (lastFocus) {
          lastFocus.focus();
          lastFocus = null;
        }
      });
      
      map.on('popupopen', (e) => {
        const popupNode = e.popup.getElement();
        if (popupNode) {
          const link = popupNode.querySelector('a');
          if (link) {
            link.focus({ preventScroll: true });
          }
        }
      });
      
      applyFilters();
      
      const bounds = [];
      markersGroup.eachLayer(m => bounds.push(m.getLatLng()));
      if (bounds.length > 0) {
        map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30] });
      }
      
    } catch (err) {
      // Leaflet failed to load or was blocked. 
      // The page falls back gracefully to list-only mode.
    }
  }

  initMap();
  applyFilters();
});

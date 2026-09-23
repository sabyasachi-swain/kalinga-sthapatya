// scripts/build/pages/map.mjs
import { page } from '../lib/layout.mjs';
import { escapeHtml } from '../lib/html.mjs';

export function renderMap(ctx) {
  const temples = ctx.data.temples.temples;
  
  const erasMap = new Map();
  ctx.data.timeline.eras.forEach(e => erasMap.set(e.id, e.label));
  
  const types = [...new Set(temples.map(t => t.temple_type))].filter(Boolean).sort();
  
  const years = temples.map(t => t.sort_year).filter(y => y != null);
  const minYear = years.length ? Math.min(...years) : 0;
  const maxYear = years.length ? Math.max(...years) : 2000;
  
  const clientData = temples.map(t => {
    const eraLabel = erasMap.get(t.era_id) || 'Unknown Era';
    let silhouettePath = '';
    if (t.media && t.media.silhouette) {
      const asset = ctx.data.mediaById.get(t.media.silhouette);
      if (asset) silhouettePath = ctx.assetRel + asset.path;
    }
    
    return {
      id: t.id,
      name: t.name,
      type: t.temple_type,
      eraId: t.era_id,
      eraLabel: eraLabel,
      year: t.sort_year,
      lat: t.location.lat,
      lng: t.location.lng,
      place: t.location.place,
      district: t.location.district,
      url: ctx.rel + t.page,
      silhouette: silhouettePath
    };
  });
  
  const html = `
    <main class="map-page">
      <header class="map-header">
        <h1>Map of the Temples</h1>
        <p>Explore the architectural heritage of Odisha by location, era, and style. Use the filters to discover how temple building spread and evolved over the centuries.</p>
      </header>
      
      <div class="map-layout">
        <aside class="map-sidebar">
          <form class="map-filters" id="mapFilters" aria-label="Filter temples">
            <div class="filter-group">
              <label for="filterType">Temple Style</label>
              <select id="filterType" name="type">
                <option value="">All Styles</option>
                ${types.map(type => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('')}
              </select>
            </div>
            
            <div class="filter-group">
              <label for="filterEra">Era</label>
              <select id="filterEra" name="era">
                <option value="">All Eras</option>
                ${ctx.data.timeline.eras.map(e => `<option value="${escapeHtml(e.id)}">${escapeHtml(e.label)}</option>`).join('')}
              </select>
            </div>
            
            <div class="filter-group">
              <label for="filterYear">Time Machine (built before)</label>
              <div class="range-control">
                <input type="range" id="filterYear" name="year" min="${minYear}" max="${maxYear}" value="${maxYear}" aria-valuetext="c. ${maxYear} CE">
                <output id="yearOutput" for="filterYear">c. ${maxYear} CE</output>
              </div>
            </div>
          </form>
          
          <div class="map-list-container" role="region" aria-label="List of temples" tabindex="0">
            <ul class="map-list" id="mapList">
              ${clientData.map(t => `
                <li class="map-list-item" data-id="${escapeHtml(t.id)}">
                  <h3><a href="${escapeHtml(t.url)}">${escapeHtml(t.name)}</a></h3>
                  <p class="map-list-meta">${escapeHtml(t.place)}, ${escapeHtml(t.district)} &bull; ${escapeHtml(t.eraLabel)}</p>
                  <button type="button" class="map-list-btn js-only" data-show="${escapeHtml(t.id)}">Show on map</button>
                </li>
              `).join('')}
            </ul>
          </div>
        </aside>
        
        <section class="map-view" aria-label="Interactive map">
          <div id="mapContainer" class="map-container">
            <p class="map-noscript">The interactive map requires JavaScript. Please use the list to browse the temples.</p>
          </div>
        </section>
      </div>
    </main>
    
    <script type="application/json" id="mapData">
      ${JSON.stringify(clientData).replace(/</g, '\\u003c')}
    </script>
  `;
  
  const headExtra = `<link rel="stylesheet" href="${ctx.assetRel}css/pages/map.css">`;
  
  return page(ctx, {
    title: 'Map of the Temples - Kalinga Sthapatya',
    description: 'Explore the temple architecture of Odisha on an interactive map.',
    headExtra,
    bodyHtml: html,
    scripts: [
      `<script type="module" src="${ctx.assetRel}js/map.js"></script>`
    ]
  });
}

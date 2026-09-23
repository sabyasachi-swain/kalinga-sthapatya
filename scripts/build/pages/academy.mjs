// scripts/build/pages/academy.mjs
import { page } from '../lib/layout.mjs';
import { claim, unverified, figure, section, sourcesList } from '../lib/components.mjs';
import { escapeHtml } from '../lib/html.mjs';

// Several elements carry a plain_name identical to their name (e.g. "Bada"/"Bada"), which rendered
// as "Bada (Bada)". Only show the gloss when it actually tells the reader something new.
function glossDiffers(name, plainName) {
  if (!plainName) return false;
  return String(plainName).trim().toLowerCase() !== String(name || '').trim().toLowerCase();
}

export function renderAcademy(ctx) {
  // Each data file is an object with its own collection key: elements.json is { elements: [] },
  // temples.json is { temples: [] }, and so on.
  const { academy, media } = ctx.data;
  const elements = ctx.data.elements.elements || [];
  const temples = ctx.data.temples.temples || [];
  
  // Section A: The three temple types
  const hasTempleTypes = academy.temple_types && academy.temple_types.length > 0;
  let sectionA = '';
  if (!hasTempleTypes) {
    sectionA = `<p class="quiet-note">Still being written</p>`;
  } else {
    const typesHtml = academy.temple_types.map(t => {
      let examplesHtml = '';
      if (t.examples && t.examples.length > 0) {
        const exampleLinks = t.examples.map(exId => {
          const temple = temples.find(x => x.id === exId);
          if (!temple) return '';
          return `<a href="${escapeHtml(ctx.rel + temple.page)}">${escapeHtml(temple.name)}</a>`;
        }).filter(Boolean);
        
        if (exampleLinks.length > 0) {
          examplesHtml = `<div class="academy-type-examples"><strong>Examples:</strong> ${exampleLinks.join(', ')}</div>`;
        }
      }
      
      return `
        <div class="academy-type-card" id="type-${escapeHtml(t.id)}">
          ${t.media ? figure(t.media, ctx, { className: 'academy-type-fig' }) : ''}
          <div class="academy-type-content">
            <h3>${escapeHtml(t.name)}</h3>
            ${glossDiffers(t.name, t.plain_name) ? `<p class="academy-type-plain">(${escapeHtml(t.plain_name)})</p>` : ''}
            <div class="academy-claims">
              <div class="claim-row"><span class="claim-label">Roof:</span> ${t.roof ? claim(t.roof, ctx, {}) : unverified(ctx)}</div>
              <div class="claim-row"><span class="claim-label">Use:</span> ${t.use ? claim(t.use, ctx, {}) : unverified(ctx)}</div>
              <div class="claim-row"><span class="claim-label">Deity:</span> ${t.deity ? claim(t.deity, ctx, {}) : unverified(ctx)}</div>
            </div>
            ${examplesHtml}
          </div>
        </div>
      `;
    }).join('');
    sectionA = `<div class="academy-types-grid">${typesHtml}</div>`;
  }

  // Section B: Anatomy of a temple
  const elementsListHtml = `
    <ul class="anatomy-list">
      ${(elements || []).map(el => {
        const templeLinks = (el.temple_ids || []).map(tId => {
          const temple = temples.find(x => x.id === tId);
          return temple ? `<a href="${escapeHtml(ctx.rel + temple.page)}">${escapeHtml(temple.name)}</a>` : '';
        }).filter(Boolean);
        
        return `
          <li class="anatomy-list-item" id="el-${escapeHtml(el.id)}">
            <h3>${escapeHtml(el.name)}${glossDiffers(el.name, el.plain_name) ? ` <span class="plain-name">(${escapeHtml(el.plain_name)})</span>` : ''}</h3>
            <div class="anatomy-claims">
              <div class="claim-row"><span class="claim-label">What:</span> ${el.what ? claim(el.what, ctx, {}) : unverified(ctx)}</div>
              <div class="claim-row"><span class="claim-label">Why:</span> ${el.why ? claim(el.why, ctx, {}) : unverified(ctx)}</div>
            </div>
            ${templeLinks.length > 0 ? `<div class="anatomy-examples"><strong>Found at:</strong> ${templeLinks.join(', ')}</div>` : ''}
          </li>
        `;
      }).join('')}
    </ul>
  `;

  // Find the anatomy diagram dynamically by locating the first media asset carrying hotspots
  // media.json is { assets: [] }; an asset carries hotspots as percentages of the image.
  let anatomyAsset = null;
  const mediaAssets = (media && media.assets) || [];
  anatomyAsset = mediaAssets.find(m => m.status === 'approved' && m.hotspots && m.hotspots.length > 0) || null;

  let explodedViewHtml = '';
  if (anatomyAsset && anatomyAsset.hotspots && anatomyAsset.hotspots.length > 0) {
    const hotspotsHtml = anatomyAsset.hotspots.map(h => {
      const el = elements.find(e => e.id === h.element_id);
      if (!el) return '';
      // Plot using percentages strictly 
      const style = `left: ${h.x}%; top: ${h.y}%; width: ${h.w}%; height: ${h.h}%;`;
      return `<button type="button" class="hotspot-btn js-hotspot js-only" style="${style}" data-element-id="${escapeHtml(el.id)}" aria-label="${escapeHtml(el.name)}"></button>`;
    }).join('');
    
    explodedViewHtml = `
      <div class="anatomy-diagram-container">
        ${figure(anatomyAsset.id, ctx, { className: 'anatomy-diagram-fig' })}
        <div class="anatomy-hotspots">
          ${hotspotsHtml}
        </div>
        <aside class="anatomy-panel js-anatomy-panel" role="dialog" aria-modal="false" hidden>
          <button type="button" class="anatomy-panel-close" aria-label="Close panel">
            <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </button>
          <div class="anatomy-panel-content"></div>
        </aside>
      </div>
    `;
  }

  const sectionB = `
    <div class="anatomy-section">
      ${explodedViewHtml}
      <div class="anatomy-list-container">
        ${elementsListHtml}
      </div>
    </div>
  `;

  // Section C: Why this shape?
  const hasWhy = academy.why_questions && academy.why_questions.length > 0;
  let sectionC = '';
  if (!hasWhy) {
    sectionC = `<p class="quiet-note">Still being written</p>`;
  } else {
    sectionC = `<div class="why-questions">` + academy.why_questions.map(q => `
      <details class="why-question-details">
        <summary class="why-question-summary"><h3>${escapeHtml(q.question)}</h3></summary>
        <div class="why-question-answer">
          ${q.media ? figure(q.media, ctx, { className: 'why-question-fig' }) : ''}
          ${q.answer ? claim(q.answer, ctx, {}) : unverified(ctx)}
        </div>
      </details>
    `).join('') + `</div>`;
  }

  // Section D: How was it built?
  const hasSteps = academy.builder_steps && academy.builder_steps.length > 0;
  let sectionD = '';
  if (!hasSteps) {
    sectionD = `<p class="quiet-note">Still being written</p>`;
  } else {
    const stepsHtml = academy.builder_steps.map((step, idx) => `
      <div class="builder-step ${idx === 0 ? 'is-active' : ''}" data-step="${idx}">
        <div class="builder-step-header">
          <span class="step-number">Step ${escapeHtml(step.n || (idx + 1))}</span>
          <h3>${escapeHtml(step.title)}</h3>
        </div>
        <div class="builder-step-content">
          ${step.media ? figure(step.media, ctx, { className: 'builder-step-fig' }) : ''}
          <div class="builder-step-what">
            ${step.what ? claim(step.what, ctx, {}) : unverified(ctx)}
          </div>
        </div>
      </div>
    `).join('');
    
    const controlsHtml = `
      <div class="builder-controls js-only">
        <button type="button" class="builder-next-btn" id="builderNextBtn">Next step</button>
        <div class="builder-progress" id="builderProgress">1 / ${academy.builder_steps.length}</div>
      </div>
    `;
    
    sectionD = `
      <div class="builder-steps-container">
        ${stepsHtml}
      </div>
      ${controlsHtml}
    `;
  }

  const appendixHtml = sourcesList(ctx, { legend: true });

  const navLinks = [];
  if (hasTempleTypes) navLinks.push({ id: 'temple-types', label: 'The three temple types' });
  navLinks.push({ id: 'anatomy', label: 'Anatomy of a temple' });
  if (hasWhy) navLinks.push({ id: 'why-shape', label: 'Why this shape?' });
  if (hasSteps) navLinks.push({ id: 'how-built', label: 'How was it built?' });
  
  const inPageNavHtml = `
    <nav class="in-page-nav" aria-label="Table of contents">
      <ul class="in-page-nav-list js-scrollspy">
        ${navLinks.map(link => `
          <li><a href="#${link.id}" class="in-page-nav-link">${escapeHtml(link.label)}</a></li>
        `).join('')}
      </ul>
    </nav>
  `;

  // While the academy data is still being written there is only one content section, so a
  // table-of-contents rail would be a single link sitting beside an empty 250px column. Drop the
  // rail (and its grid track) until there is something to navigate between.
  const showInPageNav = navLinks.length > 1;

  let bodyHtml = `
    <main class="academy-page">
      <header class="academy-header">
        <h1>Architecture Academy</h1>
        <p>Learn the vocabulary of Kalinga architecture, the structural logic behind its forms, and the methods used by ancient builders.</p>
      </header>
      
      <div class="academy-layout${showInPageNav ? '' : ' academy-layout--single'}">
        ${showInPageNav ? `<aside class="academy-sidebar">
          ${inPageNavHtml}
        </aside>` : ''}

        <div class="academy-content js-sections-container">
          ${hasTempleTypes ? section({ id: 'temple-types', className: 'academy-section', heading: 'The three temple types', body: sectionA }) : ''}
          ${section({ id: 'anatomy', className: 'academy-section', heading: 'Anatomy of a temple', body: sectionB })}
          ${hasWhy ? section({ id: 'why-shape', className: 'academy-section', heading: 'Why this shape?', body: sectionC }) : ''}
          ${hasSteps ? section({ id: 'how-built', className: 'academy-section', heading: 'How was it built?', body: sectionD }) : ''}
          ${section({ id: 'sources', className: 'academy-section', heading: 'Sources', body: appendixHtml })}
        </div>
      </div>
    </main>
  `;

  return page(ctx, {
    title: 'Architecture Academy - Kalinga Sthapatya',
    description: 'Learn the vocabulary, forms, and construction methods of Kalinga temple architecture.',
    headExtra: `<link rel="stylesheet" href="${ctx.assetRel}css/pages/academy.css">`,
    bodyHtml,
    scripts: ["js/academy.js"]
  });
}

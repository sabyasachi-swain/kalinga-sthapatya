// scripts/qa-probe.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

// Parse Arguments
const args = process.argv.slice(2);
let port = 8080;
// 768 and 1024 are part of the default sweep: a nav that only fits above ~881px overflowed on every
// page at exactly 768px and went unnoticed while this defaulted to 1440 and 375 alone.
let widths = [375, 768, 1024, 1440];
let pages = [];
let jsonOutput = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--help') {
    console.log(`Usage: node scripts/qa-probe.mjs [options]
Options:
  --port <port>       Port to run static server (default: 8080)
  --widths <w1,w2>    Comma-separated widths to test (default: 375,768,1024,1440)
  --pages <p1,p2>     Comma-separated HTML pages to test (default: all .html)
  --json              Print JSON instead of human-readable report
  --help              Show this help`);
    process.exit(0);
  } else if (args[i] === '--port') {
    port = parseInt(args[++i], 10);
  } else if (args[i] === '--widths') {
    widths = args[++i].split(',').map(Number);
  } else if (args[i] === '--pages') {
    pages = args[++i].split(',');
  } else if (args[i] === '--json') {
    jsonOutput = true;
  }
}

const rootDir = process.cwd();

// Find default pages if omitted
if (pages.length === 0) {
  try {
    const rootFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
    let templeFiles = [];
    const templesDir = path.join(rootDir, 'temples');
    if (fs.existsSync(templesDir)) {
      templeFiles = fs.readdirSync(templesDir)
        .filter(f => f.endsWith('.html'))
        .map(f => 'temples/' + f);
    }
    pages = [...rootFiles, ...templeFiles];
  } catch (e) {
    console.error('Error finding default HTML pages:', e.message);
    process.exit(1);
  }
}

// Locate Headless Chrome
function getChromePath() {
  const paths = [
    process.env.CHROME,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];
  for (const p of paths) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

const chromePath = getChromePath();
if (!chromePath) {
  console.error('Chrome not found. Please set the CHROME environment variable.');
  process.exit(1);
}

// HTTP Server
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  
  if (urlPath.includes('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  const ext = path.extname(urlPath);
  const filePath = path.join(rootDir, urlPath);
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

let tempFiles = [];
function cleanup() {
  for (const f of tempFiles) {
    try { fs.unlinkSync(f); } catch (e) {}
  }
  try { server.close(); } catch (e) {}
}

process.on('SIGINT', () => { cleanup(); process.exit(1); });
process.on('SIGTERM', () => { cleanup(); process.exit(1); });
process.on('uncaughtException', (err) => { 
  console.error(err);
  cleanup(); 
  process.exit(1); 
});

// Measurement Logic for iframe
const measurementsScript = `
  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  const results = { a: [], b: [], c: [], d: [], e: [], eInline: [], f: [], g: [] };

  function getPath(el) {
    if (!el || !el.tagName) return '';
    let p = el.tagName.toLowerCase();
    if (el.id) p += '#' + el.id;
    if (el.className && typeof el.className === 'string') p += '.' + el.className.trim().split(/\\s+/).join('.');
    return p;
  }

  // Is this element actually painted? A non-zero rect is not enough. Content inside a CLOSED
  // <details> that is itself nested in another closed <details> still gets a full layout box,
  // because Chrome hides it with content-visibility rather than display:none — so it measures as
  // visible, overlaps whatever now occupies those coordinates, and produced phantom "summary
  // intersects ..." findings on the temple pages. checkVisibility() accounts for that.
  function isPainted(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    if (typeof el.checkVisibility === 'function') {
      return el.checkVisibility({
        checkVisibilityCSS: true,
        contentVisibilityAuto: true,
        opacityProperty: true,
        visibilityProperty: true
      });
    }
    const st = win.getComputedStyle(el);
    return st.display !== 'none' && st.visibility !== 'hidden' && st.opacity !== '0';
  }

  // Content inside a scrolling or hidden container keeps its full, unclipped geometry in
  // getBoundingClientRect() even once it has been scrolled out of sight. The map page's temple list
  // is capped at 600px with overflow-y:auto, so its lower items reported coordinates far below the
  // list — on top of the map and its zoom buttons — and looked like overlaps that no reader can
  // ever see. Category B already guarded against clipping ancestors; C did not.
  // Returns the part of the element that is actually on screen, after every scrolling/hidden
  // ancestor has cut it down — or null when nothing of it survives. Comparing these instead of the
  // raw rects is what keeps a half-scrolled list item from "overlapping" whatever sits below its
  // container.
  function visibleRect(el) {
    const r = el.getBoundingClientRect();
    let top = r.top, bottom = r.bottom, left = r.left, right = r.right;
    for (let a = el.parentElement; a && a !== doc.body; a = a.parentElement) {
      const st = win.getComputedStyle(a);
      if (st.overflow === 'visible' && st.overflowX === 'visible' && st.overflowY === 'visible') continue;
      const ar = a.getBoundingClientRect();
      if (ar.width === 0 || ar.height === 0) continue;
      top = Math.max(top, ar.top);
      bottom = Math.min(bottom, ar.bottom);
      left = Math.max(left, ar.left);
      right = Math.min(right, ar.right);
    }
    if (bottom - top < 1 || right - left < 1) return null;
    return { top, bottom, left, right, width: right - left, height: bottom - top };
  }

  // An inline link sitting inside a sentence is exempt from the target-size rule
  // (WCAG 2.2 SC 2.5.8 "Target Size (Minimum)"), and the 44px figure is SC 2.5.5 at level AAA.
  // These are reported separately from standalone controls so a few real findings are not buried
  // under a thousand citation markers.
  function isInlineInProse(el) {
    if (el.tagName !== 'A') return false;
    // A citation marker is an inline superscript inside a sentence. css/style.css documents why it
    // deliberately grows its hit area with padding rather than taking a 44x44 box: that box
    // overflows the line and pushes "[1,2]" onto its own line.
    if (el.closest('.citation')) return true;
    // Leaflet renders its own attribution line ("Leaflet | © OpenStreetMap contributors") as small
    // print with inline links. It is third-party markup and the links sit inside that sentence.
    if (el.closest('.leaflet-control-attribution')) return true;
    const p = el.parentElement;
    if (!p) return false;
    if (!/^(P|LI|SPAN|SUP|DD|DT|FIGCAPTION|H1|H2|H3|H4|EM|STRONG|TD|BLOCKQUOTE)$/.test(p.tagName)) return false;
    return p.textContent.trim().length > el.textContent.trim().length + 3;
  }

  // a. Horizontal overflow
  if (doc.documentElement.scrollWidth > doc.documentElement.clientWidth) {
    const all = doc.querySelectorAll('*');
    for (const el of all) {
      if (el.scrollWidth > doc.documentElement.clientWidth) {
        results.a.push(getPath(el));
      }
    }
  }

  // b. Media extending beyond container
  const mediaEls = doc.querySelectorAll('img, svg, video, figure');
  for (const el of mediaEls) {
    const container = el.closest('figure, .card, section, main');
    if (container && container !== el) {
      // A hidden element has a 0x0 rect at the origin, which would otherwise look like it sits
      // far outside its container. Only measure what is actually painted.
      if (!isPainted(el)) continue;
      const eR = el.getBoundingClientRect();
      const cR = container.getBoundingClientRect();
      // Anything inside a clipping ancestor (a map's tile pane, a carousel track) is cut off by
      // that box, so it cannot visually escape its container.
      let clipped = false;
      for (let a = el.parentElement; a && a !== container; a = a.parentElement) {
        const ov = win.getComputedStyle(a);
        if (ov.overflow !== 'visible' || ov.overflowX !== 'visible' || ov.overflowY !== 'visible') { clipped = true; break; }
      }
      if (clipped) continue;
      if (eR.left < cR.left - 1 || eR.right > cR.right + 1 || eR.top < cR.top - 1 || eR.bottom > cR.bottom + 1) {
        results.b.push(getPath(el) + ' out of ' + getPath(container));
      }
    }
  }

  // c. Intersecting text elements
  const textEls = Array.from(doc.querySelectorAll('p, h1, h2, h3, h4, li, dt, dd, figcaption, .badge, .citation, a, summary'));
  const clipped = new Map();
  const visible = textEls.filter(el => {
    if (!isPainted(el)) return false;
    const vr = visibleRect(el);
    if (!vr) return false;
    clipped.set(el, vr);
    // A sticky or fixed bar is meant to pass over other content; so is anything inside one.
    if (el.closest('.journey-rail, .site-nav, nav[class*="rail"], header')) return false;
    for (let a = el; a; a = a.parentElement) {
      const p = win.getComputedStyle(a).position;
      if (p === 'sticky' || p === 'fixed') return false;
    }
    return true;
  });

  // Touching edges (a list of adjacent items) is not an overlap: require a real 2px overlap area.
  const OVL = 2;
  function int(r1, r2) { return !(r2.left > r1.right - OVL || r2.right < r1.left + OVL || r2.top > r1.bottom - OVL || r2.bottom < r1.top + OVL); }
  function cont(r1, r2) { return r1.left <= r2.left && r1.right >= r2.right && r1.top <= r2.top && r1.bottom >= r2.bottom; }

  for (let i = 0; i < visible.length; i++) {
    for (let j = i + 1; j < visible.length; j++) {
      const el1 = visible[i];
      const el2 = visible[j];
      if (el1.contains(el2) || el2.contains(el1)) continue;
      
      const d1 = el1.closest('details');
      const d2 = el2.closest('details');
      if (d1 && !d1.open && el1.tagName.toLowerCase() !== 'summary') continue;
      if (d2 && !d2.open && el2.tagName.toLowerCase() !== 'summary') continue;

      const r1 = clipped.get(el1);
      const r2 = clipped.get(el2);
      if (int(r1, r2) && !cont(r1, r2) && !cont(r2, r1)) {
        results.c.push(getPath(el1) + ' intersects ' + getPath(el2));
      }
    }
  }

  // d. Text < 14px, f. Text nodes with undefined/null/NaN
  const allText = [];
  const walk = doc.createTreeWalker(doc.body, 4, null, false);
  let n;
  while (n = walk.nextNode()) {
    // Script and style contents are code, not reader-visible text: JSON legitimately contains
    // null, and CSS/JS is never rendered.
    if (n.parentElement && n.parentElement.closest('script, style, template')) continue;
    if (n.nodeValue.trim()) allText.push(n);
  }
  
  const smallText = new Set();
  for (const node of allText) {
    const el = node.parentElement;
    // Visually-hidden text (.sr-only) exists only for screen readers, so its rendered font size
    // is irrelevant — it is never read with the eyes.
    if (el && isPainted(el) && !el.closest('.sr-only, .visually-hidden')) {
      const style = win.getComputedStyle(el);
      const size = parseFloat(style.fontSize);
      if (size < 14) smallText.add(getPath(el) + ' (' + size + 'px)');
    }
    const val = node.nodeValue;
    if (/\\b(undefined|null|NaN)\\b/.test(val)) {
      results.f.push(getPath(node.parentElement) + ' contains "' + val.trim().substring(0,20) + '"');
    }
  }
  results.d = Array.from(smallText);

  // e. Interactive targets < 44x44px (standalone controls; inline prose links go to eInline)
  const interact = doc.querySelectorAll('a, button, input, select, textarea, details summary');
  for (const el of interact) {
    if (!isPainted(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 43.5 || r.height < 43.5) {
      const entry = getPath(el) + ' (' + r.width.toFixed(1) + 'x' + r.height.toFixed(1) + ')';
      if (isInlineInProse(el)) results.eInline.push(entry);
      else results.e.push(entry);
    }
  }

  // g. Images failed to load
  const imgs = doc.querySelectorAll('img');
  for (const img of imgs) {
    if (img.complete && img.naturalWidth === 0) {
      results.g.push(img.src);
    }
  }
`;

const wrapperHTML = (pagePath, width) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;overflow:hidden;">
  <iframe src="/${pagePath}" width="${width}" height="1024" id="frame" style="border:none;"></iframe>
  <pre id="probe-result" style="display:none;"></pre>
  <script>
    const frame = document.getElementById('frame');
    frame.onload = () => {
      try {
        ${measurementsScript}
        const jsonStr = JSON.stringify(results);
        const textEncoder = new TextEncoder();
        const bytes = textEncoder.encode(jsonStr);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        document.getElementById('probe-result').textContent = btoa(binary);
      } catch(e) {
        document.getElementById('probe-result').textContent = "ERROR:" + e.message;
      }
    };
  </script>
</body>
</html>
`;

// Start Testing Runner
server.listen(port, async () => {
  let hasFaults = false;
  const fullReport = {};
  
  const qaDir = path.join(rootDir, 'qa');
  if (!fs.existsSync(qaDir)) fs.mkdirSync(qaDir);
  
  for (const page of pages) {
    fullReport[page] = {};
    for (const width of widths) {
      const wrapperPath = path.join(qaDir, `tmp-wrapper-${Date.now()}-${Math.floor(Math.random()*1000)}.html`);
      tempFiles.push(wrapperPath);
      fs.writeFileSync(wrapperPath, wrapperHTML(page, width));
      
      const url = `http://localhost:${port}/qa/${path.basename(wrapperPath)}`;
      
      try {
        const { stdout } = await execFileAsync(chromePath, [
          '--headless=new',
          '--dump-dom',
          '--virtual-time-budget=4000',
          '--disable-gpu',
          url
        ], { maxBuffer: 10 * 1024 * 1024 });
        
        const match = stdout.match(/<pre id="probe-result"[^>]*>([\s\S]*?)<\/pre>/);
        let res = {};
        if (match && match[1]) {
          const raw = match[1].trim();
          if (raw.startsWith('ERROR:')) {
            res = { error: raw };
          } else {
            res = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
          }
        } else {
          res = { error: 'No result found in DOM dump' };
        }
        
        fullReport[page][width] = res;
        
        if (res.a?.length || res.b?.length || res.f?.length || res.g?.length) {
          hasFaults = true;
        }
      } catch (err) {
        fullReport[page][width] = { error: err.message };
      }
      
      fs.unlinkSync(wrapperPath);
      tempFiles = tempFiles.filter(f => f !== wrapperPath);
    }
  }
  
  const date = new Date();
  const dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  const jsonPath = path.join(qaDir, `probe-${dateStr}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(fullReport, null, 2));
  
  if (jsonOutput) {
    console.log(JSON.stringify(fullReport, null, 2));
  } else {
    for (const page of pages) {
      console.log(`\n=== Page: ${page} ===`);
      for (const width of widths) {
        console.log(`  Width: ${width}px`);
        const res = fullReport[page][width];
        if (res.error) {
          console.log(`    Error: ${res.error}`);
          continue;
        }
        
        const categories = {
          a: 'Horizontal overflow',
          b: 'Media extending beyond container',
          c: 'Intersecting text elements',
          d: 'Text < 14px',
          e: 'Standalone interactive targets < 44x44px',
          eInline: 'Inline prose links < 44px (exempt: WCAG 2.2 SC 2.5.8) — informational',
          f: 'Text nodes containing undefined/null/NaN',
          g: 'Images failed to load'
        };
        
        let anyFound = false;
        for (const [key, label] of Object.entries(categories)) {
          if (res[key] && res[key].length > 0) {
            // The inline-link list runs to hundreds of citation markers per page and none of them
            // is actionable, so report only how many there were.
            if (key === 'eInline') {
              console.log(`    [note] ${res[key].length} ${label}`);
              continue;
            }
            console.log(`    [${key.toUpperCase()}] ${label}:`);
            res[key].forEach(item => console.log(`      - ${item}`));
            anyFound = true;
          }
        }
        if (!anyFound) console.log('    No issues found.');
      }
    }
    console.log(`\nFull report written to ${jsonPath}`);
  }
  
  cleanup();
  process.exit(hasFaults ? 1 : 0);
});

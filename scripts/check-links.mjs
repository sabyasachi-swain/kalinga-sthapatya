// scripts/check-links.mjs
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
let jsonOutput = false;
for (const arg of args) {
  if (arg === '--help') {
    console.log(`Usage: node scripts/check-links.mjs [--json] [--help]`);
    process.exit(0);
  } else if (arg === '--json') {
    jsonOutput = true;
  }
}

const rootDir = process.cwd();

// Find HTML pages
const rootFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
const templesDir = path.join(rootDir, 'temples');
let templeFiles = [];
if (fs.existsSync(templesDir)) {
  templeFiles = fs.readdirSync(templesDir)
    .filter(f => f.endsWith('.html'))
    .map(f => 'temples/' + f);
}
const pages = [...rootFiles, ...templeFiles];

const fileContents = new Map();
const fileIds = new Map();
const findings = {};
const externalLinks = {};

function addFinding(file, message) {
  if (!findings[file]) findings[file] = [];
  findings[file].push(message);
}

function addExternal(file, url) {
  if (!externalLinks[file]) externalLinks[file] = [];
  externalLinks[file].push(url);
}

function getAttrs(attrStr) {
  const attrs = {};
  const attrRegex = /([a-z0-9\-]+)(?:\s*=\s*(?:(['"])(.*?)\2|([^\s>]+)))?/gi;
  for (const m of attrStr.matchAll(attrRegex)) {
    attrs[m[1].toLowerCase()] = m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : true);
  }
  return attrs;
}

// Pass 1: Read files, clean content, extract IDs and check for duplicates / multiple H1s
for (const page of pages) {
  const rawContent = fs.readFileSync(path.join(rootDir, page), 'utf8');
  // Strip content of script/style tags and HTML comments to avoid false positives in string literals
  const safeContent = rawContent
    .replace(/(<script\b[^>]*>)[\s\S]*?(<\/script>)/gi, '$1$2')
    .replace(/(<style\b[^>]*>)[\s\S]*?(<\/style>)/gi, '$1$2')
    .replace(/<!--[\s\S]*?-->/g, '');
  
  fileContents.set(page, safeContent);
  
  const ids = new Set();
  let h1Count = 0;
  
  for (const match of safeContent.matchAll(/<([a-z0-9-]+)([^>]*)>/gi)) {
    const tagName = match[1].toLowerCase();
    const attrs = getAttrs(match[2]);
    
    if (tagName === 'h1') h1Count++;
    
    if (attrs.id && typeof attrs.id === 'string') {
      if (ids.has(attrs.id)) {
        addFinding(page, `Duplicate id: #${attrs.id}`);
      }
      ids.add(attrs.id);
    }
  }
  
  if (h1Count > 1) {
    addFinding(page, `Multiple <h1> tags found (${h1Count})`);
  }
  
  fileIds.set(page, ids);
}

// Pass 2: Check links and media attributes
for (const page of pages) {
  const safeContent = fileContents.get(page);
  
  for (const match of safeContent.matchAll(/<([a-z0-9-]+)([^>]*)>/gi)) {
    const tagName = match[1].toLowerCase();
    const attrs = getAttrs(match[2]);
    
    if (tagName === 'img' || tagName === 'video') {
      if (!attrs.width || !attrs.height) {
        addFinding(page, `<${tagName}> missing width or height`);
      }
      if (tagName === 'img') {
        const hasAlt = typeof attrs.alt === 'string' && attrs.alt.trim() !== '';
        const hidden = attrs['aria-hidden'] === 'true' || attrs.role === 'presentation';
        if (!hasAlt && !hidden) {
          addFinding(page, `<img> missing non-empty alt without aria-hidden="true" or role="presentation"`);
        }
      }
    }
    
    const urls = [];
    if (typeof attrs.href === 'string') urls.push(attrs.href);
    if (typeof attrs.src === 'string') urls.push(attrs.src);
    
    for (const url of urls) {
      const skipSchemes = ['data:', 'mailto:', 'tel:', 'javascript:'];
      if (skipSchemes.some(s => url.toLowerCase().startsWith(s))) continue;
      
      if (url.startsWith('http://') || url.startsWith('https://')) {
        addExternal(page, url);
        if (url.startsWith('http://')) {
          addFinding(page, `Insecure external link: ${url}`);
        }
        continue;
      }
      
      if (url.startsWith('//')) {
        addFinding(page, `Protocol-relative URL: ${url}`);
        continue;
      }
      
      const hashIndex = url.indexOf('#');
      let pathAndQuery = url;
      let hash = undefined;
      
      if (hashIndex !== -1) {
        pathAndQuery = url.substring(0, hashIndex);
        hash = url.substring(hashIndex + 1);
      }
      
      const queryIndex = pathAndQuery.indexOf('?');
      let urlPath = pathAndQuery;
      if (queryIndex !== -1) {
        urlPath = pathAndQuery.substring(0, queryIndex);
      }
      
      let targetFile = page;
      
      if (url.startsWith('/')) {
        if (page !== '404.html') {
          addFinding(page, `Absolute internal URL starting with "/": ${url}`);
        }
        if (urlPath) {
          targetFile = urlPath.substring(1);
          const targetAbsPath = path.join(rootDir, targetFile);
          if (!fs.existsSync(targetAbsPath)) {
            addFinding(page, `Broken link: file not found "${urlPath}"`);
            continue;
          }
        }
      } else {
        if (urlPath) {
          const pageDir = path.posix.dirname(page);
          targetFile = path.posix.join(pageDir, urlPath);
          const targetAbsPath = path.join(rootDir, targetFile);
          if (!fs.existsSync(targetAbsPath)) {
            addFinding(page, `Broken link: file not found "${urlPath}" (resolved to ${targetFile})`);
            continue;
          }
        }
      }
      
      if (hash) {
        const targetIds = fileIds.get(targetFile);
        if (targetIds) {
          if (!targetIds.has(hash)) {
            addFinding(page, `Broken anchor: #${hash} not found in ${targetFile}`);
          }
        } else {
          if (targetFile.endsWith('.html')) {
            addFinding(page, `Broken anchor: #${hash} not found in ${targetFile} (or file not tracked)`);
          }
        }
      }
    }
  }
}

const hasFindings = Object.keys(findings).length > 0;

if (jsonOutput) {
  console.log(JSON.stringify({ findings, externalLinks }, null, 2));
} else {
  console.log('=== Kalinga Sthapatya Link & Media Checker ===\n');
  
  if (hasFindings) {
    console.log('🛑 FINDINGS:');
    for (const [file, fileFindings] of Object.entries(findings)) {
      console.log(`\n📄 ${file}`);
      for (const msg of fileFindings) {
        console.log(`  - ${msg}`);
      }
    }
  } else {
    console.log('✅ No layout, media, or link faults found!\n');
  }
  
  const extCount = Object.values(externalLinks).reduce((acc, arr) => acc + arr.length, 0);
  console.log(`\n🌍 External Links: ${extCount} found (run with --json to see all)`);
}

process.exit(hasFindings ? 1 : 0);

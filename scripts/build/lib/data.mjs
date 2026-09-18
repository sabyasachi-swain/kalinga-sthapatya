// Loads data/*.json (or a --data override / dev fixtures) with safe fallbacks.
// Never invents content: a missing/invalid file just yields the file's empty shape.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const EMPTY = {
  sources: { sources: [] },
  temples: { temples: [] },
  timeline: { eras: [] },
  glossary: { terms: [] },
  elements: { elements: [] },
  academy: { temple_types: [], why_questions: [], builder_steps: [] },
  media: { assets: [] },
};

function loadJson(file, fallback) {
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

export function loadData(dataDir) {
  const data = {};
  for (const name of Object.keys(EMPTY)) {
    data[name] = loadJson(join(dataDir, `${name}.json`), EMPTY[name]);
  }
  // Index sources and media by id for fast lookup by components.
  data.sourcesById = new Map((data.sources.sources || []).map((s) => [s.id, s]));
  data.mediaById = new Map((data.media.assets || []).map((m) => [m.id, m]));
  data.templesById = new Map((data.temples.temples || []).map((t) => [t.id, t]));
  data.elementsById = new Map((data.elements.elements || []).map((e) => [e.id, e]));
  return data;
}

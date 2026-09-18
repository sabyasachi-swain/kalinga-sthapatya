#!/usr/bin/env node
// PostToolUse (Write|Edit): when a data/ or research/staged/ JSON file changes, run the content
// validator and feed any errors back to the model so it fixes them before moving on.

import { spawnSync } from "node:child_process";
import { resolve, relative, isAbsolute } from "node:path";

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let input;
  try { input = JSON.parse(raw || "{}"); } catch { process.exit(0); }
  const target = input.tool_input?.file_path;
  if (!target) process.exit(0);

  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const abs = isAbsolute(target) ? target : resolve(root, target);
  const rel = relative(root, abs).replace(/\\/g, "/");
  const staged = /^research\/staged\/[^/]+\.json$/i.test(rel);
  if (!staged && !/^data\/[^/]+\.json$/i.test(rel)) process.exit(0);

  const validator = resolve(root, "scripts", "validate-content.mjs");
  const run = spawnSync(process.execPath, staged ? [validator, "--staged", abs] : [validator], { encoding: "utf8", cwd: root });
  if (run.status === 0) process.exit(0);

  const report = (run.stdout || run.stderr || "").slice(0, 6000);
  process.stdout.write(JSON.stringify({
    decision: "block",
    reason: `Content validator failed after editing ${rel}. Fix these before continuing:\n${report}`,
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: `Content validator FAILED for ${rel}:\n${report}\nDo not weaken the validator; fix the content or leave the field null.`,
    },
  }));
  process.exit(0);
});

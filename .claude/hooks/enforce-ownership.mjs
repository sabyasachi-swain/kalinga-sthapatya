#!/usr/bin/env node
// PreToolUse (Write|Edit|NotebookEdit): enforce per-subagent file ownership.
// Main thread (no agent_type) may write anywhere — the human supervises it.
// Kalinga subagents may write only inside their lanes; other subagents may not touch protected paths.
// Known limitation: Bash-based writes are not intercepted — agents with Bash are told not to write files through it.

import { relative, resolve, isAbsolute } from "node:path";

const OWNERSHIP = {
  "kalinga-researcher": [/^research\/ledgers\/[a-z0-9-]+\.json$/],
  "kalinga-fact-checker": [/^research\/verdicts\/[a-z0-9-]+\.(json|md)$/, /^research\/staged\/[a-z0-9-]+\.json$/],
  "kalinga-visual-brief-writer": [/^visual-briefs\/[A-Za-z0-9_-]+\.md$/, /^visual-briefs\/references\//],
  "kalinga-frontend-builder": [
    /^[a-z0-9-]+\.html$/, /^temples\/[a-z0-9-]+\.html$/, /^css\//, /^js\//, /^partials\//,
    /^dev\//, /^scripts\/build\.mjs$/, /^scripts\/build\//, /^sitemap\.xml$/, /^robots\.txt$/, /^README\.md$/,
  ],
  "kalinga-asset-integrator": [/^img\//, /^data\/media\.json$/, /^visual-briefs\/inbox\//, /^visual-briefs\/originals\//],
  "kalinga-qa-auditor": [/^qa\//],
};

// Never writable by any subagent, whatever its lane.
const PROTECTED = [
  /^\.claude\//, /^CLAUDE\.md$/, /^scripts\/validate-content\.mjs$/, /^scripts\/merge-staged\.mjs$/,
  /^implementation_plan\.md$/, /^EXECUTION_PLAN\.md$/, /^BUILD_STATUS\.md$/, /^Odisha Temple Archtecture research\.md$/,
  /^data\/(?!media\.json$)/, // content data changes only via scripts/merge-staged.mjs (main thread)
];

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let input;
  try { input = JSON.parse(raw || "{}"); } catch { process.exit(0); }
  const agent = input.agent_type;
  if (!agent) process.exit(0); // main thread

  const target = input.tool_input?.file_path || input.tool_input?.notebook_path;
  if (!target) process.exit(0);

  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const abs = isAbsolute(target) ? target : resolve(root, target);
  // Windows paths are case-insensitive (d:\ vs D:\): compare lowercased, match regexes with /i
  const win = process.platform === "win32";
  const rel = (win ? relative(root.toLowerCase(), abs.toLowerCase()) : relative(root, abs)).replace(/\\/g, "/");
  const test = (re) => (win ? new RegExp(re.source, "i") : re).test(rel);

  const deny = (reason) => {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason },
    }));
    process.exit(0);
  };

  if (rel.startsWith("..") || isAbsolute(rel)) {
    // outside the project: allow only the session scratchpad
    const scratch = input.scratchpad_dir;
    if (scratch && abs.toLowerCase().startsWith(resolve(scratch).toLowerCase())) process.exit(0);
    deny(`${agent} may not write outside the project (${target}).`);
  }
  if (PROTECTED.some(test))
    deny(`${rel} is protected. Only the orchestrator (main session) changes it; content data enters data/ only through scripts/merge-staged.mjs. Report what you need changed instead.`);

  const lanes = OWNERSHIP[agent];
  if (!lanes) process.exit(0); // non-Kalinga subagent: protected paths already enforced
  if (!lanes.some(test))
    deny(`${agent} does not own ${rel}. Its lanes: ${lanes.map((r) => r.source).join("  ")}. Report the needed change in your final message instead of writing it.`);
  process.exit(0);
});

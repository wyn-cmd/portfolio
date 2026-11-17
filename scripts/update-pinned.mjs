#!/usr/bin/env node
// Writes the repositories pinned on a GitHub profile to a small JSON file that the portfolio reads.
// Usage: node scripts/update-pinned.mjs [output-path]   (default: data/pinned.json)
// Needs the GitHub CLI (`gh`) to be authenticated: locally via `gh auth login`, in Actions via GH_TOKEN.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const login = process.env.PINNED_LOGIN || "wyn-cmd";
const out = process.argv[2] || "data/pinned.json";

const query = `query($login: String!) { user(login: $login) { pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { name } } } } }`;
const raw = execFileSync("gh", ["api", "graphql", "-f", `query=${query}`, "-F", `login=${login}`], { encoding: "utf8" });
const names = (JSON.parse(raw).data?.user?.pinnedItems?.nodes ?? []).map((n) => n && n.name).filter(Boolean);

if (names.length === 0) {
  // Never replace a good list with an empty one (an API hiccup, or a profile with nothing pinned).
  console.error("No pinned repositories returned; leaving the file unchanged.");
  process.exit(0);
}

const next = JSON.stringify({ pinned: names }, null, 2) + "\n";
if (fs.existsSync(out) && fs.readFileSync(out, "utf8") === next) {
  console.log("unchanged:", names.join(", "));
  process.exit(0);
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, next);
console.log("updated:", names.join(", "));

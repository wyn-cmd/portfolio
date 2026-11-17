#!/usr/bin/env node
// Fetches the contribution snake that the wyn-cmd/wyn-cmd profile workflow publishes and
// rewrites its palette to match the portfolio (light and dark), so the site shows live
// contribution data in its own colours. Usage: node scripts/update-snake.mjs [assets-dir]
import fs from "node:fs";
import path from "node:path";

const login = process.env.SNAKE_LOGIN || "wyn-cmd";
const dir = process.argv[2] || "assets";
const src = `https://raw.githubusercontent.com/${login}/${login}/output/github-contribution-grid-snake.svg`;

const PALETTES = {
  dark: { cb: "#ffffff0a", cs: "#f2f7ff", ce: "#121c31", c0: "#121c31", c1: "#14406b", c2: "#1d68ad", c3: "#3a9be8", c4: "#7cd0ff" },
  light: { cb: "#0f1b2d0a", cs: "#0f1b2d", ce: "#dbe5f2", c0: "#dbe5f2", c1: "#b5d6f6", c2: "#74b2ea", c3: "#2b7fd0", c4: "#0a559f" },
};

const res = await fetch(src);
if (!res.ok) { console.error("Could not fetch the snake (" + res.status + "); leaving files unchanged."); process.exit(0); }
const svg = await res.text();
if (!svg.startsWith("<svg") || !/:root\{[^}]*--c4:/.test(svg)) { console.error("Unexpected snake format; leaving files unchanged."); process.exit(0); }

fs.mkdirSync(dir, { recursive: true });
for (const [name, p] of Object.entries(PALETTES)) {
  const vars = Object.entries(p).map(([k, v]) => `--${k}:${v}`).join(";");
  const out = svg.replace(/:root\{[^}]*\}/, `:root{${vars}}`);
  const file = path.join(dir, `snake-${name}.svg`);
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== out) { fs.writeFileSync(file, out); console.log("updated:", file); }
  else console.log("unchanged:", file);
}

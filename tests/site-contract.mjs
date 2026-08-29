import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const config = JSON.parse(readFileSync("site/public/staticwebapp.config.json", "utf8"));

test("static deployment sends a restrictive CSP and a real 404 override", () => {
  const csp = config.globalHeaders["Content-Security-Policy"];
  assert.match(csp, /^default-src 'self';/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.doesNotMatch(csp, /unsafe-inline|https?:/);
  assert.deepEqual(config.responseOverrides["404"], { rewrite: "/404.html" });
  assert.equal(config.navigationFallback, undefined, "static routes must preserve real 404 responses");
  assert.ok(statSync("site/404.html").isFile());
});

test("all public pages ship canonical and social metadata", () => {
  for (const file of ["site/index.html", "site/demo/index.html", "site/privacy/index.html", "site/terms/index.html", "site/404.html"]) {
    const html = readFileSync(file, "utf8");
    assert.match(html, /rel="canonical"/);
    assert.match(html, /property="og:title"/);
    assert.match(html, /property="og:description"/);
    assert.match(html, /property="og:url"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /name="twitter:card"/);
    assert.match(html, /name="twitter:title"/);
    assert.match(html, /name="twitter:description"/);
    assert.match(html, /name="twitter:image"/);
    assert.match(html, /rel="apple-touch-icon"/);
  }
  assert.ok(statSync("site/public/assets/lineage-impact-card-social.webp").size > 0);
});

test("every registered public claim has exactly one tagged test", () => {
  const claims = JSON.parse(readFileSync(".factory/claims.json", "utf8"));
  const source = readFileSync("tests/site/site.spec.ts", "utf8");
  const ids = claims.map((claim) => claim.id);
  assert.equal(new Set(ids).size, ids.length, "claim ids must be unique");
  for (const claim of claims) {
    const tag = `@claim:${claim.id}`;
    assert.equal(source.split(tag).length - 1, 1, `${tag} must appear exactly once`);
    assert.match(claim.test, new RegExp(`--grep ${tag}$`));
  }
  const sourceTags = [...source.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
  assert.deepEqual(sourceTags.sort(), [...ids].sort(), "test tags and registry ids must match");
});

test("copy audit counts are accurate and catalog description is plain", () => {
  const audit = readFileSync(".factory/copy-audit.md", "utf8");
  for (const line of audit.split("\n")) {
    if (!line.startsWith("| ") || line.includes("---") || line.includes("Location") || line.includes("Concept")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length !== 4) continue;
    const actual = cells[1].split(/\s+/).filter(Boolean).length;
    assert.equal(actual, Number(cells[2]), `incorrect word count for ${cells[0]}`);
    assert.ok(actual <= 22, `${cells[0]} exceeds the 22-word cap`);
  }
  const description = readFileSync(".factory/catalog-description.txt", "utf8").trim();
  assert.ok(description.length <= 120);
  assert.match(description, /^Trace\b/);
});

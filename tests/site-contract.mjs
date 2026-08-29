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
  for (const file of ["site/index.html", "site/demo/index.html", "site/privacy/index.html", "site/terms/index.html"]) {
    const html = readFileSync(file, "utf8");
    assert.match(html, /rel="canonical"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /name="twitter:card"/);
    assert.match(html, /rel="apple-touch-icon"/);
  }
  assert.ok(statSync("site/public/assets/lineage-impact-card-social.webp").size > 0);
});

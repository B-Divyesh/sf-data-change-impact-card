import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("home is semantic, accessible, and free of runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await expect(page).toHaveTitle(/Data Change Impact Card/);
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "https://data-change-impact-card.sociobot.in/");
  await expect(page.locator("meta[property='og:image']")).toHaveAttribute("content", /lineage-impact-card-social/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("img")).toHaveAttribute("alt", /schema change/i);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  expect(errors).toEqual([]);
});

test("recorded sample details work with keyboard", async ({ page }) => {
  await page.goto("/#demo");
  const commandTab = page.getByRole("tab", { name: "Command" });
  await commandTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Manifest" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#demo-code")).toContainText("completeness: complete");

  await expect(page.getByRole("link", { name: "Try sample data" })).toHaveAttribute("href", "/demo/?demo=1");
});

test("390px layout does not scroll sideways", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile project only");
  await page.goto("/");
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  await expect(page.getByRole("link", { name: /Try it with sample data/ })).toHaveCSS("min-height", "52px");
});

test("@claim:offline-docs cached home and demo documents remain available offline", async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "desktop project only");
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await context.setOffline(true);
  await page.goto("/demo/?demo=1");
  await expect(page).toHaveTitle("Demo — Data Change Impact Card");
  await expect(page.getByRole("heading", { name: "Run sample lineage data." })).toBeVisible();
  await expect(page.getByText("Demo — sample data, nothing is saved.")).toBeVisible();
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("#offline-notice")).toBeVisible();
});

test("@claim:bundled-cli-demo runs the shipped sample and identifies its isolated state", async ({ page }) => {
  const output = execFileSync("cargo", ["run", "--quiet", "--", "demo"], { encoding: "utf8" });
  const impactPath = output.match(/^Impact card: (.+)$/m)?.[1];
  expect(impactPath).toBeTruthy();
  expect(readFileSync(impactPath!, "utf8")).toContain("**Disposition:** READY");
  expect(output).toContain("Result: 2 stale assets, 7 known minutes, 0 unknown edges.");
  await page.goto("/demo/?demo=1");
  await expect(page.getByRole("heading", { name: "Run sample lineage data." })).toBeVisible();
  await expect(page.getByText("Demo — sample data, nothing is saved.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Reset demo" })).toHaveAttribute("href", "/demo/?demo=1#sample");
  await expect(page.getByRole("link", { name: "Start for real" })).toHaveAttribute("href", "/");
  await expect(page.locator(".demo-command")).toContainText("dcic demo");
});

test("@claim:no-third-party-runtime-requests site sends only same-origin requests and stores no account data", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/demo/?demo=1");
  const expectedOrigin = new URL(page.url()).origin;
  expect(requests).not.toEqual([]);
  expect(requests.every((url) => new URL(url).origin === expectedOrigin)).toBe(true);
  expect(await page.evaluate(() => ({ cookie: document.cookie, local: localStorage.length, session: sessionStorage.length }))).toEqual({ cookie: "", local: 0, session: 0 });
});

test("@claim:core-impact-card reports stale assets, evidence, order, and cost", () => {
  const output = execFileSync(
    "cargo",
    ["run", "--quiet", "--", "analyze", "-m", "tests/fixtures/lineage.yaml", "-c", "tests/fixtures/changes.yaml", "--json"],
    { encoding: "utf8" },
  );
  const report = JSON.parse(output);
  expect(report.summary).toMatchObject({ stale_assets: 2, known_estimate_minutes: 7, disposition: "ready" });
  expect(report.impacted.map((item: { node: string }) => item.node)).toEqual(["clean.orders", "mart.revenue"]);
  expect(report.impacted[1].reasons[0].path).toEqual(["raw.orders", "clean.orders", "mart.revenue"]);
  expect(report.recompute_order.map((item: { node: string }) => item.node)).toEqual(["clean.orders", "mart.revenue"]);
  const noChange = JSON.parse(execFileSync("cargo", ["run", "--quiet", "--", "analyze", "-m", "tests/fixtures/lineage.yaml", "-c", "-", "--json"], { encoding: "utf8", input: "schema_version: 1\nchanges: []\n" }));
  expect(noChange).toMatchObject({ input_completeness: "complete", summary: { disposition: "no_impact", stale_assets: 0 } });
});

test("@claim:input-output-contract accepts structured inputs and produces JSON or redacted Markdown", () => {
  const directory = mkdtempSync(join(tmpdir(), "dcic-claim-"));
  try {
    const manifest = join(directory, "lineage.json");
    const changes = join(directory, "changes.json");
    writeFileSync(manifest, JSON.stringify({ schema_version: 1, completeness: "complete", nodes: [{ id: "raw.orders" }, { id: "mart.revenue", depends_on: ["raw.orders"] }] }));
    writeFileSync(changes, JSON.stringify({ schema_version: 1, changes: [{ node: "raw.orders", from: "v1", to: "v2", summary: "private note" }] }));
    const json = execFileSync("cargo", ["run", "--quiet", "--", "analyze", "-m", manifest, "-c", changes, "--json"], { encoding: "utf8" });
    expect(JSON.parse(json)).toMatchObject({ schema_version: 1, summary: { stale_assets: 1 } });
    const markdown = execFileSync("cargo", ["run", "--quiet", "--", "analyze", "-m", manifest, "-c", changes, "--redact"], { encoding: "utf8" });
    expect(markdown).toContain("NODE-001");
    expect(markdown).not.toContain("raw.orders");
    expect(markdown).not.toContain("private note");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("@claim:uncertain-lineage requires review for missing lineage and rejects cycles", () => {
  const unknown = spawnSync(
    "cargo",
    ["run", "--quiet", "--", "analyze", "-m", "tests/fixtures/lineage.yaml", "-c", "-", "--json"],
    { encoding: "utf8", input: "schema_version: 1\nchanges:\n  - node: missing.source\n    from: v1\n    to: v2\n" },
  );
  expect(unknown.status).toBe(0);
  expect(JSON.parse(unknown.stdout).summary).toMatchObject({ stale_assets: 0, unknown_edges: 1, disposition: "review_required" });
  const directory = mkdtempSync(join(tmpdir(), "dcic-cycle-"));
  try {
    const manifest = join(directory, "cycle.yaml");
    writeFileSync(manifest, "schema_version: 1\ncompleteness: complete\nnodes:\n  - id: a\n    depends_on: [b]\n  - id: b\n    depends_on: [a]\n");
    const cycle = spawnSync("cargo", ["run", "--quiet", "--", "analyze", "-m", manifest, "-c", "tests/fixtures/changes.yaml"], { encoding: "utf8" });
    expect(cycle.status).toBe(2);
    expect(cycle.stderr).toMatch(/cycle/i);
    const partial = join(directory, "partial.yaml");
    writeFileSync(partial, "schema_version: 1\ncompleteness: partial\nnodes: []\n");
    const partialReport = JSON.parse(execFileSync("cargo", ["run", "--quiet", "--", "analyze", "-m", partial, "-c", "-", "--json"], { encoding: "utf8", input: "schema_version: 1\nchanges: []\n" }));
    expect(partialReport.summary.disposition).toBe("review_required");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("@claim:mit-license ships the MIT license", () => {
  expect(readFileSync("LICENSE", "utf8")).toMatch(/MIT License/);
});

test("@claim:host-platform-package includes the current host binary", ({}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "package once on the desktop project");
  execFileSync("npm", ["run", "pack:cli"], { encoding: "utf8" });
  const expected = `dist/package/dcic-0.1.0-${process.platform}-${process.arch}`;
  expect(() => readFileSync(expected)).not.toThrow();
});

test("@claim:local-read-only-analysis never runs declared recompute commands", () => {
  const directory = mkdtempSync(join(tmpdir(), "dcic-read-only-"));
  try {
    const marker = join(directory, "must-not-exist");
    const manifest = join(directory, "lineage.yaml");
    const changes = join(directory, "changes.yaml");
    writeFileSync(manifest, `schema_version: 1\ncompleteness: complete\nnodes:\n  - id: raw\n  - id: derived\n    depends_on: [raw]\n    recompute: touch ${marker}\n`);
    writeFileSync(changes, "schema_version: 1\nchanges:\n  - node: raw\n    from: v1\n    to: v2\n");
    const result = spawnSync("cargo", ["run", "--quiet", "--", "analyze", "-m", manifest, "-c", changes], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`touch ${marker}`);
    expect(() => readFileSync(marker)).toThrow();
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("navigation and demo controls meet the 44px target and keep the wordmark intact", async ({ page }) => {
  for (const path of ["/", "/demo/?demo=1"]) {
    await page.goto(path);
    const mark = await page.locator(".mark").boundingBox();
    expect(mark).toMatchObject({ width: 44, height: 44 });
    expect(await page.locator(".mark").evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(true);
    for (const link of await page.locator(".site-header nav a, .site-footer nav a, .demo-banner a").all()) {
      if (!(await link.isVisible())) continue;
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  }
});

test("legal pages are present and accessible", async ({ page }) => {
  for (const path of ["/privacy/", "/terms/"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  }
});

test("demo and not-found pages are semantic and accessible", async ({ page }) => {
  for (const path of ["/demo/", "/404.html"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  }
});

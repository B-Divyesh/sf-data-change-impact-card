import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
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
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();

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

  await expect(page.locator(".terminal-actions").getByRole("link", { name: "Try it with sample data" })).toHaveAttribute("href", "/demo/?demo=1");
});

test("@claim:clipboard-commands copies both commands and explains unavailable clipboard recovery", async ({ page, context }) => {
  await page.goto("/");
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new URL(page.url()).origin });

  await page.getByRole("button", { name: "Copy command" }).click();
  await expect(page.locator("#demo-status")).toHaveText("Copied to clipboard.");
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(
    "dcic analyze \\\n  --manifest lineage.yaml \\\n  --changes changes.yaml \\\n  --output impact.md",
  );

  await page.getByRole("button", { name: "Copy install command" }).click();
  await expect(page.locator("#install-feedback")).toHaveText("Copied to clipboard.");
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("cargo install --path . --locked");

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => Promise.reject(new DOMException("Clipboard access denied", "NotAllowedError")) },
    });
  });
  await page.getByRole("button", { name: "Copy command" }).click();
  await expect(page.locator("#demo-status")).toHaveText("Copy unavailable — select the command and copy it manually.");
});

test("390px layout does not scroll sideways", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile project only");
  await page.goto("/");
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  await expect(page.locator(".hero-actions").getByRole("link", { name: /Try it with sample data/ })).toHaveCSS("min-height", "52px");
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
  await expect(page.getByRole("heading", { name: "Inspect a finished impact card." })).toBeVisible();
  await expect(page.getByText("Demo — sample data, nothing is saved.")).toBeVisible();
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("#offline-notice")).toBeVisible();
});

test("@claim:bundled-cli-demo runs the shipped sample and identifies its isolated state", async ({ page }) => {
  const sandbox = mkdtempSync(join(tmpdir(), "dcic-claim-demo-cwd-"));
  const binary = join(process.cwd(), "target", "debug", "dcic");
  writeFileSync(join(sandbox, "lineage.yaml"), "bait project file\n");
  try {
    execFileSync("cargo", ["build", "--quiet"]);
    const outputs = [["demo"], ["--demo"]].map((args) => execFileSync(binary, args, { cwd: sandbox, encoding: "utf8" }));
    const directories = outputs.map((output) => output.match(/^Sample directory: (.+)$/m)?.[1]);
    expect(directories[0]).toBeTruthy();
    expect(directories[1]).toBeTruthy();
    expect(directories[0]).not.toBe(directories[1]);
    for (const [index, directory] of directories.entries()) {
      expect(readdirSync(directory!).sort()).toEqual(["changes.yaml", "impact.md", "lineage.yaml"]);
      expect(readFileSync(join(directory!, "impact.md"), "utf8")).toContain("**Disposition:** READY");
      expect(outputs[index]).toContain("Result: 2 stale assets, 7 known minutes, 0 unknown edges.");
      rmSync(directory!, { recursive: true, force: true });
    }
    expect(readFileSync(join(sandbox, "lineage.yaml"), "utf8")).toBe("bait project file\n");
    expect(readdirSync(sandbox)).toEqual(["lineage.yaml"]);

    await page.goto("/demo/?demo=1");
    await expect(page.getByRole("heading", { name: "Inspect a finished impact card." })).toBeVisible();
    await expect(page.getByText("Demo — sample data, nothing is saved.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Reset demo" })).toHaveAttribute("href", "/demo/?demo=1#demo-result");
    await expect(page.getByRole("link", { name: "Start for real" })).toHaveAttribute("href", "/");
    await expect(page.locator(".recorded-run")).toContainText("dcic demo");
    await expect(page.locator(".recorded-run")).toContainText("raw.orders v41 → v42");
    await expect(page.locator(".demo-impact-card")).toContainText("2 assets");
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
});

test("@claim:no-third-party-runtime-requests site sends only same-origin requests and stores no account data", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  for (const route of ["/", "/demo/?demo=1", "/privacy/", "/terms/", "/404.html"]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
  }
  const expectedOrigin = new URL(page.url()).origin;
  expect(requests).not.toEqual([]);
  expect(requests.every((url) => new URL(url).origin === expectedOrigin)).toBe(true);
  expect(await page.evaluate(async () => ({
    cookie: document.cookie,
    local: localStorage.length,
    session: sessionStorage.length,
    databases: typeof indexedDB.databases === "function" ? (await indexedDB.databases()).length : 0,
  }))).toEqual({ cookie: "", local: 0, session: 0, databases: 0 });
  expect(await page.locator("input[type='email'], input[type='password']").count()).toBe(0);
  const cachedUrls = await page.evaluate(async () => {
    const urls: string[] = [];
    for (const key of await caches.keys()) {
      const cache = await caches.open(key);
      urls.push(...(await cache.keys()).map((request) => request.url));
    }
    return urls;
  });
  expect(cachedUrls.every((url) => new URL(url).origin === expectedOrigin)).toBe(true);
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

  const directory = mkdtempSync(join(tmpdir(), "dcic-core-claim-"));
  try {
    const manifest = join(directory, "lineage.json");
    const changes = join(directory, "changes.json");
    writeFileSync(manifest, JSON.stringify({ schema_version: 1, completeness: "complete", nodes: [
      { id: "raw.b" }, { id: "raw.a" },
      { id: "clean", depends_on: ["raw.b", "raw.a"], estimate_minutes: 2 },
      { id: "mart", depends_on: ["clean"] },
    ] }));
    writeFileSync(changes, JSON.stringify({ schema_version: 1, changes: [
      { node: "raw.b", from: "v1", to: "v2" },
      { node: "raw.a", from: "v1", to: "v2" },
    ] }));
    const sorted = JSON.parse(execFileSync("cargo", ["run", "--quiet", "--", "analyze", "-m", manifest, "-c", changes, "--json"], { encoding: "utf8" }));
    expect(sorted.summary).toMatchObject({ known_estimate_minutes: 2, assets_without_estimate: 1 });
    expect(sorted.impacted.map((item: { node: string }) => item.node)).toEqual(["clean", "mart"]);
    expect(sorted.impacted[0].reasons.map((reason: { changed_node: string }) => reason.changed_node)).toEqual(["raw.a", "raw.b"]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
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
    const markdownAgain = execFileSync("cargo", ["run", "--quiet", "--", "analyze", "-m", manifest, "-c", changes, "--redact"], { encoding: "utf8" });
    expect(markdown).toContain("NODE-001");
    expect(markdownAgain).toBe(markdown);
    expect(markdown).not.toContain("raw.orders");
    expect(markdown).not.toContain("private note");
    const defaultMarkdown = execFileSync("cargo", ["run", "--quiet", "--", "analyze", "-m", manifest, "-c", changes], { encoding: "utf8" });
    expect(defaultMarkdown).toMatch(/^# Data change impact card/);
    const yaml = execFileSync("cargo", ["run", "--quiet", "--", "analyze", "-m", "tests/fixtures/lineage.yaml", "-c", "tests/fixtures/changes.yaml", "--json"], { encoding: "utf8" });
    expect(JSON.parse(yaml).summary.stale_assets).toBe(2);
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
    expect(cycle.stderr).toMatch(/cycle involving: a, b/i);
    const partial = join(directory, "partial.yaml");
    writeFileSync(partial, "schema_version: 1\ncompleteness: partial\nnodes:\n  - id: derived\n    depends_on: [missing.upstream]\n");
    const partialCard = execFileSync("cargo", ["run", "--quiet", "--", "analyze", "-m", partial, "-c", "-"], { encoding: "utf8", input: "schema_version: 1\nchanges:\n  - node: derived\n    from: v1\n    to: v2\n" });
    expect(partialCard).toContain("**Disposition:** REVIEW REQUIRED · **Input lineage:** partial");
    expect(partialCard).toContain("Unknown dependency: `derived` names undeclared upstream `missing.upstream`");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("@claim:mit-license ships the MIT license", () => {
  expect(readFileSync("LICENSE", "utf8")).toMatch(/MIT License/);
  expect(readFileSync("Cargo.toml", "utf8")).toMatch(/^license = "MIT"$/m);
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
    const binary = join(process.cwd(), "target", "debug", "dcic");
    execFileSync("cargo", ["build", "--quiet"]);
    const before = readdirSync(directory).sort();
    const result = spawnSync(binary, ["analyze", "-m", manifest, "-c", changes], { cwd: directory, encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`touch ${marker}`);
    expect(() => readFileSync(marker)).toThrow();
    expect(readdirSync(directory).sort()).toEqual(before);
    const card = join(directory, "review.md");
    const written = spawnSync(binary, ["analyze", "-m", manifest, "-c", changes, "-o", card], { cwd: directory, encoding: "utf8" });
    expect(written.status).toBe(0);
    expect(readFileSync(card, "utf8")).toContain("# Data change impact card");
    expect(readdirSync(directory).sort()).toEqual([...before, "review.md"].sort());
    const source = `${readFileSync("src/main.rs", "utf8")}\n${readFileSync("src/lib.rs", "utf8")}`;
    const manifestSource = readFileSync("Cargo.toml", "utf8");
    expect(source).not.toMatch(/TcpStream|UdpSocket|std::net|process::Command/);
    expect(manifestSource).not.toMatch(/reqwest|hyper|ureq|curl/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("@claim:source-install installs the documented source checkout in a clean consumer prefix", ({}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "install once on the desktop project");
  const prefix = mkdtempSync(join(tmpdir(), "dcic-install-claim-"));
  const unrelatedCwd = mkdtempSync(join(tmpdir(), "dcic-install-cwd-"));
  try {
    execFileSync("cargo", ["install", "--path", process.cwd(), "--locked", "--root", prefix], { cwd: unrelatedCwd, encoding: "utf8" });
    const installed = join(prefix, "bin", process.platform === "win32" ? "dcic.exe" : "dcic");
    expect(existsSync(installed)).toBe(true);
    expect(execFileSync(installed, ["--help"], { encoding: "utf8" })).toContain("Usage: dcic");
  } finally {
    rmSync(prefix, { recursive: true, force: true });
    rmSync(unrelatedCwd, { recursive: true, force: true });
  }
});

test("@claim:format-alias --format json and --json return equivalent output", () => {
  const base = ["run", "--quiet", "--", "analyze", "-m", "tests/fixtures/lineage.yaml", "-c", "tests/fixtures/changes.yaml"];
  const shorthand = execFileSync("cargo", [...base, "--json"], { encoding: "utf8" });
  const explicit = execFileSync("cargo", [...base, "--format", "json"], { encoding: "utf8" });
  expect(JSON.parse(shorthand)).toEqual(JSON.parse(explicit));
});

test("@claim:stdin-input accepts either input on stdin and rejects two stdin inputs", () => {
  const changes = readFileSync("tests/fixtures/changes.yaml", "utf8");
  const manifest = readFileSync("tests/fixtures/lineage.yaml", "utf8");
  const changeStdin = spawnSync("cargo", ["run", "--quiet", "--", "analyze", "-m", "tests/fixtures/lineage.yaml", "-c", "-", "--json"], { encoding: "utf8", input: changes });
  expect(changeStdin.status).toBe(0);
  expect(JSON.parse(changeStdin.stdout).summary.stale_assets).toBe(2);
  const manifestStdin = spawnSync("cargo", ["run", "--quiet", "--", "analyze", "-m", "-", "-c", "tests/fixtures/changes.yaml", "--json"], { encoding: "utf8", input: manifest });
  expect(manifestStdin.status).toBe(0);
  expect(JSON.parse(manifestStdin.stdout).summary.stale_assets).toBe(2);
  const both = spawnSync("cargo", ["run", "--quiet", "--", "analyze", "-m", "-", "-c", "-"], { encoding: "utf8", input: manifest });
  expect(both.status).toBe(2);
  expect(both.stderr).toMatch(/cannot both read from stdin/i);
});

test("@claim:exit-codes returns 0 for success, 1 for file or output errors, and 2 for invalid data", () => {
  const success = spawnSync("cargo", ["run", "--quiet", "--", "analyze", "-m", "tests/fixtures/lineage.yaml", "-c", "tests/fixtures/changes.yaml"], { encoding: "utf8" });
  expect(success.status).toBe(0);
  const missing = spawnSync("cargo", ["run", "--quiet", "--", "analyze", "-m", "missing.yaml", "-c", "missing-too.yaml"], { encoding: "utf8" });
  expect(missing.status).toBe(1);
  const outputDirectory = mkdtempSync(join(tmpdir(), "dcic-output-error-"));
  try {
    const outputError = spawnSync("cargo", ["run", "--quiet", "--", "analyze", "-m", "tests/fixtures/lineage.yaml", "-c", "tests/fixtures/changes.yaml", "-o", outputDirectory], { encoding: "utf8" });
    expect(outputError.status).toBe(1);
  } finally {
    rmSync(outputDirectory, { recursive: true, force: true });
  }
  const invalid = spawnSync("cargo", ["run", "--quiet", "--", "analyze", "-m", "-", "-c", "tests/fixtures/changes.yaml"], { encoding: "utf8", input: "schema_version: 1\ncompleteness: complete\nnodes:\n  - id: ''\n" });
  expect(invalid.status).toBe(2);
});

test("@claim:help-output documents the root and analyze command options", () => {
  const root = execFileSync("cargo", ["run", "--quiet", "--", "--help"], { encoding: "utf8" });
  expect(root).toContain("Usage: dcic");
  expect(root).toContain("analyze");
  expect(root).toContain("demo");
  const analyze = execFileSync("cargo", ["run", "--quiet", "--", "analyze", "--help"], { encoding: "utf8" });
  for (const option of ["--manifest", "--changes", "--format", "--json", "--redact", "--output"]) expect(analyze).toContain(option);
});

test("@claim:node-id-validation rejects empty and duplicate node identifiers", () => {
  const invalidManifests = [
    "schema_version: 1\ncompleteness: complete\nnodes:\n  - id: ''\n",
    "schema_version: 1\ncompleteness: complete\nnodes:\n  - id: repeated\n  - id: repeated\n",
  ];
  for (const input of invalidManifests) {
    const result = spawnSync("cargo", ["run", "--quiet", "--", "analyze", "-m", "-", "-c", "tests/fixtures/changes.yaml"], { encoding: "utf8", input });
    expect(result.status).toBe(2);
    expect(result.stderr).toMatch(/empty|more than once/i);
  }
});

test("route changes focus and announce the destination heading", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Privacy", exact: true }).first().click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.locator("h1")).toBeFocused();
  await expect(page.locator(".route-status")).toHaveText("Privacy");
  await page.goBack();
  await expect(page.locator("h1")).toBeFocused();
  await page.goForward();
  await expect(page.locator("h1")).toBeFocused();
  await expect(page.locator(".route-status")).toHaveText("Privacy");
  await page.goto("/#contract");
  await expect(page.locator("#contract-title")).toBeFocused();
  await expect(page.locator(".route-status")).toHaveText("Input and output contract.");
});

test("demo result and generated card are visible in the first mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile viewport assertion");
  await page.goto("/demo/?demo=1");
  const required = [
    page.getByText("raw.orders v41 → v42"),
    page.getByText("2 assets", { exact: true }),
    page.getByText("7 min", { exact: true }),
    page.getByText("0 edges", { exact: true }),
    page.getByRole("article", { name: "Generated sample impact card" }),
  ];
  for (const locator of required) {
    await expect(locator).toBeVisible();
    const box = await locator.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
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

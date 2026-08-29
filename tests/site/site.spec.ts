import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

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

test("@claim:offline-docs cached shell remains available offline", async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "desktop project only");
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
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

test("@claim:no-third-party-runtime-requests demo sends only same-origin requests", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/demo/?demo=1");
  const expectedOrigin = new URL(page.url()).origin;
  expect(requests).not.toEqual([]);
  expect(requests.every((url) => new URL(url).origin === expectedOrigin)).toBe(true);
});

test("legal pages are present and accessible", async ({ page }) => {
  for (const path of ["/privacy/", "/terms/"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  }
});

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home is semantic, accessible, and free of runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await expect(page).toHaveTitle(/Data Change Impact Card/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("img")).toHaveAttribute("alt", /schema change/i);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  expect(errors).toEqual([]);
});

test("recorded analysis works with keyboard and announces a result", async ({ page }) => {
  await page.goto("/#demo");
  const commandTab = page.getByRole("tab", { name: "Command" });
  await commandTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Manifest" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#demo-code")).toContainText("completeness: complete");

  await page.getByRole("button", { name: "Run recorded analysis" }).click();
  await expect(page.locator("#demo-status")).toHaveText(/Complete: 2 stale assets/);
  await expect(page.locator("#impact-sheet")).toBeFocused();
});

test("390px layout does not scroll sideways", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile project only");
  await page.goto("/");
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  await expect(page.getByRole("link", { name: /Install dcic/ })).toHaveCSS("min-height", "52px");
});

test("cached shell remains available offline", async ({ page, context }, testInfo) => {
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

test("legal pages are present and accessible", async ({ page }) => {
  for (const path of ["/privacy/", "/terms/"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  }
});

import { test, expect } from "@playwright/test";

/**
 * A smoke test, not full coverage: confirms the static export loads clean
 * (no console errors, one H1, the whole page reachable) at each of the four
 * breakpoints the brief calls for, and saves a full-page screenshot of each
 * for visual review — see test-results/ after running.
 */
test("loads with no console errors and correct landmarks", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/");
  await expect(page).toHaveTitle(/URfolio/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main#main")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();

  // Reduced motion so signature animations settle to their final state
  // immediately, rather than racing the screenshot.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.waitForLoadState("networkidle");

  await page.screenshot({
    path: testInfo.outputPath(`full-page-${testInfo.project.name}.png`),
    fullPage: true,
  });

  expect(errors, `console errors: ${errors.join("\n")}`).toEqual([]);
});

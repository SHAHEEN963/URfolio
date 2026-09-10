import { defineConfig, devices } from "@playwright/test";

/**
 * Serves the static export (`npm run build` output, `/out`) and runs a
 * smoke test against it at the four breakpoints the brief calls for
 * (375 / 768 / 1280 / 1920), taking a screenshot of each full page.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4173",
  },
  webServer: {
    command: "npx serve -l 4173 out",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: "375", use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 812 } } },
    { name: "768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
    { name: "1280", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    { name: "1920", use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } } },
  ],
});

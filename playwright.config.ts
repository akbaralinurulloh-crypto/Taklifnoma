import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/api/health`,
    // Supabase sozlanmagan bo'lsa /api/health 503 qaytaradi: serverning o'zi ishga tushganini 503 ham bildiradi
    ignoreHTTPSErrors: true,
    reuseExistingServer: true,
    timeout: 240_000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 5000 },
  },
  projects: [
    { name: "telefon-360", use: { ...devices["Pixel 5"], viewport: { width: 360, height: 740 } } },
    { name: "telefon-390", use: { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } } },
    { name: "planshet", use: { ...devices["iPad (gen 7)"] } },
    { name: "kompyuter-1366", use: { viewport: { width: 1366, height: 768 } } },
  ],
});

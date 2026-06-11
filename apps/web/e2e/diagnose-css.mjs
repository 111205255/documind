// Diagnose why the live page renders unstyled
import { chromium } from "@playwright/test";
import fs from "node:fs";

const BASE = process.env.AUDIT_BASE || "https://documind-beige.vercel.app";
const { email, password } = JSON.parse(fs.readFileSync("e2e/.audit-creds.json", "utf8"));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1024 } });
const page = await ctx.newPage();

const cssResponses = [];
const consoleErrors = [];
page.on("response", (r) => {
  if (r.url().includes(".css")) cssResponses.push({ url: r.url(), status: r.status() });
});
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") consoleErrors.push(m.text().slice(0, 300));
});

await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
await page.getByPlaceholder("name@email.com").fill(email);
const pw = page.getByPlaceholder("Password");
if (await pw.isVisible().catch(() => false)) await pw.fill(password);
await page.getByRole("button", { name: "Continue", exact: true }).click();
await page.waitForTimeout(800);
const pw2 = page.getByPlaceholder("Password");
if (await pw2.isVisible().catch(() => false)) {
  await pw2.fill(password);
  await page.getByRole("button", { name: /^(Continue|Sign in)$/ }).first().click();
}
await page.waitForURL(/\/home/, { timeout: 30000 });
await page.waitForTimeout(2500);

const diag = await page.evaluate(() => {
  const links = [...document.querySelectorAll("link[rel='stylesheet']")].map((l) => l.href);
  const sheets = [...document.styleSheets].map((s) => {
    let rules = -1;
    try { rules = s.cssRules.length; } catch { rules = -2; }
    return { href: s.href, rules };
  });
  const sidebar = document.querySelector("[data-testid='app-sidebar']");
  const upload = document.querySelector("[data-testid='sidebar-upload-btn']");
  const cs = sidebar ? getComputedStyle(sidebar) : null;
  const cu = upload ? getComputedStyle(upload) : null;
  const root = getComputedStyle(document.documentElement);
  return {
    links,
    sheets,
    sidebarPadding: cs?.padding,
    sidebarWidth: cs?.width,
    uploadHeight: cu?.height,
    uploadRadius: cu?.borderRadius,
    uploadPadding: cu?.padding,
    varSidebarWidth: root.getPropertyValue("--sidebar-width"),
    varUploadRadius: root.getPropertyValue("--sidebar-upload-radius"),
    varSpace4: root.getPropertyValue("--space-4"),
  };
});

console.log(JSON.stringify({ cssResponses, consoleErrors: consoleErrors.slice(0, 10), diag }, null, 2));
await browser.close();

// Full-frame audit of the live site (logs in with the disposable audit account)
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://documind-beige.vercel.app";
const OUT = path.resolve("e2e/.shots");
fs.mkdirSync(OUT, { recursive: true });
const { email, password } = JSON.parse(fs.readFileSync("e2e/.audit-creds.json", "utf8"));

const browser = await chromium.launch();

async function makeContext(theme) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1024 } });
  await ctx.addInitScript((t) => {
    try { window.localStorage.setItem("theme", t); } catch {}
  }, theme);
  return ctx;
}

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder("name@email.com").fill(email);
  const pw = page.getByPlaceholder("Password");
  if (await pw.isVisible().catch(() => false)) await pw.fill(password);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  // Password field may appear after first continue
  await page.waitForTimeout(800);
  const pw2 = page.getByPlaceholder("Password");
  if (await pw2.isVisible().catch(() => false)) {
    await pw2.fill(password);
    await page.getByRole("button", { name: /^(Continue|Sign in)$/ }).first().click();
  }
  await page.waitForURL(/\/home/, { timeout: 30000 });
}

for (const theme of ["light", "dark"]) {
  const ctx = await makeContext(theme);
  const page = await ctx.newPage();
  try {
    await login(page);
  } catch (e) {
    console.log(`LOGIN FAILED (${theme}):`, e.message);
    await page.screenshot({ path: path.join(OUT, `login-failed-${theme}.png`) });
    await ctx.close();
    continue;
  }

  const shots = [
    ["03-empty", "/home?empty"],
    ["04-home", "/home?demo"],
    ["12-history", "/chat/history"],
    ["13-settings", "/settings"],
    ["08-chat", "/chat/hr-policy-2026"],
    ["11-docinfo", "/documents/hr-policy-2026"],
  ];
  for (const [name, route] of shots) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(2200);
    await page.screenshot({ path: path.join(OUT, `${name}-${theme}.png`) });
    console.log(`captured ${name}-${theme}`, page.url());
  }

  // 05 upload modal
  await page.goto(`${BASE}/home?demo`, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  const uploadBtn = page.getByTestId("sidebar-upload-btn");
  if (await uploadBtn.isVisible().catch(() => false)) {
    await uploadBtn.click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, `05-upload-${theme}.png`) });
    console.log(`captured 05-upload-${theme}`);
  }

  await ctx.close();
}

// 02 login (public, light + dark)
for (const theme of ["light", "dark"]) {
  const ctx = await makeContext(theme);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, `02-login-${theme}.png`) });
  console.log(`captured 02-login-${theme}`);
  await ctx.close();
}

await browser.close();
console.log("done ->", OUT);

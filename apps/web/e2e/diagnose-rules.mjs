// Inspect parsed CSS rules + cascade layers on the live login page (public, no auth needed)
import { chromium } from "@playwright/test";

const BASE = "https://documind-beige.vercel.app";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1024 } })).newPage();
await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

const out = await page.evaluate(() => {
  const sheet = [...document.styleSheets].find((s) => s.href?.includes(".css"));
  const report = { topLevel: [], figmaUploadFound: [], layerStatements: [] };
  const walk = (rules, ctx) => {
    for (const r of rules) {
      if (r instanceof CSSLayerStatementRule) {
        report.layerStatements.push([...r.nameList].join(","));
      } else if (r instanceof CSSLayerBlockRule) {
        if (ctx === "") report.topLevel.push(`@layer ${r.name} (${r.cssRules.length} rules)`);
        walk(r.cssRules, ctx + "@layer " + r.name + " > ");
      } else if (r instanceof CSSMediaRule || r instanceof CSSSupportsRule) {
        if (ctx === "") report.topLevel.push(`@media/@supports (${r.cssRules.length})`);
        walk(r.cssRules, ctx + "@media > ");
      } else if (r instanceof CSSStyleRule) {
        if (ctx === "") report.topLevel.push(r.selectorText);
        if (r.selectorText?.includes("figma-sidebar-upload")) {
          report.figmaUploadFound.push({ ctx, selector: r.selectorText, css: r.style.cssText.slice(0, 400) });
        }
        walk(r.cssRules ?? [], ctx + r.selectorText + " > ");
      }
    }
  };
  try { walk(sheet.cssRules, ""); } catch (e) { report.error = String(e); }
  report.topLevel = report.topLevel.slice(0, 40);
  return report;
});
console.log(JSON.stringify(out, null, 2));
await browser.close();

import { expect, test } from "@playwright/test";

const DESKTOP = { width: 1440, height: 900 };
const PROD = process.env.PLAYWRIGHT_BASE_URL?.includes("vercel.app");

/** Pixel-tolerance layout checks against Figma frame specs */
test.describe("Layout audit — public @desktop", () => {
  test.use({ viewport: DESKTOP });

  test("splash vertical rhythm", async ({ page }) => {
    await page.goto("/");
    const icon = page.locator("[data-testid='splash-screen'] svg").first();
    const title = page.getByRole("heading", { name: "DocuMind" });
    const dots = page.getByTestId("splash-dots");

    await expect(icon).toBeVisible();
    const iconBox = await icon.boundingBox();
    const titleBox = await title.boundingBox();
    const dotsBox = await dots.boundingBox();
    expect(iconBox && titleBox).toBeTruthy();
    if (iconBox && titleBox) {
      const gap = titleBox.y - (iconBox.y + iconBox.height);
      expect(gap).toBeGreaterThanOrEqual(20);
      expect(gap).toBeLessThanOrEqual(36);
    }
    if (dotsBox) {
      expect(dotsBox.y + dotsBox.height).toBeLessThanOrEqual(900 - 40);
    }
  });

  test("login split panels and card padding", async ({ page }) => {
    await page.goto("/login");
    const marketing = page.getByTestId("login-marketing-panel");
    const auth = page.getByTestId("login-auth-panel");
    const card = page.getByTestId("login-auth-card");

    const marketingBox = await marketing.boundingBox();
    const authBox = await auth.boundingBox();
    expect(marketingBox && authBox).toBeTruthy();
    if (marketingBox && authBox) {
      expect(Math.abs(marketingBox.width - authBox.width)).toBeLessThan(80);
    }

    const padding = await card.evaluate((el) => getComputedStyle(el).padding);
    expect(padding).toBe("32px");
  });

  test("login close/header alignment N/A — card has no close btn", async ({ page }) => {
    await page.goto("/login");
    const card = page.getByTestId("login-auth-card");
    const heading = card.getByRole("heading", { level: 2 });
    const cardBox = await card.boundingBox();
    const headingBox = await heading.boundingBox();
    expect(cardBox && headingBox).toBeTruthy();
    if (cardBox && headingBox) {
      expect(headingBox.x - cardBox.x).toBeGreaterThanOrEqual(28);
      expect(headingBox.x - cardBox.x).toBeLessThanOrEqual(36);
    }
  });
});

test.describe("Layout audit — authenticated @desktop", () => {
  test.use({ viewport: DESKTOP });

  test.beforeEach(async () => {
    if (!process.env.E2E_EMAIL) {
      test.skip(true, "Set E2E_EMAIL and E2E_PASSWORD for layout audit.");
    }
  });

  test("sidebar user card has bottom breathing room", async ({ page }) => {
    await page.goto("/home");
    await expect(page.getByTestId("app-sidebar")).toBeVisible({ timeout: 15_000 });
    const userCard = page.getByTestId("sidebar-user-card");
    await expect(userCard).toBeVisible();
    const cardBox = await userCard.boundingBox();
    expect(cardBox).toBeTruthy();
    if (cardBox) {
      expect(900 - (cardBox.y + cardBox.height)).toBeGreaterThanOrEqual(12);
    }
  });

  test("documents header aligns with grid", async ({ page }) => {
    await page.goto("/home");
    await expect(page.getByTestId("documents-home-desktop")).toBeVisible({ timeout: 15_000 });

    const title = page.getByRole("heading", { name: "Documents" });
    const header = page.getByTestId("documents-page-header");
    const grid = page.getByTestId("documents-grid");
    const search = page.getByPlaceholder("Search documents");

    await expect(title).toBeVisible();
    const titleBox = await title.boundingBox();
    const headerBox = await header.boundingBox();
    const gridBox = await grid.boundingBox();
    const searchBox = await search.boundingBox();

    expect(titleBox && gridBox && searchBox && headerBox).toBeTruthy();
    if (titleBox && gridBox) {
      expect(Math.abs(titleBox.x - gridBox.x)).toBeLessThanOrEqual(4);
    }
    if (titleBox && searchBox) {
      const titleMid = titleBox.y + titleBox.height / 2;
      const searchMid = searchBox.y + searchBox.height / 2;
      expect(Math.abs(titleMid - searchMid)).toBeLessThanOrEqual(8);
    }
  });

  test("document cards show title text", async ({ page }) => {
    await page.goto("/home");
    const card = page.getByTestId("document-grid-card").first();
    const hasCards = await card.isVisible().catch(() => false);
    if (!hasCards) {
      test.skip(true, "No documents in library — skipping card content check.");
      return;
    }
    const title = card.locator("h3");
    await expect(title).toBeVisible();
    const color = await title.evaluate((el) => getComputedStyle(el).color);
    expect(color).not.toBe("rgba(0, 0, 0, 0)");
    const text = await title.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("settings cards share equal width", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByTestId("settings-screen")).toBeVisible({ timeout: 15_000 });
    // Profile card is intentionally fit-content per Figma frame 13
    await expect(page.getByTestId("settings-profile-card")).toBeVisible();
    const cards = page.getByTestId("settings-card");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
    const widths = await cards.evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().width),
    );
    const max = Math.max(...widths);
    const min = Math.min(...widths);
    expect(max - min).toBeLessThanOrEqual(2);
  });

  test("upload modal header and option alignment", async ({ page }) => {
    await page.goto("/home");
    await page.getByTestId("sidebar-upload-btn").click();
    const panel = page.getByTestId("modal-panel");
    await expect(panel).toBeVisible();

    const title = panel.getByRole("heading", { name: /add a document/i });
    const close = panel.getByRole("button", { name: /close dialog/i });
    const titleBox = await title.boundingBox();
    const closeBox = await close.boundingBox();
    if (titleBox && closeBox) {
      const titleMid = titleBox.y + titleBox.height / 2;
      const closeMid = closeBox.y + closeBox.height / 2;
      expect(Math.abs(titleMid - closeMid)).toBeLessThanOrEqual(6);
    }

    const firstOption = page.getByTestId("upload-options").locator("button").first();
    const icon = firstOption.locator("div").first();
    const text = firstOption.locator("p").first();
    const iconBox = await icon.boundingBox();
    const textBox = await text.boundingBox();
    if (iconBox && textBox) {
      const iconMid = iconBox.y + iconBox.height / 2;
      const textMid = textBox.y + textBox.height / 2;
      expect(Math.abs(iconMid - textMid)).toBeLessThanOrEqual(12);
    }
  });

  test("history page title matches sidebar nav", async ({ page }) => {
    await page.goto("/chat/history");
    await expect(page.getByRole("heading", { name: "Chats" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("sidebar-nav-history")).toHaveAttribute("data-active", "true");
  });
});

test.describe("Layout audit — production smoke", () => {
  test.skip(!PROD, "Only runs when PLAYWRIGHT_BASE_URL points at Vercel.");

  test.use({ viewport: DESKTOP });

  test("splash loads on production", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
  });
});

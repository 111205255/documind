import { expect, test } from "@playwright/test";

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

test.describe("Figma frames — public @desktop", () => {
  test.use({ viewport: DESKTOP });

  test("frame 01 splash branding with animated dots", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page.getByRole("heading", { name: "DocuMind" })).toBeVisible();
    await expect(page.getByText("Ask anything. Know everything.")).toBeVisible();
    await expect(page.getByTestId("splash-dots")).toBeVisible();
  });

  test("frame 02 login split layout 50/50", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByTestId("login-screen")).toBeVisible();
    const marketing = page.getByTestId("login-marketing-panel");
    const auth = page.getByTestId("login-auth-panel");
    await expect(marketing).toBeVisible();
    await expect(auth).toBeVisible();
    await expect(page.getByTestId("login-auth-card")).toBeVisible();
    await expect(page.getByPlaceholder("name@email.com")).toBeVisible();
    await expect(page.getByRole("button", { name: /Continue with Google/i })).toBeVisible();

    const marketingBox = await marketing.boundingBox();
    const authBox = await auth.boundingBox();
    expect(marketingBox).toBeTruthy();
    expect(authBox).toBeTruthy();
    if (marketingBox && authBox) {
      expect(Math.abs(marketingBox.width - authBox.width)).toBeLessThan(80);
    }
  });

  test("frame 02 login marketing has feature list", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Answers with citations")).toBeVisible();
    await expect(page.getByText("Search across documents")).toBeVisible();
    await expect(page.getByText("PDF, Word & web links")).toBeVisible();
  });
});

test.describe("Figma frames — desktop shell (auth gate)", () => {
  test.use({ viewport: DESKTOP });

  test("protected routes redirect without session", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Figma frames — authenticated @desktop", () => {
  test.use({ viewport: DESKTOP });

  test.beforeEach(async () => {
    if (!process.env.E2E_EMAIL) {
      test.skip(true, "Set E2E_EMAIL and E2E_PASSWORD for frame tests.");
    }
  });

  test("frame 04 home has sidebar + documents grid", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/home/);
    const sidebar = page.getByTestId("app-sidebar");
    await expect(sidebar).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("sidebar-upload-btn")).toBeVisible();
    await expect(page.getByTestId("sidebar-nav-home")).toHaveAttribute("data-active", "true");

    const sidebarWidth = await sidebar.evaluate((el) => el.getBoundingClientRect().width);
    expect(sidebarWidth).toBeGreaterThanOrEqual(256);
    expect(sidebarWidth).toBeLessThanOrEqual(264);

    const mainPadding = await page.evaluate(() => {
      const main = document.querySelector("main");
      if (!main) return 0;
      return parseFloat(getComputedStyle(main).paddingLeft);
    });
    expect(mainPadding).toBeGreaterThanOrEqual(36);

    await expect(page.getByTestId("documents-home-desktop")).toBeVisible();
    await expect(page.getByTestId("bottom-nav")).toHaveCount(0);
  });

  test("frame 03 empty home state", async ({ page }) => {
    await page.goto("/home?empty");
    await expect(page.getByText("No documents yet")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: /upload your first document/i })).toBeVisible();
  });

  test("frame 12 history page layout", async ({ page }) => {
    await page.goto("/chat/history");
    await expect(page.getByRole("heading", { name: "History" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByPlaceholder("Search chats")).toBeVisible();
    await expect(page.getByTestId("sidebar-nav-history")).toHaveAttribute("data-active", "true");
  });

  test("frame 13 settings toggles and profile", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Notifications")).toBeVisible();
    await expect(page.getByText("Dark mode")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
    await expect(page.getByText("DocuMind v1.0.0")).toBeVisible();
  });

  test("frame 05 upload modal from sidebar", async ({ page }) => {
    await page.goto("/home");
    await page.getByTestId("sidebar-upload-btn").click();
    await expect(page.getByTestId("modal-panel")).toBeVisible();
    await expect(page.getByText(/upload|drag|pdf/i).first()).toBeVisible();
  });

  test("sidebar nav active state animation classes", async ({ page }) => {
    await page.goto("/settings");
    const settingsNav = page.getByTestId("sidebar-nav-settings");
    await expect(settingsNav).toHaveAttribute("data-active", "true");
    await expect(settingsNav).toHaveClass(/interaction-press/);
  });
});

test.describe("Figma frames — mobile @mobile", () => {
  test.use({ viewport: MOBILE });

  test("frame mobile uses bottom nav not sidebar", async ({ page }) => {
    if (!process.env.E2E_EMAIL) {
      test.skip(true, "Set E2E_EMAIL for mobile frame tests.");
      return;
    }
    await page.goto("/home");
    await expect(page.getByTestId("bottom-nav")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("app-sidebar")).toHaveCount(0);
    await expect(page.getByTestId("documents-home-mobile")).toBeVisible();
  });
});

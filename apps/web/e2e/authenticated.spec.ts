import { expect, test } from "@playwright/test";

test.describe("Authenticated flows", () => {
  test.beforeEach(async ({ page }) => {
    if (!process.env.E2E_EMAIL) {
      test.skip(true, "Set E2E_EMAIL and E2E_PASSWORD for authenticated E2E.");
    }
  });

  test("home page loads for signed-in user", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/home/);
    await expect(page.getByText(/documents|upload|library/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("settings page is reachable", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/settings/);
  });

  test("bottom nav highlights active tab with animation markers", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/home");

    const bottomNav = page.getByTestId("bottom-nav");
    await expect(bottomNav).toBeVisible({ timeout: 15_000 });

    const documentsTab = page.getByTestId("bottom-nav-documents");
    await expect(documentsTab).toHaveAttribute("data-active", "true");

    await documentsTab.evaluate((el) => getComputedStyle(el).transitionProperty);

    await page.getByTestId("bottom-nav-settings").click();
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByTestId("bottom-nav-settings")).toHaveAttribute("data-active", "true");
    await expect(page.getByTestId("bottom-nav-documents")).toHaveAttribute("data-active", "false");
  });

  test("upload modal opens with animated panel", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/home");

    const uploadBtn = page.getByTestId("sidebar-upload-btn");
    await expect(uploadBtn).toBeVisible({ timeout: 15_000 });
    await uploadBtn.click();

    const modal = page.getByTestId("modal-panel");
    await expect(modal).toBeVisible();
    await expect(page.getByTestId("modal-overlay")).toBeVisible();

    const opacity = await modal.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThan(0.9);
  });

  test("RAG proxy accepts authenticated session", async ({ page, request }) => {
    await page.goto("/home");
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

    const response = await request.post("/api/rag/chat", {
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      data: {
        document_id: "00000000-0000-0000-0000-000000000001",
        question: "What is this document about?",
      },
    });

    expect(response.status()).not.toBe(401);
  });
});

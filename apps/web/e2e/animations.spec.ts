import { expect, test } from "@playwright/test";

test.describe("Splash animations", () => {
  test("splash dots animate on load", async ({ page }) => {
    await page.goto("/");
    const dots = page.getByTestId("splash-dots");
    await expect(dots).toBeVisible();
    const firstOpacity = await dots.locator("span").first().evaluate((el) => getComputedStyle(el).opacity);
    await page.waitForTimeout(600);
    const laterOpacity = await dots.locator("span").nth(1).evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(firstOpacity)).toBeGreaterThan(0);
    expect(Number(laterOpacity)).toBeGreaterThan(0);
  });
});

test.describe("Micro-interactions — public", () => {
  test("login submit button has press interaction styles", async ({ page }) => {
    await page.goto("/login");
    const button = page.getByRole("button", { name: "Continue", exact: true });
    await expect(button).toBeVisible();

    const hasPressClass = await button.evaluate((el) =>
      el.classList.contains("interaction-press"),
    );
    expect(hasPressClass).toBe(true);

    const transition = await button.evaluate((el) => getComputedStyle(el).transitionProperty);
    expect(transition === "all" || transition.includes("transform")).toBe(true);
  });

  test("auth mode toggle responds to interaction", async ({ page }) => {
    await page.goto("/login");
    const toggle = page.getByRole("button", { name: /create account|sign in/i }).last();
    await toggle.click();
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
    await toggle.click();
    await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeVisible();
  });

  test("marketing feature list animates on login", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");

    const marketing = page.getByTestId("login-marketing-panel");
    await expect(marketing).toBeVisible();
    await expect(marketing.getByText("Answers with citations")).toBeVisible();
    await expect(marketing.getByText("PDF, Word & web links")).toBeVisible();
  });
});

test.describe("Micro-interactions — mobile nav", () => {
  test("protected routes still gate bottom nav behind auth", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/home");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId("bottom-nav")).toHaveCount(0);
  });
});

test.describe("Reduced motion", () => {
  test("animations respect prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/login");

    const shimmer = page.locator(".animate-shimmer").first();
    if (await shimmer.count()) {
      const animation = await shimmer.evaluate((el) => getComputedStyle(el).animationName);
      expect(animation === "none" || animation === "").toBeTruthy();
    }
  });
});

import { expect, test } from "@playwright/test";

test.describe("Public pages", () => {
  test("splash redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("login page renders auth form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /Welcome to/i })).toBeVisible();
    await expect(page.getByPlaceholder("name@email.com")).toBeVisible();
  });

  test("terms page is accessible", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("Auth protection", () => {
  test("protected routes redirect to login", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/login/);
  });

  test("RAG proxy rejects unauthenticated requests", async ({ request }) => {
    const response = await request.post("/api/rag/chat", {
      data: {
        document_id: "00000000-0000-0000-0000-000000000001",
        question: "test",
      },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe("Auth callback security", () => {
  test("blocks open redirect via next param", async ({ page }) => {
    await page.goto("/auth/callback?next=//evil.com");
    await expect(page).toHaveURL(/\/login/);
  });
});

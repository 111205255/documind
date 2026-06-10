import { expect, test as setup } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    setup.skip(true, "Set E2E_EMAIL and E2E_PASSWORD to run authenticated tests.");
    return;
  }

  await page.goto("/login");
  await page.getByPlaceholder("name@email.com").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: /Continue|Sign in/i }).click();
  await expect(page).toHaveURL(/\/home/, { timeout: 20_000 });
  await page.context().storageState({ path: authFile });
});

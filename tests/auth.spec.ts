import { test, expect } from "@playwright/test";
import { signIn } from "./helpers";

test.describe("Auth", () => {
  test("should show auth screen when not logged in", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Invio")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
  });

  test("should show error on wrong password", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForSelector("input[placeholder='Enter username']");
    await page
      .getByPlaceholder("Enter username")
      .fill(process.env.TEST_USERNAME!);
    await page.getByPlaceholder("Enter password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).last().click();
    await expect(page.getByText(/invalid password/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("should sign in successfully", async ({ page }) => {
    await signIn(page);
    await expect(page).toHaveURL(/dashboard/);
  });

  test("should sign out successfully", async ({ page }) => {
    await signIn(page);

    // sidebar sign out button
    await page.getByRole("button", { name: /sign out/i }).click();

    // confirm dialog
    await page
      .getByRole("button", { name: /confirm|yes|sign out/i })
      .last()
      .click();

    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible({
      timeout: 5000,
    });
  });
});

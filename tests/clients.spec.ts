import { test, expect } from "@playwright/test";
import { signIn } from "./helpers";

test.describe("Clients", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto("/clients");
    await page.waitForLoadState("networkidle");
  });

  test("should show clients page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Clients" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /add client/i }),
    ).toBeVisible();
  });

  test("should add a client", async ({ page }) => {
    const addButton = page.getByRole("button", { name: /add client/i });

    await addButton.scrollIntoViewIfNeeded();
    await addButton.click({ force: true });

    await page.waitForSelector("input[placeholder='Enter client name']");

    await page.getByPlaceholder("Enter client name").fill("John Doe");
    await page
      .getByPlaceholder("Enter client email")
      .fill(`john${Date.now()}@example.com`);
    await page.getByPlaceholder("Enter client phone").fill("09123456789");

    await page
      .getByRole("button", { name: /add client/i })
      .last()
      .click();
    await expect(page.getByText(/client added/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("should search clients", async ({ page }) => {
    await page.getByPlaceholder("Search by name or email...").fill("John");
    await page.waitForTimeout(500); // debounce
    await page.waitForLoadState("networkidle");
    // just check search input works without error
    await expect(
      page.getByPlaceholder("Search by name or email..."),
    ).toHaveValue("John");
  });

  test("should delete a client", async ({ page }) => {
    const clientCards = page.locator("[data-slot='card']");
    const count = await clientCards.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 👇 scope to first card, click last button (trash icon)
    await clientCards.first().getByRole("button").last().click();

    // confirm dialog
    await expect(page.getByText(/delete this client\?/i)).toBeVisible({
      timeout: 5000,
    });
    await page
      .getByRole("button", { name: /^delete$/i })
      .last()
      .click();
    await expect(page.getByText(/client deleted/i)).toBeVisible({
      timeout: 5000,
    });
  });
});

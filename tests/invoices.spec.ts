import { test, expect } from "@playwright/test";
import { signIn } from "./helpers";

test.describe("Invoices", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto("/invoices");
    await page.waitForLoadState("networkidle");
  });

  test("should show invoices page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Invoices" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /new invoice/i }),
    ).toBeVisible();
  });

  test("should filter invoices by status", async ({ page }) => {
    await page.getByRole("button", { name: "PAID" }).click();
    await expect(page).toHaveURL(/status=PAID/);
  });

  test("should search invoices", async ({ page }) => {
    await page
      .getByPlaceholder("Search by invoice number or client...")
      .fill("INV");
    await page.waitForTimeout(500);
    await expect(
      page.getByPlaceholder("Search by invoice number or client..."),
    ).toHaveValue("INV");
  });

  test("should navigate to new invoice page", async ({ page }) => {
    await page.getByRole("link", { name: /new invoice/i }).click();
    await expect(page).toHaveURL(/invoices\/new/);
    await expect(
      page.getByRole("heading", { name: /new invoice/i }),
    ).toBeVisible();
  });
});

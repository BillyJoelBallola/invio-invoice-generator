import { test, expect } from "@playwright/test";
import { signIn } from "./helpers";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.waitForURL("**/dashboard");
    await page.waitForLoadState("networkidle");
  });

  test("should show summary cards", async ({ page }) => {
    await page.waitForSelector("text=Total Invoices", { timeout: 15000 });
    await expect(page.getByText("Total Invoices")).toBeVisible();
    await expect(page.getByText("Paid")).toBeVisible();
    await expect(page.getByText(/Overdue/)).toBeVisible();
    await expect(page.getByText("Drafts")).toBeVisible();
  });

  test("should show charts", async ({ page }) => {
    await expect(page.getByText("Monthly Revenue")).toBeVisible();
    await expect(page.getByText("Invoice Status")).toBeVisible();
  });

  test("should show recent invoices section", async ({ page }) => {
    await expect(page.getByText("Recent Invoices")).toBeVisible();
  });
});

import { Page } from "@playwright/test";

export async function signIn(page: Page) {
  const username = process.env.TEST_USERNAME!;
  const password = process.env.TEST_PASSWORD!;

  await page.goto("/");

  // wait for auth screen
  await page.waitForSelector("text=Invio");

  await page.getByRole("button", { name: "Sign In" }).click();

  // wait for dialog to open
  await page.waitForSelector("input[placeholder='Enter username']");

  await page.getByPlaceholder("Enter username").fill(username);
  await page.getByPlaceholder("Enter password").fill(password);

  // click the submit button inside the dialog
  await page.getByRole("button", { name: "Sign In" }).last().click();

  // wait for redirect
  await page.waitForURL("**/dashboard", { timeout: 10000 });
}

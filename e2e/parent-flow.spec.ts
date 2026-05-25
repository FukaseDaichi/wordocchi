import { expect, test } from "@playwright/test";

test("parent can start a round and pick a secret criterion", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await page.getByRole("button", { name: "とじる" }).click();
  await page.getByRole("button", { name: "新しくはじめる" }).click();
  await expect(page.getByRole("heading", { name: "ヒミツのキジュンを選ぼう" })).toBeVisible();
  await page.locator("button").filter({ hasText: "候補 1" }).click();
  await expect(page.getByRole("heading", { name: "3つのワードを子に伝えよう" })).toBeVisible();
  await expect(page.getByText("ワード 1")).toBeVisible();
});

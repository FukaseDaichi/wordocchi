import { expect, test } from "@playwright/test";

test("parent can start a round and pick a secret criterion", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");

  // Rules carousel opens on first visit. Skip to the last slide via dots.
  const closeRules = page.getByRole("button", { name: "閉じる" }).first();
  await closeRules.click();

  // Tap the primary "はじめる" action in the footer to start a round.
  await page.getByRole("button", { name: /^はじめる/ }).first().click();

  await expect(page.getByRole("heading", { name: "ヒミツのキジュンを選ぼう" })).toBeVisible();
  await page.locator("button").filter({ hasText: "候補 1" }).click();

  await expect(page.getByRole("heading", { name: "3つのワードを子に伝えよう" })).toBeVisible();
  await expect(page.getByText("ワード 1")).toBeVisible();
});

test("restart button always available and confirms during a round", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");

  await page.getByRole("button", { name: "閉じる" }).first().click();

  // Footer "新しくはじめる" always visible.
  const restart = page.getByRole("button", { name: "新しくはじめる" });
  await expect(restart).toBeVisible();

  // Start a round so we are mid-progress.
  await page.getByRole("button", { name: /^はじめる/ }).first().click();
  await expect(page.getByRole("heading", { name: "ヒミツのキジュンを選ぼう" })).toBeVisible();

  // Tapping restart now opens a confirm dialog.
  await restart.click();
  await expect(page.getByRole("heading", { name: "新しくはじめますか？" })).toBeVisible();
  await page.getByRole("button", { name: "やめる" }).click();
  await expect(page.getByRole("heading", { name: "ヒミツのキジュンを選ぼう" })).toBeVisible();
});

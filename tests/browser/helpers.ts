import { type Page } from "@playwright/test";

/** Exercise the visible Radix popup, including its scrollable choices. */
export async function chooseOption(page: Page, label: string, value: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page
    .getByRole("option")
    .and(page.locator(`[data-value=${JSON.stringify(value)}]`))
    .click();
}

import { test, expect } from "@playwright/test";

test("source links reveal undated tracks on desktop and mobile", async ({
  page,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/sources");
    await page
      .getByRole("textbox", { name: "Search sources" })
      .fill("Terra Atlantis I —");
    await expect(page.locator(".source-card")).toHaveCount(1);
    await page
      .getByRole("link", { name: "Explore entries", exact: true })
      .click();
    await expect(page.locator(".event-grid .event-card")).toHaveCount(3);
    await expect(page.locator(".event-grid")).toContainText(
      "Val Ellam: formation of Atlantis",
    );
    await expect(
      page.getByRole("checkbox", { name: "Selected tracks only" }),
    ).not.toBeChecked();
    await page
      .getByRole("link", { name: /Val Ellam: formation of Atlantis/ })
      .click();
    await expect(page.getByRole("dialog")).toContainText(
      "Official synopsis only",
    );
    await expect(page.getByRole("dialog")).toContainText(
      "DETALHES · paragraph 3",
    );
    await page.keyboard.press("Escape");
    await expect(page.locator(".event-grid .event-card")).toHaveCount(3);
  }
});

import { test, expect } from "@playwright/test";

test("book coverage search, chapter links and edition limits work on desktop and mobile", async ({
  page,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/books");
    const search = page.getByRole("textbox", {
      name: "Search books and sections",
    });
    await search.fill("Poetic Edda");
    await expect(page.locator(".book-card")).toHaveCount(1);
    await expect(page.locator(".book-card")).toContainText(
      "35 linked accounts",
    );
    await expect(page.locator(".book-card")).toContainText("Review incomplete");
    await page.reload();
    await expect(search).toHaveValue("Poetic Edda");
    await page
      .getByRole("button", { name: "Show sections of Poetic Edda" })
      .click();
    await expect(page.locator(".book-section-list li")).toHaveCount(20);
    await page.getByRole("button", { name: "Show 20 more sections" }).click();
    await expect(page.locator(".book-section-list li")).toHaveCount(35);
    const passage = page.getByRole("link", {
      name: "Odin obtains the runes",
      exact: true,
    });
    await passage.scrollIntoViewIfNeeded();
    const readingPosition = await page.evaluate(() => scrollY);
    await passage.click();
    await expect(page.getByRole("dialog")).toContainText("Hovamol · 139–142");
    await expect(page.getByRole("dialog")).toContainText("not every episode");
    await expect(page).toHaveURL(
      /#\/books\/event\/edda-hovamol\?q=Poetic\+Edda$/,
    );
    await page
      .getByRole("button", { name: "Close dialog", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(search).toHaveValue("Poetic Edda");
    await expect(page.locator(".book-section-list li")).toHaveCount(35);
    await expect(passage).toBeFocused();
    expect(
      Math.abs((await page.evaluate(() => scrollY)) - readingPosition),
    ).toBeLessThan(2);
    await passage.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator(".book-section-list li")).toHaveCount(35);
    await passage.click();
    await page.reload();
    await expect(page.getByRole("dialog")).toContainText("Hovamol · 139–142");
    await page
      .getByRole("button", { name: "Close dialog", exact: true })
      .click();
    await expect(search).toHaveValue("Poetic Edda");
    await page.goto("/#/books?q=Vishnu");
    await expect(page.locator(".book-card")).toContainText(
      "126 sections listed",
    );
    await page
      .getByRole("button", { name: "Show sections of Vishnu Purana" })
      .click();
    await expect(page.locator(".book-section-list li").first()).toContainText(
      "Wilson’s chapter heading",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await search.fill("");
    await page.getByRole("combobox", { name: "Edition access" }).click();
    await page
      .getByRole("option", { name: "Synopsis only", exact: true })
      .click();
    await expect(page.locator(".book-card")).toHaveCount(5);
    await expect(
      page.locator(".book-card").filter({ hasText: "Terra Atlantis I —" }),
    ).toContainText("full book extraction skipped");
    await search.fill("unfindable-book-title");
    await expect(
      page.getByText("No books or sections match these filters."),
    ).toBeVisible();
  }
});

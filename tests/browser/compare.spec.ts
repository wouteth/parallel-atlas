import { chooseOption } from "./helpers";
import { test, expect } from "@playwright/test";

test("comparison links preserve distinct accounts, citations, and filtered choices", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#/timeline/event/plato-atlantis");
  await page.getByRole("link", { name: "Compare this account" }).click();
  await expect(page.locator(".compare-card")).toHaveCount(2);
  await chooseOption(page, "Account 1", "younger-dryas-gicc05");
  await chooseOption(page, "Account 2", "impact-hypothesis-2007");
  await expect(page.locator(".compare-card").first()).toContainText(
    "10,897 BCE",
  );
  await expect(page.locator(".compare-card").first()).toContainText("Table 4");
  await expect(page.locator(".compare-card").nth(1)).toContainText(
    "Publication year",
  );
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "Copy comparison link" }).click();
  await expect(
    page.getByRole("button", { name: "Comparison link copied" }),
  ).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain(
    "left=younger-dryas-gicc05&right=impact-hypothesis-2007",
  );
  await page.goto(copied);
  await page.reload();
  await expect(page.getByLabel("Account 2", { exact: true })).toHaveAttribute(
    "data-value",
    "impact-hypothesis-2007",
  );
  await page
    .getByRole("textbox", { name: "Find accounts to compare" })
    .fill("Exodus");
  await expect(page.getByLabel("Account 1", { exact: true })).toHaveAttribute(
    "data-value",
    "younger-dryas-gicc05",
  );
  await chooseOption(page, "Account 1", "sea-crossing");
  await expect(page.locator(".compare-card").first()).toContainText("Unplaced");
  await page
    .getByRole("textbox", { name: "Find accounts to compare" })
    .fill("");
  await chooseOption(page, "Account 2", "sea-crossing");
  await expect(page.getByLabel("Account 1", { exact: true })).toHaveAttribute(
    "data-value",
    "impact-hypothesis-2007",
  );
  await page.goto("/#/compare?left=plato-atlantis&right=ra-atlantis");
  await page.screenshot({
    path: "artifacts/desktop-comparison.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("comparison remains readable on mobile and recovers from stale links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/compare?left=missing-entry&right=ra-atlantis");
  await expect(page.getByRole("status")).toContainText("could not be found");
  await expect(page.locator(".compare-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page
      .getByRole("navigation")
      .getByRole("link", { name: "Compare", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close navigation" }).click();
  for (const width of [320, 390, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${width}px overflow`,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/compare?left=plato-atlantis&right=ra-atlantis");
  await page.screenshot({
    path: "artifacts/mobile-comparison.png",
    fullPage: true,
  });
});

test("an overlapping historical period stays visible after panning past its start", async ({
  page,
}) => {
  await page.goto("/#/timeline?focus=dholavira");
  for (let step = 0; step < 3; step++)
    await page.getByRole("button", { name: "Pan later", exact: true }).click();
  await expect(page.locator('[data-event-range="dholavira"]')).toHaveCount(1);
  const segment = page.locator('[data-event-range="dholavira"]');
  expect(Number(await segment.getAttribute("x1"))).toBe(48);
  expect(Number(await segment.getAttribute("x2"))).toBeGreaterThan(48);
  const cluster = page
    .locator(".timeline-event")
    .filter({ hasText: "Dholavira" });
  await expect(cluster).toBeVisible();
  await cluster.click();
  await expect(page.getByRole("dialog")).toContainText("Dholavira");
});

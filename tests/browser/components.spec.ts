import { test, expect } from "@playwright/test";

test("filters, track choices and disclosures work with a keyboard and preserve the view", async ({
  page,
}) => {
  await page.goto("/#/timeline");
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  const evidence = page.getByRole("combobox", {
    name: "Evidence type",
    exact: true,
  });
  await evidence.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("option", { name: "All types of account", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("option", { name: "Archaeology", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(evidence).toHaveAttribute("data-value", "Archaeology");
  await expect(evidence).toBeFocused();
  await page.reload();
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await expect(evidence).toHaveAttribute("data-value", "Archaeology");
  await page
    .getByRole("button", { name: "Choose tracks 7/12", exact: true })
    .click();
  const bible = page.getByRole("checkbox", { name: /^The Bible / });
  await bible.focus();
  await page.keyboard.press("Space");
  await expect(bible).not.toBeChecked();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Choose tracks 6/12", exact: true }),
  ).toBeFocused();
  await page.getByRole("radio", { name: "Timeline", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("radio", { name: /^Account list/ }),
  ).toBeFocused();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("region", { name: "Account list", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: "Selected tracks only", exact: true }),
  ).toBeChecked();
  const coverage = page.getByRole("button", {
    name: "Compare coverage across all 12 tracks",
    exact: true,
  });
  await coverage.focus();
  await page.keyboard.press("Enter");
  await expect(coverage).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".comparison-cell")).toHaveCount(12);
  await page.keyboard.press("Enter");
  await expect(coverage).toHaveAttribute("aria-expanded", "false");
});

test("library menus support keyboard navigation and dialogs contain then restore focus", async ({
  page,
}) => {
  await page.goto("/#/timeline");
  const reference = page.getByRole("button", {
    name: "Reference",
    exact: true,
  });
  await reference.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "Glossary", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(reference).toBeFocused();
  await reference.click();
  await page.getByRole("menuitem", { name: "Glossary", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Glossary", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "The timeline", exact: true }).click();
  const picker = page.getByRole("button", {
    name: "Choose tracks 7/12",
    exact: true,
  });
  await picker.click();
  const dialog = page.getByRole("dialog", {
    name: "Choose timeline tracks",
    exact: true,
  });
  await expect(
    dialog.getByRole("button", { name: "Close dialog", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "Done", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close dialog", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(picker).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page.getByRole("button", { name: "Reference", exact: true }).click();
  await page.getByRole("menuitem", { name: "Sources", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Sources", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open navigation", exact: true }),
  ).toBeVisible();
});

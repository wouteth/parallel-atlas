import { test, expect } from "@playwright/test";

test("the production site supports research without APIs, saved data or write controls", async ({
  page,
}) => {
  const requests: { method: string; path: string }[] = [];
  const errors: string[] = [];
  page.on("request", (request) =>
    requests.push({
      method: request.method(),
      path: new URL(request.url()).pathname,
    }),
  );
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    for (const method of ["setItem", "removeItem", "clear"] as const) {
      Storage.prototype[method] = () => {
        throw new Error(`Unexpected browser storage write: ${method}`);
      };
    }
    indexedDB.open = () => {
      throw new Error("Unexpected database access");
    };
  });
  await page.goto("/#/timeline");
  await page.getByRole("textbox", { name: "Search timeline" }).fill("Atlantis");
  await page.getByRole("button", { name: "Fit results", exact: true }).click();
  await page.getByRole("radio", { name: /^Account list/ }).click();
  await expect(page.locator(".event-card").first()).toBeVisible();
  await page.locator(".event-card").first().click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Sources", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: /^(Bookmark|Favorite|Saved|Save tracks|Publish note|Sign out)$/,
    }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "Search timeline" }),
  ).toHaveValue("Atlantis");
  for (const route of [
    "compare",
    "map",
    "connections",
    "sources",
    "glossary",
    "symbols",
    "mission",
    "methodology",
    "quests",
    "what-would-change",
    "collaborators",
    "changelog",
  ]) {
    await page.goto(`/#/${route}`);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(
      page.locator(
        'a[href="#/account"],a[href="#/library"],a[href="#/combinations"],a[href^="/api/"]',
      ),
    ).toHaveCount(0);
    await expect(page.locator("textarea")).toHaveCount(0);
  }
  await page.goto("/#/map");
  await expect(page.locator(".world-map > path")).toHaveCount(3);
  expect(
    requests.filter((request) => request.path.startsWith("/api/")),
  ).toEqual([]);
  expect(
    requests.filter((request) => !["GET", "HEAD"].includes(request.method)),
  ).toEqual([]);
  expect(errors).toEqual([]);
});

test("retired personal routes expose no account or data-editing flows", async ({
  page,
}) => {
  for (const route of ["account", "library", "combinations"]) {
    await page.goto(`/#/${route}`);
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
    await expect(page.locator("form,input,textarea")).toHaveCount(0);
    await page
      .getByRole("link", { name: "Return to the timeline", exact: true })
      .click();
    await expect(
      page.getByRole("textbox", { name: "Search timeline" }),
    ).toBeVisible();
  }
});

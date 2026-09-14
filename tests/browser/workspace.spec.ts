import { chooseOption } from "./helpers";
import { test, expect } from "@playwright/test";

test("search finds accounts on unselected tracks without replacing the comparison", async ({
  page,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/timeline?tracks=mainstream,plato&dates=dated");
    await page
      .getByRole("textbox", { name: "Search timeline", exact: true })
      .fill("Odin");
    await expect(
      page.getByRole("radio", { name: "Account list 0", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".search-scope-notice")).toContainText(
      "on other tracks",
    );
    await page.getByRole("button", { name: /^View all \d+ matches$/ }).click();
    await expect(
      page.getByRole("region", { name: "Account list", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Odin obtains the runes",
        exact: true,
      }),
    ).toBeVisible();
    const params = new URLSearchParams(new URL(page.url()).hash.split("?")[1]);
    expect(params.get("tracks")).toBe("mainstream,plato");
    expect(params.get("q")).toBe("Odin");
    expect(params.get("scope")).toBe("all");
    expect(params.has("dates")).toBe(false);
    await expect(
      page.getByRole("checkbox", { name: "Selected tracks only" }),
    ).not.toBeChecked();
    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: "Odin obtains the runes",
        exact: true,
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("source searches survive reload and returning from linked entries", async ({
  page,
}) => {
  await page.goto("/#/sources");
  const search = page.getByRole("textbox", {
    name: "Search sources",
    exact: true,
  });
  await search.fill("Bellows");
  await expect(page.locator(".source-card")).toHaveCount(1);
  await page.reload();
  await expect(search).toHaveValue("Bellows");
  await page
    .getByRole("link", { name: "Explore entries", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Account list", exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(search).toHaveValue("Bellows");
  await expect(page.locator(".source-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(page.getByRole("status")).toHaveText("97 matching sources");
});

test("topic shortcuts, custom dates and open-close preserve the research context", async ({
  page,
}) => {
  await page.goto("/#/timeline");
  await page.getByRole("button", { name: "Atlantis", exact: true }).click();
  await page.getByRole("button", { name: "Set dates", exact: true }).click();
  await page.getByLabel("Start year", { exact: true }).fill("0");
  await page.getByRole("button", { name: "Apply dates", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("greater than zero");
  await page.getByLabel("Start year", { exact: true }).fill("12000");
  await page.getByLabel("End year", { exact: true }).fill("8000");
  await chooseOption(page, "End era", "BCE");
  await page.getByRole("button", { name: "Apply dates", exact: true }).click();
  await expect(page.locator(".range-label")).toHaveText(
    "12,000 BCE — 8,000 BCE",
  );
  const account = page.getByRole("button", {
    name: "The story of Atlantis, Plato’s dialogues",
    exact: true,
  });
  await account.scrollIntoViewIfNeeded();
  const position = await page.evaluate(() => scrollY);
  await account.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  expect(
    Math.abs((await page.evaluate(() => scrollY)) - position),
  ).toBeLessThan(2);
  await expect(page.locator(".range-label")).toHaveText(
    "12,000 BCE — 8,000 BCE",
  );
  await page.reload();
  await expect(page.locator(".active-filters")).toContainText("Atlantis");
  await expect(page.locator(".range-label")).toHaveText(
    "12,000 BCE — 8,000 BCE",
  );
  await page.getByRole("link", { name: "World map", exact: true }).click();
  await page.getByRole("link", { name: "The timeline", exact: true }).click();
  await expect(page.locator(".range-label")).toHaveText(
    "12,000 BCE — 8,000 BCE",
  );
});

test("ordinary scrolling does not zoom, and deliberate zoom survives reload of a focused link", async ({
  page,
}) => {
  await page.goto("/#/timeline?focus=plato-atlantis");
  await page.getByRole("button", { name: "Zoom out", exact: true }).click();
  const range = await page.locator(".range-label").textContent();
  await page.locator(".timeline-canvas").hover();
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 200);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  await expect(page.locator(".range-label")).toHaveText(range!);
  await page.keyboard.down("Control");
  await page.mouse.wheel(0, -200);
  await page.keyboard.up("Control");
  await expect(page.locator(".range-label")).not.toHaveText(range!);
  const zoomed = await page.locator(".range-label").textContent();
  await page.reload();
  await expect(page.locator(".range-label")).toHaveText(zoomed!);
});

test("undated tracks have a usable reading path and mobile movement is opt-in", async ({
  page,
}) => {
  await page.goto("/#/timeline?tracks=hindu,norse");
  await expect(page.locator(".timeline-empty")).toContainText(
    "No dated accounts",
  );
  await page
    .getByRole("button", { name: "Browse accounts", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Account list", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".event-card")).toHaveCount(12);
  await expect(page.locator(".catalog-pagination")).toContainText("of 81");
  await page.locator(".event-card").first().click();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Account list", exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("radio", { name: "Timeline", exact: true }).click();
  await expect(page.locator(".timeline-canvas")).toHaveCSS(
    "touch-action",
    "pan-y",
  );
  await page
    .getByRole("button", { name: "Move timeline", exact: true })
    .click();
  await expect(page.locator(".timeline-canvas")).toHaveCSS(
    "touch-action",
    "none",
  );
  await page.getByRole("button", { name: "Done moving", exact: true }).click();
  await expect(page.locator(".timeline-canvas")).toHaveCSS(
    "touch-action",
    "pan-y",
  );
  for (const width of [320, 390, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${width}px workspace overflow`,
    ).toBe(true);
  }
});

test("regional map focus separates places and map selection displays its sourcing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/map");
  await page
    .getByRole("button", { name: "Focus mapped places", exact: true })
    .click();
  expect(
    Number(
      (await page.locator(".world-map").getAttribute("viewBox"))!.split(" ")[2],
    ),
  ).toBeLessThan(960);
  await page
    .getByRole("button", { name: "Inspect location: Eridu", exact: true })
    .click();
  await expect(page.locator("article[aria-live]")).toContainText("Tell Eridu");
  await page.getByRole("button", { name: "Whole world", exact: true }).click();
  await expect(page.locator(".world-map")).toHaveAttribute(
    "viewBox",
    "0 0 960 490",
  );
  await chooseOption(page, "Map track", "plato");
  await expect(
    page.getByRole("button", { name: "Focus mapped places", exact: true }),
  ).toBeDisabled();
  await expect(page.locator("article[aria-live]")).toContainText(
    "No specific modern coordinates",
  );
});

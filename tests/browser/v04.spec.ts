import { chooseOption } from "./helpers";
import { test, expect } from "@playwright/test";

test("graph filters expose point lists and map keeps unsupported locations unplotted", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#/connections");
  await expect(page.locator(".connection-graph [role=button]")).toHaveCount(7);
  const graphGeometry = await page
    .locator(".connection-graph")
    .evaluate((svg) => {
      const centers = (selector: string) =>
        [...svg.querySelectorAll(selector)].map((node) => ({
          x: Number(node.getAttribute("cx")),
          y: Number(node.getAttribute("cy")),
        }));
      return {
        points: centers('[role="button"] circle'),
        nodes: centers("g:not([role]) > circle"),
      };
    });
  for (const point of graphGeometry.points) {
    for (const node of graphGeometry.nodes) {
      expect(Math.hypot(point.x - node.x, point.y - node.y)).toBeGreaterThan(
        36,
      );
    }
  }
  await page
    .getByRole("button", {
      name: "Ragnarok ↔ Lucifer Rebellion · 1",
      exact: true,
    })
    .click();
  await expect(page.locator("article[aria-live]")).toContainText(
    "200,000 years ago",
  );
  await chooseOption(page, "Match confidence", "Strong match");
  await expect(page.getByRole("status")).toContainText("No connections match");
  await chooseOption(page, "Match confidence", "all");
  await page.screenshot({
    path: "artifacts/v04-connections.png",
    fullPage: true,
  });
  await page.goto("/#/map");
  await expect(page.locator(".world-map > path")).toHaveCount(3);
  await chooseOption(page, "Map track", "plato");
  await expect(page.locator(".world-map [role=button]")).toHaveCount(0);
  await page
    .getByRole("button", { name: /Atlantis beyond the Pillars/ })
    .click();
  await expect(page.locator("article[aria-live]")).toContainText(
    "No specific modern coordinates",
  );
  await chooseOption(page, "Map track", "all");
  await page.screenshot({ path: "artifacts/v04-map.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("counts stay neutral, deep time is navigable, and new pages fit narrow screens", async ({
  page,
}) => {
  await page.goto("/#/timeline/event/plato-atlantis");
  await page.locator(".source-count .pt-disclosure-trigger").click();
  await expect(page.locator(".source-count")).toContainText(
    "3 tracks · 5 cited sources",
  );
  await expect(page.locator(".source-count")).toContainText(
    "do not measure credibility",
  );
  await page.keyboard.press("Escape");
  await page.goto("/#/timeline?focus=urantia-andronover");
  await expect(
    page
      .locator(".timeline-event")
      .filter({ hasText: "Conditions for Andronover" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Deep time", exact: true }).click();
  await expect(page.locator(".range-label")).toContainText("billion BCE");
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "methodology",
      "connections",
      "map",
      "quests",
      "what-would-change",
      "collaborators",
      "changelog",
    ]) {
      await page.goto(`/#/${route}`);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/map");
  await page.screenshot({
    path: "artifacts/v04-map-mobile.png",
    fullPage: true,
  });
});

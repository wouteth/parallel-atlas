import { test, expect } from "@playwright/test";

test("catalog search, pagination, undated accounts, and downloadable data", async ({
  page,
}) => {
  await page.goto("/#/timeline");
  await expect(page.locator(".event-card")).toHaveCount(12);
  await page.getByRole("button", { name: "Load 12 more accounts" }).click();
  await expect(page.locator(".event-card")).toHaveCount(24);
  await page
    .getByRole("textbox", { name: "Search timeline" })
    .fill("gobekli tepe");
  await expect(page.locator(".event-card")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Search timeline" }).fill("Noah");
  await page.getByRole("button", { name: "Undated", exact: true }).click();
  await expect(page.locator(".event-card")).toHaveCount(1);
  await page.locator(".event-card").click();
  await expect(page.getByRole("dialog")).toContainText("Undated in Genesis");
  await expect(
    page.getByRole("dialog").locator(".event-date"),
  ).not.toContainText("BCE");
  await page.keyboard.press("Escape");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export results" }).click();
  expect((await downloaded).suggestedFilename()).toBe(
    "parallel-atlas-events.json",
  );
});

test("desktop clustering preserves separate stripes and opens every nearby account", async ({
  page,
}) => {
  await page.goto("/#/timeline");
  await expect(page.locator("[data-track-line]")).toHaveCount(6);
  const lines = await page
    .locator("[data-track-line]")
    .evaluateAll((nodes) => nodes.map((n) => Number(n.getAttribute("y1"))));
  expect(Math.max(...lines) - Math.min(...lines)).toBe(60);
  const cluster = page
    .locator(".timeline-event")
    .filter({ has: page.locator("b") })
    .first();
  const label = await cluster.getAttribute("aria-label");
  const count = Number(label?.match(/(\d+) nearby/)?.[1]);
  await cluster.click();
  await expect(page.getByRole("dialog").locator(".list-link")).toHaveCount(
    count,
  );
  await page.keyboard.press("Escape");
  await page.locator(".timeline-canvas").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/desktop-timeline.png" });
});

test("mobile retains two independent lines, swaps tracks, and contains dense labels", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/timeline");
  await page.getByLabel("Right track").selectOption("law-of-one");
  await expect(page.locator("[data-track-line]")).toHaveCount(2);
  const tracks = await page.locator("[data-track-line]").evaluateAll((nodes) =>
    nodes.map((n) => ({
      id: (n as SVGElement).dataset.trackLine,
      x: Number(n.getAttribute("x1")),
      color: n.getAttribute("stroke"),
    })),
  );
  expect(tracks.map((t) => t.id)).toEqual(["mainstream", "law-of-one"]);
  expect(tracks[0]!.x).not.toBe(tracks[1]!.x);
  expect(tracks[0]!.color).not.toBe(tracks[1]!.color);
  const bounds = await page.locator(".timeline-canvas").evaluate((canvas) => {
    const outer = canvas.getBoundingClientRect();
    const cards = [...canvas.querySelectorAll(".timeline-event")].map((n) =>
      n.getBoundingClientRect(),
    );
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      contained: cards.every(
        (r) =>
          r.left >= outer.left &&
          r.right <= outer.right &&
          r.bottom <= outer.bottom,
      ),
      overlap: cards.some((a, i) =>
        cards
          .slice(i + 1)
          .some(
            (b) =>
              a.left < b.right &&
              a.right > b.left &&
              a.top < b.bottom &&
              a.bottom > b.top,
          ),
      ),
    };
  });
  expect(bounds).toEqual({ overflow: false, contained: true, overlap: false });
  await page.locator(".timeline-canvas").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/mobile-timeline.png" });
  await page.getByLabel("Left track").selectOption("law-of-one");
  await expect(page.getByLabel("Right track")).toHaveValue("mainstream");
  await page.getByRole("button", { name: "Modern era", exact: true }).click();
  for (let i = 0; i < 8; i++)
    await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(page.locator(".marker-caption")).toHaveText("1-year intervals");
});

test("source navigation, museum lightbox, and guest bookmarks survive reload", async ({
  page,
}) => {
  await page.goto("/#/sources");
  await page.getByRole("textbox", { name: "Search sources" }).fill("NASA");
  await expect(page.locator(".source-card")).toHaveCount(1);
  await page.getByRole("link", { name: "Explore entries" }).click();
  await expect(page.locator(".event-card")).toHaveCount(1);
  await page.goto("/#/timeline/event/ankh-thutmose");
  await page.getByRole("button", { name: "Bookmark", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Saved", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Saved", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Enlarge picture" }).click();
  await expect(
    page.getByRole("dialog", { name: "Enlarged event picture" }),
  ).toContainText("public domain");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await page.goto("/#/symbols/star-of-david");
  await expect(page.locator(".usage-grid")).toContainText("October 28, 1948");
  await expect(page.locator(".event-card")).toHaveCount(1);
});

test("a deep link reveals an older event on an initially unselected mobile track", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/timeline?focus=urantia-adam-arrival");
  await expect(page.getByLabel("Right track")).toHaveValue("urantia");
  await expect(
    page.locator(".timeline-event").filter({ hasText: "Adam and Eve arrive" }),
  ).toBeVisible();
  await expect(page.locator(".range-label")).toContainText("BCE");
});

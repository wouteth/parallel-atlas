import { test, expect, type Page } from "@playwright/test";

function windowDates(page: Page) {
  const query = new URLSearchParams(page.url().split("?")[1]);
  return [Number(query.get("from")), Number(query.get("to"))];
}

test("sideways trackpad and Shift-wheel pan both ways without zooming or scrolling the page", async ({
  page,
}) => {
  await page.goto("/#/timeline?from=-12000&to=-8000");
  // Font swaps can move the browser's scroll anchor by a few pixels.
  await page.evaluate(() => document.fonts.ready);
  const canvas = page.locator(".timeline-canvas");
  await canvas.hover();
  const scroll = await page.evaluate(() => scrollY);
  await page.mouse.wheel(-120, 5);
  await expect.poll(() => windowDates(page)[0]).toBeLessThan(-12000);
  expect(windowDates(page)[1]! - windowDates(page)[0]!).toBeCloseTo(4000, 5);
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  const earlier = windowDates(page)[0]!;
  await page.mouse.wheel(240, 0);
  await expect.poll(() => windowDates(page)[0]).toBeGreaterThan(earlier);
  const later = windowDates(page)[0]!;
  await page.keyboard.down("Shift");
  await page.mouse.wheel(0, -120);
  await page.keyboard.up("Shift");
  await expect.poll(() => windowDates(page)[0]).toBeLessThan(later);
  expect(windowDates(page)[1]! - windowDates(page)[0]!).toBeCloseTo(4000, 5);
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  const range = await page.locator(".range-label").textContent();
  await page.reload();
  await expect(page.locator(".range-label")).toHaveText(range!);
});

test("line and page wheel deltas pan proportionally while vertical intent stays with the page", async ({
  page,
}) => {
  await page.goto("/#/timeline?from=-12000&to=-8000");
  const canvas = page.locator(".timeline-canvas");
  await canvas.hover();
  const length = (await canvas.boundingBox())!.width - 96;
  await canvas.dispatchEvent("wheel", { deltaX: -3, deltaY: 0, deltaMode: 1 });
  await expect
    .poll(() => windowDates(page)[0])
    .toBeCloseTo(-12000 - (48 / length) * 4000, 5);
  const start = windowDates(page)[0]!;
  await canvas.dispatchEvent("wheel", { deltaX: -1, deltaY: 0, deltaMode: 2 });
  await expect.poll(() => windowDates(page)[0]).toBeCloseTo(start - 4000, 5);
  const range = await page.locator(".range-label").textContent();
  const scroll = await page.evaluate(() => scrollY);
  await page.mouse.wheel(5, 160);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(scroll);
  await expect(page.locator(".range-label")).toHaveText(range!);
});

test("dragging a card image pans without opening it, then a click still opens its sources", async ({
  page,
}) => {
  await page.goto("/#/timeline?tracks=plato&from=-12000&to=-8000");
  const card = page.getByRole("button", {
    name: "The story of Atlantis, Plato’s dialogues",
    exact: true,
  });
  await card.scrollIntoViewIfNeeded();
  const box = (await card.locator("img").boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 90, box.y + box.height / 2, {
    steps: 12,
  });
  await expect(page.locator(".timeline-canvas")).toHaveClass(/is-dragging/);
  await page.mouse.up();
  await expect.poll(() => windowDates(page)[0]).toBeLessThan(-12000);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".timeline-canvas")).not.toHaveClass(/is-dragging/);
  const range = await page.locator(".range-label").textContent();
  const moved = (await card.boundingBox())!;
  await page.mouse.move(moved.x + 50, moved.y + 30);
  await page.mouse.down();
  await page.mouse.move(moved.x + 52, moved.y + 30);
  await page.mouse.up();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".range-label")).toHaveText(range!);
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("navigation limits are visible and keyboard panning works in both directions", async ({
  page,
}) => {
  await page.goto("/#/timeline");
  await expect(
    page.getByRole("button", { name: "Pan later", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".timeline-limit")).toContainText(
    "Present reached",
  );
  const canvas = page.locator(".timeline-canvas");
  await canvas.press("ArrowLeft");
  await expect(
    page.getByRole("button", { name: "Pan later", exact: true }),
  ).toBeEnabled();
  const start = windowDates(page)[0]!;
  await canvas.press("ArrowRight");
  await expect.poll(() => windowDates(page)[0]).toBeGreaterThan(start);
  await page.getByRole("button", { name: "Deep time", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Pan earlier", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Pan later", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Zoom out", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".timeline-limit")).toHaveText("Full time range");
});

test.describe("touch navigation", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  test("mobile card drags and pinch zoom work in Move timeline mode, then page scrolling resumes", async ({
    page,
  }) => {
    await page.goto(
      "/#/timeline?tracks=plato,mainstream&left=plato&right=mainstream&from=-12000&to=-8000",
    );
    await page
      .getByRole("button", { name: "Move timeline", exact: true })
      .click();
    const canvas = page.locator(".timeline-canvas");
    const card = page.getByRole("button", {
      name: "The story of Atlantis, Plato’s dialogues",
      exact: true,
    });
    await card.scrollIntoViewIfNeeded();
    const box = (await card.boundingBox())!;
    const input = await page.context().newCDPSession(page);
    const point = { id: 1, x: box.x + 45, y: box.y + 30 };
    await input.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [point],
    });
    for (const offset of [10, 25, 40, 60]) {
      await input.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ ...point, y: point.y + offset }],
      });
    }
    await expect(canvas).toHaveClass(/is-dragging/);
    await input.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect.poll(() => windowDates(page)[0]).toBeLessThan(-12300);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(canvas).not.toHaveClass(/is-dragging/);
    const bounds = (await canvas.boundingBox())!;
    const centerY = Math.max(160, bounds.y + 250);
    const fingers = [
      { id: 1, x: 170, y: centerY - 50 },
      { id: 2, x: 210, y: centerY + 50 },
    ];
    await input.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: fingers,
    });
    await input.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { ...fingers[0], y: centerY - 100 },
        { ...fingers[1], y: centerY + 100 },
      ],
    });
    await input.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect
      .poll(() => windowDates(page)[1]! - windowDates(page)[0]!)
      .toBeLessThan(3000);
    await page
      .getByRole("button", { name: "Done moving", exact: true })
      .click();
    await canvas.scrollIntoViewIfNeeded();
    const scroll = await page.evaluate(() => scrollY);
    const range = await page.locator(".range-label").textContent();
    const area = (await canvas.boundingBox())!;
    const finger = { id: 1, x: 195, y: Math.max(300, area.y + 250) };
    await input.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [finger],
    });
    for (const offset of [30, 60, 90, 120]) {
      await input.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ ...finger, y: finger.y - offset }],
      });
    }
    await input.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(scroll);
    await expect(page.locator(".range-label")).toHaveText(range!);
    await input.detach();
  });
});

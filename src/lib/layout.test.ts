import { test } from "node:test";
import assert from "node:assert/strict";
import { layoutTimeline, timelineHeight } from "./layout.ts";
import { events } from "../data/events.ts";
import { isDatedEvent } from "../data/types.ts";
import { tracks } from "../data/tracks.ts";
import { FULL_RANGE, INITIAL_RANGE } from "./time.ts";

test("dense layouts conserve every in-range event without overlapping or overflowing cards", () => {
  const dated = events.filter(isDatedEvent);
  const stress = Array.from({ length: 600 }, (_, i) => ({
    ...dated[i % dated.length]!,
    id: `stress-${i}`,
    year: -11999 + i * 22,
    endYear: undefined,
    trackId: tracks[i % tracks.length]!.id,
  }));
  for (const mobile of [true, false])
    for (const width of mobile ? [288, 343, 390, 650] : [701, 1000, 1600])
      for (const range of [
        INITIAL_RANGE,
        FULL_RANGE,
        [-5000, -4900] as [number, number],
      ]) {
        const selected = mobile ? tracks.slice(0, 2) : tracks;
        const input = [...dated, ...stress];
        const groups = layoutTimeline(selected, input, range, width, mobile);
        const expected = input.filter(
          (e) =>
            selected.some((t) => t.id === e.trackId) &&
            (e.endYear ?? e.year) >= range[0] &&
            e.year <= range[1],
        );
        assert.deepEqual(
          groups.flatMap((g) => g.events.map((e) => e.id)).sort(),
          expected.map((e) => e.id).sort(),
        );
        const boxes = groups.map((g) => ({
          x: g.left,
          y: g.top,
          w: mobile ? width / 2 - 44 : 188,
          h: mobile ? 92 : 74,
        }));
        for (const box of boxes) {
          assert.ok(box.x >= 0 && box.x + box.w <= width);
          assert.ok(
            box.y >= 0 &&
              box.y + box.h <= timelineHeight(selected.length, mobile),
          );
        }
        for (let i = 0; i < boxes.length; i++)
          for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i]!,
              b = boxes[j]!;
            assert.ok(
              a.x + a.w <= b.x ||
                b.x + b.w <= a.x ||
                a.y + a.h <= b.y ||
                b.y + b.h <= a.y,
              `overlap at ${width}px`,
            );
          }
        if (mobile && groups.length > 1)
          assert.equal(
            new Set(groups.map((g) => g.line)).size,
            new Set(groups.map((g) => g.track.id)).size,
          );
      }
});

test("date ranges stay visible when their beginning is outside the viewport", () => {
  const base = events.find(isDatedEvent)!;
  const input = [
    { ...base, id: "covers", year: -500, endYear: 500 },
    { ...base, id: "ends-here", year: -200, endYear: 25 },
    { ...base, id: "ended", year: -200, endYear: -1 },
    { ...base, id: "later", year: 101, endYear: 200 },
  ];
  for (const mobile of [true, false]) {
    const groups = layoutTimeline(
      [tracks[0]!],
      input,
      [0, 100],
      390,
      mobile,
      "covers",
    );
    assert.deepEqual(groups.flatMap((g) => g.events.map((e) => e.id)).sort(), [
      "covers",
      "ends-here",
    ]);
    assert.ok(groups.every((g) => g.position >= (mobile ? 66 : 48)));
    assert.equal(groups[0]!.events[0]!.id, "covers");
  }
});

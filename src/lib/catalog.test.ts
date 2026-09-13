import { test } from "node:test";
import assert from "node:assert/strict";
import { events } from "../data/events.ts";
import { searchEvents, sortEvents } from "./catalog.ts";
import { FULL_RANGE } from "./time.ts";

test("search accepts unaccented multiword topics and source labels", () => {
  assert.ok(
    searchEvents(events, "gobekli tepe", {}).some(
      (e) => e.id === "gobekli-tepe",
    ),
  );
  assert.ok(
    searchEvents(events, "Matthew crucifixion", {}).some(
      (e) => e.id === "crucifixion-matthew",
    ),
  );
  assert.ok(
    searchEvents(events, "NASA", { "apollo-11": "NASA" }).some(
      (e) => e.id === "apollo-11-landing",
    ),
  );
  assert.equal(searchEvents(events, "unfindableword", {}).length, 0);
});
test("unplaced narratives never become year zero and all dates are navigable", () => {
  assert.equal(events.find((e) => e.id === "genesis-flood")!.year, null);
  assert.equal(
    events.find((e) => e.id === "urantia-adam-arrival")!.year,
    -35914,
  );
  assert.equal(events.find((e) => e.id === "urantia-melchizedek")!.year, -1979);
  for (const event of events)
    if (event.year !== null)
      assert.ok(
        event.year >= FULL_RANGE[0] && event.year <= FULL_RANGE[1],
        event.id,
      );
  for (const order of ["oldest", "newest"]) {
    const sorted = sortEvents(events, order);
    const firstNull = sorted.findIndex((e) => e.year === null);
    assert.ok(sorted.slice(firstNull).every((e) => e.year === null));
    assert.equal(sorted.length, events.length);
  }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calendarYear,
  yearsAgo,
  markerStep,
  timeMarkers,
  zoomRange,
  clampRange,
  FULL_RANGE,
} from "./time.ts";

test("BCE/CE uses no year zero and elapsed ages cross the boundary correctly", () => {
  assert.equal(calendarYear(0), "1 BCE");
  assert.equal(calendarYear(-9599), "9,600 BCE");
  assert.equal(calendarYear(1), "1 CE");
  assert.equal(yearsAgo(0, false, 2026), "2,026 yrs ago");
  assert.deepEqual(
    timeMarkers([-2, 3], 1000).map((m) => m.label),
    ["3 BCE", "2 BCE", "1 BCE", "1 CE", "2 CE", "3 CE"],
  );
});
test("zoom automatically changes all four required granularities", () => {
  assert.equal(markerStep([2000, 2010], 1000), 1);
  assert.equal(markerStep([0, 1000], 1000), 100);
  assert.equal(markerStep([-8000, 2000], 1000), 1000);
  assert.equal(markerStep([-48000, 2000], 1000), 5000);
  assert.equal(markerStep([-20000, -19990], 1000), 1);
  assert.ok(timeMarkers([-20000, -19990], 1000).length > 0);
  assert.ok(timeMarkers(FULL_RANGE, 1000).length <= 16);
});
test("zoom preserves pointer anchor and clamps to the timeline bounds", () => {
  assert.deepEqual(zoomRange([0, 100], 0.5, 0.25), [12.5, 62.5]);
  assert.deepEqual(clampRange([-1e15, 1e15]), FULL_RANGE);
  assert.equal(
    zoomRange([100, 110], 0.01)[1] - zoomRange([100, 110], 0.01)[0],
    8,
  );
});

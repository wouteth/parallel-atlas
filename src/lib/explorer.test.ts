import { test } from "node:test";
import assert from "node:assert/strict";
import {
  civilInputYear,
  eventPath,
  fitEventWindow,
  readTrackSelection,
  readWindow,
  updateExplorerRoute,
} from "./explorer.ts";
import { events } from "../data/events.ts";
import { FULL_RANGE, INITIAL_RANGE } from "./time.ts";

test("explorer links preserve search, source, selection and viewport through record navigation", () => {
  const route =
    "/timeline?q=flood&source=genesis&tracks=bible%2Curantia&from=-11999&to=-7999&view=accounts";
  const detail = eventPath("noah", route);
  assert.equal(detail, route.replace("/timeline?", "/timeline/event/noah?"));
  const changed = updateExplorerRoute(detail, {
    q: "Noah & the flood",
    source: null,
  });
  const params = new URLSearchParams(changed.split("?")[1]);
  assert.equal(params.get("q"), "Noah & the flood");
  assert.equal(params.has("source"), false);
  assert.equal(params.get("tracks"), "bible,urantia");
  assert.deepEqual(readWindow(params), [-11999, -7999]);
  assert.equal(eventPath("noah", "/map?track=plato"), "/timeline/event/noah");
});

test("date input respects civil eras and malformed shared views recover safely", () => {
  assert.equal(civilInputYear("1", "BCE"), 0);
  assert.equal(civilInputYear("1", "CE"), 1);
  assert.equal(civilInputYear(" 12000 ", "BCE"), -11999);
  for (const value of ["0", "-500", "2.5", "NaN", "", "10000000000000000"])
    assert.equal(civilInputYear(value, "BCE"), null);
  assert.equal(civilInputYear(String(FULL_RANGE[1] + 1), "CE"), null);
  for (const query of [
    "from=nope&to=2026",
    "from=500&to=100",
    "from=10",
    "from=Infinity&to=2026",
  ])
    assert.deepEqual(readWindow(new URLSearchParams(query)), INITIAL_RANGE);
  assert.deepEqual(
    readTrackSelection("bible,bible,missing,hindu", ["mainstream"]),
    ["bible", "hindu"],
  );
  assert.deepEqual(readTrackSelection("missing", ["mainstream"]), [
    "mainstream",
  ]);
});

test("fit results includes interval ends and never invents dates for undated records", () => {
  const base = events[0]!;
  assert.equal(fitEventWindow([{ ...base, year: null }]), null);
  assert.deepEqual(
    fitEventWindow([
      { ...base, year: -500, endYear: 500 },
      { ...base, year: null },
    ]),
    [-580, 580],
  );
  assert.deepEqual(
    fitEventWindow([{ ...base, year: 100, endYear: undefined }]),
    [96, 104],
  );
  const recent = fitEventWindow([
    { ...base, year: FULL_RANGE[1], endYear: undefined },
  ])!;
  assert.equal(recent[1], FULL_RANGE[1]);
  assert.ok(recent[1] - recent[0] >= 8);
});

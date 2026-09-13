import { test } from "node:test";
import assert from "node:assert/strict";
import { events, eventById } from "../data/events.ts";
import { comparisonPath, relatedAccounts, sharedTopics } from "./compare.ts";
import { calendarYear } from "./time.ts";

test("comparisons suggest relevant other tracks without equating broad source tags", () => {
  const left = eventById["plato-atlantis"]!;
  const related = relatedAccounts(left, events);
  assert.ok(related.length > 0);
  assert.ok(related.every((e) => e.id !== left.id && !e.gap));
  assert.notEqual(related[0]!.trackId, left.trackId);
  assert.ok(sharedTopics(left, related[0]!).includes("atlantis"));
  assert.equal(
    sharedTopics(
      { ...left, topicIds: ["plato", "ancient-civilizations"] },
      left,
    ).length,
    0,
  );
  assert.equal(
    new URLSearchParams(
      comparisonPath("with & spaces", "right").split("?")[1],
    ).get("left"),
    "with & spaces",
  );
});
test("scientific reference years and Exodus narrative dates retain their provenance", () => {
  const dryas = eventById["younger-dryas-gicc05"]!;
  assert.equal(dryas.year, 2000 - 12896);
  assert.equal(dryas.endYear, 2000 - 11703);
  assert.equal(calendarYear(dryas.year!), "10,897 BCE");
  assert.equal(eventById["eight-two-ka-datum"]!.year, -6236);
  assert.equal(eventById["sea-crossing"]!.year, null);
  assert.equal(eventById["impact-hypothesis-2007"]!.year, 2007);
  assert.match(dryas.dateBasis, /maximum|counting/i);
});

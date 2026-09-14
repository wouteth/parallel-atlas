import { test } from "node:test";
import assert from "node:assert/strict";
import { events, eventById } from "../data/events.ts";
import { tracks } from "../data/tracks.ts";
import {
  accountGroups,
  connections,
  connectionNodes,
  eventPlaces,
  quests,
  disagreements,
} from "../data/comparative.ts";
import { countAccounts } from "./corroboration.ts";
import { FULL_RANGE, timeMarkers } from "./time.ts";
import { buildCatalogExport } from "./catalog.ts";

test("comparative records preserve references, unresolved geography and explicit membership", () => {
  for (const collection of [
    accountGroups,
    connections,
    connectionNodes,
    eventPlaces,
    quests,
    disagreements,
  ])
    assert.equal(
      new Set(collection.map((item) => item.id)).size,
      collection.length,
    );
  for (const node of connectionNodes) {
    assert.ok(tracks.some((track) => track.id === node.trackId));
    if (node.eventId) assert.ok(eventById[node.eventId]);
    assert.ok(node.provenance.length > 10);
  }
  for (const edge of connections) {
    assert.ok(connectionNodes.some((node) => node.id === edge.from));
    assert.ok(connectionNodes.some((node) => node.id === edge.to));
    assert.ok(edge.points.length && edge.context && edge.limitations);
  }
  for (const group of [...accountGroups, ...quests])
    for (const id of group.eventIds) assert.ok(eventById[id], id);
  for (const item of disagreements) {
    assert.ok(eventById[item.leftId]);
    assert.ok(eventById[item.rightId]);
  }
  for (const place of eventPlaces) {
    if (place.eventId) assert.ok(eventById[place.eventId]);
    if (place.status === "Unlocated") assert.equal(place.coordinates, null);
    else {
      assert.ok(place.url);
      assert.ok(Math.abs(place.coordinates![0]) <= 180);
      assert.ok(Math.abs(place.coordinates![1]) <= 90);
    }
  }
  assert.equal(buildCatalogExport(events).schemaVersion, 4);
  assert.equal(
    buildCatalogExport(events).connections.length,
    connections.length,
  );
});

test("source counts deduplicate sources and tracks, exclude gaps, and do not infer identity from topics", () => {
  const flood = countAccounts(eventById["genesis-flood"]!, events);
  assert.equal(flood.trackIds.length, 6);
  assert.equal(flood.sourceIds.length, 6);
  const atlantis = countAccounts(eventById["plato-atlantis"]!, [
    ...events,
    eventById["plato-atlantis"]!,
  ]);
  assert.equal(atlantis.trackIds.length, 3);
  assert.equal(atlantis.sourceIds.length, 5);
  assert.ok(!atlantis.trackIds.includes("mainstream"));
  assert.ok(!atlantis.members.some((event) => event.id === "plato-dialogues"));
  assert.equal(
    countAccounts(eventById["norse-ragnarok"]!, events).trackIds.length,
    1,
  );
});

test("deep time remains bounded while narrative durations and Ragnarok stay unplaced", () => {
  assert.ok(eventById["urantia-andronover"]!.year! >= FULL_RANGE[0]);
  assert.ok(timeMarkers(FULL_RANGE, 320).length < 8);
  assert.ok(timeMarkers(FULL_RANGE, 1600).length < 30);
  assert.equal(eventById["norse-ragnarok"]!.year, null);
  assert.equal(eventById["ra-density-duration"]!.year, null);
});

test("deep-time zoom never collapses distinct markers into identical rounded labels", () => {
  for (const range of [
    [-987000002000, -986999998000],
    [-987010000000, -986990000000],
  ] as [number, number][]) {
    const markers = timeMarkers(range, 1400);
    assert.ok(markers.length > 1);
    assert.equal(
      new Set(markers.map((marker) => marker.label)).size,
      markers.length,
    );
    assert.equal(
      new Set(markers.map((marker) => marker.ago)).size,
      markers.length,
    );
  }
});

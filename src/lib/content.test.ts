import { test } from "node:test";
import assert from "node:assert/strict";
import { events } from "../data/events.ts";
import { tracks } from "../data/tracks.ts";
import { glossary } from "../data/glossary.ts";
import { symbols } from "../data/symbols.ts";
import { sources } from "../data/sources.ts";

test("seed content has stable unique IDs, valid cross-links, citations, and date provenance", () => {
  for (const collection of [events, tracks, glossary, symbols, sources])
    assert.equal(
      new Set(collection.map((item) => item.id)).size,
      collection.length,
    );
  for (const event of events) {
    assert.ok(tracks.some((track) => track.id === event.trackId));
    assert.ok(event.year === null || Number.isInteger(event.year), event.id);
    if (event.year === null) assert.equal(event.endYear, undefined, event.id);
    else if (event.endYear !== undefined)
      assert.ok(event.endYear >= event.year, event.id);
    assert.ok(event.dateBasis.length > 20);
    assert.ok(event.citations.length > 0);
    for (const citation of event.citations) {
      assert.ok(sources.some((source) => source.id === citation.sourceId));
      assert.equal(new URL(citation.url).protocol, "https:");
      assert.ok(citation.passage.length > 5);
    }
    for (const id of event.topicIds)
      assert.ok(glossary.some((entry) => entry.id === id));
    for (const id of event.symbolIds)
      assert.ok(symbols.some((entry) => entry.id === id));
    for (const id of event.gap?.forEventIds ?? [])
      assert.ok(events.some((other) => other.id === id));
  }
  for (const symbol of symbols)
    for (const usage of symbol.historicalUsage) {
      if (usage.status === "Reviewed") {
        assert.ok(usage.culture && usage.era && usage.region && usage.meaning);
        assert.ok(usage.citations.length);
        for (const citation of usage.citations)
          assert.ok(sources.some((s) => s.id === citation.sourceId));
      }
    }
  for (const entry of glossary)
    for (const id of entry.relatedIds)
      assert.ok(glossary.some((other) => other.id === id));
});

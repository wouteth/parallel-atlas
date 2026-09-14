import { test } from "node:test";
import assert from "node:assert/strict";
import { books } from "../data/books.ts";
import { events } from "../data/events.ts";
import { sources } from "../data/sources.ts";
import { isBookReviewed, sectionEvents } from "./book-coverage.ts";

test("book inventories preserve complete edition boundaries without claiming complete review", () => {
  assert.equal(new Set(books.map((b) => b.id)).size, books.length);
  const byId = (id: string) => books.find((b) => b.id === id)!;
  const bible = books.filter((b) => b.id.startsWith("bible-"));
  assert.equal(bible.length, 66);
  assert.equal(
    bible.reduce((n, b) => n + b.sections.length, 0),
    1189,
  );
  assert.equal(byId("bible-ezra").sections.length, 10);
  assert.equal(byId("bible-revelation").sections.length, 22);
  assert.equal(byId("urantia-book").sections.length, 197);
  assert.equal(byId("law-of-one").sections.length, 106);
  assert.equal(byId("vishnu-purana").sections.length, 126);
  assert.equal(byId("satapatha-brahmana").sections.length, 396);
  assert.equal(byId("satapatha-brahmana").access, "Partial edition online");
  assert.equal(byId("prose-edda").access, "Partial edition online");
  assert.equal(byId("poetic-edda").sections.length, 35);
  assert.equal(isBookReviewed(byId("poetic-edda")), false);
  assert.equal(isBookReviewed(byId("critias")), true);
  for (const book of books) {
    assert.equal(
      new Set(book.sections.map((s) => s.id)).size,
      book.sections.length,
      book.id,
    );
    for (const sourceId of book.sourceIds)
      assert.ok(
        sources.some((s) => s.id === sourceId),
        sourceId,
      );
    for (const section of book.sections) {
      assert.equal(new URL(section.url).protocol, "https:");
      assert.ok(!section.url.includes("undefined"), section.id);
      for (const eventId of section.eventIds ?? [])
        assert.ok(
          events.some((e) => e.id === eventId),
          eventId,
        );
    }
  }
});

test("paper and session mappings never mistake paragraph numbers for section numbers", () => {
  const urantia = books.find((b) => b.id === "urantia-book")!;
  const paper6 = urantia.sections.find((s) => s.id === "paper-6")!;
  const paper57 = urantia.sections.find((s) => s.id === "paper-57")!;
  assert.deepEqual(sectionEvents(urantia, paper6, events), []);
  assert.ok(sectionEvents(urantia, paper57, events).length > 8);
  const ra = books.find((b) => b.id === "law-of-one")!;
  assert.ok(
    sectionEvents(ra, ra.sections[9]!, events).some(
      (e) => e.id === "ra-maldek-destroyed",
    ),
  );
  const hindu = books.find((b) => b.id === "vishnu-purana")!;
  assert.equal(sectionEvents(hindu, hindu.sections[2]!, events).length, 8);
});

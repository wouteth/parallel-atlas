import type { BookCoverage, BookSection } from "../data/book-types";
import type { TimelineEvent } from "../data/types";

export function sectionEvents(
  book: BookCoverage,
  section: BookSection,
  events: TimelineEvent[],
): TimelineEvent[] {
  const pattern = section.citationPattern
    ? new RegExp(section.citationPattern, "i")
    : null;
  return events.filter(
    (event) =>
      section.eventIds?.includes(event.id) ||
      (event.trackId === book.trackId &&
        pattern &&
        event.citations.some(
          (c) => book.sourceIds.includes(c.sourceId) && pattern.test(c.passage),
        )),
  );
}

export function bookEvents(
  book: BookCoverage,
  events: TimelineEvent[],
): TimelineEvent[] {
  // Bible books share edition sources; their chapter mappings determine membership.
  if (book.id.startsWith("bible-")) {
    const ids = new Set(
      book.sections.flatMap((s) =>
        sectionEvents(book, s, events).map((e) => e.id),
      ),
    );
    return events.filter((e) => ids.has(e.id));
  }
  return events.filter(
    (e) =>
      e.trackId === book.trackId &&
      e.citations.some((c) => book.sourceIds.includes(c.sourceId)),
  );
}

export function isBookReviewed(book: BookCoverage): boolean {
  if (
    !book.review ||
    !book.sections.length ||
    book.access !== "Full text online"
  )
    return false;
  return book.sections.every(
    (s) =>
      s.eventIds?.length ||
      book.review!.excludedSections.some(
        (ex) => ex.id === s.id && ex.reason.length > 0,
      ),
  );
}

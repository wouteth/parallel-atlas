import { curatorNotes } from "../data/curator-notes.ts";
import { books } from "../data/books.ts";
import {
  connectionNodes,
  connections,
  accountGroups,
  disagreements,
  eventPlaces,
  quests,
  projectHistory,
} from "../data/comparative.ts";
import type { TimelineEvent } from "../data/types";
import { sources } from "../data/sources.ts";
import { glossary } from "../data/glossary.ts";
import { symbols } from "../data/symbols.ts";
import { tracks } from "../data/tracks.ts";

export const normalizeSearch = (text: string) =>
  text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
export function searchEvents(
  events: TimelineEvent[],
  query: string,
  labels: Record<string, string>,
): TimelineEvent[] {
  const words = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
  return events.filter((event) => {
    const text = normalizeSearch(
      [
        event.title,
        event.summary,
        event.region,
        event.dateLabel,
        event.kind,
        ...event.topicIds.map((id) => labels[id]),
        ...event.citations.flatMap((c) => [c.passage, labels[c.sourceId]]),
      ].join(" "),
    );
    return words.every((word) => text.includes(word));
  });
}
export function sortEvents(events: TimelineEvent[], order: string): TimelineEvent[] {
  return [...events].sort((a, b) =>
    order === "title"
      ? a.title.localeCompare(b.title)
      : a.year === null
        ? b.year === null
          ? a.title.localeCompare(b.title)
          : 1
        : b.year === null
          ? -1
          : (a.year - b.year) * (order === "newest" ? -1 : 1) ||
            a.title.localeCompare(b.title),
  );
}
export function buildCatalogExport(events: TimelineEvent[]) {
  return {
    schemaVersion: 4,
    books,
    curatorNotes,
    dateConvention:
      "Astronomical years: 0 = 1 BCE. Null means unplaced. Current-year ages are display values, not scientific BP.",
    events,
    connections,
    connectionNodes,
    accountGroups,
    disagreements,
    eventPlaces,
    quests,
    projectHistory,
    sources,
    glossary,
    symbols,
    tracks,
  };
}
export function downloadCatalog(events: TimelineEvent[]) {
  const data = buildCatalogExport(events);
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "project-timeline-events.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

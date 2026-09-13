import type { AtlasEvent } from "../data/types";
import { sources } from "../data/sources.ts";
import { glossary } from "../data/glossary.ts";
import { symbols } from "../data/symbols.ts";
import { tracks } from "../data/tracks.ts";

export const normalizeSearch = (text: string) =>
  text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
export function searchEvents(
  events: AtlasEvent[],
  query: string,
  labels: Record<string, string>,
): AtlasEvent[] {
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
export function sortEvents(events: AtlasEvent[], order: string): AtlasEvent[] {
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
export function buildCatalogExport(events: AtlasEvent[]) {
  return {
    schemaVersion: 2,
    dateConvention:
      "Astronomical years: 0 = 1 BCE. Null means unplaced. Current-year ages are display values, not scientific BP.",
    events,
    sources,
    glossary,
    symbols,
    tracks,
  };
}
export function downloadCatalog(events: AtlasEvent[]) {
  const data = buildCatalogExport(events);
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "parallel-atlas-events.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

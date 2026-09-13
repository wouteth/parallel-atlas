import type { AtlasEvent } from "../data/types";

const broadTopics = new Set([
  "ancient-civilizations",
  "bible",
  "urantia",
  "law-of-one",
  "plato",
]);
export function sharedTopics(left: AtlasEvent, right: AtlasEvent): string[] {
  return left.topicIds.filter(
    (id) => !broadTopics.has(id) && right.topicIds.includes(id),
  );
}
export function relatedAccounts(
  event: AtlasEvent,
  collection: AtlasEvent[],
  limit = 4,
): AtlasEvent[] {
  return collection
    .filter((candidate) => candidate.id !== event.id && !candidate.gap)
    .map((candidate) => ({
      candidate,
      shared: sharedTopics(event, candidate).length,
    }))
    .filter((item) => item.shared > 0)
    .sort(
      (a, b) =>
        Number(b.candidate.trackId !== event.trackId) -
          Number(a.candidate.trackId !== event.trackId) ||
        b.shared - a.shared ||
        a.candidate.title.localeCompare(b.candidate.title),
    )
    .slice(0, limit)
    .map((item) => item.candidate);
}
export function comparisonPath(left: string, right?: string): string {
  const params = new URLSearchParams({ left });
  if (right) params.set("right", right);
  return `/compare?${params}`;
}

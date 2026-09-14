import type { TimelineEvent } from "../data/types";
import { accountGroups } from "../data/comparative.ts";

export function countAccounts(event: TimelineEvent, catalog: TimelineEvent[]) {
  const group = accountGroups.find((item) => item.eventIds.includes(event.id));
  const members = catalog.filter(
    (item) =>
      !item.gap &&
      (group ? group.eventIds.includes(item.id) : item.id === event.id),
  );
  return {
    group,
    members,
    trackIds: [...new Set(members.map((item) => item.trackId))],
    sourceIds: [
      ...new Set(
        members.flatMap((item) =>
          item.citations.map((citation) => citation.sourceId),
        ),
      ),
    ],
  };
}

import type { DatedEvent, Track } from "../data/types";
import type { WindowRange } from "./time";

export interface TimelineGroup {
  track: Track;
  events: DatedEvent[];
  position: number;
  line: number;
  left: number;
  top: number;
}
export function layoutTimeline(
  tracks: Track[],
  events: DatedEvent[],
  range: WindowRange,
  width: number,
  mobile: boolean,
  focusId?: string,
): TimelineGroup[] {
  const height = mobile ? 650 : 550;
  const padding = mobile ? 66 : 48;
  const length = (mobile ? height : width) - 2 * padding;
  const buckets = mobile ? 5 : Math.max(1, Math.floor((width - 24) / 180));
  const cell = mobile ? (height - 100) / buckets : (width - 24) / buckets;
  return tracks.flatMap((track, index) => {
    const groups = new Map<number, TimelineGroup>();
    const line = mobile
      ? width / 2 + (index === 0 ? -15 : 15)
      : 245 + index * 12;
    for (const event of events
      .filter(
        (e) =>
          e.trackId === track.id &&
          (e.endYear ?? e.year) >= range[0] &&
          e.year <= range[1],
      )
      .sort((a, b) => a.year - b.year || a.id.localeCompare(b.id))) {
      const fraction =
        (Math.max(event.year, range[0]) - range[0]) / (range[1] - range[0]);
      const bucket = Math.min(buckets - 1, Math.floor(fraction * buckets));
      const existing = groups.get(bucket);
      if (existing) {
        existing.events.push(event);
        continue;
      }
      groups.set(bucket, {
        track,
        events: [event],
        position: padding + fraction * length,
        line,
        left: mobile ? (index === 0 ? 12 : width / 2 + 32) : 12 + bucket * cell,
        top: mobile
          ? 40 + bucket * cell
          : ([42, 112, 182, 335, 405, 475][index] ?? 42),
      });
    }
    for (const group of groups.values()) {
      group.events.sort(
        (a, b) =>
          Number(b.id === focusId) - Number(a.id === focusId) ||
          Number(Boolean(b.gap)) - Number(Boolean(a.gap)) ||
          a.year - b.year,
      );
      group.position =
        padding +
        ((Math.max(group.events[0]!.year, range[0]) - range[0]) /
          (range[1] - range[0])) *
          length;
    }
    return [...groups.values()];
  });
}

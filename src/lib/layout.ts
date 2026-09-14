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
export const timelineHeight = (
  count: number,
  mobile: boolean,
  populatedCount = count,
) =>
  mobile
    ? 650
    : Math.max(550, 110 + count * 12 + Math.ceil(populatedCount / 2) * 164);
export const stripeStart = (count: number) => 42 + Math.ceil(count / 2) * 82;
export function layoutTimeline(
  tracks: Track[],
  events: DatedEvent[],
  range: WindowRange,
  width: number,
  mobile: boolean,
  focusId?: string,
): TimelineGroup[] {
  const populated = populatedTracks(tracks, events, range);
  const height = timelineHeight(tracks.length, mobile, populated.length);
  const padding = mobile ? 66 : 48;
  const length = (mobile ? height : width) - 2 * padding;
  const buckets = mobile ? 5 : Math.max(1, Math.floor((width - 24) / 210));
  const cell = mobile ? (height - 100) / buckets : (width - 24) / buckets;
  return tracks.flatMap((track, index) => {
    const cardIndex = populated.findIndex((item) => item.id === track.id);
    const groups = new Map<number, TimelineGroup>();
    const line = mobile
      ? width / 2 + (index === 0 ? -15 : 15)
      : stripeStart(populated.length) + index * 12;
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
          : cardIndex < Math.ceil(populated.length / 2)
            ? 42 + cardIndex * 82
            : stripeStart(populated.length) +
              tracks.length * 12 +
              20 +
              (cardIndex - Math.ceil(populated.length / 2)) * 82,
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

export const populatedTracks = (
  tracks: Track[],
  events: DatedEvent[],
  range: WindowRange,
) =>
  tracks.filter((track) =>
    events.some(
      (event) =>
        event.trackId === track.id &&
        (event.endYear ?? event.year) >= range[0] &&
        event.year <= range[1],
    ),
  );

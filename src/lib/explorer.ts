import type { TimelineEvent, TrackId } from "../data/types";
import { tracks } from "../data/tracks.ts";
import { clampRange, FULL_RANGE, INITIAL_RANGE } from "./time.ts";
import type { WindowRange } from "./time";

export function readTrackSelection(
  value: string | null,
  fallback: TrackId[],
): TrackId[] {
  const ids = [...new Set((value ?? "").split(","))].filter(
    (id): id is TrackId => tracks.some((track) => track.id === id),
  );
  return ids.length ? ids : fallback;
}
export function readWindow(params: URLSearchParams): WindowRange {
  if (!params.has("from") || !params.has("to")) return INITIAL_RANGE;
  const start = Number(params.get("from")),
    end = Number(params.get("to"));
  return Number.isFinite(start) && Number.isFinite(end) && end > start
    ? clampRange([start, end])
    : INITIAL_RANGE;
}
export function fitEventWindow(events: TimelineEvent[]): WindowRange | null {
  const dated = events.filter((event) => event.year !== null);
  if (!dated.length) return null;
  const start = Math.min(...dated.map((event) => event.year!));
  const end = Math.max(...dated.map((event) => event.endYear ?? event.year!));
  const padding = Math.max(4, (end - start) * 0.08);
  return clampRange([start - padding, end + padding]);
}
export function civilInputYear(value: string, era: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1) return null;
  const year = era === "BCE" ? 1 - number : number;
  return year >= FULL_RANGE[0] && year <= FULL_RANGE[1] ? year : null;
}
export function eventPath(id: string, route: string): string {
  const query = route.startsWith("/timeline") ? route.split("?")[1] : undefined;
  return `/timeline/event/${id}${query ? `?${query}` : ""}`;
}
export function updateExplorerRoute(
  route: string,
  values: Record<string, string | null>,
): string {
  const params = new URLSearchParams(route.split("?")[1]);
  for (const [key, value] of Object.entries(values)) {
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
  }
  return `${route.split("?")[0]}${params.size ? `?${params}` : ""}`;
}

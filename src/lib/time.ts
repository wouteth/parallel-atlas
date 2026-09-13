export type WindowRange = [number, number];
export const THIS_YEAR = new Date().getUTCFullYear();
export const FULL_RANGE: WindowRange = [-99999, THIS_YEAR];
export const INITIAL_RANGE: WindowRange = [-11999, THIS_YEAR];
export function calendarYear(year: number): string {
  const rounded = Math.round(year);
  return rounded <= 0
    ? `${(1 - rounded).toLocaleString("en")} BCE`
    : `${rounded.toLocaleString("en")} CE`;
}
export function yearsAgo(
  year: number,
  compact = false,
  reference = THIS_YEAR,
): string {
  const age = Math.max(0, Math.round(reference - year));
  if (!age) return "Present";
  return `${compact && age >= 1000 ? `${+(age / 1000).toFixed(1)}k` : age.toLocaleString("en")} yrs ago`;
}
export function clampRange(range: WindowRange): WindowRange {
  const span = Math.min(
    FULL_RANGE[1] - FULL_RANGE[0],
    Math.max(8, range[1] - range[0]),
  );
  const start = Math.max(
    FULL_RANGE[0],
    Math.min(FULL_RANGE[1] - span, range[0]),
  );
  return [start, start + span];
}
export function zoomRange(
  range: WindowRange,
  factor: number,
  anchor = 0.5,
): WindowRange {
  const span = range[1] - range[0];
  const nextSpan = Math.max(
    8,
    Math.min(FULL_RANGE[1] - FULL_RANGE[0], span * factor),
  );
  const focus = range[0] + span * anchor;
  return clampRange([
    focus - nextSpan * anchor,
    focus + nextSpan * (1 - anchor),
  ]);
}
export function markerStep(range: WindowRange, pixels: number): number {
  const span = range[1] - range[0];
  const allowed = [1, 100, 1000, 5000, 10000, 50000] as const;
  return allowed.find((step) => (pixels * step) / span >= 64) ?? 50000;
}
export function timeMarkers(
  range: WindowRange,
  pixels: number,
): { year: number; label: string; ago: string }[] {
  const step = markerStep(range, pixels);
  const markers: { year: number; label: string; ago: string }[] = [];
  for (
    let civil = Math.floor((range[0] - 1) / step) * step;
    civil <= range[1];
    civil += step
  ) {
    // Civil BCE years are offset by one from astronomical coordinates, with no civil year zero.
    if (civil === 0) continue;
    const year = civil < 0 ? civil + 1 : civil;
    if (year >= range[0] && year <= range[1])
      markers.push({
        year,
        label: calendarYear(year),
        ago: yearsAgo(year, step >= 1000),
      });
  }
  return markers;
}

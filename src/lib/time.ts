export type WindowRange = [number, number];
export const THIS_YEAR = new Date().getUTCFullYear();
export const FULL_RANGE: WindowRange = [-1000000000000, THIS_YEAR];
export const INITIAL_RANGE: WindowRange = [-11999, THIS_YEAR];
export function calendarYear(
  year: number,
  compact = true,
  precision = 2,
): string {
  const rounded = Math.round(year);
  if (compact && Math.abs(rounded) >= 1e6)
    return `${compactNumber(rounded <= 0 ? 1 - rounded : rounded, precision)} ${rounded <= 0 ? "BCE" : "CE"}`;
  return rounded <= 0
    ? `${(1 - rounded).toLocaleString("en")} BCE`
    : `${rounded.toLocaleString("en")} CE`;
}
export function yearsAgo(
  year: number,
  compact = false,
  reference = THIS_YEAR,
  precision = 2,
): string {
  const age = Math.max(0, Math.round(reference - year));
  if (!age) return "Present";
  return `${compact && age >= 1000 ? compactNumber(age, precision) : age.toLocaleString("en")} yrs ago`;
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
  const allowed = [
    1, 100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000,
    10000000, 50000000, 100000000, 500000000, 1000000000, 5000000000,
    10000000000, 50000000000, 100000000000, 500000000000,
  ] as const;
  const labelWidth =
    Math.max(Math.abs(range[0]), Math.abs(range[1])) >= 1e6 ? 140 : 64;
  return (
    allowed.find((step) => (pixels * step) / span >= labelWidth) ?? 500000000000
  );
}
export function timeMarkers(
  range: WindowRange,
  pixels: number,
): { year: number; label: string; ago: string }[] {
  const step = markerStep(range, pixels);
  const deep = Math.max(Math.abs(range[0]), Math.abs(range[1])) >= 1e6;
  const compact = !deep || step >= 1e6;
  const precision = Math.max(2, Math.ceil(Math.log10(1e9 / step)));
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
        label: calendarYear(year, compact, precision),
        ago: yearsAgo(year, compact && step >= 1000, THIS_YEAR, precision),
      });
  }
  return markers;
}

export function compactNumber(value: number, precision = 2): string {
  const unit = value >= 1e9 ? 1e9 : value >= 1e6 ? 1e6 : 1e3;
  return `${+(value / unit).toFixed(Math.min(9, precision))}${unit === 1e9 ? " billion" : unit === 1e6 ? " million" : "k"}`;
}

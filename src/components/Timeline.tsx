import {
  SearchField,
  SelectField,
  SelectItem,
  Button,
  Input,
} from "./ui/Controls";
import { scaleLinear } from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import type { DatedEvent, Track } from "../data/types";
import {
  calendarYear,
  clampRange,
  INITIAL_RANGE,
  FULL_RANGE,
  THIS_YEAR,
  markerStep,
  timeMarkers,
  zoomRange,
} from "../lib/time";
import type { WindowRange } from "../lib/time";
import { Icon } from "./Icon";
import { Picture } from "./Picture";
import { Modal } from "./Modal";
import { navigate, timelineEventHref } from "../lib/router";
import { civilInputYear, fitEventWindow } from "../lib/explorer";

import {
  layoutTimeline,
  timelineHeight,
  stripeStart,
  populatedTracks,
} from "../lib/layout";
export function Timeline({
  tracks,
  events,
  mobile,
  focusId,
  range,
  onRangeChange,
  onBrowse,
  unplacedCount,
}: {
  tracks: Track[];
  events: DatedEvent[];
  mobile: boolean;
  focusId?: string;
  range: WindowRange;
  onRangeChange: (range: WindowRange) => void;
  onBrowse: () => void;
  unplacedCount: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  const currentRange = useRef(range);
  currentRange.current = range;
  const changeRange = useRef(onRangeChange);
  changeRange.current = onRangeChange;
  function setRange(
    next: WindowRange | ((current: WindowRange) => WindowRange),
  ) {
    const value =
      typeof next === "function" ? next(currentRange.current) : next;
    if (
      value[0] === currentRange.current[0] &&
      value[1] === currentRange.current[1]
    )
      return;
    currentRange.current = value;
    changeRange.current(value);
  }
  const [customDates, setCustomDates] = useState(false);
  const [dateError, setDateError] = useState("");
  const [touchPan, setTouchPan] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStarted = useRef(false);
  const suppressClick = useRef(false);
  const [clusterQuery, setClusterQuery] = useState("");
  const fitted = fitEventWindow(events);
  const inView = events.filter(
    (event) =>
      !event.gap &&
      event.year <= range[1] &&
      (event.endYear ?? event.year) >= range[0],
  ).length;
  const [cluster, setCluster] = useState<DatedEvent[] | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const populated = populatedTracks(tracks, events, range);
  const height = timelineHeight(tracks.length, mobile, populated.length);
  const padding = mobile ? 66 : 48;
  const length = (mobile ? height : width) - padding * 2;
  const position = scaleLinear()
    .domain(range)
    .range([padding, padding + length]);
  const step = markerStep(range, length);
  const markers = timeMarkers(range, length);
  const atStart = range[0] <= FULL_RANGE[0];
  const atPresent = range[1] >= FULL_RANGE[1];
  const fullSpan = FULL_RANGE[1] - FULL_RANGE[0];
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) setWidth(entries[0].contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    function wheel(event: WheelEvent) {
      // Preserve page scrolling; only horizontal intent belongs to the timeline.
      const zoom = event.ctrlKey || event.metaKey;
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!zoom && (mobile || (!horizontal && !event.shiftKey))) return;
      event.preventDefault();
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? length : 1;
      if (!zoom) {
        const delta = (horizontal ? event.deltaX : event.deltaY) * unit;
        setRange((current) => {
          const years = (delta / length) * (current[1] - current[0]);
          return clampRange([current[0] + years, current[1] + years]);
        });
        return;
      }
      const rect = node!.getBoundingClientRect();
      const anchor = Math.max(
        0,
        Math.min(
          1,
          ((mobile ? event.clientY - rect.top : event.clientX - rect.left) -
            padding) /
            length,
        ),
      );
      setRange((current) =>
        zoomRange(
          current,
          Math.exp(Math.max(-0.8, Math.min(0.8, event.deltaY * unit * 0.002))),
          anchor,
        ),
      );
    }
    node.addEventListener("wheel", wheel, { passive: false });
    return () => node.removeEventListener("wheel", wheel);
  }, [mobile, length, padding]);
  const groups = useMemo(
    () => layoutTimeline(tracks, events, range, width, mobile, focusId),
    [tracks, events, range, width, mobile, focusId],
  );
  function movePointer(event: ReactPointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    if (!dragStarted.current) {
      // A small movement remains a click/tap. Capture only once dragging starts,
      // so event buttons keep their normal click and keyboard behavior.
      if (
        pointers.current.size < 2 &&
        Math.abs(
          mobile ? event.clientY - previous.y : event.clientX - previous.x,
        ) < 6
      )
        return;
      dragStarted.current = true;
      suppressClick.current = true;
      setDragging(true);
      for (const id of pointers.current.keys())
        event.currentTarget.setPointerCapture(id);
    }
    const oldPoints = [...pointers.current.values()];
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    const newPoints = [...pointers.current.values()];
    if (oldPoints.length === 2 && newPoints.length === 2) {
      const distance = (points: { x: number; y: number }[]) =>
        Math.hypot(points[0]!.x - points[1]!.x, points[0]!.y - points[1]!.y);
      const rect = container.current!.getBoundingClientRect();
      const midpoint = mobile
        ? (oldPoints[0]!.y + oldPoints[1]!.y) / 2 - rect.top
        : (oldPoints[0]!.x + oldPoints[1]!.x) / 2 - rect.left;
      const anchor = Math.max(0, Math.min(1, (midpoint - padding) / length));
      setRange((current) =>
        zoomRange(
          current,
          Math.max(1, distance(oldPoints)) / Math.max(1, distance(newPoints)),
          anchor,
        ),
      );
    } else {
      const delta = mobile
        ? event.clientY - previous.y
        : event.clientX - previous.x;
      setRange((current) => {
        const years = (delta / length) * (current[1] - current[0]);
        return clampRange([current[0] - years, current[1] - years]);
      });
    }
  }
  function endPointer(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    if (!pointers.current.size) {
      dragStarted.current = false;
      setDragging(false);
    }
  }
  function pan(direction: number) {
    setRange((current) => {
      const delta = (current[1] - current[0]) * 0.25 * direction;
      return clampRange([current[0] + delta, current[1] + delta]);
    });
  }
  return (
    <div className="timeline-shell">
      <div className="timeline-controls">
        <div className="zoom-controls">
          <Button
            className="icon-button"
            onClick={() => pan(-1)}
            aria-label="Pan earlier"
            disabled={atStart}
            title={
              atStart ? "Earliest supported date reached" : "Pan earlier (←)"
            }
          >
            <Icon name="left" size={16} />
          </Button>
          <Button
            className="icon-button"
            onClick={() => setRange((current) => zoomRange(current, 2))}
            aria-label="Zoom out"
            disabled={range[1] - range[0] >= fullSpan}
            title="Zoom out (−)"
          >
            <Icon name="minus" size={16} />
          </Button>
          <Button
            className="reset-view"
            onClick={() => setRange(INITIAL_RANGE)}
          >
            Reset view
          </Button>
          <Button
            className="icon-button"
            onClick={() => setRange((current) => zoomRange(current, 0.5))}
            aria-label="Zoom in"
            disabled={range[1] - range[0] <= 8}
            title="Zoom in (+)"
          >
            <Icon name="plus" size={16} />
          </Button>
          <Button
            className="icon-button"
            onClick={() => pan(1)}
            aria-label="Pan later"
            disabled={atPresent}
            title={
              atPresent ? "Present reached — pan earlier" : "Pan later (→)"
            }
          >
            <Icon name="right" size={16} />
          </Button>
        </div>
        <Button
          className="chip"
          disabled={!fitted}
          onClick={() => fitted && setRange(fitted)}
        >
          Fit results
        </Button>
        <Button
          className="chip"
          aria-expanded={customDates}
          onClick={() => {
            setCustomDates(!customDates);
            setDateError("");
          }}
        >
          Set dates
        </Button>
        {mobile && (
          <Button
            className="chip"
            aria-pressed={touchPan}
            onClick={() => setTouchPan(!touchPan)}
          >
            {touchPan ? "Done moving" : "Move timeline"}
          </Button>
        )}
      </div>
      {customDates && (
        <form
          className="custom-date-range"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const start = civilInputYear(
              String(data.get("start")),
              String(data.get("startEra")),
            );
            const end = civilInputYear(
              String(data.get("end")),
              String(data.get("endEra")),
            );
            if (start === null || end === null || start >= end) {
              setDateError(
                "Enter whole years greater than zero, with the start before the end and no date beyond the present.",
              );
              return;
            }
            if (end - start < 8) {
              setDateError(
                "Choose a window of at least 8 years. Individual year markers appear when zoomed in.",
              );
              return;
            }
            setRange(clampRange([start, end]));
            setCustomDates(false);
            setDateError("");
          }}
        >
          <label>
            Start year
            <Input
              name="start"
              aria-label="Start year"
              inputMode="numeric"
              defaultValue={Math.round(range[0] <= 0 ? 1 - range[0] : range[0])}
            />
          </label>
          <label>
            Start era
            <SelectField
              name="startEra"
              aria-label="Start era"
              defaultValue={range[0] <= 0 ? "BCE" : "CE"}
            >
              <SelectItem value="BCE">BCE</SelectItem>
              <SelectItem value="CE">CE</SelectItem>
            </SelectField>
          </label>
          <span aria-hidden="true">→</span>
          <label>
            End year
            <Input
              name="end"
              aria-label="End year"
              inputMode="numeric"
              defaultValue={Math.round(range[1] <= 0 ? 1 - range[1] : range[1])}
            />
          </label>
          <label>
            End era
            <SelectField
              name="endEra"
              aria-label="End era"
              defaultValue={range[1] <= 0 ? "BCE" : "CE"}
            >
              <SelectItem value="BCE">BCE</SelectItem>
              <SelectItem value="CE">CE</SelectItem>
            </SelectField>
          </label>
          <Button className="button primary">Apply dates</Button>
          {dateError && <p role="alert">{dateError}</p>}
        </form>
      )}
      <div className="era-presets" aria-label="Timeline date presets">
        {(
          [
            ["Recent 10,000 years", [THIS_YEAR - 10000, THIS_YEAR]],
            ["Ancient world", [-11999, 500]],
            ["Recorded history", [-3999, THIS_YEAR]],
            ["Modern era", [1400, THIS_YEAR]],
            ["Deep time", FULL_RANGE],
          ] as [string, WindowRange][]
        ).map(([label, window]) => (
          <Button className="chip" key={label} onClick={() => setRange(window)}>
            {label}
          </Button>
        ))}
      </div>
      <div className="timeline-topbar">
        <span>
          <span className="live-dot" />
          DATE RANGE
        </span>
        <span className="range-label">
          {calendarYear(range[0])} <span>—</span> {calendarYear(range[1])}
        </span>
        <span className="marker-caption" aria-live="polite">
          {step.toLocaleString("en")}-year intervals
        </span>
      </div>
      <div className="timeline-gesture-guide" id="timeline-gesture-guide">
        <span>
          {mobile
            ? touchPan
              ? "Drag to pan · pinch to zoom · tap Done moving to scroll"
              : "Scroll to read · + / − to zoom · tap an entry to open"
            : "Scroll sideways or drag to pan · Shift + wheel to pan · Ctrl/⌘ + wheel to zoom"}
        </span>
        {(atStart || atPresent) && (
          <span className="timeline-limit">
            {atStart && atPresent
              ? "Full time range"
              : atPresent
                ? "Present reached · pan earlier ←"
                : "Earliest date reached"}
          </span>
        )}
      </div>
      <div
        className={`timeline-canvas ${mobile ? "vertical" : ""} ${dragging ? "is-dragging" : ""}`}
        ref={container}
        style={{ height, touchAction: mobile && !touchPan ? "pan-y" : "none" }}
        tabIndex={0}
        role="region"
        aria-label="Interactive history timeline. Use plus and minus to zoom, arrow keys to pan, Home to reset."
        aria-describedby="timeline-gesture-guide"
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (suppressClick.current && event.detail > 0) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (
            [
              "+",
              "=",
              "-",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
            ].includes(event.key)
          )
            event.preventDefault();
          if (["+", "="].includes(event.key))
            setRange((current) => zoomRange(current, 0.5));
          if (event.key === "-") setRange((current) => zoomRange(current, 2));
          if (["ArrowLeft", "ArrowUp"].includes(event.key)) pan(-1);
          if (["ArrowRight", "ArrowDown"].includes(event.key)) pan(1);
          if (event.key === "Home") setRange(INITIAL_RANGE);
        }}
        onPointerDown={(event) => {
          if (event.pointerType === "touch" && mobile && !touchPan) return;
          const control = (event.target as Element).closest("button,a");
          if (control && !control.classList.contains("timeline-event")) return;
          if (event.pointerType === "mouse" && event.button !== 0) return;
          if (!pointers.current.size) suppressClick.current = false;
          pointers.current.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
          });
        }}
        onPointerMove={movePointer}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onLostPointerCapture={(event) => {
          // Touch starts with implicit capture on the card. Its lost-capture
          // event bubbles when we transfer capture to the canvas for dragging.
          if (event.target === event.currentTarget) endPointer(event);
        }}
        onPointerLeave={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId))
            endPointer(event);
        }}
      >
        <svg
          width="100%"
          height={height}
          aria-hidden="true"
          className="timeline-svg"
        >
          {markers.map((marker) => {
            const p = position(marker.year);
            return (
              <g key={marker.year}>
                {mobile ? (
                  <>
                    <line
                      x1={12}
                      x2={width - 12}
                      y1={p}
                      y2={p}
                      className="time-marker"
                    />
                    <rect
                      x={width / 2 - 53}
                      y={p - 20}
                      width={106}
                      height={36}
                      rx={4}
                      fill="#faf9f5"
                    />
                    <text
                      x={width / 2}
                      y={p - 6}
                      textAnchor="middle"
                      className="marker-year"
                    >
                      {marker.label}
                    </text>
                    <text
                      x={width / 2}
                      y={p + 8}
                      textAnchor="middle"
                      className="marker-age"
                    >
                      {marker.ago}
                    </text>
                  </>
                ) : (
                  <>
                    <line
                      x1={p}
                      x2={p}
                      y1={34}
                      y2={height - 28}
                      className="time-marker"
                    />
                    <text
                      x={p}
                      y={20}
                      textAnchor="middle"
                      className="marker-year"
                    >
                      {marker.label}
                    </text>
                    <text
                      x={p}
                      y={height - 9}
                      textAnchor="middle"
                      className="marker-age"
                    >
                      {marker.ago}
                    </text>
                  </>
                )}
              </g>
            );
          })}
          {tracks.map((track, index) => {
            const line = mobile
              ? width / 2 + (index === 0 ? -15 : 15)
              : stripeStart(populated.length) + index * 12;
            return (
              <line
                key={track.id}
                data-track-line={track.id}
                x1={mobile ? line : 0}
                x2={mobile ? line : width}
                y1={mobile ? 0 : line}
                y2={mobile ? height : line}
                stroke={track.color}
                strokeWidth={mobile ? 5 : 7}
                opacity="0.92"
              />
            );
          })}
          {groups.map((group) => {
            const anchorX = mobile ? group.line : group.position;
            const anchorY = mobile ? group.position : group.line;
            const cardX = mobile
              ? group.line < width / 2
                ? width / 2 - 32
                : width / 2 + 32
              : group.left + 40;
            const cardY = mobile
              ? group.top + 24
              : group.top < stripeStart(populated.length)
                ? group.top + 72
                : group.top;
            return (
              <g key={group.events[0]!.id}>
                {group.events[0]!.endYear !== undefined && (
                  <line
                    data-event-range={group.events[0]!.id}
                    x1={
                      mobile
                        ? group.line
                        : position(Math.max(range[0], group.events[0]!.year))
                    }
                    x2={
                      mobile
                        ? group.line
                        : position(
                            Math.min(range[1], group.events[0]!.endYear!),
                          )
                    }
                    y1={
                      mobile
                        ? position(Math.max(range[0], group.events[0]!.year))
                        : group.line
                    }
                    y2={
                      mobile
                        ? position(
                            Math.min(range[1], group.events[0]!.endYear!),
                          )
                        : group.line
                    }
                    stroke={group.track.color}
                    strokeWidth={mobile ? 11 : 10}
                    strokeLinecap="round"
                    opacity={0.65}
                  />
                )}
                <path
                  d={`M${anchorX},${anchorY} ${mobile ? `H${cardX} V${cardY}` : `V${cardY} H${cardX}`}`}
                  fill="none"
                  stroke={group.track.color}
                  strokeWidth={1.2}
                  opacity={0.8}
                />
                <circle
                  cx={anchorX}
                  cy={anchorY}
                  r={5.5}
                  fill="#faf9f5"
                  stroke={group.track.color}
                  strokeWidth={2.5}
                />
              </g>
            );
          })}
          {mobile &&
            markers.map((marker) => (
              <g key={`label-${marker.year}`} className="mobile-marker-label">
                <text
                  x={width / 2}
                  y={position(marker.year) - 6}
                  textAnchor="middle"
                  className="marker-year"
                >
                  {marker.label}
                </text>
                <text
                  x={width / 2}
                  y={position(marker.year) + 8}
                  textAnchor="middle"
                  className="marker-age"
                >
                  {marker.ago}
                </text>
              </g>
            ))}
        </svg>
        {groups.map((group) => (
          <button
            key={group.events[0]!.id}
            className={`timeline-event ${group.events[0]!.gap ? "gap-event" : ""}`}
            style={
              {
                left: group.left,
                top: group.top,
                "--track-color": group.track.color,
                ...(mobile ? { width: width / 2 - 44 } : {}),
              } as CSSProperties
            }
            onClick={() =>
              group.events.length > 1
                ? (setClusterQuery(""), setCluster(group.events))
                : navigate(timelineEventHref(group.events[0]!.id).slice(1))
            }
            aria-label={`${group.events[0]!.title}, ${group.track.name}${group.events.length > 1 ? `, ${group.events.length} nearby entries` : ""}`}
          >
            <Picture kind={group.events[0]!.image} />
            <span>
              <small>
                {group.track.shortName}
                {group.events.length > 1 && (
                  <b>{group.events.length} accounts</b>
                )}
              </small>
              <strong>{group.events[0]!.title}</strong>
              <time>
                {group.events[0]!.approximate ? "c. " : ""}
                {calendarYear(group.events[0]!.year)}
                {group.events[0]!.endYear !== undefined
                  ? ` – ${calendarYear(group.events[0]!.endYear!)}`
                  : ""}
              </time>
            </span>
          </button>
        ))}
        {!groups.length && (
          <div className="timeline-empty">
            <strong>
              {events.length
                ? "Matching accounts are outside this date range."
                : "No dated accounts in this selection."}
            </strong>
            <p>
              {events.length
                ? "Fit the timeline to bring your results into view."
                : unplacedCount
                  ? `${unplacedCount} accounts have no calendar date. Read their narrative chronology in the account list.`
                  : "Try another topic or add a track."}
            </p>
            {fitted ? (
              <Button
                className="button secondary"
                onClick={() => setRange(fitted)}
              >
                Show matching dates
              </Button>
            ) : (
              <Button className="button secondary" onClick={onBrowse}>
                Browse accounts
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="timeline-bottombar">
        <span>
          {mobile
            ? touchPan
              ? "Drag to pan · pinch to zoom · tap Done moving to scroll"
              : "Tap an entry for details"
            : "Click an entry for details · arrow keys to pan when the timeline is focused"}
        </span>
        <span aria-live="polite">
          {inView} of {events.filter((event) => !event.gap).length} dated
          accounts in view
        </span>
      </div>
      <p className="range-note">
        Thick segments show date ranges. Open an entry for its dating basis.
      </p>
      {cluster && (
        <Modal title="Nearby timeline entries" onClose={() => setCluster(null)}>
          <div className="detail-content">
            <h2>{cluster.length} nearby accounts</h2>
            <p>Zoom in to separate these dates, or select an entry.</p>
            <div className="cluster-tools">
              <SearchField
                aria-label="Search nearby accounts"
                placeholder="Find an account…"
                value={clusterQuery}
                onChange={(event) => setClusterQuery(event.target.value)}
              />
              <Button
                className="button secondary"
                onClick={() => {
                  const dates = fitEventWindow(cluster);
                  if (dates) setRange(dates);
                  setCluster(null);
                }}
              >
                Zoom to these dates
              </Button>
            </div>
            {!cluster.some((event) =>
              event.title.toLowerCase().includes(clusterQuery.toLowerCase()),
            ) && <p role="status">No nearby account matches that title.</p>}
            {cluster
              .filter((event) =>
                event.title.toLowerCase().includes(clusterQuery.toLowerCase()),
              )
              .map((event) => (
                <a
                  className="list-link"
                  key={event.id}
                  href={timelineEventHref(event.id)}
                  onClick={() => setCluster(null)}
                >
                  <span>
                    <strong>{event.title}</strong>
                    <small>
                      {calendarYear(event.year)}
                      {event.endYear !== undefined
                        ? ` – ${calendarYear(event.endYear)}`
                        : ""}{" "}
                      · {event.kind}
                    </small>
                  </span>
                  <Icon name="arrow" />
                </a>
              ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

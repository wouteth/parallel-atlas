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
import { navigate } from "../lib/router";

import { eventById } from "../data/events";
import { layoutTimeline } from "../lib/layout";
export function Timeline({
  tracks,
  events,
  mobile,
  focusId,
}: {
  tracks: Track[];
  events: DatedEvent[];
  mobile: boolean;
  focusId?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  const [range, setRange] = useState<WindowRange>(INITIAL_RANGE);
  const [cluster, setCluster] = useState<DatedEvent[] | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const height = mobile ? 650 : 550;
  const padding = mobile ? 66 : 48;
  const length = (mobile ? height : width) - padding * 2;
  const position = (year: number) =>
    padding + ((year - range[0]) / (range[1] - range[0])) * length;
  const step = markerStep(range, length);
  const markers = timeMarkers(range, length);
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
    if (!focusId) return;
    const event = eventById[focusId];
    if (event && event.year !== null)
      setRange(clampRange([event.year - 1500, event.year + 1500]));
    // Only a new deep link should move the viewport; filtering should preserve exploration.
  }, [focusId]);
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    function wheel(event: WheelEvent) {
      event.preventDefault();
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
          Math.exp(Math.max(-0.8, Math.min(0.8, event.deltaY * 0.002))),
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
  function pan(direction: number) {
    setRange((current) => {
      const delta = (current[1] - current[0]) * 0.25 * direction;
      return clampRange([current[0] + delta, current[1] + delta]);
    });
  }
  return (
    <div className="timeline-shell">
      <div className="era-presets" aria-label="Timeline date presets">
        {(
          [
            ["Recent 10,000 years", [THIS_YEAR - 10000, THIS_YEAR]],
            ["Ancient world", [-11999, 500]],
            ["Recorded history", [-3999, THIS_YEAR]],
            ["Modern era", [1400, THIS_YEAR]],
            ["All dated accounts", FULL_RANGE],
          ] as [string, WindowRange][]
        ).map(([label, window]) => (
          <button className="chip" key={label} onClick={() => setRange(window)}>
            {label}
          </button>
        ))}
      </div>
      <div className="timeline-topbar">
        <span>
          <span className="live-dot" />
          THE SHARED TIMELINE
        </span>
        <span className="range-label">
          {calendarYear(range[0])} <span>—</span> {calendarYear(range[1])}
        </span>
        <span className="marker-caption" aria-live="polite">
          {step.toLocaleString()}-year intervals
        </span>
      </div>
      <div
        className={`timeline-canvas ${mobile ? "vertical" : ""}`}
        ref={container}
        style={{ height }}
        tabIndex={0}
        role="region"
        aria-label="Interactive history timeline. Use plus and minus to zoom, arrow keys to pan, Home to reset."
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
          if ((event.target as HTMLElement).closest("button,a")) return;
          if (event.pointerType === "mouse" && event.button !== 0) return;
          pointers.current.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
          });
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={movePointer}
        onPointerUp={(event) => pointers.current.delete(event.pointerId)}
        onPointerCancel={(event) => pointers.current.delete(event.pointerId)}
        onLostPointerCapture={(event) =>
          pointers.current.delete(event.pointerId)
        }
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
              : 245 + index * 12;
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
              : group.top < 245
                ? group.top + 57
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
                ? setCluster(group.events)
                : navigate(`/timeline/event/${group.events[0]!.id}`)
            }
            aria-label={`${group.events[0]!.title}, ${group.track.name}${group.events.length > 1 ? `, ${group.events.length} nearby entries` : ""}`}
          >
            <Picture kind={group.events[0]!.image} />
            <span>
              <small>
                {group.track.shortName}
                {group.events.length > 1 && <b>+{group.events.length - 1}</b>}
              </small>
              <strong>{group.events[0]!.title}</strong>
            </span>
          </button>
        ))}
        {!groups.length && (
          <div className="timeline-empty">
            No dated entries in this window. Undated accounts remain in the
            catalog below.
            <br />
            <button onClick={() => setRange(INITIAL_RANGE)}>
              Return to the overview
            </button>
          </div>
        )}
      </div>
      <div className="timeline-bottombar">
        <span>
          {mobile
            ? "Drag up or down · pinch to zoom"
            : "Drag to travel · scroll to zoom · select a story"}
        </span>
        <div className="zoom-controls">
          <button
            className="icon-button"
            onClick={() => pan(-1)}
            aria-label="Pan earlier"
          >
            <Icon name="left" size={16} />
          </button>
          <button
            className="icon-button"
            onClick={() => setRange((current) => zoomRange(current, 2))}
            aria-label="Zoom out"
          >
            <Icon name="minus" size={16} />
          </button>
          <button
            className="reset-view"
            onClick={() => setRange(INITIAL_RANGE)}
          >
            Reset view
          </button>
          <button
            className="icon-button"
            onClick={() => setRange((current) => zoomRange(current, 0.5))}
            aria-label="Zoom in"
          >
            <Icon name="plus" size={16} />
          </button>
          <button
            className="icon-button"
            onClick={() => pan(1)}
            aria-label="Pan later"
          >
            <Icon name="right" size={16} />
          </button>
        </div>
      </div>
      <p className="range-note">
        Thicker line segments show the displayed entry’s reported date range.
        Ranges may describe a period or an uncertain date; open the entry for
        its dating basis.
      </p>
      {cluster && (
        <Modal title="Nearby timeline entries" onClose={() => setCluster(null)}>
          <div className="detail-content">
            <span className="eyebrow">A CLOSER LOOK</span>
            <h2>Stories at this point</h2>
            <p>These entries share a nearby position at this zoom level.</p>
            {cluster.map((event) => (
              <a
                className="list-link"
                key={event.id}
                href={`#/timeline/event/${event.id}`}
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

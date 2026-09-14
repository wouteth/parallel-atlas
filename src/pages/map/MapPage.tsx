import { Card } from "@radix-ui/themes";
import {
  LinkButton,
  SelectField,
  SelectItem,
  Button,
} from "../../components/ui/Controls";
import { useEffect, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3";
import type { GeoPermissibleObjects } from "d3";
import { eventPlaces } from "../../data/comparative";
import { tracks, trackById } from "../../data/tracks";
import { ResearchShell } from "../research/ResearchPages";
const projection = geoNaturalEarth1().fitExtent(
  [
    [20, 20],
    [940, 470],
  ],
  { type: "Sphere" },
);
const path = geoPath(projection);
export function MapPage() {
  const mapRef = useRef<SVGSVGElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(960);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) setCanvasWidth(entries[0].contentRect.width || 960);
    });
    if (mapRef.current) observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);
  const [land, setLand] = useState<GeoPermissibleObjects | null>(null);
  const [status, setStatus] = useState("");
  const [mapFocus, setMapFocus] = useState(false);
  const [track, setTrack] = useState("all");
  const [selected, setSelected] = useState(eventPlaces[0]!.id);
  useEffect(() => {
    const controller = new AbortController();
    void fetch("maps/land-110m.geojson", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        setLand(await response.json());
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setStatus(
            "The basemap could not be loaded. All location records remain available below.",
          );
      });
    return () => controller.abort();
  }, []);
  const places = eventPlaces.filter(
    (place) => track === "all" || place.trackId === track,
  );
  const active = places.find((place) => place.id === selected) ?? places[0];
  const points = places.flatMap((place) =>
    place.coordinates ? [projection(place.coordinates)!] : [],
  );
  const minX = Math.min(...points.map((point) => point[0])),
    maxX = Math.max(...points.map((point) => point[0]));
  const minY = Math.min(...points.map((point) => point[1])),
    maxY = Math.max(...points.map((point) => point[1]));
  const focusedWidth = Math.max(
    140,
    (maxX - minX) * 1.8,
    ((maxY - minY) * 1.8 * 960) / 490,
  );
  const mapWidth = mapFocus && points.length ? focusedWidth : 960;
  const mapHeight = (mapWidth * 490) / 960;
  const viewBox =
    mapFocus && points.length
      ? `${(minX + maxX) / 2 - mapWidth / 2} ${(minY + maxY) / 2 - mapHeight / 2} ${mapWidth} ${mapHeight}`
      : "0 0 960 490";
  const markerScale = mapWidth / canvasWidth;
  const [viewX, viewY] = viewBox.split(" ").map(Number);
  const markerPoints: { id: string; anchor: number[]; point: number[] }[] = [];
  for (const place of places.filter((place) => place.coordinates)) {
    const anchor = projection(place.coordinates!)!;
    const candidates = [[0, 0]];
    for (let ring = 1; ring <= 5; ring++)
      for (const [x, y] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, -1],
        [1, -1],
        [-1, 1],
      ])
        candidates.push([
          x! * ring * 46 * markerScale,
          y! * ring * 46 * markerScale,
        ]);
    const point =
      candidates
        .map(([x, y]) => [anchor[0] + x!, anchor[1] + y!])
        .find(
          (point) =>
            point[0]! >= viewX! + 23 * markerScale &&
            point[0]! <= viewX! + mapWidth - 23 * markerScale &&
            point[1]! >= viewY! + 23 * markerScale &&
            point[1]! <= viewY! + mapHeight - 23 * markerScale &&
            markerPoints.every(
              (other) =>
                Math.hypot(
                  other.point[0]! - point[0]!,
                  other.point[1]! - point[1]!,
                ) >=
                45 * markerScale,
            ),
        ) ?? anchor;
    markerPoints.push({ id: place.id, anchor, point });
  }
  return (
    <ResearchShell title="World map">
      <p>
        Solid markers identify documented sites; outlined circles identify broad
        narrative regions. Unknown and fictional locations stay in the unlocated
        list. Modern coastlines are a reference, not a reconstruction of ancient
        geography.
      </p>
      <div className="map-controls">
        <label>
          Map track
          <SelectField
            aria-label="Map track"
            value={track}
            onValueChange={(value) => setTrack(value)}
          >
            <SelectItem value="all">All tracks</SelectItem>
            {tracks.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectField>
        </label>
        <Button
          className="chip"
          aria-pressed={mapFocus}
          disabled={!points.length}
          onClick={() => setMapFocus(true)}
        >
          Focus mapped places
        </Button>
        <Button
          className="chip"
          aria-pressed={!mapFocus}
          onClick={() => setMapFocus(false)}
        >
          Whole world
        </Button>
        <span>
          {points.length} mapped · {places.length - points.length} unlocated
        </span>
      </div>
      <svg
        ref={mapRef}
        className="world-map"
        viewBox={viewBox}
        role="group"
        aria-label="World map of sourced sites and approximate narrative regions"
      >
        <path d={path({ type: "Sphere" })!} fill="#e8eff0" />
        <path
          d={path(geoGraticule10())!}
          fill="none"
          stroke="#d2dcdb"
          strokeWidth={0.5}
        />
        {land && (
          <path
            d={path(land)!}
            fill="#d6dec8"
            stroke="#b9c4ad"
            strokeWidth={0.6}
          />
        )}
        {places
          .filter((place) => place.coordinates)
          .map((place) => {
            const marker = markerPoints.find((item) => item.id === place.id)!;
            const point = marker.point;
            return (
              <g key={place.id}>
                <line
                  x1={marker.anchor[0]}
                  y1={marker.anchor[1]}
                  x2={point[0]}
                  y2={point[1]}
                  stroke="#64745c"
                  strokeWidth={markerScale}
                  pointerEvents="none"
                />
                <circle
                  cx={marker.anchor[0]}
                  cy={marker.anchor[1]}
                  r={2 * markerScale}
                  fill="#526346"
                  pointerEvents="none"
                />
                <g
                  tabIndex={0}
                  role="button"
                  aria-label={`Inspect location: ${place.name}`}
                  onClick={() => setSelected(place.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelected(place.id);
                    }
                  }}
                >
                  <title>
                    {place.name} · {place.status}
                  </title>
                  <circle
                    cx={point[0]}
                    cy={point[1]}
                    r={22 * markerScale}
                    fill="transparent"
                  />
                  <circle
                    cx={point[0]}
                    cy={point[1]}
                    r={(active?.id === place.id ? 12 : 8) * markerScale}
                    fill={
                      place.status === "Narrative region"
                        ? "#fff9"
                        : trackById[place.trackId].color
                    }
                    stroke={trackById[place.trackId].color}
                    strokeWidth={3 * markerScale}
                  />
                </g>
                {active?.id === place.id && (
                  <text
                    pointerEvents="none"
                    x={point[0]! + 16 * markerScale}
                    y={point[1]! + 4 * markerScale}
                    fontSize={12 * markerScale}
                    fill="#3f5035"
                    stroke="#fffef9"
                    strokeWidth={3 * markerScale}
                    paintOrder="stroke"
                    aria-hidden="true"
                  >
                    {place.name}
                  </text>
                )}
              </g>
            );
          })}
      </svg>
      <p role="status">{status}</p>
      <small>
        Basemap: Natural Earth 1:110m land, public domain.{" "}
        <a href="https://www.naturalearthdata.com/about/terms-of-use/">
          Terms and attribution
        </a>
        . Small dots mark coordinates; short lines separate nearby controls. All
        records are also listed below.
      </small>
      {active ? (
        <Card asChild size="3">
          <article ref={detailRef} className="research-card" aria-live="polite">
            <h2>{active.name}</h2>
            <p>{active.basis}</p>
            {active.coordinates && (
              <p>
                Overview coordinates: {active.coordinates[1]}° latitude,{" "}
                {active.coordinates[0]}° longitude.
              </p>
            )}
            {active.url && (
              <LinkButton className="chip" href={active.url}>
                Geographic source
              </LinkButton>
            )}
            {active.eventId && (
              <LinkButton
                className="chip"
                href={`#/timeline/event/${active.eventId}`}
              >
                Read event and citations
              </LinkButton>
            )}
          </article>
        </Card>
      ) : (
        <p>No geographic records have been reviewed for this track yet.</p>
      )}
      <div className="research-grid">
        {[true, false].map((located) => (
          <section key={String(located)}>
            <h2>
              {located ? "Mapped locations" : "Unlocated / research pending"}
            </h2>
            {places
              .filter((place) => Boolean(place.coordinates) === located)
              .map((place) => (
                <Button
                  className="list-link location-choice"
                  aria-pressed={active?.id === place.id}
                  key={place.id}
                  onClick={() => {
                    setSelected(place.id);
                    detailRef.current?.scrollIntoView({
                      block: "nearest",
                      behavior: "smooth",
                    });
                  }}
                >
                  <span>
                    <strong>{place.name}</strong>
                    <small>
                      {trackById[place.trackId].name} · {place.status}
                    </small>
                  </span>
                </Button>
              ))}
          </section>
        ))}
      </div>
    </ResearchShell>
  );
}

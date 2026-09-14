import { Badge, Card } from "@radix-ui/themes";
import {
  LinkButton,
  SelectField,
  SelectItem,
  Button,
} from "../../components/ui/Controls";
import { useMemo, useState } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
  forceCollide,
} from "d3";
import type { SimulationNodeDatum } from "d3";
import { connections, connectionNodes } from "../../data/comparative";
import { tracks, trackById } from "../../data/tracks";
import { ResearchShell } from "../research/ResearchPages";
interface Node extends SimulationNodeDatum {
  id: string;
  column: number;
  row: number;
}
export function ConnectionsPage() {
  const [selected, setSelected] = useState(connections[0]!.id);
  const [track, setTrack] = useState("all");
  const [confidence, setConfidence] = useState("all");
  const [zoom, setZoom] = useState(1);
  const layout = useMemo(() => {
    const nodes: Node[] = connectionNodes.map((node, index) => ({
      id: node.id,
      column: index % 3,
      row: Math.floor(index / 3),
      x: 180 + (index % 3) * 300,
      y: 75 + Math.floor(index / 3) * 150,
    }));
    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink<Node, { source: string; target: string }>(
          connections.map((edge) => ({ source: edge.from, target: edge.to })),
        )
          .id((node) => node.id)
          .distance(260)
          .strength(0.08),
      )
      .force("charge", forceManyBody().strength(-150))
      .force("x", forceX<Node>((node) => 180 + node.column * 300).strength(0.8))
      .force("y", forceY<Node>((node) => 75 + node.row * 150).strength(0.8))
      .force("collide", forceCollide(80))
      .stop();
    simulation.tick(200);
    const left = Math.min(...nodes.map((node) => node.x!)) - 120;
    const top = Math.min(...nodes.map((node) => node.y!)) - 40;
    const right = Math.max(...nodes.map((node) => node.x!)) + 120;
    const bottom = Math.max(...nodes.map((node) => node.y!)) + 85;
    return {
      positions: Object.fromEntries(
        nodes.map((node) => [node.id, { x: node.x!, y: node.y! }]),
      ),
      viewBox: `${left} ${top} ${right - left} ${bottom - top}`,
    };
  }, []);
  const nodes = layout.positions;
  const edges = connections.filter(
    (edge) =>
      (confidence === "all" || edge.confidence === confidence) &&
      (track === "all" ||
        connectionNodes.some(
          (node) =>
            (node.id === edge.from || node.id === edge.to) &&
            node.trackId === track,
        )),
  );
  const active = edges.find((edge) => edge.id === selected) ?? edges[0];
  const visible = new Set(edges.flatMap((edge) => [edge.from, edge.to]));
  return (
    <ResearchShell title="Connections">
      <p>
        Select a line to see the similarities, sources and limitations. Numbers
        count comparison points, not evidence of a historical connection.
      </p>
      <div className="catalog-controls">
        <label>
          Graph track
          <SelectField
            aria-label="Graph track"
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
        <label>
          Match confidence
          <SelectField
            aria-label="Match confidence"
            value={confidence}
            onValueChange={(value) => setConfidence(value)}
          >
            {[
              "all",
              "Strong match",
              "Suggestive match",
              "Speculative match",
            ].map((value) => (
              <SelectItem key={value} value={value}>
                {value === "all" ? "All confidence labels" : value}
              </SelectItem>
            ))}
          </SelectField>
        </label>
        <Button
          className="chip"
          onClick={() => setZoom((value) => Math.min(1.8, value + 0.2))}
        >
          Enlarge graph
        </Button>
        <Button className="chip" onClick={() => setZoom(1)}>
          Reset graph
        </Button>
      </div>
      <p className="graph-scroll-hint">
        On a narrow screen, scroll the graph sideways to follow both sources.
      </p>
      <div
        className="visual-scroll"
        tabIndex={0}
        aria-label="Scrollable connections graph"
      >
        <svg
          className="connection-graph"
          style={{ width: `${zoom * 100}%` }}
          viewBox={layout.viewBox}
          role="group"
          aria-label="Connections graph with numbered similarity edges"
        >
          <g>
            {edges.map((edge) => {
              const a = nodes[edge.from]!;
              const b = nodes[edge.to]!;
              const bend = Math.abs(a.x - b.x) < 80 ? 140 : 0;
              const controlX = (a.x + b.x) / 2 + bend;
              const controlY = (a.y + b.y) / 2;
              const midpointX = (a.x + 2 * controlX + b.x) / 4;
              const midpointY = (a.y + 2 * controlY + b.y) / 4;
              return (
                <g
                  key={edge.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Inspect ${edge.id}: ${edge.points.length} similarity points`}
                  onClick={() => setSelected(edge.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelected(edge.id);
                    }
                  }}
                >
                  <path
                    d={`M ${a.x} ${a.y} Q ${controlX} ${controlY} ${b.x} ${b.y}`}
                    fill="none"
                    stroke={active?.id === edge.id ? "#789188" : "#bcc8bb"}
                    strokeWidth={active?.id === edge.id ? 5 : 3}
                  />
                  <circle
                    cx={midpointX}
                    cy={midpointY}
                    r={18}
                    fill="#f9f7f0"
                    stroke="#99aaa0"
                  />
                  <text x={midpointX} y={midpointY + 5} textAnchor="middle">
                    {edge.points.length}
                  </text>
                </g>
              );
            })}
            {connectionNodes
              .filter((node) => visible.has(node.id))
              .map((node) => (
                <g key={node.id}>
                  <circle
                    cx={nodes[node.id]!.x}
                    cy={nodes[node.id]!.y}
                    r={18}
                    fill={trackById[node.trackId].color}
                  />
                  <text
                    x={nodes[node.id]!.x}
                    y={nodes[node.id]!.y + 36}
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                  <text
                    className="graph-subtitle"
                    x={nodes[node.id]!.x}
                    y={nodes[node.id]!.y + 54}
                    textAnchor="middle"
                  >
                    {trackById[node.trackId].shortName}
                  </text>
                </g>
              ))}
          </g>
        </svg>
      </div>
      <div className="flex flex-wrap gap-3">
        {edges.map((edge) => (
          <Button
            className="chip"
            key={edge.id}
            aria-pressed={active?.id === edge.id}
            onClick={() => setSelected(edge.id)}
          >
            {connectionNodes.find((node) => node.id === edge.from)?.label} ↔{" "}
            {connectionNodes.find((node) => node.id === edge.to)?.label} ·{" "}
            {edge.points.length}
          </Button>
        ))}
      </div>
      {active ? (
        <Card asChild size="3">
          <article className="research-card" aria-live="polite">
            <Badge color="gray" variant="soft">
              {active.confidence} · {active.status}
            </Badge>
            <h2>
              {active.points.length} recorded similarity point
              {active.points.length === 1 ? "" : "s"}
            </h2>
            <ol>
              {active.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ol>
            <h3>Contextual triangulation</h3>
            <p>{active.context}</p>
            <h3>Limits and counterevidence</h3>
            <p>{active.limitations}</p>
            {connectionNodes
              .filter((node) => [active.from, active.to].includes(node.id))
              .map((node) => (
                <p key={node.id}>
                  <strong>{node.label}:</strong> {node.provenance}{" "}
                  {node.eventId && (
                    <LinkButton
                      className="chip"
                      href={`#/timeline/event/${node.eventId}`}
                    >
                      Read source record
                    </LinkButton>
                  )}
                </p>
              ))}
            <LinkButton className="chip" href="#/methodology">
              How confidence labels work
            </LinkButton>
          </article>
        </Card>
      ) : (
        <p role="status">
          No connections match these filters. No strong or suggestive matches
          have been established in this collection.
        </p>
      )}
    </ResearchShell>
  );
}

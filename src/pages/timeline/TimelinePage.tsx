import {
  SearchField,
  SelectField,
  SelectItem,
  Button,
  Disclosure,
} from "../../components/ui/Controls";
import { Checkbox, SegmentedControl, Badge } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import type { TrackId } from "../../data/types";
import { isDatedEvent } from "../../data/types";
import { sources } from "../../data/sources";
import { events, eventById } from "../../data/events";
import { disagreements } from "../../data/comparative";
import { tracks } from "../../data/tracks";
import { glossary } from "../../data/glossary";
import { searchEvents, sortEvents, downloadCatalog } from "../../lib/catalog";
import {
  fitEventWindow,
  readTrackSelection,
  readWindow,
  updateExplorerRoute,
} from "../../lib/explorer";
import { navigate, replaceRoute, timelineEventHref } from "../../lib/router";
import { Timeline } from "../../components/Timeline";
import { EventCard } from "../../components/EventCard";
import { EventDetail } from "../../components/EventDetail";
import { Modal } from "../../components/Modal";
import { Icon } from "../../components/Icon";
import { DisagreementsPanel } from "../research/ResearchPages";

const defaultTracks = tracks
  .filter((track) =>
    events.some((event) => event.trackId === track.id && event.year !== null),
  )
  .map((track) => track.id);
const labels = Object.fromEntries([
  ...glossary.map((item) => [item.id, item.title]),
  ...sources.map((item) => [item.id, `${item.title} ${item.author}`]),
]);
const topicChoices = [
  ["atlantis", "Atlantis"],
  ["flood-narratives", "Flood narratives"],
  ["eden", "Eden"],
  ["jesus", "Jesus"],
  ["cosmic-origins", "Cosmic origins"],
];

export function TimelinePage({ route }: { route: string }) {
  const params = new URLSearchParams(route.split("?")[1]);
  const query = params.get("q") ?? "";
  const topic = params.get("topic") ?? "";
  const sourceId = params.get("source") ?? "";
  const focus = params.get("focus") ?? undefined;
  const kind = params.get("kind") ?? "all";
  const region = params.get("region") ?? "all";
  const dateMode = params.get("dates") ?? "all";
  const sort = params.get("sort") ?? "oldest";
  const view = params.get("view") === "accounts" ? "accounts" : "timeline";
  const onlySelected = params.get("scope") !== "all";
  const selected = readTrackSelection(params.get("tracks"), defaultTracks);
  const pair = readTrackSelection(params.get("pair") ?? params.get("tracks"), [
    "mainstream",
    "plato",
  ]).slice(0, 2);
  if (pair.length === 1)
    pair.push(tracks.find((track) => track.id !== pair[0])!.id);
  const range = readWindow(params);
  const hasWindow = params.has("from") && params.has("to");
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 700px)").matches,
  );
  const [showFilters, setShowFilters] = useState(false);
  const [trackPicker, setTrackPicker] = useState(false);
  const [limit, setLimit] = useState(12);
  const activeIds = mobile ? pair : selected;
  const activeTracks = activeIds.map(
    (id) => tracks.find((track) => track.id === id)!,
  );
  function change(values: Record<string, string | null>) {
    replaceRoute(
      updateExplorerRoute(location.hash.slice(1) || "/timeline", values),
    );
  }
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const update = () => setMobile(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const matches = searchEvents(events, query, labels).filter(
    (event) =>
      (!topic || event.topicIds.includes(topic)) &&
      (!sourceId || event.citations.some((c) => c.sourceId === sourceId)) &&
      (kind === "all" || event.kind === kind) &&
      (region === "all" || event.region === region),
  );
  const visible = matches.filter((event) => activeIds.includes(event.trackId));
  const catalog = sortEvents(
    (onlySelected ? visible : matches).filter(
      (event) =>
        !event.gap &&
        (dateMode === "all" ||
          (dateMode === "dated" ? event.year !== null : event.year === null)),
    ),
    sort,
  );
  const dated = visible.filter(isDatedEvent);
  const unplaced = visible.filter((event) => event.year === null);
  const otherTrackMatches = matches.filter(
    (event) => !event.gap && !activeIds.includes(event.trackId),
  );
  const allMatchCount = matches.filter((event) => !event.gap).length;
  const filtersActive = Boolean(
    query || topic || sourceId || kind !== "all" || region !== "all",
  );
  useEffect(
    () => setLimit(12),
    [
      query,
      topic,
      sourceId,
      kind,
      region,
      dateMode,
      sort,
      onlySelected,
      params.get("tracks"),
      params.get("pair"),
    ],
  );
  useEffect(() => {
    const target = focus ? eventById[focus] : undefined;
    if (!target || target.year === null || hasWindow) return;
    const updates: Record<string, string | null> = {
      view: null,
      from: String(target.year - 1500),
      to: String(target.year + 1500),
    };
    if (!selected.includes(target.trackId))
      updates.tracks = [...selected, target.trackId].join(",");
    if (!pair.includes(target.trackId))
      updates.pair = [pair[0], target.trackId].join(",");
    if (!matches.some((event) => event.id === target.id))
      Object.assign(updates, {
        q: null,
        topic: null,
        source: null,
        kind: null,
        region: null,
      });
    change(updates);
    // A newly followed date link should focus the record; subsequent panning stays under the reader’s control.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, hasWindow]);
  const eventId = route.split("?")[0]?.split("/event/")[1];
  const detail = eventId ? eventById[eventId] : undefined;
  function clearFilters() {
    change({
      q: null,
      topic: null,
      source: null,
      kind: null,
      region: null,
      dates: null,
      focus: null,
    });
  }
  function chooseTopic(id: string) {
    const matching = events.filter((event) => event.topicIds.includes(id));
    const ids = tracks
      .filter((track) => matching.some((event) => event.trackId === track.id))
      .map((track) => track.id);
    const dates = fitEventWindow(matching);
    change({
      topic: id,
      q: null,
      source: null,
      kind: null,
      region: null,
      dates: null,
      focus: null,
      tracks: ids.join(","),
      pair: ids.slice(0, 2).join(","),
      view: null,
      from: dates ? String(dates[0]) : null,
      to: dates ? String(dates[1]) : null,
    });
  }
  function toggleTrack(id: TrackId) {
    const ids = selected.includes(id)
      ? selected.length > 1
        ? selected.filter((value) => value !== id)
        : selected
      : [...selected, id];
    change({ tracks: ids.join(",") });
  }
  function changePair(index: number, id: TrackId) {
    const next = [...pair];
    const other = index === 0 ? 1 : 0;
    if (next[other] === id) next[other] = next[index]!;
    next[index] = id;
    change({ pair: next.join(",") });
  }
  return (
    <main className="timeline-workspace">
      <section className="workspace-intro">
        <div>
          <h1>Timeline</h1>
          <p>Compare dates and accounts from different sources.</p>
        </div>
        <a className="workspace-help" href="#/methodology">
          Methodology <Icon name="arrow" size={15} />
        </a>
      </section>
      <section className="explorer" aria-label="Timeline explorer">
        <div className="workspace-toolbar">
          <SearchField
            value={query}
            onChange={(event) => change({ q: event.target.value, focus: null })}
            placeholder="Search events, topics or authors…"
            aria-label="Search timeline"
          >
            {query && (
              <Button
                onClick={() => change({ q: null })}
                aria-label="Clear search"
              >
                <Icon name="close" size={15} />
              </Button>
            )}
          </SearchField>
          <Button
            className="button secondary"
            aria-expanded={showFilters}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Icon name="filter" size={17} />
            Filters
            {(kind !== "all" || region !== "all" || sourceId) && (
              <span className="live-dot" />
            )}
          </Button>
        </div>
        <div className="topic-shortcuts">
          <span>Start with</span>
          {topicChoices.map(([id, label]) => (
            <Button
              className="chip"
              key={id}
              aria-pressed={topic === id}
              onClick={() => chooseTopic(id!)}
            >
              {label}
            </Button>
          ))}
        </div>
        {showFilters && (
          <div className="filter-panel workspace-filters">
            <label>
              Evidence type
              <SelectField
                aria-label="Evidence type"
                value={kind}
                onValueChange={(value) =>
                  change({
                    kind: value === "all" ? null : value,
                  })
                }
              >
                <SelectItem value="all">All types of account</SelectItem>
                {[...new Set(events.map((event) => event.kind))].map(
                  (value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ),
                )}
              </SelectField>
            </label>
            <label>
              Region
              <SelectField
                aria-label="Region"
                value={region}
                onValueChange={(value) =>
                  change({
                    region: value === "all" ? null : value,
                  })
                }
              >
                <SelectItem value="all">All regions</SelectItem>
                {[
                  ...new Set(
                    events.flatMap((event) =>
                      event.region ? [event.region] : [],
                    ),
                  ),
                ]
                  .sort()
                  .map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
              </SelectField>
            </label>
            <label>
              Source
              <SelectField
                aria-label="Source"
                value={sourceId}
                onValueChange={(value) => change({ source: value || null })}
              >
                <SelectItem value="">All sources</SelectItem>
                {sources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.title}
                  </SelectItem>
                ))}
              </SelectField>
            </label>
          </div>
        )}
        {filtersActive && (
          <div className="active-filters">
            <span>
              Showing{" "}
              {topic
                ? (glossary.find((item) => item.id === topic)?.title ?? topic)
                : query
                  ? `“${query}”`
                  : "filtered accounts"}
              {topic && query ? ` · “${query}”` : ""}
              {sourceId
                ? ` · ${sources.find((item) => item.id === sourceId)?.title ?? sourceId}`
                : ""}
              {kind !== "all" ? ` · ${kind}` : ""}
              {region !== "all" ? ` · ${region}` : ""}
            </span>
            <Button className="text-button" onClick={clearFilters}>
              Clear filters ×
            </Button>
          </div>
        )}
        <div className="track-selection">
          {mobile ? (
            <div className="mobile-track-selectors">
              {[0, 1].map((index) => (
                <label key={index}>
                  <span>{index === 0 ? "LEFT TRACK" : "RIGHT TRACK"}</span>
                  <SelectField
                    value={pair[index]}
                    onValueChange={(value) =>
                      changePair(index, value as TrackId)
                    }
                    aria-label={index === 0 ? "Left track" : "Right track"}
                  >
                    {tracks.map((track) => (
                      <SelectItem key={track.id} value={track.id}>
                        {track.name}
                      </SelectItem>
                    ))}
                  </SelectField>
                </label>
              ))}
            </div>
          ) : (
            <div className="selected-track-chips">
              {activeTracks.map((track) => (
                <Button
                  className="track-chip"
                  key={track.id}
                  style={{ borderColor: track.color }}
                  disabled={selected.length === 1}
                  onClick={() => toggleTrack(track.id)}
                  aria-label={`Remove ${track.name} track`}
                >
                  <i style={{ background: track.color }} />
                  {track.shortName}
                  <span aria-hidden="true">×</span>
                </Button>
              ))}
            </div>
          )}
          {!mobile && (
            <Button
              className="choose-tracks"
              onClick={() => setTrackPicker(true)}
            >
              Choose tracks{" "}
              <span>
                {activeIds.length}/{tracks.length}
              </span>
              <Icon name="plus" size={15} />
            </Button>
          )}
        </div>
        <div className="explorer-viewbar">
          <SegmentedControl.Root
            className="view-switch"
            aria-label="Explorer view"
            value={view}
            onValueChange={(value) =>
              change({ view: value === "timeline" ? null : value })
            }
          >
            <SegmentedControl.Item value="timeline">
              Timeline
            </SegmentedControl.Item>
            <SegmentedControl.Item value="accounts">
              Account list{" "}
              <Badge color="gray" variant="soft">
                {catalog.length}
              </Badge>
            </SegmentedControl.Item>
          </SegmentedControl.Root>
          {view === "timeline" && (
            <span className="coverage-summary">
              {dated.filter((event) => !event.gap).length} dated{" "}
              <span aria-hidden="true">·</span>{" "}
              <Button
                onClick={() => change({ view: "accounts", dates: "undated" })}
              >
                {unplaced.length} without a date
              </Button>
            </span>
          )}
        </div>
        {filtersActive &&
          otherTrackMatches.length > 0 &&
          (view === "timeline" || onlySelected) && (
            <div className="search-scope-notice" role="status">
              <p>
                {otherTrackMatches.length} matching account
                {otherTrackMatches.length === 1 ? " is" : "s are"} on other
                tracks.
              </p>
              <Button
                variant="soft"
                onClick={() =>
                  change({ view: "accounts", scope: "all", dates: null })
                }
              >
                View all {allMatchCount} matches
              </Button>
            </div>
          )}
        <div hidden={view !== "timeline"}>
          <Timeline
            tracks={activeTracks}
            events={dated}
            mobile={mobile}
            focusId={focus}
            range={range}
            onRangeChange={(next) =>
              change({ from: String(next[0]), to: String(next[1]) })
            }
            onBrowse={() => change({ view: "accounts", dates: null })}
            unplacedCount={unplaced.length}
          />
        </div>
        <section
          className="accounts-workspace"
          id="catalog"
          hidden={view !== "accounts"}
          aria-label="Account list"
        >
          <div className="section-heading">
            <div>
              <h2>Accounts</h2>
              <p>
                Source claims, dates and citations, including accounts without
                calendar dates.
              </p>
            </div>
            <span className="subtle-count" aria-live="polite">
              {catalog.length} matching entries
            </span>
          </div>
          <div className="catalog-controls">
            <SegmentedControl.Root
              aria-label="Date availability"
              value={dateMode}
              onValueChange={(value) =>
                change({ dates: value === "all" ? null : value })
              }
            >
              {[
                ["all", "All accounts"],
                ["dated", "Dated"],
                ["undated", "Undated"],
              ].map(([value, label]) => (
                <SegmentedControl.Item key={value} value={value!}>
                  {label}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl.Root>
            <label>
              Order
              <SelectField
                aria-label="Catalog order"
                value={sort}
                onValueChange={(value) => change({ sort: value })}
              >
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="title">A–Z</SelectItem>
              </SelectField>
            </label>
            <label className="checkbox-label">
              <Checkbox
                checked={onlySelected}
                onCheckedChange={(checked) =>
                  change({ scope: checked === true ? null : "all" })
                }
              />
              Selected tracks only
            </label>
            <Button
              className="button secondary"
              onClick={() => downloadCatalog(catalog)}
            >
              Export results <Icon name="arrow" size={14} />
            </Button>
          </div>
          <div className="event-grid">
            {catalog.slice(0, limit).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {catalog.length > limit && (
            <div className="catalog-pagination">
              <p>
                Showing {Math.min(limit, catalog.length)} of {catalog.length}
              </p>
              <Button
                className="button secondary"
                onClick={() => setLimit((value) => value + 12)}
              >
                Load 12 more accounts
              </Button>
            </div>
          )}
          {!catalog.length && (
            <div className="empty-state">
              <h3>No accounts match this selection.</h3>
              <p>
                Try including other tracks, changing date availability or
                clearing your filters.
              </p>
              <Button
                className="button secondary"
                onClick={() => {
                  clearFilters();
                  change({ scope: "all" });
                }}
              >
                Reset filters
              </Button>
            </div>
          )}
        </section>
        {filtersActive && (
          <Disclosure
            className="source-overview"
            title={`Compare coverage across all ${tracks.length} tracks`}
          >
            <p>Matching topics may refer to different events.</p>
            <div className="comparison-grid">
              {tracks.map((track) => {
                const entries = matches.filter(
                  (event) => event.trackId === track.id,
                );
                return (
                  <div
                    className="comparison-cell"
                    key={track.id}
                    style={{ borderTopColor: track.color }}
                  >
                    <h3>
                      {track.name} <small>{entries.length}</small>
                    </h3>
                    {entries.length ? (
                      <>
                        {entries.slice(0, 3).map((event) => (
                          <a key={event.id} href={timelineEventHref(event.id)}>
                            {event.title}
                            <Icon name="arrow" size={13} />
                          </a>
                        ))}
                        {entries.length > 3 && (
                          <Button
                            className="text-button"
                            onClick={() =>
                              change({
                                tracks: track.id,
                                scope: null,
                                view: "accounts",
                                dates: null,
                              })
                            }
                          >
                            Read all {entries.length} accounts →
                          </Button>
                        )}
                      </>
                    ) : (
                      <p>No matching entry in this collection.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </Disclosure>
        )}
      </section>
      <Disclosure
        className="workspace-disagreements"
        title={
          <>
            Conflicting accounts{" "}
            <Badge color="gray">{disagreements.length} comparisons</Badge>
          </>
        }
      >
        <DisagreementsPanel />
      </Disclosure>
      {trackPicker && (
        <Modal
          title="Choose timeline tracks"
          onClose={() => setTrackPicker(false)}
        >
          <div className="detail-content">
            <h2>Choose tracks</h2>
            <p>
              {mobile
                ? "The mobile timeline compares two tracks. Use the left and right selectors after closing this panel."
                : "Select the sources to display. Counts reflect your current search."}
            </p>
            {!mobile && (
              <div className="picker-actions">
                <Button
                  className="chip"
                  onClick={() =>
                    change({
                      tracks: tracks.map((track) => track.id).join(","),
                    })
                  }
                >
                  Select all
                </Button>
                <Button
                  className="chip"
                  onClick={() => change({ tracks: defaultTracks.join(",") })}
                >
                  Reset selection
                </Button>
                <Button
                  className="chip"
                  disabled={!matches.length}
                  onClick={() =>
                    change({
                      tracks: tracks
                        .filter((track) =>
                          matches.some((event) => event.trackId === track.id),
                        )
                        .map((track) => track.id)
                        .join(","),
                    })
                  }
                >
                  Use matching tracks
                </Button>
              </div>
            )}
            <div className="track-picker-list">
              {tracks.map((track) => {
                const entries = matches.filter(
                  (event) => event.trackId === track.id && !event.gap,
                );
                return (
                  <label key={track.id} className="track-choice">
                    <Checkbox
                      checked={activeIds.includes(track.id)}
                      disabled={
                        mobile ||
                        (selected.length === 1 && selected.includes(track.id))
                      }
                      onCheckedChange={() => toggleTrack(track.id)}
                    />
                    <i style={{ background: track.color }} />
                    <span>
                      <strong>{track.name}</strong>
                      <small>
                        {entries.filter((event) => event.year !== null).length}{" "}
                        dated ·{" "}
                        {entries.filter((event) => event.year === null).length}{" "}
                        without a date
                        {track.status && track.status !== "Confirmed"
                          ? ` · ${track.status}`
                          : ""}
                      </small>
                    </span>
                  </label>
                );
              })}
            </div>
            <Button
              className="button primary"
              onClick={() => setTrackPicker(false)}
            >
              Done
            </Button>
          </div>
        </Modal>
      )}
      {detail && (
        <EventDetail
          key={detail.id}
          event={detail}
          onClose={() =>
            navigate(`/timeline${params.size ? `?${params}` : ""}`)
          }
        />
      )}
      {eventId && !detail && (
        <p role="status" className="notice">
          This event could not be found.{" "}
          <a href={`#/timeline${params.size ? `?${params}` : ""}`}>
            Return to your timeline.
          </a>
        </p>
      )}
    </main>
  );
}

import { useEffect, useState } from "react";
import type { TrackId } from "../../data/types";
import { isDatedEvent } from "../../data/types";
import { sources } from "../../data/sources";
import { downloadCatalog, searchEvents, sortEvents } from "../../lib/catalog";
import { events, eventById } from "../../data/events";
import { tracks } from "../../data/tracks";
import { glossary } from "../../data/glossary";
import { Timeline } from "../../components/Timeline";
import { EventCard } from "../../components/EventCard";
import { EventDetail } from "../../components/EventDetail";
import { Icon } from "../../components/Icon";
import { navigate } from "../../lib/router";

export function TimelinePage({ route }: { route: string }) {
  const params = new URLSearchParams(route.split("?")[1]);
  const topic = params.get("topic") ?? "";
  const focus = params.get("focus") ?? undefined;
  const sourceId = params.get("source") ?? "";
  const [dateMode, setDateMode] = useState("all");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("oldest");
  const [limit, setLimit] = useState(12);
  const [onlySelected, setOnlySelected] = useState(false);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [selected, setSelected] = useState<TrackId[]>(
    tracks.map((track) => track.id),
  );
  const [pair, setPair] = useState<[TrackId, TrackId]>(["mainstream", "plato"]);
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 700px)").matches,
  );
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const update = () => setMobile(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const activeTracks = tracks
    .filter((track) => (mobile ? pair : selected).includes(track.id))
    .sort((a, b) => (mobile ? pair.indexOf(a.id) - pair.indexOf(b.id) : 0));
  const labels = Object.fromEntries([
    ...glossary.map((item) => [item.id, item.title]),
    ...sources.map((item) => [item.id, `${item.title} ${item.author}`]),
  ]);
  const matchesTopic = searchEvents(events, query, labels).filter(
    (event) =>
      (!topic || event.topicIds.includes(topic)) &&
      (!sourceId || event.citations.some((c) => c.sourceId === sourceId)) &&
      (kind === "all" || event.kind === kind) &&
      (region === "all" || event.region === region) &&
      (dateMode === "all" ||
        (dateMode === "dated" ? event.year !== null : event.year === null)),
  );
  const visible = matchesTopic.filter((event) =>
    activeTracks.some((track) => track.id === event.trackId),
  );
  const catalog = sortEvents(
    (onlySelected ? visible : matchesTopic).filter((event) => !event.gap),
    sort,
  );
  useEffect(
    () => setLimit(12),
    [
      query,
      topic,
      kind,
      region,
      dateMode,
      sourceId,
      sort,
      onlySelected,
      selected,
      pair,
    ],
  );
  useEffect(() => {
    const target = focus ? eventById[focus] : undefined;
    if (!target) return;
    setQuery("");
    setKind("all");
    setRegion("all");
    setDateMode("all");
    setSelected((current) =>
      current.includes(target.trackId) ? current : [...current, target.trackId],
    );
    setPair((current) =>
      current.includes(target.trackId) ? current : [current[0], target.trackId],
    );
  }, [focus]);
  const eventId = route.split("?")[0]?.split("/event/")[1];
  const detail = eventId ? eventById[eventId] : undefined;
  function toggleTrack(id: TrackId) {
    setSelected((current) =>
      current.includes(id)
        ? current.length > 1
          ? current.filter((track) => track !== id)
          : current
        : [...current, id],
    );
  }
  function changePair(index: 0 | 1, value: TrackId) {
    setPair((current) => {
      const other = index === 0 ? 1 : 0;
      const next: [TrackId, TrackId] = [...current];
      if (next[other] === value) next[other] = next[index];
      next[index] = value;
      return next;
    });
  }
  return (
    <main>
      <section className="page-intro timeline-intro">
        <div>
          <span className="eyebrow">
            <span className="small-star">✳</span> AN OPEN EXPLORATION OF OUR
            PAST
          </span>
          <h1>
            Many stories.
            <br className="mobile-break" /> <em>One shared past.</em>
          </h1>
          <p>
            Follow the threads of history, sacred texts, and alternative
            thought.
            <br className="desktop-break" /> See where they meet. Explore where
            they diverge.
          </p>
        </div>
        <div className="intro-note">
          <span className="orbital-mark">◎</span>
          <p>
            A little perspective
            <br />
            changes everything.
          </p>
        </div>
      </section>
      <section className="explorer" aria-label="Timeline explorer">
        <div className="explorer-toolbar">
          <div className="view-title">
            <span className="section-number">01</span>
            <h2>Explore the timeline</h2>
          </div>
          <div className="search-tools">
            <button
              className="text-button catalog-jump"
              onClick={() =>
                document.getElementById("catalog")?.scrollIntoView({
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "instant"
                    : "smooth",
                })
              }
            >
              Browse {catalog.length} accounts ↓
            </button>
            <label className="search-box">
              <Icon name="search" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find a topic, event, or idea…"
                aria-label="Search timeline"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <Icon name="close" size={14} />
                </button>
              )}
            </label>
            <button
              className={`button filter-button ${showFilters ? "active" : ""}`}
              aria-expanded={showFilters}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon name="filter" />
              Filters{kind !== "all" && <span className="live-dot" />}
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="filter-panel">
            <label>
              Evidence type{" "}
              <select
                value={kind}
                onChange={(event) => setKind(event.target.value)}
              >
                <option value="all">All types of account</option>
                {[...new Set(events.map((event) => event.kind))].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Region{" "}
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
              >
                <option value="all">All regions</option>
                {[
                  ...new Set(
                    events.flatMap((event) =>
                      event.region ? [event.region] : [],
                    ),
                  ),
                ]
                  .sort()
                  .map((value) => (
                    <option key={value}>{value}</option>
                  ))}
              </select>
            </label>
            <button
              className="text-button"
              onClick={() => {
                setKind("all");
                setRegion("all");
                setDateMode("all");
                setQuery("");
                navigate("/timeline");
              }}
            >
              Clear filters
            </button>
            <span>Source claims retain their own context.</span>
          </div>
        )}
        {sourceId && (
          <div className="topic-filter">
            Reading{" "}
            <strong>
              {sources.find((source) => source.id === sourceId)?.title ??
                sourceId}
            </strong>
            <a href="#/timeline" aria-label="Remove source filter">
              <Icon name="close" size={14} />
            </a>
          </div>
        )}
        {topic && (
          <div className="topic-filter">
            Exploring{" "}
            <strong>
              {glossary.find((entry) => entry.id === topic)?.title ?? topic}
            </strong>
            <a href="#/timeline" aria-label="Remove topic filter">
              <Icon name="close" size={14} />
            </a>
          </div>
        )}
        {mobile ? (
          <div className="mobile-track-selectors">
            {([0, 1] as const).map((index) => (
              <label key={index}>
                <span>{index === 0 ? "LEFT TRACK" : "RIGHT TRACK"}</span>
                <select
                  value={pair[index]}
                  onChange={(event) =>
                    changePair(index, event.target.value as TrackId)
                  }
                  style={{
                    borderColor: tracks.find(
                      (track) => track.id === pair[index],
                    )?.color,
                  }}
                  aria-label={index === 0 ? "Left track" : "Right track"}
                >
                  {tracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        ) : (
          <div className="track-toggles">
            {tracks.map((track) => (
              <button
                key={track.id}
                aria-pressed={selected.includes(track.id)}
                onClick={() => toggleTrack(track.id)}
                title={track.description}
              >
                <i style={{ background: track.color }} />
                {track.name}
                {selected.includes(track.id) && (
                  <span className="track-check">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
        <Timeline
          tracks={activeTracks}
          events={visible.filter(isDatedEvent)}
          mobile={mobile}
          focusId={focus}
        />
        <div className="explorer-footnote">
          <span>
            <span className="small-star">✳</span> Different sources. Different
            kinds of evidence. A shared scale.
          </span>
          <a href="#/mission">
            How to read this atlas <Icon name="arrow" size={14} />
          </a>
        </div>
      </section>
      {(query || topic || sourceId) && (
        <section className="comparison-section">
          <div className="section-heading">
            <h2>One topic, many perspectives</h2>
            <span>
              {matchesTopic.length} matching entries across all tracks
            </span>
          </div>
          <div className="comparison-grid">
            {tracks.map((track) => (
              <div
                className="comparison-cell"
                key={track.id}
                style={{ borderTopColor: track.color }}
              >
                <h3>{track.name}</h3>
                {matchesTopic.filter((event) => event.trackId === track.id)
                  .length ? (
                  matchesTopic
                    .filter((event) => event.trackId === track.id)
                    .map((event) => (
                      <a key={event.id} href={`#/timeline/event/${event.id}`}>
                        {event.title}
                        <Icon name="arrow" size={13} />
                      </a>
                    ))
                ) : (
                  <p>No matching entry in the current collection.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="stories-section" id="catalog">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE RESEARCH COLLECTION</span>
            <h2>Every account, within reach.</h2>
          </div>
          <span className="subtle-count" aria-live="polite">
            {catalog.length} matching entries · {events.length} total records
          </span>
        </div>
        <div className="catalog-controls">
          <div className="segmented" aria-label="Date availability">
            {[
              ["all", "All accounts"],
              ["dated", "Dated"],
              ["undated", "Undated"],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={dateMode === value}
                onClick={() => setDateMode(value!)}
              >
                {label}
              </button>
            ))}
          </div>
          <label>
            Order{" "}
            <select
              aria-label="Catalog order"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="oldest">Oldest first</option>
              <option value="newest">Newest first</option>
              <option value="title">A–Z</option>
            </select>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={onlySelected}
              onChange={(event) => setOnlySelected(event.target.checked)}
            />{" "}
            Selected tracks only
          </label>
          <button
            className="button secondary"
            onClick={() => downloadCatalog(catalog)}
          >
            Export results <Icon name="arrow" size={14} />
          </button>
        </div>
        <p className="catalog-note">
          {matchesTopic.filter((event) => event.year === null).length} accounts
          have no calendar placement. They remain readable here.{" "}
          {mobile
            ? "The timeline compares your two selected tracks; the catalog can browse all six."
            : "Zoom the timeline for dates, or browse every account below."}
        </p>
        <div className="chips quick-topics">
          {[
            "atlantis",
            "flood-narratives",
            "eden",
            "jesus",
            "pyramids",
            "graham-hancock",
            "randall-carlson",
          ].map((id) => (
            <a key={id} className="chip" href={`#/timeline?topic=${id}`}>
              {glossary.find((item) => item.id === id)?.title}
            </a>
          ))}
          <a className="chip" href="#/sources">
            Browse all sources <Icon name="arrow" size={13} />
          </a>
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
            <button
              className="button secondary"
              onClick={() => setLimit((current) => current + 12)}
            >
              Load 12 more accounts
            </button>
          </div>
        )}
        {!catalog.length && (
          <div className="empty-state">
            <h3>No accounts match these filters.</h3>
            <p>Try another topic, region, or type of source.</p>
            <button
              className="button secondary"
              onClick={() => {
                setQuery("");
                setKind("all");
                setRegion("all");
                setDateMode("all");
                setOnlySelected(false);
                navigate("/timeline");
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
      <section className="atlas-invitation">
        <div className="invitation-stripes">
          {tracks.map((track) => (
            <i key={track.id} style={{ background: track.color }} />
          ))}
        </div>
        <div>
          <span className="eyebrow">CURIOSITY IS THE COMMON THREAD</span>
          <h2>
            The past is a conversation.
            <br />
            <em>There’s room for more than one voice.</em>
          </h2>
        </div>
        <a className="button secondary" href="#/mission">
          Our mission <Icon name="arrow" />
        </a>
      </section>
      {detail && (
        <EventDetail
          key={detail.id}
          event={detail}
          onClose={() =>
            navigate(
              topic
                ? `/timeline?topic=${encodeURIComponent(topic)}`
                : "/timeline",
            )
          }
        />
      )}
      {eventId && !detail && (
        <div role="status" className="notice">
          This event could not be found.{" "}
          <a href="#/timeline">Return to the timeline.</a>
        </div>
      )}
    </main>
  );
}

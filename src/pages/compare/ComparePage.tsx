import { useEffect, useState } from "react";
import { events, eventById } from "../../data/events";
import { glossary } from "../../data/glossary";
import { sources, sourceById } from "../../data/sources";
import { tracks, trackById } from "../../data/tracks";
import type { AtlasEvent } from "../../data/types";
import { calendarYear, yearsAgo } from "../../lib/time";
import { searchEvents, sortEvents } from "../../lib/catalog";
import {
  comparisonPath,
  relatedAccounts,
  sharedTopics,
} from "../../lib/compare";
import { navigate } from "../../lib/router";
import { Icon } from "../../components/Icon";

const labels = Object.fromEntries(
  [...glossary, ...sources].map((item) => [item.id, item.title]),
);
const searchLabels = {
  ...labels,
  ...Object.fromEntries(
    sources.map((item) => [item.id, `${item.title} ${item.author}`]),
  ),
};

function AccountCard({ event }: { event: AtlasEvent }) {
  const track = trackById[event.trackId];
  return (
    <article className="compare-card" style={{ borderTopColor: track.color }}>
      <span className="track-label">
        <i style={{ background: track.color }} />
        {track.name}
      </span>
      <h2>{event.title}</h2>
      <span className="tag">{event.kind}</span>
      <dl className="compare-facts">
        <dt>Calendar placement</dt>
        <dd>
          {event.dateLabel ??
            (event.year === null
              ? "Unplaced account"
              : `${calendarYear(event.year)}${event.endYear !== undefined ? ` – ${calendarYear(event.endYear)}` : ""}`)}
          {event.year !== null && (
            <small>
              {yearsAgo(event.year)}
              {event.approximate ? " · approximate" : ""}
            </small>
          )}
        </dd>
        <dt>Account</dt>
        <dd>{event.summary}</dd>
        <dt>Dating basis</dt>
        <dd>{event.dateBasis}</dd>
        {event.region && (
          <>
            <dt>Region</dt>
            <dd>{event.region}</dd>
          </>
        )}
      </dl>
      {event.gap && <aside className="notice">{event.gap.explanation}</aside>}
      <h3>Passages & evidence</h3>
      <div className="compare-citations">
        {event.citations.map((citation, index) => (
          <div className="citation" key={`${citation.sourceId}-${index}`}>
            <div>
              <a href={citation.url} target="_blank" rel="noreferrer">
                {sourceById[citation.sourceId]?.title ?? citation.sourceId}{" "}
                <Icon name="arrow" size={14} />
              </a>
              <p>{citation.passage}</p>
              {citation.note && <small>{citation.note}</small>}
              {citation.checkedOn && (
                <small>Attribution checked {citation.checkedOn}</small>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chips">
        {event.topicIds.map((id) => (
          <a className="chip" key={id} href={`#/glossary/${id}`}>
            {labels[id] ?? id}
          </a>
        ))}
      </div>
      <a className="button secondary" href={`#/timeline/event/${event.id}`}>
        Open entry & save <Icon name="arrow" size={15} />
      </a>
    </article>
  );
}

export function ComparePage({ route }: { route: string }) {
  const params = new URLSearchParams(route.split("?")[1]);
  const left =
    eventById[params.get("left") ?? ""] ?? eventById["plato-atlantis"]!;
  const requestedRight = eventById[params.get("right") ?? ""];
  const right =
    requestedRight && requestedRight.id !== left.id
      ? requestedRight
      : (relatedAccounts(left, events, 1)[0] ??
        events.find((event) => event.id !== left.id)!);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const options = sortEvents(
    searchEvents(events, query, searchLabels),
    "title",
  );
  const common = sharedTopics(left, right);
  const shareUrl = `${location.origin}${location.pathname}${location.search}#${comparisonPath(left.id, right.id)}`;
  const invalid =
    (params.has("left") && !eventById[params.get("left")!]) ||
    (params.has("right") && !requestedRight);
  useEffect(() => {
    setCopied(false);
    setCopyFailed(false);
  }, [left.id, right.id]);
  function select(side: "left" | "right", id: string) {
    setCopied(false);
    setCopyFailed(false);
    navigate(
      side === "left"
        ? comparisonPath(id, id === right.id ? left.id : right.id)
        : comparisonPath(id === left.id ? right.id : left.id, id),
    );
  }
  return (
    <main className="reference-page compare-page">
      <section className="page-intro">
        <span className="eyebrow">READ ACROSS THE TRACKS</span>
        <h1>
          Two accounts.
          <br />
          <em>Room to compare.</em>
        </h1>
        <p>
          Place the dates, claims, and original passages side by side. Shared
          topics suggest a connection; they do not establish that two accounts
          describe the same event.
        </p>
      </section>
      {invalid && (
        <p role="status" className="notice">
          An entry in this link could not be found. Available accounts are shown
          below.
        </p>
      )}
      <div className="reference-tools">
        <label className="search-box">
          <Icon name="search" />
          <input
            aria-label="Find accounts to compare"
            placeholder="Narrow the choices by topic, source, or place…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button
          className="button secondary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(shareUrl);
              setCopied(true);
            } catch {
              setCopyFailed(true);
            }
          }}
        >
          {copied ? "Comparison link copied" : "Copy comparison link"}
        </button>
      </div>
      <p className="muted" aria-live="polite">
        {options.length} matching entries. Your current pair stays selected
        while you search.
      </p>
      {copyFailed && (
        <label className="share-fallback">
          Copy this comparison address
          <input
            readOnly
            value={shareUrl}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
      <div className="compare-selectors">
        {(["left", "right"] as const).map((side, index) => {
          const current = index === 0 ? left : right;
          const selectedOptions = options.some(
            (event) => event.id === current.id,
          )
            ? options
            : [current, ...options];
          return (
            <label key={side}>
              <span>Account {index + 1}</span>
              <select
                aria-label={`Account ${index + 1}`}
                value={current.id}
                onChange={(event) => select(side, event.target.value)}
              >
                {tracks.map((track) => (
                  <optgroup key={track.id} label={track.name}>
                    {selectedOptions
                      .filter((event) => event.trackId === track.id)
                      .map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>
          );
        })}
      </div>
      <div className="comparison-topics">
        <span>
          {common.length ? "Shared topics" : "No specific topic tags in common"}
        </span>
        {common.map((id) => (
          <a className="chip" href={`#/glossary/${id}`} key={id}>
            {labels[id] ?? id}
          </a>
        ))}
      </div>
      <div className="compare-grid">
        <AccountCard event={left} />
        <AccountCard event={right} />
      </div>
    </main>
  );
}

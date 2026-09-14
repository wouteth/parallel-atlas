import { Badge, Card } from "@radix-ui/themes";
import {
  LinkButton,
  SearchField,
  SelectField,
  SelectGroup,
  SelectItem,
  Button,
  Input,
} from "../../components/ui/Controls";
import { useEffect, useState } from "react";
import { events, eventById } from "../../data/events";
import { glossary } from "../../data/glossary";
import { sources, sourceById } from "../../data/sources";
import { tracks, trackById } from "../../data/tracks";
import type { TimelineEvent } from "../../data/types";
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

function AccountCard({ event }: { event: TimelineEvent }) {
  const track = trackById[event.trackId];
  return (
    <Card asChild size="3">
      <article className="compare-card" style={{ borderTopColor: track.color }}>
        <span className="track-label">
          <i style={{ background: track.color }} />
          {track.name}
        </span>
        <h2>{event.title}</h2>
        <Badge color="gray" variant="soft">
          {event.kind}
        </Badge>
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
            <LinkButton className="chip" key={id} href={`#/glossary/${id}`}>
              {labels[id] ?? id}
            </LinkButton>
          ))}
        </div>
        <LinkButton
          className="button secondary"
          href={`#/timeline/event/${event.id}`}
        >
          Open entry <Icon name="arrow" size={15} />
        </LinkButton>
      </article>
    </Card>
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
        <h1>Compare accounts</h1>
        <p>
          Compare two accounts and their citations. A shared topic does not mean
          they describe the same event.
        </p>
      </section>
      {invalid && (
        <p role="status" className="notice">
          An entry in this link could not be found. Available accounts are shown
          below.
        </p>
      )}
      <div className="reference-tools">
        <SearchField
          aria-label="Find accounts to compare"
          placeholder="Narrow the choices by topic, source, or place…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button
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
        </Button>
      </div>
      <p className="muted" aria-live="polite">
        {options.length} matching entries. Your current pair stays selected
        while you search.
      </p>
      {copyFailed && (
        <label className="share-fallback">
          Copy this comparison address
          <Input
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
              <SelectField
                aria-label={`Account ${index + 1}`}
                value={current.id}
                onValueChange={(value) => select(side, value)}
              >
                {tracks.map((track) => (
                  <SelectGroup key={track.id} label={track.name}>
                    {selectedOptions
                      .filter((event) => event.trackId === track.id)
                      .map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                ))}
              </SelectField>
            </label>
          );
        })}
      </div>
      <div className="comparison-topics">
        <span>
          {common.length ? "Shared topics" : "No specific topic tags in common"}
        </span>
        {common.map((id) => (
          <LinkButton className="chip" href={`#/glossary/${id}`} key={id}>
            {labels[id] ?? id}
          </LinkButton>
        ))}
      </div>
      <div className="compare-grid">
        <AccountCard event={left} />
        <AccountCard event={right} />
      </div>
    </main>
  );
}

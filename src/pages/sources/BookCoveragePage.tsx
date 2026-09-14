import { useMemo, useState } from "react";
import { Badge, Card, Select } from "@radix-ui/themes";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Button, LinkButton, SearchField } from "../../components/ui/Controls";
import { books } from "../../data/books";
import { events, eventById } from "../../data/events";
import { EventDetail } from "../../components/EventDetail";
import { tracks } from "../../data/tracks";
import type { BookCoverage } from "../../data/book-types";
import {
  bookEvents,
  isBookReviewed,
  sectionEvents,
} from "../../lib/book-coverage";
import { normalizeSearch } from "../../lib/catalog";
import { useRoute, replaceRoute, navigate } from "../../lib/router";

function BookCard({
  book,
  query,
  search,
}: {
  book: BookCoverage;
  query: string;
  search: string;
}) {
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(20);
  const linked = useMemo(() => bookEvents(book, events), [book]);
  const bookMatches = normalizeSearch(`${book.title} ${book.edition}`).includes(
    query,
  );
  const matchingSections = book.sections.filter(
    (s) =>
      !query || normalizeSearch(`${s.title} ${s.note ?? ""}`).includes(query),
  );
  const rows = query && !bookMatches ? matchingSections : book.sections;
  const reviewed = isBookReviewed(book);
  return (
    <Card asChild size="3">
      <article className="book-card" id={book.id}>
        <div className="book-heading">
          <div>
            <span className="eyebrow">
              {tracks.find((t) => t.id === book.trackId)?.name}
            </span>
            <h2>{book.title}</h2>
          </div>
          <Badge color="gray" size="2">
            {book.access}
          </Badge>
        </div>
        <p className="book-edition">{book.edition}</p>
        <p>{book.accessNote}</p>
        <div className="book-counts">
          <span>
            {linked.length} linked account{linked.length === 1 ? "" : "s"}
          </span>
          <span>
            {book.sections.length
              ? `${book.sections.length} sections listed`
              : "Section inventory pending"}
          </span>
          <Badge color={reviewed ? "green" : "gray"}>
            {reviewed ? "Narrative review complete" : "Review incomplete"}
          </Badge>
        </div>
        {book.review && <p className="book-review">{book.review.scope}</p>}
        <div className="source-actions">
          <a href={book.url} target="_blank" rel="noreferrer">
            {book.access === "Not located" || book.access === "Synopsis only"
              ? "Source website"
              : "Open online edition"}{" "}
            ↗
          </a>
          <small>Access checked {book.checkedOn}</small>
        </div>
        {book.sections.length > 0 && (
          <Collapsible.Root open={open} onOpenChange={setOpen}>
            <Collapsible.Trigger asChild>
              <Button
                variant="soft"
                className="book-section-toggle"
                aria-label={`${open ? "Hide" : "Show"} sections of ${book.title}`}
              >
                {open ? "Hide sections" : "Show sections"}
                {query && !bookMatches && matchingSections.length > 0
                  ? ` · ${matchingSections.length} match${matchingSections.length === 1 ? "" : "es"}`
                  : ""}
              </Button>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p className="book-section-help">
                A linked account covers its cited passage. The rest of that
                section may still need review.
              </p>
              <ol className="book-section-list">
                {rows.slice(0, limit).map((s) => {
                  const linkedSection = sectionEvents(book, s, events);
                  const exclusion = book.review?.excludedSections.find(
                    (x) => x.id === s.id,
                  );
                  return (
                    <li key={s.id}>
                      <a href={s.url} target="_blank" rel="noreferrer">
                        {s.title} ↗
                      </a>
                      {s.note && <p>{s.note}</p>}
                      {linkedSection.length ? (
                        <div className="book-account-links">
                          {linkedSection.map((e) => (
                            <a
                              key={e.id}
                              href={`#/books/event/${e.id}${search}`}
                            >
                              {e.title}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <small>
                          {exclusion
                            ? exclusion.reason
                            : "No mapped account yet"}
                        </small>
                      )}
                    </li>
                  );
                })}
              </ol>
              {rows.length > limit && (
                <Button variant="soft" onClick={() => setLimit((n) => n + 20)}>
                  Show 20 more sections
                </Button>
              )}
              <p className="book-section-help">
                Showing {Math.min(limit, rows.length)} of {rows.length}{" "}
                sections.
              </p>
            </Collapsible.Content>
          </Collapsible.Root>
        )}
        {!book.sections.length && linked.length > 0 && (
          <div className="book-account-links">
            {linked.map((e) => (
              <a key={e.id} href={`#/books/event/${e.id}${search}`}>
                {e.title}
              </a>
            ))}
          </div>
        )}
      </article>
    </Card>
  );
}

export function BookCoveragePage() {
  const route = useRoute();
  const params = new URLSearchParams(route.split("?")[1] ?? "");
  const search = params.size ? `?${params}` : "";
  const eventId = route.split("?")[0]?.split("/event/")[1];
  const detail = eventId ? eventById[eventId] : undefined;
  const query = params.get("q") ?? "";
  const rawTrack = params.get("track") ?? "all";
  const track = tracks.some((t) => t.id === rawTrack) ? rawTrack : "all";
  const rawAccess = params.get("access") ?? "all";
  const access = [
    "Full text online",
    "Partial edition online",
    "Synopsis only",
    "Not located",
  ].includes(rawAccess)
    ? rawAccess
    : "all";
  const setFilter = (key: string, value: string) => {
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    replaceRoute(`/books${params.size ? `?${params}` : ""}`);
  };
  const [limit, setLimit] = useState(12);
  const normalized = normalizeSearch(query).trim();
  const filtered = books.filter(
    (b) =>
      (track === "all" || b.trackId === track) &&
      (access === "all" || b.access === access) &&
      (!normalized ||
        normalizeSearch(
          `${b.title} ${b.edition} ${b.sections.map((s) => `${s.title} ${s.note ?? ""}`).join(" ")}`,
        ).includes(normalized)),
  );
  return (
    <main className="reference-page">
      <section className="page-intro">
        <h1>Book coverage</h1>
        <p>
          Online editions, their contents and the passages entered in the
          timeline.
        </p>
      </section>
      <aside className="notice">
        <strong>Review in progress</strong>
        <p>
          Section lists show the book’s contents; linked accounts cover cited
          passages. Books without a readable edition are skipped or labeled as
          synopsis only.
        </p>
      </aside>
      <div className="reference-tools book-filters">
        <SearchField
          aria-label="Search books and sections"
          placeholder="Book, author, paper or chapter…"
          value={query}
          onChange={(e) => {
            setFilter("q", e.target.value);
            setLimit(12);
          }}
        />
        <Select.Root
          value={track}
          onValueChange={(value) => {
            setFilter("track", value);
            setLimit(12);
          }}
        >
          <Select.Trigger aria-label="Book track" />
          <Select.Content>
            <Select.Item value="all">All tracks</Select.Item>
            {tracks
              .filter((t) => books.some((b) => b.trackId === t.id))
              .map((t) => (
                <Select.Item key={t.id} value={t.id}>
                  {t.shortName}
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Root>
        <Select.Root
          value={access}
          onValueChange={(value) => {
            setFilter("access", value);
            setLimit(12);
          }}
        >
          <Select.Trigger aria-label="Edition access" />
          <Select.Content>
            <Select.Item value="all">All access types</Select.Item>
            {[
              "Full text online",
              "Partial edition online",
              "Synopsis only",
              "Not located",
            ].map((a) => (
              <Select.Item key={a} value={a}>
                {a}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <LinkButton href="#/sources">Cited sources</LinkButton>
        {(query || track !== "all" || access !== "all") && (
          <Button
            onClick={() => {
              replaceRoute("/books");
              setLimit(12);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
      <p role="status">
        {filtered.length} book{filtered.length === 1 ? "" : "s"} or volume
        {filtered.length === 1 ? "" : "s"} ·{" "}
        {filtered.reduce((n, b) => n + b.sections.length, 0).toLocaleString()}{" "}
        sections listed
      </p>
      <div className="book-grid">
        {filtered.slice(0, limit).map((book) => (
          <BookCard
            key={`${book.id}:${normalized}`}
            book={book}
            query={normalized}
            search={search}
          />
        ))}
      </div>
      {!filtered.length && (
        <p className="empty-state">No books or sections match these filters.</p>
      )}
      {filtered.length > limit && (
        <Button
          className="book-load-more"
          variant="soft"
          onClick={() => setLimit((n) => n + 12)}
        >
          Show 12 more books
        </Button>
      )}
      <p className="book-section-help">
        Scope: the named works, the 66-book KJV, the specified Hindu and Norse
        editions, and the listed Sitchin books. Newspapers, scientific papers
        and additional traditions remain in Sources. Dates belong to the
        attributed accounts; book sections do not create timeline dates.
      </p>
      {detail && (
        <EventDetail
          key={detail.id}
          event={detail}
          onClose={() => navigate(`/books${search}`)}
        />
      )}
      {eventId && !detail && (
        <div className="empty-state" role="status">
          <p>This account could not be found.</p>
          <Button onClick={() => navigate(`/books${search}`)}>Dismiss</Button>
        </div>
      )}
    </main>
  );
}

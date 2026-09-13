import { useState } from "react";
import { sources } from "../../data/sources";
import { events } from "../../data/events";
import { tracks } from "../../data/tracks";
import { glossary } from "../../data/glossary";
import { normalizeSearch, downloadCatalog } from "../../lib/catalog";
import { Icon } from "../../components/Icon";

export function SourcesPage() {
  const [query, setQuery] = useState("");
  const results = sources
    .filter((source) =>
      normalizeSearch(`${source.title} ${source.author}`).includes(
        normalizeSearch(query),
      ),
    )
    .sort(
      (a, b) =>
        a.author.localeCompare(b.author) || a.title.localeCompare(b.title),
    );
  return (
    <main className="reference-page">
      <section className="page-intro">
        <span className="eyebrow">FOLLOW THE FOOTNOTES</span>
        <h1>
          An atlas built
          <br />
          <em>from its sources.</em>
        </h1>
        <p>
          Primary texts, institutional records, and authors’ own accounts.
          <br className="desktop-break" /> Open a source, then explore the
          entries connected to it.
        </p>
      </section>
      <div className="collection-stats">
        {[
          [events.length, "catalog records"],
          [sources.length, "source records"],
          [glossary.length, "glossary topics"],
          [
            events.filter((event) => event.year === null).length,
            "unplaced accounts",
          ],
        ].map(([count, label]) => (
          <div key={label}>
            <strong>{count}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="reference-tools">
        <label className="search-box">
          <Icon name="search" />
          <input
            aria-label="Search sources"
            placeholder="Find an author, book, or institution…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button
          className="button secondary"
          onClick={() => downloadCatalog(events)}
        >
          Export all event data
        </button>
      </div>
      <div className="source-grid">
        {results.map((source) => {
          const linked = events.filter((event) =>
            event.citations.some((c) => c.sourceId === source.id),
          );
          return (
            <article key={source.id} className="source-card">
              <span className="eyebrow">{source.author}</span>
              <h2>{source.title}</h2>
              <div className="chips">
                {tracks
                  .filter((track) =>
                    linked.some((event) => event.trackId === track.id),
                  )
                  .map((track) => (
                    <span className="track-label" key={track.id}>
                      <i style={{ background: track.color }} />
                      {track.shortName}
                    </span>
                  ))}
              </div>
              <p>
                {linked.length} linked account{linked.length === 1 ? "" : "s"}
              </p>
              <div className="source-actions">
                <a
                  className="text-button"
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the source <Icon name="arrow" size={14} />
                </a>
                <a className="chip" href={`#/timeline?source=${source.id}`}>
                  Explore entries
                </a>
              </div>
            </article>
          );
        })}
      </div>
      {!results.length && (
        <p className="empty-state">No sources match this search.</p>
      )}
      <aside className="notice">
        <strong>How this collection is researched</strong>
        <p>
          Each event carries a passage or section locator and an explanation of
          its date. “Source checked” means the attribution was checked; it does
          not establish that a narrative happened. Some discovery records are
          explicitly limited to a synopsis, search excerpt, or episode
          description. Undated records preserve those limits instead of
          assigning a speculative year.
        </p>
        <p>
          The collection is curated and expandable. Coverage is uneven, images
          are illustrative, and the next research priorities include more
          African and American records, biblical chronology studies,
          artifact-specific cross histories, and timestamped Carlson
          transcripts.
        </p>
      </aside>
    </main>
  );
}

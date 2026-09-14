import { Card } from "@radix-ui/themes";
import { LinkButton, SearchField, Button } from "../../components/ui/Controls";
import { useRoute, replaceRoute } from "../../lib/router";
import { sources } from "../../data/sources";
import { events } from "../../data/events";
import { tracks } from "../../data/tracks";
import { glossary } from "../../data/glossary";
import { normalizeSearch, downloadCatalog } from "../../lib/catalog";
import { Icon } from "../../components/Icon";

export function SourcesPage() {
  const route = useRoute();
  const query = new URLSearchParams(route.split("?")[1]).get("q") ?? "";
  const setQuery = (value: string) => {
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    replaceRoute(`/sources${params.size ? `?${params}` : ""}`);
  };
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
        <h1>Sources</h1>
        <p>Books, papers and records cited in the timeline.</p>
        <LinkButton href="#/books">View book coverage</LinkButton>
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
        <SearchField
          aria-label="Search sources"
          placeholder="Find an author, book, or institution…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && <Button onClick={() => setQuery("")}>Clear search</Button>}
        <Button
          className="button secondary"
          onClick={() => downloadCatalog(events)}
        >
          Export all event data
        </Button>
      </div>
      <p role="status">
        {results.length} matching source{results.length === 1 ? "" : "s"}
      </p>
      <div className="source-grid">
        {results.map((source) => {
          const linked = events.filter((event) =>
            event.citations.some((c) => c.sourceId === source.id),
          );
          return (
            <Card asChild size="3" key={source.id}>
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
                  <LinkButton
                    className="chip"
                    href={`#/timeline?view=accounts&scope=all&source=${source.id}&tracks=${[...new Set(linked.map((event) => event.trackId))].join(",")}`}
                  >
                    Explore entries
                  </LinkButton>
                </div>
              </article>
            </Card>
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
      </aside>
    </main>
  );
}

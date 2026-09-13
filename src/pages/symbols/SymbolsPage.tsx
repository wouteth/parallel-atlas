import { useState } from "react";
import { symbols } from "../../data/symbols";
import { events } from "../../data/events";
import { EventCard } from "../../components/EventCard";
import { Icon } from "../../components/Icon";

function SymbolArt({ id, glyph }: { id: string; glyph: string }) {
  if (id === "star-of-david")
    return (
      <svg
        viewBox="0 0 100 80"
        role="img"
        aria-label="Star of David between two blue stripes, as arranged on the flag of Israel"
      >
        <path d="M8 10H92M8 70H92" stroke="#729cad" strokeWidth="7" />
        <path
          d="M50 21L68 52H32Z M50 60L32 29H68Z"
          stroke="#729cad"
          strokeWidth="2.5"
          fill="none"
        />
      </svg>
    );
  if (id === "templar-cross")
    return (
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="Illustrative red cross pattée"
      >
        <path
          d="M32 8H68L60 40L92 32V68L60 60L68 92H32L40 60L8 68V32L40 40Z"
          fill="#ae7365"
        />
      </svg>
    );
  if (id === "maltese-cross")
    return (
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="Eight-pointed Maltese cross"
      >
        <path
          d="M50 50L28 7L50 20L72 7ZM50 50L93 28L80 50L93 72ZM50 50L72 93L50 80L28 93ZM50 50L7 72L20 50L7 28Z"
          fill="#8f8d76"
        />
      </svg>
    );
  return <span aria-hidden="true">{glyph}</span>;
}
export function SymbolsPage({ id }: { id?: string }) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("All");
  const entry = symbols.find((item) => item.id === id);
  if (id && !entry)
    return (
      <main className="reference-page">
        <h1>Symbol not found</h1>
        <a href="#/symbols">Browse symbols</a>
      </main>
    );
  if (entry)
    return (
      <main className="reference-page">
        <a className="back-link" href="#/symbols">
          <Icon name="left" />
          Symbol encyclopedia
        </a>
        <div className="symbol-detail-intro">
          <div className="symbol-art large">
            <SymbolArt id={entry.id} glyph={entry.glyph} />
          </div>
          <div className="reading-intro">
            <span className="eyebrow">
              {entry.family} · SYMBOL ENCYCLOPEDIA
            </span>
            <h1>{entry.title}</h1>
            <p>{entry.description}</p>
            <span className="tag">
              {entry.historicalUsage.some(
                (usage) => usage.status === "Reviewed",
              )
                ? "Sourced cultural contexts"
                : "Usage research pending"}
            </span>
          </div>
        </div>
        <section className="reference-section">
          <h2>Across cultures and eras</h2>
          <p className="muted">
            Each context gets its own record. These structured fields are ready
            for the research team.
          </p>
          {entry.historicalUsage.map((usage, index) => (
            <div key={index}>
              <dl className="usage-grid">
                {[
                  ["Culture / community", usage.culture],
                  ["Era / date range", usage.era],
                  ["Geographic region", usage.region],
                  ["Meaning and context", usage.meaning],
                  [
                    "Primary citations",
                    usage.citations.length
                      ? `${usage.citations.length} references`
                      : null,
                  ],
                  ["Research status", usage.status],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value ?? "To be researched"}</dd>
                  </div>
                ))}
              </dl>
              <div className="chips">
                {usage.citations.map((citation, i) => (
                  <a
                    key={i}
                    className="chip"
                    href={citation.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {citation.passage} <Icon name="arrow" size={13} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>
        <section className="reference-section">
          <h2>On the timeline</h2>
          <div className="event-grid">
            {events
              .filter((event) => event.symbolIds.includes(entry.id))
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
          {!events.some((event) => event.symbolIds.includes(entry.id)) && (
            <div className="empty-state">
              <p>No sourced timeline connections have been added yet.</p>
              <a href="#/timeline" className="text-button">
                Explore the timeline <Icon name="arrow" size={14} />
              </a>
            </div>
          )}
        </section>
      </main>
    );
  const results = symbols.filter(
    (item) =>
      (family === "All" || family === item.family) &&
      `${item.title} ${item.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main className="reference-page">
      <section className="page-intro">
        <span className="eyebrow">A LANGUAGE BEYOND WORDS</span>
        <h1>
          Small forms.
          <br />
          <em>Deep histories.</em>
        </h1>
        <p>
          A dedicated encyclopedia of symbols, their forms, and the contexts
          <br className="desktop-break" /> that give them meaning.
        </p>
      </section>
      <div className="reference-tools">
        <label className="search-box">
          <Icon name="search" />
          <input
            aria-label="Search symbols"
            placeholder="Find a symbol…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="segmented">
          {["All", "Crosses", "Geometric"].map((value) => (
            <button
              key={value}
              aria-pressed={family === value}
              onClick={() => setFamily(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="symbol-grid">
        {results.map((item) => (
          <a
            href={`#/symbols/${item.id}`}
            key={item.id}
            className="symbol-card"
          >
            <div className="symbol-art">
              <SymbolArt id={item.id} glyph={item.glyph} />
            </div>
            <span className="eyebrow">{item.family}</span>
            <h2>
              {item.title}
              <Icon name="arrow" size={16} />
            </h2>
            <span className="reference-count">Explore the usage record</span>
          </a>
        ))}
      </div>
      {!results.length && (
        <p className="empty-state">No symbols match your search.</p>
      )}
      <aside className="notice">
        Context matters. Similar forms can carry very different meanings across
        cultures and eras. Diagrams are schematic; historical usage will be
        supported by individual sources.
      </aside>
    </main>
  );
}

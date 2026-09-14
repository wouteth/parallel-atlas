import { Card, SegmentedControl } from "@radix-ui/themes";
import { LinkButton, SearchField } from "../../components/ui/Controls";
import { useState } from "react";
import { glossary } from "../../data/glossary";
import { events } from "../../data/events";
import { EventCard } from "../../components/EventCard";
import { Icon } from "../../components/Icon";

export function GlossaryPage({ id }: { id?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const entry = glossary.find((item) => item.id === id);
  if (id && !entry)
    return (
      <main className="reference-page">
        <h1>Entry not found</h1>
        <a href="#/glossary">Browse the glossary</a>
      </main>
    );
  if (entry)
    return (
      <main className="reference-page">
        <a className="back-link" href="#/glossary">
          <Icon name="left" />
          The glossary
        </a>
        <div className="reading-intro">
          <span className="eyebrow">{entry.category}</span>
          <h1>{entry.title}</h1>
          <p>{entry.description}</p>
          <LinkButton
            href={`#/timeline?topic=${entry.id}`}
            className="button primary"
          >
            Compare across the timeline <Icon name="arrow" />
          </LinkButton>
        </div>
        <section className="reference-section">
          <h2>Timeline entries</h2>
          <div className="event-grid">
            {events
              .filter((event) => event.topicIds.includes(entry.id))
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
          {!events.some((event) => event.topicIds.includes(entry.id)) && (
            <p className="empty-state">
              No timeline entries for this topic yet.
            </p>
          )}
        </section>
        <section className="reference-section">
          <h2>Related topics and sources</h2>
          <div className="chips">
            {entry.relatedIds.map((related) => (
              <LinkButton
                className="chip"
                key={related}
                href={`#/glossary/${related}`}
              >
                {glossary.find((item) => item.id === related)?.title}
                <Icon name="arrow" size={14} />
              </LinkButton>
            ))}
          </div>
          {entry.links.map((link) => (
            <a
              className="list-link"
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
              <Icon name="arrow" />
            </a>
          ))}
        </section>
      </main>
    );
  const results = glossary.filter(
    (item) =>
      (category === "All" || category === item.category) &&
      `${item.title} ${item.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main className="reference-page">
      <section className="page-intro">
        <h1>Glossary</h1>
        <p>People, places, events and terms used in the timeline.</p>
      </section>
      <div className="reference-tools">
        <SearchField
          aria-label="Search glossary"
          placeholder="Search the glossary…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <SegmentedControl.Root
          aria-label="Glossary category"
          value={category}
          onValueChange={setCategory}
        >
          {["All", "Concept", "Place", "Person", "Event"].map((value) => (
            <SegmentedControl.Item key={value} value={value}>
              {value === "Person" ? "People" : value}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </div>
      <div className="glossary-grid">
        {results.map((item) => (
          <Card asChild size="3" key={item.id}>
            <a
              className="reference-card"
              key={item.id}
              href={`#/glossary/${item.id}`}
            >
              <span className="eyebrow">{item.category}</span>
              <h2>
                {item.title}
                <Icon name="arrow" />
              </h2>
              <p>{item.description}</p>
              <span className="reference-count">
                {
                  events.filter((event) => event.topicIds.includes(item.id))
                    .length
                }{" "}
                timeline connections
              </span>
            </a>
          </Card>
        ))}
      </div>
      {!results.length && (
        <p className="empty-state">No entries match your search.</p>
      )}
    </main>
  );
}

import { Badge } from "@radix-ui/themes";
import { LinkButton } from "./ui/Controls";
import { timelineFocusHref } from "../lib/router";
import { SourceCount } from "./SourceCount";
import { CuratorNote } from "./CuratorNote";
import { useState } from "react";
import type { TimelineEvent } from "../data/types";
import { trackById } from "../data/tracks";
import { imageInfo } from "../data/images";
import { sourceById } from "../data/sources";
import { glossary } from "../data/glossary";
import { symbols } from "../data/symbols";
import { calendarYear, yearsAgo } from "../lib/time";
import { Modal } from "./Modal";
import { Picture } from "./Picture";
import { Icon } from "./Icon";
import { events } from "../data/events";
import { comparisonPath, relatedAccounts } from "../lib/compare";

export function EventDetail({
  event,
  onClose,
}: {
  event: TimelineEvent;
  onClose: () => void;
}) {
  const [enlarged, setEnlarged] = useState(false);
  const track = trackById[event.trackId];
  const media = imageInfo[event.image];
  const related = relatedAccounts(event, events);
  return (
    <>
      <Modal title={event.title} onClose={onClose}>
        <button
          className="detail-picture"
          onClick={() => setEnlarged(true)}
          aria-label={`Enlarge picture for ${event.title}`}
        >
          <Picture kind={event.image} alt={media.alt} />
          <span>
            Expand image <Icon name="plus" size={14} />
          </span>
        </button>
        <div className="detail-content">
          <span className="track-label">
            <i style={{ background: track.color }} />
            {track.name}
            <Badge color="gray" variant="soft">
              {event.kind}
            </Badge>
          </span>
          <h2>{event.title}</h2>
          <p className="event-date">
            {event.dateLabel ??
              (event.year === null
                ? "Undated account"
                : `${calendarYear(event.year)}${event.endYear !== undefined ? ` – ${calendarYear(event.endYear)}` : ""}`)}
            <br />
            {event.year !== null && <span>{yearsAgo(event.year)}</span>}
          </p>
          <p>{event.summary}</p>
          {event.gap && (
            <aside className="notice">{event.gap.explanation}</aside>
          )}
          {event.year !== null && (
            <LinkButton className="chip" href={timelineFocusHref(event.id)}>
              Locate on the timeline <Icon name="arrow" size={13} />
            </LinkButton>
          )}
          <SourceCount event={event} />
          <h3>Dating basis</h3>
          <p className="muted">{event.dateBasis}</p>
          <LinkButton
            className="button secondary"
            href={`#${comparisonPath(event.id, related[0]?.id)}`}
          >
            Compare this account <Icon name="arrow" size={15} />
          </LinkButton>
          <h3>Sources</h3>
          <div className="citations">
            {event.citations.map((citation, index) => (
              <div className="citation" key={`${citation.sourceId}-${index}`}>
                <span className="citation-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
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
                  {sourceById[citation.sourceId]?.commerce.authorStoreUrl && (
                    <a
                      href={
                        sourceById[citation.sourceId]!.commerce.authorStoreUrl!
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Buy directly from the author
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <h3>Related entries and topics</h3>
          {related.length > 0 && (
            <div className="related-accounts">
              {related.map((account) => (
                <a
                  className="list-link"
                  key={account.id}
                  href={`#${comparisonPath(event.id, account.id)}`}
                >
                  <span>
                    <strong>{account.title}</strong>
                    <small>
                      {trackById[account.trackId].name} · compare shared topics
                    </small>
                  </span>
                  <Icon name="arrow" size={15} />
                </a>
              ))}
            </div>
          )}
          <div className="chips">
            {event.topicIds.map((id) => (
              <LinkButton className="chip" key={id} href={`#/glossary/${id}`}>
                {glossary.find((entry) => entry.id === id)?.title ?? id}
                <Icon name="arrow" size={13} />
              </LinkButton>
            ))}
            {event.symbolIds.map((id) => (
              <LinkButton className="chip" key={id} href={`#/symbols/${id}`}>
                {symbols.find((entry) => entry.id === id)?.title ?? id}
              </LinkButton>
            ))}
          </div>
          <CuratorNote trackId={event.trackId} />
          <p className="fine-print">{media.credit}</p>
        </div>
      </Modal>
      {enlarged && (
        <Modal
          title="Enlarged event picture"
          onClose={() => setEnlarged(false)}
          wide
        >
          <Picture
            kind={event.image}
            className="lightbox-image"
            alt={media.alt}
          />
          <p className="lightbox-caption">{media.credit}</p>
        </Modal>
      )}
    </>
  );
}

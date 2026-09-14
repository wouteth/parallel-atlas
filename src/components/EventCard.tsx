import { Card } from "@radix-ui/themes";
import type { TimelineEvent } from "../data/types";
import { imageInfo } from "../data/images";
import { trackById } from "../data/tracks";
import { calendarYear } from "../lib/time";
import { timelineEventHref } from "../lib/router";
import { Picture } from "./Picture";
import { Icon } from "./Icon";

export function EventCard({ event }: { event: TimelineEvent }) {
  const track = trackById[event.trackId];
  return (
    <Card asChild size="3">
      <a className="event-card" href={timelineEventHref(event.id)}>
        <div className="card-picture">
          <Picture kind={event.image} alt="" />
          <span className="picture-tag">
            <i style={{ background: track.color }} />
            {track.shortName}
          </span>
          <span className="image-kind">
            {imageInfo[event.image].documentary
              ? "Museum object"
              : "Illustrative image"}
          </span>
          <span className="picture-arrow">
            <Icon name="arrow" />
          </span>
        </div>
        <div className="card-copy">
          <span className="eyebrow">
            {event.year === null
              ? (event.dateLabel ?? "Undated account")
              : `${event.approximate ? "c. " : ""}${calendarYear(event.year)}`}
          </span>
          <h3>{event.title}</h3>
          <p>{event.summary}</p>
          <span className="card-bottom">
            {event.kind}
            <span>
              {
                new Set(event.citations.map((citation) => citation.sourceId))
                  .size
              }{" "}
              source
              {new Set(event.citations.map((citation) => citation.sourceId))
                .size === 1
                ? ""
                : "s"}{" "}
              <Icon name="book" size={14} />
            </span>
          </span>
        </div>
      </a>
    </Card>
  );
}

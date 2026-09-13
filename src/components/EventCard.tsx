import type { AtlasEvent } from "../data/types";
import { imageInfo } from "../data/images";
import { trackById } from "../data/tracks";
import { calendarYear } from "../lib/time";
import { Picture } from "./Picture";
import { Icon } from "./Icon";

export function EventCard({ event }: { event: AtlasEvent }) {
  const track = trackById[event.trackId];
  return (
    <a className="event-card" href={`#/timeline/event/${event.id}`}>
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
            ? "Undated account"
            : `${event.approximate ? "c. " : ""}${calendarYear(event.year)}`}
        </span>
        <h3>{event.title}</h3>
        <p>{event.summary}</p>
        <span className="card-bottom">
          {event.kind}
          <span>
            {event.citations.length} source
            {event.citations.length === 1 ? "" : "s"}{" "}
            <Icon name="book" size={14} />
          </span>
        </span>
      </div>
    </a>
  );
}

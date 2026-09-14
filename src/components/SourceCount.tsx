import { LinkButton, Disclosure } from "./ui/Controls";
import { timelineEventHref } from "../lib/router";
import { events } from "../data/events";
import type { TimelineEvent } from "../data/types";
import { trackById } from "../data/tracks";
import { sourceById } from "../data/sources";
import { countAccounts } from "../lib/corroboration";

export function SourceCount({ event }: { event: TimelineEvent }) {
  const count = countAccounts(event, events);
  if (event.gap) return null;
  return (
    <Disclosure
      className="source-count"
      title={
        <>
          {count.trackIds.length} track{count.trackIds.length === 1 ? "" : "s"}{" "}
          · {count.sourceIds.length} cited source
          {count.sourceIds.length === 1 ? "" : "s"} for{" "}
          {count.group?.title ?? "this entry"}
        </>
      }
    >
      <p>
        {count.group?.scope ??
          "No related accounts have been grouped with this entry yet."}{" "}
        Counts cover this collection only. They do not measure credibility or
        source independence.
      </p>
      <p>{count.trackIds.map((id) => trackById[id].name).join(" · ")}</p>
      <ul>
        {count.sourceIds.map((id) => (
          <li key={id}>
            <a href={sourceById[id]?.url}>{sourceById[id]?.title ?? id}</a>
          </li>
        ))}
      </ul>
      {count.members.map((item) => (
        <LinkButton
          className="chip"
          key={item.id}
          href={timelineEventHref(item.id)}
        >
          {item.title}
        </LinkButton>
      ))}
    </Disclosure>
  );
}

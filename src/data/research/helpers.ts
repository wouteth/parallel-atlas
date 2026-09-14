import type { TimelineEvent, Citation, Source } from "../types";

export const reviewedOn = "2026-09-12";
export const bce = (year: number) => 1 - year;
export const cite = (
  sourceId: string,
  passage: string,
  url: string,
  note?: string,
): Citation => ({ sourceId, passage, url, note, checkedOn: reviewedOn });
export const source = (
  id: string,
  title: string,
  author: string,
  url: string,
): Source => ({
  id,
  title,
  author,
  url,
  commerce: {
    authorStoreUrl: null,
    publisherStoreUrl: null,
    affiliateDisclosure: null,
  },
});
export function entry(
  input: Pick<
    TimelineEvent,
    "id" | "trackId" | "title" | "year" | "kind" | "summary" | "citations"
  > &
    Partial<TimelineEvent>,
): TimelineEvent {
  return {
    approximate: true,
    dateBasis:
      "Approximate interval stated by the cited source; the timeline marker represents its beginning.",
    topicIds: [],
    symbolIds: [],
    image: "manuscript",
    ...input,
  };
}
export const unanchored =
  "The passage does not supply a BCE/CE date. No external chronology has been imposed; this account appears in the catalog without a timeline marker.";

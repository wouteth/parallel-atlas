import type { TrackId } from "./types";

export interface BookSection {
  id: string;
  title: string;
  url: string;
  /** Optional catalogue mapping; a citation is not a full-section review. */
  eventIds?: string[];
  citationPattern?: string;
  note?: string;
}
export interface BookCoverage {
  id: string;
  title: string;
  trackId: TrackId;
  edition: string;
  url: string;
  access:
    | "Full text online"
    | "Partial edition online"
    | "Synopsis only"
    | "Not located";
  accessNote: string;
  checkedOn: string;
  sourceIds: string[];
  sections: BookSection[];
  /** Full review is recorded only after a reading of every listed section. */
  review?: {
    checkedOn: string;
    scope: string;
    excludedSections: { id: string; reason: string }[];
  };
}

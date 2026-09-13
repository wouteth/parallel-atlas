export type TrackId =
  | "mainstream"
  | "bible"
  | "urantia"
  | "law-of-one"
  | "plato"
  | "alternative";
export type EvidenceKind =
  | "Climate record"
  | "Scientific study"
  | "Archaeology"
  | "Historical document"
  | "Publication"
  | "Sacred narrative"
  | "Revelatory text"
  | "Channeled account"
  | "Classical text"
  | "Alternative hypothesis"
  | "Editorial gap";
export interface Track {
  id: TrackId;
  name: string;
  shortName: string;
  color: string;
  description: string;
}
export interface Citation {
  sourceId: string;
  passage: string;
  url: string;
  note?: string;
  checkedOn?: string;
}
export interface Source {
  id: string;
  title: string;
  author: string;
  url: string;
  commerce: {
    authorStoreUrl: string | null;
    publisherStoreUrl: string | null;
    affiliateDisclosure: string | null;
  };
}
export interface AtlasEvent {
  id: string;
  trackId: TrackId;
  title: string;
  year: number | null;
  endYear?: number;
  region?: string;
  dateLabel?: string;
  dateBasis: string;
  approximate: boolean;
  kind: EvidenceKind;
  summary: string;
  topicIds: string[];
  symbolIds: string[];
  image: "ruins" | "ocean" | "manuscript" | "ankh" | "cross";
  citations: Citation[];
  gap?: { forEventIds: string[]; explanation: string };
}
export type DatedEvent = AtlasEvent & { year: number };
export const isDatedEvent = (event: AtlasEvent): event is DatedEvent =>
  event.year !== null;
export interface GlossaryEntry {
  id: string;
  title: string;
  category: "Concept" | "Place" | "Person" | "Event";
  description: string;
  relatedIds: string[];
  links: { label: string; url: string }[];
}
export interface SymbolEntry {
  id: string;
  title: string;
  family: "Crosses" | "Geometric";
  description: string;
  glyph: string;
  historicalUsage: {
    culture: string | null;
    era: string | null;
    region: string | null;
    meaning: string | null;
    citations: Citation[];
    status: "To be researched" | "Reviewed";
  }[];
}
export interface SavedItem {
  eventId: string;
  kind: "bookmark" | "favorite";
}
export interface Account {
  id: string;
  name: string;
}

import type { Track } from "./types";
export const tracks: Track[] = [
  {
    id: "mainstream",
    name: "Mainstream history",
    shortName: "Mainstream",
    color: "#96968c",
    description: "Archaeology and the historical record",
  },
  {
    id: "bible",
    name: "The Bible",
    shortName: "Bible",
    color: "#cc8b53",
    description: "Biblical narratives and interpretations",
  },
  {
    id: "urantia",
    name: "The Urantia Book",
    shortName: "Urantia",
    color: "#729cad",
    description: "The chronology of the Urantia papers",
  },
  {
    id: "law-of-one",
    name: "The Law of One",
    shortName: "Law of One",
    color: "#a69cbd",
    description: "Accounts from the Ra contact sessions",
  },
  {
    id: "plato",
    name: "Plato’s dialogues",
    shortName: "Plato",
    color: "#a4ac81",
    description: "Timaeus and Critias",
  },
  {
    id: "alternative",
    name: "Alternative research",
    shortName: "Alternative",
    color: "#be887a",
    description: "Other authors, ideas, and hypotheses",
  },
  {
    id: "tolkien",
    name: "Tolkien's legendarium",
    shortName: "Tolkien",
    color: "#78917a",
    description: "Authored fiction: The Silmarillion and The Lord of the Rings",
    status: "Confirmed",
  },
  {
    id: "hindu",
    name: "Hindu traditions",
    shortName: "Hindu",
    color: "#ae927b",
    description: "Distinct texts, traditions, and cyclical chronologies",
    status: "Confirmed",
  },
  {
    id: "norse",
    name: "Norse mythology",
    shortName: "Norse",
    color: "#91adb1",
    description:
      "Eddic narratives; undated unless a source supplies a chronology",
    status: "Confirmed",
  },
  {
    id: "jan-val-ellam",
    name: "Jan Val Ellam",
    shortName: "Val Ellam",
    color: "#c3a2b4",
    description: "Terra Atlantis trilogy · the author’s published synopses",
    status: "Confirmed",
    researchNote:
      "Nine narrative records from the three official synopses. Full chapter texts and calendar dates remain to be reviewed.",
  },
  {
    id: "terra-papers",
    name: "The Terra Papers",
    shortName: "Terra Papers",
    color: "#b6abca",
    description: "Robert Morning Sky's attributed account",
    status: "Candidate",
    researchNote:
      "Narrative passages from an attributed transcription, with retained page locators. The original edition and 1947 crash dating still require collation.",
  },
  {
    id: "sitchin",
    name: "Zecharia Sitchin",
    shortName: "Sitchin",
    color: "#c9ba78",
    description: "The author's internal Anunnaki chronology",
    status: "Candidate",
    researchNote:
      "Selected Earth Chronicles chart entries from a labeled transcription. Explicit BCE dates are plotted; unanchored ‘years ago’ claims remain in the account list.",
  },
];
export const trackById = Object.fromEntries(
  tracks.map((track) => [track.id, track]),
) as Record<Track["id"], Track>;

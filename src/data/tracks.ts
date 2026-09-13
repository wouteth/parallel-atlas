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
];
export const trackById = Object.fromEntries(
  tracks.map((track) => [track.id, track]),
) as Record<Track["id"], Track>;

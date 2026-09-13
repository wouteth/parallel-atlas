import type { GlossaryEntry } from "./types";
import { researchGlossary } from "./research/glossary.ts";
import { expandedGlossary } from "./research/expanded-glossary.ts";

export const glossary: GlossaryEntry[] = [
  {
    id: "atlantis",
    title: "Atlantis",
    category: "Place",
    description:
      "An island civilization in Plato’s Timaeus and Critias, later reinterpreted by spiritual traditions and alternative researchers. This atlas compares those accounts without treating their chronologies as equivalent evidence.",
    relatedIds: ["plato", "flood-narratives", "graham-hancock"],
    links: [
      {
        label: "Read Timaeus",
        url: "https://classics.mit.edu/Plato/timaeus.html",
      },
    ],
  },
  {
    id: "ancient-civilizations",
    title: "Ancient civilizations",
    category: "Concept",
    description:
      "A starting point for exploring early settlements, ritual sites, and societies. “Civilization” has different meanings across the sources; each entry should explain the definition it uses.",
    relatedIds: ["gobekli-tepe", "atlantis"],
    links: [],
  },
  {
    id: "flood-narratives",
    title: "Flood narratives",
    category: "Event",
    description:
      "Stories about destructive waters appear in many traditions. Similar themes do not, on their own, establish a shared event or a common calendar date.",
    relatedIds: ["bible", "urantia", "atlantis"],
    links: [],
  },
  {
    id: "gobekli-tepe",
    title: "Göbekli Tepe",
    category: "Place",
    description:
      "A Neolithic site in present-day Türkiye with monumental enclosures and carved pillars. Its UNESCO listing provides an archaeological chronology for the site.",
    relatedIds: ["ancient-civilizations", "graham-hancock", "randall-carlson"],
    links: [
      {
        label: "UNESCO site record",
        url: "https://whc.unesco.org/en/list/1572/",
      },
    ],
  },
  {
    id: "graham-hancock",
    title: "Graham Hancock",
    category: "Person",
    description:
      "Author of Fingerprints of the Gods, Magicians of the Gods, and America Before. The atlas indexes his official book synopses separately from archaeological site records; page-level print-edition research remains open.",
    relatedIds: ["atlantis", "gobekli-tepe", "randall-carlson"],
    links: [],
  },
  {
    id: "randall-carlson",
    title: "Randall Carlson",
    category: "Person",
    description:
      "A researcher followed by the project for catastrophe and ancient-landscape topics. The catalog includes a discovery record for Kosmographia episode 024; timestamp-level analysis is still pending.",
    relatedIds: ["flood-narratives", "graham-hancock", "gobekli-tepe"],
    links: [],
  },
  {
    id: "plato",
    title: "Plato",
    category: "Person",
    description:
      "The author of Timaeus and Critias. His dialogues provide the classical source for the Atlantis narrative. Stephanus numbers identify passages across editions.",
    relatedIds: ["atlantis"],
    links: [
      {
        label: "Read Critias",
        url: "https://classics.mit.edu/Plato/critias.html",
      },
    ],
  },
  {
    id: "bible",
    title: "The Bible",
    category: "Concept",
    description:
      "A collection of sacred texts interpreted through many religious and historical traditions. The atlas distinguishes what a passage says from dates assigned by later interpreters.",
    relatedIds: ["flood-narratives"],
    links: [],
  },
  {
    id: "urantia",
    title: "The Urantia Book",
    category: "Concept",
    description:
      "A spiritual text organized into numbered papers, sections, and paragraphs. Its narratives are presented as claims of the text, with passage-level references.",
    relatedIds: ["flood-narratives", "ancient-civilizations"],
    links: [
      {
        label: "Urantia Foundation text",
        url: "https://www.urantia.org/urantia-book",
      },
    ],
  },
  {
    id: "law-of-one",
    title: "The Law of One",
    category: "Concept",
    description:
      "A body of channeled question-and-answer material also known as the Ra contact. Dates expressed as “years ago” are anchored to the session year before being placed on the atlas.",
    relatedIds: ["atlantis"],
    links: [{ label: "Read the sessions", url: "https://www.lawofone.info/" }],
  },
];
glossary.push(...researchGlossary, ...expandedGlossary);

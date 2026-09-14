import type { GlossaryEntry } from "./types";
import { researchGlossary } from "./research/glossary.ts";
import { expandedGlossary } from "./research/expanded-glossary.ts";

export const glossary: GlossaryEntry[] = [
  {
    id: "lucifer-rebellion",
    title: "Lucifer Rebellion",
    category: "Event",
    description:
      "Urantia’s rebellion narrative; cross-tradition comparisons remain speculative.",
    relatedIds: ["ragnarok"],
    links: [],
  },
  {
    id: "ragnarok",
    title: "Ragnarok",
    category: "Event",
    description:
      "Norse destruction and renewal narrative without an established BCE/CE date.",
    relatedIds: ["lucifer-rebellion"],
    links: [],
  },
  {
    id: "cosmic-origins",
    title: "Cosmic origins",
    category: "Concept",
    description:
      "Scientific models and attributed cosmologies retain distinct methods, durations and date anchors.",
    relatedIds: [],
    links: [],
  },
  {
    id: "tolkien",
    title: "J. R. R. Tolkien",
    category: "Person",
    description:
      "Author of a fictional legendarium. Literary parallels do not constitute independent ancient testimony.",
    relatedIds: [],
    links: [],
  },
  {
    id: "eridu",
    title: "Eridu and Enki/Ea",
    category: "Place",
    description:
      "A Mesopotamian city and its associated deity. Similar names in modern narratives require borrowing checks.",
    relatedIds: [],
    links: [],
  },

  {
    id: "atlantis",
    title: "Atlantis",
    category: "Place",
    description:
      "An island civilization in Plato’s Timaeus and Critias, later reinterpreted by spiritual traditions and alternative researchers. Project Timeline compares those accounts without treating their chronologies as equivalent evidence.",
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
      "Author of Fingerprints of the Gods, Magicians of the Gods, and America Before. Project Timeline indexes his official book synopses separately from archaeological site records; page-level print-edition research remains open.",
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
      "A collection of sacred texts interpreted through many religious and historical traditions. Project Timeline distinguishes what a passage says from dates assigned by later interpreters.",
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
      "A body of channeled question-and-answer material also known as the Ra contact. Dates expressed as “years ago” are anchored to the session year before being placed on the timeline.",
    relatedIds: ["atlantis"],
    links: [{ label: "Read the sessions", url: "https://www.lawofone.info/" }],
  },
];
glossary.push(...researchGlossary, ...expandedGlossary);

glossary.push(
  ...([
    {
      id: "sitchin",
      title: "Zecharia Sitchin",
      category: "Person",
      description:
        "Author of the Earth Chronicles. Entries preserve his proposed Anunnaki chronology and distinguish it from archaeological dating.",
      relatedIds: ["mesopotamia", "origins"],
      links: [
        {
          label: "Source overview",
          url: "https://www.sitchin.com/",
        },
      ],
    },
    {
      id: "terra-papers",
      title: "The Terra Papers",
      category: "Concept",
      description:
        "Robert Morning Sky’s attributed narrative of extraterrestrial dynasties and human origins. Available transcription records do not establish the claims as history.",
      relatedIds: ["eridu", "origins"],
      links: [
        {
          label: "Source overview",
          url: "https://www.tapatalk.com/groups/astrallife/terra-papers-by-robert-morning-sky-t1192.html",
        },
      ],
    },
    {
      id: "hindu-traditions",
      title: "Hindu textual traditions",
      category: "Concept",
      description:
        "Distinct sacred texts with different narrative sequences and cyclical time systems. The Vishnu Purana and Satapatha Brahmana are identified separately.",
      relatedIds: ["cycles", "creation"],
      links: [
        {
          label: "Source overview",
          url: "https://sacred-texts.com/hin/vp/index.htm",
        },
      ],
    },
    {
      id: "jan-val-ellam",
      title: "Jan Val Ellam",
      category: "Person",
      description:
        "Author of the Terra Atlantis trilogy. Current entries draw on the official Portuguese book synopses; full chapter coverage remains pending.",
      relatedIds: ["atlantis", "lucifer-rebellion"],
      links: [
        {
          label: "Source overview",
          url: "https://janvalellam.org/livros-avan%C3%A7ado",
        },
      ],
    },
  ] satisfies GlossaryEntry[]),
);

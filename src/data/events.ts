import { bookExpansionEvents } from "./research/book-expansion.ts";
import { v04Events } from "./research/v04.ts";
import type { TimelineEvent } from "./types";
import { mainstreamEvents } from "./research/mainstream.ts";
import { bibleEvents } from "./research/bible.ts";
import { urantiaEvents } from "./research/urantia.ts";
import { lawOfOneEvents } from "./research/law-of-one.ts";
import { platoEvents } from "./research/plato.ts";
import { alternativeEvents } from "./research/alternative.ts";
import { symbolEvents } from "./research/symbols.ts";
import { worldEvents } from "./research/world-sites.ts";
import { exodusEvents } from "./research/exodus.ts";
import { climateEvents } from "./research/climate.ts";
import { requestedAuthorEvents } from "./research/requested-authors.ts";
import { norseTerraEvents } from "./research/norse-terra.ts";
import { hinduEvents } from "./research/hindu.ts";
import { deepTimeEvents } from "./research/deep-time-expansion.ts";
import { scienceExpansionEvents } from "./research/science-expansion.ts";

// Astronomical numbering is internal only: year 0 means 1 BCE; no UI displays a year zero.
export const events: TimelineEvent[] = [
  {
    id: "gobekli-tepe",
    trackId: "mainstream",
    title: "Göbekli Tepe",
    year: -9599,
    endYear: -8199,
    approximate: true,
    kind: "Archaeology",
    dateLabel: "c. 9600–8200 BCE",
    dateBasis:
      "UNESCO dates the monumental enclosures to 9600–8200 BCE. The marker uses the start of this interval.",
    summary:
      "Monumental enclosures built by hunter-gatherers in Upper Mesopotamia offer an extraordinary window into early communal and ritual life.",
    topicIds: ["gobekli-tepe", "ancient-civilizations", "neolithic"],
    symbolIds: [],
    image: "ruins",
    citations: [
      {
        sourceId: "unesco-gobekli",
        passage: "Brief synthesis · first paragraph",
        url: "https://whc.unesco.org/en/list/1572/",
      },
    ],
  },
  {
    id: "plato-atlantis",
    trackId: "plato",
    title: "The story of Atlantis",
    year: -9599,
    approximate: true,
    kind: "Classical text",
    dateLabel: "c. 9600 BCE · narrative chronology",
    dateBasis:
      "Illustrative conversion of the dialogue’s 9,000 years before Solon, using c. 600 BCE for Solon. This is the date inside the story, not an established date for a lost civilization.",
    summary:
      "Plato describes an island power beyond the Pillars of Heracles and its destruction. The account belongs to the narrative of his dialogues.",
    topicIds: ["atlantis", "plato", "ancient-civilizations"],
    symbolIds: [],
    image: "ocean",
    citations: [
      {
        sourceId: "timaeus",
        passage: "Timaeus 24e–25d (Stephanus pagination)",
        url: "https://classics.mit.edu/Plato/timaeus.html",
      },
      {
        sourceId: "critias",
        passage: "Critias 108e–109a; 113c–121c",
        url: "https://classics.mit.edu/Plato/critias.html",
      },
    ],
  },
  {
    id: "atlantis-gap",
    trackId: "mainstream",
    title: "Ignored by mainstream history.",
    year: -9599,
    approximate: true,
    kind: "Editorial gap",
    dateBasis:
      "Aligned with the narrative date of Plato’s Atlantis for comparison. This is not a dated historical event.",
    summary:
      "No corresponding accepted Atlantis civilization is represented in this track.",
    topicIds: ["atlantis"],
    symbolIds: [],
    image: "ocean",
    citations: [
      {
        sourceId: "timaeus",
        passage: "Timaeus 24e–25d · account being compared",
        url: "https://classics.mit.edu/Plato/timaeus.html",
      },
    ],
    gap: {
      forEventIds: ["plato-atlantis", "ra-atlantis"],
      explanation:
        "“Ignored by mainstream history.” is the project’s comparison label. It means no accepted counterpart is included in this dataset; it does not mean scholars have never studied or discussed Atlantis.",
    },
  },
  {
    id: "ra-atlantis",
    trackId: "law-of-one",
    title: "Atlantis: the final inundation",
    year: -8840,
    approximate: true,
    kind: "Channeled account",
    dateLabel: "c. 8841 BCE · source-relative date",
    dateBasis:
      "Session 10.15, recorded in 1981, places the destruction 10,821 years earlier. 1981 − 10,821 = astronomical year −8840 (8841 BCE). The source’s claimed precision is not archaeological precision.",
    summary:
      "The Ra material offers a different chronology of Atlantis, describing a final conflict and inundation, followed by the dispersal of survivors.",
    topicIds: ["atlantis", "law-of-one", "flood-narratives"],
    symbolIds: [],
    image: "ocean",
    citations: [
      {
        sourceId: "ra",
        passage: "Session 10, question 15 · January 27, 1981",
        url: "https://www.lawofone.info/s/10#15",
      },
    ],
  },
  {
    id: "urantia-floods",
    trackId: "urantia",
    title: "Floods in Mesopotamia",
    year: -4999,
    approximate: true,
    kind: "Revelatory text",
    dateBasis:
      "Paper 78:7.2 places an acceleration of highland uplift and flooding at about 5000 BCE. This marker dates that claim, not Noah’s individual lifetime.",
    summary:
      "The Urantia Book describes regional river floods and presents its own interpretation of the traditions associated with Noah.",
    topicIds: ["flood-narratives", "urantia", "ancient-civilizations"],
    symbolIds: [],
    image: "ocean",
    citations: [
      {
        sourceId: "urantia",
        passage: "Paper 78, section 7, paragraphs 1–7 (78:7.1–7)",
        url: "https://www.urantia.org/urantia-book-standardized/paper-78-violet-race-after-days-adam",
      },
    ],
  },
  {
    id: "genesis-flood",
    trackId: "bible",
    title: "Noah and the great flood",
    year: null,
    approximate: true,
    kind: "Sacred narrative",
    dateLabel: "Undated in Genesis",
    dateBasis:
      "Genesis gives relative ages and durations, not a BCE date. No later chronology is imposed; this account remains searchable without a timeline marker.",
    summary:
      "Genesis tells of Noah, the ark, a flood, and the covenant that follows. Compare the narrative with the regional account in the Urantia track.",
    topicIds: ["flood-narratives", "bible"],
    symbolIds: [],
    image: "manuscript",
    citations: [
      {
        sourceId: "genesis",
        passage: "Genesis 6:9–9:17",
        url: "https://www.biblegateway.com/passage/?search=Genesis%206%3A9-9%3A17&version=KJV",
        note: "The passage supports the narrative; no absolute calendar placement is asserted.",
      },
    ],
  },
  {
    id: "plato-dialogues",
    trackId: "plato",
    title: "Timaeus & Critias",
    year: null,
    approximate: true,
    kind: "Classical text",
    dateLabel: "Composition date not established here",
    dateBasis:
      "The linked edition supplies the dialogue text but does not establish its composition year. The earlier approximate placement has been removed pending a bibliographic source.",
    summary:
      "The surviving texts through which the Atlantis story reaches later readers. Distinguish a text’s composition from the earlier dates it narrates.",
    topicIds: ["plato", "atlantis"],
    symbolIds: [],
    image: "manuscript",
    citations: [
      {
        sourceId: "timaeus",
        passage: "Timaeus 20d–27b",
        url: "https://classics.mit.edu/Plato/timaeus.html",
      },
      {
        sourceId: "critias",
        passage: "Critias 108e–121c",
        url: "https://classics.mit.edu/Plato/critias.html",
      },
    ],
  },
  {
    id: "ra-sessions",
    trackId: "law-of-one",
    title: "The Ra contact begins",
    year: 1981,
    approximate: false,
    kind: "Channeled account",
    dateBasis:
      "The first session is dated January 15, 1981. This dates the recording, not the events claimed in it.",
    summary:
      "The recorded question-and-answer sessions provide the primary text for the Law of One track.",
    topicIds: ["law-of-one", "atlantis"],
    symbolIds: [],
    image: "manuscript",
    citations: [
      {
        sourceId: "ra",
        passage: "Session 1 · January 15, 1981",
        url: "https://www.lawofone.info/s/1",
      },
    ],
  },
];
events.push(
  ...bookExpansionEvents,
  ...scienceExpansionEvents,
  ...requestedAuthorEvents,
  ...norseTerraEvents,
  ...hinduEvents,
  ...deepTimeEvents,
  ...v04Events,
  ...mainstreamEvents,
  ...bibleEvents,
  ...urantiaEvents,
  ...lawOfOneEvents,
  ...platoEvents,
  ...alternativeEvents,
  ...symbolEvents,
  ...worldEvents,
  ...exodusEvents,
  ...climateEvents,
);
export const eventById = Object.fromEntries(
  events.map((event) => [event.id, event]),
);

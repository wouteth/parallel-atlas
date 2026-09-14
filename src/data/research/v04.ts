import type { TimelineEvent, Source } from "../types";

const commerce = {
  authorStoreUrl: null,
  publisherStoreUrl: null,
  affiliateDisclosure: null,
};
export const v04Sources: Source[] = [
  {
    id: "nasa-cosmic-history",
    title: "The Universe’s History",
    author: "NASA Science",
    url: "https://science.nasa.gov/universe/overview/",
    commerce,
  },
  {
    id: "younger-edda",
    title: "The Younger Edda",
    author: "Snorri Sturluson; translated by Rasmus B. Anderson",
    url: "https://www.gutenberg.org/files/18947/18947-h/18947-h.htm",
    commerce,
  },
  {
    id: "satapatha",
    title: "Satapatha Brahmana, Part I",
    author: "Translated by Julius Eggeling",
    url: "https://sacred-texts.com/hin/sbr/sbe12/sbe1234.htm",
    commerce,
  },
  {
    id: "tolkien-estate",
    title: "Writing: The Silmarillion",
    author: "The Tolkien Estate",
    url: "https://www.tolkienestate.com/writing/",
    commerce,
  },
  {
    id: "oracc-enki",
    title: "Enki/Ea (god)",
    author: "Ruth Horry, Oracc",
    url: "https://oracc.museum.upenn.edu/amgg/listofdeities/enki/",
    commerce,
  },
];
const base = { approximate: true, symbolIds: [], image: "manuscript" as const };
export const v04Events: TimelineEvent[] = [
  {
    ...base,
    id: "scientific-cosmic-history",
    trackId: "mainstream",
    title: "The early universe in scientific cosmology",
    year: 2026 - 13800000000,
    kind: "Scientific study",
    dateLabel: "About 13.8 billion years ago",
    dateBasis:
      "NASA’s overview places cosmic inflation around 13.8 billion years ago. A fixed 2026 display anchor converts that rounded age; the calendar coordinate does not imply year-level scientific precision.",
    summary:
      "Modern cosmology describes an early hot universe, followed much later by the formation of stars and galaxies.",
    topicIds: ["cosmic-origins"],
    citations: [
      {
        sourceId: "nasa-cosmic-history",
        passage: "Cosmic Inflation; Big Bang and Nucleosynthesis; First Stars",
        url: "https://science.nasa.gov/universe/overview/",
        checkedOn: "2026-09-14",
      },
    ],
  },
  {
    ...base,
    id: "urantia-lucifer-rebellion",
    trackId: "urantia",
    title: "The Lucifer manifesto",
    year: 1934 - 200000,
    kind: "Revelatory text",
    dateLabel: "About 200,000 years before the paper’s 1934 frame",
    dateBasis:
      "Paper 53:4.1 states about 200,000 years ago. The plotted coordinate uses the paper’s 1934 narrative frame as an explicit editorial anchor; this is not an independently dated event.",
    summary:
      "The Urantia narrative describes Lucifer declaring a rebellion against the universe’s governing order.",
    topicIds: ["lucifer-rebellion"],
    citations: [
      {
        sourceId: "urantia",
        passage: "53:4.1 · manifesto at the annual conclave",
        url: "https://www.urantia.org/urantia-book-standardized/paper-53-lucifer-rebellion",
        checkedOn: "2026-09-14",
      },
    ],
  },
  {
    ...base,
    id: "urantia-andronover",
    trackId: "urantia",
    title: "Conditions for Andronover’s formation",
    year: 1934 - 987000000000,
    kind: "Revelatory text",
    dateLabel: "About 987 billion years ago · narrated chronology",
    dateBasis:
      "Paper 57:1.3 reports 987 billion years ago. An editorial 1934 narrative anchor makes the relative date displayable; this differs from scientific cosmology.",
    summary:
      "The book places a report of conditions favorable to materialization far earlier than the scientific age of the universe.",
    topicIds: ["cosmic-origins"],
    citations: [
      {
        sourceId: "urantia",
        passage: "57:1.3 · report by force organizer 811,307",
        url: "https://www.urantia.org/urantia-book-standardized/paper-57-origin-urantia",
        checkedOn: "2026-09-14",
      },
    ],
  },
  {
    ...base,
    id: "ra-density-duration",
    trackId: "law-of-one",
    title: "Ra’s first and second density durations",
    year: null,
    kind: "Channeled account",
    dateLabel: "Durations: roughly 2 billion and 4.6 billion years",
    dateBasis:
      "Session 76.13–14 gives durations, not absolute start dates. No start year is inferred from a duration alone.",
    summary:
      "Ra describes two very long developmental stages for Earth and calls the estimates extremely rough.",
    topicIds: ["cosmic-origins"],
    citations: [
      {
        sourceId: "ra",
        passage: "76.13–14 · February 3, 1982",
        url: "https://www.lawofone.info/s/76#13",
        checkedOn: "2026-09-14",
      },
    ],
  },
  {
    ...base,
    id: "norse-ragnarok",
    trackId: "norse",
    title: "Ragnarok: the fall and renewal of the world",
    year: null,
    kind: "Sacred narrative",
    dateBasis:
      "Gylfaginning narrates an eschatological conflict without a BCE/CE date. No 300,000-years-ago placement is supported by this passage.",
    summary:
      "Gods and their enemies meet in a destructive conflict, followed by a renewed world. A resemblance to another narrative does not establish a shared event.",
    topicIds: ["ragnarok"],
    citations: [
      {
        sourceId: "younger-edda",
        passage:
          "Gylfaginning · Chapters XVI–XVII, sections 55–58: Ragnarok and regeneration",
        url: "https://www.gutenberg.org/files/18947/18947-h/18947-h.htm",
        checkedOn: "2026-09-14",
      },
    ],
  },
  {
    ...base,
    id: "hindu-manu-flood",
    trackId: "hindu",
    title: "Manu and the fish’s warning",
    year: null,
    kind: "Sacred narrative",
    dateBasis:
      "Satapatha Brahmana 1.8.1.1–10 narrates the flood without a calendar date. A historical placement is not inferred.",
    summary:
      "A fish warns Manu of a flood and guides his boat to a mountain. This is one Hindu textual account, not a single chronology shared by all Hindu traditions.",
    topicIds: ["flood-narratives"],
    citations: [
      {
        sourceId: "satapatha",
        passage: "1.8.1.1–10 · Manu and the flood",
        url: "https://sacred-texts.com/hin/sbr/sbe12/sbe1234.htm",
        checkedOn: "2026-09-14",
      },
    ],
  },
  {
    ...base,
    id: "tolkien-first-age",
    trackId: "tolkien",
    title: "The end of the First Age",
    year: null,
    kind: "Literary fiction",
    dateBasis:
      "Tolkien’s fictional First Age has no adopted BCE/CE conversion. The Estate’s editorial introduction describes Beleriand’s submergence at the close of the age.",
    summary:
      "The final conflict leaves Beleriand beneath the sea. The event belongs to Tolkien’s authored fictional world.",
    topicIds: ["tolkien", "catastrophe", "flood-narratives"],
    citations: [
      {
        sourceId: "tolkien-estate",
        passage:
          "Christopher Tolkien on The Silmarillion · opening description of Beleriand",
        url: "https://www.tolkienestate.com/writing/christopher-tolkien-the-silmarillion/",
        note: "Synopsis-level discovery record; not a verified chapter-level chronology.",
        checkedOn: "2026-09-14",
      },
    ],
  },
  {
    ...base,
    id: "mesopotamian-enki",
    trackId: "mainstream",
    title: "Enki/Ea and Eridu in Mesopotamian tradition",
    year: null,
    kind: "Historical document",
    dateBasis:
      "The reference describes a deity and cult associations across periods. It does not date a divine event or identify a historical extraterrestrial individual.",
    summary:
      "The Mesopotamian deity Enki/Ea is associated with Eridu and the subterranean freshwater domain. Historical study of a belief is distinct from accepting its divine events as history.",
    topicIds: ["eridu"],
    citations: [
      {
        sourceId: "oracc-enki",
        passage: "Enki/Ea · Functions; Cult Places",
        url: "https://oracc.museum.upenn.edu/amgg/listofdeities/enki/",
        checkedOn: "2026-09-14",
      },
    ],
  },
];

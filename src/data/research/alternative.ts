import { cite, entry, source, unanchored } from "./helpers.ts";

export const alternativeSources = [
  source(
    "hancock-fingerprints",
    "Fingerprints of the Gods · author’s book page",
    "Graham Hancock",
    "https://grahamhancock.com/fingerprints/",
  ),
  source(
    "hancock-underworld",
    "Online Introduction to Underworld",
    "Graham Hancock",
    "https://grahamhancock.com/archive-underworld1/",
  ),
  source(
    "hancock-magicians",
    "Magicians of the Gods · author’s synopsis",
    "Graham Hancock",
    "https://grahamhancock.com/magicians/",
  ),
  source(
    "hancock-america",
    "America Before · author’s synopsis",
    "Graham Hancock",
    "https://grahamhancock.com/america-before/",
  ),
  source(
    "hancock-supernatural",
    "Supernatural · author’s book page",
    "Graham Hancock",
    "https://grahamhancock.com/supernatural/",
  ),
  source(
    "donnelly-atlantis",
    "Atlantis: The Antediluvian World",
    "Ignatius Donnelly · Project Gutenberg edition",
    "https://www.gutenberg.org/cache/epub/4032/pg4032-images.html",
  ),
  source(
    "carlson-24",
    "Randall Carlson Podcast · Episode 024",
    "Randall Carlson / Kosmographia",
    "https://www.youtube.com/watch?v=q6funaSp9SM",
  ),
];
export const alternativeEvents = [
  ...(
    [
      [
        "hancock-fingerprints-publication",
        "Fingerprints of the Gods is published",
        1995,
        "hancock-fingerprints",
        "The book advocates investigating a possible lost civilization in remote prehistory.",
      ],
      [
        "hancock-underworld-essay",
        "Hancock explains the approach behind Underworld",
        2002,
        "hancock-underworld",
        "An online essay presents his approach to submerged landscapes and lost-civilization arguments.",
      ],
      [
        "hancock-supernatural-publication",
        "Supernatural is published",
        2005,
        "hancock-supernatural",
        "Hancock investigates visionary experiences, religion, and prehistoric art.",
      ],
      [
        "hancock-magicians-publication",
        "Magicians of the Gods is published",
        2015,
        "hancock-magicians",
        "Hancock connects a proposed lost civilization with catastrophe near the end of the Ice Age.",
      ],
      [
        "hancock-america-publication",
        "America Before is published",
        2019,
        "hancock-america",
        "Hancock presents arguments for an unrecognized chapter of American prehistory.",
      ],
    ] as const
  ).map(([id, title, year, sourceId, summary]) =>
    entry({
      id,
      title,
      year,
      approximate: false,
      summary,
      trackId: "alternative",
      kind: "Publication",
      topicIds: [
        "graham-hancock",
        "ancient-civilizations",
        ...(sourceId.includes("magicians")
          ? ["younger-dryas", "catastrophe"]
          : []),
      ],
      dateBasis:
        id === "hancock-underworld-essay"
          ? "The official essay is dated February 11, 2002."
          : "Publication year identified on the author’s official book page. This dates the book, not the ancient events it proposes.",
      citations: [
        cite(
          sourceId,
          id === "hancock-underworld-essay"
            ? "An Essay on Methods · opening paragraphs"
            : "Book title, publication information, and synopsis",
          alternativeSources.find((s) => s.id === sourceId)!.url,
          "Author-page metadata and synopsis; a print edition’s page numbers have not been checked.",
        ),
      ],
    }),
  ),
  entry({
    id: "hancock-ice-age-catastrophe",
    title: "Hancock’s proposed Ice Age catastrophe",
    year: null,
    dateLabel: "12,800 years ago · reference year unspecified",
    trackId: "alternative",
    kind: "Alternative hypothesis",
    image: "ocean",
    summary:
      "The Magicians synopsis proposes a comet-related catastrophe and the loss of an earlier civilization.",
    dateBasis:
      "The synopsis gives a rounded years-ago figure without an explicit reference convention. It is not converted to BCE; the proposed cause and civilization remain claims.",
    topicIds: [
      "graham-hancock",
      "catastrophe",
      "younger-dryas",
      "ancient-civilizations",
    ],
    citations: [
      cite(
        "hancock-magicians",
        "Synopsis · proposed catastrophe 12,800 years ago",
        "https://grahamhancock.com/magicians/",
      ),
    ],
  }),
  entry({
    id: "hancock-second-catastrophe",
    title: "A second catastrophe in Magicians",
    year: null,
    dateLabel: "11,600 years ago · reference year unspecified",
    trackId: "alternative",
    kind: "Alternative hypothesis",
    image: "ocean",
    summary:
      "The synopsis describes a later catastrophic episode in the proposed sequence.",
    dateBasis:
      "The author’s synopsis supplies a relative age without an explicit reference year. No calendar placement is assigned.",
    topicIds: ["graham-hancock", "catastrophe", "flood-narratives"],
    citations: [
      cite(
        "hancock-magicians",
        "Synopsis · proposed second episode 11,600 years ago",
        "https://grahamhancock.com/magicians/",
      ),
    ],
  }),
  entry({
    id: "hancock-early-americas",
    title: "The early-Americas claim in America Before",
    year: null,
    dateLabel: "130,000 years ago · claim in the synopsis",
    trackId: "alternative",
    kind: "Alternative hypothesis",
    summary:
      "Hancock’s synopsis invokes a disputed very early human presence in the Americas.",
    dateBasis:
      "This record indexes the author’s claim. Its age convention and underlying excavation evidence require separate assessment before calendar placement.",
    topicIds: ["graham-hancock", "origins", "ancient-civilizations"],
    citations: [
      cite(
        "hancock-america",
        "Synopsis · claimed age of human presence",
        "https://grahamhancock.com/america-before/",
      ),
    ],
  }),
  entry({
    id: "carlson-younger-dryas",
    title: "Carlson explores the Younger Dryas",
    year: null,
    dateLabel: "Podcast episode · publication date pending",
    trackId: "alternative",
    kind: "Alternative hypothesis",
    summary:
      "Episode 024 frames the Younger Dryas as a backdrop for human history and lost-world questions.",
    dateBasis:
      "The episode title and description are indexed. A publication date and timestamp-level transcript review have not yet been established.",
    topicIds: ["randall-carlson", "younger-dryas", "catastrophe"],
    citations: [
      cite(
        "carlson-24",
        "Episode 024 · title and publisher’s description",
        "https://www.youtube.com/watch?v=q6funaSp9SM",
        "Discovery record only; specific spoken claims await timestamp verification.",
      ),
    ],
  }),
  entry({
    id: "donnelly-flood-link",
    title: "Donnelly links flood traditions to Atlantis",
    year: null,
    trackId: "alternative",
    kind: "Alternative hypothesis",
    image: "ocean",
    summary:
      "Donnelly treats flood traditions as memories of a lost Atlantic homeland.",
    dateBasis: unanchored,
    topicIds: ["ignatius-donnelly", "atlantis", "flood-narratives"],
    citations: [
      cite(
        "donnelly-atlantis",
        "Part II · The Deluge · chapter I, The Destruction of Atlantis Described in the Deluge Legends",
        "https://www.gutenberg.org/cache/epub/4032/pg4032-images.html",
      ),
    ],
  }),
  entry({
    id: "donnelly-propositions",
    title: "Donnelly’s Atlantis propositions",
    year: null,
    trackId: "alternative",
    kind: "Alternative hypothesis",
    summary:
      "The opening propositions cast Atlantis as a common source of later civilizations.",
    dateBasis: unanchored,
    topicIds: ["ignatius-donnelly", "atlantis", "ancient-civilizations"],
    citations: [
      cite(
        "donnelly-atlantis",
        "Part I · The History of Atlantis · chapter I, The Purpose of the Book",
        "https://www.gutenberg.org/cache/epub/4032/pg4032-images.html",
      ),
    ],
  }),
];

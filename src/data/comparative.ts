import type { TrackId } from "./types";

export type MatchConfidence =
  | "Strong match"
  | "Suggestive match"
  | "Speculative match";
export interface ConnectionNode {
  id: string;
  label: string;
  trackId: TrackId;
  eventId?: string;
  provenance: string;
}
export interface Connection {
  id: string;
  from: string;
  to: string;
  confidence: MatchConfidence;
  points: string[];
  context: string;
  limitations: string;
  status: "Working comparison" | "Passages needed";
}
export const connectionNodes: ConnectionNode[] = [
  {
    id: "eridu-historical",
    label: "Eridu",
    trackId: "mainstream",
    eventId: "mesopotamian-enki",
    provenance: "Oracc · Enki/Ea · Cult Places",
  },
  {
    id: "eridu-terra",
    label: "Eridu / Earth",
    trackId: "terra-papers",
    eventId: "terra-eridu",
    provenance:
      "Terra Papers transcription · ERIDU, pp. 35–39. Printed edition not collated.",
  },
  {
    id: "ea-historical",
    label: "Enki–Ea",
    trackId: "mainstream",
    eventId: "mesopotamian-enki",
    provenance: "Oracc · Enki/Ea · Functions",
  },
  {
    id: "ea-terra",
    label: "Prince EA",
    trackId: "terra-papers",
    eventId: "terra-hybrid-workers",
    provenance:
      "Terra Papers transcription · Genesis experiments, pp. 40–42. Printed edition not collated.",
  },
  {
    id: "ragnarok",
    label: "Ragnarok",
    trackId: "norse",
    eventId: "norse-ragnarok",
    provenance: "Younger Edda · Gylfaginning · Ragnarok",
  },
  {
    id: "lucifer",
    label: "Lucifer Rebellion",
    trackId: "urantia",
    eventId: "urantia-lucifer-rebellion",
    provenance: "Urantia · 53:4.1",
  },
];
export const connections: Connection[] = [
  {
    id: "eridu-name",
    from: "eridu-historical",
    to: "eridu-terra",
    confidence: "Speculative match",
    points: ["Shared name: Eridu"],
    context:
      "A specific Mesopotamian city is compared with a modern narrative’s name for Earth.",
    limitations:
      "Different geographic referents. Name reuse may reflect borrowing. The brief’s Eridu–Eridanus etymology has not been established.",
    status: "Working comparison",
  },
  {
    id: "ea-name",
    from: "ea-historical",
    to: "ea-terra",
    confidence: "Speculative match",
    points: ["Shared name element: EA"],
    context:
      "An ancient deity is compared with a prince in a modern attributed narrative.",
    limitations:
      "Independence and shared identity are unproven. The modern transcription needs edition collation; name reuse may reflect borrowing from Mesopotamian literature.",
    status: "Working comparison",
  },
  {
    id: "rebellion-renewal",
    from: "ragnarok",
    to: "lucifer",
    confidence: "Speculative match",
    points: ["Conflict involving a supernatural governing order"],
    context:
      "Structural resemblance motivates comparison. Neither geography nor calendar timing has been aligned.",
    limitations:
      "Ragnarok describes world destruction and renewal; Urantia describes a system rebellion. Urantia says about 200,000 years ago. The Edda supplies no equivalent calendar date.",
    status: "Working comparison",
  },
];

connectionNodes.push(
  ...([
    {
      id: "enki-sitchin",
      label: "Enki / human workers",
      trackId: "sitchin",
      eventId: "sitchin-workers",
      provenance:
        "Earth Chronicles chart transcription · I, 300,000 Years Ago.",
    },
    {
      id: "flood-genesis",
      label: "Genesis flood",
      trackId: "bible",
      eventId: "genesis-flood",
      provenance: "Genesis 6–9 · ark, destruction and survival.",
    },
    {
      id: "flood-terra",
      label: "EA’s flood survivors",
      trackId: "terra-papers",
      eventId: "terra-flood-survival",
      provenance: "Terra Papers transcription · p. 45.",
    },
    {
      id: "numenor",
      label: "Númenor",
      trackId: "tolkien",
      eventId: "tolkien-numenor-downfall",
      provenance: "Christopher Tolkien’s introduction · Downfall of Númenor.",
    },
    {
      id: "atlantis-plato",
      label: "Plato’s Atlantis",
      trackId: "plato",
      eventId: "plato-atlantis",
      provenance: "Timaeus 24e–25d; Critias 108e–121c.",
    },
    {
      id: "val-ellam-lucifer",
      label: "Val Ellam’s Lucifer",
      trackId: "jan-val-ellam",
      eventId: "val-ellam-rebellion",
      provenance: "Terra Atlantis I · official synopsis, DETALHES paragraph 1.",
    },
  ] satisfies ConnectionNode[]),
);
connections.push(
  ...([
    {
      id: "ea-workers",
      from: "ea-terra",
      to: "enki-sitchin",
      confidence: "Speculative match",
      points: [
        "EA / Enki name correspondence",
        "Engineering workers to relieve labor shortages",
      ],
      context:
        "Both modern accounts describe human origins through an engineered labor force.",
      limitations:
        "Shared literary material and borrowing are plausible. Neither the similarity count nor these transcriptions establish independent evidence for genetic intervention.",
      status: "Working comparison",
    },
    {
      id: "flood-vessel",
      from: "flood-genesis",
      to: "flood-terra",
      confidence: "Speculative match",
      points: [
        "A destructive flood is anticipated",
        "A vessel preserves selected survivors",
      ],
      context:
        "The comparison concerns a narrative pattern of warning and survival.",
      limitations:
        "The causes, protagonists and geography differ. Morning Sky’s narrative may reuse older flood stories; no common date is established.",
      status: "Working comparison",
    },
    {
      id: "numenor-atlantis",
      from: "atlantis-plato",
      to: "numenor",
      confidence: "Speculative match",
      points: [
        "An island civilization is destroyed",
        "Catastrophe follows an aggressive imperial venture",
      ],
      context:
        "Christopher Tolkien explicitly calls the Númenor narrative an Atlantis legend.",
      limitations:
        "This is a literary parallel with acknowledged influence. Authored fiction is not an independent witness to a historical catastrophe.",
      status: "Working comparison",
    },
    {
      id: "lucifer-val-ellam",
      from: "lucifer",
      to: "val-ellam-lucifer",
      confidence: "Speculative match",
      points: [
        "Lucifer is named as a rebel",
        "The rebellion has consequences for Earth",
      ],
      context:
        "Compare the named rebellion in Urantia with the official synopsis of Terra Atlantis I.",
      limitations:
        "Only the Val Ellam synopsis has been checked; chapter-level details, dependence and chronological agreement are unresolved.",
      status: "Working comparison",
    },
  ] satisfies Connection[]),
);

// Membership is editorial and explicit. Shared topic tags alone never merge events.
export const accountGroups = [
  {
    id: "atlantis-accounts",
    title: "Atlantis accounts",
    scope: "Accounts explicitly naming Atlantis; dates and mechanisms differ.",
    eventIds: [
      "plato-atlantis",
      "ra-atlantis",
      "val-ellam-atlantis-formation",
      "val-ellam-atlantis-cataclysms",
    ],
  },
  {
    id: "flood-accounts",
    title: "Flood narratives",
    scope:
      "Comparison of flood motifs, not a finding that these describe one flood.",
    eventIds: [
      "genesis-flood",
      "urantia-floods",
      "hindu-manu-flood",
      "norse-ymir-flood",
      "terra-flood-survival",
      "sitchin-deluge",
    ],
  },
  {
    id: "jesus-birth-accounts",
    title: "Birth of Jesus",
    scope:
      "Accounts of the same named figure’s birth; each retains its own dating and claims.",
    eventIds: ["jesus-birth-matthew", "urantia-jesus-birth"],
  },
  {
    id: "early-life-accounts",
    title: "Early life on Earth",
    scope:
      "A fossil record establishes life by a particular date; Urantia claims a date for its first initiation. These are different kinds of statements about the same planet.",
    eventIds: ["science-strelley-stromatolites", "urantia-life-implantation"],
  },
  {
    id: "human-origins-accounts",
    title: "Human origins",
    scope:
      "Accounts of human beginnings; species evolution, divine creation and engineered labor are not assumed to describe the same event.",
    eventIds: [
      "science-homo-sapiens",
      "norse-ask-embla",
      "terra-hybrid-workers",
      "sitchin-workers",
    ],
  },
];
export const disagreements = [
  {
    id: "first-life-date",
    title:
      "Life billions of years ago or first initiated 550 million years ago?",
    leftId: "science-strelley-stromatolites",
    rightId: "urantia-life-implantation",
    leftClaim:
      "Strelley Pool’s approximately 3.43-billion-year-old stromatolites are studied as evidence of microbial life.",
    rightClaim:
      "Urantia 58:4.1–2 describes the initiation of the planet’s original life patterns 550 million years ago.",
    incompatibility:
      "If the older structures record terrestrial life, then the first terrestrial life cannot have begun only 550 million years ago.",
    qualification:
      "This comparison depends on the biological interpretation and dating of the structures, and on reading Urantia’s original life patterns as the first life on the same physical Earth.",
  },
  {
    id: "cosmic-chronology",
    title: "Material cosmic development before the scientific early universe?",
    leftId: "scientific-cosmic-history",
    rightId: "urantia-andronover",
    leftClaim:
      "NASA places the early hot universe around 13.8 billion years ago, with stars and galaxies forming later.",
    rightClaim:
      "Urantia 57:1.3 places conditions for a nebular materialization roughly 987 billion years ago.",
    incompatibility:
      "In a shared physical chronology, the described material nebular development cannot predate the early hot universe from which its matter develops.",
    qualification:
      "This comparison assumes both accounts refer to the same physical cosmos and terrestrial year unit. A metaphysical reinterpretation changes what is being claimed.",
  },
  {
    id: "flood-extent",
    title: "A worldwide flood or regional inundations?",
    leftId: "genesis-flood",
    rightId: "urantia-floods",
    leftClaim:
      "Genesis 7:19–23 describes waters covering all high mountains and the destruction of land life outside the ark.",
    rightClaim:
      "Urantia 78:7 rejects a worldwide deluge and describes regional Mesopotamian floods.",
    incompatibility:
      "A literal worldwide reading and an explicit denial of worldwide coverage cannot both describe the same physical flood accurately.",
    qualification:
      "This conflict depends on reading Genesis’s universal language literally. Local or literary readings alter the comparison.",
  },
];
export interface EventPlace {
  id: string;
  eventId?: string;
  trackId: TrackId;
  name: string;
  coordinates: [number, number] | null;
  status: "Documented site" | "Narrative region" | "Unlocated";
  basis: string;
  url?: string;
}
export const eventPlaces: EventPlace[] = [
  {
    id: "gobekli",
    eventId: "gobekli-tepe",
    trackId: "mainstream",
    name: "Göbekli Tepe",
    coordinates: [38.922, 37.223],
    status: "Documented site",
    basis:
      "UNESCO property 1572 · listing coordinates, rounded for this overview.",
    url: "https://whc.unesco.org/en/list/1572/",
  },
  {
    id: "eridu",
    eventId: "mesopotamian-enki",
    trackId: "mainstream",
    name: "Eridu",
    coordinates: [45.996, 30.815],
    status: "Documented site",
    basis:
      "Tell Eridu, component of UNESCO property 1481. Approximate overview location; see property maps.",
    url: "https://whc.unesco.org/en/list/1481/maps/",
  },
  {
    id: "bible-flood",
    eventId: "genesis-flood",
    trackId: "bible",
    name: "Mountains of Ararat",
    coordinates: [44, 39],
    status: "Narrative region",
    basis:
      "Genesis 8:4 names a mountain region, not a verified ark site. Marker is a broad regional guide, not an exact mountain identification.",
    url: "https://www.biblegateway.com/passage/?search=Genesis%208%3A4&version=KJV",
  },
  {
    id: "urantia-flood",
    eventId: "urantia-floods",
    trackId: "urantia",
    name: "Mesopotamian floodplain",
    coordinates: [46, 32],
    status: "Narrative region",
    basis:
      "Urantia 78:7 · regional flood account; approximate modern reference point.",
    url: "https://www.urantia.org/urantia-book-standardized/paper-78-violet-race-after-days-adam",
  },
  {
    id: "plato-atlantis",
    eventId: "plato-atlantis",
    trackId: "plato",
    name: "Atlantis beyond the Pillars",
    coordinates: null,
    status: "Unlocated",
    basis:
      "Timaeus 24e–25d gives a relative location. No specific modern coordinates are established.",
    url: "https://classics.mit.edu/Plato/timaeus.html",
  },
  {
    id: "ra-atlantis",
    eventId: "ra-atlantis",
    trackId: "law-of-one",
    name: "Atlantis in the Ra account",
    coordinates: null,
    status: "Unlocated",
    basis: "Session 10.15 does not establish a verified modern site.",
    url: "https://www.lawofone.info/s/10#15",
  },
  {
    id: "norse-world",
    eventId: "norse-ragnarok",
    trackId: "norse",
    name: "Norse mythic settings",
    coordinates: null,
    status: "Unlocated",
    basis:
      "A narrative world is not automatically a location in modern Scandinavia.",
  },
  {
    id: "hindu-mountain",
    eventId: "hindu-manu-flood",
    trackId: "hindu",
    name: "Manu’s northern mountain",
    coordinates: null,
    status: "Unlocated",
    basis:
      "Satapatha Brahmana 1.8.1 provides no coordinates or unique modern identification.",
  },
  {
    id: "middle-earth",
    eventId: "tolkien-first-age",
    trackId: "tolkien",
    name: "Middle-earth",
    coordinates: null,
    status: "Unlocated",
    basis:
      "Fictional geography is not projected onto modern Earth without an explicit scholarly argument.",
  },
  {
    id: "hopi-thread",
    trackId: "terra-papers",
    name: "Hopi homeland / Morning Sky research thread",
    coordinates: null,
    status: "Unlocated",
    basis:
      "The requested association needs a primary passage and cultural review. No event location or community endorsement is inferred.",
  },
];
eventPlaces.push(
  ...([
    {
      id: "sitchin-eridu",
      eventId: "sitchin-eridu",
      trackId: "sitchin",
      name: "Eridu in Sitchin’s account",
      coordinates: [45.996, 30.815],
      status: "Narrative region",
      basis:
        "The chart names Eridu. This is a modern reference marker at Tell Eridu, shared with the archaeological entry; it does not validate an Anunnaki landing.",
      url: "https://galactic2.net/KJOLE/NCCA/timechart.html",
    },
    {
      id: "terra-eridu",
      eventId: "terra-eridu",
      trackId: "terra-papers",
      name: "Eridu in the Terra Papers",
      coordinates: null,
      status: "Unlocated",
      basis:
        "The transcription uses Eridu for a world and a settlement. Neither is assigned the coordinates of ancient Tell Eridu.",
      url: "https://www.tapatalk.com/groups/astrallife/terra-papers-by-robert-morning-sky-t1192.html",
    },
    {
      id: "val-ellam-atlantis",
      eventId: "val-ellam-atlantis-cataclysms",
      trackId: "jan-val-ellam",
      name: "Atlantis in Val Ellam’s trilogy",
      coordinates: null,
      status: "Unlocated",
      basis:
        "The official synopsis describes destruction of Atlantean culture without identifying a mappable site.",
      url: "https://janvalellam.org/produtos/terra-atlantis-iii-a-era-sapiens",
    },
    {
      id: "hindu-dvaraka",
      eventId: "hindu-dvaraka-submerged",
      trackId: "hindu",
      name: "Dvaraka in the Vishnu Purana",
      coordinates: null,
      status: "Unlocated",
      basis:
        "V.38 describes a submerged city. No archaeological location or date for this narrative has been established in this record.",
      url: "https://sacred-texts.com/hin/vp/vp155.htm",
    },
  ] satisfies EventPlace[]),
);

export const quests = [
  {
    id: "ragnarok-lucifer",
    title: "Ragnarok and the Lucifer Rebellion",
    status: "Open · chronology correction",
    question:
      "Could these accounts preserve the same underlying event under different names?",
    findings:
      "One structural overlap is recorded in the graph. Urantia 53:4.1 gives about 200,000 years ago, while the Edda gives no calendar date. The brief’s shared 300,000-year date is unsupported.",
    nextSteps: [
      "Compare narrative roles and counterexamples passage by passage.",
      "Identify independently justified geographic and temporal anchors.",
      "Check textual transmission before calling the sources independent.",
    ],
    eventIds: ["norse-ragnarok", "urantia-lucifer-rebellion"],
  },
  {
    id: "halloween-atlantis",
    title: "Halloween, flood traditions and Atlantis",
    status: "Open · original attribution needed",
    question:
      "What exactly did Randall Carlson claim about Halloween, remembrance of the dead and catastrophe, and can that claim withstand comparison?",
    findings:
      "The submitted brief is the current source of the attribution; an original recording and timestamp are needed. Keep Carlson, Plato, Genesis and geology as four separate viewpoints. Plato’s illustrative 9600 BCE is roughly 11,600 years ago, not 9,600 years ago. Younger Dryas onset, its end and Meltwater Pulse 1B require separate dated records; proximity would not establish a single event.",
    nextSteps: [
      "Find Carlson’s original recording and exact wording.",
      "Test the asserted global date and meaning against independent holiday histories.",
      "Compare dated geological records and uncertainties, distinguishing BP, b2k, BCE and elapsed years.",
      "Do not assign Genesis’s flood a date from another source.",
    ],
    eventIds: [
      "plato-atlantis",
      "genesis-flood",
      "noaa-younger-dryas-explanation",
    ],
  },
];
export const projectHistory = [
  {
    version: "0.4.8",
    date: "2026-09-14",
    changes:
      "Named the application Project Timeline throughout the interface, page titles, documentation, package and data downloads. Updated internal component styles and event type names. Historical names, citations and permanent record IDs are preserved.",
  },
  {
    version: "0.4.7",
    date: "2026-09-14",
    changes:
      "Search surfaces matching accounts on unselected tracks without replacing the selected comparison. Book passages open in place, preserving expanded sections, reading position and keyboard focus. Source searches survive reload and Back navigation. Added clear-filter controls and shortened book guidance.",
  },
  {
    version: "0.4.6",
    date: "2026-09-14",
    changes:
      "Added a searchable book coverage inventory with online editions, section links and explicit gaps. Added 35 Poetic Edda passages and 12 Critias accounts. Completed the narrative review of the surviving Critias; other full-book reviews remain incomplete. Export schema 4 includes the coverage inventory.",
  },
  {
    version: "0.4.5",
    date: "2026-09-14",
    changes:
      "Expanded every requested track: Norse and Hindu narratives, Tolkien’s ages, all three Terra Atlantis synopses, Terra Papers passages, Sitchin’s chart, and deep-time science, Urantia and Ra accounts. Added comparative groups, graph links and map records. Citations distinguish original text, official synopsis and transcription. Fixed source links hiding undated tracks.",
  },
  {
    version: "0.4.4",
    date: "2026-09-14",
    changes:
      "Moved filters, track selectors, checkboxes, view switches, cards, badges and expandable panels to Radix. Unified icons and tooltips, removed obsolete control styles, and checked keyboard and mobile interactions.",
  },
  {
    version: "0.4.3",
    date: "2026-09-14",
    changes:
      "Added Radix Themes buttons, text fields, navigation menus and dialogs. Standardized typography and control styles. Replaced slogans with plain page titles, shortened guidance and removed empty placeholder sections. Fixed horizontal scrolling and card dragging on the timeline. Published a public preview on Vercel.",
  },
  {
    version: "0.4.2",
    date: "2026-09-14",
    changes:
      "Read-only static edition. Removed accounts, authentication, database, API, bookmarks, favorites, saved combinations and publishing controls. Search, filtering, comparison, source reading and timeline navigation remain. Specialist notes are reviewed repository content. Added static hosting configuration and checks for unexpected writes.",
  },
  {
    version: "0.4.1",
    date: "2026-09-14",
    changes:
      "Timeline usability pass: compact navigation, topic shortcuts, a direct account list, larger dated cards, searchable clusters, custom date ranges, persistent exploration links and opt-in touch movement. The map adds regional focus and separated nearby controls. Personally reviewed in desktop and mobile browser layouts.",
  },
  {
    version: "0.4.0",
    date: "2026-09-14",
    changes:
      "Comparative research pages, D3 graph and map, explicit account counts, disagreements, expanded track registry, deep time, curator notes and private/public track combinations. Research coverage remains partial.",
  },
  {
    version: "0.3.0",
    date: "2026-09-13",
    changes:
      "Recorded project start: standalone repository and research edition with sourced events, responsive comparison, reference sections and account groundwork. Date provenance: owner’s repository handoff; earlier conceptual work is not dated here.",
  },
];

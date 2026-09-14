import type { TimelineEvent, Citation } from "../types";
import { bce, entry, source, unanchored } from "./helpers.ts";

const reviewed = (
  sourceId: string,
  passage: string,
  url: string,
  note: string,
): Citation => ({ sourceId, passage, url, note, checkedOn: "2026-09-14" });
const janUrls = [
  "https://janvalellam.org/produtos/terra-atlantis-i-o-sinal-de-land-s-end",
  "https://janvalellam.org/produtos/terra-atlantis-ii-frota-norte",
  "https://janvalellam.org/produtos/terra-atlantis-iii-a-era-sapiens",
];
const silmarillion =
  "https://www.tolkienestate.com/writing/christopher-tolkien-the-silmarillion/";
const unfinished =
  "https://www.tolkienestate.com/writing/christopher-tolkien-unfinished-tales-of-numenor-and-middle-earth/";
const chart = "https://galactic2.net/KJOLE/NCCA/timechart.html";

export const requestedAuthorSources = [
  source(
    "val-ellam-atlantis-i",
    "Terra Atlantis I — O Sinal de Land’s End: official synopsis",
    "Jan Val Ellam",
    janUrls[0]!,
  ),
  source(
    "val-ellam-atlantis-ii",
    "Terra Atlantis II — Frota Norte: official synopsis",
    "Jan Val Ellam",
    janUrls[1]!,
  ),
  source(
    "val-ellam-atlantis-iii",
    "Terra Atlantis III — A Era Sapiens: official synopsis",
    "Jan Val Ellam",
    janUrls[2]!,
  ),
  source(
    "tolkien-silmarillion-introduction",
    "Christopher Tolkien on The Silmarillion",
    "Christopher Tolkien · Tolkien Estate",
    silmarillion,
  ),
  source(
    "tolkien-unfinished-introduction",
    "Introduction to Unfinished Tales (adapted)",
    "Christopher Tolkien · Tolkien Estate",
    unfinished,
  ),
  source(
    "sitchin-earth-chronicles-chart",
    "Earth Chronicles time chart — third-party transcription",
    "Attributed to Zecharia Sitchin; transcribed by Dave Schultz",
    chart,
  ),
];

// These are descriptions published by the author, not a claim to have reviewed the novels' chapters.
const janRows: [string, string, number, number, string, string[]][] = [
  [
    "rebellion",
    "Val Ellam: Lucifer’s rebellion",
    1,
    1,
    "The synopsis links Lucifer’s rebellion with Sophia and the Cosmic Christ.",
    ["lucifer-rebellion", "cosmology"],
  ],
  [
    "rebels-arrival",
    "Val Ellam: rebels reach Earth",
    1,
    2,
    "Rebel beings arrive before the emergence of rational humans.",
    ["origins"],
  ],
  [
    "atlantis-formation",
    "Val Ellam: formation of Atlantis",
    1,
    3,
    "The first volume traces the emergence of an Atlantean empire.",
    ["atlantis", "ancient-civilizations"],
  ],
  [
    "north-fleet",
    "Val Ellam: the North Fleet",
    2,
    2,
    "Benem leads forces gathered around Espheron over millennia.",
    ["atlantis"],
  ],
  [
    "portal-beings",
    "Val Ellam: beings of the portals",
    2,
    3,
    "The author identifies portal beings with figures from Greek mythology.",
    ["cosmology"],
  ],
  [
    "atlantean-decline",
    "Val Ellam: weakening rebel forces",
    2,
    4,
    "Declining forces leave humans positioned to inherit Earth.",
    ["atlantis", "ancient-civilizations"],
  ],
  [
    "atlantis-cataclysms",
    "Val Ellam: cataclysms end Atlantean culture",
    3,
    1,
    "Cataclysms destroy Atlantean culture and its bases.",
    ["atlantis", "catastrophe"],
  ],
  [
    "messiah-prophecy",
    "Val Ellam: the messianic prophecy",
    3,
    2,
    "Len Mion and Yel Luzbel confront the expectation of a Messiah.",
    ["jesus", "lucifer-rebellion"],
  ],
  [
    "post-crucifixion",
    "Val Ellam: rebellion after the crucifixion",
    3,
    3,
    "Yel Luzbel departs; Len Mion commands the remaining rebellion.",
    ["crucifixion", "lucifer-rebellion"],
  ],
];
const janEvents = janRows.map(
  ([id, title, volume, paragraph, summary, topicIds]) =>
    entry({
      id: `val-ellam-${id}`,
      trackId: "jan-val-ellam",
      title,
      year: null,
      kind: "Revelatory text",
      dateLabel: `Terra Atlantis ${["I", "II", "III"][volume - 1]} · narrative sequence`,
      dateBasis: `${unanchored} The reviewed synopsis does not provide a calendar anchor.`,
      summary,
      topicIds: ["jan-val-ellam", ...topicIds],
      citations: [
        reviewed(
          `val-ellam-atlantis-${["i", "ii", "iii"][volume - 1]}`,
          `DETALHES · paragraph ${paragraph}`,
          janUrls[volume - 1]!,
          "Official synopsis only. The author's description establishes attribution; the corresponding chapter and edition text still require review.",
        ),
      ],
    }),
);

type TolkienRow = [string, string, string, string, string, string[]?];
const silmarillionRows: TolkienRow[] = [
  [
    "creation",
    "Tolkien: creation of the world",
    "Before the First Age",
    "Creation discussion",
    "A creation myth precedes the wars of the Elves.",
    ["creation", "cosmic-origins"],
  ],
  [
    "morgoth-war",
    "Tolkien: Morgoth’s early war",
    "Before the First Age",
    "Creation discussion",
    "Morgoth opposes the divine powers.",
    ["lucifer-rebellion"],
  ],
  [
    "elves-awaken",
    "Tolkien: awakening of the Elves",
    "Early ages · Middle-earth",
    "Elves and Silmarils discussion",
    "The Elves awaken in Middle-earth.",
    ["origins"],
  ],
  [
    "elves-valinor",
    "Tolkien: the summons to Valinor",
    "Early ages · Valinor",
    "Elves and Silmarils discussion",
    "The Elves are summoned west to Valinor.",
  ],
  [
    "silmarils",
    "Tolkien: the making of the Silmarils",
    "Before the return to Middle-earth",
    "Elves and Silmarils discussion; Two Trees paragraph",
    "Fëanor’s jewels preserve the light of the Two Trees.",
  ],
  [
    "silmarils-stolen",
    "Tolkien: Morgoth takes the Silmarils",
    "Before the wars in Beleriand",
    "Elves and Silmarils discussion",
    "Morgoth steals the jewels.",
  ],
  [
    "elves-return",
    "Tolkien: the Elves rebel and return",
    "Beginning of the wars in Beleriand",
    "Elves and Silmarils discussion",
    "Elves return to Middle-earth seeking the stolen Silmarils.",
  ],
  [
    "beleriand-falls",
    "Tolkien: Beleriand’s strongholds fall",
    "First Age · Beleriand",
    "Beleriand and strongholds discussion",
    "War and betrayal destroy the Elvish strongholds.",
    ["catastrophe"],
  ],
  [
    "numenor-gift",
    "Tolkien: Númenor is granted to Men",
    "After the war against Morgoth",
    "The Downfall of Númenor · first paragraph",
    "Faithful Men receive an island homeland and longer lives.",
    ["ancient-civilizations"],
  ],
  [
    "numenor-sauron",
    "Tolkien: Sauron deceives Númenor",
    "Before Númenor’s downfall",
    "The Downfall of Númenor · first paragraph",
    "Sauron exploits the Númenóreans’ fear of death.",
  ],
  [
    "numenor-downfall",
    "Tolkien: the downfall of Númenor",
    "Second Age · no calendar conversion",
    "The Downfall of Númenor · armada and chasm paragraphs",
    "The king attacks Valinor; Númenor sinks into a chasm.",
    ["atlantis", "catastrophe", "flood-narratives"],
  ],
  [
    "world-round",
    "Tolkien: the changed world",
    "After Númenor’s downfall",
    "The Downfall of Númenor · aftermath paragraph",
    "Valinor becomes inaccessible to ordinary sea voyages.",
    ["cosmology"],
  ],
  [
    "grey-havens",
    "Tolkien: the Ringbearers depart",
    "End of the Third Age",
    "Of the Rings of Power · closing paragraphs",
    "The white ship leaves the Grey Havens.",
  ],
];
const unfinishedRows: TolkienRow[] = [
  [
    "ulmo-vinyamar",
    "Tolkien: Ulmo appears at Vinyamar",
    "First Age",
    "Paragraph beginning ‘Those who would not have forgone’",
    "Ulmo rises from the sea at Vinyamar.",
  ],
  [
    "veantur-voyage",
    "Tolkien: Vëantur reaches the Grey Havens",
    "Second Age 600",
    "Paragraph beginning ‘But whatever view’",
    "The Númenórean ship Entulessë arrives on the spring winds.",
  ],
  [
    "isildur-death",
    "Tolkien: Isildur dies in the Anduin",
    "Third Age",
    "Paragraph beginning ‘Those who would not have forgone’",
    "Isildur dies while emerging from the river’s mud.",
  ],
  [
    "white-council",
    "Tolkien: Gandalf and Saruman at the Council",
    "Third Age 2851",
    "Paragraph beginning ‘Those who would not have forgone’",
    "The introduction identifies a White Council meeting in 2851.",
  ],
  [
    "bag-end",
    "Tolkien: the gathering at Bag-End",
    "Third Age · before the War of the Ring",
    "Paragraph beginning ‘Those who would not have forgone’",
    "Gandalf arranges the Dwarves’ visit to Bag-End.",
  ],
];
const tolkienEvents = [
  ...silmarillionRows.map((row) => ({
    row,
    url: silmarillion,
    sourceId: "tolkien-silmarillion-introduction",
  })),
  ...unfinishedRows.map((row) => ({
    row,
    url: unfinished,
    sourceId: "tolkien-unfinished-introduction",
  })),
].map(
  ({
    row: [id, title, dateLabel, passage, summary, topics = []],
    url,
    sourceId,
  }) =>
    entry({
      id: `tolkien-${id}`,
      trackId: "tolkien",
      title,
      year: null,
      kind: "Literary fiction",
      dateLabel,
      dateBasis:
        "Dates and ages belong to Tolkien’s fictional chronology. The cited introduction supplies the narrative context; no BCE/CE equivalence is asserted.",
      summary,
      topicIds: ["tolkien", ...topics],
      citations: [
        reviewed(
          sourceId,
          passage,
          url,
          "Official editorial introduction by Christopher Tolkien. This record summarizes that introduction, not a separately reviewed chapter of the novel.",
        ),
      ],
    }),
);

// Keep the chart's undated 'Years Ago' section distinct from its explicit B.C. sections.
type ChartRow = [string, string, number, string];
const beforeFlood: ChartRow[] = [
  [
    "alalu",
    "Sitchin: Alalu reaches Earth",
    450000,
    "Alalu seeks gold for Nibiru’s atmosphere.",
  ],
  [
    "eridu",
    "Sitchin: Enki establishes Eridu",
    445000,
    "Enki’s party extracts gold from seawater.",
  ],
  [
    "ninhursag",
    "Sitchin: Ninhursag arrives",
    430000,
    "More Anunnaki arrive, including Ninhursag.",
  ],
  [
    "african-mines",
    "Sitchin: African gold mining",
    416000,
    "Enlil commands Earth; Enki oversees African mining.",
  ],
  [
    "settlements",
    "Sitchin: seven settlements",
    400000,
    "Sippar and Nippur organize transport.",
  ],
  [
    "igigi-war",
    "Sitchin: the Igigi-backed revolt",
    380000,
    "Alalu’s grandson challenges Enlil’s faction.",
  ],
  [
    "workers",
    "Sitchin: creation of human workers",
    300000,
    "Enki and Ninhursag engineer replacement laborers.",
  ],
  [
    "intermarriage",
    "Sitchin: Anunnaki and human descendants",
    100000,
    "Anunnaki marry human women.",
  ],
  [
    "hybrid-rulers",
    "Sitchin: hybrid rulers at Shuruppak",
    49000,
    "Hybrid descendants govern Shuruppak.",
  ],
  [
    "flood-warning",
    "Sitchin: impending flood concealed",
    13000,
    "A tidal catastrophe is anticipated.",
  ],
];
const afterFlood: ChartRow[] = [
  [
    "deluge",
    "Sitchin: the Deluge",
    11000,
    "Enki warns Ziusudra; a vessel survives.",
  ],
  [
    "post-flood-regions",
    "Sitchin: post-flood regions",
    10500,
    "Survivors receive three regions.",
  ],
  [
    "osiris-seth",
    "Sitchin: Egypt divided",
    9780,
    "Marduk allocates Egypt to Osiris and Seth.",
  ],
  ["osiris-killed", "Sitchin: Osiris is killed", 9330, "Seth kills Osiris."],
  [
    "pyramid-war-one",
    "Sitchin: first Pyramid War",
    8970,
    "Horus defeats Seth.",
  ],
  [
    "pyramid-war-two",
    "Sitchin: second Pyramid War",
    8670,
    "Ninurta removes equipment; Ninhursag brokers peace.",
  ],
  [
    "jericho",
    "Sitchin: Jericho outpost",
    8500,
    "An outpost develops at Jericho.",
  ],
  [
    "sumer-rebuilt",
    "Sitchin: Sumerian cities restored",
    3800,
    "Anu visits Uruk.",
  ],
  [
    "kish-kingship",
    "Sitchin: kingship at Kish",
    3760,
    "Kish becomes the first capital.",
  ],
  [
    "babel",
    "Sitchin: Babel and divided languages",
    3450,
    "Marduk’s project ends in language division.",
  ],
  [
    "egypt-pharaoh",
    "Sitchin: first Egyptian pharaoh",
    3100,
    "Memphis becomes the capital.",
  ],
  ["sargon", "Sitchin: Sargon’s empire", 2371, "Sargon establishes Agade."],
  ["abraham", "Sitchin: Abraham’s birth", 2123, "Abraham is born in Nippur."],
  [
    "nuclear-destruction",
    "Sitchin: destruction of Sinai and Canaan",
    2024,
    "Nergal and Ninurta use nuclear weapons.",
  ],
  [
    "sumer-cloud",
    "Sitchin: destruction spreads to Sumer",
    2023,
    "A radioactive cloud devastates Sumer.",
  ],
];
const sitchinEvents = [
  ...beforeFlood.map((row) => ({ row, relative: true })),
  ...afterFlood.map((row) => ({ row, relative: false })),
].map(({ row: [id, title, date, summary], relative }) =>
  entry({
    id: `sitchin-${id}`,
    trackId: "sitchin",
    title,
    year: relative ? null : bce(date),
    kind: "Alternative hypothesis",
    dateLabel: relative
      ? `${date.toLocaleString("en-US")} years ago · chart anchor unspecified`
      : `${date.toLocaleString("en-US")} BCE · Sitchin’s chart`,
    dateBasis: relative
      ? "The transcribed chart labels this section ‘Years Ago’ without a reference year. The relative age is preserved without inventing a BCE/CE anchor."
      : "The transcribed Earth Chronicles chart explicitly labels this section B.C. This plots the author's claim, not an accepted historical date.",
    summary,
    topicIds: [
      "sitchin",
      ...(id.includes("flood") || id === "deluge"
        ? ["flood-narratives"]
        : id.includes("pyramid")
          ? ["pyramids"]
          : id === "workers"
            ? ["origins"]
            : id === "eridu"
              ? ["eridu"]
              : ["ancient-civilizations"]),
    ],
    citations: [
      reviewed(
        "sitchin-earth-chronicles-chart",
        `${relative ? "I. Events Before the Deluge · Years Ago" : date >= 3800 ? "II. Events After the Deluge · B.C." : date >= 2193 ? "III. Kingship on Earth · B.C." : "IV. The Fateful Century · B.C."} · ${date.toLocaleString("en-US")}`,
        chart,
        "Third-party transcription attributed to Sitchin. Original printed table and edition have not been collated; entry dates are the chart's claims.",
      ),
    ],
  }),
);

export const requestedAuthorEvents: TimelineEvent[] = [
  ...janEvents,
  ...tolkienEvents,
  ...sitchinEvents,
];

import { bce, cite, entry, source } from "./helpers.ts";

const sites: [string, string, number, number, number, string, string][] = [
  [
    "catalhoyuk-east",
    "Çatalhöyük: the eastern settlement",
    1405,
    bce(7400),
    bce(6200),
    "Anatolia",
    "Dense housing and wall paintings document a long-lived Neolithic community.",
  ],
  [
    "catalhoyuk-west",
    "Çatalhöyük: the western settlement",
    1405,
    bce(6200),
    bce(5200),
    "Anatolia",
    "The western mound preserves a later phase of settlement and cultural change.",
  ],
  [
    "liangzhu",
    "Liangzhu and its waterworks",
    1592,
    bce(3300),
    bce(2300),
    "East Asia",
    "A regional center combined water management, social distinctions, and elaborate jade objects.",
  ],
  [
    "malta-temples",
    "The megalithic temples of Malta",
    132,
    bce(4000),
    bce(2001),
    "Mediterranean",
    "Freestanding stone temples belong to Malta’s fourth and third millennia BCE.",
  ],
  [
    "hal-saflieni",
    "Ħal Saflieni Hypogeum",
    130,
    bce(4000),
    bce(2500),
    "Mediterranean",
    "An underground rock-cut complex preserves spaces associated with burial and ritual.",
  ],
  [
    "chavin",
    "Chavín de Huántar",
    330,
    bce(1500),
    bce(300),
    "South America",
    "A ceremonial center in the Peruvian Andes influenced a wider cultural region.",
  ],
  [
    "teotihuacan",
    "Teotihuacan’s urban flourishing",
    414,
    1,
    700,
    "Mesoamerica",
    "The monumental city developed into a major center of ancient Mesoamerica.",
  ],
  [
    "borobudur",
    "Building Borobudur",
    592,
    701,
    900,
    "Southeast Asia",
    "A terraced Buddhist monument expresses religious ideas through architecture and reliefs.",
  ],
  [
    "angkor",
    "The Angkor period",
    668,
    801,
    1500,
    "Southeast Asia",
    "Successive Khmer capitals created a landscape of temples, reservoirs, and canals.",
  ],
  [
    "great-zimbabwe",
    "Great Zimbabwe",
    364,
    1001,
    1500,
    "Southern Africa",
    "Shona communities built the monumental stone settlement and regional trading center.",
  ],
  [
    "gyeongju",
    "Buddhist art in Gyeongju",
    976,
    601,
    1000,
    "East Asia",
    "Silla’s capital preserves Buddhist sculpture, temples, and royal monuments.",
  ],
  [
    "silla",
    "The Silla kingdom",
    976,
    bce(57),
    935,
    "East Asia",
    "Gyeongju served as the capital of the long-lived Silla kingdom.",
  ],
  [
    "bamiyan-caves",
    "The monastic caves of Bamiyan",
    208,
    501,
    1300,
    "Central Asia",
    "Cave sanctuaries and paintings preserve Buddhist traditions along routes through Afghanistan.",
  ],
  [
    "norse-americas",
    "Norse settlement at L’Anse aux Meadows",
    4,
    1001,
    1100,
    "North America",
    "Turf buildings provide archaeological evidence of Norse presence in North America.",
  ],
  [
    "machu-picchu",
    "Building Machu Picchu",
    274,
    1401,
    1500,
    "South America",
    "The Inca mountain settlement integrates architecture, terraces, and steep terrain.",
  ],
  [
    "machu-picchu-abandonment",
    "Machu Picchu is abandoned",
    274,
    1501,
    1600,
    "South America",
    "The settlement was abandoned in the sixteenth century.",
  ],
];
export const mainstreamSources = [
  ...new Map(
    sites.map(([, title, id]) => [
      id,
      source(
        `unesco-${id}`,
        `World Heritage: ${title.split(":")[0]}`,
        "UNESCO World Heritage Centre",
        `https://whc.unesco.org/en/list/${id}/`,
      ),
    ]),
  ).values(),
  source(
    "stonehenge-history",
    "History of Stonehenge",
    "English Heritage",
    "https://www.english-heritage.org.uk/visit/places/stonehenge/history-and-stories/history/",
  ),
  source(
    "orkney-decision",
    "Inscription decision: Heart of Neolithic Orkney",
    "UNESCO World Heritage Committee",
    "https://whc.unesco.org/en/decisions/2636/",
  ),
  source(
    "chauvet",
    "Decorated Cave of Pont d’Arc",
    "UNESCO World Heritage Centre",
    "https://whc.unesco.org/en/list/1426/",
  ),
  source(
    "egypt-timeline",
    "Timeline of ancient Egypt",
    "British Museum",
    "https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt/timeline-ancient-egypt",
  ),
  source(
    "declaration",
    "Declaration of Independence (1776)",
    "US National Archives",
    "https://www.archives.gov/milestone-documents/declaration-of-independence",
  ),
  source(
    "apollo-11",
    "Apollo 11",
    "NASA",
    "https://www.nasa.gov/mission/apollo-11/",
  ),
];
export const mainstreamEvents = [
  ...sites.map(([id, title, record, year, endYear, region, summary]) =>
    entry({
      id,
      title,
      year,
      endYear,
      region,
      summary,
      trackId: "mainstream",
      kind: "Archaeology",
      image: "ruins",
      topicIds: [
        "ancient-civilizations",
        ...(year < bce(2000) ? ["neolithic"] : []),
        ...(["borobudur", "gyeongju", "bamiyan-caves"].includes(id)
          ? ["buddhism"]
          : []),
      ],
      citations: [
        cite(
          `unesco-${record}`,
          "Description and Brief synthesis",
          `https://whc.unesco.org/en/list/${record}/`,
        ),
      ],
      dateBasis:
        "The institutional listing gives this period. Century and millennium ranges are expanded into inclusive calendar bounds; they are not precise construction dates.",
    }),
  ),
  ...(
    [
      [
        "stonehenge-earthwork",
        "Stonehenge: the earliest monument",
        3000,
        "The Earliest Monument",
        "The first enclosure consisted of a circular ditch and bank, with the Aubrey Holes.",
      ],
      [
        "stonehenge-stones",
        "Stonehenge: the stone settings",
        2500,
        "The Stone Settings",
        "Large sarsen stones and smaller bluestones transformed the earlier monument.",
      ],
    ] as const
  ).map(([id, title, year, passage, summary]) =>
    entry({
      id,
      title,
      year: bce(year),
      trackId: "mainstream",
      kind: "Archaeology",
      region: "British Isles",
      image: "ruins",
      summary,
      topicIds: ["stonehenge", "neolithic", "ancient-civilizations"],
      citations: [
        cite(
          "stonehenge-history",
          passage,
          mainstreamSources.find((s) => s.id === "stonehenge-history")!.url,
        ),
      ],
    }),
  ),
  entry({
    id: "neolithic-orkney",
    title: "Neolithic Orkney",
    year: bce(3000),
    endYear: bce(2000),
    region: "British Isles",
    trackId: "mainstream",
    kind: "Archaeology",
    image: "ruins",
    summary:
      "Settlements, tombs, and stone circles preserve a northern Neolithic cultural landscape.",
    topicIds: ["neolithic", "ancient-civilizations"],
    citations: [
      cite(
        "orkney-decision",
        "Criterion (iii): 3000 BC–2000 BC",
        "https://whc.unesco.org/en/decisions/2636/",
      ),
    ],
  }),
  entry({
    id: "chauvet-paintings",
    title: "The cave art of Chauvet",
    year: null,
    dateLabel: "32,000–30,000 BP · source dating scale",
    region: "Western Europe",
    trackId: "mainstream",
    kind: "Archaeology",
    image: "ruins",
    summary:
      "The cave preserves an exceptional assemblage of early animal paintings.",
    dateBasis:
      "The English UNESCO listing uses BP. Its calibration convention is not established here, so this record is not converted into a calendar year.",
    topicIds: ["cave-art", "dating-methods"],
    citations: [
      cite(
        "chauvet",
        "Description · Aurignacian dates stated as BP",
        "https://whc.unesco.org/en/list/1426/",
      ),
    ],
  }),
  entry({
    id: "chauvet-discovery",
    title: "Chauvet Cave is discovered",
    year: 1994,
    approximate: false,
    region: "Western Europe",
    trackId: "mainstream",
    kind: "Archaeology",
    summary:
      "The discovery brought the cave’s preserved prehistoric art to modern research.",
    dateBasis: "Modern discovery year stated in the UNESCO description.",
    topicIds: ["cave-art"],
    citations: [
      cite(
        "chauvet",
        "Description · discovery in 1994",
        "https://whc.unesco.org/en/list/1426/",
      ),
    ],
  }),
  ...(
    [
      [
        "egypt-early-dynastic",
        "Egypt’s Early Dynastic period",
        3100,
        2686,
        "Political consolidation preceded the great pyramid-building age.",
      ],
      [
        "egypt-old-kingdom",
        "Egypt’s Old Kingdom",
        2686,
        2181,
        "The Old Kingdom provides historical context for the major royal pyramids.",
      ],
    ] as const
  ).map(([id, title, start, end, summary]) =>
    entry({
      id,
      title,
      year: bce(start),
      endYear: bce(end),
      summary,
      trackId: "mainstream",
      kind: "Archaeology",
      region: "Northeast Africa",
      image: "ruins",
      topicIds: ["ancient-egypt", "pyramids", "ancient-civilizations"],
      citations: [
        cite(
          "egypt-timeline",
          title.includes("Early")
            ? "Early Dynastic Period: about 3100–2686 BC"
            : "Old Kingdom: about 2686–2181 BC",
          "https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt/timeline-ancient-egypt",
          "Institutional search-index excerpt checked; full page was unavailable during collection.",
        ),
      ],
    }),
  ),
  entry({
    id: "machu-picchu-attention",
    title: "Machu Picchu enters international attention",
    year: 1911,
    approximate: false,
    trackId: "mainstream",
    kind: "Archaeology",
    region: "South America",
    summary:
      "The site became internationally known in 1911; this does not imply it was unknown locally.",
    dateBasis: "Year of international recognition stated by UNESCO.",
    topicIds: ["ancient-civilizations"],
    citations: [
      cite(
        "unesco-274",
        "Brief synthesis · made known internationally in 1911",
        "https://whc.unesco.org/en/list/274/",
      ),
    ],
  }),
  entry({
    id: "us-declaration",
    title: "The American Declaration of Independence",
    year: 1776,
    approximate: false,
    trackId: "mainstream",
    kind: "Historical document",
    region: "North America",
    summary: "The colonies’ declaration set out their separation from Britain.",
    dateBasis: "The document is dated July 4, 1776.",
    topicIds: ["modern-history"],
    citations: [
      cite(
        "declaration",
        "Document transcript · July 4, 1776",
        "https://www.archives.gov/milestone-documents/declaration-of-independence",
      ),
    ],
  }),
  entry({
    id: "apollo-11-landing",
    title: "Apollo 11 reaches the Moon",
    year: 1969,
    approximate: false,
    trackId: "mainstream",
    kind: "Historical document",
    region: "Moon",
    summary: "Apollo 11 carried the first humans to walk on the lunar surface.",
    dateBasis:
      "NASA dates the mission to July 16–24, 1969, with the landing on July 20.",
    topicIds: ["modern-history"],
    citations: [
      cite(
        "apollo-11",
        "Mission overview and dates",
        "https://www.nasa.gov/mission/apollo-11/",
      ),
    ],
  }),
];

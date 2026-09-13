import { cite, entry, source } from "./helpers.ts";

const chronology =
  "https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2005JD006079";
const noaa =
  "https://www.ncei.noaa.gov/sites/default/files/2023-01/3%20The%20Younger%20Dryas%20-Jan%202023.pdf";
const firestone = "https://pubmed.ncbi.nlm.nih.gov/17901202/";
const holliday =
  "https://ucrisportal.univie.ac.at/en/publications/comprehensive-refutation-of-the-younger-dryas-impact-hypothesis-y/";
const sweatman =
  "https://blogs.ed.ac.uk/martinsweatman/2022/05/20/research-outputs/";
const waitt = "https://pubs.usgs.gov/publication/ofr83671";
export const climateSources = [
  source(
    "gicc05",
    "A new Greenland ice core chronology for the last glacial termination",
    "S. O. Rasmussen and colleagues · 2006",
    chronology,
  ),
  source(
    "noaa-younger-dryas",
    "The Younger Dryas · Abrupt Climate Change",
    "NOAA National Centers for Environmental Information",
    noaa,
  ),
  source(
    "firestone-2007",
    "Evidence for an extraterrestrial impact 12,900 years ago that contributed to the megafaunal extinctions and the Younger Dryas cooling",
    "R. B. Firestone and colleagues · PNAS, 2007",
    firestone,
  ),
  source(
    "holliday-2023",
    "Comprehensive refutation of the Younger Dryas Impact Hypothesis (YDIH)",
    "V. T. Holliday and colleagues · Earth-Science Reviews, 2023",
    holliday,
  ),
  source(
    "sweatman-2024",
    "Rejection of Holliday et al.’s alleged refutation of the Younger Dryas impact hypothesis",
    "M. B. Sweatman, J. Powell, and A. West · Earth-Science Reviews, 2024",
    "https://doi.org/10.1016/j.earscirev.2024.104960",
  ),
  source(
    "waitt-1983",
    "Tens of successive, colossal Missoula floods at north and east margins of channeled scabland",
    "Richard B. Waitt · USGS Open-File Report 83-671",
    waitt,
  ),
];

const horizons: [string, string, number, number | null, string, string][] = [
  [
    "bolling-gicc05",
    "The Bølling interval in GICC05",
    14692,
    14075,
    "An interval bounded by dated Greenland ice-core transitions.",
    "Maximum counting errors: onset 186 years; end 169 years.",
  ],
  [
    "younger-dryas-gicc05",
    "The Younger Dryas in GICC05",
    12896,
    11703,
    "A Greenland cold interval bounded by two dated transitions.",
    "Maximum counting errors: onset 138 years; end 99 years.",
  ],
  [
    "eight-two-ka-datum",
    "An ice-core datum within the 8.2 ka cold event",
    8236,
    null,
    "A dated horizon within the cold event, not its onset.",
    "Maximum counting error: 47 years.",
  ],
  [
    "vedde-ash",
    "The Vedde volcanic ash horizon",
    12171,
    null,
    "A volcanic layer used to correlate geological records.",
    "Maximum counting error: 114 years.",
  ],
  [
    "saksunarvatn-ash",
    "The Saksunarvatn volcanic ash horizon",
    10347,
    null,
    "A second dated volcanic horizon in the ice-core chronology.",
    "Maximum counting error: 89 years.",
  ],
];
export const climateEvents = horizons.map(
  ([id, title, start, end, summary, error]) =>
    entry({
      id,
      title,
      year: 2000 - start,
      ...(end === null ? {} : { endYear: 2000 - end }),
      trackId: "mainstream",
      kind: "Climate record",
      region: "Greenland",
      summary,
      dateBasis: `GICC05: ${start.toLocaleString("en-US")}${end === null ? "" : `–${end.toLocaleString("en-US")}`} years before 2000 CE (b2k). ${error} Counting errors exclude possible layer-identification bias; they are not standard deviations. Calendar conversion uses astronomical year = 2000 − b2k.`,
      topicIds: [
        "ice-core-chronology",
        "dating-methods",
        ...(id.includes("dryas") ? ["younger-dryas"] : []),
      ],
      image: "ocean",
      citations: [
        cite(
          "gicc05",
          "Table 4 and footnote a · selected horizons and maximum counting errors",
          chronology,
          "Author manuscript with the same table: https://epic.awi.de/12532/1/Ras2005a.pdf",
        ),
      ],
    }),
);
climateEvents.push(
  entry({
    id: "noaa-younger-dryas-explanation",
    title: "NOAA’s ocean-circulation explanation",
    trackId: "mainstream",
    year: null,
    kind: "Scientific study",
    image: "ocean",
    summary:
      "NOAA reviews evidence for weakened Atlantic circulation and possible rerouting of glacial meltwater during the Younger Dryas.",
    dateLabel: "Research explanation · not a separate dated event",
    dateBasis:
      "This is an explanatory record. Compare it with the dated GICC05 interval; rounded ages in the outreach sheet are not converted into additional precise markers.",
    topicIds: ["younger-dryas", "ocean-circulation", "catastrophe"],
    citations: [
      cite(
        "noaa-younger-dryas",
        "Pages 1–2 · climate evidence, freshwater routing, and circulation",
        noaa,
      ),
    ],
  }),
  entry({
    id: "impact-hypothesis-2007",
    title: "Firestone and colleagues propose an impact cause",
    trackId: "alternative",
    year: 2007,
    approximate: false,
    kind: "Alternative hypothesis",
    summary:
      "The authors propose an extraterrestrial impact contributing to Younger Dryas cooling and ecological disruption.",
    dateBasis:
      "Publication year: online September 27 and journal issue October 9, 2007. This marks the paper, not a confirmed ancient impact.",
    topicIds: ["younger-dryas", "impact-hypothesis", "catastrophe"],
    citations: [
      cite(
        "firestone-2007",
        "Abstract · PNAS 104(41), 16016–16021 · DOI 10.1073/pnas.0706977104",
        firestone,
      ),
    ],
  }),
  entry({
    id: "impact-critique-2023",
    title: "Holliday and colleagues challenge the impact hypothesis",
    trackId: "mainstream",
    year: 2023,
    approximate: false,
    kind: "Scientific study",
    summary:
      "The review argues that proposed impact evidence has methodological and reproducibility problems and should be rejected.",
    dateBasis:
      "Publication year of Earth-Science Reviews volume 247, article 104502. This dates a research critique.",
    topicIds: ["younger-dryas", "impact-hypothesis", "catastrophe"],
    citations: [
      cite(
        "holliday-2023",
        "Abstract · author-affiliated repository and DOI 10.1016/j.earscirev.2023.104502",
        holliday,
      ),
    ],
  }),
  entry({
    id: "impact-response-2024",
    title: "Sweatman, Powell, and West publish a response",
    trackId: "alternative",
    year: 2024,
    approximate: false,
    kind: "Alternative hypothesis",
    summary:
      "The authors publish a response rejecting Holliday and colleagues’ assessment of the impact hypothesis.",
    dateBasis:
      "Publication year, verified in the author’s University of Edinburgh bibliography. This record identifies the exchange; it does not adjudicate its scientific claims.",
    topicIds: ["younger-dryas", "impact-hypothesis", "catastrophe"],
    citations: [
      cite(
        "sweatman-2024",
        "Research outputs · journal paper 60 · Earth-Science Reviews 258, 104960 (2024)",
        sweatman,
        "Bibliographic verification only; the publisher’s full text was unavailable during this pass. DOI: 10.1016/j.earscirev.2024.104960.",
      ),
    ],
  }),
  entry({
    id: "missoula-waitt-1983",
    title: "Waitt documents repeated Missoula megafloods",
    trackId: "mainstream",
    year: 1983,
    approximate: false,
    kind: "Scientific study",
    region: "North America",
    image: "ocean",
    summary:
      "Sediment layers support forty or more separate outburst floods from ice-dammed Lake Missoula, rather than a single flood.",
    dateBasis:
      "Publication year of USGS Open-File Report 83-671. The report’s older radiocarbon-era age estimates have not been treated as calibrated calendar dates.",
    topicIds: ["missoula-floods", "catastrophe", "dating-methods"],
    citations: [
      cite(
        "waitt-1983",
        "Abstract and bibliographic record · Open-File Report 83-671 (1983)",
        waitt,
      ),
    ],
  }),
);

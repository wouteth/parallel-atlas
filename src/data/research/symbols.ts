import type { SymbolEntry } from "../types";
import { bce, cite, entry, source } from "./helpers.ts";

const swastikaUrl =
  "https://encyclopedia.ushmm.org/content/en/article/history-of-the-swastika";
const maltaUrl =
  "https://www.orderofmalta.int/history/the-eight-pointed-cross/";
const ankhUrl = "https://www.metmuseum.org/art/collection/search/544840";
const crossUrl = "https://www.metmuseum.org/art/collection/search/468349";
const flagUrl = "https://fs.knesset.gov.il/0/law/0_lsr_340940.pdf";
export const symbolSources = [
  source(
    "ushmm-swastika",
    "History of the Swastika",
    "United States Holocaust Memorial Museum",
    swastikaUrl,
  ),
  source(
    "malta-cross",
    "The eight-pointed cross",
    "Sovereign Military Order of Malta",
    maltaUrl,
  ),
  source(
    "met-ankh",
    "Ceremonial Implement in the Shape of an Ankh · 30.8.29",
    "The Metropolitan Museum of Art",
    ankhUrl,
  ),
];
type Usage = SymbolEntry["historicalUsage"];
symbolSources.push(
  source(
    "met-cross",
    "Processional Cross · 50.5.3",
    "The Metropolitan Museum of Art",
    crossUrl,
  ),
  source(
    "israel-flag",
    "Proclamation of the Flag of the State of Israel",
    "Provisional Council of State · Knesset document archive",
    flagUrl,
  ),
);
export const researchedUsage: Record<string, Usage> = {
  "christian-cross": [
    {
      culture: "Syrian Christian communities",
      era: "Sixth century CE; this object includes modern restoration",
      region: "Syria · attributed to Antioch or Kaper Koraon",
      meaning:
        "A silver cross used in church processions or display, bearing a hymn and a donor inscription.",
      citations: [
        cite(
          "met-cross",
          "Object overview and Artwork Details · 50.5.3",
          crossUrl,
        ),
      ],
      status: "Reviewed",
    },
  ],
  "star-of-david": [
    {
      culture: "State of Israel",
      era: "Flag proclamation dated October 28, 1948",
      region: "Israel",
      meaning:
        "Two interlocking triangles appear between blue horizontal stripes on a white field in the proclaimed flag design.",
      citations: [
        cite(
          "israel-flag",
          "Official Gazette no. 32, p. 62 · flag proclamation and diagram",
          flagUrl,
        ),
      ],
      status: "Reviewed",
    },
  ],
  swastika: [
    ...["Hindu communities", "Buddhist communities", "Jain communities"].map(
      (culture) => ({
        culture,
        era: "Historical and contemporary religious use; exact local periods require individual records",
        region: "South and East Asian traditions and their diasporas",
        meaning:
          "A sacred sign, distinct from its twentieth-century Nazi appropriation. Local meanings vary.",
        citations: [
          cite(
            "ushmm-swastika",
            "Early uses · sacred religious contexts",
            swastikaUrl,
          ),
        ],
        status: "Reviewed" as const,
      }),
    ),
    {
      culture: "Nazi Party",
      era: "Adopted in 1920; Nazi-era use",
      region: "Germany",
      meaning:
        "Appropriated as a party emblem associated with racist ideology and propaganda.",
      citations: [
        cite(
          "ushmm-swastika",
          "The Appropriation of the Swastika as a Nazi Symbol",
          swastikaUrl,
        ),
      ],
      status: "Reviewed",
    },
  ],
  "maltese-cross": [
    {
      culture: "Sovereign Order of Malta",
      era: "Contemporary use with historical institutional associations",
      region: "International",
      meaning:
        "The eight points are associated with the Beatitudes; the emblem identifies the Order’s charitable and ceremonial activities.",
      citations: [
        cite(
          "malta-cross",
          "The eight-pointed cross between History and Spirituality · symbolism and present use",
          maltaUrl,
        ),
      ],
      status: "Reviewed",
    },
    {
      culture: "Republic of Malta",
      era: "From January 1, 2008",
      region: "Malta",
      meaning:
        "The eight-pointed cross appears on the national side of one- and two-euro coins.",
      citations: [cite("malta-cross", "Paragraph on euro coins", maltaUrl)],
      status: "Reviewed",
    },
  ],
  ankh: [
    {
      culture: "Ancient Egypt",
      era: "New Kingdom · this object c. 1396–1386 BCE",
      region: "Thebes, Valley of the Kings",
      meaning:
        "The looped form serves as a sign of life. This record is anchored to a specific faience object from Thutmose IV’s tomb.",
      citations: [
        cite(
          "met-ankh",
          "Object overview and Artwork Details · 30.8.29",
          ankhUrl,
        ),
      ],
      status: "Reviewed",
    },
  ],
};
export const symbolEvents = [
  entry({
    id: "syrian-processional-cross",
    title: "A Syrian processional cross",
    year: 501,
    endYear: 600,
    region: "Levant",
    trackId: "mainstream",
    kind: "Archaeology",
    image: "cross",
    summary:
      "A silver cross preserves Christian liturgical use and the names of its donors.",
    topicIds: ["crucifixion"],
    symbolIds: ["christian-cross"],
    dateBasis:
      "The Met dates object 50.5.3 to the sixth century, with modern restoration. The interval is represented as 501–600 CE.",
    citations: [
      cite(
        "met-cross",
        "Artwork Details · date, culture, and object number",
        crossUrl,
      ),
    ],
  }),
  entry({
    id: "israel-flag-proclamation",
    title: "Israel proclaims its national flag",
    year: 1948,
    approximate: false,
    region: "Levant",
    trackId: "mainstream",
    kind: "Historical document",
    summary:
      "The proclamation specifies a Star of David between two blue stripes on white.",
    topicIds: ["modern-history"],
    symbolIds: ["star-of-david"],
    dateBasis:
      "The proclamation is dated October 28, 1948; the official gazette page was published later. The marker uses the proclamation year.",
    citations: [
      cite(
        "israel-flag",
        "Official Gazette no. 32, p. 62 · proclamation dated October 28, 1948",
        flagUrl,
      ),
    ],
  }),
  entry({
    id: "ankh-thutmose",
    image: "ankh",
    title: "A ceremonial ankh from Thutmose IV’s tomb",
    year: bce(1396),
    endYear: bce(1386),
    region: "Northeast Africa",
    trackId: "mainstream",
    kind: "Archaeology",
    summary:
      "A faience implement preserves a specific ancient use of the ankh form.",
    topicIds: ["ancient-egypt"],
    symbolIds: ["ankh"],
    dateBasis:
      "The Met dates object 30.8.29 to c. 1396–1386 BCE. The marker uses the start of this museum-assigned interval.",
    citations: [
      cite(
        "met-ankh",
        "Artwork Details · date, provenance, and object number",
        ankhUrl,
      ),
    ],
  }),
  entry({
    id: "nazi-swastika-adoption",
    title: "Nazi appropriation of the swastika",
    year: 1920,
    approximate: false,
    region: "Western Europe",
    trackId: "mainstream",
    kind: "Historical document",
    summary:
      "The Nazi Party adopts the swastika as an emblem of its racist political movement.",
    topicIds: ["modern-history"],
    symbolIds: ["swastika"],
    dateBasis:
      "The US Holocaust Memorial Museum identifies formal adoption in 1920.",
    citations: [
      cite(
        "ushmm-swastika",
        "The Appropriation of the Swastika as a Nazi Symbol · formal adoption",
        swastikaUrl,
      ),
    ],
  }),
  entry({
    id: "malta-euro-cross",
    title: "The Maltese cross on euro coins",
    year: 2008,
    approximate: false,
    region: "Mediterranean",
    trackId: "mainstream",
    kind: "Historical document",
    summary: "Malta’s one- and two-euro coins carry the eight-pointed cross.",
    topicIds: ["modern-history"],
    symbolIds: ["maltese-cross"],
    dateBasis:
      "The Order’s account identifies January 1, 2008, as the beginning of this coin use.",
    citations: [cite("malta-cross", "Paragraph on euro coins", maltaUrl)],
  }),
];

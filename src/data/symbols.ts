import type { SymbolEntry } from "./types";
import { researchedUsage } from "./research/symbols.ts";

const seeds = [
  [
    "christian-cross",
    "Christian / Latin cross",
    "Crosses",
    "✝",
    "A cross with a longer lower arm. Cultural and historical usage will be documented by era.",
  ],
  [
    "templar-cross",
    "Templar cross",
    "Crosses",
    "✠",
    "A starting entry for crosses associated with the Knights Templar. Forms and attributions require artifact-specific research; this glyph is illustrative.",
  ],
  [
    "greek-cross",
    "Greek cross",
    "Crosses",
    "+",
    "A cross with four equal arms.",
  ],
  [
    "saint-andrew",
    "Saint Andrew’s cross",
    "Crosses",
    "×",
    "A diagonal cross, also called a saltire.",
  ],
  [
    "tau-cross",
    "Tau cross",
    "Crosses",
    "T",
    "A cross shaped like the capital Greek letter tau.",
  ],
  [
    "celtic-cross",
    "Celtic cross",
    "Crosses",
    "⊕",
    "A ringed cross. The diagram is a simplified reference, not an artifact reproduction.",
  ],
  [
    "orthodox-cross",
    "Orthodox cross",
    "Crosses",
    "☦",
    "A cross with additional crossbars; regional variants will have separate usage records.",
  ],
  [
    "patriarchal-cross",
    "Patriarchal cross",
    "Crosses",
    "☨",
    "A cross with two horizontal bars.",
  ],
  [
    "jerusalem-cross",
    "Jerusalem cross",
    "Crosses",
    "☩",
    "A central cross and four smaller crosses; the diagram is schematic.",
  ],
  [
    "maltese-cross",
    "Maltese cross",
    "Crosses",
    "✠",
    "An eight-pointed cross; distinguish it from the many forms grouped under “Templar cross.”",
  ],
  [
    "ankh",
    "Ankh",
    "Crosses",
    "☥",
    "A looped cross form. Its usage record is reserved for ancient Egyptian and later contexts.",
  ],
  [
    "saint-peter",
    "Saint Peter’s cross",
    "Crosses",
    "⸸",
    "An inverted Latin cross. Meaning depends on the community, era, and context.",
  ],
  [
    "swastika",
    "Swastika",
    "Geometric",
    "卐",
    "A bent-arm cross with long histories in multiple cultures. Usage records must distinguish religious and cultural contexts from Nazi appropriation and modern extremist use. This entry is educational.",
  ],
  [
    "star-of-david",
    "Star of David",
    "Geometric",
    "✡",
    "A six-pointed star formed by two triangles, including its appearance on the flag of Israel. Separate cultural, religious, and state uses in the structured usage records.",
  ],
] as const;
export const symbols: SymbolEntry[] = seeds.map(
  ([id, title, family, glyph, description]) => ({
    id,
    title,
    family,
    glyph,
    description,
    historicalUsage: researchedUsage[id] ?? [
      {
        culture: null,
        era: null,
        region: null,
        meaning: null,
        citations: [],
        status: "To be researched",
      },
    ],
  }),
);

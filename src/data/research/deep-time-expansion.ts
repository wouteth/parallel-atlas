import { entry } from "./helpers.ts";

const papers: Record<number, string> = {
  57: "origin-urantia",
  58: "life-establishment-urantia",
};
const urantiaRows: [string, string, number, number, string, string][] = [
  [
    "jupiter-saturn",
    "Urantia: Jupiter and Saturn organize",
    4000000000,
    57,
    "57:6.6",
    "The book places the organization of these planetary systems four billion years ago.",
  ],
  [
    "planetary-assembly",
    "Urantia: planetary assembly",
    3500000000,
    57,
    "57:6.7",
    "Planetary condensation nuclei and most lunar cores are described as established.",
  ],
  [
    "monmatia",
    "Urantia: the solar system is named Monmatia",
    3000000000,
    57,
    "57:6.8–9",
    "The functioning solar system is entered on Nebadon’s registry.",
  ],
  [
    "early-earth-mass",
    "Urantia: Earth at one tenth its mass",
    2500000000,
    57,
    "57:6.10",
    "Earth grows through meteoric accretion in the book’s chronology.",
  ],
  [
    "primitive-atmosphere",
    "Urantia: Earth retains an atmosphere",
    2000000000,
    57,
    "57:7.2",
    "Earth reaches about one fifth of its present size and retains a primitive atmosphere.",
  ],
  [
    "volcanic-age",
    "Urantia: the volcanic age",
    1500000000,
    57,
    "57:7.4–6",
    "The planet grows while a crust forms amid extensive volcanic activity.",
  ],
  [
    "planet-named",
    "Urantia receives its name",
    1000000000,
    57,
    "57:8.1",
    "The planet reaches approximately its present size and is registered as Urantia.",
  ],
  [
    "first-continent",
    "Urantia: one continent and one ocean",
    950000000,
    57,
    "57:8.5",
    "The narrative describes a single landmass and a Pacific ocean.",
  ],
  [
    "life-survey",
    "Urantia: a planetary life survey",
    900000000,
    57,
    "57:8.7–8",
    "A celestial commission assesses the world for a life experiment.",
  ],
  [
    "life-carriers-arrive",
    "Urantia: Life Carriers inspect Earth",
    600000000,
    58,
    "58:1.1",
    "A commission studies the physical conditions before initiating life.",
  ],
  [
    "life-implantation",
    "Urantia: three marine life implantations",
    550000000,
    58,
    "58:4.1–2",
    "Life Carriers initiate three identical marine life patterns, formulated on Earth.",
  ],
  [
    "marine-plants",
    "Urantia: marine plant life established",
    500000000,
    58,
    "58:4.3",
    "Primitive marine vegetation is established as continental regions separate.",
  ],
  [
    "animal-life",
    "Urantia: transition to animal life",
    450000000,
    58,
    "58:6.1",
    "The text describes a gradual transition in shallow tropical waters.",
  ],
];
const urantiaEvents = urantiaRows.map(
  ([id, title, age, paper, passage, summary]) =>
    entry({
      id: `urantia-${id}`,
      trackId: "urantia",
      title,
      year: 1934 - age,
      kind: "Revelatory text",
      dateLabel: `${age.toLocaleString("en-US")} years before 1934 · Urantia chronology`,
      dateBasis: `The book’s relative age is plotted using the collection’s fixed 1934 reference: 1934 − ${age}. This is an attributed chronology, with no claim of year-level precision.`,
      summary,
      topicIds:
        paper === 57 ? ["cosmic-origins", "urantia"] : ["origins", "urantia"],
      citations: [
        {
          sourceId: "urantia",
          passage,
          url: `https://www.urantia.org/urantia-book-standardized/paper-${paper}-${papers[paper]}`,
          checkedOn: "2026-09-14",
        },
      ],
    }),
);
const raRows: [string, string, number, string][] = [
  [
    "maldek-destroyed",
    "Ra: Maldek’s biosphere destroyed",
    705000,
    "War destroys Maldek’s biosphere in the session’s account.",
  ],
  [
    "maldek-recovery",
    "Ra: Maldek’s survivors regain awareness",
    600000,
    "The Confederation releases the survivors from a collective state of fear.",
  ],
  [
    "maldek-earth",
    "Ra: Maldek entities begin Earth incarnations",
    500000,
    "The entities begin incarnating on Earth in nonhuman bodies.",
  ],
];
const raEvents = raRows.map(([id, title, age, summary]) =>
  entry({
    id: `ra-${id}`,
    trackId: "law-of-one",
    title,
    year: 1981 - age,
    kind: "Channeled account",
    dateLabel: `About ${age.toLocaleString("en-US")} years before the 1981 session`,
    dateBasis: `Session 10 was recorded January 27, 1981. Its approximate relative age is converted as 1981 − ${age}; this dates the account’s claim.`,
    summary,
    topicIds: [
      "law-of-one",
      id === "maldek-destroyed" ? "catastrophe" : "origins",
    ],
    citations: [
      {
        sourceId: "ra",
        passage: "Session 10.1–4",
        url: "https://www.lawofone.info/s/10#1",
        note: "Session 10’s stated sequence is preserved. The edition flags a later chronological correction; compare its footnote and Session 21 before combining alternative session dates.",
        checkedOn: "2026-09-14",
      },
    ],
  }),
);
export const deepTimeEvents = [...urantiaEvents, ...raEvents];

import index from "./book-sections.ts";
import type { BookCoverage, BookSection } from "./book-types";
import { poeticPassages, poeticEddaUrl } from "./research/book-expansion.ts";

const checkedOn = "2026-09-14";
const book = (input: Omit<BookCoverage, "checkedOn">): BookCoverage => ({
  ...input,
  checkedOn,
});
const critiasUrl = "https://classics.mit.edu/Plato/critias.html";
const sections = (
  url: string,
  rows: [string, string, string[]][],
): BookSection[] =>
  rows.map(([id, title, eventIds]) => ({ id, title, url, eventIds }));

export const books: BookCoverage[] = [
  book({
    id: "critias",
    title: "Critias",
    trackId: "plato",
    edition: "Benjamin Jowett translation · Internet Classics Archive",
    url: critiasUrl,
    access: "Full text online",
    accessNote:
      "Complete surviving dialogue. The text breaks off before Zeus’s speech; no conclusion has been reconstructed.",
    sourceIds: ["critias"],
    sections: sections(critiasUrl, [
      ["preface", "Opening conversation and invocation", []],
      [
        "war",
        "The war and sinking of Atlantis",
        ["plato-ancient-war", "plato-atlantis"],
      ],
      [
        "allotments",
        "Divine allotments and ancient Athens",
        ["plato-divine-allotments"],
      ],
      ["attica", "Attica’s land, forests and waters", ["plato-attica-erosion"]],
      ["acropolis", "The Acropolis and its inhabitants", ["plato-acropolis"]],
      [
        "names",
        "Transmission and translation of names",
        ["plato-translated-names"],
      ],
      [
        "poseidon",
        "Poseidon, Cleito and the ten kings",
        ["plato-poseidon-twins", "plato-atlantis-rings"],
      ],
      ["wealth", "Resources and royal wealth", ["plato-atlantis-resources"]],
      [
        "city",
        "Canals, palace and temples",
        ["plato-atlantis-canals", "plato-atlantis-rings"],
      ],
      [
        "waterworks",
        "Waterworks and the harbor",
        ["plato-atlantis-waterworks"],
      ],
      ["plain", "The plain and irrigation", ["plato-atlantis-plain"]],
      ["army", "Military organization", ["plato-atlantis-army"]],
      ["laws", "Laws, judgment and the bull ritual", ["plato-atlantis-laws"]],
      [
        "decline",
        "Decline and the assembly of the gods",
        ["plato-atlantis-decline", "plato-unfinished-ending"],
      ],
    ]),
    review: {
      checkedOn,
      scope:
        "All narrative sections of the surviving dialogue reviewed. Related details are grouped into accounts; this is not a sentence-by-sentence annotation.",
      excludedSections: [
        {
          id: "preface",
          reason:
            "Conversational framing and prayer; no separate historical or mythological event.",
        },
      ],
    },
  }),
  book({
    id: "timaeus",
    title: "Timaeus",
    trackId: "plato",
    edition: "Benjamin Jowett translation · Internet Classics Archive",
    url: "https://classics.mit.edu/Plato/timaeus.html",
    access: "Full text online",
    accessNote:
      "Full dialogue located and all 72 web paragraphs linked. Existing entries cover selected passages; the cosmology, anatomy and physiology still need a complete extraction pass.",
    sourceIds: ["timaeus"],
    sections: index.timaeus,
  }),
  book({
    id: "poetic-edda",
    title: "Poetic Edda",
    trackId: "norse",
    edition: "Henry Adams Bellows, 1923 · both volumes, 35 pieces",
    url: poeticEddaUrl,
    access: "Full text online",
    accessNote:
      "Every poem and prose bridge in this edition has a cited entry. Those entries cover selected passages, not every episode, stanza or editorial note. Variant versions remain separate.",
    sourceIds: ["poetic-edda-bellows"],
    sections: poeticPassages.map((p) => ({
      id: p.id,
      title: p.poem,
      url: p.url,
      eventIds: [p.id],
    })),
  }),
  book({
    id: "prose-edda",
    title: "Prose Edda",
    trackId: "norse",
    edition: "Rasmus B. Anderson · 1901 printing of the earlier translation",
    url: "https://www.gutenberg.org/files/18947/18947-h/18947-h.htm",
    access: "Partial edition online",
    accessNote:
      "This edition includes Gylfaginning, Brage’s Talk and selections from Skaldskaparmal. It omits Hattatal and is not the whole Prose Edda. Forewords and afterwords are identified separately by the editor.",
    sourceIds: ["younger-edda"],
    sections: index.prose.map((s) => ({
      ...s,
      title: `${s.id.startsWith("gylfe") ? "Gylfaginning" : s.id.startsWith("brage") ? "Brage’s Talk" : s.id.startsWith("poet_") ? "Skaldskaparmal selections" : "Editorial framing"} · ${s.title}`,
    })),
  }),
  book({
    id: "vishnu-purana",
    title: "Vishnu Purana",
    trackId: "hindu",
    edition: "H. H. Wilson, 1840 · six books, 126 chapters",
    url: "https://lakshminarayanlenasia.com/downloads/VishnuPurana.pdf",
    access: "Full text online",
    accessNote:
      "All 126 chapter headings and their PDF locations are indexed. Chapter headings are the translator’s summaries; they do not mean every passage has been reviewed or entered on the timeline.",
    sourceIds: ["vishnu-purana-wilson"],
    sections: index.vishnu.map((s) => ({
      ...s,
      citationPattern: `Vishnu Purana ${s.title.match(/Book ([IVX]+)/)![1]}\\.${s.id.split("-").at(-1)}(?=[ ·]|$)`,
    })),
  }),
  book({
    id: "satapatha-brahmana",
    title: "Satapatha Brahmana",
    trackId: "hindu",
    edition: "Julius Eggeling · Sacred Books of the East 12, 26, 41, 43 and 44",
    url: "https://www.wisdomlib.org/hinduism/book/satapatha-brahmana-english",
    access: "Partial edition online",
    accessNote:
      "396 brahmana sections indexed from the online Eggeling edition. Its final kanda stops at XIV.3; the Brihadaranyaka Upanishad (XIV.4–9) is outside this edition and remains a coverage gap. This is the Madhyandina recension, not the Kanva recension.",
    sourceIds: ["satapatha"],
    sections: index.satapatha,
  }),
  book({
    id: "urantia-book",
    title: "The Urantia Book",
    trackId: "urantia",
    edition: "Urantia Foundation · Standard Reference Text",
    url: "https://www.urantia.org/urantia-book/read-urantia-book-online",
    access: "Full text online",
    accessNote:
      "Foreword and all 196 papers linked. Existing timeline entries cover selected passages; a paper having an entry does not establish full review.",
    sourceIds: ["urantia"],
    sections: index.urantia.map((s, i) => ({
      ...s,
      citationPattern: i === 0 ? "Foreword" : `(?:^|Paper\\s+)${i}(?=[: ,·]|$)`,
    })),
  }),
  book({
    id: "law-of-one",
    title: "The Law of One / The Ra Contact",
    trackId: "law-of-one",
    edition: "106 Ra sessions, 1981–1984 · session-numbered online edition",
    url: "https://www.lawofone.info/sessions.php",
    access: "Full text online",
    accessNote:
      "All 106 sessions linked. The session corpus spans the material published in the Law of One volumes, including subsequently restored material. Editorial introductions and other L/L channelings are outside this inventory.",
    sourceIds: ["ra"],
    sections: index.ra.map((s, i) => ({
      ...s,
      citationPattern: `(?:^|Session\\s+)${i + 1}(?=[., ·]|$)`,
    })),
  }),
  ...index.bible.map((b) =>
    book({
      ...b,
      id: `bible-${b.id}`,
      title: `Bible · ${b.title}`,
      trackId: "bible",
      edition: "King James Version · 66-book edition",
      access: "Full text online",
      accessNote:
        "Chapter inventory checked against the complete online KJV text. Other biblical canons, the Apocrypha and textual variants are outside this edition. Chapter links open the KJV passage.",
      sourceIds: ["genesis", "matthew", "acts", "exodus-kjv"],
    }),
  ),
  ...[
    [
      "silmarillion",
      "The Silmarillion",
      "https://www.tolkienestate.com/writing/christopher-tolkien-the-silmarillion/",
      "tolkien-silmarillion-introduction",
    ],
    [
      "fellowship",
      "The Fellowship of the Ring",
      "https://www.tolkienestate.com/writing/",
      "",
    ],
    [
      "two-towers",
      "The Two Towers",
      "https://www.tolkienestate.com/writing/",
      "",
    ],
    [
      "return-king",
      "The Return of the King (including appendices)",
      "https://www.tolkienestate.com/writing/",
      "",
    ],
    [
      "unfinished-tales",
      "Unfinished Tales",
      "https://www.tolkienestate.com/writing/christopher-tolkien-unfinished-tales-of-numenor-and-middle-earth/",
      "tolkien-unfinished-introduction",
    ],
  ].map(([id, title, url, sourceId]) =>
    book({
      id: `tolkien-${id}`,
      title: title!,
      url: url!,
      trackId: "tolkien",
      edition:
        "J. R. R. Tolkien; Christopher Tolkien’s editorial material where applicable",
      access: sourceId ? "Synopsis only" : "Not located",
      accessNote: sourceId
        ? "Official editorial introduction located. Full book extraction skipped; these introductory accounts do not count as chapter coverage."
        : "A complete readable edition was not verified during this search. Full book extraction skipped.",
      sourceIds: sourceId ? [sourceId] : [],
      sections: [],
    }),
  ),
  ...[
    [
      "i",
      "Terra Atlantis I — O Sinal de Land’s End",
      "terra-atlantis-i-o-sinal-de-land-s-end",
    ],
    ["ii", "Terra Atlantis II — Frota Norte", "terra-atlantis-ii-frota-norte"],
    [
      "iii",
      "Terra Atlantis III — A Era Sapiens",
      "terra-atlantis-iii-a-era-sapiens",
    ],
  ].map(([id, title, slug]) =>
    book({
      id: `val-ellam-${id}`,
      title: title!,
      trackId: "jan-val-ellam",
      edition: "Jan Val Ellam · Portuguese edition",
      url: `https://janvalellam.org/produtos/${slug}`,
      access: "Synopsis only",
      accessNote:
        "Official sales synopsis located. No complete readable edition verified; full book extraction skipped.",
      sourceIds: [`val-ellam-atlantis-${id}`],
      sections: [],
    }),
  ),
  book({
    id: "terra-papers",
    title: "Terra Papers — Parts I and II",
    trackId: "terra-papers",
    edition: "Robert Morning Sky · circulated transcription",
    url: "https://www.tapatalk.com/groups/astrallife/terra-papers-by-robert-morning-sky-t1192.html",
    access: "Partial edition online",
    accessNote:
      "A transcription and third-party PDF links were found. Completeness and correspondence to the original edition have not been established; the current 14 entries remain transcription-based.",
    sourceIds: ["terra-transcription"],
    sections: [],
  }),
  ...[
    "The 12th Planet",
    "The Stairway to Heaven",
    "The Wars of Gods and Men",
    "The Lost Realms",
    "When Time Began",
    "The Cosmic Code",
    "The End of Days",
    "Genesis Revisited",
    "Divine Encounters",
    "The Lost Book of Enki",
    "The Earth Chronicles Expeditions",
    "The Earth Chronicles Handbook",
    "There Were Giants Upon the Earth",
    "The King Who Refused to Die",
    "The Anunnaki Chronicles",
  ].map((title, i) =>
    book({
      id: `sitchin-book-${i + 1}`,
      title,
      trackId: "sitchin",
      edition:
        i === 14
          ? "Zecharia Sitchin; compiled by Janet Sitchin"
          : "Zecharia Sitchin",
      url:
        i === 0
          ? "https://library.seaverns.com/History/Zecharia_Sitchin/The_12th_Planet.pdf"
          : "https://www.sitchin.com/",
      access: i === 0 ? "Full text online" : "Not located",
      accessNote:
        i === 0
          ? "Readable third-party PDF located, labeled 1983. Its correspondence to the printed edition and chapter extraction are not yet reviewed. The separate time chart does not count as coverage of this book."
          : "No complete edition has been verified for extraction. The separate Earth Chronicles time-chart transcription is not chapter coverage of this book. Full book extraction skipped pending a readable edition.",
      sourceIds: [],
      sections: [],
    }),
  ),
];

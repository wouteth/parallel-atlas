import { cite, entry, unanchored } from "./helpers.ts";

const accounts: [
  string,
  string,
  "timaeus" | "critias",
  string,
  string,
  string[],
][] = [
  [
    "plato-solon-story",
    "Solon and the Egyptian account",
    "timaeus",
    "20d–23c",
    "Critias introduces a story transmitted through Solon and Egyptian priests.",
    ["atlantis"],
  ],
  [
    "plato-catastrophe-cycles",
    "Recurring destruction by fire and water",
    "timaeus",
    "22a–23b",
    "An Egyptian priest interprets catastrophe stories as recurrent disruptions of human memory.",
    ["catastrophe", "flood-narratives"],
  ],
  [
    "plato-being-becoming",
    "Being and becoming",
    "timaeus",
    "27d–29d",
    "The dialogue distinguishes what always is from what comes into being.",
    ["cosmology"],
  ],
  [
    "plato-cosmic-order",
    "The ordering of the cosmos",
    "timaeus",
    "29d–30c",
    "The cosmological account describes a maker bringing order to the visible world.",
    ["cosmology", "creation"],
  ],
  [
    "plato-time-heavens",
    "Time and the heavens",
    "timaeus",
    "37c–39e",
    "The dialogue connects time’s measurement with the ordered motions of celestial bodies.",
    ["cosmology", "cycles"],
  ],
  [
    "plato-atlantis-rings",
    "The concentric rings of Atlantis",
    "critias",
    "113c–116c",
    "The account describes alternating rings of land and water around the island’s center.",
    ["atlantis"],
  ],
  [
    "plato-atlantis-laws",
    "The kings and laws of Atlantis",
    "critias",
    "119c–120c",
    "Ritual, law, and shared authority structure the dialogue’s portrayal of Atlantean rulers.",
    ["atlantis"],
  ],
  [
    "plato-unfinished-ending",
    "Zeus convenes the gods",
    "critias",
    "120e–121c",
    "The surviving dialogue ends as Zeus prepares to address the assembled gods.",
    ["atlantis"],
  ],
];
export const platoEvents = accounts.map(
  ([id, title, text, passage, summary, topics]) =>
    entry({
      id,
      title,
      year: null,
      trackId: "plato",
      kind: "Classical text",
      summary,
      dateBasis: unanchored,
      topicIds: ["plato", ...topics],
      image: topics.includes("atlantis") ? "ocean" : "manuscript",
      citations: [
        cite(
          text,
          `${text === "timaeus" ? "Timaeus" : "Critias"} ${passage} · Stephanus pagination`,
          `https://classics.mit.edu/Plato/${text}.html`,
          "Jowett translation; Stephanus locators identify the standard passage, although this web edition does not print those numbers.",
        ),
      ],
    }),
);

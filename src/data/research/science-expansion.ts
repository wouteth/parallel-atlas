import { entry, source } from "./helpers.ts";

const rows: [
  string,
  string,
  string,
  string,
  number,
  string,
  string,
  string,
  string[],
][] = [
  [
    "earth-formation",
    "Formation of Earth",
    "Facts About Earth",
    "https://science.nasa.gov/earth/facts/",
    4500000000,
    "Formation",
    "NASA Science",
    "Earth forms from material in the young solar system through gravitational accretion.",
    ["cosmic-origins"],
  ],
  [
    "moon-formation",
    "Formation of the Moon",
    "Moons: Facts",
    "https://science.nasa.gov/solar-system/moons/facts/",
    4500000000,
    "Moons of the Inner Solar System",
    "NASA Science",
    "The leading explanation has debris from a large impact on early Earth forming the Moon.",
    ["cosmic-origins"],
  ],
  [
    "strelley-stromatolites",
    "Strelley Pool stromatolites",
    "Strelley Pool Chert and Early Life",
    "https://science.nasa.gov/earth/earth-observatory/strelley-pool-chert-and-early-life-6664/",
    3430000000,
    "Description of the 3.43-billion-year-old environment and stromatolites",
    "NASA Earth Observatory",
    "Western Australian rocks preserve layered structures studied as evidence of ancient microbial communities. This is evidence for early life, not a date for its first origin.",
    ["origins"],
  ],
  [
    "cretaceous-extinction",
    "End-Cretaceous mass extinction",
    "Extinction Over Time",
    "https://naturalhistory.si.edu/education/teaching-resources/paleontology/extinction-over-time",
    66000000,
    "Mass Extinctions · End of the Cretaceous",
    "Smithsonian National Museum of Natural History",
    "A mass extinction eliminates non-avian dinosaurs and many other marine and terrestrial species.",
    ["catastrophe"],
  ],
  [
    "homo-sapiens",
    "Early Homo sapiens in Africa",
    "Homo sapiens",
    "https://humanorigins.si.edu/evidence/human-fossils/species/homo-sapiens",
    300000,
    "Overview; When Lived",
    "Smithsonian Human Origins Program",
    "Fossils and other evidence place the emergence of our species in Africa around 300,000 years ago. Species origins and the emergence of cities are different questions.",
    ["origins"],
  ],
];
export const scienceExpansionSources = rows.map(
  ([id, , title, url, , , author]) =>
    source(`science-${id}`, title, author, url),
);
export const scienceExpansionEvents = rows.map(
  ([id, title, , url, age, passage, , summary, topicIds]) =>
    entry({
      id: `science-${id}`,
      trackId: "mainstream",
      title,
      year: 2026 - age,
      kind: "Scientific study",
      dateLabel: `About ${age.toLocaleString("en-US")} years ago`,
      dateBasis: `The source gives a rounded scientific age. A fixed 2026 display reference yields 2026 − ${age}; the timeline coordinate does not imply year-level dating accuracy.`,
      summary,
      topicIds,
      citations: [
        { sourceId: `science-${id}`, passage, url, checkedOn: "2026-09-14" },
      ],
    }),
);

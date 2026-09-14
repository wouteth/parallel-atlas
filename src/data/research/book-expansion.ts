import { entry, source, unanchored } from "./helpers.ts";

export const poeticEddaUrl =
  "https://www.gutenberg.org/cache/epub/73533/pg73533-images.html";
export const bookExpansionSources = [
  source(
    "poetic-edda-bellows",
    "The Poetic Edda — Bellows translation (1923)",
    "Anonymous poems; translated by Henry Adams Bellows",
    poeticEddaUrl,
  ),
];

// One cited passage from each of the 35 pieces in this edition. This is
// representation across the contents, not a claim that every stanza is indexed.
const poems: [string, string, string, string, string][] = [
  [
    "voluspo",
    "Voluspo",
    "21–24",
    "The first war in Voluspo",
    "The seer recalls Gollveig being burned and returning to life, followed by conflict involving Odin and the Vanir.",
  ],
  [
    "hovamol",
    "Hovamol",
    "139–142",
    "Odin obtains the runes",
    "Odin describes hanging wounded on a tree for nine nights, taking up the runes and acquiring songs and wisdom.",
  ],
  [
    "vafthruthnismol",
    "Vafthruthnismol",
    "52–55",
    "Odin wins the wisdom contest",
    "Vafthruthnir foretells Odin’s death and Vidar’s revenge, then recognizes his questioner as Odin when asked what he whispered to his son.",
  ],
  [
    "grimnismol",
    "Grimnismol",
    "51–54 and closing prose",
    "Geirrod falls on his sword",
    "After the captive reveals himself as Odin, King Geirrod tries to free him, stumbles onto his own sword and dies. Agnar succeeds him.",
  ],
  [
    "skirnismol",
    "Skirnismol",
    "40–43",
    "Gerd’s promised meeting with Freyr",
    "Skirnir returns with Gerd’s promise to meet Freyr in Barri after nine nights. Freyr laments the wait.",
  ],
  [
    "harbarthsljoth",
    "Harbarthsljoth",
    "57–60",
    "Thor is refused passage",
    "The exchange ends with Thor threatening repayment for the denied crossing and Harbard dismissing him.",
  ],
  [
    "hymiskvitha",
    "Hymiskvitha",
    "37–40",
    "Thor brings Hymir’s kettle to the gods",
    "Thor returns with Hymir’s kettle, allowing the gods to drink ale at Aegir’s hall.",
  ],
  [
    "lokasenna",
    "Lokasenna",
    "62–65 and closing prose",
    "Loki leaves the feast and is captured",
    "Loki withdraws before Thor’s threats. The prose ending describes his capture as a salmon, binding and punishment beneath a venomous snake.",
  ],
  [
    "thrymskvitha",
    "Thrymskvitha",
    "30–33",
    "Thor recovers his hammer at the wedding",
    "When Mjollnir is brought to bless the supposed bride, Thor takes it and kills Thrym and the assembled giants.",
  ],
  [
    "alvissmol",
    "Alvissmol",
    "32–35",
    "Thor delays Alvis until daylight",
    "After questioning the dwarf about names used in different worlds, Thor announces that daylight has caught him.",
  ],
  [
    "baldrs-draumar",
    "Baldrs Draumar",
    "11–14",
    "The seer foretells vengeance for Baldr",
    "The seer describes Vali’s birth and vengeance, recognizes Odin beneath his disguise and sends him away until the final conflict.",
  ],
  [
    "rigsthula",
    "Rigsthula",
    "46–49",
    "Kon gains runic knowledge",
    "Kon surpasses Rig-Jarl in knowledge and gains the right to the name Rig. A crow urges him toward warfare instead of bird hunting.",
  ],
  [
    "hyndluljoth",
    "Hyndluljoth",
    "48–51",
    "Freyja disputes Hyndla’s curse",
    "Hyndla threatens Ottar with a poisonous drink. Freyja rejects the curse and seeks the gods’ favor for him.",
  ],
  [
    "svipdagsmol",
    "Svipdagsmol",
    "63–66",
    "Svipdag and Mengloth are reunited",
    "Svipdag identifies himself, and Mengloth welcomes the man she has long awaited at Lyfjaberg.",
  ],
  [
    "volundarkvitha",
    "Völundarkvitha",
    "40–43",
    "Volund escapes; Bothvild speaks",
    "Volund flies away. Bothvild confirms to her father that she was with the smith and had no power to resist him.",
  ],
  [
    "helgi-hjorvarth",
    "Helgakvitha Hjorvarthssonar",
    "40–43 and closing prose",
    "Helgi’s farewell to Svava",
    "The mortally wounded Helgi bids farewell to Svava. Hethin promises vengeance; the closing prose says Helgi and Svava were born again.",
  ],
  [
    "helgi-hundingsbane-i",
    "Helgakvitha Hundingsbana I",
    "55–58",
    "Helgi’s victory at Frekastein",
    "Helgi leads the battle while helmeted maidens watch over him. Sigrun celebrates his victory and their union.",
  ],
  [
    "helgi-hundingsbane-ii",
    "Helgakvitha Hundingsbana II",
    "47–50 and closing prose",
    "Sigrun awaits Helgi’s return from the dead",
    "Helgi departs from the burial mound. Sigrun waits for another visit and later dies of grief; the prose ending reports a rebirth tradition.",
  ],
  [
    "sinfjotli",
    "Fra Dautha Sinfjotla",
    "prose narrative",
    "Sinfjotli dies from a poisoned drink",
    "Borghild offers Sinfjotli a poisoned drink. After his death, Sigmund carries his body to a fjord, where a boatman takes it away.",
  ],
  [
    "gripisspo",
    "Gripisspo",
    "50–53",
    "Gripir foretells Sigurd’s betrayal",
    "Gripir predicts that Gudrun’s brothers will cause Sigurd’s death and grief for Gudrun. Sigurd accepts that he cannot avoid his fate.",
  ],
  [
    "reginsmol",
    "Reginsmol",
    "26 and surrounding prose",
    "Sigurd avenges Sigmund",
    "Sigurd defeats Lyngvi and his brothers. Regin praises his vengeance for Sigmund and then urges him to fight Fafnir.",
  ],
  [
    "fafnismol",
    "Fafnismol",
    "41–44 and closing prose",
    "Sigurd takes Fafnir’s treasure",
    "Birds direct Sigurd toward Gjuki’s family and a sleeping battle-maiden. He loads Fafnir’s gold, armor and weapons onto Grani.",
  ],
  [
    "sigrdrifumol",
    "Sigrdrifumol",
    "34–37",
    "Sigrdrifa’s counsel on burial and feuds",
    "The counsel calls for washing and preparing the dead, warns that vengeance may persist despite compensation, and cautions against anger and betrayal.",
  ],
  [
    "brot",
    "Brot af Sigurtharkvithu",
    "17–20 and closing prose",
    "Conflicting accounts of Sigurd’s death",
    "Brynhild accuses the brothers of broken oaths. The prose compiler preserves competing accounts of Sigurd being killed outdoors or in bed.",
  ],
  [
    "gudrun-i",
    "Guthrunarkvitha I",
    "22–25 and closing prose",
    "Gudrun leaves after Sigurd’s death",
    "The women exchange accusations over Sigurd’s death. The prose ending sends Gudrun to Denmark and recounts Brynhild’s death.",
  ],
  [
    "sigurd-short",
    "Sigurtharkvitha en Skamma",
    "67–70",
    "Brynhild’s final funeral instructions",
    "Brynhild asks for a sword to lie between herself and Sigurd and names attendants for the funeral before her wounds overcome her.",
  ],
  [
    "brynhild-hel",
    "Helreith Brynhildar",
    "11–14",
    "Brynhild recounts her betrayed marriage",
    "Brynhild describes sharing a bed chastely with Sigurd, discovering the marriage deception and expecting to be reunited with him.",
  ],
  [
    "niflungs",
    "Drap Niflunga",
    "prose narrative",
    "The deaths of Gunnar and Hogni",
    "The prose bridge recounts the killing of Hogni and Gunnar’s death in a serpent pit, despite his harp playing.",
  ],
  [
    "gudrun-ii",
    "Guthrunarkvitha II, en Forna",
    "42–45",
    "Atli’s ominous dreams",
    "Atli recounts dreams of consuming the hearts of hawks and the flesh of hounds. Gudrun offers an interpretation involving sacrificial animals.",
  ],
  [
    "gudrun-iii",
    "Guthrunarkvitha III",
    "7–10",
    "Gudrun’s ordeal by boiling water",
    "Gudrun removes stones from a boiling kettle unharmed. Her accuser Herkja is burned in the same ordeal and cast into a bog.",
  ],
  [
    "oddrun",
    "Oddrunargratr",
    "29–32",
    "Oddrun cannot save Gunnar",
    "Oddrun recalls sailing to help Gunnar, but arriving too late to prevent the fatal serpent bite attributed to Atli’s mother.",
  ],
  [
    "atlakvitha",
    "Atlakvitha en Grönlenzka",
    "43–46",
    "Gudrun kills Atli and burns the hall",
    "Gudrun kills the drunken Atli and sets fire to his hall in revenge for her brothers.",
  ],
  [
    "atlamol",
    "Atlamol en Grönlenzku",
    "96–99",
    "Gudrun arranges Atli’s burial",
    "As Atli dies, Gudrun promises him a ship, coffin and shroud. The poem closes by praising Gjuki’s children.",
  ],
  [
    "gudrun-inciting",
    "Guthrunarhvot",
    "19–22",
    "Gudrun calls for her funeral pyre",
    "Gudrun calls on the dead Sigurd to return, recalls their promised reunion and asks the nobles to build her a pyre.",
  ],
  [
    "hamthesmol",
    "Hamthesmol",
    "28–31",
    "Hamther and Sorli’s last stand",
    "The brothers recognize that killing Erp has ruined their attack. They affirm their fame before Sorli and Hamther fall.",
  ],
];

export const poeticPassages = poems.map(
  ([slug, poem, passage, title, summary], index) => {
    const part = index < 14 ? 1 : 2;
    const chapter = index < 14 ? index + 1 : index - 13;
    return {
      id: `edda-${slug}`,
      poem,
      title,
      summary,
      passage,
      url: `${poeticEddaUrl}#ch${part}.${chapter}`,
    };
  },
);

const critias: [string, string, string, string][] = [
  [
    "plato-ancient-war",
    "Athens and Atlantis at war",
    "Opening account of the war · paragraph beginning ‘Let me begin by observing’",
    "Critias places a war between Athens and Atlantis nine thousand years before the narrative’s reference point and describes the island’s later sinking.",
  ],
  [
    "plato-divine-allotments",
    "The gods allot and govern territories",
    "Paragraph beginning ‘In the days of old’",
    "The gods peacefully divide the Earth. Athena and Hephaestus receive Attica and establish its first civic order; later disasters leave names but little memory of deeds.",
  ],
  [
    "plato-attica-erosion",
    "Attica loses its soil and forests",
    "Paragraph beginning ‘Now the country was inhabited’",
    "Critias contrasts fertile ancient Attica with the exposed rock of his own time, attributing the loss of soil and water retention to repeated deluges.",
  ],
  [
    "plato-acropolis",
    "The ancient Acropolis and its destruction",
    "Paragraph beginning ‘Such was the natural state’",
    "The ancient Acropolis houses a communal warrior class. Rain, earthquakes and an inundation are said to have stripped its soil and blocked its spring.",
  ],
  [
    "plato-translated-names",
    "Solon translates the Atlantean names",
    "Paragraph beginning ‘Yet, before proceeding further’",
    "Critias explains the story’s Greek names as Solon’s translations of Egyptian renderings and claims that the family preserved Solon’s written notes.",
  ],
  [
    "plato-poseidon-twins",
    "Poseidon’s children inherit ten kingdoms",
    "Paragraph beginning ‘In this mountain there dwelt’",
    "Poseidon and Cleito have five pairs of twin sons. Atlas receives the chief kingdom; the remaining sons govern other portions of Atlantis.",
  ],
  [
    "plato-atlantis-resources",
    "The resources of Atlantis",
    "Paragraph beginning ‘Now Atlas had a numerous’",
    "Critias describes inherited royal wealth, imported goods, orichalcum mining, timber, elephants and abundant crops on Atlantis.",
  ],
  [
    "plato-atlantis-canals",
    "Canals, bridges and the royal precinct",
    "Paragraphs beginning ‘First of all they bridged’ and ‘The palaces in the interior’",
    "Successive kings enlarge the palace, connect the rings by bridges and shipping channels, and embellish Poseidon’s temple with precious materials.",
  ],
  [
    "plato-atlantis-waterworks",
    "Baths, aqueducts and the harbor city",
    "Paragraphs beginning ‘In the next place’ and ‘Leaving the palace’",
    "Hot and cold springs supply baths and aqueducts. The outer harbor district is crowded with homes, ships and merchants.",
  ],
  [
    "plato-atlantis-plain",
    "The irrigated plain of Atlantis",
    "Paragraphs beginning ‘I have described the city’ and ‘I will now describe the plain’",
    "The account describes a mountain-bordered plain, a perimeter ditch and intersecting canals used for transport and irrigation, with two harvests each year.",
  ],
  [
    "plato-atlantis-army",
    "Military levies of Atlantis",
    "Paragraph beginning ‘As to the population’",
    "The plain is divided into military districts required to provide chariots, cavalry, infantry and crews for a fleet.",
  ],
  [
    "plato-atlantis-decline",
    "The rulers of Atlantis lose their restraint",
    "Final paragraph beginning ‘Such was the vast power’",
    "Critias attributes the rulers’ decline to a fading divine inheritance and growing greed. Zeus assembles the gods to correct them; his speech does not survive.",
  ],
];

export const bookExpansionEvents = [
  ...poeticPassages.map(({ id, poem, title, summary, passage, url }) =>
    entry({
      id,
      title,
      summary,
      trackId: "norse",
      year: null,
      kind: "Sacred narrative",
      dateLabel: "Narrative sequence; no calendar date",
      dateBasis: unanchored,
      topicIds: ["ragnarok"].filter(
        () => id === "edda-voluspo" || id === "edda-vafthruthnismol",
      ),
      citations: [
        {
          sourceId: "poetic-edda-bellows",
          passage: `${poem} · ${passage}`,
          url,
          checkedOn: "2026-09-14",
          note: "Bellows’s 1923 translation and its stanza numbering. This record indexes the specified passage, not every episode or teaching in the poem. Prose links are distinguished from verse.",
        },
      ],
    }),
  ),
  ...critias.map(([id, title, passage, summary]) =>
    entry({
      id,
      title,
      summary,
      trackId: "plato",
      year: null,
      kind: "Classical text",
      dateBasis: unanchored,
      topicIds: ["plato", "atlantis"],
      image: "ocean",
      citations: [
        {
          sourceId: "critias",
          passage: `Critias · ${passage}`,
          url: "https://classics.mit.edu/Plato/critias.html",
          checkedOn: "2026-09-14",
          note: "Jowett translation. Paragraph-opening locators refer directly to this unnumbered web edition. These details are claims within the dialogue, not independently established events.",
        },
      ],
    }),
  ),
];

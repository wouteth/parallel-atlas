import { bookExpansionSources } from "./research/book-expansion.ts";
import { v04Sources } from "./research/v04.ts";
import type { Source } from "./types";
import { mainstreamSources } from "./research/mainstream.ts";
import { bibleSources } from "./research/bible.ts";
import { alternativeSources } from "./research/alternative.ts";
import { symbolSources } from "./research/symbols.ts";
import { worldSources } from "./research/world-sites.ts";
import { exodusSources } from "./research/exodus.ts";
import { climateSources } from "./research/climate.ts";
import { requestedAuthorSources } from "./research/requested-authors.ts";
import { norseTerraSources } from "./research/norse-terra.ts";
import { hinduSources } from "./research/hindu.ts";
import { scienceExpansionSources } from "./research/science-expansion.ts";

const commerce = {
  authorStoreUrl: null,
  publisherStoreUrl: null,
  affiliateDisclosure: null,
};
export const sources: Source[] = [
  ...v04Sources,
  {
    id: "unesco-gobekli",
    title: "Göbekli Tepe: World Heritage listing",
    author: "UNESCO World Heritage Centre",
    url: "https://whc.unesco.org/en/list/1572/",
    commerce,
  },
  {
    id: "genesis",
    title: "Genesis",
    author: "The Hebrew Bible",
    url: "https://www.biblegateway.com/passage/?search=Genesis%206-9&version=KJV",
    commerce,
  },
  {
    id: "urantia",
    title: "The Urantia Book",
    author: "Published by Urantia Foundation",
    url: "https://www.urantia.org/urantia-book",
    commerce,
  },
  {
    id: "ra",
    title: "The Ra Contact / The Law of One",
    author: "Don Elkins, Carla Rueckert & Jim McCarty",
    url: "https://www.lawofone.info/",
    commerce,
  },
  {
    id: "timaeus",
    title: "Timaeus",
    author: "Plato · translation by Benjamin Jowett",
    url: "https://classics.mit.edu/Plato/timaeus.html",
    commerce,
  },
  {
    id: "critias",
    title: "Critias",
    author: "Plato · translation by Benjamin Jowett",
    url: "https://classics.mit.edu/Plato/critias.html",
    commerce,
  },
];
sources.push(
  ...bookExpansionSources,
  ...scienceExpansionSources,
  ...requestedAuthorSources,
  ...norseTerraSources,
  ...hinduSources,
  ...mainstreamSources,
  ...bibleSources,
  ...alternativeSources,
  ...symbolSources,
  ...worldSources,
  ...exodusSources,
  ...climateSources,
);
export const sourceById = Object.fromEntries(
  sources.map((source) => [source.id, source]),
);
export const supportConfig = {
  patreonUrl: null as string | null,
  merchandiseUrl: null as string | null,
  whitePaperUrl: null as string | null,
};

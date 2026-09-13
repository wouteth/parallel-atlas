import type { AtlasEvent } from "./types";
export const imageInfo: Record<
  AtlasEvent["image"],
  { alt: string; credit: string; documentary: boolean }
> = {
  ruins: {
    alt: "Illustrative Roman architecture; not the site described in this entry",
    credit:
      "Illustrative stock photograph · Unsplash · see README image credits.",
    documentary: false,
  },
  ocean: {
    alt: "Illustrative coastal landscape; not a reconstruction of the event",
    credit:
      "Illustrative stock photograph · Unsplash · see README image credits.",
    documentary: false,
  },
  manuscript: {
    alt: "Illustrative bookshelves; not the cited manuscript",
    credit:
      "Illustrative stock photograph · Unsplash · see README image credits.",
    documentary: false,
  },
  ankh: {
    alt: "Faience ceremonial ankh, Met object 30.8.29",
    credit:
      "The Metropolitan Museum of Art · 30.8.29 · public domain. Theodore M. Davis Collection, Bequest of Theodore M. Davis, 1915.",
    documentary: true,
  },
  cross: {
    alt: "Syrian silver processional cross, Met object 50.5.3, including modern restoration",
    credit:
      "The Metropolitan Museum of Art · 50.5.3 · public domain. Fletcher Fund, 1950.",
    documentary: true,
  },
};

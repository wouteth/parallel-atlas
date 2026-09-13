import { mkdir, writeFile } from "node:fs/promises";
import { events } from "../src/data/events.ts";
import { buildCatalogExport } from "../src/lib/catalog.ts";

const directory = new URL("../content/", import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(
  new URL("catalog.json", directory),
  `${JSON.stringify(buildCatalogExport(events), null, 2)}\n`,
);
console.log(
  `Exported ${events.length} records and their reference collections to content/catalog.json`,
);

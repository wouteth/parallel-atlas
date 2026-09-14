# Adding content

The source of truth is `src/data/`. TypeScript contracts are in `types.ts`; the integrity test rejects broken topic, symbol, source, track, and event references.

## Event checklist

1. Add or reuse a source record with its author, title, canonical reading URL, and commerce fields.
2. Give each event a permanent URL-safe ID. Renaming IDs breaks shared links.
3. Choose the source's track and evidence category. The category describes the basis of the account, not its popularity.
4. Add a specific passage/chapter/section/page locator and a source URL. Include edition/translator details where relevant. A citation to a narrative does not automatically support an inferred calendar date.
5. Supply `year` (or `null` for an unplaced account), `dateBasis`, `approximate`, and optionally `dateLabel` / `endYear`. Internal years use astronomical numbering: 1 BCE = 0, 9600 BCE = -9599, 1981 CE = 1981. Convert a BCE year `N` with `1 - N`. Do not use JavaScript `Date` for ancient calendar placement.
6. Add `topicIds` and `symbolIds`. Both reference pages derive their incoming event lists from these same IDs, so there is no second link inventory to maintain.
7. Select or extend the image record; include attribution and explain whether it is documentary or illustrative. `Picture.tsx` currently selects among three stock images, two public-domain museum photographs, and an SVG fallback.
8. Run `pnpm test` and `pnpm build`.

`endYear` supplies a reported date range. The visualization keeps overlapping ranges visible, clips their displayed segments to the viewport, and connects the featured entry at its visible starting point. A cluster only draws the featured entry’s range; open the cluster to inspect the other entries. Explain whether a range describes a period of use, a construction window, or another dating convention. Dedicated uncertainty bands require explicit uncertainty semantics; do not infer them from `endYear`.

For a mainstream comparison gap, use `kind: 'Editorial gap'`, an explicit `gap.forEventIds` list, and an explanation. These labels are dataset/editorial metadata. They must not turn absence of a row into evidence of deliberate suppression.

The alternative track includes author-synopsis and publication entries for Hancock, chapter-level Donnelly entries, and a Carlson episode discovery record. Each citation states the level actually checked. Do not invent print page numbers or transcript timestamps. Add curated content under `src/data/research/` and run `pnpm export:data` after editing it.

The comparison page derives suggestions from shared specific topic IDs and prioritizes other tracks. Tag a record only when the topic is relevant; shared tags create a reading path, not a statement that events are identical. The climate collection distinguishes `Climate record` horizons, scientific papers, and attributed impact hypotheses. A paper’s publication year must never substitute for the date of the physical event it discusses.

## Date conventions

“Years ago” uses the current UTC calendar year, not the scientific BP convention. Source-relative ages use the date of the source: session 10.15's 10,821 years before 1981 becomes astronomical -8840, displayed as 8841 BCE. A source's exact-looking number does not imply an exact archaeological date. Date grids automatically become finer as pixel density allows; that is a navigation affordance only.

GICC05 ages in this edition are explicitly **b2k**, measured before 2000 CE: `year = 2000 - age`. For example, 12,896 b2k becomes astronomical -10,896, displayed as 10,897 BCE. Scientific calibrated BP usually uses 1950; do not subtract a b2k age from that anchor or from today. Keep the cited chronology version, reported counting error, and bias limitations attached to the date. The datum within the 8.2 ka cold event is not labeled as its onset.

`FULL_RANGE` and `INITIAL_RANGE` in `src/lib/time.ts` define the supported display bounds and initial view. The current lower bound is astronomical year −1,000,000,000,000. Automatic million- and billion-year steps support the broad view; annual navigation remains available at maximum zoom, including older dates. Do not silently move source-age anchors when the app's current year changes.

## Symbols

The structured `historicalUsage` array has one record per cultural/era context. Unresearched contexts start with `status: 'To be researched'`; nine initial contexts have sourced fields. Populate culture, era, region, meaning, and citations together, then mark the record reviewed. Add contexts rather than overwriting another culture's usage. Religious swastika contexts and Nazi appropriation have separate records. Templar forms still require artifact-specific identification.

## Commerce

Set `source.commerce.authorStoreUrl` only after verifying it is operated by the author or their estate. Use `publisherStoreUrl` for publisher sales; never mislabel those as author-direct. `affiliateDisclosure` should be rendered alongside any future affiliate link. All commerce values are currently null. Configure project-level links in `supportConfig`; the interface replaces the relevant “coming later” status when a URL is provided. No checkout implementation or payment credential is included.

## Comparative research in 0.4

`src/data/comparative.ts` holds explicit account groups, graph nodes and connections, disagreements, geographic records, quests and project history. Keep permanent IDs and regenerate `content/catalog.json` (schema 4).

Account counts deduplicate track IDs and cited source IDs. They exclude editorial gaps and count only explicit group membership; broad topic tags do not establish a shared event. Flood groups compare motifs and must say so. A source count does not establish source independence. Add reviewed groups as coverage grows.

Each graph edge lists its actual similarity points, structural/contextual analysis, limitations, status and confidence label. The displayed number is derived from the points array. Never count a repeated phrasing as a second point. Terra Papers nodes now link to passages in a labeled transcription. Original printed-edition collation remains pending; do not turn checked transcription attribution into a claim of independent historical verification.

Each map record states a geographic basis. Documented sites and approximate narrative regions use different marker treatments. Unlocated or fictional settings have null coordinates. Modern coastlines do not represent historical coastlines; do not give Atlantis an arbitrary pin. Link coordinate provenance to the listing or source passage.

New tracks have explicit candidate/to-add status where applicable. Durations in Law of One 76.13–14 are not converted into absolute starting dates. Tolkien is labeled literary fiction. Discovery records using a synopsis must disclose that limitation. Curator notes are attributed personal perspectives, not replacements for event citations.

## Static specialist notes

Add reviewed contributions in `src/data/curator-notes.ts`, keyed by a valid track ID, with author, body and ISO update date. They are read-only, bundled into the build and included in catalog exports. Do not invent contributors or add a visitor editing workflow.

## Expanded track sources (0.4.5)

The requested-author, Norse/Terra, Hindu, deep-time and science expansion files contain the new records. Citation notes distinguish full text passages, official editorial/book synopses, and third-party transcriptions. Do not silently remove those qualifiers. See [the coverage audit](v0.4-status.md) for counts and gaps.

Sitchin’s chart switches from unanchored “Years Ago” to explicit BCE sections; only the latter are plotted. Hindu yuga lengths are durations, and Tolkien’s ages are fictional calendars. For these records, the account card displays the internal date label while year remains null.

## Book inventories

Maintain stable book and section IDs in `books.ts` / `book-sections.ts`. A table of contents, a downloaded text and a mapped citation represent different stages of work. Set a book `review` only after reading all sections and explicitly mapping each to reviewed accounts or a justified exclusion. Never infer full review from a nonzero count. Keep edition omissions and access limitations visible. Do not add chapter headings as dated events or substitute a third-party chronology for book-wide coverage. The underlying downloaded files stay outside version control and deployment.

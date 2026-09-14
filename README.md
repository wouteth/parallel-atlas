# Project Timeline — 0.4.8

A read-only, static research tool for comparing accounts of the past. The collection contains 391 records, 97 sources, 71 glossary topics and 14 symbols with nine sourced cultural contexts. This is a standalone personal project owned by `wouteth`, with repository `wouteth/parallel-atlas` and its own dependency catalog and lockfile.

## Run locally

Use **Node.js 24** and **pnpm 10**:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open **http://127.0.0.1:4317**. No database, credentials, environment variables or application server are required.

```sh
pnpm test         # Date math, content integrity, layout and comparison checks
pnpm build        # Strict TypeScript check and static production build
pnpm preview      # Serve dist/ locally on port 4317
pnpm export:data  # Regenerate the portable content/catalog.json
pnpm exec playwright install chromium
pnpm test:browser # Build, then test dist/ on port 4319 with no backend
```

## Read-only behavior

Visitors can search, filter, select tracks, change dates, zoom/pan, open citations and images, compare records, explore maps/graphs and download the displayed catalog. These actions change only the current view. URL parameters preserve a view when shared or reloaded.

Search identifies matches on unselected tracks and offers an all-track account list while preserving the selected comparison. Book passages open over the section list, keeping expanded sections, pagination, scroll position and keyboard focus when closed. Source searches are shareable and survive reload and Back navigation.

There are no user accounts, login, bookmarks, favorites, saved track combinations, content-editing forms, publishing controls or write APIs. The app does not read or write browser storage or a browser database. Existing browser data from older editions is untouched. The only application fetch loads the bundled geographic basemap; no API is contacted. Source links lead to external sites. Fonts use the system font stack; there are no font-service requests.

Research content and specialist notes are reviewed repository files. Changes reach visitors through a new static build and deployment.

## Included research tools

- Twelve source tracks, with seven dated tracks initially selected. Every requested track has content; Terra Papers and Sitchin retain candidate status. Track colors remain pastel/earth tones.
- Desktop: tightly grouped horizontal stripes, larger event cards and searchable clusters. At 700px or narrower: two separate vertical tracks; selecting an occupied side swaps them.
- Shared calendar/elapsed-year markers, automatic granularity, deep time, custom BCE/CE windows, date presets and fit-results. Sideways trackpad scrolling, Shift + wheel and dragging (including from cards) pan the desktop timeline. Vertical scrolling moves the page; Ctrl/⌘ + wheel zooms. Limits are labeled and unavailable controls disabled. Mobile Move timeline enables drag/pinch mode. Keyboard controls remain available.
- Search by topic, author, event and citation; evidence/region/source/track filters; topic shortcuts; dated and undated account lists; ordering, incremental loading and JSON export. Here “account” means a source narrative, not a user login.
- Two-record comparisons with passage citations and shareable links. Uncertain dates, narrative chronologies, interval ends and undated records retain explicit provenance.
- Glossary with 71 topics and a separate 14-entry Symbol Encyclopedia with cultural-usage records.
- Methodology, mission, What Would Change, research quests, volunteer specialist roles and public changelog.
- D3 connections graph with numbered similarity points; explicit source counts and reviewed disagreements. Counts are not credibility scores.
- World map with regional focus, selectable nearby controls anchored to recorded coordinates, and an unlocated list. Modern coastlines are reference geography.
- Author-direct source links and unconfigured support/white-paper fields. No purchasing or subscription flow is built into this site.

## Project structure

```text
src/
  data/                  # Events, sources, tracks, glossary and symbols
    comparative.ts       # Graph, map, groups, quests, disagreements, changelog
    curator-notes.ts     # Reviewed, attributed specialist contributions
    research/            # Source-specific research collections
  components/            # Timeline, event details, images and read-only notes
  pages/                 # Timeline, comparison and reference pages
  lib/                   # Date math, layout, search, routing and export
  styles.css             # Pastel design and common layouts
  ux.css                 # Research workspace and responsive controls
public/                  # Bundled images and Natural Earth basemap
content/catalog.json     # Generated portable catalog, schema 4
tools/export-content.mjs # Content export command
tests/browser/           # Static production browser tests
vercel.json              # Vite static deployment settings
```

React 19 and TypeScript provide the content model and UI. Radix Themes supplies buttons, text fields, navigation menus and accessible dialogs. Shared wrappers live in `src/components/ui/Controls.tsx`; `src/design-system.css` defines the common typography, spacing and appearance. Selects, checkboxes, segmented controls, cards, badges, icons and tooltips also use Radix. Expandable sections use Radix Collapsible. D3 surfaces keep their specialized interactions. Vite produces `dist/`; D3 supplies timeline scales, graph layout and geographic projection. Tailwind utilities supplement CSS. All content ships as static assets. There is no runtime server or authentication dependency.

## Content editing

Edit `src/data/` and follow [the content guide](docs/content-guide.md). Preserve permanent event IDs, passage-level citations and explicit dating provenance. Regenerate the catalog with `pnpm export:data` after content changes.

Add genuine specialist contributions to `src/data/curator-notes.ts`, keyed by track ID, with `author`, `body` and `updated` (YYYY-MM-DD). It is intentionally empty until reviewed contributions arrive. Notes appear in event details and on the collaborators page. They are bundled in the static build and catalog export; visitors cannot edit them.

## Routes and sharing

- `#/timeline`: research workspace; search, filters, track selection and dates live in the query.
- `#/timeline/event/plato-atlantis`: a source record.
- `#/timeline?focus=urantia-adam-arrival`: focus a dated event.
- `#/timeline?tracks=bible,hindu,urantia`: apply a selection; mobile uses its first two tracks.
- `#/compare?left=plato-atlantis&right=ra-atlantis`: compare two source records.
- `#/sources`, `#/glossary`, `#/symbols`, `#/map`, `#/connections`: reference tools.
- `#/mission`, `#/methodology`, `#/quests`, `#/what-would-change`, `#/collaborators`, `#/changelog`: project and research pages.

The former personal-library, account and saved-combinations routes are retired. Hash routes require no SPA rewrite on the host.

## Static deployment on Vercel

The local 0.4.8 build uses the Project Timeline name. The public deployment remains at 0.4.7 until the next authorized release; repository and hosting addresses below retain their existing slugs.

The current pre-launch sharing build is live at **https://parallel-atlas-ten.vercel.app**, in the personal `wouteths-projects` workspace, project `parallel-atlas`. It was deployed directly from the working tree with the owner's authorization on September 14, 2026. The URL opens without a Vercel login. No custom domain or GitHub push was used.

For a later owner-authorized deployment from this checkout, use `vercel deploy --prod --scope wouteths-projects --project parallel-atlas --yes`. Always specify the personal scope: the CLI's global default may point to another workspace. `.vercelignore` limits uploads to application build inputs and excludes local data, credentials, tests, research downloads and browser artifacts.

Commit/push the intended release, then import `wouteth/parallel-atlas` into your personal Vercel project. Use the repository root, Vite preset and Node 24. `vercel.json` pins the install command to pnpm 10.26.2, builds with `npm run build` and publishes only `dist/`. No environment variables or functions are needed. Do not use `pnpm start` as a Vercel runtime command: start/preview are local smoke-test servers only.

Any static host can serve `dist/`. Local browser tests serve the same output with no backend and check for API requests, non-read requests, browser-storage writes and retired editing controls. Vercel Hobby is for personal, non-commercial use; review its terms before monetizing.

Exclude `.env`, `.vercel/`, local data, dependencies, builds, browser state and temporary downloads from version control and portable source exports. Any old ignored database files are not loaded, shipped or modified by this edition.

## Source and image credits

Every event carries a passage or section reference. See [the research log](docs/research-log.md) for coverage and outstanding verification. The collection combines institutional records, primary texts, author synopses, and explicitly limited discovery records. Genesis passages without calendar dates remain unplaced; the earlier unverified Ussher placement has been removed. A source check verifies attribution, not that a narrative happened.

Museum photographs in this edition are public domain: `ankh.jpg` depicts [Met object 30.8.29](https://www.metmuseum.org/art/collection/search/544840), Theodore M. Davis Collection, Bequest of Theodore M. Davis, 1915; `cross.jpg` depicts [Met object 50.5.3](https://www.metmuseum.org/art/collection/search/468349), Fletcher Fund, 1950, including modern restoration. Captions distinguish these object photographs from illustrative stock images.

`content/catalog.json` contains events and all reference collections. It is a generated handoff file; edit the TypeScript collections and run `pnpm export:data` to update it. Browser downloads use the same schema, with the current result set and reference collections.

The bundled photographs are illustrative stock, **not photographs or reconstructions of the named events**. In particular, `ruins.jpg` shows Roman architecture and must be replaced with properly licensed site-specific photography before an editorial launch. Source asset URLs:

- `ruins.jpg`: https://images.unsplash.com/photo-1552832230-c0197dd311b5
- `ocean.jpg`: https://images.unsplash.com/photo-1518837695005-2083093ee35b
- `manuscript.jpg`: https://images.unsplash.com/photo-1507842217343-583bb7270b66 (a library interior)

The favicon and SVG fallback are project assets. The interface uses system sans-serif fonts without an external font service.

## License

Original project code and documentation use the [MIT license](LICENSE). [NOTICE.md](NOTICE.md) preserves third-party text, image, font and dependency rights. The repository remains private until the owner authorizes publication.

## Related projects

See [the history comparison and agent research notes](docs/related-projects.md) for verified product descriptions and potential references. No external agent service is part of this static app.

## Book coverage inventory (0.4.6)

`src/data/books.ts`, `book-types.ts` and `book-sections.ts` define the finite edition inventory. `#/books` searches books and section headings, filters by track and access, and links both source passages and catalog accounts. Search/filter state is in the URL. It contains 98 books/volumes and 2,169 section references; these are **not 2,169 additional events**. Current catalog: 391 records and 97 sources.

Only the surviving Critias currently has a completed narrative review. Poetic Edda has entries spanning all 35 pieces, with further passages still to index. The larger online texts remain partly extracted. Books without a verified readable edition are skipped and identified, as requested. See the research log for exact edition limits.

# Parallel Atlas

An exportable, responsive research atlas for comparing accounts of the past. This edition contains 205 records, 78 sources, 62 glossary topics, and 14 symbols with nine sourced cultural contexts. Copy this entire folder to your engineer's machine; it has its own dependency catalog and lockfile and requires nothing from the parent repository.

## Run locally

Install **Node.js 24+** and **pnpm 10**, then run these commands inside this folder:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open **http://127.0.0.1:4317**. In a second terminal, start the account API:

```sh
pnpm dev:server
```

The timeline, reference sections, images, and browser bookmarks work without credentials. The API starts without an identity provider and reports that account sign-in is not configured. It never pretends a guest is authenticated.

```sh
pnpm test       # Date math, content integrity, API access, persistence isolation
pnpm build      # Strict TypeScript check and production frontend build
pnpm export:data # Refresh the portable content/catalog.json
pnpm exec playwright install chromium
pnpm test:browser # Repeatable desktop and mobile behavior checks
```

For a production-build smoke check, set `APP_ORIGIN=http://127.0.0.1:4318` in `.env`, run `pnpm build`, then `pnpm start` and open port 4318. `pnpm preview` serves only the frontend build; use `pnpm start` to exercise the API with the build.

## Included behavior

- Six configurable source tracks: mainstream gray, Bible orange, Urantia blue, Law of One lavender, Plato sage, and alternative research terracotta.
- Desktop horizontal visualization: six closely grouped stripes with connected event thumbnails. On screens 700px or narrower, exactly two selected tracks appear as distinct vertical lines. Selecting a track already on the other side swaps them.
- Shared time markers, automatic 1 / 100 / 1,000 / 5,000-year spacing, calendar and elapsed-year labels, pointer-centered wheel zoom, drag pan, pinch zoom, keyboard controls, and reset. Annual detail is available within the most recent 10,000 years. Approximate events retain their uncertainty at every zoom level.
- Separate, visible mainstream Atlantis gap label: **“Ignored by mainstream history.”** Expanded context explains this as an editorial comparison label, not a claim that scholars never study Atlantis.
- Search by topic, author, event, description, and citation locator; filter by evidence type, region, source, and track. A comparison grid includes every source track. The complete catalog supports dated/undated views, ordering, incremental loading, and JSON export.
- A dedicated comparison page places any two entries’ claims, dates, dating basis, and citations side by side. It supports searchable choices, related-account suggestions, and shareable links that preserve the selected pair.
- Historical periods remain visible when their start falls outside the current window. Thicker segments display the featured entry’s reported range; uncertainty and occupation periods remain distinguished in its dating note.
- Clickable/tappable photographs, event dialogs, a larger image lightbox, passage citations, and glossary connections in both directions.
- Glossary with 62 entries, including Atlantis, Plato, Graham Hancock, Randall Carlson, Exodus, African kingdoms, Maya cities, and climate chronology.
- Separate Symbol Encyclopedia with 14 entries. Each has typed cultural-usage records for culture, era, region, meaning, citations, and research status. Templar and Maltese diagrams are distinct; the Star of David diagram includes the flag's blue stripes.
- Mission page and a separate white-paper outline, ready for the project's authors.
- Bookmarks and favorites that persist locally for guests; an OIDC account integration and SQLite-backed libraries for signed-in users.
- Author-direct purchase fields on every source and nullable Patreon, merchandise, and white-paper URLs. No purchase, subscription, or payment is initiated by this scaffold.

## Folder structure

```text
parallel-atlas/
├── README.md
├── HANDOFF.md
├── package.json
├── pnpm-workspace.yaml         # Standalone dependency catalog
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .env.example
├── docs/
│   ├── white-paper.md
│   ├── research-log.md
│   └── content-guide.md
├── content/catalog.json       # Portable event and reference data
├── tools/export-content.mjs
├── playwright.config.ts
├── tests/browser/atlas.spec.ts
├── public/
│   ├── favicon.svg
│   └── images/                 # Bundled photos and original SVG fallback
├── src/
│   ├── main.tsx
│   ├── App.tsx                 # Navigation and page routing
│   ├── styles.css              # Responsive design and color tokens
│   ├── components/
│   │   ├── Timeline.tsx        # SVG scale, gestures, separate tracks
│   │   ├── EventCard.tsx
│   │   ├── EventDetail.tsx     # Sources, dates, saves, lightbox
│   │   ├── Modal.tsx
│   │   ├── Picture.tsx
│   │   └── Icon.tsx
│   ├── pages/
│   │   ├── timeline/TimelinePage.tsx
│   │   ├── compare/ComparePage.tsx
│   │   ├── glossary/GlossaryPage.tsx
│   │   ├── symbols/SymbolsPage.tsx
│   │   ├── sources/SourcesPage.tsx
│   │   ├── mission/MissionPage.tsx
│   │   └── library/LibraryPage.tsx
│   ├── data/
│   │   ├── types.ts            # Public content contracts
│   │   ├── research/           # Curated collections separated by track
│   │   ├── images.ts           # Descriptions and image rights
│   │   ├── tracks.ts
│   │   ├── events.ts
│   │   ├── glossary.ts
│   │   ├── symbols.ts
│   │   └── sources.ts          # Citations and future commerce
│   └── lib/
│       ├── catalog.ts          # Search, ordering, portable export
│       ├── catalog.test.ts
│       ├── layout.ts           # Bounded clustering on separate tracks
│       ├── layout.test.ts
│       ├── time.ts
│       ├── time.test.ts
│       ├── content.test.ts
│       ├── router.ts
│       └── library.tsx         # Guest/account persistence boundary
└── server/
    ├── index.mjs               # Node HTTP server and startup
    ├── app.mjs                 # OIDC, API, static production files
    ├── app.test.mjs
    ├── store.mjs               # SQLite storage and sessions
    └── store.test.mjs
```

## Technology choices

React 19 and strict TypeScript provide the component and content model. Vite builds a small client bundle. Native SVG and Pointer Events implement the timeline: there is one numeric scale, reused across every track, with no date-library or visualization-library interpretation of ancient dates. CSS custom properties and media queries implement the visual system; a CSS framework is not required. Node's HTTP and SQLite APIs keep the server portable. `openid-client` handles the OIDC protocol rather than a custom password implementation.

Dependencies follow the parent repository's catalog versions, copied into this standalone folder. The lockfile makes the exported project reproducible. Dependency modernization can happen independently after handoff.

The timeline now spans 100,000 BCE to the current year. Additional 10,000- and 50,000-year steps keep the broad view readable. Annual navigation is available at maximum zoom even for older dates; an approximate source remains approximate at any zoom.

## Routes

Use `#/compare?left=plato-atlantis&right=ra-atlantis` for a shareable two-account comparison. The Compare navigation link opens an initial pair; selectors can choose any record.

Hash routes work on ordinary static hosting without rewrite rules:

| URL fragment                            | Page                                       |
| --------------------------------------- | ------------------------------------------ |
| `#/timeline`                            | Timeline                                   |
| `#/timeline/event/plato-atlantis`       | Expanded event                             |
| `#/timeline?topic=atlantis`             | Topic comparison                           |
| `#/timeline?focus=urantia-adam-arrival` | Focused date window                        |
| `#/sources`                             | Searchable source index                    |
| `#/timeline?source=ra`                  | Accounts citing a source                   |
| `#/glossary` / `#/glossary/atlantis`    | Glossary index / entry                     |
| `#/symbols` / `#/symbols/star-of-david` | Encyclopedia index / entry                 |
| `#/mission`                             | Mission, methodology, support placeholders |
| `#/library`                             | Bookmarks and favorites                    |
| `#/account`                             | Sign-in status and account actions         |

## Connect real accounts

1. Provision a confidential **OpenID Connect** client with the project's identity provider. Account creation/invitations remain the provider's responsibility; this app has no password or sign-up database.
2. Register the exact callback `<APP_ORIGIN>/api/auth/callback` and allow the `openid profile` scopes with authorization code + S256 PKCE. The supplied integration uses a client secret at the token endpoint; configure the provider accordingly.
3. Copy `.env.example` to `.env` and fill `OIDC_ISSUER`, `OIDC_CLIENT_ID`, and `OIDC_CLIENT_SECRET`. `APP_ORIGIN` is the browser-facing origin, without a trailing slash. The issuer must support HTTPS discovery. Production `APP_ORIGIN` must be HTTPS.
4. Restart the server. The account page now displays **Sign in securely**.
5. Test the real provider's consent, callback, expiry, logout, and second-device library flow before launch. No live provider credentials were supplied for this scaffold, so that end-to-end integration remains unverified.

The server uses validated OIDC claims, nonce/state/PKCE, single-use login flows, random HttpOnly session cookies, hashed session tokens at rest, and server-owned per-account scoping. Production cookies use the `__Host-` prefix and `Secure`. Writes require the configured browser origin. Access/refresh tokens are not persisted or returned to React. Logout revokes the local app session; it does not sign the user out of their identity provider.

Guest and account libraries are intentionally separate: signing in loads the server's library; signing out restores this browser's guest library. Existing guest bookmarks are retained and are not silently uploaded. The API currently replaces a user's library transactionally, so simultaneous writes from multiple devices are last-write-wins. Add item-level mutations or optimistic concurrency for a production sync experience.

| Endpoint                 | Behavior                                                           |
| ------------------------ | ------------------------------------------------------------------ |
| `GET /api/me`            | Public account state and sign-in availability                      |
| `GET /api/auth/login`    | Starts OIDC authorization                                          |
| `GET /api/auth/callback` | Validates authorization and creates local session                  |
| `POST /api/auth/logout`  | Revokes local session; requires same-origin request                |
| `GET /api/library`       | Authenticated user's saved items                                   |
| `PUT /api/library`       | Validates and atomically replaces authenticated user's saved items |

## Deployment

`pnpm build` creates `dist/`. `pnpm start` serves the build and API on loopback port 4318. Put it behind an HTTPS reverse proxy forwarding to that port and set `APP_ORIGIN` to the public origin. Preserve the database directory on a durable volume and back it up. A single Node process and SQLite are appropriate for this scaffold; move storage behind a managed database adapter before deploying stateless replicas. The server must ship with `server/`, `src/data/`, production dependencies, and `dist/`, because it validates saved event IDs against the same content used by the client. Node 24 runs the type-stripped seed data directly.

For a static-only deployment, publish `dist/`. Guest features work; the account API must be hosted separately behind the same origin to enable sign-in. No production deployment has been made.

## Source and image credits

Every event carries a passage or section reference. See [the research log](docs/research-log.md) for coverage and outstanding verification. The collection combines institutional records, primary texts, author synopses, and explicitly limited discovery records. Genesis passages without calendar dates remain unplaced; the earlier unverified Ussher placement has been removed. A source check verifies attribution, not that a narrative happened.

Museum photographs in this edition are public domain: `ankh.jpg` depicts [Met object 30.8.29](https://www.metmuseum.org/art/collection/search/544840), Theodore M. Davis Collection, Bequest of Theodore M. Davis, 1915; `cross.jpg` depicts [Met object 50.5.3](https://www.metmuseum.org/art/collection/search/468349), Fletcher Fund, 1950, including modern restoration. Captions distinguish these object photographs from illustrative stock images.

`content/catalog.json` contains events and all reference collections. It is a generated handoff file; edit the TypeScript collections and run `pnpm export:data` to update it. Browser downloads use the same schema, with the current result set and reference collections.

The bundled photographs are illustrative stock, **not photographs or reconstructions of the named events**. In particular, `ruins.jpg` shows Roman architecture and must be replaced with properly licensed site-specific photography before an editorial launch. Source asset URLs:

- `ruins.jpg`: https://images.unsplash.com/photo-1552832230-c0197dd311b5
- `ocean.jpg`: https://images.unsplash.com/photo-1518837695005-2083093ee35b
- `manuscript.jpg`: https://images.unsplash.com/photo-1507842217343-583bb7270b66 (a library interior)

The favicon and SVG fallback were drawn for this scaffold. Fonts are DM Sans and Instrument Serif, served through Google Fonts with system fallbacks; self-host licensed font files if the project needs fully offline presentation or no third-party font requests.

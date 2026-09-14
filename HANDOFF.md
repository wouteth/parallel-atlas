# Engineer handoff — 0.4.8

Project Timeline is a standalone public MIT-licensed project owned by `wouteth`: **https://github.com/wouteth/project-timeline**. Use Node 24 and pnpm 10. The owner authorized the repository and personal Vercel project rename, source push and deployment on September 14, 2026. Public demo: **https://project-timeline-wouteth.vercel.app**. Vercel scope: `wouteths-projects`; project: `project-timeline`. Always specify the personal scope. The original repository became public on September 14, 2026; its community guides and templates are retained.

## Current architecture

Version 0.4.8 names the application Project Timeline. UI, page titles, documentation, package name, download filename, CSS prefixes and the TimelineEvent type use the new naming. The application and external projects use Project Timeline; legacy public links are retained for compatibility. Historical references to Atlas in Plato's account remain unchanged.

Rename validation: 20 unit tests, all 27 browser checks, strict TypeScript/build and catalog export pass. The 320px browser preview shows the complete Project Timeline header without overflow. The only remaining Atlas references in application source and exported content concern the figure in Plato's text.

Latest deployment: 0.4.8, `dpl_1w7mMnEA1RdiWpDbGfugqfH6t41y`. The former 0.4.7 deployment was `dpl_4wpo6CZcPQZNijTJH5mftSbzwXkT`. No custom domain is configured.

Version 0.4.7 improves search discovery across unselected tracks, preserves book-reading context through in-place passage dialogs and retains source search queries in the URL. Book filters have a reset control. The 27-test browser suite passes, including new desktop/mobile search recovery, book dialog focus/scroll/Back/reload checks, source navigation and existing gesture/static checks; all 20 unit tests pass. Book expansion and pagination remain in memory for the mounted page; a full reload preserves filters and the open passage, but resets chapter expansion. No new historical records were added; the full-book review limitations below still apply.

The owner explicitly requested a **read-only static site**. Accounts, OIDC, SQLite, the Node API, bookmarks, favorites, local saved track combinations, publishing controls and the curator assignment script have been removed. Do not reintroduce these features without a new request.

All historical content is in `src/data/`; edits happen in the repository and take effect on rebuild. Read-only specialist notes are in `src/data/curator-notes.ts`, intentionally empty until real contributions are reviewed. They are included in schema-4 `content/catalog.json`. No user data is exported.

Visitors can search, filter, select tracks, zoom/pan, compare accounts, view sources/images and download results. View state is in memory and the URL. The app makes no API requests or browser-storage/database writes. Legacy ignored database files and old browser saves are untouched and unused.

`pnpm build` emits `dist/`. Vite serves local development/preview only. `vercel.json` configures static hosting with Node 24 and pinned pnpm installation; no environment variables or server functions are required. `pnpm test:browser` builds and serves the actual production output on port 4319, without an API or API mocks.

## Coverage and usability

391 records, 97 sources, 71 glossary topics, 14 symbols, twelve tracks, seven connections, three disagreements, five explicit narrative groups and 14 geographic records (five mapped, nine unresolved). Nine symbol contexts have reviewed sources. See [the assessment](docs/v0.4-status.md).

The 0.4.1 usability work remains: compact navigation; seven dated tracks initially selected; topic shortcuts; Timeline / Account list views; custom BCE/CE windows; searchable clusters; URL-backed exploration and modal reading-position preservation. “Account” in research screens refers to a source narrative. Desktop sideways trackpad scrolling and Shift + wheel pan without zooming; vertical wheel input scrolls the page, and Ctrl/⌘ + wheel zooms. Dragging can start on a card or its image, with a movement threshold to preserve clicks. Navigation hints appear above the canvas, date limits are labeled, and unavailable pan/zoom controls are disabled. Keyboard navigation remains; mobile scrolling is the default, with explicit Move timeline mode for drag/pinch. Custom windows have an eight-year minimum.

The map has regional focus and separated controls with short leaders to recorded coordinates. Graph labels stay readable on narrow screens through horizontal scrolling. Layout rules are in `src/ux.css`. Version 0.4.4 replaces custom common controls and overlays with Radix Themes buttons, text fields, dropdown menus and dialogs. Shared control defaults are in `src/components/ui/Controls.tsx`; `src/design-system.css` applies consistent neutral surfaces, typography, sizing and radii to the timeline layouts. Selects, checkboxes, segmented controls, cards, badges, icons, tooltips and expandable sections now use Radix too; timeline cards and D3 gestures retain their specialized layouts. Obsolete control CSS and the second icon library were removed. Dialog focus, keyboard menus, select navigation, track checkboxes, segmented controls and disclosure toggles are covered by browser checks. Removed slogans, empty specialist-note panels, shop placeholders and Google Fonts.

Version 0.4.5 adds 131 records, populates all requested tracks, and documents source/edition limits in the coverage audit. Source-page links include undated tracks, and account cards display internal chronology labels. The expanded graph sizes its bounds from node positions and routes vertical links around intervening nodes.

## Validation

Verified: 20 unit tests, 27 browser checks against the production build, strict TypeScript/build and schema-4 export all pass. Browser checks cover production asset loading, search/filter/navigation, citations/images, desktop/mobile geometry, horizontal and Shift-wheel panning, wheel delta units, card dragging versus clicking, navigation limits, emulated touch pan/pinch and page scrolling, custom dates, view restoration, graph/map interaction, absence of write requests and browser-storage writes, and retired personal routes. The gesture tests were rerun after waiting for font loading to stabilize the page-scroll assertion. Vercel also built successfully. No physical touch-device or screen-reader validation is claimed.

## Remaining content and launch work

1. Collate original Terra Papers and Sitchin editions; replace synopsis-level Val Ellam/Tolkien records with reviewed book passages where available; expand beyond the currently indexed texts.
2. Review speculative graph links, source-count membership and genuinely incompatible claims.
3. Find the original Carlson recording and distinguish the separate catastrophe chronologies. Ragnarok still has no supported absolute date.
4. Supply Filipe’s white paper, team/recruitment contact, reviewed specialist contributions and source/support links.
5. Test physical touch devices and screen readers; collect feedback on the public demo before a full launch.

MIT licensing covers original code; NOTICE preserves third-party rights. Credentials, old data files, dependencies, build output, browser state and temporary downloads remain excluded from source exports. The older external ZIP has not been refreshed.

## Book inventory and remaining review (0.4.6)

Added `#/books`: 98 books/volumes and 2,169 online section links, with query/track/access filters in the URL. All 66 KJV books, 196 Urantia papers plus Foreword, 106 Ra sessions and 126 Vishnu Purana chapters are represented in the inventory. The Poetic Edda now has 35 cited passage records, spanning all pieces in Bellows’s edition. Twelve added Critias records complete the narrative review of the surviving dialogue. Total catalog: 391 records, 97 sources; Norse 58 records, Plato 22. Schema 4 includes the book inventory.

**This is not exhaustive event extraction across all books.** Most sections still require review. Keep metadata inventories, mapped passages and whole-narrative review distinct. Anderson’s Prose Edda and Eggeling’s Satapatha edition have omissions; book cards document them. Skipped books retain their existing synopsis/transcription notes. The readable 12th Planet PDF and scanned Terra Papers PDF require collation; do not count their discovery as full review. Raw downloads are ignored and excluded from deployment.

Validation for 0.4.6: 20 unit tests pass; 24 existing browser checks passed, and the new desktop/mobile book check passed after correcting its test selector (25 total). Strict TypeScript/build and schema-4 export pass. Production alias returned HTTP 200 without authentication; live browser confirmed the Poetic Edda coverage card, 35 sections and the 0.4.6 footer. Deployment: `dpl_EzPSBh5S2FJVMEGxY94JKGdiVkMb`.

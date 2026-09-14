# Engineer handoff

This is a standalone open-source project at `D:\Dev\Repositories\parallel-atlas`, owned by `wouteth`. Its public remote is `https://github.com/wouteth/parallel-atlas`. It has no dependencies on another project's packages or services.

The remote was created privately on September 13, 2026, then made public with the owner's authorization on September 14, 2026. Original code and documentation are MIT-licensed; third-party materials retain their own terms. The working copy stays on the D: development drive. The portable ZIP is next to the project at `D:\Dev\Repositories\parallel-atlas.zip` and may predate repository updates. Future pushes require authorization within the requested task's scope.

## Validation completed

- `pnpm build` passes strict TypeScript checking and creates the production bundle.
- `pnpm test` covers calendar boundaries, zoom tiers, limits, search, source links, dense layout packing, account isolation, single-use OIDC state, and authenticated API persistence.
- Research-edition verification: all 13 unit/integration tests and eight browser behavior checks pass. The production JavaScript bundle is approximately 109 KB gzipped. New checks exercise pair selection and sharing, stale comparison links, scientific age anchors, and partially visible date ranges.
- Browser-checked at 1280px desktop and 390px mobile: six tightly grouped horizontal tracks; two separate vertical tracks with different x-coordinates and colors; track selection changes the correct event list; no horizontal overflow at those sizes; no event-card overlaps in the initial views.
- Browser-checked event dialogs, source passages, image enlargement, local bookmark persistence across reload, topic search, six-way comparison including absent entries, glossary content, and the Symbol Encyclopedia index.
- Browser-checked 1, 100, 1,000, and 5,000-year marker states. Annual markers display distinct full elapsed-year counts.
- No application console errors were observed during those checks. React StrictMode intentionally cancels the first account-state request in development; that canceled request is not an application failure.

## Complete in the scaffold

The requested pages, responsive timeline behavior, typed data structures, source links, local saved items, OIDC account wiring, database adapter, and future-commerce fields are implemented. `README.md` contains the full file tree, routes, startup commands, and configuration instructions. Each site section has its own folder under `src/pages/`.

## Configuration and editorial work remaining for launch

1. Connect the real OIDC provider and run its live login/callback/logout/second-device flow. This requires credentials not supplied with the request. API tests cover local access rules and persistence; they do not prove an external provider's configuration.
2. Continue the documented research priorities in `docs/research-log.md`. The collection now contains 205 records, 78 sources, 62 glossary topics, and nine sourced symbol contexts. Eighty-three records remain deliberately unplaced. Source-specific limitations appear in their citations and date notes.
3. Expand the documentary image collection. Two museum objects now have public-domain photographs and credits. Other photos are explicitly illustrative; the stock archaeology image is Roman architecture, not Göbekli Tepe.
4. Supply the white paper, project team information, and real author-direct / Patreon / merchandise URLs. The source repository is public; payments and a hosted application remain unconfigured.
5. Configure HTTPS, durable database storage, backups, account data export/deletion, monitoring, and suitable rate limiting before a public launch. The server is one process with SQLite; concurrent library updates currently use last-write-wins replacement.
6. Test on physical touch devices and with screen readers before launch. Keyboard, reduced-motion, native dialog focus containment, and responsive layouts are implemented. This scaffold has not had a full accessibility audit.

## Natural next extensions

- Replace local content modules with an editorial CMS while keeping permanent IDs and typed contracts.
- `src/lib/layout.ts` now clusters bounded cells separately for each track. Stress tests conserve every visible event across 600 synthetic records, several viewport widths, and multiple date windows. Profile rendering before increasing the collection into many thousands of records.
- Add structured interval semantics and explicit uncertainty visualization. Reported `endYear` ranges now render for featured entries, clipped to the viewport, and overlapping periods remain in their track’s cluster. The date note distinguishes an occupation period from a construction window; neither is silently treated as a probability distribution.
- The current range extends to 100,000 BCE, with additional 10,000- and 50,000-year marker steps. Extend it deliberately if older records are added.
- Replace the library's whole-list PUT with item mutations or version checks for concurrent device editing.

The ZIP intentionally excludes installed dependencies, generated builds, local databases, credentials, and test-browser state. Install from the included lockfile to reproduce the project.

## Research-edition additions

`src/data/research/` separates the curated collections by track. `src/pages/sources/` provides a source index. The catalog supports unaccented multiword search, source and region filters, dated/undated views, ordering, incremental loading, and JSON export. `content/catalog.json` is the portable data handoff, including all reference collections; regenerate it with `pnpm export:data`.

Install browser binaries with `pnpm exec playwright install chromium`, then run `pnpm test:browser`. Tests cover catalog browsing, comparison clusters, separate mobile tracks, deep links to older events, source navigation, museum image enlargement, persistent guest bookmarks, shareable account comparisons, and overlapping date ranges. Comparison-page overflow checks cover 320, 390, 768, 1024, and 1280px widths. Four reviewed screenshots are included under `artifacts/`; traces and browser storage are excluded from the ZIP. Live OIDC-provider testing remains unverified because no provider credentials were supplied.

The new `src/pages/compare/` section supports `#/compare?left=<event-id>&right=<event-id>`. Choosing the other side’s current entry swaps the pair. Unknown IDs produce an explanatory message and a valid fallback. `src/lib/compare.ts` suggests records sharing specific topic tags, prioritizing other tracks; it excludes broad source tags and editorial gaps from suggestions. This is topic matching, not a claim of historical equivalence.

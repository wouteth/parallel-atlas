# Project Timeline

This is a standalone personal project owned by `wouteth`. Its private GitHub repository is `wouteth/parallel-atlas`. Do not introduce dependencies on Devly repositories, shared packages, authentication, or infrastructure.

Do not push code unless the user explicitly authorizes it. The owner authorized the initial push on September 13, 2026; later pushes require authorization within their task's scope.

Read `README.md` for setup and `HANDOFF.md` for current limitations. The dependency catalog and lockfile are local to this project. Use Node 24 and pnpm 10.

For application changes, run the relevant tests and `pnpm build`. Browser tests use Playwright. For content changes, preserve stable IDs, explicit dating provenance, passage-level citations, and distinctions between documented history and attributed narratives. Run `pnpm test` and regenerate `content/catalog.json` with `pnpm export:data`.

Keep credentials, SQLite databases, browser state, installed dependencies, and temporary research downloads out of version control and portable exports. This edition is read-only and static: no accounts, persistence, API or visitor mutations. Public deployment remains separate work requiring the owner's instructions.

Use Radix Themes and the shared controls in `src/components/ui/Controls.tsx` for common UI. Keep typography and visual defaults in `src/design-system.css`; avoid bespoke replacements for standard controls. Use Radix Select, Checkbox, SegmentedControl, Card, Badge, Tooltip and Collapsible alongside the shared wrappers. Custom D3 interactions and positioned timeline cards are intentional. Use plain labels and short instructions; avoid slogans, decorative headings and empty coming-soon panels. Preserve source citations and dating qualifications when editing copy.

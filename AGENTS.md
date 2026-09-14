# Parallel Atlas

This is a standalone open-source project owned by `wouteth`. Its public GitHub repository is `wouteth/parallel-atlas`. Do not introduce dependencies on other projects' repositories, shared packages, authentication, or infrastructure.

Do not push code unless the user explicitly authorizes it. The owner authorized the initial push on September 13, 2026; later pushes require authorization within their task's scope.

Read `README.md` for goals and setup, `CONTRIBUTING.md` for contribution and verification rules, and `HANDOFF.md` for current limitations. The dependency catalog and lockfile are local to this project. Use Node 24 and pnpm 10.

For application changes, run the relevant tests and `pnpm build`. Browser tests use Playwright. For content changes, preserve stable IDs, explicit dating provenance, passage-level citations, and distinctions between documented history and attributed narratives. Run `pnpm test` and regenerate `content/catalog.json` with `pnpm export:data`.

Keep credentials, SQLite databases, browser state, installed dependencies, and temporary research downloads out of version control and portable exports. Live OIDC configuration and public deployment remain separate work requiring the owner's configuration or instructions.

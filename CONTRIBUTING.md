# Contributing to Project Timeline

Help make accounts of the past easier to compare and their sources easier to inspect. Contributions to research, writing, design, accessibility, and code are welcome. Read the [project goals](README.md#project-goals) and [Code of Conduct](CODE_OF_CONDUCT.md) first.

## Choose a useful starting point

- Correct a citation, broken source link, date conversion, or image credit.
- Improve a glossary explanation with a specific supporting source.
- Reproduce a bug with a shared route and clear steps.
- Test keyboard navigation, screen readers, small screens, or touch interaction.
- Pick a focused item from the [roadmap](ROADMAP.md) or [research priorities](docs/research-log.md#next-research-passes).

Search [existing issues](https://github.com/wouteth/project-timeline/issues) and [pull requests](https://github.com/wouteth/project-timeline/pulls) before starting. Small corrections can go straight to a pull request. For a new source track, major feature, data-model change, or broad refactor, open an issue first so the maintainer can help settle scope before substantial work.

Use the [issue chooser](https://github.com/wouteth/project-timeline/issues/new/choose) for bugs, feature proposals, and research corrections. Follow [SECURITY.md](SECURITY.md) for vulnerabilities; keep exploit details out of public issues.

## Set up a development copy

Fork the repository on GitHub, clone your fork, and create a descriptive branch such as `fix/date-label` or `docs/source-citation`. Install Node.js 24+ and pnpm 10, then follow [Run locally](README.md#run-locally). Use `pnpm install --frozen-lockfile` for the initial install.

The application is static and read-only. No account credentials, environment file or backend are required. Never commit credentials, SQLite databases, browser storage, research downloads, or installed dependencies.

## Research and editorial contributions

Read [docs/content-guide.md](docs/content-guide.md) before changing the collection. Edit `src/data/`, then regenerate `content/catalog.json` with `pnpm export:data`.

- Preserve permanent IDs because shared links depend on them.
- Cite the actual passage, page, section, artifact record, or timestamp checked. State edition and translation when relevant.
- Separate an account's narrative, its proposed historical date, and the date of its composition or publication.
- Explain calendar conversions and reference years. Keep uncertainty and leave unsupported dates unplaced.
- Attribute disputed interpretations and disclose whether only an abstract, synopsis, or excerpt was available.
- Submit original summaries and material you have permission to share. Keep third-party image credits and reuse terms attached.

An accepted citation verifies attribution, not the historical truth of a narrative. Critique claims and methods respectfully, with supporting sources.

## Code and interface contributions

Follow the surrounding TypeScript and React patterns. Keep this repository independent of other projects. Use the local dependency catalog where applicable, and commit the lockfile when dependencies change.

Keep changes focused. Preserve responsive behavior, stable routes, read-only static behavior, and explicit date uncertainty. Prefer direct imports over re-export barrels. Write comments for non-obvious constraints and use commas, parentheses, or separate sentences instead of em dashes in new copy.

## Check your change

| Change                     | Verification                                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documentation or templates | Check changed-file formatting, relative links, and instructions against the repository.                                                              |
| Code                       | Run `pnpm test` and `pnpm build`; add a regression test when behavior changes.                                                                       |
| Research data              | Run `pnpm export:data`, `pnpm test`, and `pnpm build`; include the regenerated catalog.                                                              |
| User interface             | Also run `pnpm test:browser` and inspect the affected desktop and mobile flows. Install Chromium with `pnpm exec playwright install chromium` first. |

Use `pnpm exec prettier --check <changed-files>` to check formatting and `pnpm exec prettier --write <changed-files>` to fix it. Record exactly what you ran and any checks you could not perform. A passing build alone does not verify browser behavior.

## Send a pull request

1. Commit a focused change with an imperative message, for example `fix(timeline): preserve uncertain date labels` or `docs(timeline): clarify source attribution`.
2. Push your branch to your fork and open a pull request against `wouteth/project-timeline:main`.
3. Explain the problem, link related issues, describe the result, and record verification. Include screenshots for visible changes and precise citations for research changes.
4. Respond to review and update the same branch. Avoid unrelated cleanup in the PR.

The maintainer, currently [@wouteth](https://github.com/wouteth), makes merge and editorial decisions. Review timing depends on availability; there is no guaranteed response window. Proposals may be revised or declined if they exceed the current scope or lack supporting evidence.

Original contributions are submitted under the project's [MIT license](LICENSE). Identify any third-party material and its separate terms; only contribute material you are entitled to share.
